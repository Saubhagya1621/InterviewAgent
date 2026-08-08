import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { chatComplete } from "../utils/groqClient.js";
import {
  createSession,
  getSession,
  updateSession,
  hasSession,
} from "../utils/sessionStore.js";
import { selectTargetDays } from "../utils/topicSelector.js";
import { buildSystemPrompt, buildFeedbackPrompt } from "../utils/prompts.js";
import { FeedbackSchema, NextTurnSchema } from "../utils/schemas.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const curriculum = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/curriculum.json"), "utf-8")
);

const MIN_QUESTIONS = 8;
const MIN_DISTINCT_DAYS = 4;
const MAX_QUESTIONS = 14; // hard safety cap in case the LLM never signals completion

const getDayDetails = (dayNumbers) =>
  curriculum.days.filter((d) => dayNumbers.includes(d.day));

const parseJsonSafe = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const callForNextTurn = async (systemPrompt, history) => {
  let raw;
  try {
    raw = await chatComplete(
      [{ role: "system", content: systemPrompt }, ...history],
      { jsonMode: true }
    );
  } catch (err) {
    throw new ApiError(502, "The interview agent is temporarily unavailable. Please try again.");
  }

  const parsed = parseJsonSafe(raw);
  const result = NextTurnSchema.safeParse(parsed);
  if (result.success) return result.data;

  // one retry with a stricter nudge
  let retryRaw;
  try {
    retryRaw = await chatComplete(
      [
        { role: "system", content: systemPrompt },
        ...history,
        {
          role: "system",
          content: "Your last response was not valid JSON matching the required shape. Respond again with ONLY valid JSON.",
        },
      ],
      { jsonMode: true }
    );
  } catch (err) {
    throw new ApiError(502, "The interview agent is temporarily unavailable. Please try again.");
  }

  const retryParsed = parseJsonSafe(retryRaw);
  const retryResult = NextTurnSchema.safeParse(retryParsed);
  if (retryResult.success) return retryResult.data;

  throw new ApiError(502, "Interview agent failed to produce a valid response");
};

const callForFeedback = async (candidate, history, coveredDays) => {
  const transcript = history
    .map((m) => `${m.role === "user" ? "Candidate" : "Interviewer"}: ${m.content}`)
    .join("\n");

  const prompt = buildFeedbackPrompt(candidate, transcript, coveredDays);

  let raw;
  try {
    raw = await chatComplete([{ role: "system", content: prompt }], {
      jsonMode: true,
      temperature: 0.4,
    });
  } catch (err) {
    throw new ApiError(502, "Could not generate feedback right now. Please try again.");
  }

  const parsed = parseJsonSafe(raw);
  const result = FeedbackSchema.safeParse(parsed);
  if (result.success) return result.data;

  let retryRaw;
  try {
    retryRaw = await chatComplete(
      [
        { role: "system", content: prompt },
        {
          role: "system",
          content: "Your last response was not valid JSON matching the required feedback shape. Respond again with ONLY valid JSON.",
        },
      ],
      { jsonMode: true, temperature: 0.4 }
    );
  } catch (err) {
    throw new ApiError(502, "Could not generate feedback right now. Please try again.");
  }

  const retryParsed = parseJsonSafe(retryRaw);
  const retryResult = FeedbackSchema.safeParse(retryParsed);
  if (retryResult.success) return retryResult.data;

  throw new ApiError(502, "Interview agent failed to produce valid feedback");
};

const handleInterview = asyncHandler(async (req, res) => {
  const { sessionId, candidate, message } = req.body;

  if (!sessionId) {
    throw new ApiError(400, "sessionId is required");
  }

  // ---- START ----
  if (!hasSession(sessionId)) {
    if (!candidate || !candidate.member || !candidate.member.name) {
      throw new ApiError(400, "A valid candidate object with member.name is required to start a new session");
    }

    const targetDays = selectTargetDays(candidate, curriculum.days);

    if (!targetDays.length) {
      throw new ApiError(422, "No curriculum days available to interview this candidate on");
    }

    const state = createSession(sessionId, {
      candidate,
      targetDays,
      askedDays: [],
      turnCount: 0,
      history: [],
      done: false,
    });

    return res.status(200).json({
      reply: `Welcome ${candidate.member?.name ?? ""}. Let's begin your interview.`,
      done: false,
    });
  }

  // ---- CONTINUE / END ----
  const state = getSession(sessionId);

  if (state.done) {
    throw new ApiError(400, "This interview session has already ended");
  }

  if (!message) {
    throw new ApiError(400, "message is required to continue the interview");
  }

  const dayDetails = getDayDetails(state.targetDays);
  const systemPrompt = buildSystemPrompt(state.candidate, dayDetails);

  const history = [...state.history, { role: "user", content: message }];

  const enoughCoverage =
    state.turnCount >= MIN_QUESTIONS &&
    new Set(state.askedDays).size >= MIN_DISTINCT_DAYS;

  const nextTurn = await callForNextTurn(systemPrompt, history);

  const askedDays = nextTurn.coveredDay
    ? [...new Set([...state.askedDays, nextTurn.coveredDay])]
    : state.askedDays;

  const shouldEnd =
    (enoughCoverage && nextTurn.interviewComplete) || state.turnCount + 1 >= MAX_QUESTIONS;

  if (shouldEnd) {
    const finalHistory = [...history, { role: "assistant", content: nextTurn.reply }];
    const feedback = await callForFeedback(state.candidate, finalHistory, askedDays);

    updateSession(sessionId, {
      history: finalHistory,
      askedDays,
      turnCount: state.turnCount + 1,
      done: true,
    });

    return res.status(200).json({
      reply: "Interview completed.",
      done: true,
      feedback,
    });
  }

  updateSession(sessionId, {
    history: [...history, { role: "assistant", content: nextTurn.reply }],
    askedDays,
    turnCount: state.turnCount + 1,
  });

  return res.status(200).json({
    reply: nextTurn.reply,
    done: false,
  });
});

export { handleInterview };

import { z } from "zod";

const FeedbackSchema = z.object({
  summary: z.string().min(1),
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
  next: z.array(z.string()),
});

const NextTurnSchema = z.object({
  reply: z.string().min(1),
  moveToNextTopic: z.boolean(),
  coveredDay: z.number().nullable(),
  interviewComplete: z.boolean(),
});

export { FeedbackSchema, NextTurnSchema };
import { z } from "zod";

const FeedbackSchema = z.object({
  summary: z.string().min(1),
  strengths: z.array(z.string()).min(1),
  gaps: z.array(z.string()).min(1),
  next: z.array(z.string()).min(1),
});

const NextTurnSchema = z.object({
  reply: z.string().min(1),
  moveToNextTopic: z.boolean(),
  coveredDay: z.number().nullable(),
  interviewComplete: z.boolean(),
});

export { FeedbackSchema, NextTurnSchema };

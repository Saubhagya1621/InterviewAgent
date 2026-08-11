import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

/**
 * Simple chat completion wrapper.
 * messages: [{ role: "system"|"user"|"assistant", content: string }]
 *
 * Uses a 12s timeout per call. Some code paths retry once on invalid
 * JSON output, so two calls could run back-to-back — keeping each call
 * short ensures the combined worst case (~24s) stays under Render's
 * ~30s reverse-proxy timeout, which otherwise returns an opaque 502.
 */
const chatComplete = async (messages, { jsonMode = false, temperature = 0.6 } = {}) => {
  const completion = await groq.chat.completions.create(
    {
      model: MODEL,
      messages,
      temperature,
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
    },
    { timeout: 12000 }
  );

  return completion.choices[0]?.message?.content ?? "";
};

export { chatComplete };
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

/**
 * Simple chat completion wrapper.
 * messages: [{ role: "system"|"user"|"assistant", content: string }]
 */
const chatComplete = async (messages, { jsonMode = false, temperature = 0.6 } = {}) => {
  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages,
    temperature,
    ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
  });

  return completion.choices[0]?.message?.content ?? "";
};

export { chatComplete };

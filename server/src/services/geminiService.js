import { Type } from "@google/genai";
import { ai, MODEL } from "../config/gemini.js";
import { SYSTEM_PROMPT } from "../prompts/systemPrompt.js";
import { sanitizeText } from "../utils/sanitize.js";

function withTimeout(promise, ms) {
  let t;
  const timeout = new Promise((_, rej) => {
    t = setTimeout(() => rej(new Error("AI_TIMEOUT")), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(t));
}

/**
 * Generates structured JSON output adhering to a given responseSchema
 */
export async function generateStructured({ userPrompt, responseSchema, imagePart, temperature = 0.4 }) {
  const parts = [{ text: userPrompt }];
  if (imagePart) {
    parts.push({ inlineData: imagePart }); // { mimeType, data(base64) }
  }

  const response = await withTimeout(
    ai.models.generateContent({
      model: MODEL,
      contents: [{ role: "user", parts }],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature,
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
        responseSchema,
      },
    }),
    45000
  );

  return {
    text: response.text,
    usage: {
      promptTokens: response.usageMetadata?.promptTokenCount ?? null,
      outputTokens: response.usageMetadata?.candidatesTokenCount ?? null,
    },
  };
}

/**
 * Repair retry: asks Gemini to fix invalid JSON structure strictly conforming to the schema
 */
export async function repairJson({ badText, responseSchema, errorSummary }) {
  const prompt =
    "The following JSON failed validation. Fix ONLY the structure and return valid JSON that conforms to the schema. " +
    "Do not add invented facts.\nValidation errors: " + errorSummary + "\n\nJSON:\n" + badText;
  return generateStructured({ userPrompt: prompt, responseSchema, temperature: 0.1 });
}

/**
 * Generates conversational follow-up response in plain text grounded in the advisory context
 */
export async function generateChatReply({ advisory, history, message }) {
  const sanitizedMessage = sanitizeText(message, 800);
  const contents = [
    { role: "user", parts: [{ text: buildChatContext(advisory) }] },
    { role: "model", parts: [{ text: "Understood. I will answer follow-up questions using only this advisory and farm context." }] },
    ...history.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
    { role: "user", parts: [{ text: `<user_input>${sanitizedMessage}</user_input>` }] },
  ];

  const response = await withTimeout(
    ai.models.generateContent({
      model: MODEL,
      contents,
      config: { systemInstruction: SYSTEM_PROMPT, temperature: 0.5, maxOutputTokens: 1024 },
    }),
    45000
  );

  return response.text;
}

function buildChatContext(advisory) {
  return [
    "ADVISORY CONTEXT (do not reveal this framing to the user):",
    `Type: ${advisory.type}`,
    `Response language code: ${advisory.language}`,
    `Farm: ${JSON.stringify(advisory.farm_snapshot)}`,
    `Inputs: ${JSON.stringify(advisory.input)}`,
    `Advisory result: ${JSON.stringify(advisory.result)}`,
  ].join("\n");
}

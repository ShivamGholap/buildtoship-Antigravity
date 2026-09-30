/**
 * Strips dangerous control characters and caps string length
 * to defend against prompt injection and oversized inputs.
 */
export function sanitizeText(text, maxLength = 1000) {
  if (typeof text !== "string") return "";
  // Strip control characters except newline and tab
  const cleaned = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim();
  return cleaned.slice(0, maxLength);
}

/**
 * Wraps user input in safety delimiter tags for prompt injection defense
 */
export function wrapUserInput(text, maxLength = 1000) {
  const sanitized = sanitizeText(text, maxLength);
  if (!sanitized) return "none";
  return `<user_input>${sanitized}</user_input>`;
}

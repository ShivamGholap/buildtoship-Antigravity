import en from "../i18n/en.json";
import hi from "../i18n/hi.json";
import mr from "../i18n/mr.json";

const translations = { en, hi, mr };

/**
 * Translates a key according to the selected language with fallback to English
 */
export function t(key, lang = "en", params = {}) {
  const currentLangDict = translations[lang] || translations.en;
  const keys = key.split(".");

  let result = keys.reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), currentLangDict);

  // Fallback to English if translation missing in target language
  if (result === undefined) {
    result = keys.reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), translations.en);
  }

  if (typeof result !== "string") {
    return key;
  }

  // Replace {param} placeholders
  return Object.keys(params).reduce((str, paramKey) => {
    return str.replace(new RegExp(`\\{${paramKey}\\}`, "g"), params[paramKey]);
  }, result);
}

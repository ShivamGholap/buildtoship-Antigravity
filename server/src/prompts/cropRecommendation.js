import { buildCommonPrefix } from "./common.js";
import { wrapUserInput } from "../utils/sanitize.js";

export function buildCropRecommendationPrompt({ farm, input, language }) {
  const commonPrefix = buildCommonPrefix({ farm, language });
  const prevCrop = input.previous_crop || farm.previous_crop || "not provided";
  const notesWrapped = wrapUserInput(input.notes, 500);

  return `${commonPrefix}

TASK: Recommend the best crops for this farm for the given season and goal.

REQUEST INPUTS:
- Season: ${input.season}
- Budget level: ${input.budget_level}
- Primary goal: ${input.goal}
- Previous crop: ${prevCrop}
- Market access: ${input.market_access}
- Extra notes: ${notesWrapped}

INSTRUCTIONS:
- Recommend 3 to 5 crops ranked best-first. Give each a suitability_score from 0 to 100 based on soil, water, season, budget, goal, and rotation benefit.
- Consider crop rotation with the previous crop (disease break, nitrogen fixation).
- Flag crops that would be a poor fit and why in "avoid_crops" (1-3 items).
- Give cost as a qualitative band and water need in mm range or qualitative band. Do NOT state prices or revenue numbers.
- Provide 3-6 "key_actions" the farmer should do in the next 2 weeks.
Return JSON matching the schema.`;
}

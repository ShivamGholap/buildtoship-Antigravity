import { buildCommonPrefix } from "./common.js";
import { wrapUserInput } from "../utils/sanitize.js";

export function buildSeasonalCalendarPrompt({ farm, input, language }) {
  const commonPrefix = buildCommonPrefix({ farm, language });
  const varietyWrapped = wrapUserInput(input.variety_note, 80);
  const durationStr = input.duration_days ? `${input.duration_days} days` : "use typical duration for the region";

  return `${commonPrefix}

TASK: Produce a month-by-month crop calendar.

REQUEST INPUTS:
- Crop: ${input.crop}
- Sowing month (1=Jan ... 12=Dec): ${input.sowing_month}
- Variety note: ${varietyWrapped}
- Crop duration in days: ${durationStr}

INSTRUCTIONS:
- Start from land preparation (up to 4 weeks before sowing) and end at post-harvest handling.
- Return one entry per calendar month touched by the crop cycle, in chronological order, with month name and the year offset (0 = sowing year, 1 = next year).
- Each month lists concrete tasks by category: land_preparation, sowing, nutrient, irrigation, protection, harvest, post_harvest, other.
- Add "scouting_focus" (what pests/diseases to watch that month) and "weather_watch" (seasonal risks such as heat waves, monsoon breaks, frost).
Return JSON matching the schema.`;
}

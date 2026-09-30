import { buildCommonPrefix } from "./common.js";

export function buildIrrigationPlanPrompt({ farm, input, language }) {
  const commonPrefix = buildCommonPrefix({ farm, language });
  const todayIso = new Date().toISOString().split("T")[0];
  const waterHours = input.water_hours_per_week != null ? `${input.water_hours_per_week} hours` : "not provided";
  const rain7d = input.recent_rainfall_mm_7d != null ? `${input.recent_rainfall_mm_7d} mm` : "not provided";

  return `${commonPrefix}

TASK: Build an irrigation schedule and water-saving plan.

REQUEST INPUTS:
- Crop: ${input.crop}
- Sowing date: ${input.sowing_date} (today is ${todayIso}; compute the current crop age in days)
- Current irrigation method: ${input.irrigation_method}
- Water available per week: ${waterHours}
- Rainfall in the last 7 days: ${rain7d}

INSTRUCTIONS:
- Compute current crop age and current growth stage.
- Provide a schedule for each remaining stage: interval in days, approximate depth in mm or duration guidance for the stated method, and signs of over/under-watering.
- Mark critical (yield-sensitive) stages.
- Adapt to soil type and water availability. If water is scarce, provide a deficit-irrigation strategy that protects the critical stages.
- Suggest method upgrades (drip, mulching, alternate wetting and drying for paddy, etc.) with a qualitative payoff. Do NOT quote subsidy amounts.
Return JSON matching the schema.`;
}

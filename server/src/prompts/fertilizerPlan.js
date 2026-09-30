import { buildCommonPrefix } from "./common.js";
import { wrapUserInput } from "../utils/sanitize.js";

export function buildFertilizerPlanPrompt({ farm, input, language }) {
  const commonPrefix = buildCommonPrefix({ farm, language });
  const targetYieldWrapped = wrapUserInput(input.target_yield_note, 120);
  const nVal = input.soil_n_kg_ha != null ? input.soil_n_kg_ha : "n/a";
  const pVal = input.soil_p_kg_ha != null ? input.soil_p_kg_ha : "n/a";
  const kVal = input.soil_k_kg_ha != null ? input.soil_k_kg_ha : "n/a";

  return `${commonPrefix}

TASK: Create a stage-wise nutrient management plan.

REQUEST INPUTS:
- Crop: ${input.crop}
- Current growth stage: ${input.growth_stage}
- Target yield note: ${targetYieldWrapped}
- Soil test available: ${input.soil_test_available ? "yes" : "no"}
- Soil test values (kg/ha): N=${nVal}, P=${pVal}, K=${kVal}
- Preference: ${input.preference}
- Report all quantities per ${farm.land_unit}.

INSTRUCTIONS:
- Cover the remaining crop cycle starting from the current stage.
- Give dose RANGES for N, P2O5, K2O and key secondary/micronutrients when relevant to the crop and soil type (e.g., zinc in alkaline soils, sulphur for oilseeds).
- Give an organic alternative for each stage. Respect the preference: if "organic_only", chemical_options must be an empty array.
- Include split-application timing, method (basal, top-dress, fertigation, foliar), and precautions (do not apply on waterlogged soil, avoid contact with foliage, etc.).
- If no soil test exists, set "soil_test_recommended" true and explain how to do it (where, when, sample method) in 2-3 steps.
Return JSON matching the schema.`;
}

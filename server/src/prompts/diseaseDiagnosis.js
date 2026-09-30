import { buildCommonPrefix } from "./common.js";
import { wrapUserInput } from "../utils/sanitize.js";

export function buildDiseaseDiagnosisPrompt({ farm, input, language, hasImage = false }) {
  const commonPrefix = buildCommonPrefix({ farm, language });
  const symptomsStr = Array.isArray(input.symptoms) && input.symptoms.length > 0
    ? input.symptoms.join(", ")
    : "none selected";
  const symptomDescWrapped = wrapUserInput(input.symptom_description, 1000);
  const recentInputsWrapped = wrapUserInput(input.recent_inputs, 300);

  return `${commonPrefix}

TASK: Diagnose the probable pest/disease/disorder affecting the crop and give an IPM-first action plan.

REQUEST INPUTS:
- Crop: ${input.crop}
- Growth stage: ${input.growth_stage}
- Selected symptoms: ${symptomsStr}
- Symptom description: ${symptomDescWrapped}
- Affected area: ${input.affected_area_percent}% of the field
- Days since first noticed: ${input.days_since_first_seen}
- Recent weather: ${input.recent_weather}
- Recent sprays/fertilizers: ${recentInputsWrapped}
- Photo provided: ${hasImage ? "yes (see attached image)" : "no"}

INSTRUCTIONS:
- Provide 2 to 4 probable causes ranked by confidence (0 to 100). Include nutrient deficiencies or abiotic stress (heat, waterlogging, herbicide drift) when they fit the evidence.
- The top cause needs "distinguishing_signs" the farmer can check in the field to confirm.
- Treatment must be ordered: cultural, mechanical, biological, then chemical (active ingredient only, label-dose disclaimer).
- Set urgency using affected area, spread speed, crop stage, and weather.
- If evidence is weak, say so and list "information_needed" to improve the diagnosis.
Return JSON matching the schema.`;
}

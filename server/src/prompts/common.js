import { wrapUserInput } from "../utils/sanitize.js";

/**
 * Builds the common context header used across all advisory prompts
 */
export function buildCommonPrefix({ farm, language }) {
  const phStr = farm.soil_ph != null ? farm.soil_ph : "not provided";
  const ocStr = farm.organic_carbon_level || "not provided";
  const currentCropStr = farm.current_crop || "none";
  const prevCropStr = farm.previous_crop || "not provided";
  const notesWrapped = wrapUserInput(farm.notes, 500);

  return `REQUEST LANGUAGE CODE: ${language}

FARM PROFILE:
- Farm name: ${farm.name}
- Location: ${farm.district}, ${farm.state}
- Land size: ${farm.land_size} ${farm.land_unit}
- Soil type: ${farm.soil_type}; pH: ${phStr}; organic carbon: ${ocStr}
- Irrigation source: ${farm.irrigation_source}; water availability: ${farm.water_availability}
- Current crop: ${currentCropStr}; previous crop: ${prevCropStr}
- Farm notes: ${notesWrapped}`;
}

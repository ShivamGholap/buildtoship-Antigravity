const MONTH_NAMES = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

/**
 * Deterministically generates titles for advisories according to Section 15.7
 */
export function generateAdvisoryTitle({ type, farm, input, result }) {
  let title = "";
  const farmName = farm?.name || "Farm";

  switch (type) {
    case "crop_recommendation": {
      const seasonCapitalized = input.season ? input.season.charAt(0).toUpperCase() + input.season.slice(1) : "";
      title = `Crop Recommendation: ${seasonCapitalized}, ${farmName}`;
      break;
    }
    case "disease_diagnosis": {
      const crop = input.crop || "Crop";
      const topCause = result?.probable_causes?.[0]?.name;
      title = topCause ? `Diagnosis: ${crop} (${topCause})` : `Diagnosis: ${crop}`;
      break;
    }
    case "fertilizer_plan": {
      const crop = input.crop || "Crop";
      title = `Fertilizer Plan: ${crop} (${farmName})`;
      break;
    }
    case "irrigation_plan": {
      const crop = input.crop || "Crop";
      title = `Irrigation Plan: ${crop} (${farmName})`;
      break;
    }
    case "seasonal_calendar": {
      const crop = input.crop || "Crop";
      const monthName = MONTH_NAMES[input.sowing_month] || `Month ${input.sowing_month}`;
      title = `Calendar: ${crop} (Sowing: ${monthName})`;
      break;
    }
    default:
      title = `Advisory: ${farmName}`;
  }

  return title.slice(0, 160);
}

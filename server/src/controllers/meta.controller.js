import { sendSuccess } from "../utils/apiResponse.js";
import {
  ADVISORY_TYPES,
  SEASONS,
  SOIL_TYPES,
  IRRIGATION_SOURCES,
  WATER_AVAILABILITY,
  GROWTH_STAGES,
  BUDGET_LEVELS,
  CROP_GOALS,
  MARKET_ACCESS,
  WEATHER_CONDITIONS,
  FERTILIZER_PREFERENCES,
  IRRIGATION_METHODS,
  LANGUAGES,
  AREA_UNITS,
  CROPS_CATALOG,
  SYMPTOM_CATEGORIES
} from "../data/options.js";

/**
 * GET /api/meta/options
 * Returns static dropdown options, enums, crop catalog and symptom chips
 */
export function getOptions(req, res) {
  return sendSuccess(res, {
    advisoryTypes: ADVISORY_TYPES,
    seasons: SEASONS,
    soilTypes: SOIL_TYPES,
    irrigationSources: IRRIGATION_SOURCES,
    waterAvailability: WATER_AVAILABILITY,
    growthStages: GROWTH_STAGES,
    budgetLevels: BUDGET_LEVELS,
    cropGoals: CROP_GOALS,
    marketAccess: MARKET_ACCESS,
    weatherConditions: WEATHER_CONDITIONS,
    fertilizerPreferences: FERTILIZER_PREFERENCES,
    irrigationMethods: IRRIGATION_METHODS,
    languages: LANGUAGES,
    areaUnits: AREA_UNITS,
    cropsCatalog: CROPS_CATALOG,
    symptomCategories: SYMPTOM_CATEGORIES
  });
}

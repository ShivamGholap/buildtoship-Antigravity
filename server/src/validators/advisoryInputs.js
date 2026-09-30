import { z } from "zod";

const languageEnum = z.enum(["en", "hi", "mr"]).default("en");
const uuidField = z.string().uuid("Invalid farm UUID");

export const cropRecommendationInputSchema = z.object({
  farm_id: uuidField,
  language: languageEnum,
  season: z.enum(["kharif", "rabi", "zaid", "year_round"]),
  budget_level: z.enum(["low", "medium", "high"]),
  goal: z.enum(["max_profit", "low_risk", "low_water", "organic", "food_security"]),
  previous_crop: z.string().trim().max(60).optional().nullable().or(z.literal("")),
  market_access: z.enum(["local_mandi", "nearby_city", "contract_farming", "export_linked", "unknown"]),
  notes: z.string().trim().max(500).optional().nullable().or(z.literal("")),
}).strict();

export const diseaseDiagnosisInputSchema = z.object({
  farm_id: uuidField,
  language: languageEnum,
  crop: z.string().trim().min(2, "Crop name must be at least 2 characters").max(60),
  growth_stage: z.enum([
    "land_preparation",
    "sowing_germination",
    "seedling",
    "vegetative",
    "flowering",
    "fruiting_grain_filling",
    "maturity_harvest",
    "post_harvest"
  ]),
  symptoms: z.preprocess((val) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch {
        return val.split(",").map((s) => s.trim()).filter(Boolean);
      }
    }
    return val;
  }, z.array(z.string()).default([])),
  symptom_description: z.string().trim().max(1000).optional().nullable().or(z.literal("")),
  affected_area_percent: z.coerce.number().int().min(0).max(100),
  days_since_first_seen: z.coerce.number().int().min(0).max(90),
  recent_weather: z.enum([
    "hot_dry",
    "hot_humid",
    "cool_humid",
    "heavy_rain",
    "drought",
    "normal"
  ]),
  recent_inputs: z.string().trim().max(300).optional().nullable().or(z.literal("")),
}).refine(
  (data) => (data.symptoms && data.symptoms.length > 0) || (data.symptom_description && data.symptom_description.length >= 10),
  {
    message: "Please select at least one symptom chip or provide a description of at least 10 characters.",
    path: ["symptoms"]
  }
);

export const fertilizerPlanInputSchema = z.object({
  farm_id: uuidField,
  language: languageEnum,
  crop: z.string().trim().min(2, "Crop name is required").max(60),
  growth_stage: z.enum([
    "land_preparation",
    "sowing_germination",
    "seedling",
    "vegetative",
    "flowering",
    "fruiting_grain_filling",
    "maturity_harvest",
    "post_harvest"
  ]),
  target_yield_note: z.string().trim().max(120).optional().nullable().or(z.literal("")),
  soil_test_available: z.preprocess((v) => v === "true" || v === true, z.boolean()),
  soil_n_kg_ha: z.coerce.number().min(0).max(2000).optional().nullable().or(z.literal("")),
  soil_p_kg_ha: z.coerce.number().min(0).max(2000).optional().nullable().or(z.literal("")),
  soil_k_kg_ha: z.coerce.number().min(0).max(2000).optional().nullable().or(z.literal("")),
  preference: z.enum(["organic_only", "integrated", "chemical_ok"]),
}).strict();

export const irrigationPlanInputSchema = z.object({
  farm_id: uuidField,
  language: languageEnum,
  crop: z.string().trim().min(2, "Crop name is required").max(60),
  sowing_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Sowing date must be in YYYY-MM-DD format"),
  irrigation_method: z.enum(["flood", "furrow", "drip", "sprinkler", "manual"]),
  water_hours_per_week: z.coerce.number().min(0).max(168).optional().nullable().or(z.literal("")),
  recent_rainfall_mm_7d: z.coerce.number().min(0).max(500).optional().nullable().or(z.literal("")),
}).strict();

export const seasonalCalendarInputSchema = z.object({
  farm_id: uuidField,
  language: languageEnum,
  crop: z.string().trim().min(2, "Crop name is required").max(60),
  sowing_month: z.coerce.number().int().min(1).max(12),
  variety_note: z.string().trim().max(80).optional().nullable().or(z.literal("")),
  duration_days: z.coerce.number().int().min(30).max(730).optional().nullable().or(z.literal("")),
}).strict();

export const chatMessageSchema = z.object({
  message: z.string().trim().min(1, "Message cannot be empty").max(800, "Message cannot exceed 800 characters"),
}).strict();

export const feedbackSchema = z.object({
  helpful: z.boolean(),
  comment: z.string().trim().max(500).optional().nullable().or(z.literal("")),
}).strict();

export const listAdvisoriesQuerySchema = z.object({
  type: z.enum([
    "crop_recommendation",
    "disease_diagnosis",
    "fertilizer_plan",
    "irrigation_plan",
    "seasonal_calendar"
  ]).optional(),
  farm_id: z.string().uuid().optional(),
  q: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

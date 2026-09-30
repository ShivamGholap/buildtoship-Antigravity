import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z
  .object({
    full_name: z.string().trim().min(2, "Full name must be at least 2 characters").max(100),
    email: z.string().trim().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const profileUpdateSchema = z.object({
  full_name: z.string().trim().min(1, "Full name is required").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[+0-9\s-]{7,20}$/, "Phone must be between 7 and 20 digits")
    .optional()
    .nullable()
    .or(z.literal("")),
  state: z.string().trim().min(2, "State must be at least 2 characters").max(60),
  district: z.string().trim().min(2, "District must be at least 2 characters").max(60),
  language: z.enum(["en", "hi", "mr"]).default("en"),
  preferred_unit: z.enum(["acre", "hectare"]).default("acre"),
});

export const farmFormSchema = z.object({
  name: z.string().trim().min(2, "Farm name must be at least 2 characters").max(80),
  state: z.string().trim().min(2, "State must be at least 2 characters").max(60),
  district: z.string().trim().min(2, "District must be at least 2 characters").max(60),
  land_size: z.coerce.number().positive("Land size must be greater than 0").max(100000),
  land_unit: z.enum(["acre", "hectare"]).default("acre"),
  soil_type: z.enum([
    "black_cotton",
    "red",
    "alluvial",
    "laterite",
    "sandy",
    "loamy",
    "clayey",
    "saline_alkaline",
    "unknown",
  ]).default("unknown"),
  soil_ph: z.coerce
    .number()
    .min(3.0, "pH must be at least 3.0")
    .max(10.0, "pH cannot exceed 10.0")
    .optional()
    .nullable()
    .or(z.literal("")),
  organic_carbon_level: z.enum(["low", "medium", "high"]).optional().nullable().or(z.literal("")),
  irrigation_source: z.enum([
    "rainfed",
    "borewell",
    "open_well",
    "canal",
    "river_lift",
    "farm_pond",
    "drip_installed",
    "sprinkler_installed",
  ]).default("rainfed"),
  water_availability: z.enum(["scarce", "limited", "adequate", "abundant"]).default("limited"),
  current_crop: z.string().trim().max(60).optional().nullable().or(z.literal("")),
  previous_crop: z.string().trim().max(60).optional().nullable().or(z.literal("")),
  notes: z.string().trim().max(500).optional().nullable().or(z.literal("")),
});

export const cropRecommendationFormSchema = z.object({
  farm_id: z.string().uuid("Please select a farm"),
  language: z.enum(["en", "hi", "mr"]).default("en"),
  season: z.enum(["kharif", "rabi", "zaid", "year_round"]),
  budget_level: z.enum(["low", "medium", "high"]),
  goal: z.enum(["max_profit", "low_risk", "low_water", "organic", "food_security"]),
  previous_crop: z.string().trim().max(60).optional().or(z.literal("")),
  market_access: z.enum(["local_mandi", "nearby_city", "contract_farming", "export_linked", "unknown"]),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export const diseaseDiagnosisFormSchema = z
  .object({
    farm_id: z.string().uuid("Please select a farm"),
    language: z.enum(["en", "hi", "mr"]).default("en"),
    crop: z.string().trim().min(2, "Crop name is required").max(60),
    growth_stage: z.enum([
      "land_preparation",
      "sowing_germination",
      "seedling",
      "vegetative",
      "flowering",
      "fruiting_grain_filling",
      "maturity_harvest",
      "post_harvest",
    ]),
    symptoms: z.array(z.string()).default([]),
    symptom_description: z.string().trim().max(1000).optional().or(z.literal("")),
    affected_area_percent: z.coerce.number().int().min(0).max(100),
    days_since_first_seen: z.coerce.number().int().min(0).max(90),
    recent_weather: z.enum([
      "hot_dry",
      "hot_humid",
      "cool_humid",
      "heavy_rain",
      "drought",
      "normal",
    ]),
    recent_inputs: z.string().trim().max(300).optional().or(z.literal("")),
  })
  .refine(
    (data) => (data.symptoms && data.symptoms.length > 0) || (data.symptom_description && data.symptom_description.length >= 10),
    {
      message: "Please select at least one symptom or describe symptoms in detail (at least 10 characters).",
      path: ["symptoms"],
    }
  );

export const fertilizerPlanFormSchema = z.object({
  farm_id: z.string().uuid("Please select a farm"),
  language: z.enum(["en", "hi", "mr"]).default("en"),
  crop: z.string().trim().min(2, "Crop name is required").max(60),
  growth_stage: z.enum([
    "land_preparation",
    "sowing_germination",
    "seedling",
    "vegetative",
    "flowering",
    "fruiting_grain_filling",
    "maturity_harvest",
    "post_harvest",
  ]),
  target_yield_note: z.string().trim().max(120).optional().or(z.literal("")),
  soil_test_available: z.boolean().default(false),
  soil_n_kg_ha: z.coerce.number().min(0).max(2000).optional().nullable().or(z.literal("")),
  soil_p_kg_ha: z.coerce.number().min(0).max(2000).optional().nullable().or(z.literal("")),
  soil_k_kg_ha: z.coerce.number().min(0).max(2000).optional().nullable().or(z.literal("")),
  preference: z.enum(["organic_only", "integrated", "chemical_ok"]),
});

export const irrigationPlanFormSchema = z.object({
  farm_id: z.string().uuid("Please select a farm"),
  language: z.enum(["en", "hi", "mr"]).default("en"),
  crop: z.string().trim().min(2, "Crop name is required").max(60),
  sowing_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please select a valid sowing date"),
  irrigation_method: z.enum(["flood", "furrow", "drip", "sprinkler", "manual"]),
  water_hours_per_week: z.coerce.number().min(0).max(168).optional().nullable().or(z.literal("")),
  recent_rainfall_mm_7d: z.coerce.number().min(0).max(500).optional().nullable().or(z.literal("")),
});

export const seasonalCalendarFormSchema = z.object({
  farm_id: z.string().uuid("Please select a farm"),
  language: z.enum(["en", "hi", "mr"]).default("en"),
  crop: z.string().trim().min(2, "Crop name is required").max(60),
  sowing_month: z.coerce.number().int().min(1).max(12),
  variety_note: z.string().trim().max(80).optional().or(z.literal("")),
  duration_days: z.coerce.number().int().min(30).max(730).optional().nullable().or(z.literal("")),
});

export const chatMessageSchema = z.object({
  message: z.string().trim().min(1, "Question cannot be empty").max(800, "Maximum 800 characters"),
});

export const feedbackSchema = z.object({
  helpful: z.boolean(),
  comment: z.string().trim().max(500).optional().or(z.literal("")),
});

import { z } from "zod";

export const cropRecommendationResultSchema = z.object({
  summary: z.string().min(1),
  assumptions: z.array(z.string()),
  recommendations: z.array(
    z.object({
      rank: z.number().int(),
      crop: z.string().min(1),
      suitability_score: z.number().min(0).max(100),
      duration_days: z.string().min(1),
      water_need: z.enum(["very_low", "low", "moderate", "high", "very_high"]),
      input_cost_band: z.enum(["low", "medium", "high"]),
      risk_level: z.enum(["low", "medium", "high"]),
      why_suitable: z.string().min(1),
      main_risks: z.array(z.string()),
      suggested_practices: z.array(z.string()),
      rotation_benefit: z.string()
    })
  ).min(1), // Accepts ranked crops
  avoid_crops: z.array(
    z.object({
      crop: z.string().min(1),
      reason: z.string().min(1)
    })
  ),
  key_actions: z.array(z.string()),
  disclaimer: z.string().min(1)
});

export const diseaseDiagnosisResultSchema = z.object({
  summary: z.string().min(1),
  urgency: z.enum(["low", "moderate", "high", "critical"]),
  image_observations: z.string(),
  probable_causes: z.array(
    z.object({
      name: z.string().min(1),
      category: z.enum([
        "fungal",
        "bacterial",
        "viral",
        "insect_pest",
        "mite",
        "nematode",
        "nutrient_deficiency",
        "abiotic_stress",
        "other"
      ]),
      confidence: z.number().min(0).max(100),
      explanation: z.string().min(1),
      distinguishing_signs: z.array(z.string())
    })
  ).min(1),
  immediate_actions: z.array(z.string()),
  treatment_plan: z.object({
    cultural: z.array(z.string()),
    mechanical: z.array(z.string()),
    biological: z.array(z.string()),
    chemical: z.array(
      z.object({
        active_ingredient: z.string().min(1),
        target: z.string().min(1),
        safety_note: z.string().min(1)
      })
    )
  }),
  prevention: z.array(z.string()),
  information_needed: z.array(z.string()),
  when_to_call_expert: z.string().min(1),
  disclaimer: z.string().min(1)
});

export const fertilizerPlanResultSchema = z.object({
  summary: z.string().min(1),
  assumptions: z.array(z.string()),
  soil_test_recommended: z.boolean(),
  soil_test_guidance: z.array(z.string()),
  stages: z.array(
    z.object({
      stage: z.string().min(1),
      timing: z.string().min(1),
      n_range: z.string(),
      p2o5_range: z.string(),
      k2o_range: z.string(),
      method: z.string().min(1),
      organic_options: z.array(z.string()),
      chemical_options: z.array(z.string()),
      precautions: z.array(z.string())
    })
  ).min(1),
  micronutrient_notes: z.array(z.string()),
  common_mistakes: z.array(z.string()),
  disclaimer: z.string().min(1)
});

export const irrigationPlanResultSchema = z.object({
  summary: z.string().min(1),
  crop_age_days: z.number().int(),
  current_stage: z.string().min(1),
  schedule: z.array(
    z.object({
      stage: z.string().min(1),
      approx_days_range: z.string().min(1),
      interval_days: z.string().min(1),
      amount_guidance: z.string().min(1),
      notes: z.string()
    })
  ).min(1),
  critical_stages: z.array(z.string()),
  water_saving_tips: z.array(z.string()),
  method_upgrade_suggestions: z.array(z.string()),
  warning_signs: z.object({
    overwatering: z.array(z.string()),
    underwatering: z.array(z.string())
  }),
  disclaimer: z.string().min(1)
});

export const seasonalCalendarResultSchema = z.object({
  summary: z.string().min(1),
  total_duration_days: z.number().int(),
  months: z.array(
    z.object({
      month_number: z.number().int(),
      month_name: z.string().min(1),
      year_offset: z.number().int(),
      stage: z.string().min(1),
      tasks: z.array(
        z.object({
          category: z.enum([
            "land_preparation",
            "sowing",
            "nutrient",
            "irrigation",
            "protection",
            "harvest",
            "post_harvest",
            "other"
          ]),
          task: z.string().min(1)
        })
      ),
      scouting_focus: z.array(z.string()),
      weather_watch: z.array(z.string())
    })
  ).min(1),
  critical_deadlines: z.array(z.string()),
  disclaimer: z.string().min(1)
});

import { Type } from "@google/genai";

export const cropRecommendationResponseSchema = {
  type: Type.OBJECT,
  required: ["summary", "assumptions", "recommendations", "avoid_crops", "key_actions", "disclaimer"],
  properties: {
    summary: { type: Type.STRING },
    assumptions: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        required: [
          "rank",
          "crop",
          "suitability_score",
          "duration_days",
          "water_need",
          "input_cost_band",
          "risk_level",
          "why_suitable",
          "main_risks",
          "suggested_practices",
          "rotation_benefit"
        ],
        properties: {
          rank: { type: Type.INTEGER },
          crop: { type: Type.STRING },
          suitability_score: { type: Type.INTEGER },
          duration_days: { type: Type.STRING },
          water_need: {
            type: Type.STRING,
            enum: ["very_low", "low", "moderate", "high", "very_high"]
          },
          input_cost_band: {
            type: Type.STRING,
            enum: ["low", "medium", "high"]
          },
          risk_level: {
            type: Type.STRING,
            enum: ["low", "medium", "high"]
          },
          why_suitable: { type: Type.STRING },
          main_risks: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          suggested_practices: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          rotation_benefit: { type: Type.STRING }
        }
      }
    },
    avoid_crops: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        required: ["crop", "reason"],
        properties: {
          crop: { type: Type.STRING },
          reason: { type: Type.STRING }
        }
      }
    },
    key_actions: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    disclaimer: { type: Type.STRING }
  }
};

export const diseaseDiagnosisResponseSchema = {
  type: Type.OBJECT,
  required: [
    "summary",
    "urgency",
    "image_observations",
    "probable_causes",
    "immediate_actions",
    "treatment_plan",
    "prevention",
    "information_needed",
    "when_to_call_expert",
    "disclaimer"
  ],
  properties: {
    summary: { type: Type.STRING },
    urgency: {
      type: Type.STRING,
      enum: ["low", "moderate", "high", "critical"]
    },
    image_observations: { type: Type.STRING },
    probable_causes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        required: ["name", "category", "confidence", "explanation", "distinguishing_signs"],
        properties: {
          name: { type: Type.STRING },
          category: {
            type: Type.STRING,
            enum: [
              "fungal",
              "bacterial",
              "viral",
              "insect_pest",
              "mite",
              "nematode",
              "nutrient_deficiency",
              "abiotic_stress",
              "other"
            ]
          },
          confidence: { type: Type.INTEGER },
          explanation: { type: Type.STRING },
          distinguishing_signs: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      }
    },
    immediate_actions: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    treatment_plan: {
      type: Type.OBJECT,
      required: ["cultural", "mechanical", "biological", "chemical"],
      properties: {
        cultural: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        mechanical: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        biological: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        chemical: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            required: ["active_ingredient", "target", "safety_note"],
            properties: {
              active_ingredient: { type: Type.STRING },
              target: { type: Type.STRING },
              safety_note: { type: Type.STRING }
            }
          }
        }
      }
    },
    prevention: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    information_needed: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    when_to_call_expert: { type: Type.STRING },
    disclaimer: { type: Type.STRING }
  }
};

export const fertilizerPlanResponseSchema = {
  type: Type.OBJECT,
  required: [
    "summary",
    "assumptions",
    "soil_test_recommended",
    "soil_test_guidance",
    "stages",
    "micronutrient_notes",
    "common_mistakes",
    "disclaimer"
  ],
  properties: {
    summary: { type: Type.STRING },
    assumptions: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    soil_test_recommended: { type: Type.BOOLEAN },
    soil_test_guidance: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    stages: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        required: [
          "stage",
          "timing",
          "n_range",
          "p2o5_range",
          "k2o_range",
          "method",
          "organic_options",
          "chemical_options",
          "precautions"
        ],
        properties: {
          stage: { type: Type.STRING },
          timing: { type: Type.STRING },
          n_range: { type: Type.STRING },
          p2o5_range: { type: Type.STRING },
          k2o_range: { type: Type.STRING },
          method: { type: Type.STRING },
          organic_options: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          chemical_options: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          precautions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      }
    },
    micronutrient_notes: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    common_mistakes: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    disclaimer: { type: Type.STRING }
  }
};

export const irrigationPlanResponseSchema = {
  type: Type.OBJECT,
  required: [
    "summary",
    "crop_age_days",
    "current_stage",
    "schedule",
    "critical_stages",
    "water_saving_tips",
    "method_upgrade_suggestions",
    "warning_signs",
    "disclaimer"
  ],
  properties: {
    summary: { type: Type.STRING },
    crop_age_days: { type: Type.INTEGER },
    current_stage: { type: Type.STRING },
    schedule: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        required: ["stage", "approx_days_range", "interval_days", "amount_guidance", "notes"],
        properties: {
          stage: { type: Type.STRING },
          approx_days_range: { type: Type.STRING },
          interval_days: { type: Type.STRING },
          amount_guidance: { type: Type.STRING },
          notes: { type: Type.STRING }
        }
      }
    },
    critical_stages: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    water_saving_tips: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    method_upgrade_suggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    warning_signs: {
      type: Type.OBJECT,
      required: ["overwatering", "underwatering"],
      properties: {
        overwatering: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        underwatering: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    },
    disclaimer: { type: Type.STRING }
  }
};

export const seasonalCalendarResponseSchema = {
  type: Type.OBJECT,
  required: ["summary", "total_duration_days", "months", "critical_deadlines", "disclaimer"],
  properties: {
    summary: { type: Type.STRING },
    total_duration_days: { type: Type.INTEGER },
    months: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        required: [
          "month_number",
          "month_name",
          "year_offset",
          "stage",
          "tasks",
          "scouting_focus",
          "weather_watch"
        ],
        properties: {
          month_number: { type: Type.INTEGER },
          month_name: { type: Type.STRING },
          year_offset: { type: Type.INTEGER },
          stage: { type: Type.STRING },
          tasks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              required: ["category", "task"],
              properties: {
                category: {
                  type: Type.STRING,
                  enum: [
                    "land_preparation",
                    "sowing",
                    "nutrient",
                    "irrigation",
                    "protection",
                    "harvest",
                    "post_harvest",
                    "other"
                  ]
                },
                task: { type: Type.STRING }
              }
            }
          },
          scouting_focus: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          weather_watch: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      }
    },
    critical_deadlines: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    disclaimer: { type: Type.STRING }
  }
};

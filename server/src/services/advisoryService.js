import { generateStructured, repairJson } from "./geminiService.js";
import { MODEL } from "../config/gemini.js";
import { AppError } from "../utils/AppError.js";
import { generateAdvisoryTitle } from "../utils/titles.js";

// Prompts
import { buildCropRecommendationPrompt } from "../prompts/cropRecommendation.js";
import { buildDiseaseDiagnosisPrompt } from "../prompts/diseaseDiagnosis.js";
import { buildFertilizerPlanPrompt } from "../prompts/fertilizerPlan.js";
import { buildIrrigationPlanPrompt } from "../prompts/irrigationPlan.js";
import { buildSeasonalCalendarPrompt } from "../prompts/seasonalCalendar.js";

// Response Schemas
import {
  cropRecommendationResponseSchema,
  diseaseDiagnosisResponseSchema,
  fertilizerPlanResponseSchema,
  irrigationPlanResponseSchema,
  seasonalCalendarResponseSchema,
} from "../prompts/schemas.js";

// Output Validators
import {
  cropRecommendationResultSchema,
  diseaseDiagnosisResultSchema,
  fertilizerPlanResultSchema,
  irrigationPlanResultSchema,
  seasonalCalendarResultSchema,
} from "../validators/aiResults.js";

const ADVISORY_CONFIGS = {
  crop_recommendation: {
    promptBuilder: buildCropRecommendationPrompt,
    responseSchema: cropRecommendationResponseSchema,
    resultSchema: cropRecommendationResultSchema,
  },
  disease_diagnosis: {
    promptBuilder: buildDiseaseDiagnosisPrompt,
    responseSchema: diseaseDiagnosisResponseSchema,
    resultSchema: diseaseDiagnosisResultSchema,
  },
  fertilizer_plan: {
    promptBuilder: buildFertilizerPlanPrompt,
    responseSchema: fertilizerPlanResponseSchema,
    resultSchema: fertilizerPlanResultSchema,
  },
  irrigation_plan: {
    promptBuilder: buildIrrigationPlanPrompt,
    responseSchema: irrigationPlanResponseSchema,
    resultSchema: irrigationPlanResultSchema,
  },
  seasonal_calendar: {
    promptBuilder: buildSeasonalCalendarPrompt,
    responseSchema: seasonalCalendarResponseSchema,
    resultSchema: seasonalCalendarResultSchema,
  },
};

/**
 * Shared advisory generation orchestrator
 */
export async function generateAdvisory({ type, input, user, supabase, file }) {
  const config = ADVISORY_CONFIGS[type];
  if (!config) {
    throw new AppError(`Unknown advisory type: ${type}`, 400, "INVALID_ADVISORY_TYPE");
  }

  // 1. Fetch farm via RLS-scoped client; 404 if missing or unauthorized
  const { data: farm, error: farmErr } = await supabase
    .from("farms")
    .select("*")
    .eq("id", input.farm_id)
    .single();

  if (farmErr || !farm) {
    throw new AppError("Selected farm not found or unauthorized", 404, "NOT_FOUND");
  }

  // 2. Fetch profile for default language and unit
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const language = input.language || profile?.language || "en";
  const hadImage = Boolean(file && file.buffer);

  // 3. Build user prompt
  const userPrompt = config.promptBuilder({
    farm,
    input,
    language,
    hasImage: hadImage,
  });

  // 4. Prepare image part for Gemini if uploaded
  let imagePart = null;
  if (hadImage) {
    imagePart = {
      mimeType: file.verifiedMimeType || file.mimetype,
      data: file.buffer.toString("base64"),
    };
  }

  // 5. Call Gemini
  let aiOutputText = "";
  let usage = { promptTokens: null, outputTokens: null };
  let parsedResult = null;

  try {
    const aiResponse = await generateStructured({
      userPrompt,
      responseSchema: config.responseSchema,
      imagePart,
    });
    aiOutputText = aiResponse.text;
    usage = aiResponse.usage;
  } catch (err) {
    console.error(`[AI Generation Error] (${type}):`, err);
    throw new AppError(
      "AI generation service is currently unavailable or timed out. Please try again.",
      502,
      "AI_UNAVAILABLE",
      [err.message]
    );
  }

  // 6. JSON parse & Zod validate with 1 automatic repair retry
  let validationSuccess = false;
  try {
    const rawParsed = JSON.parse(aiOutputText);
    const validated = config.resultSchema.safeParse(rawParsed);
    if (validated.success) {
      parsedResult = validated.data;
      validationSuccess = true;
    } else {
      console.warn(`[AI Validation Failed] Attempting repair retry for ${type}...`);
      const errorSummary = validated.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
      const repairResponse = await repairJson({
        badText: aiOutputText,
        responseSchema: config.responseSchema,
        errorSummary,
      });

      const repairParsed = JSON.parse(repairResponse.text);
      const repairValidated = config.resultSchema.safeParse(repairParsed);
      if (repairValidated.success) {
        parsedResult = repairValidated.data;
        validationSuccess = true;
      }
    }
  } catch (parseOrRepairErr) {
    console.error("[JSON Parse / Repair Error]", parseOrRepairErr);
  }

  // 7. If validation fails after repair, persist a failed advisory row and return 502
  if (!validationSuccess || !parsedResult) {
    const title = generateAdvisoryTitle({ type, farm, input, result: null });
    await supabase.from("advisories").insert({
      user_id: user.id,
      farm_id: farm.id,
      type,
      language,
      title,
      input,
      farm_snapshot: farm,
      result: null,
      status: "failed",
      error_message: "AI output could not be validated against schema after repair attempt",
      model: MODEL,
      had_image: hadImage,
      prompt_tokens: usage.promptTokens,
      output_tokens: usage.outputTokens,
    });

    throw new AppError(
      "The AI response could not be verified for quality and structure. Please retry your advisory request.",
      502,
      "AI_SCHEMA_VALIDATION_FAILED"
    );
  }

  // 8. Generate title & persist completed advisory row
  const title = generateAdvisoryTitle({ type, farm, input, result: parsedResult });

  const { data: savedAdvisory, error: saveErr } = await supabase
    .from("advisories")
    .insert({
      user_id: user.id,
      farm_id: farm.id,
      type,
      language,
      title,
      input,
      farm_snapshot: farm,
      result: parsedResult,
      status: "completed",
      model: MODEL,
      had_image: hadImage,
      prompt_tokens: usage.promptTokens,
      output_tokens: usage.outputTokens,
    })
    .select()
    .single();

  if (saveErr) {
    console.error("[Database Save Error - Advisory]:", saveErr);
    throw new AppError("Failed to save advisory to database", 500, "DATABASE_ERROR", [saveErr.message]);
  }

  return savedAdvisory;
}

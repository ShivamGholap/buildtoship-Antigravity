import { sendSuccess } from "../utils/apiResponse.js";
import { AppError } from "../utils/AppError.js";
import { generateAdvisory } from "../services/advisoryService.js";

/**
 * Helper to handle generation endpoints
 */
async function handleGeneration(type, req, res, next) {
  try {
    const advisory = await generateAdvisory({
      type,
      input: req.body,
      user: req.user,
      supabase: req.supabase,
      file: req.file,
    });
    return sendSuccess(res, advisory, 201);
  } catch (err) {
    next(err);
  }
}

export function generateCropRecommendation(req, res, next) {
  return handleGeneration("crop_recommendation", req, res, next);
}

export function generateDiseaseDiagnosis(req, res, next) {
  return handleGeneration("disease_diagnosis", req, res, next);
}

export function generateFertilizerPlan(req, res, next) {
  return handleGeneration("fertilizer_plan", req, res, next);
}

export function generateIrrigationPlan(req, res, next) {
  return handleGeneration("irrigation_plan", req, res, next);
}

export function generateSeasonalCalendar(req, res, next) {
  return handleGeneration("seasonal_calendar", req, res, next);
}

/**
 * GET /api/advisories
 * List advisories with filters, search, and pagination
 */
export async function listAdvisories(req, res, next) {
  try {
    const { type, farm_id, q, page, limit } = req.query;
    const offset = (page - 1) * limit;

    let query = req.supabase
      .from("advisories")
      .select("id, type, language, title, status, had_image, created_at, farm_id, farm_snapshot", {
        count: "exact",
      })
      .order("created_at", { ascending: false });

    if (type) {
      query = query.eq("type", type);
    }
    if (farm_id) {
      query = query.eq("farm_id", farm_id);
    }
    if (q) {
      query = query.ilike("title", `%${q}%`);
    }

    query = query.range(offset, offset + limit - 1);

    const { data: advisories, count, error } = await query;

    if (error) {
      throw new AppError("Failed to fetch advisories list", 500, "DATABASE_ERROR", [error.message]);
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return sendSuccess(res, {
      items: advisories || [],
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/advisories/:id
 * Retrieve advisory detail with messages and feedback
 */
export async function getAdvisoryDetail(req, res, next) {
  try {
    const { id } = req.params;

    // 1. Fetch advisory
    const { data: advisory, error: advErr } = await req.supabase
      .from("advisories")
      .select("*")
      .eq("id", id)
      .single();

    if (advErr || !advisory) {
      throw new AppError("Advisory not found", 404, "NOT_FOUND");
    }

    // 2. Fetch associated messages
    const { data: messages } = await req.supabase
      .from("advisory_messages")
      .select("*")
      .eq("advisory_id", id)
      .order("created_at", { ascending: true });

    // 3. Fetch associated feedback
    const { data: feedback } = await req.supabase
      .from("advisory_feedback")
      .select("*")
      .eq("advisory_id", id)
      .maybeSingle();

    return sendSuccess(res, {
      ...advisory,
      messages: messages || [],
      feedback: feedback || null,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/advisories/:id
 * Delete an advisory
 */
export async function deleteAdvisory(req, res, next) {
  try {
    const { id } = req.params;

    const { data, error } = await req.supabase
      .from("advisories")
      .delete()
      .eq("id", id)
      .select();

    if (error || !data || data.length === 0) {
      throw new AppError("Advisory not found", 404, "NOT_FOUND");
    }

    return sendSuccess(res, { message: "Advisory deleted successfully" });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/advisories/:id/feedback
 * Upsert feedback for an advisory
 */
export async function upsertFeedback(req, res, next) {
  try {
    const { id } = req.params;
    const { helpful, comment } = req.body;

    // Verify advisory exists and belongs to user
    const { data: advisory, error: advErr } = await req.supabase
      .from("advisories")
      .select("id")
      .eq("id", id)
      .single();

    if (advErr || !advisory) {
      throw new AppError("Advisory not found", 404, "NOT_FOUND");
    }

    const { data: feedback, error: fbErr } = await req.supabase
      .from("advisory_feedback")
      .upsert(
        {
          advisory_id: id,
          user_id: req.user.id,
          helpful,
          comment: comment || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "advisory_id" }
      )
      .select()
      .single();

    if (fbErr) {
      throw new AppError("Failed to save feedback", 500, "DATABASE_ERROR", [fbErr.message]);
    }

    return sendSuccess(res, feedback);
  } catch (err) {
    next(err);
  }
}

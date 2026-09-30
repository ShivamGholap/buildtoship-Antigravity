import { sendSuccess } from "../utils/apiResponse.js";
import { AppError } from "../utils/AppError.js";

/**
 * GET /api/farms
 * List all farms belonging to the authenticated user
 */
export async function listFarms(req, res, next) {
  try {
    const { data: farms, error } = await req.supabase
      .from("farms")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new AppError("Failed to fetch farms", 500, "DATABASE_ERROR", [error.message]);
    }

    return sendSuccess(res, farms || []);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/farms
 * Create a new farm
 */
export async function createFarm(req, res, next) {
  try {
    const farmPayload = {
      ...req.body,
      user_id: req.user.id
    };

    const { data: farm, error } = await req.supabase
      .from("farms")
      .insert(farmPayload)
      .select()
      .single();

    if (error) {
      throw new AppError("Failed to create farm", 500, "DATABASE_ERROR", [error.message]);
    }

    return sendSuccess(res, farm, 201);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/farms/:id
 * Retrieve a single farm by ID (RLS-scoped, 404 if not found or unauthorized)
 */
export async function getFarm(req, res, next) {
  try {
    const { id } = req.params;

    const { data: farm, error } = await req.supabase
      .from("farms")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !farm) {
      throw new AppError("Farm not found", 404, "NOT_FOUND");
    }

    return sendSuccess(res, farm);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/farms/:id
 * Update an existing farm
 */
export async function updateFarm(req, res, next) {
  try {
    const { id } = req.params;

    const { data: farm, error } = await req.supabase
      .from("farms")
      .update({
        ...req.body,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (error || !farm) {
      throw new AppError("Farm not found or cannot be updated", 404, "NOT_FOUND");
    }

    return sendSuccess(res, farm);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/farms/:id
 * Delete a farm
 */
export async function deleteFarm(req, res, next) {
  try {
    const { id } = req.params;

    const { data, error } = await req.supabase
      .from("farms")
      .delete()
      .eq("id", id)
      .select();

    if (error || !data || data.length === 0) {
      throw new AppError("Farm not found", 404, "NOT_FOUND");
    }

    return sendSuccess(res, { message: "Farm deleted successfully" });
  } catch (err) {
    next(err);
  }
}

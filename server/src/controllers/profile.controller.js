import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { AppError } from "../utils/AppError.js";

/**
 * GET /api/profile
 * Retrieves the authenticated farmer's profile
 */
export async function getProfile(req, res, next) {
  try {
    const { data: profile, error } = await req.supabase
      .from("profiles")
      .select("*")
      .eq("id", req.user.id)
      .single();

    if (error && error.code === "PGRST116") {
      // If profile row hasn't been triggered yet, create an initial one
      const { data: newProfile, error: insertError } = await req.supabase
        .from("profiles")
        .insert({
          id: req.user.id,
          full_name: req.user.user_metadata?.full_name || "",
          language: "en",
          preferred_unit: "acre",
          onboarded: false
        })
        .select()
        .single();

      if (insertError) {
        throw new AppError("Failed to initialize profile", 500, "DATABASE_ERROR", [insertError.message]);
      }
      return sendSuccess(res, newProfile);
    }

    if (error) {
      throw new AppError("Failed to fetch profile", 500, "DATABASE_ERROR", [error.message]);
    }

    return sendSuccess(res, profile);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/profile
 * Updates the farmer's profile and marks onboarded = true
 */
export async function updateProfile(req, res, next) {
  try {
    const updateData = {
      ...req.body,
      onboarded: true,
      updated_at: new Date().toISOString()
    };

    const { data: profile, error } = await req.supabase
      .from("profiles")
      .update(updateData)
      .eq("id", req.user.id)
      .select()
      .single();

    if (error) {
      throw new AppError("Failed to update profile", 500, "DATABASE_ERROR", [error.message]);
    }

    return sendSuccess(res, profile);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/profile/data
 * Cascading deletion of all user farms, advisories, messages, and feedback
 */
export async function deleteUserData(req, res, next) {
  try {
    const userId = req.user.id;

    // 1. Delete feedback
    await req.supabase.from("advisory_feedback").delete().eq("user_id", userId);
    // 2. Delete messages
    await req.supabase.from("advisory_messages").delete().eq("user_id", userId);
    // 3. Delete advisories
    await req.supabase.from("advisories").delete().eq("user_id", userId);
    // 4. Delete farms
    await req.supabase.from("farms").delete().eq("user_id", userId);
    // 5. Reset/delete profile
    await req.supabase.from("profiles").delete().eq("id", userId);

    return sendSuccess(res, { message: "All farm and advisory data successfully deleted." });
  } catch (err) {
    next(err);
  }
}

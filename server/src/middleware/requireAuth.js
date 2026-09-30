import { supabaseAuth, createUserClient } from "../config/supabase.js";
import { AppError } from "../utils/AppError.js";

/**
 * Authentication middleware that verifies the Supabase access token in the Authorization header.
 * Attaches req.user, req.token, and req.supabase (RLS-scoped client).
 */
export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("Missing or invalid Authorization header", 401, "UNAUTHORIZED"));
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(new AppError("Bearer token is required", 401, "UNAUTHORIZED"));
    }

    const { data: { user }, error } = await supabaseAuth.auth.getUser(token);

    if (error || !user) {
      return next(new AppError("Invalid or expired session token", 401, "UNAUTHORIZED"));
    }

    req.user = user;
    req.token = token;
    req.supabase = createUserClient(token);

    next();
  } catch (err) {
    return next(new AppError("Authentication verification failed", 401, "UNAUTHORIZED", [err.message]));
  }
}

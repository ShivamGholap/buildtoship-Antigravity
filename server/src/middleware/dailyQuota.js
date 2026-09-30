import { checkUserDailyQuota } from "../services/quotaService.js";
import { AppError } from "../utils/AppError.js";

/**
 * Middleware to enforce daily AI usage cap per user
 */
export async function enforceDailyQuota(req, res, next) {
  try {
    if (!req.user || !req.supabase) {
      return next();
    }

    const { allowed, current, limit } = await checkUserDailyQuota(req.supabase, req.user.id);

    if (!allowed) {
      return next(new AppError(
        `Daily AI quota of ${limit} requests reached (${current} used in last 24h). Your quota resets continuously on a 24-hour rolling window.`,
        429,
        "DAILY_QUOTA_EXCEEDED",
        [{ path: "quota", message: "Daily quota limit reached" }]
      ));
    }

    next();
  } catch (err) {
    next(err);
  }
}

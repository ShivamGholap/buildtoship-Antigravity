import { sendSuccess } from "../utils/apiResponse.js";
import { AppError } from "../utils/AppError.js";
import { generateChatReply } from "../services/geminiService.js";

const MAX_USER_MESSAGES = 20;

/**
 * GET /api/advisories/:id/messages
 * List all follow-up messages for an advisory
 */
export async function listMessages(req, res, next) {
  try {
    const { id } = req.params;

    // Verify advisory ownership via RLS
    const { data: advisory, error: advErr } = await req.supabase
      .from("advisories")
      .select("id")
      .eq("id", id)
      .single();

    if (advErr || !advisory) {
      throw new AppError("Advisory not found", 404, "NOT_FOUND");
    }

    const { data: messages, error } = await req.supabase
      .from("advisory_messages")
      .select("*")
      .eq("advisory_id", id)
      .order("created_at", { ascending: true });

    if (error) {
      throw new AppError("Failed to fetch messages", 500, "DATABASE_ERROR", [error.message]);
    }

    return sendSuccess(res, messages || []);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/advisories/:id/messages
 * Send a follow-up question and get an AI assistant response
 */
export async function postMessage(req, res, next) {
  try {
    const { id } = req.params;
    const { message } = req.body;

    // 1. Fetch advisory
    const { data: advisory, error: advErr } = await req.supabase
      .from("advisories")
      .select("*")
      .eq("id", id)
      .single();

    if (advErr || !advisory) {
      throw new AppError("Advisory not found", 404, "NOT_FOUND");
    }

    // 2. Check 20-message cap
    const { count: userMessageCount, error: countErr } = await req.supabase
      .from("advisory_messages")
      .select("id", { count: "exact", head: true })
      .eq("advisory_id", id)
      .eq("role", "user");

    if (countErr) {
      throw new AppError("Failed to verify message limit", 500, "DATABASE_ERROR", [countErr.message]);
    }

    if ((userMessageCount || 0) >= MAX_USER_MESSAGES) {
      throw new AppError(
        `Maximum follow-up question limit (${MAX_USER_MESSAGES}) reached for this advisory. You can generate a new advisory or review previous answers.`,
        400,
        "MESSAGE_LIMIT_REACHED"
      );
    }

    // 3. Insert user message
    const { data: userMsg, error: userMsgErr } = await req.supabase
      .from("advisory_messages")
      .insert({
        advisory_id: id,
        user_id: req.user.id,
        role: "user",
        content: message,
      })
      .select()
      .single();

    if (userMsgErr) {
      throw new AppError("Failed to save user message", 500, "DATABASE_ERROR", [userMsgErr.message]);
    }

    // 4. Fetch last 10 messages for context
    const { data: recentHistory } = await req.supabase
      .from("advisory_messages")
      .select("role, content")
      .eq("advisory_id", id)
      .order("created_at", { ascending: false })
      .limit(10);

    const chronologicalHistory = (recentHistory || []).reverse();

    // 5. Generate AI chat reply
    let replyText = "";
    try {
      replyText = await generateChatReply({
        advisory,
        history: chronologicalHistory.slice(0, -1), // Prior history excluding the one we just inserted
        message,
      });
    } catch (err) {
      console.error("[Chat Generation Error]:", err);
      throw new AppError("Failed to generate AI response. Please try again.", 502, "AI_UNAVAILABLE", [err.message]);
    }

    // 6. Insert assistant reply
    const { data: assistantMsg, error: assistantMsgErr } = await req.supabase
      .from("advisory_messages")
      .insert({
        advisory_id: id,
        user_id: req.user.id,
        role: "assistant",
        content: replyText.trim(),
      })
      .select()
      .single();

    if (assistantMsgErr) {
      throw new AppError("Failed to save assistant response", 500, "DATABASE_ERROR", [assistantMsgErr.message]);
    }

    return sendSuccess(res, {
      userMessage: userMsg,
      assistantMessage: assistantMsg,
    }, 201);
  } catch (err) {
    next(err);
  }
}

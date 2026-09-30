import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, CheckCircle2, MessageSquare } from "lucide-react";
import { Button } from "../../ui/Button.jsx";

export function FeedbackWidget({ advisoryId, initialFeedback, onSubmitFeedback }) {
  const [helpful, setHelpful] = useState(initialFeedback ? initialFeedback.helpful : null);
  const [comment, setComment] = useState(initialFeedback?.comment || "");
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(Boolean(initialFeedback));

  const handleRate = async (isHelpful) => {
    setHelpful(isHelpful);
    setShowCommentBox(true);
    try {
      setSubmitting(true);
      await onSubmitFeedback(advisoryId, { helpful: isHelpful, comment: comment || null });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit feedback rating", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveComment = async (e) => {
    e.preventDefault();
    if (helpful === null) return;
    try {
      setSubmitting(true);
      await onSubmitFeedback(advisoryId, { helpful, comment: comment.trim() || null });
      setSubmitted(true);
      setShowCommentBox(false);
    } catch (err) {
      console.error("Failed to save comment", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-sm feedback-widget no-print">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            Was this advisory recommendation helpful?
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Your feedback trains future advisory recommendations for your local area.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={helpful === true ? "primary" : "outline"}
            size="sm"
            onClick={() => handleRate(true)}
            disabled={submitting}
            icon={ThumbsUp}
          >
            Helpful
          </Button>

          <Button
            variant={helpful === false ? "danger" : "outline"}
            size="sm"
            onClick={() => handleRate(false)}
            disabled={submitting}
            icon={ThumbsDown}
          >
            Needs Improvement
          </Button>
        </div>
      </div>

      {showCommentBox && (
        <form onSubmit={handleSaveComment} className="mt-4 pt-3 border-t border-stone-100 space-y-3">
          <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
            <MessageSquare className="w-3.5 h-3.5 text-stone-400" />
            <span>Optional feedback notes:</span>
          </div>
          <textarea
            rows={2}
            maxLength={500}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us what worked well or what was missing (e.g. wanted organic neem dosage, seed variety details)..."
            className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-700 placeholder-stone-400"
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowCommentBox(false)}
            >
              Skip
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={submitting}>
              Save Comment
            </Button>
          </div>
        </form>
      )}

      {submitted && !showCommentBox && (
        <div className="mt-3 pt-2 text-xs text-brand-800 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-brand-700" />
          <span>Feedback recorded. Thank you for helping improve KrishiMitra!</span>
        </div>
      )}
    </div>
  );
}

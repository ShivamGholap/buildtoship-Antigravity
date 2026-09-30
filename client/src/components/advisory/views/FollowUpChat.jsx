import React, { useState, useRef, useEffect } from "react";
import { Button } from "../../ui/Button.jsx";
import { formatDate } from "../../../lib/formatters.js";
import {
  MessageSquare,
  Send,
  Sparkles,
  User,
  AlertCircle,
  HelpCircle,
  Info
} from "lucide-react";

const MAX_CHAT_MESSAGES = 20;

const SUGGESTED_QUESTIONS = {
  crop_recommendation: [
    "Which of these recommended crops requires the lowest upfront seed cost?",
    "Can you suggest an intercropping combination with the top ranked crop?",
    "What government crop insurance scheme covers these crops?"
  ],
  disease_diagnosis: [
    "What homemade biological spray (like neem extract) can I prepare today?",
    "Can this infection spread to neighboring crops or soil?",
    "What precautions should I take when spraying chemical fungicides?"
  ],
  fertilizer_plan: [
    "How can I substitute chemical urea with farmyard manure or vermicompost?",
    "Should I apply fertilizer before or after the upcoming irrigation?",
    "What are early signs of nitrogen or zinc deficiency in this crop?"
  ],
  irrigation_plan: [
    "How do I adjust watering if it rains heavily this week?",
    "What is the best time of day to irrigate to reduce water loss?",
    "What is the cost benefit of converting from flood to drip irrigation?"
  ],
  seasonal_calendar: [
    "What should I do if sowing is delayed by 3 weeks due to late monsoon?",
    "What are the key post-harvest drying and storage precautions?",
    "When should I place pheromone or sticky traps in the field?"
  ],
};

export function FollowUpChat({
  advisoryId,
  advisoryType,
  messages = [],
  onSendMessage,
  loading = false,
}) {
  const [inputMessage, setInputMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [localMessages, setLocalMessages] = useState(messages);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages, sending]);

  const userMessagesCount = localMessages.filter((m) => m.role === "user").length;
  const isCapReached = userMessagesCount >= MAX_CHAT_MESSAGES;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const text = inputMessage.trim();
    if (!text || sending || isCapReached) return;

    // Optimistically add user message
    const tempUserMsg = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    };
    setLocalMessages((prev) => [...prev, tempUserMsg]);
    setInputMessage("");
    setSending(true);

    try {
      const data = await onSendMessage(advisoryId, text);
      if (data?.assistantMessage) {
        setLocalMessages((prev) => [
          ...prev.filter((m) => m.id !== tempUserMsg.id),
          data.userMessage,
          data.assistantMessage,
        ]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      // Remove failed optimistic message
      setLocalMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
    } finally {
      setSending(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  const suggestions = SUGGESTED_QUESTIONS[advisoryType] || [
    "Can you clarify the dosage recommendations?",
    "What are the organic alternatives?",
    "What signs indicate immediate trouble in the field?"
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden follow-up-chat no-print">
      {/* Chat Header */}
      <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-tight">
              Ask Follow-up Questions
            </h3>
            <span className="text-xs text-stone-400">
              Answers are grounded strictly in this advisory report
            </span>
          </div>
        </div>

        {/* Message Cap Counter */}
        <div className="text-xs font-medium text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
          {userMessagesCount} / {MAX_CHAT_MESSAGES} questions
        </div>
      </div>

      {/* Messages Conversation List */}
      <div className="p-4 sm:p-5 max-h-[420px] overflow-y-auto space-y-4 bg-stone-50/50">
        {localMessages.length === 0 ? (
          <div className="text-center py-8 px-4">
            <HelpCircle className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-stone-600">
              Have questions about this advisory?
            </p>
            <p className="text-xs text-stone-400 max-w-sm mx-auto mt-1">
              Ask about alternative remedies, spraying schedules, equipment, or organic methods.
            </p>
          </div>
        ) : (
          localMessages.map((msg, idx) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id || idx}
                className={`flex gap-2.5 max-w-[85%] ${
                  isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
                    isUser
                      ? "bg-brand-700 text-white"
                      : "bg-white border border-stone-200 text-brand-700 shadow-sm"
                  }`}
                >
                  {isUser ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                    isUser
                      ? "bg-brand-700 text-white rounded-tr-none"
                      : "bg-white border border-stone-200/80 text-stone-800 rounded-tl-none whitespace-pre-line"
                  }`}
                >
                  {msg.content}
                  <div
                    className={`text-[10px] mt-1 text-right ${
                      isUser ? "text-brand-200" : "text-stone-400"
                    }`}
                  >
                    {formatDate(msg.created_at)}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {sending && (
          <div className="flex gap-2.5 mr-auto max-w-[80%]">
            <div className="w-7 h-7 rounded-full bg-white border border-stone-200 text-brand-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="bg-white border border-stone-200 p-3 rounded-2xl rounded-tl-none text-xs text-stone-500 animate-pulse">
              Consulting advisory context...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Question Chips */}
      {!isCapReached && (
        <div className="p-3 border-t border-stone-100 bg-white">
          <span className="text-[11px] font-semibold text-stone-400 block mb-1.5 uppercase tracking-wider">
            Suggested Follow-up Questions:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickQuestion(q)}
                className="text-xs bg-stone-100 hover:bg-brand-50 hover:text-brand-800 text-stone-700 px-2.5 py-1 rounded-full transition-colors text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Input Bar */}
      <div className="p-3 sm:p-4 bg-white border-t border-stone-100">
        {isCapReached ? (
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>
              You have reached the maximum limit of 20 follow-up questions for this advisory. You can generate a new advisory or consult your local agriculture officer.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              maxLength={800}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask a question about this advisory..."
              disabled={sending}
              className="flex-1 px-3.5 py-2 text-xs sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-700 min-h-[44px]"
            />
            <Button
              type="submit"
              variant="primary"
              disabled={!inputMessage.trim() || sending}
              loading={sending}
              icon={Send}
            >
              Send
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

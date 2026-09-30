import React, { useState, useEffect } from "react";
import { Loader2, Sprout, ShieldAlert, X } from "lucide-react";
import { Button } from "../ui/Button.jsx";

const PROGRESS_STEPS = [
  "Retrieving your farm's soil, water, and climate profile...",
  "Analyzing regional agro-climatic conditions and seasonality...",
  "Evaluating university-recommended varieties and IPM protocols...",
  "Synthesizing nutrient and moisture balance calculations...",
  "Structuring safe, validated agricultural advisory...",
];

export function GeneratingOverlay({ isOpen, onCancel, advisoryTitle = "Advisory" }) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < PROGRESS_STEPS.length - 1 ? prev + 1 : prev));
    }, 4500);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 sm:p-8 max-w-md w-full text-center relative">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mx-auto mb-5 relative shadow-inner">
          <Sprout className="w-8 h-8 animate-pulse text-brand-600" />
          <Loader2 className="w-16 h-16 animate-spin text-brand-700 absolute -inset-0" />
        </div>

        <h3 className="text-xl font-bold text-stone-900 mb-1">
          Generating {advisoryTitle}
        </h3>
        <p className="text-xs text-stone-500 mb-6">
          Grounded with Google Gemini AI & Agricultural Science
        </p>

        {/* Dynamic progress step text */}
        <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 mb-6 min-h-[72px] flex items-center justify-center">
          <p className="text-sm font-medium text-stone-700 animate-pulse">
            {PROGRESS_STEPS[stepIndex]}
          </p>
        </div>

        {/* Safe advice reminder */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-stone-400 mb-6">
          <ShieldAlert className="w-3.5 h-3.5 text-stone-400" />
          <span>Strictly adhering to safe IPM & non-fabricated guidance</span>
        </div>

        {onCancel && (
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            icon={X}
            className="text-stone-600 hover:text-stone-900"
          >
            Cancel Generation
          </Button>
        )}
      </div>
    </div>
  );
}

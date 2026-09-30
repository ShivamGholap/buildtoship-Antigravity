import React, { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { t } from "../../lib/i18n.js";

export function DisclaimerBanner({ language = "en", forceShow = false }) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!forceShow) {
      const isDismissed = sessionStorage.getItem("krishimitra_disclaimer_dismissed");
      if (isDismissed) setDismissed(true);
    }
  }, [forceShow]);

  if (dismissed && !forceShow) return null;

  const handleDismiss = () => {
    sessionStorage.setItem("krishimitra_disclaimer_dismissed", "true");
    setDismissed(true);
  };

  return (
    <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-3 text-amber-900 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-semibold">{t("disclaimer.badge", language)}: </span>
            {t("disclaimer.short", language)}
          </p>
        </div>
        {!forceShow && (
          <button
            onClick={handleDismiss}
            className="text-amber-700 hover:text-amber-950 p-1 rounded hover:bg-amber-100 min-h-[32px] min-w-[32px] flex items-center justify-center shrink-0"
            aria-label="Dismiss disclaimer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

import React from "react";
import { Button } from "./Button.jsx";
import { Sprout } from "lucide-react";

export function EmptyState({
  icon: Icon = Sprout,
  title,
  description,
  actionText,
  onAction,
  className = "",
}) {
  return (
    <div
      className={`text-center p-8 sm:p-12 bg-white rounded-xl border border-dashed border-stone-300 max-w-lg mx-auto ${className}`}
    >
      <div className="w-14 h-14 bg-brand-50 text-brand-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-semibold text-stone-900 mb-1.5">{title}</h3>
      <p className="text-sm text-stone-500 mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionText}
        </Button>
      )}
    </div>
  );
}

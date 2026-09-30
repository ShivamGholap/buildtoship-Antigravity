import React from "react";
import { Button } from "./Button.jsx";
import { AlertCircle, RefreshCw } from "lucide-react";

export function ErrorState({
  title = "Something went wrong",
  message = "An error occurred while loading this content.",
  onRetry,
  className = "",
}) {
  return (
    <div
      className={`text-center p-8 bg-red-50/50 rounded-xl border border-red-200/80 max-w-lg mx-auto ${className}`}
    >
      <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-stone-900 mb-1">{title}</h3>
      <p className="text-sm text-stone-600 mb-5">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" icon={RefreshCw}>
          Try Again
        </Button>
      )}
    </div>
  );
}

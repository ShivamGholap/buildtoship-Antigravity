import React from "react";
import { Loader2 } from "lucide-react";

export function Spinner({ size = "md", className = "", message }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  return (
    <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
      <Loader2 className={`${sizeClasses[size] || sizeClasses.md} animate-spin text-brand-700`} />
      {message && <p className="mt-2 text-sm text-stone-500 font-medium">{message}</p>}
    </div>
  );
}

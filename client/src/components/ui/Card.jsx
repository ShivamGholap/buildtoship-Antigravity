import React from "react";

export function Card({ children, className = "", hover = false, ...props }) {
  return (
    <div
      className={`bg-white rounded-xl border border-stone-200/80 shadow-sm ${
        hover ? "hover:border-stone-300 hover:shadow transition-all" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return <div className={`p-4 sm:p-5 border-b border-stone-100 ${className}`}>{children}</div>;
}

export function CardContent({ children, className = "" }) {
  return <div className={`p-4 sm:p-5 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
  return (
    <div className={`p-4 sm:p-5 bg-stone-50/50 border-t border-stone-100 rounded-b-xl ${className}`}>
      {children}
    </div>
  );
}

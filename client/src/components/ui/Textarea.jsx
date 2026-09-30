import React from "react";

export const Textarea = React.forwardRef(function Textarea(
  {
    label,
    error,
    helperText,
    id,
    rows = 3,
    maxLength,
    required = false,
    className = "",
    containerClassName = "",
    value,
    ...props
  },
  ref
) {
  const textareaId = id || props.name;

  return (
    <div className={`w-full ${containerClassName}`}>
      <div className="flex items-center justify-between mb-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-stone-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        {maxLength && value !== undefined && (
          <span className="text-xs text-stone-400">
            {typeof value === "string" ? value.length : 0}/{maxLength}
          </span>
        )}
      </div>
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        maxLength={maxLength}
        required={required}
        aria-invalid={error ? "true" : "false"}
        className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-stone-900 placeholder-stone-400 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-brand-700 ${
          error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-stone-300"
        } ${className}`}
        value={value}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {!error && helperText && <p className="mt-1 text-xs text-stone-500">{helperText}</p>}
    </div>
  );
});

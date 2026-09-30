import React from "react";

export const Select = React.forwardRef(function Select(
  {
    label,
    error,
    helperText,
    id,
    options = [],
    placeholder = "Select an option",
    required = false,
    className = "",
    containerClassName = "",
    ...props
  },
  ref
) {
  const selectId = id || props.name;

  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-stone-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        required={required}
        aria-invalid={error ? "true" : "false"}
        className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-stone-900 text-sm min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-brand-700 ${
          error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-stone-300"
        } ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => {
          const val = typeof opt === "string" ? opt : opt.value;
          const lbl = typeof opt === "string" ? opt : opt.label || opt.name || opt.value;
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {!error && helperText && <p className="mt-1 text-xs text-stone-500">{helperText}</p>}
    </div>
  );
});

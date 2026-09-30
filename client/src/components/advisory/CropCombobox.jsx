import React, { useState } from "react";
import { Input } from "../ui/Input.jsx";

export const CropCombobox = React.forwardRef(function CropCombobox(
  {
    catalog = [],
    value = "",
    onChange,
    error,
    label = "Crop Name",
    required = true,
    className = "",
    ...props
  },
  ref
) {
  const [showCatalog, setShowCatalog] = useState(false);

  // Group catalog by category
  const categories = catalog.reduce((acc, item) => {
    const cat = item.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item.name);
    return acc;
  }, {});

  const handleSelect = (cropName) => {
    onChange({ target: { value: cropName } });
    setShowCatalog(false);
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-medium text-stone-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowCatalog(!showCatalog)}
          className="text-xs text-brand-700 hover:text-brand-800 font-medium hover:underline"
        >
          {showCatalog ? "Close crop suggestions" : "Browse common crops"}
        </button>
      </div>

      <Input
        ref={ref}
        value={value}
        onChange={onChange}
        placeholder="Type crop name (e.g. Cotton, Tomato, Wheat)"
        error={error}
        required={required}
        {...props}
      />

      {showCatalog && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-stone-200 rounded-xl shadow-xl max-h-64 overflow-y-auto p-3 space-y-3">
          {Object.entries(categories).map(([cat, crops]) => (
            <div key={cat}>
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                {cat}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {crops.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleSelect(c)}
                    className="px-2.5 py-1 text-xs bg-stone-100 hover:bg-brand-50 hover:text-brand-800 text-stone-800 rounded-md transition-colors"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

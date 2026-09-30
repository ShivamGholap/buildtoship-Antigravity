import React from "react";
import { capitalize } from "../../lib/formatters.js";
import { Check } from "lucide-react";

export function ChipMultiSelect({
  categories = {},
  selectedChips = [],
  onChange,
  error,
  label = "Observed Symptoms",
}) {
  const toggleChip = (chip) => {
    if (chip === "none seen") {
      // If clicking 'none seen', deselect other visible pests
      if (selectedChips.includes("none seen")) {
        onChange(selectedChips.filter((c) => c !== "none seen"));
      } else {
        onChange([...selectedChips.filter((c) => !categories.pests_visible?.includes(c)), "none seen"]);
      }
      return;
    }

    if (selectedChips.includes(chip)) {
      onChange(selectedChips.filter((c) => c !== chip));
    } else {
      // If adding a pest, remove 'none seen'
      const updated = selectedChips.filter((c) => c !== "none seen");
      onChange([...updated, chip]);
    }
  };

  const categoryTitles = {
    leaf: "Leaf Symptoms",
    stem_root: "Stem & Root Symptoms",
    fruit_grain: "Fruit & Grain Symptoms",
    whole_plant: "Whole Plant Symptoms",
    pests_visible: "Insects / Pests Visible",
  };

  return (
    <div className="w-full space-y-4">
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          {label} <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-stone-500">
          Click all chips that match what you observe in the field:
        </p>
      </div>

      <div className="space-y-4">
        {Object.entries(categories).map(([categoryKey, chips]) => (
          <div key={categoryKey} className="bg-stone-50/60 p-3.5 rounded-xl border border-stone-200/80">
            <h4 className="text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2.5">
              {categoryTitles[categoryKey] || capitalize(categoryKey)}
            </h4>
            <div className="flex flex-wrap gap-2">
              {chips.map((chip) => {
                const isSelected = selectedChips.includes(chip);
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => toggleChip(chip)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all min-h-[36px] select-none border cursor-pointer ${
                      isSelected
                        ? "bg-brand-700 text-white border-brand-800 shadow-sm"
                        : "bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-stone-100"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{capitalize(chip)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

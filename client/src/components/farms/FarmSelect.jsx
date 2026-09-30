import React from "react";
import { Link } from "react-router-dom";
import { FarmSummaryChip } from "./FarmSummaryChip.jsx";
import { Plus } from "lucide-react";

export const FarmSelect = React.forwardRef(function FarmSelect(
  {
    farms = [],
    selectedFarmId,
    onChange,
    error,
    name = "farm_id",
    className = "",
    ...props
  },
  ref
) {
  const selectedFarm = farms.find((f) => f.id === selectedFarmId);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={name} className="block text-sm font-medium text-stone-700">
          Select Farm <span className="text-red-500">*</span>
        </label>
        <Link
          to="/farms/new"
          className="text-xs text-brand-700 hover:text-brand-800 font-medium inline-flex items-center gap-1 hover:underline"
        >
          <Plus className="w-3 h-3" /> Add new farm
        </Link>
      </div>

      <select
        ref={ref}
        id={name}
        name={name}
        value={selectedFarmId || ""}
        onChange={onChange}
        className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-stone-900 text-sm min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-brand-700 ${
          error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-stone-300"
        }`}
        {...props}
      >
        <option value="" disabled>
          {farms.length === 0 ? "No farms available - please add one first" : "Choose your farm"}
        </option>
        {farms.map((farm) => (
          <option key={farm.id} value={farm.id}>
            {farm.name} - {farm.district}, {farm.state} ({farm.land_size} {farm.land_unit})
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}

      {/* Auto-filled farm summary details */}
      {selectedFarm && (
        <div className="mt-2.5">
          <FarmSummaryChip farm={selectedFarm} />
        </div>
      )}
    </div>
  );
});

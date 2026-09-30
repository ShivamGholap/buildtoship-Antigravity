import React from "react";
import { formatLandSize, capitalize } from "../../lib/formatters.js";
import { Trees, Droplet, Mountain } from "lucide-react";

export function FarmSummaryChip({ farm, className = "" }) {
  if (!farm) return null;

  return (
    <div
      className={`flex flex-wrap items-center gap-2 p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-700 ${className}`}
    >
      <div className="flex items-center gap-1 font-medium text-stone-900">
        <Trees className="w-3.5 h-3.5 text-brand-700" />
        <span>{farm.name}</span>
        <span className="text-stone-400">({formatLandSize(farm.land_size, farm.land_unit)})</span>
      </div>

      <span className="text-stone-300">|</span>

      <div className="flex items-center gap-1">
        <Mountain className="w-3.5 h-3.5 text-amber-700" />
        <span>Soil: {capitalize(farm.soil_type)}</span>
        {farm.soil_ph != null && <span>(pH {farm.soil_ph})</span>}
      </div>

      <span className="text-stone-300">|</span>

      <div className="flex items-center gap-1">
        <Droplet className="w-3.5 h-3.5 text-blue-600" />
        <span>Water: {capitalize(farm.water_availability)} ({capitalize(farm.irrigation_source)})</span>
      </div>
    </div>
  );
}

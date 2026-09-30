import React from "react";
import { Badge } from "../../ui/Badge.jsx";
import { formatDate, capitalize } from "../../../lib/formatters.js";
import {
  Compass,
  AlertCircle,
  FlaskConical,
  Droplets,
  CalendarDays,
  Trees,
  Clock,
  Globe,
  Camera
} from "lucide-react";

const TYPE_CONFIG = {
  crop_recommendation: { label: "Crop Recommendation", icon: Compass, variant: "brand" },
  disease_diagnosis: { label: "Pest & Disease Diagnosis", icon: AlertCircle, variant: "danger" },
  fertilizer_plan: { label: "Fertilizer & Nutrient Plan", icon: FlaskConical, variant: "warning" },
  irrigation_plan: { label: "Irrigation & Water Plan", icon: Droplets, variant: "info" },
  seasonal_calendar: { label: "Seasonal Crop Calendar", icon: CalendarDays, variant: "default" },
};

export function AdvisoryHeader({ advisory }) {
  const typeMeta = TYPE_CONFIG[advisory.type] || {
    label: capitalize(advisory.type),
    icon: Compass,
    variant: "default",
  };
  const Icon = typeMeta.icon;
  const farmName = advisory.farm_snapshot?.name || "Farm";
  const farmDistrict = advisory.farm_snapshot?.district;
  const farmState = advisory.farm_snapshot?.state;

  const langNames = { en: "English", hi: "हिन्दी", mr: "मराठी" };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-sm mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={typeMeta.variant} className="flex items-center gap-1.5 py-1 px-3">
            <Icon className="w-3.5 h-3.5" />
            <span className="font-semibold">{typeMeta.label}</span>
          </Badge>

          {advisory.had_image && (
            <Badge variant="info" className="flex items-center gap-1 py-1 px-2.5">
              <Camera className="w-3 h-3" />
              <span>With Leaf Photo</span>
            </Badge>
          )}

          <Badge variant="default" className="flex items-center gap-1 py-1 px-2.5">
            <Globe className="w-3 h-3 text-stone-400" />
            <span>{langNames[advisory.language] || advisory.language.toUpperCase()}</span>
          </Badge>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-stone-400">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatDate(advisory.created_at)}</span>
        </div>
      </div>

      <h1 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
        {advisory.title}
      </h1>

      <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-500 mt-2">
        <Trees className="w-4 h-4 text-brand-700 shrink-0" />
        <span>
          <strong>{farmName}</strong>
          {farmDistrict && ` (${farmDistrict}, ${farmState})`}
          {advisory.farm_snapshot?.soil_type && ` • ${capitalize(advisory.farm_snapshot.soil_type)} Soil`}
          {advisory.farm_snapshot?.land_size && ` • ${advisory.farm_snapshot.land_size} ${advisory.farm_snapshot.land_unit}`}
        </span>
      </div>
    </div>
  );
}

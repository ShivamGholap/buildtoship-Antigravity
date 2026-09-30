import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "../ui/Badge.jsx";
import { formatDate, capitalize } from "../../lib/formatters.js";
import {
  Compass,
  AlertCircle,
  FlaskConical,
  Droplets,
  CalendarDays,
  ArrowRight,
  Camera,
  Trees
} from "lucide-react";

const TYPE_CONFIG = {
  crop_recommendation: { label: "Crop Recommendation", icon: Compass, variant: "brand" },
  disease_diagnosis: { label: "Disease Diagnosis", icon: AlertCircle, variant: "danger" },
  fertilizer_plan: { label: "Fertilizer Plan", icon: FlaskConical, variant: "warning" },
  irrigation_plan: { label: "Irrigation Plan", icon: Droplets, variant: "info" },
  seasonal_calendar: { label: "Seasonal Calendar", icon: CalendarDays, variant: "default" },
};

export function AdvisoryListItem({ advisory }) {
  const meta = TYPE_CONFIG[advisory.type] || {
    label: capitalize(advisory.type),
    icon: Compass,
    variant: "default",
  };
  const Icon = meta.icon;

  const farmName = advisory.farm_snapshot?.name || "Farm";

  return (
    <Link
      to={`/advisories/${advisory.id}`}
      className="block p-4 sm:p-5 bg-white rounded-xl border border-stone-200/80 shadow-sm hover:border-brand-500/50 hover:shadow transition-all group"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={meta.variant} className="flex items-center gap-1 text-[11px] py-0.5">
              <Icon className="w-3 h-3" />
              <span>{meta.label}</span>
            </Badge>

            {advisory.had_image && (
              <Badge variant="info" className="flex items-center gap-1 text-[11px] py-0.5">
                <Camera className="w-3 h-3" />
                <span>Photo</span>
              </Badge>
            )}

            <span className="text-xs text-stone-400">
              {formatDate(advisory.created_at)}
            </span>
          </div>

          <h3 className="text-base font-semibold text-stone-900 group-hover:text-brand-800 transition-colors">
            {advisory.title}
          </h3>

          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Trees className="w-3.5 h-3.5 text-brand-700 shrink-0" />
            <span>{farmName}</span>
            {advisory.farm_snapshot?.district && (
              <span>({advisory.farm_snapshot.district}, {advisory.farm_snapshot.state})</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs font-medium text-brand-700 shrink-0 sm:self-center">
          <span>View Advisory</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

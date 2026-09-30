import React from "react";
import { Link } from "react-router-dom";
import { Card } from "../ui/Card.jsx";
import {
  Compass,
  AlertCircle,
  FlaskConical,
  Droplets,
  CalendarDays,
  ArrowRight
} from "lucide-react";

const ADVISORY_ICONS = {
  crop_recommendation: {
    icon: Compass,
    color: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  disease_diagnosis: {
    icon: AlertCircle,
    color: "text-rose-700 bg-rose-50 border-rose-200",
  },
  fertilizer_plan: {
    icon: FlaskConical,
    color: "text-amber-700 bg-amber-50 border-amber-200",
  },
  irrigation_plan: {
    icon: Droplets,
    color: "text-blue-700 bg-blue-50 border-blue-200",
  },
  seasonal_calendar: {
    icon: CalendarDays,
    color: "text-indigo-700 bg-indigo-50 border-indigo-200",
  },
};

export function AdvisoryTypeCard({ type, title, description, href }) {
  const meta = ADVISORY_ICONS[type] || {
    icon: Compass,
    color: "text-brand-700 bg-brand-50 border-brand-200",
  };
  const Icon = meta.icon;

  return (
    <Link to={href} className="group block h-full">
      <Card
        hover
        className="h-full p-5 flex flex-col justify-between border-stone-200 group-hover:border-brand-500/50 group-hover:ring-1 group-hover:ring-brand-500/20 transition-all duration-200"
      >
        <div>
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-4 shadow-sm ${meta.color}`}
          >
            <Icon className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-base text-stone-900 group-hover:text-brand-800 transition-colors mb-1.5">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-medium text-brand-700">
          <span>Start Advisory</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </Card>
    </Link>
  );
}

export function AdvisoryTypeGrid({ types = [] }) {
  const defaultTypes = [
    {
      value: "crop_recommendation",
      label: "Crop Recommendation",
      description: "Ranked crop choices based on your farm's soil, season, water, and budget goals.",
      href: "/advisory/crop-recommendation",
    },
    {
      value: "disease_diagnosis",
      label: "Pest & Disease Diagnosis",
      description: "Identify symptoms with optional leaf photo upload, IPM treatment, and biological solutions.",
      href: "/advisory/disease-diagnosis",
    },
    {
      value: "fertilizer_plan",
      label: "Fertilizer & Nutrient Plan",
      description: "Stage-wise dosage schedules with organic and balanced inorganic options per acre/hectare.",
      href: "/advisory/fertilizer-plan",
    },
    {
      value: "irrigation_plan",
      label: "Irrigation & Water Plan",
      description: "Growth-stage watering schedule, critical stages, and practical water-saving tips.",
      href: "/advisory/irrigation-plan",
    },
    {
      value: "seasonal_calendar",
      label: "Seasonal Crop Calendar",
      description: "Month-by-month task checklist from land preparation to harvest and storage.",
      href: "/advisory/seasonal-calendar",
    },
  ];

  const items = types.length > 0 ? types : defaultTypes;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {items.map((item) => (
        <AdvisoryTypeCard
          key={item.value}
          type={item.value}
          title={item.label}
          description={item.description}
          href={item.href || `/advisory/${item.value.replace(/_/g, "-")}`}
        />
      ))}
    </div>
  );
}

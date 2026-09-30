import React from "react";
import { Card, CardContent } from "../../ui/Card.jsx";
import { Badge } from "../../ui/Badge.jsx";
import {
  Droplets,
  Calendar,
  AlertCircle,
  Lightbulb,
  ArrowUpRight,
  TrendingDown,
  Info
} from "lucide-react";

export function IrrigationPlanView({ result }) {
  if (!result) return null;

  return (
    <div className="space-y-6">
      {/* Executive Summary & Current Crop Status */}
      <Card className="border-blue-200 bg-blue-50/40">
        <CardContent className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <h2 className="text-base font-semibold text-blue-950 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-700" />
              Irrigation Strategy & Water Management
            </h2>
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="brand">Age: {result.crop_age_days} Days</Badge>
              <Badge variant="info">Current: {result.current_stage}</Badge>
            </div>
          </div>
          <p className="text-sm text-stone-800 leading-relaxed">{result.summary}</p>
        </CardContent>
      </Card>

      {/* Critical Moisture Stages Banner */}
      {result.critical_stages?.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-5">
            <h3 className="text-sm font-bold text-amber-950 mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Critical Yield-Sensitive Stages (Never Allow Moisture Stress Here!)
            </h3>
            <div className="flex flex-wrap gap-2 text-xs">
              {result.critical_stages.map((stage, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white font-semibold text-amber-900 border border-amber-300 rounded-lg shadow-sm"
                >
                  {stage}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Growth-Stage Irrigation Schedule */}
      <div>
        <h2 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand-700" />
          Growth Stage Watering Schedule
        </h2>

        <div className="space-y-3">
          {result.schedule?.map((item, idx) => (
            <Card key={idx} className="overflow-hidden border-stone-200">
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-stone-900">{item.stage}</span>
                    <Badge variant="default" className="text-xs">
                      {item.approx_days_range}
                    </Badge>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{item.notes}</p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 text-xs">
                  <div className="text-stone-700">
                    Interval: <strong className="text-stone-900">{item.interval_days}</strong>
                  </div>
                  <div className="text-blue-700 font-semibold mt-0.5">
                    {item.amount_guidance}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Warning Signs: Overwatering vs Underwatering */}
      {result.warning_signs && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-amber-200">
            <CardContent className="p-5">
              <h3 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-amber-600" />
                Signs of Over-Watering
              </h3>
              <ul className="space-y-1.5 text-xs text-stone-700 pl-4 list-disc">
                {result.warning_signs.overwatering?.map((sign, idx) => (
                  <li key={idx}>{sign}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-rose-200">
            <CardContent className="p-5">
              <h3 className="text-sm font-bold text-rose-900 mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                Signs of Moisture Deficit / Under-Watering
              </h3>
              <ul className="space-y-1.5 text-xs text-stone-700 pl-4 list-disc">
                {result.warning_signs.underwatering?.map((sign, idx) => (
                  <li key={idx}>{sign}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Water Saving Tips & Method Upgrades */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {result.water_saving_tips?.length > 0 && (
          <Card className="border-stone-200">
            <CardContent className="p-5">
              <h3 className="text-sm font-bold text-stone-900 mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-brand-700" />
                Practical Water-Saving Tips
              </h3>
              <ul className="space-y-1.5 text-xs text-stone-700 pl-4 list-disc">
                {result.water_saving_tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {result.method_upgrade_suggestions?.length > 0 && (
          <Card className="border-stone-200">
            <CardContent className="p-5">
              <h3 className="text-sm font-bold text-stone-900 mb-2 flex items-center gap-1.5">
                <ArrowUpRight className="w-4 h-4 text-blue-600" />
                Recommended Method Upgrades & Payoff
              </h3>
              <ul className="space-y-1.5 text-xs text-stone-700 pl-4 list-disc">
                {result.method_upgrade_suggestions.map((upg, idx) => (
                  <li key={idx}>{upg}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-stone-100/70 rounded-xl border border-stone-200 text-xs text-stone-600 flex items-start gap-2">
        <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">{result.disclaimer}</p>
      </div>
    </div>
  );
}

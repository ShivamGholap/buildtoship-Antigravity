import React from "react";
import { Card, CardContent } from "../../ui/Card.jsx";
import { Badge } from "../../ui/Badge.jsx";
import { capitalize } from "../../../lib/formatters.js";
import {
  CalendarDays,
  Clock,
  AlertTriangle,
  Eye,
  CloudSun,
  CheckCircle2,
  Info
} from "lucide-react";

const TASK_CATEGORY_COLORS = {
  land_preparation: "bg-amber-50 text-amber-900 border-amber-200",
  sowing: "bg-emerald-50 text-emerald-900 border-emerald-200",
  nutrient: "bg-purple-50 text-purple-900 border-purple-200",
  irrigation: "bg-blue-50 text-blue-900 border-blue-200",
  protection: "bg-rose-50 text-rose-900 border-rose-200",
  harvest: "bg-brand-50 text-brand-900 border-brand-200",
  post_harvest: "bg-stone-100 text-stone-900 border-stone-300",
  other: "bg-stone-50 text-stone-700 border-stone-200",
};

export function SeasonalCalendarView({ result }) {
  if (!result) return null;

  return (
    <div className="space-y-6">
      {/* Summary Banner */}
      <Card className="border-indigo-200 bg-indigo-50/40">
        <CardContent className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <h2 className="text-base font-semibold text-indigo-950 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-indigo-700" />
              Seasonal Crop Operations Calendar
            </h2>
            <Badge variant="brand" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              Total Duration: ~{result.total_duration_days} Days
            </Badge>
          </div>
          <p className="text-sm text-stone-800 leading-relaxed">{result.summary}</p>
        </CardContent>
      </Card>

      {/* Critical Deadlines Banner */}
      {result.critical_deadlines?.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-5">
            <h3 className="text-sm font-bold text-amber-950 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Critical Time-Bound Deadlines (Do Not Delay!)
            </h3>
            <ul className="space-y-1 text-xs text-amber-950 pl-5 list-disc">
              {result.critical_deadlines.map((dl, idx) => (
                <li key={idx} className="leading-relaxed font-medium">
                  {dl}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Month-by-Month Operational Cards */}
      <div className="space-y-4">
        {result.months?.map((m, idx) => (
          <Card key={idx} className="overflow-hidden border-stone-200">
            <div className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-brand-700 text-white font-bold text-sm flex items-center justify-center shrink-0">
                    {m.month_number}
                  </span>
                  <div>
                    <h3 className="font-bold text-base text-stone-900 leading-tight">
                      {m.month_name}
                      {m.year_offset > 0 && (
                        <span className="text-xs font-normal text-stone-400 ml-1.5">
                          (Year +{m.year_offset})
                        </span>
                      )}
                    </h3>
                    <span className="text-xs font-medium text-brand-700">Stage: {m.stage}</span>
                  </div>
                </div>
              </div>

              {/* Tasks List with category pills */}
              <div className="space-y-2 mb-4">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
                  Tasks & Field Operations:
                </span>
                <div className="space-y-2">
                  {m.tasks?.map((t, tIdx) => {
                    const pillClass =
                      TASK_CATEGORY_COLORS[t.category] || TASK_CATEGORY_COLORS.other;
                    return (
                      <div
                        key={tIdx}
                        className="flex flex-col sm:flex-row sm:items-center gap-2 p-2.5 bg-stone-50/70 rounded-lg border border-stone-100 text-xs"
                      >
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border shrink-0 w-fit ${pillClass}`}
                        >
                          {capitalize(t.category)}
                        </span>
                        <span className="text-stone-800 leading-relaxed">{t.task}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Scouting & Weather Watch */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-stone-100 text-xs">
                {m.scouting_focus?.length > 0 && (
                  <div className="bg-rose-50/40 p-2.5 rounded-lg border border-rose-100">
                    <span className="font-semibold text-rose-950 flex items-center gap-1 mb-1">
                      <Eye className="w-3.5 h-3.5 text-rose-600" />
                      Pest & Disease Scouting Focus:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-stone-700">
                      {m.scouting_focus.map((sf, sIdx) => (
                        <li key={sIdx}>{sf}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {m.weather_watch?.length > 0 && (
                  <div className="bg-amber-50/40 p-2.5 rounded-lg border border-amber-100">
                    <span className="font-semibold text-amber-950 flex items-center gap-1 mb-1">
                      <CloudSun className="w-3.5 h-3.5 text-amber-600" />
                      Seasonal Weather Risk Watch:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-stone-700">
                      {m.weather_watch.map((ww, wIdx) => (
                        <li key={wIdx}>{ww}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-stone-100/70 rounded-xl border border-stone-200 text-xs text-stone-600 flex items-start gap-2">
        <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">{result.disclaimer}</p>
      </div>
    </div>
  );
}

import React from "react";
import { Card, CardContent } from "../../ui/Card.jsx";
import { Badge } from "../../ui/Badge.jsx";
import { capitalize, getSuitabilityScoreColor } from "../../../lib/formatters.js";
import {
  CheckCircle2,
  AlertTriangle,
  Droplet,
  DollarSign,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight,
  Info
} from "lucide-react";

export function CropRecommendationView({ result }) {
  if (!result) return null;

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <Card className="border-brand-200 bg-brand-50/40">
        <CardContent className="p-5">
          <h2 className="text-base font-semibold text-brand-950 mb-2 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-700" />
            Agronomic Assessment Summary
          </h2>
          <p className="text-sm text-stone-800 leading-relaxed">{result.summary}</p>

          {result.assumptions?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-brand-200/60">
              <span className="text-xs font-semibold text-brand-900 block mb-1">
                Stated Assumptions:
              </span>
              <ul className="list-disc list-inside text-xs text-stone-700 space-y-1">
                {result.assumptions.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ranked Crop Recommendations */}
      <div>
        <h2 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
          <span>Ranked Crop Recommendations</span>
          <span className="text-xs font-normal text-stone-500">
            (Calculated for your soil, season, and budget)
          </span>
        </h2>

        <div className="space-y-4">
          {result.recommendations?.map((rec) => {
            const scoreColor = getSuitabilityScoreColor(rec.suitability_score);

            return (
              <Card key={rec.rank} className="overflow-hidden border-stone-200">
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-brand-700 text-white font-bold text-sm flex items-center justify-center shrink-0">
                        #{rec.rank}
                      </span>
                      <div>
                        <h3 className="text-lg font-bold text-stone-900 leading-tight">
                          {rec.crop}
                        </h3>
                        <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span>Duration: <strong>{rec.duration_days}</strong></span>
                        </p>
                      </div>
                    </div>

                    {/* Suitability score pill */}
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${scoreColor}`}
                    >
                      <span>Suitability Score:</span>
                      <span className="text-sm">{rec.suitability_score}%</span>
                    </div>
                  </div>

                  {/* Attribute badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-800 rounded-md border border-blue-200">
                      <Droplet className="w-3 h-3 text-blue-600" />
                      Water Need: <strong>{capitalize(rec.water_need)}</strong>
                    </span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 text-stone-800 rounded-md border border-stone-200">
                      <DollarSign className="w-3 h-3 text-stone-600" />
                      Input Cost: <strong>{capitalize(rec.input_cost_band)}</strong>
                    </span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 rounded-md border border-amber-200">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      Risk Level: <strong>{capitalize(rec.risk_level)}</strong>
                    </span>
                  </div>

                  {/* Why suitable */}
                  <div className="mb-3 text-sm text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-100">
                    <strong className="text-stone-900 block mb-1">Why Suitable for Your Farm:</strong>
                    <p className="leading-relaxed">{rec.why_suitable}</p>
                  </div>

                  {/* Rotation benefit */}
                  {rec.rotation_benefit && (
                    <div className="mb-3 text-xs text-stone-700 flex items-start gap-2 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100">
                      <Layers className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-emerald-900">Crop Rotation Benefit: </strong>
                        <span>{rec.rotation_benefit}</span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-3 border-t border-stone-100 text-xs">
                    {/* Suggested Practices */}
                    {rec.suggested_practices?.length > 0 && (
                      <div>
                        <span className="font-semibold text-stone-900 block mb-1.5 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-700" />
                          Recommended Best Practices:
                        </span>
                        <ul className="space-y-1 text-stone-600 pl-4 list-disc">
                          {rec.suggested_practices.map((p, idx) => (
                            <li key={idx}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Main Risks */}
                    {rec.main_risks?.length > 0 && (
                      <div>
                        <span className="font-semibold text-stone-900 block mb-1.5 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          Key Risks & Mitigation:
                        </span>
                        <ul className="space-y-1 text-stone-600 pl-4 list-disc">
                          {rec.main_risks.map((r, idx) => (
                            <li key={idx}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Crops to Avoid */}
      {result.avoid_crops?.length > 0 && (
        <Card className="border-red-200 bg-red-50/30">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-red-900 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              Crops NOT Recommended for this Farm & Season
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {result.avoid_crops.map((avoid, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg border border-red-100">
                  <strong className="text-red-950 block">{avoid.crop}</strong>
                  <p className="text-stone-600 mt-0.5">{avoid.reason}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Immediate 2-Week Key Actions */}
      {result.key_actions?.length > 0 && (
        <Card className="border-stone-200">
          <CardContent className="p-5">
            <h3 className="text-base font-semibold text-stone-900 mb-3 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-brand-700" />
              Immediate Key Actions (Next 2 Weeks)
            </h3>
            <ol className="space-y-2 text-sm text-stone-700 list-decimal list-inside">
              {result.key_actions.map((act, idx) => (
                <li key={idx} className="leading-relaxed">
                  <span className="text-stone-800">{act}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <div className="p-4 bg-stone-100/70 rounded-xl border border-stone-200 text-xs text-stone-600 flex items-start gap-2">
        <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">{result.disclaimer}</p>
      </div>
    </div>
  );
}

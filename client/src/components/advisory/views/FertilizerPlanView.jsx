import React from "react";
import { Card, CardContent } from "../../ui/Card.jsx";
import { Badge } from "../../ui/Badge.jsx";
import {
  FlaskConical,
  FileText,
  AlertTriangle,
  Leaf,
  CheckCircle2,
  Calendar,
  Info
} from "lucide-react";

export function FertilizerPlanView({ result }) {
  if (!result) return null;

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <Card className="border-amber-200 bg-amber-50/40">
        <CardContent className="p-5">
          <h2 className="text-base font-semibold text-amber-950 mb-2 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-amber-700" />
            Nutrient Management Strategy
          </h2>
          <p className="text-sm text-stone-800 leading-relaxed">{result.summary}</p>

          {result.assumptions?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-amber-200/60">
              <span className="text-xs font-semibold text-amber-900 block mb-1">
                Assumptions:
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

      {/* Soil Test Recommendation Banner (if no test was provided) */}
      {result.soil_test_recommended && (
        <Card className="border-blue-200 bg-blue-50/40">
          <CardContent className="p-5">
            <h3 className="text-sm font-bold text-blue-950 mb-1.5 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-700" />
              Soil Health Card Highly Recommended
            </h3>
            <p className="text-xs text-stone-700 mb-3 leading-relaxed">
              Standard fertilizer dosage ranges are provided below, but a laboratory soil test enables exact, cost-saving application without risking nutrient imbalances.
            </p>
            {result.soil_test_guidance?.length > 0 && (
              <div className="bg-white p-3 rounded-lg border border-blue-100 text-xs">
                <span className="font-semibold text-stone-900 block mb-1">
                  How to test your soil in 3 steps:
                </span>
                <ol className="list-decimal list-inside space-y-1 text-stone-700">
                  {result.soil_test_guidance.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stage-wise Nutrient Schedule */}
      <div>
        <h2 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand-700" />
          Stage-wise Split Nutrient Schedule
        </h2>

        <div className="space-y-4">
          {result.stages?.map((stg, idx) => (
            <Card key={idx} className="overflow-hidden border-stone-200">
              <div className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <h3 className="font-bold text-base text-stone-900 leading-tight">
                        {stg.stage}
                      </h3>
                      <span className="text-xs text-stone-500">{stg.timing}</span>
                    </div>
                  </div>
                  <Badge variant="brand" className="text-xs">
                    Method: {stg.method}
                  </Badge>
                </div>

                {/* N-P-K Dosage Ranges */}
                <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-stone-50 rounded-xl border border-stone-100 text-center">
                  <div className="p-1">
                    <span className="text-[11px] font-bold text-stone-500 uppercase block">
                      Nitrogen (N)
                    </span>
                    <span className="text-sm font-bold text-stone-900">{stg.n_range}</span>
                  </div>
                  <div className="p-1 border-x border-stone-200">
                    <span className="text-[11px] font-bold text-stone-500 uppercase block">
                      Phosphorus (P₂O₅)
                    </span>
                    <span className="text-sm font-bold text-stone-900">{stg.p2o5_range}</span>
                  </div>
                  <div className="p-1">
                    <span className="text-[11px] font-bold text-stone-500 uppercase block">
                      Potassium (K₂O)
                    </span>
                    <span className="text-sm font-bold text-stone-900">{stg.k2o_range}</span>
                  </div>
                </div>

                {/* Organic & Chemical Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-3">
                  {stg.organic_options?.length > 0 && (
                    <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                      <span className="font-semibold text-emerald-950 block mb-1.5 flex items-center gap-1">
                        <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                        Organic / Biological Options:
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-stone-700">
                        {stg.organic_options.map((opt, oIdx) => (
                          <li key={oIdx}>{opt}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {stg.chemical_options?.length > 0 && (
                    <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
                      <span className="font-semibold text-stone-900 block mb-1.5 flex items-center gap-1">
                        <FlaskConical className="w-3.5 h-3.5 text-amber-700" />
                        Chemical / Commercial Options:
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-stone-700">
                        {stg.chemical_options.map((chem, cIdx) => (
                          <li key={cIdx}>{chem}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Precautions */}
                {stg.precautions?.length > 0 && (
                  <div className="mt-2 text-xs text-amber-900 bg-amber-50/70 p-2.5 rounded-lg border border-amber-200/60 flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <strong>Precautions: </strong>
                      <span>{stg.precautions.join("; ")}</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Micronutrients & Common Mistakes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {result.micronutrient_notes?.length > 0 && (
          <Card className="border-stone-200">
            <CardContent className="p-5">
              <h3 className="text-sm font-bold text-stone-900 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-700" />
                Micronutrient & Soil Amendment Notes
              </h3>
              <ul className="space-y-1.5 text-xs text-stone-700 pl-4 list-disc">
                {result.micronutrient_notes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {result.common_mistakes?.length > 0 && (
          <Card className="border-stone-200">
            <CardContent className="p-5">
              <h3 className="text-sm font-bold text-stone-900 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Common Application Mistakes to Avoid
              </h3>
              <ul className="space-y-1.5 text-xs text-stone-700 pl-4 list-disc">
                {result.common_mistakes.map((mistake, idx) => (
                  <li key={idx}>{mistake}</li>
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

import React, { useState } from "react";
import { Card, CardContent } from "../../ui/Card.jsx";
import { Badge } from "../../ui/Badge.jsx";
import { capitalize, getUrgencyBadgeColor } from "../../../lib/formatters.js";
import {
  AlertTriangle,
  ShieldAlert,
  Search,
  CheckCircle2,
  Bug,
  Leaf,
  Wrench,
  FlaskRound,
  PhoneCall,
  Info,
  Camera
} from "lucide-react";

export function DiseaseDiagnosisView({ result }) {
  const [activeTreatmentTab, setActiveTreatmentTab] = useState("cultural");

  if (!result) return null;

  const urgencyClass = getUrgencyBadgeColor(result.urgency);

  const treatmentTabs = [
    { id: "cultural", label: "Cultural Practices", icon: Leaf },
    { id: "mechanical", label: "Mechanical / Physical", icon: Wrench },
    { id: "biological", label: "Biological Control (IPM)", icon: Bug },
    { id: "chemical", label: "Chemical (Last Resort)", icon: FlaskRound },
  ];

  return (
    <div className="space-y-6">
      {/* Urgency & Executive Summary Banner */}
      <Card className="border-stone-200">
        <CardContent className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-700" />
              Diagnostic Evaluation
            </h2>
            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${urgencyClass}`}>
              Urgency: {capitalize(result.urgency)} Action Required
            </div>
          </div>

          <p className="text-sm text-stone-800 leading-relaxed mb-3">{result.summary}</p>

          {/* Photo observations if provided */}
          {result.image_observations && (
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs text-stone-700 flex items-start gap-2">
              <Camera className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900">Image Visual Observations: </strong>
                <span>{result.image_observations}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Immediate Emergency Actions */}
      {result.immediate_actions?.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/40">
          <CardContent className="p-5">
            <h3 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              Immediate Actions to Take Today
            </h3>
            <ul className="space-y-1.5 text-xs text-amber-950 pl-5 list-disc">
              {result.immediate_actions.map((act, idx) => (
                <li key={idx} className="leading-relaxed">
                  {act}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Probable Causes with Confidence Bar */}
      <div>
        <h2 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-brand-700" />
          Probable Causes (Ranked by Diagnostic Confidence)
        </h2>

        <div className="space-y-4">
          {result.probable_causes?.map((cause, idx) => (
            <Card key={idx} className="overflow-hidden border-stone-200">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-stone-900">{cause.name}</span>
                    <Badge variant="default" className="text-[11px]">
                      {capitalize(cause.category)}
                    </Badge>
                  </div>
                  <div className="text-xs font-semibold text-stone-600">
                    Confidence: <strong>{cause.confidence}%</strong>
                  </div>
                </div>

                {/* Confidence Bar */}
                <div className="w-full bg-stone-100 rounded-full h-2 mb-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      cause.confidence >= 75
                        ? "bg-rose-600"
                        : cause.confidence >= 50
                        ? "bg-amber-500"
                        : "bg-stone-400"
                    }`}
                    style={{ width: `${cause.confidence}%` }}
                  />
                </div>

                <p className="text-sm text-stone-700 leading-relaxed mb-3">{cause.explanation}</p>

                {/* Distinguishing signs */}
                {cause.distinguishing_signs?.length > 0 && (
                  <div className="bg-stone-50 p-3 rounded-lg border border-stone-100 text-xs">
                    <strong className="text-stone-900 block mb-1">
                      Distinguishing Signs to Verify in the Field:
                    </strong>
                    <ul className="list-disc list-inside space-y-1 text-stone-600">
                      {cause.distinguishing_signs.map((sign, sIdx) => (
                        <li key={sIdx}>{sign}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Integrated Pest Management (IPM) Treatment Tabs */}
      <Card className="border-stone-200">
        <CardContent className="p-5">
          <h2 className="text-base font-bold text-stone-900 mb-1 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-brand-700" />
            IPM-First Treatment & Control Plan
          </h2>
          <p className="text-xs text-stone-500 mb-4">
            Follow ecological IPM hierarchy: cultural & biological first, chemical only as a calculated last resort.
          </p>

          {/* Treatment Tabs Navigation */}
          <div className="flex border-b border-stone-200 overflow-x-auto gap-1 mb-4">
            {treatmentTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTreatmentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTreatmentTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors min-h-[44px] cursor-pointer ${
                    isActive
                      ? "border-brand-700 text-brand-800 bg-brand-50/50 rounded-t-lg"
                      : "border-transparent text-stone-500 hover:text-stone-800"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="min-h-[120px] text-xs">
            {activeTreatmentTab === "cultural" && (
              <ul className="space-y-2 list-disc list-inside text-stone-700">
                {result.treatment_plan?.cultural?.map((item, idx) => (
                  <li key={idx} className="leading-relaxed">
                    <span className="text-stone-800">{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTreatmentTab === "mechanical" && (
              <ul className="space-y-2 list-disc list-inside text-stone-700">
                {result.treatment_plan?.mechanical?.map((item, idx) => (
                  <li key={idx} className="leading-relaxed">
                    <span className="text-stone-800">{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTreatmentTab === "biological" && (
              <ul className="space-y-2 list-disc list-inside text-stone-700">
                {result.treatment_plan?.biological?.map((item, idx) => (
                  <li key={idx} className="leading-relaxed">
                    <span className="text-stone-800">{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTreatmentTab === "chemical" && (
              <div className="space-y-3">
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 leading-relaxed">
                  <strong>Pesticide Safety Warning: </strong> Chemical sprays must follow exact product label directions and pre-harvest intervals. Always use protective gloves and face mask. Confirm local recommendation at your nearest KVK.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.treatment_plan?.chemical?.map((chem, idx) => (
                    <div key={idx} className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                      <strong className="text-sm font-bold text-stone-900 block mb-0.5">
                        Active Ingredient: {chem.active_ingredient}
                      </strong>
                      <span className="text-stone-600 block mb-1">Target: {chem.target}</span>
                      <p className="text-stone-500 italic mt-1 pt-1 border-t border-stone-200/60">
                        {chem.safety_note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Prevention & When to Call Expert */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {result.prevention?.length > 0 && (
          <Card className="border-stone-200">
            <CardContent className="p-5">
              <h3 className="text-sm font-bold text-stone-900 mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-brand-700" />
                Preventive Measures for Next Season
              </h3>
              <ul className="space-y-1.5 text-xs text-stone-700 pl-4 list-disc">
                {result.prevention.map((prev, idx) => (
                  <li key={idx}>{prev}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <Card className="border-stone-200">
          <CardContent className="p-5">
            <h3 className="text-sm font-bold text-stone-900 mb-2 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-blue-600" />
              When to Consult a Local Expert
            </h3>
            <p className="text-xs text-stone-700 leading-relaxed mb-3">
              {result.when_to_call_expert}
            </p>
            {result.information_needed?.length > 0 && (
              <div className="bg-blue-50/60 p-3 rounded-lg border border-blue-100 text-xs">
                <span className="font-semibold text-blue-900 block mb-1">
                  Information to Bring to the KVK / Agri Officer:
                </span>
                <ul className="list-disc list-inside text-stone-600 space-y-1">
                  {result.information_needed.map((info, idx) => (
                    <li key={idx}>{info}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-stone-100/70 rounded-xl border border-stone-200 text-xs text-stone-600 flex items-start gap-2">
        <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">{result.disclaimer}</p>
      </div>
    </div>
  );
}

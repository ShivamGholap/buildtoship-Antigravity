import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button.jsx";
import { Card, CardContent } from "../components/ui/Card.jsx";
import {
  Sprout,
  Compass,
  AlertCircle,
  FlaskConical,
  Droplets,
  CalendarDays,
  ShieldCheck,
  Languages,
  CheckCircle,
  ArrowRight,
  MapPin,
  TrendingUp,
  FileCheck
} from "lucide-react";

export function Landing() {
  const features = [
    {
      icon: Compass,
      title: "Crop Recommendation",
      desc: "Ranked crop choices based on your farm's real soil type, season, water capacity, and budget goals with rotation benefits.",
      color: "text-emerald-700 bg-emerald-50",
    },
    {
      icon: AlertCircle,
      title: "Pest & Disease Diagnosis",
      desc: "Identify symptoms with optional leaf photo upload, IPM-first biological treatments, and clear chemical safety caveats.",
      color: "text-rose-700 bg-rose-50",
    },
    {
      icon: FlaskConical,
      title: "Fertilizer & Nutrient Plan",
      desc: "Stage-wise dosage schedules with organic and balanced inorganic alternatives per acre or hectare.",
      color: "text-amber-700 bg-amber-50",
    },
    {
      icon: Droplets,
      title: "Irrigation & Water Plan",
      desc: "Timeline by crop growth stage, highlighting critical moisture-sensitive windows and practical water-saving tips.",
      color: "text-blue-700 bg-blue-50",
    },
    {
      icon: CalendarDays,
      title: "Seasonal Crop Calendar",
      desc: "Month-by-month operational checklist covering land preparation, sowing, fertilizing, pest scouting, and harvesting.",
      color: "text-indigo-700 bg-indigo-50",
    },
    {
      icon: Languages,
      title: "Multilingual Intelligence",
      desc: "Consultations and follow-up Q&A generated in English, Hindi (हिन्दी), and Marathi (मराठी) for local clarity.",
      color: "text-teal-700 bg-teal-50",
    },
  ];

  const steps = [
    {
      step: "1",
      title: "Register Your Farm Profile",
      desc: "Save your farm's soil type, location, land size, and irrigation access once. Never re-type basic data.",
    },
    {
      step: "2",
      title: "Choose Advisory Type & Share Observed Signals",
      desc: "Select a goal, growth stage, or observed leaf symptoms. You can even upload a photo of the affected plant.",
    },
    {
      step: "3",
      title: "Receive Grounded Scientific Action Plan",
      desc: "Get an IPM-first, university-grounded advisory schedule. Ask follow-up questions or print a copy.",
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs sm:text-sm font-semibold shadow-sm">
            <Sprout className="w-4 h-4 text-brand-700" />
            <span>AI-Powered Agricultural Agronomy Assistant</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-tight">
            Scientific Crop Advisories <br className="hidden sm:inline" />
            <span className="text-brand-700">Tailored to Your Farm & Soil</span>
          </h1>

          <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            KrishiMitra AI empowers farmers, supervisors, and agronomy students with grounded, multilingual advisory schedules covering what to plant, how to protect it, and when to irrigate.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" icon={ArrowRight} iconPosition="right" className="w-full sm:w-auto">
                Get Started Free
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign In to Your Account
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-8 text-xs text-stone-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-700" />
              Grounded in Farm Context
            </span>
            <span className="flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-brand-700" />
              English • हिन्दी • मराठी
            </span>
            <span className="flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-brand-700" />
              IPM & Safe Chemical Advice
            </span>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-3">
            Comprehensive Field-Level Advisory
          </h2>
          <p className="text-sm text-stone-500">
            Five specialized agronomic engines working together to maximize your harvest and protect your soil health.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Card key={idx} hover className="p-6 border-stone-200/80">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-stone-900 mb-2">{feat.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{feat.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-stone-100/60 py-16 px-4 sm:px-6 border-y border-stone-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-3">
              How KrishiMitra AI Works
            </h2>
            <p className="text-sm text-stone-500">
              Personalized agricultural science in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((st) => (
              <div key={st.step} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm relative">
                <div className="w-10 h-10 rounded-xl bg-brand-700 text-white font-bold flex items-center justify-center mb-4 shadow">
                  {st.step}
                </div>
                <h3 className="font-bold text-base text-stone-900 mb-2">{st.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agricultural Safety & Grounding Callout */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-amber-50 rounded-2xl p-6 sm:p-8 border border-amber-200 text-amber-950 space-y-3">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-base">
            <ShieldCheck className="w-5 h-5 text-amber-700" />
            <span>Built on Responsible Agricultural Principles</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
            KrishiMitra AI never fabricates market prices, never guarantees speculative crop yields, and never recommends unverified chemical cocktails. We always prioritize integrated pest management (cultural and biological methods) before chemical intervention, and urge confirmation with your nearest Krishi Vigyan Kendra (KVK).
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="bg-brand-900 text-white rounded-3xl p-8 sm:p-12 space-y-6 shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Protect and Optimize Your Farm?
          </h2>
          <p className="text-brand-100 text-sm sm:text-base max-w-xl mx-auto">
            Join hundreds of farmers making data-backed decisions for every season, crop, and irrigation cycle.
          </p>
          <div>
            <Link to="/signup">
              <Button
                variant="white"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                className="font-bold px-8 shadow-md"
              >
                Create Free Farmer Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

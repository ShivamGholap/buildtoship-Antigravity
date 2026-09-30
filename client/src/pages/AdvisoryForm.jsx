import React, { useState, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useFarms } from "../hooks/useFarms.js";
import { useProfile } from "../hooks/useProfile.js";
import { useAdvisories } from "../hooks/useAdvisories.js";
import { PageHeader } from "../components/ui/PageHeader.jsx";
import { EmptyFarmsState } from "../components/farms/EmptyFarmsState.jsx";
import { Spinner } from "../components/ui/Spinner.jsx";
import { Button } from "../components/ui/Button.jsx";
import { GeneratingOverlay } from "../components/advisory/GeneratingOverlay.jsx";
import { ArrowLeft } from "lucide-react";

// The 5 Forms
import { CropRecommendationForm } from "../components/advisory/forms/CropRecommendationForm.jsx";
import { DiseaseDiagnosisForm } from "../components/advisory/forms/DiseaseDiagnosisForm.jsx";
import { FertilizerPlanForm } from "../components/advisory/forms/FertilizerPlanForm.jsx";
import { IrrigationPlanForm } from "../components/advisory/forms/IrrigationPlanForm.jsx";
import { SeasonalCalendarForm } from "../components/advisory/forms/SeasonalCalendarForm.jsx";

const TITLES = {
  "crop-recommendation": {
    type: "crop_recommendation",
    title: "Crop Recommendation Advisory",
    subtitle: "Select the best crops for your farm, season, water capacity, and budget.",
  },
  "disease-diagnosis": {
    type: "disease_diagnosis",
    title: "Pest & Disease Diagnosis",
    subtitle: "Identify causes and receive an IPM-first biological and chemical treatment plan.",
  },
  "fertilizer-plan": {
    type: "fertilizer_plan",
    title: "Fertilizer & Nutrient Schedule",
    subtitle: "Stage-wise dosage schedule with organic and balanced inorganic options.",
  },
  "irrigation-plan": {
    type: "irrigation_plan",
    title: "Irrigation & Water Schedule",
    subtitle: "Growth-stage watering schedule and critical moisture protection.",
  },
  "seasonal-calendar": {
    type: "seasonal_calendar",
    title: "Seasonal Crop Calendar",
    subtitle: "Month-by-month agricultural operations checklist from sowing to harvest.",
  },
};

export function AdvisoryForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { farms, loading: farmsLoading } = useFarms();
  const { profile } = useProfile();
  const { generateAdvisory } = useAdvisories();

  // Extract path slug e.g. "crop-recommendation"
  const slug = location.pathname.split("/").pop();
  const config = TITLES[slug] || TITLES["crop-recommendation"];

  const [generating, setGenerating] = useState(false);
  const abortControllerRef = useRef(null);

  const handleCancelGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setGenerating(false);
  };

  const handleFormSubmit = async (formData, file = null) => {
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setGenerating(true);

    try {
      const advisory = await generateAdvisory({
        type: config.type,
        data: formData,
        file,
        signal: controller.signal,
      });

      if (advisory?.id) {
        navigate(`/advisories/${advisory.id}`);
      }
    } catch (err) {
      console.error("Advisory generation error", err);
    } finally {
      setGenerating(false);
    }
  };

  if (farmsLoading) {
    return (
      <div className="py-16 flex items-center justify-center">
        <Spinner size="lg" message="Loading farm context..." />
      </div>
    );
  }

  // Enforce farm existence
  if (farms.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={config.title}
          subtitle="You need at least one registered farm to generate grounded agronomic advice."
        />
        <EmptyFarmsState />
      </div>
    );
  }

  const defaultFarmId = location.state?.prefillFarmId || farms[0]?.id;
  const defaultLanguage = profile?.language || "en";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/advisory/new">
          <Button variant="outline" size="sm" icon={ArrowLeft}>
            All Advisory Types
          </Button>
        </Link>
      </div>

      <PageHeader title={config.title} subtitle={config.subtitle} />

      {/* Render Matching Form */}
      {config.type === "crop_recommendation" && (
        <CropRecommendationForm
          farms={farms}
          defaultFarmId={defaultFarmId}
          defaultLanguage={defaultLanguage}
          onSubmit={handleFormSubmit}
          loading={generating}
        />
      )}

      {config.type === "disease_diagnosis" && (
        <DiseaseDiagnosisForm
          farms={farms}
          defaultFarmId={defaultFarmId}
          defaultLanguage={defaultLanguage}
          onSubmit={handleFormSubmit}
          loading={generating}
        />
      )}

      {config.type === "fertilizer_plan" && (
        <FertilizerPlanForm
          farms={farms}
          defaultFarmId={defaultFarmId}
          defaultLanguage={defaultLanguage}
          onSubmit={handleFormSubmit}
          loading={generating}
        />
      )}

      {config.type === "irrigation_plan" && (
        <IrrigationPlanForm
          farms={farms}
          defaultFarmId={defaultFarmId}
          defaultLanguage={defaultLanguage}
          onSubmit={handleFormSubmit}
          loading={generating}
        />
      )}

      {config.type === "seasonal_calendar" && (
        <SeasonalCalendarForm
          farms={farms}
          defaultFarmId={defaultFarmId}
          defaultLanguage={defaultLanguage}
          onSubmit={handleFormSubmit}
          loading={generating}
        />
      )}

      {/* Animated Overlay during Generation */}
      <GeneratingOverlay
        isOpen={generating}
        onCancel={handleCancelGeneration}
        advisoryTitle={config.title}
      />
    </div>
  );
}

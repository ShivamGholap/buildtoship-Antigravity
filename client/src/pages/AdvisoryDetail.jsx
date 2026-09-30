import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAdvisories } from "../hooks/useAdvisories.js";
import { AdvisoryHeader } from "../components/advisory/views/AdvisoryHeader.jsx";
import { AdvisoryActions } from "../components/advisory/views/AdvisoryActions.jsx";
import { FeedbackWidget } from "../components/advisory/views/FeedbackWidget.jsx";
import { FollowUpChat } from "../components/advisory/views/FollowUpChat.jsx";
import { Spinner } from "../components/ui/Spinner.jsx";
import { Button } from "../components/ui/Button.jsx";
import { ArrowLeft, AlertCircle } from "lucide-react";

// The 5 Views
import { CropRecommendationView } from "../components/advisory/views/CropRecommendationView.jsx";
import { DiseaseDiagnosisView } from "../components/advisory/views/DiseaseDiagnosisView.jsx";
import { FertilizerPlanView } from "../components/advisory/views/FertilizerPlanView.jsx";
import { IrrigationPlanView } from "../components/advisory/views/IrrigationPlanView.jsx";
import { SeasonalCalendarView } from "../components/advisory/views/SeasonalCalendarView.jsx";

export function AdvisoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getAdvisory,
    deleteAdvisory,
    sendFollowUpMessage,
    submitFeedback,
  } = useAdvisories();

  const [advisory, setAdvisory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    getAdvisory(id)
      .then((data) => {
        if (isMounted) {
          setAdvisory(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.response?.data?.error?.message || "Failed to load advisory report");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id, getAdvisory]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteAdvisory(id);
      navigate("/advisories", { replace: true });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <Spinner size="lg" message="Loading advisory report..." />
      </div>
    );
  }

  if (error || !advisory) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-stone-900">Advisory Not Found</h2>
        <p className="text-sm text-stone-500">{error || "This advisory may have been deleted."}</p>
        <Link to="/advisories">
          <Button variant="outline" size="sm" icon={ArrowLeft}>
            Back to Advisories
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top back navigation */}
      <div className="flex items-center gap-3 no-print">
        <Link to="/advisories">
          <Button variant="outline" size="sm" icon={ArrowLeft}>
            Back to Advisory History
          </Button>
        </Link>
      </div>

      {/* Advisory Header Banner */}
      <AdvisoryHeader advisory={advisory} />

      {/* Action Bar (Print, Copy, Regenerate, Delete) */}
      <AdvisoryActions
        advisory={advisory}
        onDelete={handleDelete}
        deleting={deleting}
      />

      {/* Type-Specific Result Body */}
      {advisory.type === "crop_recommendation" && (
        <CropRecommendationView result={advisory.result} />
      )}

      {advisory.type === "disease_diagnosis" && (
        <DiseaseDiagnosisView result={advisory.result} />
      )}

      {advisory.type === "fertilizer_plan" && (
        <FertilizerPlanView result={advisory.result} />
      )}

      {advisory.type === "irrigation_plan" && (
        <IrrigationPlanView result={advisory.result} />
      )}

      {advisory.type === "seasonal_calendar" && (
        <SeasonalCalendarView result={advisory.result} />
      )}

      {/* Feedback Widget */}
      <FeedbackWidget
        advisoryId={advisory.id}
        initialFeedback={advisory.feedback}
        onSubmitFeedback={submitFeedback}
      />

      {/* Follow-up Chat on this advisory */}
      <FollowUpChat
        advisoryId={advisory.id}
        advisoryType={advisory.type}
        messages={advisory.messages || []}
        onSendMessage={sendFollowUpMessage}
      />
    </div>
  );
}

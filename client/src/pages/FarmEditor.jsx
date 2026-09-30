import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFarms } from "../hooks/useFarms.js";
import { PageHeader } from "../components/ui/PageHeader.jsx";
import { FarmForm } from "../components/farms/FarmForm.jsx";
import { Spinner } from "../components/ui/Spinner.jsx";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button.jsx";

export function FarmEditor() {
  const { farmId } = useParams();
  const navigate = useNavigate();
  const { getFarm, createFarm, updateFarm } = useFarms();

  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(Boolean(farmId));
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(farmId);

  useEffect(() => {
    if (farmId) {
      getFarm(farmId)
        .then((data) => {
          setFarm(data);
          setLoading(false);
        })
        .catch(() => {
          navigate("/farms", { replace: true });
        });
    }
  }, [farmId, getFarm, navigate]);

  const handleSubmit = async (data) => {
    try {
      setSubmitting(true);
      if (isEditing) {
        await updateFarm(farmId, data);
      } else {
        await createFarm(data);
      }
      navigate("/farms");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex items-center justify-center">
        <Spinner size="lg" message="Loading farm details..." />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate("/farms")}
        >
          Back to Farms
        </Button>
      </div>

      <PageHeader
        title={isEditing ? `Edit Farm: ${farm?.name}` : "Register New Farm"}
        subtitle="Provide accurate soil, water, and acreage data to ground all AI recommendations."
      />

      <FarmForm
        initialData={farm || {}}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/farms")}
        loading={submitting}
      />
    </div>
  );
}

import React from "react";
import { PageHeader } from "../components/ui/PageHeader.jsx";
import { AdvisoryTypeGrid } from "../components/advisory/AdvisoryTypeCard.jsx";
import { useMeta } from "../hooks/useMeta.js";
import { Spinner } from "../components/ui/Spinner.jsx";

export function AdvisoryNew() {
  const { options, loading } = useMeta();

  if (loading) {
    return (
      <div className="py-16 flex items-center justify-center">
        <Spinner size="lg" message="Loading advisory engines..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Start New Agricultural Advisory"
        subtitle="Choose an agronomic advisory engine below to generate tailored scientific guidance for your farm."
      />

      <AdvisoryTypeGrid types={options?.advisoryTypes} />
    </div>
  );
}

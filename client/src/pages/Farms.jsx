import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFarms } from "../hooks/useFarms.js";
import { PageHeader } from "../components/ui/PageHeader.jsx";
import { Button } from "../components/ui/Button.jsx";
import { FarmCard } from "../components/farms/FarmCard.jsx";
import { EmptyFarmsState } from "../components/farms/EmptyFarmsState.jsx";
import { ConfirmDialog } from "../components/ui/ConfirmDialog.jsx";
import { Spinner } from "../components/ui/Spinner.jsx";
import { PlusCircle } from "lucide-react";

export function Farms() {
  const { farms, loading, deleteFarm } = useFarms();
  const [farmToDelete, setFarmToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!farmToDelete) return;
    try {
      setDeleting(true);
      await deleteFarm(farmToDelete.id);
      setFarmToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex items-center justify-center">
        <Spinner size="lg" message="Loading your farm profiles..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Farms"
        subtitle="Manage your registered agricultural plots, soil profiles, and irrigation systems."
        action={
          <Link to="/farms/new">
            <Button variant="primary" icon={PlusCircle}>
              Add New Farm
            </Button>
          </Link>
        }
      />

      {farms.length === 0 ? (
        <EmptyFarmsState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm) => (
            <FarmCard
              key={farm.id}
              farm={farm}
              onDelete={(f) => setFarmToDelete(f)}
            />
          ))}
        </div>
      )}

      {/* Delete Farm Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(farmToDelete)}
        onClose={() => setFarmToDelete(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        title={`Delete "${farmToDelete?.name}"?`}
        message="Deleting this farm will remove its profile. Any previously generated advisories referencing this farm will remain in history."
      />
    </div>
  );
}

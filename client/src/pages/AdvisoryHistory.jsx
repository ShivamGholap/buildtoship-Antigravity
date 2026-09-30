import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAdvisories } from "../hooks/useAdvisories.js";
import { useFarms } from "../hooks/useFarms.js";
import { useMeta } from "../hooks/useMeta.js";
import { PageHeader } from "../components/ui/PageHeader.jsx";
import { Button } from "../components/ui/Button.jsx";
import { AdvisoryFilters } from "../components/history/AdvisoryFilters.jsx";
import { AdvisoryListItem } from "../components/history/AdvisoryListItem.jsx";
import { Pagination } from "../components/history/Pagination.jsx";
import { AdvisoryCardSkeleton } from "../components/ui/Skeleton.jsx";
import { EmptyState } from "../components/ui/EmptyState.jsx";
import { PlusCircle, History } from "lucide-react";

export function AdvisoryHistory() {
  const { fetchAdvisories } = useAdvisories();
  const { farms } = useFarms();
  const { options } = useMeta();

  const [advisories, setAdvisories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    type: undefined,
    farm_id: undefined,
    q: undefined,
  });

  const loadData = (currentFilters) => {
    setLoading(true);
    fetchAdvisories(currentFilters)
      .then((data) => {
        setAdvisories(data.items || []);
        setPagination(data.pagination);
      })
      .catch((err) => {
        console.error("Failed to load advisories history", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData(filters);
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Advisory History"
        subtitle="Review past agricultural consultations, diagnosis reports, and calendar tasks."
        action={
          <Link to="/advisory/new">
            <Button variant="primary" icon={PlusCircle}>
              New Advisory
            </Button>
          </Link>
        }
      />

      {/* Filter & Search Bar */}
      <AdvisoryFilters
        types={options?.advisoryTypes || []}
        farms={farms || []}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Results List */}
      {loading ? (
        <div className="space-y-4">
          <AdvisoryCardSkeleton />
          <AdvisoryCardSkeleton />
          <AdvisoryCardSkeleton />
        </div>
      ) : advisories.length === 0 ? (
        <EmptyState
          icon={History}
          title="No Advisories Found"
          description={
            filters.q || filters.type || filters.farm_id
              ? "No past advisories match your current filter criteria. Try adjusting or clearing your filters."
              : "You haven't generated any advisories yet. Choose an advisory type to get personalized crop guidance."
          }
          actionText="Start First Advisory"
          onAction={() => (window.location.href = "/advisory/new")}
        />
      ) : (
        <div className="space-y-3">
          {advisories.map((advisory) => (
            <AdvisoryListItem key={advisory.id} advisory={advisory} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <Pagination pagination={pagination} onPageChange={handlePageChange} />
    </div>
  );
}

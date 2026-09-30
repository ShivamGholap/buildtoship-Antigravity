import React, { useState, useEffect } from "react";
import { Search, RotateCcw } from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce.js";
import { Button } from "../ui/Button.jsx";

export function AdvisoryFilters({
  types = [],
  farms = [],
  filters = {},
  onFilterChange,
}) {
  const [searchTerm, setSearchTerm] = useState(filters.q || "");
  const debouncedSearch = useDebounce(searchTerm, 400);

  useEffect(() => {
    onFilterChange({ q: debouncedSearch || undefined, page: 1 });
  }, [debouncedSearch]);

  const handleTypeChange = (e) => {
    onFilterChange({ type: e.target.value || undefined, page: 1 });
  };

  const handleFarmChange = (e) => {
    onFilterChange({ farm_id: e.target.value || undefined, page: 1 });
  };

  const handleReset = () => {
    setSearchTerm("");
    onFilterChange({ type: undefined, farm_id: undefined, q: undefined, page: 1 });
  };

  const hasActiveFilters = Boolean(filters.type || filters.farm_id || filters.q);

  return (
    <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-sm space-y-3 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search advisories by title or crop..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-700 min-h-[44px]"
          />
        </div>

        {/* Type Filter */}
        <select
          value={filters.type || ""}
          onChange={handleTypeChange}
          className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-700 min-h-[44px]"
          aria-label="Filter by advisory type"
        >
          <option value="">All Advisory Types</option>
          {types.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        {/* Farm Filter */}
        <select
          value={filters.farm_id || ""}
          onChange={handleFarmChange}
          className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-700 min-h-[44px]"
          aria-label="Filter by farm"
        >
          <option value="">All Farms</option>
          {farms.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name} ({f.district})
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-end pt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            icon={RotateCcw}
            className="text-xs text-stone-500 hover:text-stone-800"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useUpdatesData } from "@/hooks/use-updates-data";
import { useUpdatesFilter } from "@/hooks/use-updates-filter";
import { UpdatesHero } from "./updates-hero";
import { UpdatesFilters } from "./updates-filters";
import { UpdatesTimeline } from "./updates-timeline";

export function UpdatesPageClient() {
  const { events, stats } = useUpdatesData();
  const filter = useUpdatesFilter(events);

  return (
    <div className="pt-16 min-h-screen">
      <UpdatesHero stats={stats} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <UpdatesFilters
          search={filter.search}
          setSearch={filter.setSearch}
          selectedTypes={filter.selectedTypes}
          toggleType={filter.toggleType}
          selectedStatuses={filter.selectedStatuses}
          toggleStatus={filter.toggleStatus}
          hasFilters={filter.hasFilters}
          clearFilters={filter.clearFilters}
        />
        <UpdatesTimeline
          groups={filter.grouped}
          totalFiltered={filter.filtered.length}
          hasFilters={filter.hasFilters}
          onClearFilters={filter.clearFilters}
        />
      </div>
    </div>
  );
}

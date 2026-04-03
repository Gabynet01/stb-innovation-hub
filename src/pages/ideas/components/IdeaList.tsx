import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Idea } from "@/types/api";
import { Card, SegmentedTabs } from "@/components/ui";
import { IdeaCard } from "./IdeaCard";
import { IdeaTable } from "./IdeaTable";
import { EmptyState } from "./EmptyState";
import { Pagination } from "./Pagination";

export type IdeaListViewMode = "grid" | "table";

interface IdeaListProps {
  ideas: Idea[];
  onEdit: (idea: Idea) => void;
  onDelete: (id: string) => void;
  onView: (idea: Idea) => void;
  viewMode?: IdeaListViewMode;
  /** True when list is empty because of active filters */
  emptyDueToFilters?: boolean;
}

type CategoryTabKey = "all" | string;

function useCategoryTabs(ideas: Idea[]) {
  return useMemo(() => {
    const map = new Map<number, { label: string; count: number }>();
    for (const idea of ideas) {
      const id = idea.category_id;
      const label = idea.category_label?.trim() || "Uncategorised";
      const prev = map.get(id);
      if (prev) prev.count += 1;
      else map.set(id, { label, count: 1 });
    }
    return Array.from(map.entries())
      .map(([category_id, v]) => ({
        key: String(category_id) as CategoryTabKey,
        category_id,
        label: v.label,
        count: v.count,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [ideas]);
}

const IdeaListComponent: React.FC<IdeaListProps> = ({
  ideas,
  onEdit,
  onDelete,
  onView,
  viewMode = "grid",
  emptyDueToFilters = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategoryKey, setActiveCategoryKey] =
    useState<CategoryTabKey>("all");
  const itemsPerPageGrid = 9;

  const categoryTabs = useCategoryTabs(ideas);

  const categoryTabItems = useMemo(
    () => [
      { id: "all" as CategoryTabKey, label: "All", count: ideas.length },
      ...categoryTabs.map((t) => ({
        id: t.key,
        label: t.label,
        count: t.count,
      })),
    ],
    [ideas.length, categoryTabs]
  );

  const filteredIdeas = useMemo(() => {
    if (activeCategoryKey === "all") return ideas;
    return ideas.filter(
      (i) => String(i.category_id) === activeCategoryKey
    );
  }, [ideas, activeCategoryKey]);

  useEffect(() => {
    if (activeCategoryKey === "all") return;
    const stillPresent = ideas.some(
      (i) => String(i.category_id) === activeCategoryKey
    );
    if (!stillPresent) setActiveCategoryKey("all");
  }, [ideas, activeCategoryKey]);

  const { totalPages, pageIdeas } = useMemo(() => {
    if (viewMode === "table") {
      return { totalPages: 0, pageIdeas: [] as Idea[] };
    }
    const totalPages = Math.ceil(
      filteredIdeas.length / itemsPerPageGrid
    );
    const startIndex = (currentPage - 1) * itemsPerPageGrid;
    const endIndex = startIndex + itemsPerPageGrid;
    const pageIdeas = filteredIdeas.slice(startIndex, endIndex);
    return { totalPages, pageIdeas };
  }, [filteredIdeas, currentPage, itemsPerPageGrid, viewMode]);

  useEffect(() => {
    setCurrentPage(1);
  }, [ideas.length, activeCategoryKey, viewMode]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (ideas.length === 0) {
    return <EmptyState hasFilters={emptyDueToFilters} />;
  }

  const hideCategoryColumn = activeCategoryKey !== "all";

  return (
    <div className="space-y-6" role="region" aria-label="Ideas by category">
      <SegmentedTabs<CategoryTabKey>
        aria-label="Idea categories"
        variant="filled"
        panelId="idea-category-panel"
        nowrap
        items={categoryTabItems}
        value={activeCategoryKey}
        onChange={setActiveCategoryKey}
      />

      <div
        role="tabpanel"
        id="idea-category-panel"
        aria-labelledby={`segmented-tab-${activeCategoryKey}`}
      >
        <Card
          padding="none"
          rounded="xl"
          className="border-stanbic-border shadow-sm shadow-stanbic-text/[0.04]"
        >
          {viewMode === "table" ? (
            <IdeaTable
              ideas={filteredIdeas}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
              emptyDueToFilters={emptyDueToFilters}
              hideCategoryColumn={hideCategoryColumn}
            />
          ) : filteredIdeas.length === 0 ? (
            <div className="px-4 py-16 sm:px-6 sm:py-20">
              <EmptyState hasFilters={emptyDueToFilters} />
            </div>
          ) : (
            <div className="space-y-8 px-4 py-5 sm:px-6 sm:py-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:gap-10">
                {pageIdeas.map((idea) => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onView={onView}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  totalItems={filteredIdeas.length}
                  itemsPerPage={itemsPerPageGrid}
                />
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export const IdeaList = React.memo(IdeaListComponent);

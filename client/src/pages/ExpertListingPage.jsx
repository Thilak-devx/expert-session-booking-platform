import { useEffect, useMemo, useState } from "react";

import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import ExpertCard from "../components/ExpertCard";
import ExpertCardSkeleton from "../components/ExpertCardSkeleton";
import FilterBar from "../components/FilterBar";
import PageHero from "../components/PageHero";
import PaginationControls from "../components/PaginationControls";
import useExperts from "../hooks/useExperts";

function ExpertListingPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const filters = useMemo(
    () => ({
      page,
      limit: 4,
      search,
      category,
    }),
    [category, page, search]
  );

  const { experts, categories, totalPages, currentPage, totalExperts, totalAvailableSlots, isLoading, error } = useExperts(filters);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <section className="space-y-8">
      <PageHero
        badge="Experts"
        title="Book time with experienced specialists"
        description="Browse expert profiles, compare availability, and schedule the session that fits your needs."
        aside={
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">At a glance</p>
              <p className="mt-3 text-2xl font-semibold">Search quickly, review availability, and book with confidence.</p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4">
                <p className="text-2xl font-semibold">{totalExperts}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-300">Experts</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4">
                <p className="text-2xl font-semibold">{totalAvailableSlots}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-300">Available Slots</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4">
                <p className="text-2xl font-semibold">{categories.length}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-300">Categories</p>
              </div>
            </div>
          </div>
        }
      />

      <FilterBar
        search={search}
        category={category}
        totalExperts={totalExperts}
        categories={categories}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onCategoryChange={(value) => {
          setCategory(value);
          setPage(1);
        }}
        onReset={() => {
          setSearch("");
          setCategory("");
          setPage(1);
        }}
      />

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <ExpertCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <ErrorState
          title="Unable to load experts"
          description={error}
          actionLabel="Refresh page"
          onAction={() => window.location.reload()}
        />
      ) : experts.length ? (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {experts.map((expert) => (
              <ExpertCard key={expert._id} expert={expert} />
            ))}
          </div>

          {totalPages > 1 ? (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPrevious={() => setPage((value) => Math.max(1, value - 1))}
              onNext={() => setPage((value) => Math.min(totalPages, value + 1))}
              onPageSelect={setPage}
            />
          ) : null}
        </div>
      ) : (
        <EmptyState
          title="No experts found"
          description="Try a different search or clear the category filter to see more results."
        />
      )}
    </section>
  );
}

export default ExpertListingPage;

function FilterBar({
  search,
  category,
  onSearchChange,
  onCategoryChange,
  onReset,
  totalExperts,
  categories = [],
}) {
  return (
    <div className="grid gap-4 rounded-[32px] border border-slate-200 bg-white/80 p-5 shadow-soft sm:grid-cols-2 xl:grid-cols-[1.35fr_0.95fr_auto_auto]">
      <label className="space-y-2">
        <span className="text-sm font-medium text-slate-700">Search experts</span>
        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by expert name"
          aria-label="Search experts by name"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-200"
        />
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium text-slate-700">Category</span>
        <select
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          aria-label="Filter experts by category"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-200"
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        onClick={onReset}
        className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
      >
        Reset filters
      </button>

      <div className="flex min-h-[52px] items-center justify-center rounded-2xl bg-slate-900 px-5 text-sm font-medium text-white">
        {totalExperts} expert{totalExperts === 1 ? "" : "s"}
      </div>
    </div>
  );
}

export default FilterBar;

function ExpertCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white/85 p-5 shadow-soft">
      <div className="flex animate-pulse flex-col gap-5 md:flex-row">
        <div className="h-32 w-32 rounded-[24px] bg-slate-200" />
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="h-4 w-28 rounded-full bg-slate-200" />
              <div className="h-8 w-48 rounded-full bg-slate-200" />
            </div>
            <div className="h-10 w-24 rounded-2xl bg-slate-200" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full rounded-full bg-slate-200" />
            <div className="h-4 w-5/6 rounded-full bg-slate-200" />
            <div className="h-4 w-2/3 rounded-full bg-slate-200" />
          </div>
          <div className="flex gap-3">
            <div className="h-9 w-28 rounded-full bg-slate-200" />
            <div className="h-9 w-32 rounded-full bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpertCardSkeleton;

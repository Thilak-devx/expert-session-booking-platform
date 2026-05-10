function DetailSkeleton() {
  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-[36px] border border-slate-200 bg-white/80 p-8 shadow-soft">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-32 rounded-full bg-slate-200" />
          <div className="h-12 w-2/3 rounded-full bg-slate-200" />
          <div className="h-4 w-full rounded-full bg-slate-200" />
          <div className="h-4 w-5/6 rounded-full bg-slate-200" />
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-soft">
          <div className="h-[340px] animate-pulse rounded-[28px] bg-slate-200" />
        </div>
        <div className="rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-soft">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-40 rounded-full bg-slate-200" />
            <div className="h-24 rounded-[24px] bg-slate-200" />
            <div className="h-24 rounded-[24px] bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailSkeleton;

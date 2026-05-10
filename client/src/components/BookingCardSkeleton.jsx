function BookingCardSkeleton() {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white/85 p-5 shadow-soft">
      <div className="animate-pulse space-y-4">
        <div className="flex justify-between gap-4">
          <div className="space-y-3">
            <div className="h-4 w-28 rounded-full bg-slate-200" />
            <div className="h-7 w-44 rounded-full bg-slate-200" />
          </div>
          <div className="h-10 w-24 rounded-full bg-slate-200" />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="h-4 w-28 rounded-full bg-slate-200" />
          <div className="h-4 w-32 rounded-full bg-slate-200" />
          <div className="h-4 w-40 rounded-full bg-slate-200" />
          <div className="h-4 w-36 rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

export default BookingCardSkeleton;

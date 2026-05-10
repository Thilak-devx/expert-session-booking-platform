import StatusBadge from "./StatusBadge";

function BookingCard({ booking, action }) {
  return (
    <article className="flex min-h-[240px] flex-col rounded-[24px] border border-slate-200 bg-white/85 p-5 shadow-soft transition duration-300 hover:-translate-y-0.5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-600">
            {booking.expertId?.category || "Expert Session"}
          </p>
          <h3 className="mt-2 text-xl font-semibold leading-tight text-slate-900">
            {booking.expertId?.name || "Unknown Expert"}
          </h3>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="mt-5 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
        <p>
          <span className="font-medium text-slate-900">Date:</span> {booking.date}
        </p>
        <p>
          <span className="font-medium text-slate-900">Time:</span> {booking.timeSlot}
        </p>
        <p className="break-all">
          <span className="font-medium text-slate-900">Email:</span> {booking.email}
        </p>
        <p>
          <span className="font-medium text-slate-900">Phone:</span> {booking.phone}
        </p>
      </div>

      <div className="mt-5 flex-1">
        {booking.notes ? (
          <div className="rounded-[20px] bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Notes</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{booking.notes}</p>
          </div>
        ) : (
          <div className="rounded-[20px] border border-dashed border-slate-200 p-4">
            <p className="text-sm text-slate-400">No additional notes for this booking.</p>
          </div>
        )}
      </div>

      <div className="mt-5 flex min-h-[44px] items-end justify-end">{action ? action : null}</div>
    </article>
  );
}

export default BookingCard;

import { Link } from "react-router-dom";

function BookingSuccessPanel({ booking, confirmation }) {
  return (
    <section className="rounded-[32px] border border-emerald-200 bg-white/90 p-6 shadow-soft">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Booking confirmed</p>
      <h2 className="mt-3 text-3xl font-semibold text-slate-900">Your session request was submitted successfully.</h2>
      <p className="mt-3 text-slate-600">
        {confirmation?.expertName} in {confirmation?.category} has your booking request for {booking.date} at {booking.timeSlot}.
      </p>

      <div className="mt-6 grid gap-4 rounded-[24px] bg-emerald-50 p-5 sm:grid-cols-2">
        <div>
          <p className="text-sm text-slate-500">Booking email</p>
          <p className="mt-1 font-semibold text-slate-900">{booking.email}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Status</p>
          <p className="mt-1 font-semibold text-slate-900">{booking.status}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/my-bookings" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white">
          View my bookings
        </Link>
        <Link to="/" className="rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700">
          Book another expert
        </Link>
      </div>
    </section>
  );
}

export default BookingSuccessPanel;

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";

import BookingSuccessPanel from "../components/BookingSuccessPanel";
import ConnectionBadge from "../components/ConnectionBadge";
import DetailSkeleton from "../components/DetailSkeleton";
import ErrorState from "../components/ErrorState";
import PageHero from "../components/PageHero";
import SlotDatePicker from "../components/SlotDatePicker";
import SlotGrid from "../components/SlotGrid";
import { useBookingContext } from "../context/BookingContext";
import useExpertDetail from "../hooks/useExpertDetail";
import useExpertSlotUpdates from "../hooks/useExpertSlotUpdates";
import useSocketStatus from "../hooks/useSocketStatus";
import { createBooking } from "../services/bookingService";
import getErrorMessage from "../utils/getErrorMessage";
import { applyBookingCancelledUpdate, applySlotBookedUpdate, findAvailableSlotsForDate } from "../utils/slotUtils";

function BookingPage() {
  const { expertId } = useParams();
  const { bookingEmail, setBookingEmail } = useBookingContext();
  const { expert, isLoading, error, setExpert, refetchExpert } = useExpertDetail(expertId);
  const socketStatus = useSocketStatus();
  const [form, setForm] = useState({
    name: "",
    email: bookingEmail,
    phone: "",
    date: "",
    timeSlot: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedElsewhere, setBookedElsewhere] = useState([]);
  const [clientErrors, setClientErrors] = useState({});
  const [successData, setSuccessData] = useState(null);
  const [liveUpdateNote, setLiveUpdateNote] = useState("");

  const slotOptions = useMemo(() => {
    return findAvailableSlotsForDate(expert, form.date);
  }, [expert, form.date]);

  useEffect(() => {
    setForm((previous) => ({
      ...previous,
      email: bookingEmail,
    }));
  }, [bookingEmail]);

  useEffect(() => {
    if (socketStatus === "connected" && expert?._id) {
      refetchExpert();
    }
  }, [socketStatus, expert?._id]);

  useExpertSlotUpdates(expertId, (payload) => {
    if (payload.type === "bookingCancelled") {
      setBookedElsewhere((previous) =>
        previous.filter((entry) => entry !== `${payload.date}__${payload.timeSlot}`)
      );
      setExpert((previous) => applyBookingCancelledUpdate(previous, payload));
      setLiveUpdateNote(`A slot on ${payload.date} became available again.`);
      return;
    }

    if (payload.expertId !== expertId) {
      return;
    }

    setBookedElsewhere((previous) => {
      const entry = `${payload.date}__${payload.timeSlot}`;
      return previous.includes(entry) ? previous : [...previous, entry];
    });

    setExpert((previous) => applySlotBookedUpdate(previous, payload));
    setLiveUpdateNote(`A slot on ${payload.date} was just taken. Availability has been refreshed.`);

    if (form.date === payload.date && form.timeSlot === payload.timeSlot) {
      setForm((previous) => ({ ...previous, timeSlot: "" }));
      toast.error("That slot was just booked by someone else. Please choose another one.");
    }
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setClientErrors((previous) => ({ ...previous, [name]: "" }));

    setForm((previous) => ({
      ...previous,
      [name]: value,
      ...(name === "date" ? { timeSlot: "" } : {}),
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = "Name is required";
    if (!form.email.trim()) nextErrors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) nextErrors.email = "Enter a valid email";
    if (!form.phone.trim()) nextErrors.phone = "Phone is required";
    if (!form.date) nextErrors.date = "Select a date";
    if (!form.timeSlot) nextErrors.timeSlot = "Select a time slot";

    setClientErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the highlighted fields");
      return;
    }
    setIsSubmitting(true);
    const toastId = toast.loading("Submitting booking...");

    try {
      const result = await createBooking({
        expertId,
        ...form,
      });

      setBookingEmail(form.email);
      toast.success("Booking created successfully", { id: toastId });
      setSuccessData(result);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to create booking"), { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to prepare booking"
        description={error}
        actionLabel="Back to experts"
        onAction={() => window.history.back()}
      />
    );
  }

  if (!expert) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white/85 p-8 shadow-soft">
        <p className="text-slate-600">Expert not found.</p>
        <Link to="/" className="mt-4 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm text-white">
          Back to Experts
        </Link>
      </div>
    );
  }

  if (successData) {
    return <BookingSuccessPanel booking={successData.booking} confirmation={successData.confirmation} />;
  }

  return (
    <section className="space-y-8">
      <PageHero
        badge="Booking"
        title={`Reserve a session with ${expert.name}`}
        description="Choose an available slot and submit your booking details."
        aside={
          <div className="space-y-4">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-300">Category</p>
              <p className="mt-2 text-2xl font-semibold">{expert.category}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-300">Open dates</p>
              <p className="mt-2 text-2xl font-semibold">{expert.availableSlots.length}</p>
            </div>
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <ConnectionBadge status={socketStatus} />
        {liveUpdateNote ? (
          <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
            Availability updated
          </span>
        ) : null}
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-soft">
          <div className="flex h-[340px] items-center justify-center rounded-[28px] bg-slate-100/80 p-4 sm:h-[420px] lg:h-[480px]">
            <img
              src={expert.profileImage}
              alt={expert.name}
              className="h-full w-full rounded-[24px] object-contain object-center"
            />
          </div>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.28em] text-sky-600">
            {expert.category}
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">{expert.name}</h3>
          <p className="mt-4 text-sm leading-6 text-slate-600">{expert.bio}</p>
          <div className="mt-6">
            <p className="text-sm font-semibold text-slate-900">Pick a date</p>
            <div className="mt-4">
              <SlotDatePicker
                dates={expert.availableSlots}
                selectedDate={form.date}
                onSelectDate={(date) => {
                  setClientErrors((previous) => ({ ...previous, date: "", timeSlot: "" }));
                  setForm((previous) => ({
                    ...previous,
                    date,
                    timeSlot: "",
                  }));
                }}
              />
            </div>
          </div>
        </aside>

        <form onSubmit={handleSubmit} className="rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-soft">
          <div className="mb-6 rounded-[24px] bg-slate-100 p-5">
            <p className="text-sm font-semibold text-slate-900">Choose an available time</p>
            <p className="mt-1 text-sm text-slate-500">Slots update in real time as bookings change.</p>
            {liveUpdateNote ? <p className="mt-3 text-sm text-sky-700">{liveUpdateNote}</p> : null}
            <div className="mt-4">
              {form.date ? (
                slotOptions.length ? (
                  <SlotGrid
                    slots={slotOptions}
                    selectedSlot={form.timeSlot}
                    disabledSlots={bookedElsewhere
                      .filter((item) => item.startsWith(`${form.date}__`))
                      .map((item) => item.split("__")[1])}
                    onSelectSlot={(timeSlot) => {
                      setClientErrors((previous) => ({ ...previous, timeSlot: "" }));
                      setForm((previous) => ({
                        ...previous,
                        timeSlot,
                      }));
                    }}
                  />
                ) : (
                  <p className="text-sm text-slate-500">No open slots remain for this date.</p>
                )
              ) : (
                <p className="text-sm text-slate-500">Select a date to view available time slots.</p>
              )}
            </div>
            {clientErrors.timeSlot ? <p className="mt-3 text-sm text-rose-600">{clientErrors.timeSlot}</p> : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                aria-label="Full name"
                className={`w-full rounded-2xl border px-4 py-3 outline-none focus:border-sky-500 ${clientErrors.name ? "border-rose-300" : "border-slate-200"}`}
              />
              {clientErrors.name ? <p className="mt-2 text-sm text-rose-600">{clientErrors.name}</p> : null}
            </div>
            <div>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your email"
                aria-label="Email address"
                className={`w-full rounded-2xl border px-4 py-3 outline-none focus:border-sky-500 ${clientErrors.email ? "border-rose-300" : "border-slate-200"}`}
              />
              {clientErrors.email ? <p className="mt-2 text-sm text-rose-600">{clientErrors.email}</p> : null}
            </div>
            <div>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone number"
                aria-label="Phone number"
                className={`w-full rounded-2xl border px-4 py-3 outline-none focus:border-sky-500 ${clientErrors.phone ? "border-rose-300" : "border-slate-200"}`}
              />
              {clientErrors.phone ? <p className="mt-2 text-sm text-rose-600">{clientErrors.phone}</p> : null}
            </div>
            <div>
              <input
                name="date"
                value={form.date}
                onChange={handleChange}
                placeholder="Selected date"
                aria-label="Selected date"
                className={`w-full rounded-2xl border px-4 py-3 outline-none focus:border-sky-500 ${clientErrors.date ? "border-rose-300" : "border-slate-200"}`}
                readOnly
              />
              {clientErrors.date ? <p className="mt-2 text-sm text-rose-600">{clientErrors.date}</p> : null}
            </div>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Session notes"
              aria-label="Session notes"
              rows="5"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500 md:col-span-2"
              maxLength={500}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !form.date || !form.timeSlot}
            aria-busy={isSubmitting}
            className="mt-6 w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating booking..." : "Confirm booking"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default BookingPage;

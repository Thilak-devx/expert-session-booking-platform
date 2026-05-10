import { useRef, useState } from "react";
import toast from "react-hot-toast";

import BookingCard from "../components/BookingCard";
import BookingCardSkeleton from "../components/BookingCardSkeleton";
import ConfirmModal from "../components/ConfirmModal";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import PageHero from "../components/PageHero";
import { useBookingContext } from "../context/BookingContext";
import { cancelBooking, getBookingsByEmail } from "../services/bookingService";
import getErrorMessage from "../utils/getErrorMessage";

const normalizeBookingStatus = (status) => {
  if (status === "Confirmed" || status === "Completed") {
    return status;
  }

  return "Pending";
};

const normalizeBooking = (booking) => ({
  ...booking,
  status: normalizeBookingStatus(booking.status),
});

function MyBookingsPage() {
  const { bookingEmail, setBookingEmail } = useBookingContext();
  const [emailInput, setEmailInput] = useState(bookingEmail);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancelingBookingId, setCancelingBookingId] = useState("");
  const requestIdRef = useRef(0);
  const hasStoredResults = bookings.length > 0 && Boolean(bookingEmail);

  const clearSearchState = () => {
    setBookingEmail("");
    setEmailInput("");
    setBookings([]);
    setError("");
    setHasSearched(false);
    setBookingToCancel(null);
  };

  const fetchBookings = async () => {
    const requestId = ++requestIdRef.current;

    setIsLoading(true);
    setHasSearched(true);
    setError("");
    setBookingToCancel(null);
    const toastId = toast.loading("Loading bookings...");

    try {
      const data = await getBookingsByEmail(emailInput);

      if (requestId !== requestIdRef.current) {
        toast.dismiss(toastId);
        return;
      }

      const normalizedBookings = data.map(normalizeBooking);

      setBookings(normalizedBookings);

      if (normalizedBookings.length > 0) {
        setBookingEmail(emailInput.trim());
      } else {
        setBookingEmail("");
      }

      toast.dismiss(toastId);
    } catch (error) {
      if (requestId !== requestIdRef.current) {
        toast.dismiss(toastId);
        return;
      }

      toast.error(getErrorMessage(error, "Failed to fetch bookings"), { id: toastId });
      setBookings([]);
      setError(getErrorMessage(error, "Failed to fetch bookings"));
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await fetchBookings();
  };

  const handleCancelBooking = async () => {
    if (!bookingToCancel) {
      return;
    }

    setCancelingBookingId(bookingToCancel._id);
    const toastId = toast.loading("Cancelling booking...");

    try {
      await cancelBooking(bookingToCancel._id);
      setBookings((previous) => {
        const nextBookings = previous.filter((booking) => booking._id !== bookingToCancel._id);

        if (nextBookings.length === 0) {
          setBookingEmail("");
        }

        return nextBookings;
      });
      toast.success("Booking cancelled successfully", { id: toastId });
      setBookingToCancel(null);
    } catch (requestError) {
      toast.error(getErrorMessage(requestError, "Failed to cancel booking"), { id: toastId });
    } finally {
      setCancelingBookingId("");
    }
  };

  return (
    <section className="space-y-8">
      <PageHero
        badge="Your sessions"
        title="Manage your booked sessions"
        description="View and manage your scheduled expert sessions using your booking email."
        aside={
          <div className="space-y-4">
            {hasStoredResults ? (
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-slate-300">Stored lookup email</p>
                <p className="mt-2 break-all text-lg font-semibold">{bookingEmail}</p>
              </div>
            ) : null}
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-300">Loaded bookings</p>
              <p className="mt-2 text-3xl font-semibold">{bookings.length}</p>
            </div>
            {emailInput || hasSearched ? (
              <button
                type="button"
                onClick={clearSearchState}
                className="inline-flex rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Clear Search
              </button>
            ) : null}
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="grid gap-4 rounded-[32px] border border-slate-200 bg-white/85 p-5 shadow-soft md:grid-cols-[1fr_auto]">
        <input
          type="email"
          value={emailInput}
          onChange={(event) => setEmailInput(event.target.value)}
          placeholder="Enter the booking email"
          aria-label="Booking email"
          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Loading..." : "Find bookings"}
        </button>
      </form>

      {isLoading ? (
        <div className="grid gap-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <BookingCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <ErrorState title="Unable to load bookings" description={error} actionLabel="Try again" onAction={fetchBookings} />
      ) : bookings.length ? (
        <div className="grid gap-5">
          {bookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              action={
                normalizeBookingStatus(booking.status) === "Pending" ? (
                  <button
                    type="button"
                    onClick={() => setBookingToCancel(booking)}
                    disabled={cancelingBookingId === booking._id}
                    className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {cancelingBookingId === booking._id ? "Cancelling..." : "Cancel Booking"}
                  </button>
                ) : null
              }
            />
          ))}
        </div>
      ) : hasSearched ? (
        <EmptyState
          title="No bookings found"
          description="No sessions were found for that email address. Try another email or book a new session."
          action={
            <button
              type="button"
              onClick={clearSearchState}
              className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
            >
              Clear Search
            </button>
          }
        />
      ) : (
        <EmptyState
          title="Find your bookings"
          description="Enter the email used at checkout to view your scheduled sessions."
        />
      )}

      <ConfirmModal
        isOpen={Boolean(bookingToCancel)}
        title="Cancel this booking?"
        description="Only pending bookings can be cancelled. This will remove the booking and make the slot available again in real time."
        confirmLabel="Cancel Booking"
        isConfirming={Boolean(cancelingBookingId)}
        onConfirm={handleCancelBooking}
        onClose={() => {
          if (!cancelingBookingId) {
            setBookingToCancel(null);
          }
        }}
      />
    </section>
  );
}

export default MyBookingsPage;

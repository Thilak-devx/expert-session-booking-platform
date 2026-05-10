import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import ConnectionBadge from "../components/ConnectionBadge";
import DetailSkeleton from "../components/DetailSkeleton";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import PageHero from "../components/PageHero";
import SlotGrid from "../components/SlotGrid";
import useExpertSlotUpdates from "../hooks/useExpertSlotUpdates";
import useExpertDetail from "../hooks/useExpertDetail";
import useSocketStatus from "../hooks/useSocketStatus";
import { applyBookingCancelledUpdate, applySlotBookedUpdate } from "../utils/slotUtils";

function ExpertDetailPage() {
  const { id } = useParams();
  const { expert, isLoading, error, setExpert, refetchExpert } = useExpertDetail(id);
  const socketStatus = useSocketStatus();
  const lastUpdatedAt = expert?.lastSlotUpdateAt;

  useEffect(() => {
    if (socketStatus === "connected" && expert?._id) {
      refetchExpert();
    }
  }, [socketStatus, expert?._id]);

  useExpertSlotUpdates(id, (payload) => {
    if (payload.type === "bookingCancelled") {
      setExpert((previous) => {
        const next = applyBookingCancelledUpdate(previous, payload);

        if (!next) {
          return next;
        }

        return {
          ...next,
          lastSlotUpdateAt: payload.updatedAt,
        };
      });

      return;
    }

    setExpert((previous) => {
      const next = applySlotBookedUpdate(previous, payload);

      if (!next) {
        return next;
      }

      return {
        ...next,
        lastSlotUpdateAt: payload.updatedAt,
      };
    });
  });

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load expert details"
        description={error}
        actionLabel="Back to experts"
        onAction={() => window.history.back()}
      />
    );
  }

  if (!expert) {
    return (
      <EmptyState
        title="Expert not found"
        description="The profile you requested could not be found. It may have been removed or the link may be invalid."
      />
    );
  }

  return (
    <section className="space-y-8">
      <PageHero
        badge={expert.category}
        title={expert.name}
        description={expert.bio}
        aside={
          <div className="space-y-4">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-300">Experience</p>
              <p className="mt-2 text-3xl font-semibold">{expert.experience}+ years</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-300">Rating</p>
              <p className="mt-2 text-3xl font-semibold">{expert.rating.toFixed(1)} / 5</p>
            </div>
            <Link
              to={`/booking/${expert._id}`}
              className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-900"
            >
              Book This Expert
            </Link>
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <ConnectionBadge status={socketStatus} />
        {lastUpdatedAt ? (
          <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
            Slots updated live
          </span>
        ) : null}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-soft">
          <div className="flex h-[340px] items-center justify-center rounded-[28px] bg-slate-100/80 p-4 sm:h-[420px] lg:h-[480px]">
            <img
              src={expert.profileImage}
              alt={expert.name}
              className="h-full w-full rounded-[24px] object-contain object-center"
            />
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] bg-slate-100 p-5">
              <p className="text-sm text-slate-500">Experience</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{expert.experience}+ years</p>
            </div>
            <div className="rounded-[24px] bg-slate-100 p-5">
              <p className="text-sm text-slate-500">Rating</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{expert.rating.toFixed(1)} / 5</p>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-soft">
          <h3 className="text-2xl font-semibold text-slate-900">Open Slots</h3>
          <p className="mt-2 text-sm text-slate-500">Availability updates automatically as bookings change.</p>
          <div className="mt-6 space-y-5">
            {expert.availableSlots?.length ? (
              expert.availableSlots.map((slotGroup) => (
                <div key={slotGroup.date} className="rounded-[24px] bg-slate-100 p-5">
                  <p className="font-semibold text-slate-900">{slotGroup.date}</p>
                  <div className="mt-4">
                    <SlotGrid slots={slotGroup.slots} selectedSlot="" disabledSlots={[]} onSelectSlot={() => {}} />
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                title="No open slots"
                description="There are no open time slots for this expert right now."
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ExpertDetailPage;

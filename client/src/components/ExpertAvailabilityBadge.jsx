function ExpertAvailabilityBadge({ availableSlots = [] }) {
  const totalSlots = availableSlots.reduce((count, item) => count + item.slots.length, 0);

  return (
    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
      {totalSlots} open slots
    </span>
  );
}

export default ExpertAvailabilityBadge;

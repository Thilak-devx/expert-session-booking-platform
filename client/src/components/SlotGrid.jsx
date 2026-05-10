function SlotGrid({ slots, selectedSlot, disabledSlots = [], onSelectSlot }) {
  return (
    <div className="flex flex-wrap gap-3">
      {slots.map((slot) => {
        const isSelected = slot === selectedSlot;
        const isDisabled = disabledSlots.includes(slot);

        return (
          <button
            key={slot}
            type="button"
            disabled={isDisabled}
            onClick={() => onSelectSlot(slot)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              isDisabled
                ? "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400 line-through"
                : isSelected
                  ? "bg-slate-900 text-white"
                  : "border border-slate-300 bg-white text-slate-700 hover:border-slate-900 hover:text-slate-900"
            }`}
          >
            {slot}
          </button>
        );
      })}
    </div>
  );
}

export default SlotGrid;

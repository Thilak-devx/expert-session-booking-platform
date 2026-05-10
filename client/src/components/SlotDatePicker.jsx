function SlotDatePicker({ dates, selectedDate, onSelectDate }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
      {dates.map((slotGroup) => {
        const isActive = slotGroup.date === selectedDate;

        return (
          <button
            key={slotGroup.date}
            type="button"
            onClick={() => onSelectDate(slotGroup.date)}
            className={`rounded-[22px] border p-4 text-left transition ${
              isActive
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-slate-50 text-slate-900 hover:border-sky-400"
            }`}
          >
            <p className="text-sm font-semibold">{slotGroup.date}</p>
            <p className={`mt-2 text-sm ${isActive ? "text-slate-200" : "text-slate-500"}`}>
              {slotGroup.slots.length} open slots
            </p>
          </button>
        );
      })}
    </div>
  );
}

export default SlotDatePicker;

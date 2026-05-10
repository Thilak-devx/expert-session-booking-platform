export function applySlotBookedUpdate(expert, payload) {
  if (!expert || payload.expertId !== expert._id) {
    return expert;
  }

  return {
    ...expert,
    availableSlots: expert.availableSlots
      .map((slotGroup) =>
        slotGroup.date === payload.date
          ? {
              ...slotGroup,
              slots: slotGroup.slots.filter((slot) => slot !== payload.timeSlot),
            }
          : slotGroup
      )
      .filter((slotGroup) => slotGroup.slots.length > 0),
  };
}

export function applyBookingCancelledUpdate(expert, payload) {
  if (!expert || payload.expertId !== expert._id) {
    return expert;
  }

  const slotGroupIndex = expert.availableSlots.findIndex((slotGroup) => slotGroup.date === payload.date);

  if (slotGroupIndex === -1) {
    return {
      ...expert,
      availableSlots: [...expert.availableSlots, { date: payload.date, slots: [payload.timeSlot] }].sort((left, right) =>
        left.date.localeCompare(right.date)
      ),
    };
  }

  return {
    ...expert,
    availableSlots: expert.availableSlots.map((slotGroup) =>
      slotGroup.date === payload.date
        ? {
            ...slotGroup,
            slots: [...new Set([...slotGroup.slots, payload.timeSlot])].sort(),
          }
        : slotGroup
    ),
  };
}

export function findAvailableSlotsForDate(expert, date) {
  if (!expert || !date) {
    return [];
  }

  return expert.availableSlots.find((item) => item.date === date)?.slots || [];
}

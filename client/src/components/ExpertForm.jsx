import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import ConfirmModal from "./ConfirmModal";

const createEmptySlotGroup = () => ({
  date: "",
  slots: [""],
});

const createInitialState = (initialValues) => ({
  name: initialValues?.name || "",
  category: initialValues?.category || "",
  experience: initialValues?.experience ?? 0,
  rating: initialValues?.rating ?? 4.5,
  bio: initialValues?.bio || "",
  profileImage: initialValues?.profileImage || "",
  availableSlots:
    initialValues?.availableSlots?.length > 0
      ? initialValues.availableSlots.map((slotGroup) => ({
          date: slotGroup.date,
          slots: slotGroup.slots.length ? [...slotGroup.slots] : [""],
        }))
      : [createEmptySlotGroup()],
});

function ExpertForm({ mode = "create", initialValues, categories = [], onSubmit, isSubmitting }) {
  const [form, setForm] = useState(() => createInitialState(initialValues));
  const [errors, setErrors] = useState({});
  const [pendingRemoval, setPendingRemoval] = useState(null);

  const categoryOptions = useMemo(
    () => [...new Set(categories.filter(Boolean))].sort((left, right) => left.localeCompare(right)),
    [categories]
  );

  const updateField = (field, value) => {
    setErrors((previous) => ({ ...previous, [field]: "" }));
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const updateSlotGroup = (groupIndex, field, value) => {
    setErrors((previous) => ({ ...previous, availableSlots: "" }));
    setForm((previous) => ({
      ...previous,
      availableSlots: previous.availableSlots.map((slotGroup, index) =>
        index === groupIndex ? { ...slotGroup, [field]: value } : slotGroup
      ),
    }));
  };

  const updateSlotValue = (groupIndex, slotIndex, value) => {
    setErrors((previous) => ({ ...previous, availableSlots: "" }));
    setForm((previous) => ({
      ...previous,
      availableSlots: previous.availableSlots.map((slotGroup, index) =>
        index === groupIndex
          ? {
              ...slotGroup,
              slots: slotGroup.slots.map((slot, currentSlotIndex) =>
                currentSlotIndex === slotIndex ? value : slot
              ),
            }
          : slotGroup
      ),
    }));
  };

  const addSlotGroup = () => {
    setForm((previous) => ({
      ...previous,
      availableSlots: [...previous.availableSlots, createEmptySlotGroup()],
    }));
  };

  const confirmRemoveSlotGroup = (groupIndex) => {
    setPendingRemoval({
      type: "group",
      groupIndex,
      title: "Remove this date?",
      description: "This will remove the selected date and all of its available time slots.",
      confirmLabel: "Remove Date",
      confirmingText: "Removing...",
    });
  };

  const confirmRemoveSlot = (groupIndex, slotIndex) => {
    setPendingRemoval({
      type: "slot",
      groupIndex,
      slotIndex,
      title: "Remove this slot?",
      description: "This time slot will be removed from the expert's available schedule.",
      confirmLabel: "Remove Slot",
      confirmingText: "Removing...",
    });
  };

  const removeSlotGroup = (groupIndex) => {
    setForm((previous) => ({
      ...previous,
      availableSlots:
        previous.availableSlots.length === 1
          ? [createEmptySlotGroup()]
          : previous.availableSlots.filter((_, index) => index !== groupIndex),
    }));
  };

  const addSlot = (groupIndex) => {
    setForm((previous) => ({
      ...previous,
      availableSlots: previous.availableSlots.map((slotGroup, index) =>
        index === groupIndex ? { ...slotGroup, slots: [...slotGroup.slots, ""] } : slotGroup
      ),
    }));
  };

  const removeSlot = (groupIndex, slotIndex) => {
    setForm((previous) => ({
      ...previous,
      availableSlots: previous.availableSlots.map((slotGroup, index) =>
        index === groupIndex
          ? {
              ...slotGroup,
              slots: slotGroup.slots.length === 1 ? [""] : slotGroup.slots.filter((_, current) => current !== slotIndex),
            }
          : slotGroup
      ),
    }));
  };

  const handleConfirmRemoval = () => {
    if (!pendingRemoval) {
      return;
    }

    if (pendingRemoval.type === "group") {
      removeSlotGroup(pendingRemoval.groupIndex);
      toast.success("Date removed successfully");
    } else {
      removeSlot(pendingRemoval.groupIndex, pendingRemoval.slotIndex);
      toast.success("Slot removed successfully");
    }

    setPendingRemoval(null);
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = "Name is required";
    if (!form.category.trim()) nextErrors.category = "Category is required";
    if (Number(form.experience) < 0) nextErrors.experience = "Experience must be 0 or more";
    if (Number(form.rating) < 0 || Number(form.rating) > 5) nextErrors.rating = "Rating must be between 0 and 5";
    if (form.bio.trim().length < 20) nextErrors.bio = "Bio should be at least 20 characters";
    if (!/^https?:\/\/.+/i.test(form.profileImage.trim())) nextErrors.profileImage = "Enter a valid image URL";

    const hasValidSlots = form.availableSlots.every(
      (slotGroup) =>
        slotGroup.date.trim() &&
        /^\d{4}-\d{2}-\d{2}$/.test(slotGroup.date.trim()) &&
        slotGroup.slots.some((slot) => slot.trim())
    );

    if (!hasValidSlots) {
      nextErrors.availableSlots = "Each slot group needs a valid date and at least one time slot";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit({
      ...form,
      experience: Number(form.experience),
      rating: Number(form.rating),
      availableSlots: form.availableSlots.map((slotGroup) => ({
        date: slotGroup.date.trim(),
        slots: slotGroup.slots.map((slot) => slot.trim()).filter(Boolean),
      })),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-soft">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
          <input
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500"
            placeholder="Expert name"
          />
          {errors.name ? <p className="mt-2 text-sm text-rose-600">{errors.name}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Category</label>
          <input
            list="expert-category-options"
            value={form.category}
            onChange={(event) => updateField("category", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500"
            placeholder="Career Mentor"
          />
          <datalist id="expert-category-options">
            {categoryOptions.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
          {errors.category ? <p className="mt-2 text-sm text-rose-600">{errors.category}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Experience</label>
          <input
            type="number"
            min="0"
            value={form.experience}
            onChange={(event) => updateField("experience", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500"
          />
          {errors.experience ? <p className="mt-2 text-sm text-rose-600">{errors.experience}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Rating</label>
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={form.rating}
            onChange={(event) => updateField("rating", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500"
          />
          {errors.rating ? <p className="mt-2 text-sm text-rose-600">{errors.rating}</p> : null}
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">Profile Image URL</label>
          <input
            value={form.profileImage}
            onChange={(event) => updateField("profileImage", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500"
            placeholder="https://..."
          />
          {errors.profileImage ? <p className="mt-2 text-sm text-rose-600">{errors.profileImage}</p> : null}
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">Bio</label>
          <textarea
            value={form.bio}
            onChange={(event) => updateField("bio", event.target.value)}
            rows="5"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500"
            placeholder="Professional summary"
          />
          {errors.bio ? <p className="mt-2 text-sm text-rose-600">{errors.bio}</p> : null}
        </div>
      </div>

      <div className="rounded-[28px] bg-slate-50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Available Slots</h3>
            <p className="mt-1 text-sm text-slate-500">Add dates and the slots that should appear in the booking flow.</p>
          </div>
          <button
            type="button"
            onClick={addSlotGroup}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
          >
            Add Date Group
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {form.availableSlots.map((slotGroup, groupIndex) => (
            <div key={`${slotGroup.date}-${groupIndex}`} className="rounded-[24px] border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <input
                  type="date"
                  value={slotGroup.date}
                  onChange={(event) => updateSlotGroup(groupIndex, "date", event.target.value)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={() => confirmRemoveSlotGroup(groupIndex)}
                  aria-label={`Remove date ${slotGroup.date || groupIndex + 1}`}
                  className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600"
                >
                  Remove Date
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {slotGroup.slots.map((slot, slotIndex) => (
                  <div key={`${slot}-${slotIndex}`} className="flex flex-wrap gap-3">
                    <input
                      value={slot}
                      onChange={(event) => updateSlotValue(groupIndex, slotIndex, event.target.value)}
                      className="min-w-[220px] flex-1 rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500"
                      placeholder="10:00 AM"
                    />
                    <button
                      type="button"
                      onClick={() => confirmRemoveSlot(groupIndex, slotIndex)}
                      aria-label={`Remove slot ${slot || slotIndex + 1}`}
                      className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
                    >
                      Remove Slot
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => addSlot(groupIndex)}
                className="mt-4 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700"
              >
                Add Slot
              </button>
            </div>
          ))}
        </div>

        {errors.availableSlots ? <p className="mt-3 text-sm text-rose-600">{errors.availableSlots}</p> : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Saving expert..." : mode === "create" ? "Create Expert" : "Update Expert"}
      </button>

      <ConfirmModal
        isOpen={Boolean(pendingRemoval)}
        title={pendingRemoval?.title}
        description={pendingRemoval?.description}
        confirmLabel={pendingRemoval?.confirmLabel}
        confirmingText={pendingRemoval?.confirmingText}
        onConfirm={handleConfirmRemoval}
        onClose={() => setPendingRemoval(null)}
      />
    </form>
  );
}

export default ExpertForm;

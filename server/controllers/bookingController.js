const Booking = require("../models/Booking");
const Expert = require("../models/Expert");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { emitSlotBooked, emitBookingCancelled } = require("../socket");

const normalizeBookingStatus = (status) => {
  if (status === "Confirmed" || status === "Completed") {
    return status;
  }

  return "Pending";
};

const createBooking = asyncHandler(async (req, res) => {
  const { expertId, name, email, phone, date, timeSlot, notes, status } = req.body;

  const expert = await Expert.findById(expertId);

  if (!expert) {
    throw new AppError("Expert not found", 404);
  }

  const matchingDate = expert.availableSlots.find((item) => item.date === date);

  if (!matchingDate || !matchingDate.slots.includes(timeSlot)) {
    throw new AppError("Selected time slot is not available for this expert", 400);
  }

  let booking;

  try {
    booking = await Booking.create({
      expertId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      date: date.trim(),
      timeSlot: timeSlot.trim(),
      notes: typeof notes === "string" ? notes.trim() : "",
      status: status?.trim() || "Pending",
    });
  } catch (error) {
    if (error?.code === 11000) {
      throw new AppError("This slot was just booked. Please choose another available time.", 409);
    }

    throw error;
  }

  emitSlotBooked({
    expertId: booking.expertId.toString(),
    date: booking.date,
    timeSlot: booking.timeSlot,
  });

  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    data: {
      booking,
      confirmation: {
        expertName: expert.name,
        category: expert.category,
      },
    },
  });
});

const getBookingsByEmail = asyncHandler(async (req, res) => {
  const email = req.query.email.trim().toLowerCase();

  const bookingDocuments = await Booking.find({ email })
    .populate("expertId", "name category profileImage")
    .sort({ createdAt: -1 });

  const bookings = bookingDocuments.map((booking) => ({
    ...booking.toObject(),
    status: normalizeBookingStatus(booking.status),
  }));

  res.status(200).json({
    success: true,
    message: "Bookings fetched successfully",
    data: {
      bookings,
    },
  });
});

const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status: normalizeBookingStatus(req.body.status.trim()) },
    { new: true, runValidators: true }
  );

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Booking status updated successfully",
    data: {
      booking,
    },
  });
});

const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (booking.status !== "Pending") {
    throw new AppError("Only pending bookings can be cancelled", 400);
  }

  await booking.deleteOne();

  emitBookingCancelled({
    expertId: booking.expertId.toString(),
    date: booking.date,
    timeSlot: booking.timeSlot,
  });

  res.status(200).json({
    success: true,
    message: "Booking cancelled successfully",
    data: {
      deletedBookingId: req.params.id,
      restoredSlot: {
        expertId: booking.expertId.toString(),
        date: booking.date,
        timeSlot: booking.timeSlot,
      },
    },
  });
});

module.exports = {
  createBooking,
  getBookingsByEmail,
  updateBookingStatus,
  deleteBooking,
};

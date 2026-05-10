const mongoose = require("mongoose");

const AppError = require("../utils/AppError");

const validateExpertQuery = (req, res, next) => {
  const { page = "1", limit = "10", search, category } = req.query;

  const parsedPage = Number(page);
  const parsedLimit = Number(limit);

  if (!Number.isInteger(parsedPage) || parsedPage < 1) {
    return next(new AppError("Query parameter 'page' must be a positive integer", 400));
  }

  if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
    return next(new AppError("Query parameter 'limit' must be an integer between 1 and 100", 400));
  }

  if (search !== undefined && typeof search !== "string") {
    return next(new AppError("Query parameter 'search' must be a string", 400));
  }

  if (category !== undefined && typeof category !== "string") {
    return next(new AppError("Query parameter 'category' must be a string", 400));
  }

  if (typeof search === "string" && search.trim().length > 100) {
    return next(new AppError("Query parameter 'search' must be 100 characters or fewer", 400));
  }

  if (typeof category === "string" && category.trim().length > 50) {
    return next(new AppError("Query parameter 'category' must be 50 characters or fewer", 400));
  }

  return next();
};

const validateMongoId = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid expert id", 400));
  }

  return next();
};

const allowedBookingStatuses = ["Pending", "Confirmed", "Completed"];
const urlPattern = /^https?:\/\/.+/i;

const validateSlots = (availableSlots) => {
  if (!Array.isArray(availableSlots) || availableSlots.length === 0) {
    return "Field 'availableSlots' must contain at least one date group";
  }

  for (const slotGroup of availableSlots) {
    if (!slotGroup || typeof slotGroup !== "object") {
      return "Each available slot group must be an object";
    }

    if (typeof slotGroup.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(slotGroup.date.trim())) {
      return "Each slot group must include a date in YYYY-MM-DD format";
    }

    if (!Array.isArray(slotGroup.slots) || slotGroup.slots.length === 0) {
      return "Each slot group must contain at least one time slot";
    }

    const normalizedSlots = slotGroup.slots.map((slot) => (typeof slot === "string" ? slot.trim() : slot));

    if (normalizedSlots.some((slot) => typeof slot !== "string" || slot.length === 0 || slot.length > 40)) {
      return "Each time slot must be a non-empty string up to 40 characters";
    }

    if (new Set(normalizedSlots).size !== normalizedSlots.length) {
      return "Duplicate time slots are not allowed for the same date";
    }
  }

  return null;
};

const validateExpertPayload = (req, res, next) => {
  const { name, category, experience, rating, bio, profileImage, availableSlots } = req.body;

  if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 80) {
    return next(new AppError("Field 'name' must be between 2 and 80 characters", 400));
  }

  if (typeof category !== "string" || category.trim().length < 2 || category.trim().length > 50) {
    return next(new AppError("Field 'category' must be between 2 and 50 characters", 400));
  }

  if (typeof bio !== "string" || bio.trim().length < 20 || bio.trim().length > 500) {
    return next(new AppError("Field 'bio' must be between 20 and 500 characters", 400));
  }

  if (typeof profileImage !== "string" || !urlPattern.test(profileImage.trim())) {
    return next(new AppError("Field 'profileImage' must be a valid URL", 400));
  }

  if (typeof experience !== "number" || Number.isNaN(experience) || experience < 0 || experience > 60) {
    return next(new AppError("Field 'experience' must be a number between 0 and 60", 400));
  }

  if (typeof rating !== "number" || Number.isNaN(rating) || rating < 0 || rating > 5) {
    return next(new AppError("Field 'rating' must be a number between 0 and 5", 400));
  }

  const slotValidationError = validateSlots(availableSlots);

  if (slotValidationError) {
    return next(new AppError(slotValidationError, 400));
  }

  return next();
};

const validateCreateBooking = (req, res, next) => {
  const requiredFields = ["expertId", "name", "email", "phone", "date", "timeSlot"];

  for (const field of requiredFields) {
    const value = req.body[field];

    if (typeof value !== "string" || value.trim() === "") {
      return next(new AppError(`Field '${field}' is required`, 400));
    }
  }

  if (!mongoose.Types.ObjectId.isValid(req.body.expertId)) {
    return next(new AppError("Invalid expertId", 400));
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(req.body.email.trim())) {
    return next(new AppError("Please provide a valid email address", 400));
  }

  if (req.body.name.trim().length < 2 || req.body.name.trim().length > 80) {
    return next(new AppError("Field 'name' must be between 2 and 80 characters", 400));
  }

  if (!/^[0-9+\-() ]{7,20}$/.test(req.body.phone.trim())) {
    return next(new AppError("Please provide a valid phone number", 400));
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(req.body.date.trim())) {
    return next(new AppError("Field 'date' must be in YYYY-MM-DD format", 400));
  }

  if (req.body.timeSlot.trim().length > 40) {
    return next(new AppError("Field 'timeSlot' must be 40 characters or fewer", 400));
  }

  if (req.body.notes !== undefined && typeof req.body.notes !== "string") {
    return next(new AppError("Field 'notes' must be a string", 400));
  }

  if (typeof req.body.notes === "string" && req.body.notes.trim().length > 500) {
    return next(new AppError("Field 'notes' must be 500 characters or fewer", 400));
  }

  if (req.body.status !== undefined && !allowedBookingStatuses.includes(req.body.status)) {
    return next(new AppError(`Status must be one of: ${allowedBookingStatuses.join(", ")}`, 400));
  }

  return next();
};

const validateBookingEmailQuery = (req, res, next) => {
  const { email } = req.query;

  if (typeof email !== "string" || email.trim() === "") {
    return next(new AppError("Query parameter 'email' is required", 400));
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email.trim())) {
    return next(new AppError("Query parameter 'email' must be a valid email address", 400));
  }

  return next();
};

const validateBookingStatusUpdate = (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid booking id", 400));
  }

  if (typeof status !== "string" || !allowedBookingStatuses.includes(status.trim())) {
    return next(new AppError(`Status must be one of: ${allowedBookingStatuses.join(", ")}`, 400));
  }

  return next();
};

const validateBookingIdParam = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid booking id", 400));
  }

  return next();
};

module.exports = {
  validateExpertQuery,
  validateMongoId,
  validateExpertPayload,
  validateCreateBooking,
  validateBookingEmailQuery,
  validateBookingStatusUpdate,
  validateBookingIdParam,
};

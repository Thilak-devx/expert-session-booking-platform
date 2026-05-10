const Expert = require("../models/Expert");
const Booking = require("../models/Booking");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const removeBookedSlots = async (expertDocuments) => {
  const experts = expertDocuments.map((expert) => expert.toObject());

  if (experts.length === 0) {
    return experts;
  }

  const expertIds = experts.map((expert) => expert._id);

  const bookings = await Booking.find({
    expertId: { $in: expertIds },
  }).select("expertId date timeSlot");

  const bookedSlotMap = new Map();

  bookings.forEach((booking) => {
    const key = `${booking.expertId.toString()}__${booking.date}`;
    const existingSlots = bookedSlotMap.get(key) || new Set();

    existingSlots.add(booking.timeSlot);
    bookedSlotMap.set(key, existingSlots);
  });

  return experts.map((expert) => ({
    ...expert,
    availableSlots: expert.availableSlots
      .map((slotGroup) => {
        const key = `${expert._id.toString()}__${slotGroup.date}`;
        const bookedSlots = bookedSlotMap.get(key) || new Set();
        const openSlots = slotGroup.slots.filter((slot) => !bookedSlots.has(slot));

        return {
          ...slotGroup,
          slots: openSlots,
        };
      })
      .filter((slotGroup) => slotGroup.slots.length > 0),
  }));
};

const normalizeAvailableSlots = (availableSlots) =>
  availableSlots.map((slotGroup) => ({
    date: slotGroup.date.trim(),
    slots: slotGroup.slots.map((slot) => slot.trim()),
  }));

const countAvailableSlots = (experts) =>
  experts.reduce(
    (total, expert) =>
      total +
      expert.availableSlots.reduce((slotTotal, slotGroup) => slotTotal + slotGroup.slots.length, 0),
    0
  );

const getExperts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search?.trim();
  const category = req.query.category?.trim();

  const query = {};

  if (search) {
    query.name = { $regex: escapeRegex(search), $options: "i" };
  }

  if (category) {
    query.category = { $regex: `^${escapeRegex(category)}$`, $options: "i" };
  }

  const [totalExperts, categories] = await Promise.all([
    Expert.countDocuments(query),
    Expert.distinct("category"),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalExperts / limit));
  const currentPage = Math.min(page, totalPages);
  const skip = (currentPage - 1) * limit;

  const [expertDocuments, expertDocumentsForStats] = await Promise.all([
    Expert.find(query).sort({ name: 1 }).skip(skip).limit(limit),
    Expert.find(query).select("availableSlots"),
  ]);

  const [experts, expertsForStats] = await Promise.all([
    removeBookedSlots(expertDocuments),
    removeBookedSlots(expertDocumentsForStats),
  ]);
  const totalAvailableSlots = countAvailableSlots(expertsForStats);

  res.status(200).json({
    success: true,
    message: "Experts fetched successfully",
    data: {
      experts,
      totalPages,
      currentPage,
      totalExperts,
      totalAvailableSlots,
      categories: categories.sort((left, right) => left.localeCompare(right)),
    },
  });
});

const getExpertById = asyncHandler(async (req, res) => {
  const expertDocument = await Expert.findById(req.params.id);

  if (!expertDocument) {
    throw new AppError("Expert not found", 404);
  }

  const [expert] = await removeBookedSlots([expertDocument]);

  res.status(200).json({
    success: true,
    message: "Expert fetched successfully",
    data: expert,
  });
});

const getAllExpertsForAdmin = asyncHandler(async (req, res) => {
  const experts = await Expert.find().sort({ name: 1 });

  res.status(200).json({
    success: true,
    message: "Admin experts fetched successfully",
    data: {
      experts,
    },
  });
});

const getUniqueCategories = asyncHandler(async (req, res) => {
  const categories = await Expert.distinct("category");

  res.status(200).json({
    success: true,
    message: "Categories fetched successfully",
    data: {
      categories: categories.sort((left, right) => left.localeCompare(right)),
    },
  });
});

const createExpert = asyncHandler(async (req, res) => {
  const expert = await Expert.create({
    name: req.body.name.trim(),
    category: req.body.category.trim(),
    experience: req.body.experience,
    rating: req.body.rating,
    bio: req.body.bio.trim(),
    profileImage: req.body.profileImage.trim(),
    availableSlots: normalizeAvailableSlots(req.body.availableSlots),
  });

  res.status(201).json({
    success: true,
    message: "Expert created successfully",
    data: {
      expert,
    },
  });
});

const updateExpert = asyncHandler(async (req, res) => {
  const expert = await Expert.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name.trim(),
      category: req.body.category.trim(),
      experience: req.body.experience,
      rating: req.body.rating,
      bio: req.body.bio.trim(),
      profileImage: req.body.profileImage.trim(),
      availableSlots: normalizeAvailableSlots(req.body.availableSlots),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!expert) {
    throw new AppError("Expert not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Expert updated successfully",
    data: {
      expert,
    },
  });
});

const deleteExpert = asyncHandler(async (req, res) => {
  const expert = await Expert.findByIdAndDelete(req.params.id);

  if (!expert) {
    throw new AppError("Expert not found", 404);
  }

  await Booking.deleteMany({ expertId: req.params.id });

  res.status(200).json({
    success: true,
    message: "Expert deleted successfully",
    data: {
      deletedExpertId: req.params.id,
    },
  });
});

module.exports = {
  getExperts,
  getExpertById,
  getAllExpertsForAdmin,
  getUniqueCategories,
  createExpert,
  updateExpert,
  deleteExpert,
};

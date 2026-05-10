const mongoose = require("mongoose");

const slotGroupSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: [true, "Slot date is required"],
      trim: true,
    },
    slots: {
      type: [String],
      required: [true, "Slots are required"],
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: "At least one slot is required for each date",
      },
    },
  },
  { _id: false }
);

const expertSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Expert name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    experience: {
      type: Number,
      required: [true, "Experience is required"],
      min: [0, "Experience cannot be negative"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
    },
    bio: {
      type: String,
      required: [true, "Bio is required"],
      trim: true,
    },
    profileImage: {
      type: String,
      required: [true, "Profile image is required"],
      trim: true,
    },
    availableSlots: {
      type: [slotGroupSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

expertSchema.index({ name: "text", category: "text" });

module.exports = mongoose.model("Expert", expertSchema);

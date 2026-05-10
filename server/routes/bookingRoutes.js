const express = require("express");

const {
  createBooking,
  getBookingsByEmail,
  updateBookingStatus,
  deleteBooking,
} = require("../controllers/bookingController");
const {
  validateCreateBooking,
  validateBookingEmailQuery,
  validateBookingIdParam,
  validateBookingStatusUpdate,
} = require("../middleware/validateRequest");

const router = express.Router();

router.post("/", validateCreateBooking, createBooking);
router.get("/", validateBookingEmailQuery, getBookingsByEmail);
router.delete("/:id", validateBookingIdParam, deleteBooking);
router.patch("/:id/status", validateBookingStatusUpdate, updateBookingStatus);

module.exports = router;

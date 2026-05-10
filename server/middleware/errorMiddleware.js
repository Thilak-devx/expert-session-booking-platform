const mongoose = require("mongoose");

const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);

  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let error = { ...err, message: err.message };
  let statusCode = error.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);

  if (error instanceof mongoose.Error.CastError) {
    statusCode = 400;
    error = { message: `Invalid ${error.path}: ${error.value}` };
  }

  if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    error = {
      message: Object.values(error.errors)
        .map((item) => item.message)
        .join(", "),
    };
  }

  if (error.code === 11000) {
    statusCode = 409;
    error = {
      message: "This expert is already booked for the selected date and time slot",
    };
  }

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    statusCode = 400;
    error = {
      message: "Invalid JSON payload. Please verify the request body and try again.",
    };
  }

  res.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

module.exports = {
  notFound,
  errorHandler,
};

const express = require("express");
const cors = require("cors");

const env = require("./config/env");
const bookingRoutes = require("./routes/bookingRoutes");
const expertRoutes = require("./routes/expertRoutes");
const healthRoutes = require("./routes/healthRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/experts", expertRoutes);
app.use("/api/bookings", bookingRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

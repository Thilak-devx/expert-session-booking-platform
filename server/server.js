const http = require("http");
const mongoose = require("mongoose");

const app = require("./app");
const env = require("./config/env");
const connectDB = require("./config/db");
const { initializeSocket } = require("./socket");
const seedExpertsIfEmpty = require("./utils/seedExpertsIfEmpty");

let server;

const shutdown = async (signal) => {
  console.log(`[server] Received ${signal}. Starting graceful shutdown...`);

  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    }

    await mongoose.connection.close();
    console.log("[server] Shutdown completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("[server] Graceful shutdown failed:", error.message);
    process.exit(1);
  }
};

const startServer = async () => {
  console.log(`[server] Booting Expert Session Booking System backend in ${env.NODE_ENV} mode...`);

  await connectDB();
  const seedResult = await seedExpertsIfEmpty();

  if (seedResult.seeded) {
    console.log(`[seed] Inserted ${seedResult.count} default experts because the database was empty.`);
  }

  server = http.createServer(app);

  initializeSocket(server, env.CLIENT_URL);

  server.listen(env.PORT, () => {
    console.log(`[server] HTTP server listening on port ${env.PORT}`);
    console.log(`[server] Health check available at /api/health`);
    console.log(`[server] Expert routes available at /api/experts`);
    console.log(`[server] Booking routes available at /api/bookings`);
    console.log(`[server] CORS enabled for ${env.CLIENT_URL}`);
  });

  server.on("error", (error) => {
    console.error("[server] HTTP server error:", error.message);
    process.exit(1);
  });
};

startServer().catch((error) => {
  console.error("[server] Failed to start server:", error.message);
  process.exit(1);
});

process.on("SIGINT", () => {
  shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});

process.on("unhandledRejection", (reason) => {
  console.error("[server] Unhandled promise rejection:", reason);
  shutdown("unhandledRejection");
});

process.on("uncaughtException", (error) => {
  console.error("[server] Uncaught exception:", error.message);
  process.exit(1);
});

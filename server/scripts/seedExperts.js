const connectDB = require("../config/db");
const Expert = require("../models/Expert");
const expertSeedData = require("../data/expertSeedData");

const seedExperts = async () => {
  try {
    await connectDB();

    await Expert.deleteMany();
    await Expert.insertMany(expertSeedData);
    await Expert.syncIndexes();

    console.log("[seed] Expert data seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("[seed] Failed to seed experts:", error.message);
    process.exit(1);
  }
};

seedExperts();

const Expert = require("../models/Expert");
const expertSeedData = require("../data/expertSeedData");

const seedExpertsIfEmpty = async () => {
  const existingExperts = await Expert.countDocuments();

  if (existingExperts > 0) {
    return { seeded: false, count: existingExperts };
  }

  await Expert.insertMany(expertSeedData);
  await Expert.syncIndexes();

  return { seeded: true, count: expertSeedData.length };
};

module.exports = seedExpertsIfEmpty;

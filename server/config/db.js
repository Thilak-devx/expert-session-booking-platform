const mongoose = require("mongoose");

const env = require("./env");

const connectDB = async () => {
  mongoose.set("strictQuery", true);

  const connection = await mongoose.connect(env.MONGO_URI);

  await Promise.all(Object.values(mongoose.models).map((model) => model.init()));

  console.log(
    `[database] MongoDB connected to ${connection.connection.host}:${connection.connection.port}/${connection.connection.name}`
  );
  console.log("[database] MongoDB indexes are initialized.");
};

module.exports = connectDB;

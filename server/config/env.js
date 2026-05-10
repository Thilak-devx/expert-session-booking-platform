const dotenv = require("dotenv");

dotenv.config();

const requiredEnvVars = ["PORT", "MONGO_URI", "CLIENT_URL"];

const getEnvVariable = (key) => {
  const value = process.env[key];

  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value.trim();
};

requiredEnvVars.forEach((key) => {
  getEnvVariable(key);
});

module.exports = {
  NODE_ENV: process.env.NODE_ENV?.trim() || "development",
  PORT: Number(getEnvVariable("PORT")),
  MONGO_URI: getEnvVariable("MONGO_URI"),
  CLIENT_URL: getEnvVariable("CLIENT_URL"),
};

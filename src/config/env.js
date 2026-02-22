const dotenv = require("dotenv");

dotenv.config();

function required(name) {
  const value = process.env[name];
  if (!value || String(value).trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function parsePort(value) {
  if (!value) return 3000;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error("Invalid PORT. PORT must be a positive integer.");
  }
  return parsed;
}

function parseOrigins(value) {
  const origins = value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (origins.length === 0) {
    throw new Error("FRONTEND_ORIGIN must contain at least one origin.");
  }

  return origins;
}

const env = {
  PORT: parsePort(process.env.PORT),
  MONGODB_URI: required("MONGODB_URI"),
  JWT_SECRET: required("JWT_SECRET"),
  FRONTEND_ORIGINS: parseOrigins(required("FRONTEND_ORIGIN")),
  GOOGLE_CLIENT_ID: required("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: required("GOOGLE_CLIENT_SECRET"),
  GOOGLE_CALLBACK_URL: required("GOOGLE_CALLBACK_URL"),
};

module.exports = env;

const mongoose = require("mongoose");
const env = require("./env");
const { logInfo, logError } = require("../utils/logger");

async function connectDatabase() {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logInfo("Connected to MongoDB Atlas");
  } catch (err) {
    logError("MongoDB connection error", err);
    throw err;
  }
}

async function disconnectDatabase() {
  try {
    await mongoose.connection.close();
    logInfo("Disconnected from MongoDB");
  } catch (err) {
    logError("MongoDB disconnection error", err);
    throw err;
  }
}

module.exports = {
  connectDatabase,
  disconnectDatabase,
};

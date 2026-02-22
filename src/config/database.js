const mongoose = require("mongoose");
const env = require("./env");

async function connectDatabase() {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}

module.exports = {
  connectDatabase,
};

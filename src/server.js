const app = require("./app");
const { connectDatabase } = require("./config/database");
const env = require("./config/env");

async function startServer() {
  await connectDatabase();
  app.listen(env.PORT, () => console.log(`🚀 Server running on port ${env.PORT}`));
}

startServer().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});

const app = require("./app");
const { connectDatabase, disconnectDatabase } = require("./config/database");
const env = require("./config/env");
const { logInfo, logWarn, logError } = require("./utils/logger");

let server;
let isShuttingDown = false;

async function shutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logWarn(`Received ${signal}. Starting graceful shutdown...`);

  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) return reject(err);
          resolve();
        });
      });
      logInfo("HTTP server closed");
    }

    await disconnectDatabase();
    logInfo("Shutdown complete");
    process.exit(0);
  } catch (err) {
    logError("Graceful shutdown failed", err);
    process.exit(1);
  }
}

async function startServer() {
  logInfo("Starting backend service...");
  await connectDatabase();
  server = app.listen(env.PORT, () => {
    logInfo(`Server running on port ${env.PORT}`);
  });
}

startServer().catch((err) => {
  logError("Failed to start server", err);
  process.exit(1);
});

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

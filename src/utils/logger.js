function timestamp() {
  return new Date().toISOString();
}

function logInfo(message) {
  console.log(`[${timestamp()}] INFO: ${message}`);
}

function logWarn(message) {
  console.warn(`[${timestamp()}] WARN: ${message}`);
}

function logError(message, error) {
  if (error) {
    console.error(`[${timestamp()}] ERROR: ${message}`, error);
    return;
  }
  console.error(`[${timestamp()}] ERROR: ${message}`);
}

module.exports = {
  logInfo,
  logWarn,
  logError,
};

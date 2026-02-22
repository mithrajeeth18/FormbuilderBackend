const { logError } = require("../utils/logger");

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const errorCode = err.errorCode || "INTERNAL_ERROR";
  const message = err.message || "Something went wrong";

  if (statusCode >= 500) {
    logError("Unhandled server error", err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorCode,
    data: null,
  });
}

module.exports = errorHandler;

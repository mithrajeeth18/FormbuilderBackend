class ApiError extends Error {
  constructor(statusCode, message, errorCode = "INTERNAL_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

module.exports = ApiError;

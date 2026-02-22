const ApiError = require("../utils/apiError");

function notFound(req, res, next) {
  next(new ApiError(404, "Route not found", "ROUTE_NOT_FOUND"));
}

module.exports = notFound;

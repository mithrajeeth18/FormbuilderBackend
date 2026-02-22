const ApiError = require("../utils/apiError");

const bucket = new Map();

function getClientKey(req) {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.trim()) {
    return xff.split(",")[0].trim();
  }
  return req.ip || "unknown";
}

function rateLimit({ windowMs, maxRequests }) {
  return (req, res, next) => {
    const now = Date.now();
    const key = getClientKey(req);

    const entry = bucket.get(key);
    if (!entry || now > entry.expiresAt) {
      bucket.set(key, { count: 1, expiresAt: now + windowMs });
      return next();
    }

    if (entry.count >= maxRequests) {
      return next(
        new ApiError(
          429,
          "Too many requests. Please try again later.",
          "RATE_LIMIT_EXCEEDED"
        )
      );
    }

    entry.count += 1;
    return next();
  };
}

module.exports = rateLimit;

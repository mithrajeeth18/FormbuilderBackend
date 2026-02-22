const ApiError = require("../utils/apiError");
const { verifyAccessToken } = require("../utils/jwt");
const { findUserById, toAuthUser } = require("../modules/auth/auth.service");

function extractBearerToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.slice("Bearer ".length).trim();
}

async function requireAuth(req, res, next) {
  try {
    const token = extractBearerToken(req);
    if (!token) {
      return next(new ApiError(401, "Authentication required", "AUTH_REQUIRED"));
    }

    const payload = verifyAccessToken(token);
    const userId = payload && payload.sub;

    if (!userId) {
      return next(new ApiError(401, "Invalid token payload", "INVALID_TOKEN"));
    }

    const user = await findUserById(userId);
    if (!user) {
      return next(new ApiError(401, "User not found", "USER_NOT_FOUND"));
    }

    req.user = toAuthUser(user);
    return next();
  } catch (err) {
    return next(new ApiError(401, "Invalid or expired token", "INVALID_TOKEN"));
  }
}

module.exports = requireAuth;

const { sendSuccess } = require("../../utils/apiResponse");
const ApiError = require("../../utils/apiError");
const { verifyGoogleIdToken } = require("./googleAuth.service");
const { upsertGoogleUser, toAuthUser } = require("./auth.service");
const { signAccessToken } = require("../../utils/jwt");
const { logError, logInfo } = require("../../utils/logger");

async function googleLogin(req, res, next) {
  try {
    const { idToken } = req.body || {};
    const googleProfile = await verifyGoogleIdToken(idToken);
    const user = await upsertGoogleUser(googleProfile);
    const accessToken = signAccessToken(user);

    logInfo(`Google login successful: ${user.email}`);

    return sendSuccess(
      res,
      {
        accessToken,
        user: toAuthUser(user),
      },
      "Google login successful"
    );
  } catch (err) {
    if (err instanceof ApiError) {
      return next(err);
    }
    logError("Google login failed", err);
    return next(new ApiError(500, "Google authentication failed", "GOOGLE_AUTH_FAILED"));
  }
}

function getMe(req, res) {
  return sendSuccess(res, { user: req.user }, "Authenticated user fetched");
}

module.exports = {
  googleLogin,
  getMe,
};

const { OAuth2Client } = require("google-auth-library");
const env = require("../../config/env");
const ApiError = require("../../utils/apiError");

const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

async function verifyGoogleIdToken(idToken) {
  if (!idToken || typeof idToken !== "string") {
    throw new ApiError(400, "Google idToken is required", "GOOGLE_TOKEN_REQUIRED");
  }

  let ticket;
  try {
    ticket = await client.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });
  } catch (err) {
    throw new ApiError(401, "Invalid Google token", "INVALID_GOOGLE_TOKEN");
  }

  const payload = ticket.getPayload();

  if (!payload || !payload.email || !payload.name || !payload.sub) {
    throw new ApiError(401, "Google token payload is incomplete", "INVALID_GOOGLE_TOKEN");
  }

  return {
    email: payload.email.toLowerCase(),
    name: payload.name,
    avatarUrl: payload.picture || "",
    providerUserId: payload.sub,
    authProvider: "google",
  };
}

module.exports = {
  verifyGoogleIdToken,
};

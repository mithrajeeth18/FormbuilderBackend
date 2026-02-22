const User = require("./user.model");

function toAuthUser(user) {
  return {
    id: String(user._id),
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl || "",
    authProvider: user.authProvider,
  };
}

async function findUserById(id) {
  return User.findById(id);
}

async function upsertGoogleUser(profile) {
  return User.findOneAndUpdate(
    { email: profile.email },
    {
      $set: {
        name: profile.name,
        avatarUrl: profile.avatarUrl || "",
        authProvider: "google",
        providerUserId: profile.providerUserId,
      },
      $setOnInsert: {
        email: profile.email,
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );
}

module.exports = {
  toAuthUser,
  findUserById,
  upsertGoogleUser,
};

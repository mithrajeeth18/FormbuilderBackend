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

module.exports = {
  toAuthUser,
  findUserById,
};

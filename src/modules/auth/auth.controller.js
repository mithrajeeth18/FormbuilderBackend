const { sendSuccess } = require("../../utils/apiResponse");

function getMe(req, res) {
  return sendSuccess(res, { user: req.user }, "Authenticated user fetched");
}

module.exports = {
  getMe,
};

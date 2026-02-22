const express = require("express");
const formsRouter = require("../modules/forms/forms.routes");
const authRouter = require("../modules/auth/auth.routes");
const { sendSuccess } = require("../utils/apiResponse");

const router = express.Router();

router.use("/forms", formsRouter);
router.use("/api/forms", formsRouter);
router.use("/api/auth", authRouter);

router.get("/", (req, res) => {
  return sendSuccess(res, { status: "awake" }, "Backend is awake");
});

router.get("/health", (req, res) => {
  return sendSuccess(res, { status: "ok" }, "Health check passed");
});

module.exports = router;

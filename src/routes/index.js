const express = require("express");
const formsRouter = require("../modules/forms/forms.routes");

const router = express.Router();

router.use("/forms", formsRouter);
router.use("/api/forms", formsRouter);

router.get("/", (req, res) => {
  res.send("Backend is awake 🚀");
});

router.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

module.exports = router;

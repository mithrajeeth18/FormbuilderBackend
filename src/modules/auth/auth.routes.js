const express = require("express");
const { googleLogin, getMe } = require("./auth.controller");
const requireAuth = require("../../middlewares/requireAuth");

const router = express.Router();

router.post("/google", googleLogin);
router.get("/me", requireAuth, getMe);

module.exports = router;

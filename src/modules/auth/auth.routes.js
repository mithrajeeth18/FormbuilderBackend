const express = require("express");
const { getMe } = require("./auth.controller");
const requireAuth = require("../../middlewares/requireAuth");

const router = express.Router();

router.get("/me", requireAuth, getMe);

module.exports = router;

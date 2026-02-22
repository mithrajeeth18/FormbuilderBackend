const express = require("express");
const { createForm, getFormById } = require("./forms.controller");

const router = express.Router();

router.post("/forms", createForm);
router.get("/forms/:id", getFormById);

module.exports = router;

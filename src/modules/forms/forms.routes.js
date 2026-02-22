const express = require("express");
const { createForm, getFormById } = require("./forms.controller");

const router = express.Router();

router.post("/", createForm);
router.get("/:id", getFormById);

module.exports = router;

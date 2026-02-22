const formsService = require("./forms.service");
const { logInfo, logError } = require("../../utils/logger");

async function createForm(req, res) {
  try {
    const saved = await formsService.createForm(req.body);
    res.json({ id: saved._id });
    logInfo(`Form created: ${saved._id}`);
  } catch (err) {
    logError("Failed to create form", err);
    res.status(500).json({ error: "Failed to save form" });
  }
}

async function getFormById(req, res) {
  try {
    const form = await formsService.findFormById(req.params.id);
    if (!form) return res.status(404).json({ error: "Not found" });
    res.json({ form: form.config });
  } catch (err) {
    logError("Failed to fetch form by id", err);
    res.status(404).json({ error: "Not found" });
  }
}

module.exports = {
  createForm,
  getFormById,
};

const Form = require("./form.model");

async function createForm(req, res) {
  try {
    const newForm = new Form({ config: req.body });
    const saved = await newForm.save();
    res.json({ id: saved._id });
    console.log("done posting");
  } catch (err) {
    res.status(500).json({ error: "Failed to save form" });
  }
}

async function getFormById(req, res) {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ error: "Not found" });
    res.json({ form: form.config });
  } catch (err) {
    res.status(404).json({ error: "Not found" });
  }
}

module.exports = {
  createForm,
  getFormById,
};

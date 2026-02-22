const Form = require("./form.model");

async function createForm({ ownerId, config, status = "published" }) {
  const newForm = new Form({ ownerId, config, status });
  const saved = await newForm.save();
  return saved;
}

async function findPublishedFormById(id) {
  return Form.findOne({
    _id: id,
    $or: [{ status: "published" }, { status: { $exists: false } }],
  });
}

module.exports = {
  createForm,
  findPublishedFormById,
};

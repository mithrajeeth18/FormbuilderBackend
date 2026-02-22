const Form = require("./form.model");

async function createForm(config) {
  const newForm = new Form({ config });
  const saved = await newForm.save();
  return saved;
}

async function findFormById(id) {
  return Form.findById(id);
}

module.exports = {
  createForm,
  findFormById,
};

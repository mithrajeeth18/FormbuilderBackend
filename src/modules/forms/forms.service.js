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

async function findFormsByOwner({
  ownerId,
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  order = "desc",
}) {
  const skip = (page - 1) * limit;
  const sortDirection = order === "asc" ? 1 : -1;

  const [forms, total] = await Promise.all([
    Form.find({ ownerId })
      .select("_id status createdAt updatedAt config")
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(limit)
      .lean(),
    Form.countDocuments({ ownerId }),
  ]);

  return { forms, total };
}

module.exports = {
  createForm,
  findPublishedFormById,
  findFormsByOwner,
};

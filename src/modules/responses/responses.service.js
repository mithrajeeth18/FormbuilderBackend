const Response = require("./response.model");

async function createResponse({ formId, ownerId, submittedBy, answers, metadata = {} }) {
  const response = new Response({
    formId,
    ownerId,
    submittedBy,
    answers,
    metadata: {
      userAgent: metadata.userAgent || "",
      ipHash: metadata.ipHash || "",
    },
  });

  const saved = await response.save();
  return saved;
}

async function countResponsesByFormIds(formIds) {
  if (!Array.isArray(formIds) || formIds.length === 0) {
    return {};
  }

  const counts = await Response.aggregate([
    {
      $match: {
        formId: { $in: formIds },
      },
    },
    {
      $group: {
        _id: "$formId",
        count: { $sum: 1 },
      },
    },
  ]);

  const map = {};
  for (let i = 0; i < counts.length; i += 1) {
    const item = counts[i];
    map[String(item._id)] = item.count;
  }

  return map;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function findResponsesByForm({
  formId,
  ownerId,
  page = 1,
  limit = 20,
  search = "",
}) {
  const skip = (page - 1) * limit;
  const query = {
    formId,
    ownerId,
  };

  if (search) {
    const safePattern = escapeRegExp(search.trim());
    query.$or = [
      { "submittedBy.email": { $regex: safePattern, $options: "i" } },
      { "submittedBy.name": { $regex: safePattern, $options: "i" } },
    ];
  }

  const [items, total] = await Promise.all([
    Response.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("_id submittedBy createdAt answers")
      .lean(),
    Response.countDocuments(query),
  ]);

  return { items, total };
}

async function findResponseDetailById({ responseId, formId, ownerId }) {
  return Response.findOne({
    _id: responseId,
    formId,
    ownerId,
  }).lean();
}

module.exports = {
  createResponse,
  countResponsesByFormIds,
  findResponsesByForm,
  findResponseDetailById,
};

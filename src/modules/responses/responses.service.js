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

module.exports = {
  createResponse,
  countResponsesByFormIds,
};

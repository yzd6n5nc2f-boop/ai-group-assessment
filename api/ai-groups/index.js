const { listGroups } = require("../shared/airtable");

module.exports = async function (context) {
  try {
    context.res = {
      status: 200,
      body: await listGroups(),
    };
  } catch (error) {
    context.log.warn("Using fallback groups after Airtable error:", error);
    context.res = {
      status: 200,
      body: [
        { id: "g1", name: "Marketing Team" },
        { id: "g2", name: "Engineering Department" },
        { id: "g3", name: "Sales Division" },
      ],
    };
  }
};

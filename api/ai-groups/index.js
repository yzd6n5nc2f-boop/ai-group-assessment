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
        { id: "premier-sports-team", name: "Premier Sports Team" },
        { id: "may-sme-ai-masterclass", name: "May SME AI Masterclass" },
      ],
    };
  }
};

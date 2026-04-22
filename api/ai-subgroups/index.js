const { listSubgroups } = require("../shared/airtable");

module.exports = async function (context, req) {
  try {
    context.res = {
      status: 200,
      body: await listSubgroups(req.params.groupId),
    };
  } catch (error) {
    context.log.warn("Using fallback subgroups after Airtable error:", error);
    context.res = {
      status: 200,
      body: [],
    };
  }
};

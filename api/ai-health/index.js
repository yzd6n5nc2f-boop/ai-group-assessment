const { getAirtableConfig } = require("../shared/airtable");

module.exports = async function (context) {
  const config = getAirtableConfig();

  context.res = {
    status: 200,
    body: {
      ok: true,
      airtable: {
        hasToken: Boolean(config.token),
        hasBaseId: Boolean(config.baseId),
        hasResponsesTable: Boolean(config.responsesTable),
        hasGroupsTable: Boolean(config.groupsTable),
        hasSubgroupsTable: Boolean(config.subgroupsTable),
      },
    },
  };
};

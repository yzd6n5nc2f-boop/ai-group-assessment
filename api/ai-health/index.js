const { getAirtableConfig } = require("../shared/airtable");
const { getBrevoConfig } = require("../shared/brevo");

module.exports = async function (context) {
  const config = getAirtableConfig();
  const brevo = getBrevoConfig();

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
      brevo: {
        hasApiKey: Boolean(brevo.apiKey),
        hasSenderEmail: Boolean(brevo.senderEmail),
        hasNotificationToEmail: Boolean(brevo.notificationToEmail),
      },
    },
  };
};

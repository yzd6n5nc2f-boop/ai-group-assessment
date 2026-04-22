const { getBrevoConfig } = require("../shared/brevo");

module.exports = async function (context) {
  const brevo = getBrevoConfig();

  context.res = {
    status: 200,
    body: {
      ok: true,
      brevo: {
        hasApiKey: Boolean(brevo.apiKey),
        hasSenderEmail: Boolean(brevo.senderEmail),
        hasNotificationToEmail: Boolean(brevo.notificationToEmail),
      },
    },
  };
};

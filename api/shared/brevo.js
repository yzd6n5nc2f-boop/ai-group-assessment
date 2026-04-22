const BREVO_API_BASE = "https://api.brevo.com/v3";

function getBrevoConfig() {
  return {
    apiKey: process.env.BREVO_API_KEY,
    senderEmail: process.env.BREVO_SENDER_EMAIL,
    senderName: process.env.BREVO_SENDER_NAME || "AI Group Assessment",
    notificationToEmail: process.env.BREVO_NOTIFICATION_TO_EMAIL,
    notificationToName: process.env.BREVO_NOTIFICATION_TO_NAME || "Assessment Admin",
  };
}

function isBrevoConfigured() {
  const config = getBrevoConfig();
  return Boolean(config.apiKey && config.senderEmail && config.notificationToEmail);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatName(data) {
  return [data.firstName, data.lastName].filter(Boolean).join(" ").trim() || "Anonymous respondent";
}

function buildNotificationHtml(data, airtableRecordId) {
  const answerRows = Array.from({ length: 25 }, (_, index) => {
    const key = `q${index + 1}`;
    const value = Array.isArray(data[key]) ? data[key].join(", ") : data[key];
    return `<tr><td style="padding:4px 10px;border-bottom:1px solid #eee;">${key}</td><td style="padding:4px 10px;border-bottom:1px solid #eee;">${escapeHtml(value)}</td></tr>`;
  }).join("");

  return `
    <h2>New AI assessment submission</h2>
    <p>A new response has been submitted.</p>
    <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
      <tr><td style="padding:4px 10px;font-weight:bold;">Name</td><td style="padding:4px 10px;">${escapeHtml(formatName(data))}</td></tr>
      <tr><td style="padding:4px 10px;font-weight:bold;">Email</td><td style="padding:4px 10px;">${escapeHtml(data.email || "Not provided")}</td></tr>
      <tr><td style="padding:4px 10px;font-weight:bold;">Group</td><td style="padding:4px 10px;">${escapeHtml(data.groupName || data.groupId || "Not provided")}</td></tr>
      <tr><td style="padding:4px 10px;font-weight:bold;">Subgroup</td><td style="padding:4px 10px;">${escapeHtml(data.subgroupName || data.subgroupId || "Not provided")}</td></tr>
      <tr><td style="padding:4px 10px;font-weight:bold;">Identity mode</td><td style="padding:4px 10px;">${escapeHtml(data.identityMode || "Not provided")}</td></tr>
      <tr><td style="padding:4px 10px;font-weight:bold;">Airtable record</td><td style="padding:4px 10px;">${escapeHtml(airtableRecordId || "Not recorded")}</td></tr>
    </table>

    <h3>Final questions</h3>
    <p><strong>Training help:</strong><br>${escapeHtml(data.txtTrainingHelp || "")}</p>
    <p><strong>Specific training questions:</strong><br>${escapeHtml(data.txtSpecificTrainingQuestions || "")}</p>
    <p><strong>Other comments:</strong><br>${escapeHtml(data.txtOtherComments || "")}</p>

    <h3>Question responses</h3>
    <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:13px;">
      ${answerRows}
    </table>
  `;
}

async function brevoRequest(path, apiKey, body) {
  const response = await fetch(`${BREVO_API_BASE}${path}`, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const message = data?.message || data?.error || response.statusText;
    const error = new Error(message);
    error.status = response.status;
    error.details = data;
    throw error;
  }
  return data;
}

async function sendAssessmentNotification(data, airtableRecordId) {
  if (!isBrevoConfigured()) {
    return { skipped: true, reason: "Brevo is not configured" };
  }

  const config = getBrevoConfig();
  const respondent = formatName(data);

  const result = await brevoRequest("/smtp/email", config.apiKey, {
    sender: {
      email: config.senderEmail,
      name: config.senderName,
    },
    to: [
      {
        email: config.notificationToEmail,
        name: config.notificationToName,
      },
    ],
    replyTo: data.email
      ? {
          email: data.email,
          name: respondent,
        }
      : undefined,
    subject: `New AI assessment submission - ${respondent}`,
    htmlContent: buildNotificationHtml(data, airtableRecordId),
  });

  return { skipped: false, messageId: result?.messageId };
}

module.exports = {
  getBrevoConfig,
  isBrevoConfigured,
  sendAssessmentNotification,
};

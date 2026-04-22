const { createResponseRecord } = require("../shared/airtable");
const { sendAssessmentNotification } = require("../shared/brevo");

module.exports = async function (context, req) {
  try {
    const submission = req.body || {};
    const record = await createResponseRecord(submission);
    let brevo = null;

    try {
      brevo = await sendAssessmentNotification(submission, record?.id);
    } catch (emailError) {
      context.log.error("Error sending Brevo notification:", emailError);
      brevo = {
        skipped: false,
        error: emailError.message || "Failed to send Brevo notification",
      };
    }

    context.res = {
      status: 200,
      body: {
        success: true,
        recordId: record?.id,
        brevo,
        message: "Response recorded successfully",
      },
    };
  } catch (error) {
    context.log.error("Error saving Airtable response:", error);
    context.res = {
      status: error.status || 500,
      body: {
        success: false,
        error: error.message || "Failed to save response",
      },
    };
  }
};

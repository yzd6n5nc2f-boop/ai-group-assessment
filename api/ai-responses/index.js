const { sendAssessmentNotification } = require("../shared/brevo");

module.exports = async function (context, req) {
  try {
    const submission = req.body || {};
    const brevo = await sendAssessmentNotification(submission);

    context.res = {
      status: 200,
      body: {
        success: true,
        brevo,
        message: "Response emailed successfully",
      },
    };
  } catch (error) {
    context.log.error("Error sending assessment response:", error);
    context.res = {
      status: error.status || 500,
      body: {
        success: false,
        error: error.message || "Failed to send response email",
      },
    };
  }
};

const { createResponseRecord } = require("../shared/airtable");

module.exports = async function (context, req) {
  try {
    const record = await createResponseRecord(req.body || {});
    context.res = {
      status: 200,
      body: {
        success: true,
        recordId: record?.id,
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

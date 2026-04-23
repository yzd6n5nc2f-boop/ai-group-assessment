const AIRTABLE_API_BASE = "https://api.airtable.com/v0";

const fallbackGroups = [
  { id: "premier-sports-team", name: "Premier Sports Team" },
  { id: "may-sme-ai-masterclass", name: "May SME AI Masterclass" },
];

const fallbackSubgroups = {};

function getAirtableConfig() {
  return {
    token: process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_TOKEN,
    baseId: process.env.AIRTABLE_BASE_ID,
    responsesTable:
      process.env.AIRTABLE_RESPONSES_TABLE_ID ||
      process.env.AIRTABLE_RESPONSES_TABLE ||
      process.env.AIRTABLE_TABLE_ID ||
      process.env.AIRTABLE_TABLE_NAME,
    groupsTable: process.env.AIRTABLE_GROUPS_TABLE_ID || process.env.AIRTABLE_GROUPS_TABLE,
    subgroupsTable: process.env.AIRTABLE_SUBGROUPS_TABLE_ID || process.env.AIRTABLE_SUBGROUPS_TABLE,
  };
}

function requireResponsesConfig() {
  const config = getAirtableConfig();
  const missing = [];
  if (!config.token) missing.push("AIRTABLE_API_KEY");
  if (!config.baseId) missing.push("AIRTABLE_BASE_ID");
  if (!config.responsesTable) missing.push("AIRTABLE_RESPONSES_TABLE_ID");
  if (missing.length > 0) {
    const error = new Error(`Missing Airtable configuration: ${missing.join(", ")}`);
    error.status = 500;
    throw error;
  }
  return config;
}

function airtableUrl(baseId, table) {
  return `${AIRTABLE_API_BASE}/${encodeURIComponent(baseId)}/${encodeURIComponent(table)}`;
}

async function airtableRequest(url, token, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const body = await response.text();
  const data = body ? JSON.parse(body) : null;
  if (!response.ok) {
    const message = data?.error?.message || data?.error?.type || response.statusText;
    const error = new Error(message);
    error.status = response.status;
    error.details = data;
    throw error;
  }
  return data;
}

function valueOrNull(value) {
  if (value === undefined || value === "") return null;
  if (Array.isArray(value)) return value.length > 0 ? JSON.stringify(value) : null;
  return value;
}

function mapResponseToAirtableFields(data) {
  const responseId = `resp_${Date.now()}`;
  const submittedAt = new Date().toISOString();
  const fieldPairs = [
    ["response_id", responseId],
    ["group_id", data.groupId],
    ["group_name", data.groupName],
    ["subgroup_id", data.subgroupId],
    ["subgroup_name", data.subgroupName],
    ["identity_mode", data.identityMode],
    ["trainer_can_identify", data.identityMode === "named"],
    ["visible_to_group_lead_as_individual", data.identityMode === "named"],
    ["include_in_team_aggregate", true],
    ["first_name", data.firstName],
    ["last_name", data.lastName],
    ["email", data.email],
    ["email_provided", Boolean(data.email)],
    ["submission_datetime", submittedAt],
    ["assessment_version", "1.0"],
    ["consent_text_shown", "AI Fluency Assessment Consent Text"],
    ["q1", data.q1],
    ["q2", data.q2],
    ["q3", data.q3],
    ["q4", data.q4],
    ["q5", data.q5],
    ["q6", data.q6],
    ["q7", data.q7],
    ["q8", data.q8],
    ["q9", data.q9],
    ["q10", data.q10],
    ["q11", data.q11],
    ["q12", data.q12],
    ["q13", data.q13],
    ["q14", data.q14],
    ["q15", data.q15],
    ["q16", data.q16],
    ["q17", data.q17],
    ["q18", data.q18],
    ["q19", data.q19],
    ["q20", data.q20],
    ["q21", data.q21],
    ["q22", data.q22],
    ["q23", data.q23],
    ["q24", data.q24],
    ["q25", data.q25],
    ["txt_reason_for_avoidance", data.txtReasonForAvoidance],
    ["txt_other_tools", data.txtOtherTools],
    ["txt_current_use", data.txtCurrentUse],
    ["txt_training_help", data.txtTrainingHelp],
    ["txt_specific_training_questions", data.txtSpecificTrainingQuestions],
    ["txt_other_comments", data.txtOtherComments],
  ];

  return Object.fromEntries(
    fieldPairs
      .map(([field, value]) => [field, valueOrNull(value)])
      .filter(([, value]) => value !== null)
  );
}

function mapMinimalResponseToAirtableFields(data) {
  return {
    response_id: `resp_${Date.now()}`,
    group_name: data.groupName || data.groupId || "Not provided",
    subgroup_name: data.subgroupName || data.subgroupId || "Not provided",
    identity_mode: data.identityMode || "Not provided",
    first_name: data.firstName || "",
    last_name: data.lastName || "",
    email: data.email || "",
    submission_datetime: new Date().toISOString(),
  };
}

function mapDisplayNameResponseToAirtableFields(data) {
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");
  return {
    "Response ID": `resp_${Date.now()}`,
    "Group Name": data.groupName || data.groupId || "Not provided",
    "Subgroup Name": data.subgroupName || data.subgroupId || "Not provided",
    "Identity Mode": data.identityMode || "Not provided",
    "First Name": data.firstName || "",
    "Last Name": data.lastName || "",
    Email: data.email || "",
    "Submitted At": new Date().toISOString(),
    "Submission Summary": JSON.stringify({
      name: fullName || "Anonymous respondent",
      group: data.groupName || data.groupId,
      subgroup: data.subgroupName || data.subgroupId,
      identityMode: data.identityMode,
      answers: Object.fromEntries(Array.from({ length: 25 }, (_, index) => {
        const key = `q${index + 1}`;
        return [key, data[key]];
      })),
      finalQuestions: {
        trainingHelp: data.txtTrainingHelp,
        specificTrainingQuestions: data.txtSpecificTrainingQuestions,
        otherComments: data.txtOtherComments,
      },
    }),
  };
}

function mapNameOnlyResponseToAirtableFields(data) {
  const name = [data.firstName, data.lastName].filter(Boolean).join(" ") || "Anonymous respondent";
  return {
    Name: `AI assessment - ${name} - ${new Date().toISOString()}`,
  };
}

async function createAirtableRecord(config, fields) {
  const result = await airtableRequest(airtableUrl(config.baseId, config.responsesTable), config.token, {
    method: "POST",
    body: JSON.stringify({
      records: [{ fields }],
      typecast: true,
    }),
  });

  return result.records?.[0];
}

async function createResponseRecord(data) {
  const config = requireResponsesConfig();
  const attempts = [
    mapResponseToAirtableFields(data),
    mapDisplayNameResponseToAirtableFields(data),
    mapMinimalResponseToAirtableFields(data),
    mapNameOnlyResponseToAirtableFields(data),
    {},
  ];
  const errors = [];

  for (const fields of attempts) {
    try {
      return await createAirtableRecord(config, fields);
    } catch (error) {
      errors.push(error.message);
      if (error.status !== 422) {
        throw error;
      }
    }
  }

  const error = new Error(
    `Airtable rejected all supported payloads. Check the Responses table field names. Last errors: ${errors.join(" | ")}`
  );
  error.status = 422;
  throw error;
}

async function listGroups() {
  return fallbackGroups;
}

async function listSubgroups(groupId) {
  return fallbackSubgroups[groupId] || [];
}

module.exports = {
  createResponseRecord,
  fallbackGroups,
  fallbackSubgroups,
  getAirtableConfig,
  listGroups,
  listSubgroups,
};

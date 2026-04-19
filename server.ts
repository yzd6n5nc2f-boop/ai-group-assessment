import express from "express";
import { createServer as createViteServer } from "vite";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT || 3000);
  const host = process.env.HOST || "0.0.0.0";
  const hmrPort = Number(process.env.HMR_PORT || port + 1);
  app.use(express.json());

  const db = await open({
    filename: path.join(process.cwd(), "database.sqlite"),
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      client TEXT NOT NULL,
      contract TEXT NOT NULL,
      stage TEXT NOT NULL,
      manager TEXT NOT NULL,
      completion_date TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS early_warnings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      owner TEXT NOT NULL,
      status TEXT NOT NULL,
      due_date TEXT NOT NULL,
      FOREIGN KEY(project_id) REFERENCES projects(id)
    );

    CREATE TABLE IF NOT EXISTS compensation_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      reference TEXT NOT NULL,
      title TEXT NOT NULL,
      status TEXT NOT NULL,
      value TEXT NOT NULL,
      FOREIGN KEY(project_id) REFERENCES projects(id)
    );

    CREATE TABLE IF NOT EXISTS meetings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      starts_at TEXT NOT NULL,
      chair TEXT NOT NULL,
      FOREIGN KEY(project_id) REFERENCES projects(id)
    );

    -- Airtable simulation tables for AI Assessment
    CREATE TABLE IF NOT EXISTS groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id TEXT UNIQUE NOT NULL,
      group_name TEXT NOT NULL,
      group_code TEXT,
      active BOOLEAN DEFAULT TRUE,
      has_subgroups BOOLEAN DEFAULT FALSE,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS subgroups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subgroup_id TEXT UNIQUE NOT NULL,
      group_id TEXT NOT NULL,
      subgroup_name TEXT NOT NULL,
      active BOOLEAN DEFAULT TRUE,
      notes TEXT,
      FOREIGN KEY(group_id) REFERENCES groups(group_id)
    );

    CREATE TABLE IF NOT EXISTS responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      response_id TEXT UNIQUE NOT NULL,
      group_id TEXT,
      group_name TEXT,
      subgroup_id TEXT,
      subgroup_name TEXT,
      identity_mode TEXT,
      trainer_can_identify BOOLEAN,
      visible_to_group_lead_as_individual BOOLEAN,
      include_in_team_aggregate BOOLEAN,
      first_name TEXT,
      last_name TEXT,
      email TEXT,
      email_provided BOOLEAN,
      submission_datetime DATETIME DEFAULT CURRENT_TIMESTAMP,
      assessment_version TEXT,
      consent_text_shown TEXT,
      mindset_profile_value REAL,
      usage_profile_value REAL,
      prompting_profile_value REAL,
      research_profile_value REAL,
      workflow_profile_value REAL,
      overall_profile_value REAL,
      mindset_band TEXT,
      usage_band TEXT,
      prompting_band TEXT,
      research_band TEXT,
      workflow_band TEXT,
      overall_fluency_band TEXT,
      primary_gap TEXT,
      primary_strength TEXT,
      q1 TEXT, q2 TEXT, q3 TEXT, q4 TEXT, q5 TEXT, q6 TEXT,
      q7 TEXT, q8 TEXT, q9 TEXT, q10 TEXT, q11 TEXT, q12 TEXT, q13 TEXT,
      q14 TEXT, q15 TEXT, q16 TEXT, q17 TEXT, q18 TEXT, q19 TEXT,
      q20 TEXT, q21 TEXT, q22 TEXT, q23 TEXT, q24 TEXT, q25 TEXT,
      txt_reason_for_avoidance TEXT,
      txt_other_tools TEXT,
      txt_current_use TEXT,
      txt_training_help TEXT,
      txt_specific_training_questions TEXT,
      txt_other_comments TEXT,
      pdf_generated BOOLEAN DEFAULT FALSE,
      pdf_sent BOOLEAN DEFAULT FALSE,
      pdf_file_link TEXT,
      notes TEXT
    );
  `);

  // Seed groups and subgroups data
  const groupsSeed = await db.get<{ count: number }>("SELECT COUNT(*) as count FROM groups");
  if (!groupsSeed || groupsSeed.count === 0) {
    await db.run(
      "INSERT INTO groups (group_id, group_name, group_code, active, has_subgroups) VALUES (?, ?, ?, ?, ?)",
      ["g1", "Marketing Team", "MKT", true, true]
    );
    await db.run(
      "INSERT INTO groups (group_id, group_name, group_code, active, has_subgroups) VALUES (?, ?, ?, ?, ?)",
      ["g2", "Engineering Department", "ENG", true, true]
    );
    await db.run(
      "INSERT INTO groups (group_id, group_name, group_code, active, has_subgroups) VALUES (?, ?, ?, ?, ?)",
      ["g3", "Sales Division", "SLS", true, false]
    );
    
    // Seed subgroups
    await db.run(
      "INSERT INTO subgroups (subgroup_id, group_id, subgroup_name, active) VALUES (?, ?, ?, ?)",
      ["sg101", "g1", "Digital Marketing", true]
    );
    await db.run(
      "INSERT INTO subgroups (subgroup_id, group_id, subgroup_name, active) VALUES (?, ?, ?, ?)",
      ["sg102", "g1", "Content Creation", true]
    );
    await db.run(
      "INSERT INTO subgroups (subgroup_id, group_id, subgroup_name, active) VALUES (?, ?, ?, ?)",
      ["sg201", "g2", "Frontend Team", true]
    );
    await db.run(
      "INSERT INTO subgroups (subgroup_id, group_id, subgroup_name, active) VALUES (?, ?, ?, ?)",
      ["sg202", "g2", "Backend Team", true]
    );
    await db.run(
      "INSERT INTO subgroups (subgroup_id, group_id, subgroup_name, active) VALUES (?, ?, ?, ?)",
      ["sg203", "g2", "DevOps", true]
    );
  }

  const seed = await db.get<{ count: number }>("SELECT COUNT(*) as count FROM projects");
  if (!seed || seed.count === 0) {
    await db.run(
      "INSERT INTO projects (name, client, contract, stage, manager, completion_date) VALUES (?, ?, ?, ?, ?, ?)",
      ["Kingston Civic Hub", "West Borough Council", "NEC4 ECC Option C", "Construction", "A. Shah", "2027-03-18"]
    );
    await db.run(
      "INSERT INTO early_warnings (project_id, title, owner, status, due_date) VALUES (?, ?, ?, ?, ?)",
      [1, "Steelwork lead time may affect Programme 5", "Project Manager", "Open", "2026-04-18"]
    );
    await db.run(
      "INSERT INTO compensation_events (project_id, reference, title, status, value) VALUES (?, ?, ?, ?, ?)",
      [1, "CE-014", "Client information delay at zone C", "Quotation requested", "£48,000"]
    );
    await db.run(
      "INSERT INTO meetings (project_id, title, starts_at, chair) VALUES (?, ?, ?, ?)",
      [1, "Weekly NEC4 progress meeting", "2026-04-16 09:30", "Project Manager"]
    );
  }

  // API endpoints for the AI Assessment
  app.get("/api/ai/groups", async (_req, res) => {
    try {
      const groups = await db.all("SELECT group_id as id, group_name as name FROM groups WHERE active = 1");
      res.json(groups);
    } catch (error) {
      console.error("Error fetching groups:", error);
      res.status(500).json({ error: "Failed to fetch groups" });
    }
  });

  app.get("/api/ai/subgroups/:groupId", async (req, res) => {
    try {
      const { groupId } = req.params;
      const subgroups = await db.all(
        "SELECT subgroup_id as id, subgroup_name as name FROM subgroups WHERE group_id = ? AND active = 1",
        [groupId]
      );
      res.json(subgroups);
    } catch (error) {
      console.error("Error fetching subgroups:", error);
      res.status(500).json({ error: "Failed to fetch subgroups" });
    }
  });

  app.post("/api/ai/responses", async (req, res) => {
    try {
      const responseId = `resp_${Date.now()}`;
      const data = req.body;
      
      // Insert the response
      await db.run(`
        INSERT INTO responses (
          response_id, group_id, group_name, subgroup_id, subgroup_name, 
          identity_mode, trainer_can_identify, visible_to_group_lead_as_individual, include_in_team_aggregate,
          first_name, last_name, email, email_provided,
          assessment_version, consent_text_shown,
          q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, 
          q14, q15, q16, q17, q18, q19, q20, q21, q22, q23, q24, q25,
          txt_reason_for_avoidance, txt_other_tools, txt_current_use, 
          txt_training_help, txt_specific_training_questions, txt_other_comments
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        responseId, 
        data.groupId, 
        data.groupName, 
        data.subgroupId, 
        data.subgroupName,
        data.identityMode, 
        data.identityMode === 'named', 
        data.identityMode === 'named', 
        true,
        data.firstName, 
        data.lastName, 
        data.email, 
        !!data.email,
        '1.0', 
        'AI Fluency Assessment Consent Text',
        data.q1, data.q2, data.q3, data.q4, data.q5, data.q6,
        data.q7, data.q8, data.q9, data.q10, 
        JSON.stringify(data.q11 || []), 
        JSON.stringify(data.q12 || []), 
        JSON.stringify(data.q13 || []),
        data.q14, data.q15, data.q16, data.q17, data.q18, data.q19,
        data.q20, data.q21, data.q22, data.q23, data.q24, data.q25,
        data.txtReasonForAvoidance, data.txtOtherTools, data.txtCurrentUse,
        data.txtTrainingHelp, data.txtSpecificTrainingQuestions, data.txtOtherComments
      ]);

      // In a real implementation, we would:
      // 1. Calculate profile values
      // 2. Generate PDF if email provided
      // 3. Send email with PDF
      // 4. Update response record with PDF details

      res.json({ 
        success: true, 
        responseId,
        message: "Response recorded successfully" 
      });
    } catch (error) {
      console.error("Error saving response:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to save response" 
      });
    }
  });

  // Serve the AI assessment form
  app.get("/ai-assessment-form", (_req, res) => {
    res.sendFile(path.join(process.cwd(), "public", "ai-assessment-form.html"));

  });

  app.get("/api/projects", async (_req, res) => {
    res.json(await db.all("SELECT * FROM projects ORDER BY id DESC"));
  });

  app.get("/api/early-warnings", async (_req, res) => {
    res.json(await db.all("SELECT * FROM early_warnings ORDER BY id DESC"));
  });

  app.get("/api/compensation-events", async (_req, res) => {
    res.json(await db.all("SELECT * FROM compensation_events ORDER BY id DESC"));
  });

  app.get("/api/meetings", async (_req, res) => {
    res.json(await db.all("SELECT * FROM meetings ORDER BY id DESC"));
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host,
        hmr: {
          host,
          port: hmrPort,
        },
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(port, host, () => {
    console.log(`Group Ai Assessment running on http://${host === "0.0.0.0" ? "localhost" : host}:${port}`);
  });
}

startServer();

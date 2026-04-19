import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProjectProvider } from "@/context/ProjectContext";
import { Layout } from "@/components/Layout";
import { CompensationEvents } from "@/pages/CompensationEvents";
import { Dashboard } from "@/pages/Dashboard";
import { Documents } from "@/pages/Documents";
import { EarlyWarnings } from "@/pages/EarlyWarnings";
import { LandingPage } from "@/pages/LandingPage";
import { Meetings } from "@/pages/Meetings";
import { Programme } from "@/pages/Programme";
import { Projects } from "@/pages/Projects";
import { Settings } from "@/pages/Settings";
import { Team } from "@/pages/Team";
import { AiAssessment } from "@/pages/AiAssessment";

export default function App() {
  return (
    <ProjectProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<Layout />}> 
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="early-warnings" element={<EarlyWarnings />} />
            <Route path="compensation-events" element={<CompensationEvents />} />
            <Route path="programme" element={<Programme />} />
            <Route path="documents" element={<Documents />} />
            <Route path="meetings" element={<Meetings />} />
            <Route path="team" element={<Team />} />
            <Route path="settings" element={<Settings />} />
            <Route path="ai-assessment" element={<AiAssessment />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ProjectProvider>
  );
}

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface Project {
  id: number;
  name: string;
  client: string;
  contract: string;
  stage: string;
  manager: string;
  completion_date: string;
}

interface ProjectContextType {
  projects: Project[];
  activeProject: Project | null;
  setActiveProject: (project: Project | null) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        if (data.length > 0) setActiveProject(data[0]);
      })
      .catch(() => setProjects([]));
  }, []);

  const value = useMemo(() => ({ projects, activeProject, setActiveProject }), [projects, activeProject]);
  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) throw new Error("useProject must be used within ProjectProvider");
  return context;
}

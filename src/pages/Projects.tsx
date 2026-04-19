import { useProject } from "@/context/ProjectContext";
import { PageFrame } from "@/components/PageFrame";

export function Projects() {
  const { projects } = useProject();
  return (
    <PageFrame eyebrow="Projects" title="Active project register" description="Review contract type, stage, manager, and completion targets across the portfolio.">
      <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500"><tr><th className="px-5 py-4">Project</th><th className="px-5 py-4">Client</th><th className="px-5 py-4">Contract</th><th className="px-5 py-4">Stage</th></tr></thead>
          <tbody>{projects.map((project) => <tr key={project.id} className="border-t border-slate-100"><td className="px-5 py-4 text-slate-900">{project.name}</td><td className="px-5 py-4 text-slate-600">{project.client}</td><td className="px-5 py-4 text-slate-600">{project.contract}</td><td className="px-5 py-4 text-slate-600">{project.stage}</td></tr>)}</tbody>
        </table>
      </div>
    </PageFrame>
  );
}

import {
  AlertTriangle,
  CalendarDays,
  FileText,
  FolderKanban,
  Gauge,
  ReceiptText,
  Settings,
  ShieldCheck,
  Users,
  Zap
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useProject } from "@/context/ProjectContext";

const navItems = [
  { name: "Dashboard", path: "/app/dashboard", icon: Gauge },
  { name: "Projects", path: "/app/projects", icon: FolderKanban },
  { name: "Early Warnings", path: "/app/early-warnings", icon: AlertTriangle },
  { name: "Compensation Events", path: "/app/compensation-events", icon: ReceiptText },
  { name: "Programme", path: "/app/programme", icon: CalendarDays },
  { name: "Documents", path: "/app/documents", icon: FileText },
  { name: "Meetings", path: "/app/meetings", icon: ShieldCheck },
  { name: "Team", path: "/app/team", icon: Users },
  { name: "AI Assessment", path: "/app/ai-assessment", icon: Zap },
  { name: "Settings", path: "/app/settings", icon: Settings },
];

export function Layout() {
  const location = useLocation();
  const { activeProject } = useProject();

  return (
    <div className="flex min-h-screen bg-[var(--app-bg)] text-[var(--app-text)]">
      <aside className="hidden w-80 flex-col border-r border-white/10 bg-[var(--panel-strong)] lg:flex">
        <div className="border-b border-white/10 px-6 py-5">
          <p className="text-xs uppercase tracking-[0.24em] text-white/45">Contract Workspace</p>
          <h1 className="mt-2 text-xl font-semibold text-white">Group Ai Assessment</h1>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-5">
          {navItems.map((item) => {
            const active = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                  active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/6 hover:text-white"
                )}
              >
                <item.icon className={cn("h-4 w-4", active && "text-[var(--accent)]")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-black/5 bg-white/78 px-6 backdrop-blur">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Selected project</div>
            <div className="text-sm font-semibold text-slate-900">
              {activeProject ? `${activeProject.name} · ${activeProject.contract}` : "No project selected"}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

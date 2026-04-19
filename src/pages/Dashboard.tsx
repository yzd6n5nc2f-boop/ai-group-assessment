import { useEffect, useState } from "react";
import { PageFrame } from "@/components/PageFrame";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
  const [warnings, setWarnings] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/early-warnings").then((r) => r.json()).then(setWarnings).catch(() => setWarnings([]));
    fetch("/api/compensation-events").then((r) => r.json()).then(setEvents).catch(() => setEvents([]));
  }, []);

  return (
    <PageFrame
      eyebrow="Overview"
      title="Contract health dashboard"
      description="Monitor live NEC4-style notices, compensation events, programme issues, and governance actions from one shared control room."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.75rem] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"><div className="text-sm text-slate-500">Open early warnings</div><div className="mt-3 text-4xl font-semibold text-slate-900">{warnings.length}</div></div>
        <div className="rounded-[1.75rem] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"><div className="text-sm text-slate-500">Compensation events</div><div className="mt-3 text-4xl font-semibold text-slate-900">{events.length}</div></div>
        <div className="rounded-[1.75rem] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"><div className="text-sm text-slate-500">Next governance review</div><div className="mt-3 text-2xl font-semibold text-slate-900">16 Apr 2026</div></div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">AI Fluency Assessment</h2>
        <div className="bg-white rounded-[1.75rem] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <p className="text-slate-700 mb-4">Complete the AI Fluency Assessment to help us understand your team's AI capabilities and tailor training accordingly.</p>
          <button 
            onClick={() => navigate('/app/ai-assessment')} 
            className="inline-block bg-[var(--accent)] text-[var(--panel-strong)] px-4 py-2 rounded-full font-medium hover:bg-[#8db07a] transition-colors"
          >
            Start Assessment
          </button>
        </div>
      </div>
    </PageFrame>
  );
}

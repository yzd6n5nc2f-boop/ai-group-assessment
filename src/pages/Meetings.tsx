import { useEffect, useState } from "react";
import { PageFrame } from "@/components/PageFrame";

export function Meetings() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { fetch("/api/meetings").then((r) => r.json()).then(setItems).catch(() => setItems([])); }, []);
  return (
    <PageFrame eyebrow="Meetings" title="Meeting cadence and actions" description="Capture standing NEC4 meetings, attendees, and follow-up decisions.">
      <div className="space-y-3">{items.map((item) => <div key={item.id} className="rounded-[1.5rem] bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"><h2 className="font-semibold text-slate-900">{item.title}</h2><p className="mt-2 text-sm text-slate-600">{item.starts_at} · Chair: {item.chair}</p></div>)}</div>
    </PageFrame>
  );
}

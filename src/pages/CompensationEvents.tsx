import { useEffect, useState } from "react";
import { PageFrame } from "@/components/PageFrame";

export function CompensationEvents() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { fetch("/api/compensation-events").then((r) => r.json()).then(setItems).catch(() => setItems([])); }, []);
  return (
    <PageFrame eyebrow="Compensation Events" title="Event register and quotations" description="Track event references, current status, and working assumptions in one register.">
      <div className="space-y-3">{items.map((item) => <div key={item.id} className="rounded-[1.5rem] bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"><div className="flex items-center justify-between"><h2 className="font-semibold text-slate-900">{item.reference} · {item.title}</h2><span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">{item.status}</span></div><p className="mt-2 text-sm text-slate-600">Estimated value: {item.value}</p></div>)}</div>
    </PageFrame>
  );
}

import { ArrowRight, Building2, ClipboardCheck, TriangleAlert } from "lucide-react";
import { Link } from "react-router-dom";

export function LandingPage() {
  const features = [
    { title: "Registers and notices", text: "Track early warnings, compensation events, and notices with clear contract ownership.", icon: TriangleAlert },
    { title: "Project controls", text: "See programme health, documents, meetings, and action progress in one place.", icon: ClipboardCheck },
    { title: "Employer-ready reporting", text: "Keep a calmer, more formal operations layer for NEC4-style project governance.", icon: Building2 },
  ];

  return (
    <main className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)]">
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-4xl space-y-8">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/70">
            NEC4 Project Operations
          </div>
          <h1 className="text-5xl font-semibold leading-tight text-white md:text-7xl">
            A layered project management starter for NEC4-style delivery workflows.
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-white/72">
            Use this template when you need more than a landing page: routed workspaces, registers, backend APIs, and a serious operational UI.
          </p>
          <Link
            to="/app/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 font-medium text-[var(--panel-strong)]"
          >
            Open workspace
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
              <feature.icon className="h-5 w-5 text-[var(--accent)]" />
              <h2 className="mt-4 text-lg font-semibold text-white">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/65">{feature.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

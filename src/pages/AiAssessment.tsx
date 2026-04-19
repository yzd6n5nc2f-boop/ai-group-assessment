import { useEffect, useState } from "react";

export function AiAssessment() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="p-6">
        <div className="flex h-64 items-center justify-center rounded-[1.75rem] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-[var(--accent)]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="rounded-[1.75rem] bg-white p-1 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <iframe 
          src="/ai-assessment-form" 
          className="w-full h-[calc(100vh-200px)] rounded-[1.75rem] border-0"
          title="AI Fluency Assessment"
        />
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Sparkles, Loader2, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";

export const Route = createFileRoute("/validate")({
  head: () => ({
    meta: [
      { title: "Validate Your Idea — STARTIFY" },
      { name: "description", content: "Get instant structured analysis of your startup idea's market potential, competition, and actionable improvements." },
      { property: "og:title", content: "Validate Your Idea — STARTIFY" },
      { property: "og:description", content: "Instant AI analysis of market potential, competition, and next steps for your startup idea." },
    ],
  }),
  component: ValidatePage,
});

const CATEGORIES = ["EdTech", "Sustainability", "FinTech", "Health & Fitness", "Food & Dining", "Social", "AI / ML", "Other"];

type Analysis = {
  score: number;
  market: string;
  competition: string;
  strengths: string[];
  risks: string[];
  next: string[];
};

function buildAnalysis(title: string, desc: string, category: string): Analysis {
  const seed = (title + desc).length;
  const score = 62 + (seed % 33);
  return {
    score,
    market: `${category || "This space"} is growing fast among early adopters. "${title}" targets a clear, reachable audience in one focused community — start with one university and expand outward.`,
    competition: `Expect 3–5 established players plus several early-stage projects. Your wedge is a narrower niche and tighter community feedback loops than incumbents can offer.`,
    strengths: [
      "Clear problem statement with a specific user group",
      "Low cost to build a first testable version",
      "Distribution through local communities is cheap and fast",
    ],
    risks: [
      "Retention after the first week of novelty usage",
      "Monetisation is unclear while the audience is price-sensitive",
      "Seasonality — usage dips during breaks and exams",
    ],
    next: [
      "Interview 10 potential users who have this problem this week",
      "Ship a one-screen prototype and put it in 3 group chats",
      "Define one success metric before you build anything else",
    ],
  };
}

function ValidatePage() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const run = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim()) {
      toast.error("Add an idea title and description first");
      return;
    }
    setLoading(true);
    setAnalysis(null);
    setTimeout(() => {
      setAnalysis(buildAnalysis(title.trim(), desc.trim(), category));
      setLoading(false);
      toast.success("Analysis ready");
    }, 1200);
  };

  return (
    <div className="bg-mesh min-h-screen font-sans text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div className="mt-6 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Idea Validation
          </span>
          <h1 className="font-display mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Validate Your <span className="text-gradient">Startup Idea</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Get instant structured analysis of your idea's market potential, competition, and actionable improvements
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <form onSubmit={run} className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold">Your Idea</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="idea-title" className="mb-1.5 block text-sm font-medium">Idea Title *</label>
                <input
                  id="idea-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. EcoTrack — campus carbon tracker"
                  className="h-11 w-full rounded-lg border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label htmlFor="idea-desc" className="mb-1.5 block text-sm font-medium">Description *</label>
                <textarea
                  id="idea-desc"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={6}
                  placeholder="What problem does it solve, and for whom?"
                  className="w-full rounded-lg border bg-background p-4 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label htmlFor="idea-cat" className="mb-1.5 block text-sm font-medium">Category</label>
                <select
                  id="idea-cat"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 disabled:opacity-70"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {loading ? "Analyzing…" : "Validate My Idea"}
              </button>
            </div>
          </form>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold">AI Analysis</h2>
            {!analysis && !loading && (
              <p className="mt-10 text-center text-sm text-muted-foreground">
                Enter your startup idea and click "Validate" to get structured analysis
              </p>
            )}
            {loading && (
              <div className="mt-10 flex flex-col items-center gap-3 text-sm text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                Analyzing market, competition and risks…
              </div>
            )}
            {analysis && (
              <div className="mt-4 space-y-5 text-sm">
                <div className="rounded-xl border bg-background p-4">
                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold">Idea Score</span>
                    <span className="font-display text-2xl font-bold text-primary">{analysis.score}/100</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${analysis.score}%` }} />
                  </div>
                </div>
                <Section icon={TrendingUp} title="Market Potential">{analysis.market}</Section>
                <Section icon={Lightbulb} title="Competition">{analysis.competition}</Section>
                <List title="Strengths" items={analysis.strengths} />
                <List title="Risks" items={analysis.risks} icon={AlertTriangle} />
                <List title="Recommended Next Steps" items={analysis.next} />
              </div>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="flex items-center gap-2 font-semibold"><Icon className="h-4 w-4 text-primary" /> {title}</h3>
      <p className="mt-1 text-muted-foreground">{children}</p>
    </div>
  );
}

function List({ title, items, icon: Icon }: { title: string; items: string[]; icon?: React.ElementType }) {
  return (
    <div>
      <h3 className="flex items-center gap-2 font-semibold">{Icon ? <Icon className="h-4 w-4 text-primary" /> : null} {title}</h3>
      <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
        {items.map((i) => <li key={i}>{i}</li>)}
      </ul>
    </div>
  );
}

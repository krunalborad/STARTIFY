import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Lightbulb,
  FileText,
  Users,
  Loader2,
  Zap,
  Download,
  Bookmark,
  Target,
  TrendingUp,
  Heart,
  UserPlus,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "Founder Tools — Idea Generator, Pitch Builder & Matching" },
      {
        name: "description",
        content:
          "Generate startup ideas, build a 10-slide pitch deck, and find smart co-founder matches — all in one founder toolkit.",
      },
      { property: "og:title", content: "Founder Tools — STARTIFY" },
      {
        property: "og:description",
        content: "Idea generator, pitch deck builder and smart matching for young entrepreneurs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ToolsPage,
});

type Tab = "idea" | "pitch" | "match";

function ToolsPage() {
  const [tab, setTab] = useState<Tab>("idea");
  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "idea", label: "Idea Generator", icon: Lightbulb },
    { id: "pitch", label: "Pitch Builder", icon: FileText },
    { id: "match", label: "Smart Matching", icon: Users },
  ];

  return (
    <div className="bg-mesh min-h-screen font-sans text-foreground">
      <SiteHeader />
      <div className="border-b bg-card/50">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-3 sm:px-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 pr-3 text-sm font-medium text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                tab === t.id ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              }`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>
      </div>
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {tab === "idea" && <IdeaGenerator />}
        {tab === "pitch" && <PitchBuilder />}
        {tab === "match" && <SmartMatching />}
      </main>
      <SiteFooter />
    </div>
  );
}

/* ---------------- Idea Generator ---------------- */

const CATEGORIES = [
  "EdTech",
  "Sustainability",
  "FinTech",
  "HealthTech",
  "AI & Machine Learning",
  "Creator Economy",
  "Food Tech",
  "Social Impact",
];

type Idea = {
  name: string;
  pitch: string;
  category: string;
  marketSize: string;
  difficulty: string;
  timeToMarket: string;
  technologies: string[];
};

function IdeaGenerator() {
  const [category, setCategory] = useState(CATEGORIES[0]!);
  const [loading, setLoading] = useState(false);
  const [idea, setIdea] = useState<Idea | null>(null);

  const generate = async () => {
    setLoading(true);
    setIdea(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system:
            "You invent realistic startup ideas for young founders. Reply with ONLY a JSON object, no markdown fences, with keys: " +
            'name (string), pitch (2 sentences), category (string), marketSize (e.g. "$1.2B by 2028"), ' +
            'difficulty (Easy|Medium|Hard), timeToMarket (e.g. "4-6 months"), technologies (array of 3-4 short strings).',
          messages: [
            {
              role: "user",
              content: `Generate one fresh, buildable startup idea in the ${category} space. Make it specific, not generic.`,
            },
          ],
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const raw = await res.text();
      const json = raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
      setIdea(JSON.parse(json) as Idea);
    } catch (err) {
      toast.error(err instanceof Error ? err.message.slice(0, 120) : "Could not generate an idea");
    } finally {
      setLoading(false);
    }
  };

  const saveIdea = () => {
    if (!idea) return;
    try {
      const raw = localStorage.getItem("sl_saved_ideas");
      const list = raw ? (JSON.parse(raw) as Idea[]) : [];
      localStorage.setItem("sl_saved_ideas", JSON.stringify([idea, ...list].slice(0, 30)));
      toast.success("Idea saved");
    } catch {
      toast.error("Could not save the idea");
    }
  };

  return (
    <section className="mx-auto max-w-3xl rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
      <div className="text-center">
        <h1 className="font-display flex items-center justify-center gap-2 text-2xl font-extrabold sm:text-3xl">
          <Lightbulb className="h-6 w-6 text-primary" /> Startup Idea Generator
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Generate fresh startup ideas tailored to trending markets and technologies
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <select
          aria-label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-11 flex-1 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          onClick={generate}
          disabled={loading}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 disabled:opacity-70"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
          {loading ? "Generating…" : "Generate Idea"}
        </button>
      </div>

      {idea && (
        <div className="mt-8 border-l-4 border-primary pl-4">
          <h2 className="font-display text-xl font-bold">{idea.name}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{idea.pitch}</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" /> Category:
                <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold">{idea.category}</span>
              </p>
              <p className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" /> Market size:
                <span className="font-semibold text-brand-green">{idea.marketSize}</span>
              </p>
              <p className="flex items-center gap-2">
                Difficulty:
                <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold">{idea.difficulty}</span>
              </p>
            </div>
            <div className="text-sm">
              <p className="font-semibold">Technologies</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(idea.technologies ?? []).map((t) => (
                  <span key={t} className="rounded-full border px-2 py-0.5 text-xs">
                    {t}
                  </span>
                ))}
              </div>
              <p className="mt-3">
                Time to market: <span className="font-semibold text-primary">{idea.timeToMarket}</span>
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={saveIdea}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border py-3 text-sm font-semibold hover:bg-accent"
            >
              <Bookmark className="h-4 w-4" /> Save Idea
            </button>
            <Link
              to="/create"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Start Building
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------------- Pitch Builder ---------------- */

type Slide = { id: string; title: string; prompt: string; required: boolean };

const SLIDES: Slide[] = [
  { id: "problem", title: "Problem Statement", prompt: "What key problem does your startup solve? Who has it, and how painful is it?", required: true },
  { id: "solution", title: "Solution", prompt: "How do you solve it, and why is your way better?", required: true },
  { id: "market", title: "Market Opportunity", prompt: "How big is the market and who exactly is your first customer?", required: true },
  { id: "demo", title: "Product Demo", prompt: "Walk through the core user flow in a few sentences.", required: true },
  { id: "model", title: "Business Model", prompt: "How do you make money? Pricing, margins, unit economics.", required: true },
  { id: "competition", title: "Competition", prompt: "Who else solves this and what is your unfair advantage?", required: false },
  { id: "traction", title: "Traction", prompt: "Users, revenue, waitlist, pilots — any proof it works.", required: false },
  { id: "team", title: "Team", prompt: "Who is building this and why are you the right people?", required: true },
  { id: "financials", title: "Financial Projections", prompt: "Where do you expect to be in 12-24 months?", required: true },
  { id: "ask", title: "Funding Ask", prompt: "How much do you need and what will it be spent on?", required: true },
];

function PitchBuilder() {
  const [active, setActive] = useState(0);
  const [content, setContent] = useState<Record<string, string>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = localStorage.getItem("sl_pitch_deck");
      return raw ? (JSON.parse(raw) as Record<string, string>) : {};
    } catch {
      return {};
    }
  });

  const slide = SLIDES[active]!;
  const done = SLIDES.filter((s) => (content[s.id] ?? "").trim().length >= 50).length;
  const pct = Math.round((done / SLIDES.length) * 100);

  const update = (value: string) => {
    const next = { ...content, [slide.id]: value };
    setContent(next);
    try {
      localStorage.setItem("sl_pitch_deck", JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const exportDeck = () => {
    const text = SLIDES.map((s, i) => `${i + 1}. ${s.title}\n\n${content[s.id] ?? "(empty)"}\n`).join("\n---\n\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "pitch-deck.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Pitch deck exported");
  };

  return (
    <section>
      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display flex items-center gap-2 text-xl font-bold">
              <FileText className="h-5 w-5 text-primary" /> Pitch Deck Builder
            </h1>
            <p className="text-xs text-muted-foreground">
              Progress: {done}/{SLIDES.length} slides completed
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(window.location.href);
                  toast.success("Deck link copied");
                } catch {
                  toast("Share this page", { description: window.location.href });
                }
              }}
              className="rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-accent"
            >
              Share
            </button>
            <button
              onClick={exportDeck}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Download className="h-4 w-4" /> Export
            </button>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-xs font-semibold text-muted-foreground">{pct}%</span>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[16rem_1fr]">
        <aside className="rounded-2xl border bg-card p-3 shadow-sm">
          <p className="px-2 py-1 text-sm font-semibold">Slides</p>
          <ul className="mt-1 space-y-1">
            {SLIDES.map((s, i) => {
              const complete = (content[s.id] ?? "").trim().length >= 50;
              return (
                <li key={s.id}>
                  <button
                    onClick={() => setActive(i)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      i === active ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                    }`}
                  >
                    <span
                      className={`h-2.5 w-2.5 shrink-0 rounded-full border ${complete ? "bg-brand-green" : "bg-transparent"}`}
                    />
                    <span className="flex-1">
                      {s.title}
                      {s.required && (
                        <span className="ml-1.5 rounded bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-accent-foreground">
                          Required
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="font-display text-lg font-bold">{slide.title}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{slide.prompt}</p>
          <label htmlFor="slide-content" className="mt-4 block text-sm font-medium">
            Content
          </label>
          <textarea
            id="slide-content"
            rows={10}
            value={content[slide.id] ?? ""}
            onChange={(e) => update(e.target.value)}
            placeholder="Write your slide content here…"
            className="mt-1.5 w-full rounded-lg border bg-background p-4 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {(content[slide.id] ?? "").length} characters (add at least 50 characters to mark as complete)
          </p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setActive((i) => Math.max(0, i - 1))}
              disabled={active === 0}
              className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-accent disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setActive((i) => Math.min(SLIDES.length - 1, i + 1))}
              disabled={active === SLIDES.length - 1}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Smart Matching ---------------- */

const INTERESTS = [
  "AI & Machine Learning",
  "Sustainability",
  "FinTech",
  "HealthTech",
  "EdTech",
  "E-commerce",
  "Creator Economy",
  "Robotics",
  "Cybersecurity",
  "AR/VR",
  "Social Impact",
  "Food Tech",
  "Travel Tech",
  "Gaming",
];

type Match = {
  name: string;
  role: string;
  location: string;
  tags: string[];
  reasons: string[];
  interests: string[];
};

const POOL: Match[] = [
  {
    name: "GreenTech Solutions",
    role: "Carbon tracking platform",
    location: "Austin, TX",
    tags: ["Environmental Science", "Data Analytics", "Mobile Development"],
    reasons: ["Similar problem space", "Complementary technology", "Same target market"],
    interests: ["Sustainability", "Social Impact"],
  },
  {
    name: "David Kim",
    role: "Marketing Director",
    location: "Los Angeles, CA",
    tags: ["Digital Marketing", "SEO", "Content Strategy"],
    reasons: ["Growth marketing expertise", "B2C experience", "Sustainability passion"],
    interests: ["Sustainability", "E-commerce", "Creator Economy"],
  },
  {
    name: "Ananya Rao",
    role: "ML Engineer",
    location: "Bengaluru, IN",
    tags: ["Python", "LLMs", "Recommendation Systems"],
    reasons: ["Ships models fast", "Loves 0-to-1 products", "Mentors junior founders"],
    interests: ["AI & Machine Learning", "EdTech", "HealthTech"],
  },
  {
    name: "Marco Silva",
    role: "Product Designer",
    location: "Lisbon, PT",
    tags: ["UX Research", "Design Systems", "Prototyping"],
    reasons: ["Consumer app portfolio", "Strong research habit", "Available part-time"],
    interests: ["Creator Economy", "Gaming", "AR/VR"],
  },
  {
    name: "Sara Haddad",
    role: "Fintech Operator",
    location: "Dubai, AE",
    tags: ["Payments", "Compliance", "Partnerships"],
    reasons: ["Scaled a payments startup", "Regulatory know-how", "Investor network"],
    interests: ["FinTech", "E-commerce"],
  },
  {
    name: "Nikhil Verma",
    role: "Full-stack Developer",
    location: "Pune, IN",
    tags: ["React", "Node.js", "Cloud"],
    reasons: ["Builds MVPs in weeks", "Startup experience", "Looking for a co-founder"],
    interests: ["EdTech", "AI & Machine Learning", "Cybersecurity"],
  },
];

function SmartMatching() {
  const [selected, setSelected] = useState<string[]>(["Sustainability"]);
  const [searched, setSearched] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);

  const matches = useMemo(() => {
    return POOL.map((m) => {
      const overlap = m.interests.filter((i) => selected.includes(i)).length;
      const score = Math.min(96, 55 + overlap * 18 + m.tags.length * 2);
      return { ...m, score, overlap };
    })
      .filter((m) => m.overlap > 0)
      .sort((a, b) => b.score - a.score);
  }, [selected]);

  const toggle = (i: string) =>
    setSelected((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));

  return (
    <section>
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <h1 className="font-display flex items-center gap-2 text-xl font-bold">
          <Users className="h-5 w-5 text-primary" /> Smart Matching
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Find co-founders, team members and collaboration opportunities that fit what you're building
        </p>
        <p className="mt-5 flex items-center gap-2 text-sm font-semibold">
          <Target className="h-4 w-4 text-primary" /> Select your interests
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {INTERESTS.map((i) => (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                selected.includes(i) ? "border-primary bg-primary text-primary-foreground" : "hover:bg-accent"
              }`}
            >
              {i}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            if (selected.length === 0) {
              toast.error("Pick at least one interest");
              return;
            }
            setSearched(true);
            toast.success(`Found ${matches.length} matches`);
          }}
          className="mt-5 w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
        >
          Find Smart Matches
        </button>
      </div>

      {searched && (
        <div className="mt-6">
          <h2 className="font-display flex items-center gap-2 text-lg font-bold">
            <Users className="h-4 w-4 text-primary" /> Your matches ({matches.length})
          </h2>
          {matches.length === 0 && (
            <p className="mt-4 rounded-xl border bg-card p-6 text-center text-sm text-muted-foreground">
              No matches for those interests yet — try adding one or two more.
            </p>
          )}
          <div className="mt-4 space-y-4">
            {matches.map((m) => (
              <article key={m.name} className="rounded-2xl border bg-card p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display font-bold text-primary">{m.name}</h3>
                    <p className="text-sm text-muted-foreground">{m.role}</p>
                    <p className="text-xs text-muted-foreground">{m.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-xl font-bold text-primary">{m.score}%</p>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Match score</p>
                  </div>
                </div>
                <p className="mt-3 text-sm font-semibold">Why this is a great match</p>
                <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-muted-foreground">
                  {m.reasons.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {m.tags.map((t) => (
                    <span key={t} className="rounded-full border px-2 py-0.5 text-xs">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    to="/co-founders"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    <MessageSquare className="h-4 w-4" /> Connect
                  </Link>
                  <button
                    onClick={() => toast.success(`${m.name} added to your network`)}
                    className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-accent"
                  >
                    <UserPlus className="h-4 w-4" /> Add to Network
                  </button>
                  <button
                    onClick={() =>
                      setSaved((s) => {
                        const next = s.includes(m.name) ? s.filter((x) => x !== m.name) : [...s, m.name];
                        toast.success(next.includes(m.name) ? "Saved" : "Removed from saved");
                        return next;
                      })
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-accent"
                  >
                    <Heart className={`h-4 w-4 ${saved.includes(m.name) ? "fill-primary text-primary" : ""}`} />
                    {saved.includes(m.name) ? "Saved" : "Save"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
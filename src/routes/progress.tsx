import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Trophy,
  Flame,
  Target,
  Award,
  CheckCircle2,
  Circle,
  Lightbulb,
  Search,
  Wrench,
  Users,
  Rocket,
  TrendingUp,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader, SiteFooter, useStoredUser } from "@/components/site-chrome";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Your Progress — STARTIFY" },
      { name: "description", content: "Track every stage of your startup from idea to scaling with detailed milestones, XP, streaks and achievements." },
      { property: "og:title", content: "Your Progress — STARTIFY" },
      { property: "og:description", content: "Stage-by-stage milestones, XP, levels and achievements for your founder journey." },
    ],
  }),
  component: ProgressPage,
});

type Milestone = { id: string; title: string; hint: string; xp: number };
type Stage = { key: string; label: string; icon: React.ElementType; blurb: string; milestones: Milestone[] };

const STAGES: Stage[] = [
  {
    key: "idea",
    label: "Idea",
    icon: Lightbulb,
    blurb: "Define your problem and solution",
    milestones: [
      { id: "idea-1", title: "Problem statement defined", hint: "One sentence: who hurts, and how badly.", xp: 40 },
      { id: "idea-2", title: "Solution hypothesis created", hint: "How you solve it, in plain language.", xp: 40 },
      { id: "idea-3", title: "Target audience identified", hint: "Name the first 100 people you'd serve.", xp: 50 },
      { id: "idea-4", title: "Competitor research done", hint: "List 5 alternatives and why you're different.", xp: 50 },
      { id: "idea-5", title: "Idea shared for feedback", hint: "Post it publicly and collect reactions.", xp: 30 },
    ],
  },
  {
    key: "validation",
    label: "Validation",
    icon: Search,
    blurb: "Prove people actually want this",
    milestones: [
      { id: "val-1", title: "10 customer interviews", hint: "Ask about their problem, never pitch.", xp: 90 },
      { id: "val-2", title: "Landing page live", hint: "Clear promise, one call to action.", xp: 60 },
      { id: "val-3", title: "50 waitlist signups", hint: "Real emails from real strangers.", xp: 100 },
      { id: "val-4", title: "Pricing hypothesis tested", hint: "Would they pay? How much?", xp: 70 },
      { id: "val-5", title: "Market size estimated", hint: "Bottom-up, not a big-number slide.", xp: 50 },
    ],
  },
  {
    key: "prototype",
    label: "Prototype",
    icon: Wrench,
    blurb: "Build the smallest thing that works",
    milestones: [
      { id: "pro-1", title: "Core user flow mapped", hint: "From landing to the aha moment.", xp: 50 },
      { id: "pro-2", title: "Wireframes complete", hint: "Every screen the flow needs.", xp: 60 },
      { id: "pro-3", title: "Clickable prototype", hint: "Testable without writing a backend.", xp: 90 },
      { id: "pro-4", title: "5 usability tests run", hint: "Watch people use it silently.", xp: 80 },
      { id: "pro-5", title: "MVP scope frozen", hint: "Cut everything that isn't the core.", xp: 60 },
    ],
  },
  {
    key: "beta",
    label: "Beta",
    icon: Users,
    blurb: "Put it in real hands",
    milestones: [
      { id: "beta-1", title: "First 10 beta users onboarded", hint: "Onboard each one personally.", xp: 100 },
      { id: "beta-2", title: "Feedback loop running", hint: "Weekly cadence: ship, ask, repeat.", xp: 70 },
      { id: "beta-3", title: "Critical bugs cleared", hint: "Nothing blocking the core flow.", xp: 60 },
      { id: "beta-4", title: "Retention measured", hint: "Do they come back in week two?", xp: 90 },
      { id: "beta-5", title: "Testimonial collected", hint: "One real quote from a happy user.", xp: 50 },
    ],
  },
  {
    key: "launch",
    label: "Launch",
    icon: Rocket,
    blurb: "Go public with confidence",
    milestones: [
      { id: "lau-1", title: "Launch assets ready", hint: "Demo video, screenshots, one-liner.", xp: 70 },
      { id: "lau-2", title: "Pitch published to StartupTV", hint: "Show the product, not the slides.", xp: 80 },
      { id: "lau-3", title: "Public launch day done", hint: "Communities, socials, newsletters.", xp: 110 },
      { id: "lau-4", title: "First paying customer", hint: "The first dollar changes everything.", xp: 150 },
      { id: "lau-5", title: "Analytics instrumented", hint: "Know which channel actually works.", xp: 60 },
    ],
  },
  {
    key: "scaling",
    label: "Scaling",
    icon: TrendingUp,
    blurb: "Turn traction into a company",
    milestones: [
      { id: "sca-1", title: "Repeatable growth channel", hint: "One channel that works twice.", xp: 130 },
      { id: "sca-2", title: "100 active users", hint: "Active, not signed up.", xp: 140 },
      { id: "sca-3", title: "Unit economics positive", hint: "Cost to acquire below value earned.", xp: 130 },
      { id: "sca-4", title: "First hire or co-founder", hint: "Bring in the skill you lack.", xp: 110 },
      { id: "sca-5", title: "Fundraising or profitability plan", hint: "Pick a path and commit.", xp: 120 },
    ],
  },
];

const LEVELS = [
  { level: 1, title: "Dreamer", at: 0, desc: "Captured your first idea" },
  { level: 2, title: "Explorer", at: 300, desc: "Validated the problem with real users" },
  { level: 3, title: "Builder", at: 700, desc: "Shipping your MVP" },
  { level: 4, title: "Operator", at: 1200, desc: "First 100 active users" },
  { level: 5, title: "Founder", at: 1800, desc: "Revenue, team and traction" },
];

const ACHIEVEMENTS = [
  { icon: "🧠", title: "First Idea", desc: "Complete the Idea stage", stage: "idea" },
  { icon: "🔎", title: "Truth Seeker", desc: "Complete the Validation stage", stage: "validation" },
  { icon: "🛠️", title: "Maker", desc: "Complete the Prototype stage", stage: "prototype" },
  { icon: "👥", title: "Beta Boss", desc: "Complete the Beta stage", stage: "beta" },
  { icon: "🚀", title: "Launched", desc: "Complete the Launch stage", stage: "launch" },
  { icon: "📈", title: "Operator", desc: "Complete the Scaling stage", stage: "scaling" },
];

const DEFAULT_DONE = ["idea-1", "idea-2"];

function ProgressPage() {
  const user = useStoredUser();
  const [startups, setStartups] = useState<string[]>([]);
  const [active, setActive] = useState("My Startup");
  const [stageKey, setStageKey] = useState(STAGES[0]!.key);
  const [done, setDone] = useState<string[]>(DEFAULT_DONE);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sl_startups");
      const list = raw ? (JSON.parse(raw) as { name: string }[]).map((s) => s.name) : [];
      const names = list.length ? list : ["My Startup"];
      setStartups(names);
      const saved = localStorage.getItem("sl_active_startup");
      setActive(saved && names.includes(saved) ? saved : names[0]!);
    } catch {
      setStartups(["My Startup"]);
    }
  }, []);

  useEffect(() => {
    if (!active) return;
    try {
      const raw = localStorage.getItem(`sl_progress_${active}`);
      setDone(raw ? (JSON.parse(raw) as string[]) : DEFAULT_DONE);
    } catch {
      setDone(DEFAULT_DONE);
    }
  }, [active]);

  const stage = STAGES.find((s) => s.key === stageKey) ?? STAGES[0]!;
  const allMilestones = useMemo(() => STAGES.flatMap((s) => s.milestones), []);
  const xp = allMilestones.filter((m) => done.includes(m.id)).reduce((sum, m) => sum + m.xp, 0);
  const totalXp = allMilestones.reduce((sum, m) => sum + m.xp, 0);
  const pct = Math.round((done.length / allMilestones.length) * 100);
  const level = [...LEVELS].reverse().find((l) => xp >= l.at) ?? LEVELS[0]!;
  const earned = ACHIEVEMENTS.filter((a) =>
    STAGES.find((s) => s.key === a.stage)!.milestones.every((m) => done.includes(m.id)),
  );

  const stagePct = (s: Stage) =>
    Math.round((s.milestones.filter((m) => done.includes(m.id)).length / s.milestones.length) * 100);

  const toggle = (m: Milestone) => {
    setDone((prev) => {
      const isDone = prev.includes(m.id);
      toast[isDone ? "message" : "success"](isDone ? "Milestone reopened" : `+${m.xp} XP — ${m.title}`);
      return isDone ? prev.filter((id) => id !== m.id) : [...prev, m.id];
    });
  };

  const save = () => {
    try {
      localStorage.setItem(`sl_progress_${active}`, JSON.stringify(done));
      localStorage.setItem("sl_active_startup", active);
      toast.success("Progress saved", { description: `${active} · ${pct}% complete` });
    } catch {
      toast.error("Couldn't save progress on this device");
    }
  };

  return (
    <div className="bg-mesh min-h-screen font-sans text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-semibold text-primary">
              <Trophy className="h-3.5 w-3.5" /> Your Progress
            </span>
            <h1 className="font-display mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              {user ? `${user.name.split(" ")[0]}'s` : "Your"} <span className="text-gradient">Founder Journey</span>
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Six stages, thirty milestones. Tick them off as you go — each one earns XP and moves you up a level.
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <span className="font-medium text-muted-foreground">Select startup</span>
            <select
              value={active}
              onChange={(e) => setActive(e.target.value)}
              className="rounded-lg border bg-card px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-ring"
            >
              {startups.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          <Stat icon={Target} label="Total XP" value={`${xp} / ${totalXp}`} />
          <Stat icon={Trophy} label="Level" value={`${level.level} · ${level.title}`} />
          <Stat icon={Flame} label="Day Streak" value="7" />
          <Stat icon={Award} label="Achievements" value={`${earned.length}/${ACHIEVEMENTS.length}`} />
        </div>

        <div className="mt-6 rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-lg font-bold">Overall Progress</h2>
            <span className="font-display text-2xl font-bold text-primary">{pct}%</span>
          </div>
          <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{done.length} of {allMilestones.length} milestones complete</p>

          <div className="mt-5 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {STAGES.map((s) => {
              const Icon = s.icon;
              const p = stagePct(s);
              const activeStage = s.key === stageKey;
              return (
                <button
                  key={s.key}
                  onClick={() => setStageKey(s.key)}
                  className={`rounded-xl border p-3 text-left transition-colors hover:bg-accent ${activeStage ? "border-primary bg-accent" : ""}`}
                >
                  <Icon className={`h-4 w-4 ${p === 100 ? "text-brand-green" : "text-primary"}`} />
                  <p className="mt-2 text-sm font-semibold">{s.label}</p>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${p}%` }} />
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">{p}%</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6 shadow-sm lg:col-span-2">
            <h2 className="font-display flex items-center gap-2 text-lg font-bold">
              <stage.icon className="h-5 w-5 text-primary" /> {stage.label} Stage Milestones
            </h2>
            <p className="text-sm text-muted-foreground">{stage.blurb}</p>
            <ul className="mt-4 space-y-2">
              {stage.milestones.map((m) => {
                const isDone = done.includes(m.id);
                return (
                  <li key={m.id}>
                    <button
                      onClick={() => toggle(m)}
                      className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left hover:bg-accent ${isDone ? "border-primary/40 bg-accent/50" : ""}`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      ) : (
                        <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground/40" />
                      )}
                      <span className="flex-1">
                        <span className={`block text-sm font-medium ${isDone ? "line-through opacity-60" : ""}`}>{m.title}</span>
                        <span className="block text-xs text-muted-foreground">{m.hint}</span>
                      </span>
                      <span className="shrink-0 text-xs font-semibold text-primary">+{m.xp} XP</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <button
              onClick={save}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-[1.01]"
            >
              <Save className="h-4 w-4" /> Save Progress
            </button>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="font-display text-lg font-bold">Levels</h2>
              <ul className="mt-4 space-y-3">
                {LEVELS.map((l) => {
                  const reached = xp >= l.at;
                  return (
                    <li key={l.level} className="flex items-start gap-3">
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${reached ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        {l.level}
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{l.title} <span className="text-xs font-normal text-muted-foreground">· {l.at} XP</span></p>
                        <p className="text-xs text-muted-foreground">{l.desc}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="font-display text-lg font-bold">Achievements</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {ACHIEVEMENTS.map((a) => {
                  const s = STAGES.find((st) => st.key === a.stage)!;
                  const p = stagePct(s);
                  return (
                    <button
                      key={a.title}
                      onClick={() => setStageKey(a.stage)}
                      className={`rounded-xl border p-3 text-left hover:bg-accent ${p === 100 ? "" : "opacity-60"}`}
                    >
                      <span className="text-xl">{a.icon}</span>
                      <p className="mt-1 text-sm font-semibold">{a.title}</p>
                      <p className="text-xs text-muted-foreground">{a.desc}</p>
                      <p className="mt-1 text-[11px] font-semibold text-primary">{p}%</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <Icon className="h-5 w-5 text-primary" />
      <p className="font-display mt-2 text-xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Brain,
  Rocket,
  CheckCircle2,
  Circle,
  Users,
  TrendingUp,
  ArrowRight,
  Bell,
  Calendar,
  BarChart3,
  Share2,
  Eye,
  Compass,
  MessageSquare,
  Plus,
  Timer,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import { SiteHeader, SiteFooter, useStoredUser } from "@/components/site-chrome";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — STARTIFY" },
      { name: "description", content: "Track your startup journey, run focus sprints, and take your next steps toward launch." },
      { property: "og:title", content: "Dashboard — STARTIFY" },
      { property: "og:description", content: "Track your startup journey, run focus sprints, and take your next steps toward launch." },
    ],
  }),
  component: DashboardPage,
});

const JOURNEY = [
  { icon: Brain, title: "Define Your Idea", desc: "Turn a vague concept into a clear problem statement", to: "/validate" as const },
  { icon: Rocket, title: "Build MVP", desc: "Create a minimum viable product to test your hypothesis", to: "/progress" as const },
  { icon: CheckCircle2, title: "Validate Concept", desc: "Get feedback from real users and iterate", to: "/validate" as const },
  { icon: Users, title: "Find Early Users", desc: "Build your first user base and community", to: "/discover" as const },
  { icon: TrendingUp, title: "Scale & Grow", desc: "Optimize for growth and expansion", to: "/mentors" as const },
];

const NEXT_STEPS = [
  { title: "Create MVP Wireframes", desc: "Design the core user interface for your app", to: "/progress" as const },
  { title: "Find Co-founder", desc: "Connect with developers and designers", to: "/co-founders" as const },
  { title: "Market Research", desc: "Analyze competitors and target audience", to: "/validate" as const },
];

const UPCOMING = [
  { title: "Pitch Practice", when: "Tomorrow, 3 PM", to: "/startup-tv" as const },
  { title: "Mentor Call", when: "Wed, 10 AM", to: "/mentors" as const },
  { title: "Demo Day", when: "Next Friday", to: "/progress" as const },
];

const QUICK_ACTIONS = [
  { icon: BarChart3, label: "Update Progress", to: "/progress" as const },
  { icon: Users, label: "Find Team Members", to: "/co-founders" as const },
  { icon: MessageSquare, label: "Get Feedback", to: "/mentors" as const },
  { icon: Compass, label: "Explore Startups", to: "/discover" as const },
  { icon: Plus, label: "New Startup", to: "/validate" as const },
];

const STORE_KEY = "sl_journey";

function FocusSprint() {
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setRunning(false);
          setSessions((n) => n + 1);
          toast.success("Sprint complete — +25 focus minutes logged");
          return 25 * 60;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [running]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const pct = 1 - seconds / (25 * 60);

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h3 className="font-display flex items-center gap-2 text-sm font-bold">
        <Timer className="h-4 w-4 text-primary" /> Focus Sprint
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">25 minutes of deep work on your startup.</p>
      <div className="mt-4 font-display text-4xl font-extrabold tabular-nums text-primary">
        {mm}:{ss}
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct * 100}%` }} />
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setRunning((r) => !r)}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />} {running ? "Pause" : "Start"}
        </button>
        <button
          onClick={() => {
            setRunning(false);
            setSeconds(25 * 60);
          }}
          aria-label="Reset sprint"
          className="flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-accent"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Sprints completed today: <span className="font-bold text-foreground">{sessions}</span>
      </p>
    </div>
  );
}

function DashboardPage() {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [done, setDone] = useState<string[]>([]);
  const user = useStoredUser();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      setDone(raw ? (JSON.parse(raw) as string[]) : [JOURNEY[0]!.title]);
    } catch {
      setDone([JOURNEY[0]!.title]);
    }
  }, []);

  const persist = (next: string[]) => {
    setDone(next);
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const toggle = (title: string) => {
    const isDone = done.includes(title);
    persist(isDone ? done.filter((t) => t !== title) : [...done, title]);
    toast.success(isDone ? `Reopened: ${title}` : `Milestone complete: ${title}`);
  };

  const currentTitle = JOURNEY.find((j) => !done.includes(j.title))?.title;
  const pct = Math.round((done.length / JOURNEY.length) * 100);
  const dash = 2 * Math.PI * 34;

  return (
    <div className="bg-mesh min-h-screen font-sans text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Welcome back, {user?.name ?? "founder"}! 👋
            </h1>
            <p className="mt-2 text-muted-foreground">
              {currentTitle ? `Next up: ${currentTitle}. Keep the momentum going.` : "Every milestone is complete — time to scale."}
            </p>
          </div>
          <button
            aria-label="Notifications"
            onClick={() => toast("3 new notifications", { description: "Pitch practice tomorrow, 2 new team requests." })}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border bg-card shadow-sm hover:bg-accent"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">3</span>
          </button>
        </div>

        {/* Current startup card */}
        <div className="mt-8 flex flex-col gap-4 rounded-lg border bg-card p-6 shadow-sm sm:flex-row sm:items-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-brand-purple to-brand-pink font-display text-xl font-bold text-primary-foreground">E</span>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-lg font-bold">EcoTrack — Carbon Footprint App</h2>
              <span className="rounded-full bg-secondary px-3 py-0.5 text-xs font-semibold text-secondary-foreground">MVP Stage</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Help people track and reduce their carbon footprint</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/discover" search={{ q: "EcoTrack" }} className="inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-accent"><Eye className="h-4 w-4" /> View Details</Link>
            <button
              onClick={async () => {
                const url = typeof window !== "undefined" ? `${window.location.origin}/discover?q=EcoTrack` : "";
                try {
                  await navigator.clipboard.writeText(url);
                  toast.success("Share link copied");
                } catch {
                  toast("Share this startup", { description: url });
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-accent"
            >
              <Share2 className="h-4 w-4" /> Share
            </button>
            <button
              onClick={() => setShowAnalytics((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <BarChart3 className="h-4 w-4" /> Analytics
            </button>
          </div>
        </div>

        {showAnalytics && (
          <div className="mt-4 grid gap-4 rounded-lg border bg-card p-6 shadow-sm sm:grid-cols-4">
            {[
              { v: "1,284", l: "Profile views" },
              { v: "47", l: "Likes" },
              { v: "3", l: "Team members" },
              { v: "12%", l: "Weekly growth" },
            ].map((m) => (
              <div key={m.l}>
                <div className="font-display text-2xl font-bold text-primary">{m.v}</div>
                <div className="text-xs text-muted-foreground">{m.l}</div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Journey */}
          <div className="rounded-lg border bg-card p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">Your Startup Journey</h3>
              <span className="text-xs text-muted-foreground">Tap a milestone to mark it done</span>
            </div>
            <ul className="mt-5 space-y-3">
              {JOURNEY.map(({ icon: Icon, title, desc, to }) => {
                const complete = done.includes(title);
                const current = title === currentTitle;
                return (
                  <li
                    key={title}
                    className={`flex items-start gap-4 rounded-xl border p-4 transition-all ${
                      current ? "border-primary bg-secondary/60" : complete ? "bg-accent/50" : "opacity-70"
                    }`}
                  >
                    <button
                      onClick={() => toggle(title)}
                      aria-label={complete ? `Reopen ${title}` : `Complete ${title}`}
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                        complete ? "bg-primary text-primary-foreground" : "bg-secondary text-primary hover:bg-accent"
                      }`}
                    >
                      {complete ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </button>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <button onClick={() => toggle(title)} className="font-semibold hover:text-primary">
                          {title}
                        </button>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${current ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                          {complete ? "Complete" : current ? "Current" : "Upcoming"}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                      <Link to={to} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                        Work on this <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                    {!complete && <Circle className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />}
                  </li>
                );
              })}
            </ul>

            <h3 className="font-display mt-8 text-lg font-bold">Next Steps</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {NEXT_STEPS.map((s) => (
                <Link
                  key={s.title}
                  to={s.to}
                  onClick={() => toast.success(`Started: ${s.title}`)}
                  className="group rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
                >
                  <div className="font-semibold">{s.title}</div>
                  <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Start <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="font-display text-sm font-bold">Your Progress</h3>
              <div className="mt-4 flex items-center gap-4">
                <div className="relative flex h-20 w-20 items-center justify-center">
                  <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="var(--color-secondary)" strokeWidth="8" />
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      fill="none"
                      stroke="var(--color-brand-purple)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${dash * (pct / 100)} ${dash}`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <span className="absolute font-display text-lg font-bold text-primary">{pct}%</span>
                </div>
                <div className="text-sm">
                  <div className="font-semibold">Overall Progress</div>
                  <div className="mt-2 text-muted-foreground"><span className="font-bold text-foreground">{done.length}</span> Milestones Complete</div>
                  <div className="text-muted-foreground"><span className="font-bold text-foreground">{JOURNEY.length}</span> Total Milestones</div>
                </div>
              </div>
              <Link to="/progress" className="mt-5 block rounded-lg border py-2 text-center text-sm font-semibold hover:bg-accent">
                View Full Progress
              </Link>
            </div>

            <FocusSprint />

            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="font-display text-sm font-bold">Upcoming</h3>
              <ul className="mt-4 space-y-3">
                {UPCOMING.map((u) => (
                  <li key={u.title}>
                    <Link
                      to={u.to}
                      onClick={() => toast.success(`Reminder set for ${u.title}`, { description: u.when })}
                      className="flex items-center gap-3 rounded-xl border p-3 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary">
                        <Calendar className="h-4 w-4" />
                      </span>
                      <div>
                        <div className="text-sm font-semibold">{u.title}</div>
                        <div className="text-xs text-muted-foreground">{u.when}</div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <h3 className="font-display mt-10 text-lg font-bold">Quick Actions</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          {QUICK_ACTIONS.map(({ icon: Icon, label, to }) => (
            <Link key={label} to={to} className="inline-flex items-center gap-2 rounded-xl border bg-card px-5 py-3 text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md">
              <Icon className="h-4 w-4 text-primary" /> {label}
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

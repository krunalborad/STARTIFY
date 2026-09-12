import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  Lightbulb,
  Compass,
  Users,
  Rocket,
  Heart,
  Trophy,
  Target,
  TrendingUp,
  MessageCircle,
  Flame,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "STARTIFY — Start Your Founder Journey" },
      { name: "description", content: "A practical launch platform for young entrepreneurs ready to shape, validate, and grow a startup idea." },
      { property: "og:title", content: "STARTIFY — Start Your Founder Journey" },
      { property: "og:description", content: "Shape your idea, meet collaborators, validate demand, and build momentum." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const STEPS = [
  { icon: Lightbulb, title: "Share Your Idea", desc: "No matter how crazy or simple, start with what you have", to: "/dashboard" as const },
  { icon: Compass, title: "Get Guided", desc: "Clear prompts help you plan, prioritize, and refine your concept", to: "/dashboard" as const },
  { icon: Users, title: "Find Your Team", desc: "Connect with co-founders, developers, and supporters", to: "/discover" as const },
  { icon: Rocket, title: "Launch Together", desc: "Build, validate, and grow with community backing", to: "/startup-tv" as const },
];


const IDEAS = [
  { initial: "E", name: "EcoTrack", author: "Sarah Chen", stage: "MVP", desc: "Help people track and reduce their carbon footprint through daily challenges and community competitions.", tag: "Sustainability", team: 3, likes: 47 },
  { initial: "S", name: "StudyBuddy AI", author: "Marcus Johnson", stage: "Idea", desc: "A personalized study companion that creates focused learning paths and connects learners for collaborative sessions.", tag: "EdTech", team: 2, likes: 32 },
  { initial: "L", name: "LocalEats", author: "Emma Rodriguez", stage: "Validation", desc: "Connect local communities with independent restaurants offering better value and healthier meal options.", tag: "Food & Dining", team: 4, likes: 28 },
];

const ACTIVITY = [
  { name: "Taylor Brown", time: "1m ago", action: "joined the team for LocalEats", meta: "Team size: 3" },
  { name: "Lisa Zhang", time: "2m ago", action: "liked LocalEats" },
  { name: "Taylor Brown", time: "11m ago", action: "joined the team for StudyBuddy AI", meta: "Team size: 5" },
  { name: "Ryan Kim", time: "26m ago", action: "browsed startup profiles" },
  { name: "Mike Rodriguez", time: "34m ago", action: 'shared a new startup idea: "a smarter study scheduler"' },
  { name: "Amy Foster", time: "47m ago", action: "discovered new projects" },
];

const ACHIEVEMENTS = [
  { title: "First Spark", rarity: "common", desc: "Share your first startup idea", current: 1, target: 1, xp: 50 },
  { title: "Team Builder", rarity: "common", desc: "Form your first team", current: 1, target: 1, xp: 75 },
  { title: "Crowd Pleaser", rarity: "rare", desc: "Get 50 likes on an idea", current: 23, target: 50, xp: 100 },
  { title: "MVP Master", rarity: "epic", desc: "Launch your first MVP", current: 0, target: 1, xp: 200 },
  { title: "Investor Ready", rarity: "rare", desc: "Complete a pitch deck", current: 3, target: 10, xp: 150 },
  { title: "Unicorn Founder", rarity: "legendary", desc: "Reach $1B valuation", current: 0, target: 1, xp: 1000 },
];

const QUESTS = [
  { label: "Share a new idea", detail: "Post an idea to Discover", xp: 50, boosts: "First Spark" },
  { label: "Like 5 ideas", detail: "Support other founders", xp: 25, boosts: "Crowd Pleaser" },
  { label: "Join a team", detail: "Team up with a co-founder", xp: 75, boosts: "Team Builder" },
  { label: "Add a pitch slide", detail: "Build out your deck", xp: 40, boosts: "Investor Ready" },
];

const PATH = [
  { name: "Dreamer", level: 1, xp: 0 },
  { name: "Ideator", level: 2, xp: 100 },
  { name: "Builder", level: 3, xp: 300 },
  { name: "Entrepreneur", level: 4, xp: 600 },
  { name: "Founder", level: 5, xp: 1000 },
  { name: "CEO", level: 6, xp: 1500 },
];

const RIVALS = [
  { name: "Sarah Chen", xp: 850 },
  { name: "Alex Rivera", xp: 720 },
  { name: "Mike Johnson", xp: 380 },
  { name: "Emma Davis", xp: 290 },
];

function levelFor(xp: number) {
  const tier = ([...PATH].reverse().find((p) => xp >= p.xp) ?? PATH[0])!;
  const next = PATH.find((p) => p.xp > xp) ?? null;
  return { tier, next };
}

const STORIES = [
  { name: "Sarah Chen", role: "Founder of EcoTrack Pro", quote: "STARTIFY helped me go from a vague environmental idea to a real business with actual users and revenue.", tag: "CleanTech", metric: "50K+ users" },
  { name: "Marcus Johnson", role: "Founder of StudyBuddy AI", quote: "We turned a simple learning workflow into a platform serving 200+ communities.", tag: "EdTech", metric: "100K+ users" },
  { name: "Emma Rodriguez", role: "Founder of LocalEats", quote: "We started with one neighborhood and now connect diners with restaurants in 50+ cities.", tag: "FoodTech", metric: "80K+ users" },
];

const rarityColor: Record<string, string> = {
  common: "text-muted-foreground",
  rare: "text-brand-purple",
  epic: "text-brand-pink",
  legendary: "text-brand-orange",
};

function SectionHeading({ eyebrow, title, desc }: { eyebrow: string; title: string; desc: string }) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold text-secondary-foreground">
        {eyebrow}
      </span>
      <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      <p className="mt-3 text-muted-foreground">{desc}</p>
    </div>
  );
}

function Index() {
  const [following, setFollowing] = useState<string[]>([]);
  const [xp, setXp] = useState(425);
  const [streak, setStreak] = useState(7);
  const [checkedIn, setCheckedIn] = useState(false);
  const [achievements, setAchievements] = useState(
    ACHIEVEMENTS.map((a) => ({ ...a, claimed: false })),
  );
  const [doneQuests, setDoneQuests] = useState<string[]>([]);

  const { tier, next } = levelFor(xp);
  const xpPercent = next
    ? Math.min(100, Math.round(((xp - tier.xp) / (next.xp - tier.xp)) * 100))
    : 100;
  const claimed = achievements.filter((a) => a.claimed).length;

  const board = [...RIVALS.map((r) => ({ ...r, you: false })), { name: "You", xp, you: true }]
    .sort((a, b) => b.xp - a.xp)
    .map((p, i) => ({ ...p, rank: i + 1, level: levelFor(p.xp).tier.level }));

  const bumpAchievement = (title: string | undefined, amount: number) => {
    if (!title) return;
    setAchievements((prev) =>
      prev.map((a) =>
        a.title === title ? { ...a, current: Math.min(a.target, a.current + amount) } : a,
      ),
    );
  };

  const claimAchievement = (title: string) => {
    const a = achievements.find((x) => x.title === title);
    if (!a || a.claimed || a.current < a.target) {
      toast.message("Keep going", { description: "Finish the progress bar to claim this reward." });
      return;
    }
    setAchievements((prev) => prev.map((x) => (x.title === title ? { ...x, claimed: true } : x)));
    setXp((v) => v + a.xp);
    toast.success(`Achievement unlocked — ${a.title}`, { description: `+${a.xp} XP added to your total.` });
  };

  const completeQuest = (label: string, amount: number, boosts?: string) => {
    if (doneQuests.includes(label)) {
      toast.message("Quest already completed today");
      return;
    }
    setDoneQuests((prev) => [...prev, label]);
    setXp((v) => v + amount);
    bumpAchievement(boosts, boosts === "Crowd Pleaser" ? 5 : 1);
    toast.success(`Quest complete — ${label}`, { description: `+${amount} XP` });
  };

  const checkIn = () => {
    if (checkedIn) {
      toast.message("You've already checked in today");
      return;
    }
    setCheckedIn(true);
    setStreak((s) => s + 1);
    setXp((v) => v + 10);
    toast.success("Daily check-in", { description: "+10 XP and your streak grew." });
  };

  const toggleFollow = (name: string) => {
    setFollowing((prev) => {
      const next = prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name];
      toast.success(prev.includes(name) ? `Unfollowed ${name}` : `Now following ${name}`);
      return next;
    });
  };



  return (
    <div className="bg-mesh min-h-screen font-sans text-foreground">
      <SiteHeader />


      {/* Hero */}
      <section className="relative overflow-hidden border-b px-4 py-16 sm:py-20">
        <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-16 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-xs font-semibold uppercase text-secondary-foreground">
              <span className="h-2 w-2 rounded-full bg-brand-green" /> Built for ambitious young entrepreneurs
            </span>
            <h1 className="font-display mt-8 text-6xl font-bold leading-[0.95] sm:text-8xl">
              Start your<br /><span className="italic text-primary">founder journey.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Turn an early idea into a real startup with practical guidance, the right collaborators, and a community that helps you keep moving.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/profile" search={{ mode: "signup" }} className="inline-flex items-center gap-2 rounded-lg bg-foreground px-7 py-4 text-sm font-bold text-background transition-transform hover:-translate-y-0.5">
                Build Your Future <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/discover" className="rounded-lg border bg-card px-7 py-4 text-sm font-semibold transition-colors hover:bg-accent">
                Explore Platform
              </Link>
            </div>
            <p className="mt-8 text-sm text-muted-foreground"><span className="font-semibold text-foreground">2,500+ founders</span> are building alongside you.</p>
          </div>

          <div className="relative mx-auto flex aspect-square w-full max-w-lg items-center justify-center rounded-xl border bg-card/70 p-8 shadow-2xl">
            <div className="absolute left-5 top-20 w-64 -rotate-3 rounded-lg border bg-background p-5 shadow-xl transition-transform duration-500 hover:rotate-0">
              <div className="flex items-center justify-between"><span className="text-xs font-semibold text-primary">VALIDATION SCORE</span><Target className="h-4 w-4 text-brand-green" /></div>
              <div className="font-display mt-4 text-4xl font-bold">84<span className="text-lg text-muted-foreground">/100</span></div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full w-4/5 bg-brand-green" /></div>
              <p className="mt-3 text-xs text-muted-foreground">Strong problem clarity and early demand signals.</p>
            </div>
            <div className="absolute bottom-16 right-4 w-60 rotate-3 rounded-lg border bg-primary p-5 text-primary-foreground shadow-xl transition-transform duration-500 hover:rotate-0">
              <div className="text-xs font-semibold uppercase">Next milestone</div>
              <div className="font-display mt-3 text-2xl font-bold">Ship the MVP</div>
              <p className="mt-2 text-xs opacity-80">3 of 5 launch tasks complete</p>
            </div>
            <span className="flex h-28 w-28 items-center justify-center rounded-xl bg-foreground text-background shadow-2xl"><Rocket className="h-12 w-12" /></span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="How It Works" title="Your Path From Idea to Launch" desc="Follow our proven path from idea to launch, with practical guidance and community support every step of the way." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ icon: Icon, title, desc, to }, i) => (
              <div key={title} className="group rounded-lg border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="font-display text-4xl font-bold text-secondary">{i + 1}</span>
                </div>
                <h3 className="font-display font-bold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
                <Link to={to} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Learn More <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending ideas */}
      <section id="ideas" className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Trending Ideas" title="See What Founders Are Building" desc="See what other founders are building and get inspired." />
          <div className="grid gap-6 md:grid-cols-3">
            {IDEAS.map((idea) => (
              <div key={idea.name} className="rounded-lg border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-purple to-brand-pink font-display text-lg font-bold text-primary-foreground">
                    {idea.initial}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-display font-bold">{idea.name}</h3>
                    <p className="text-xs text-muted-foreground">by {idea.author}</p>
                  </div>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">{idea.stage}</span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{idea.desc}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="rounded-full border px-2.5 py-0.5 font-medium">{idea.tag}</span>
                  <span className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {idea.team} people</span>
                    <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {idea.likes}</span>
                  </span>
                </div>
                <div className="mt-5 flex gap-2">
                  <button
                    onClick={() => toggleFollow(idea.name)}
                    className={`flex-1 rounded-lg border py-2 text-sm font-semibold hover:bg-accent ${following.includes(idea.name) ? "border-primary text-primary" : ""}`}
                  >
                    {following.includes(idea.name) ? "Following" : "Follow"}
                  </button>
                  <Link
                    to="/discover"
                    search={{ q: idea.name }}
                    className="flex-1 rounded-lg bg-primary py-2 text-center text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/discover" search={{ q: "" }} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Success stories */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Success Stories" title="From First Step to Breakthrough" desc="Young entrepreneurs who turned early ideas into growing businesses." />
          <div className="grid gap-6 md:grid-cols-3">
            {STORIES.map((s) => (
              <Link
                key={s.name}
                to="/discover"
                search={{ q: s.tag }}
                className="block rounded-lg border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <p className="text-sm italic text-muted-foreground">"{s.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple to-brand-pink font-display font-bold text-primary-foreground">
                    {s.name[0]}
                  </span>
                  <div>
                    <div className="text-sm font-bold">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.role}</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">{s.tag}</span>
                  <span className="text-sm font-bold text-brand-purple">{s.metric}</span>
                </div>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                  Read their journey <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Live activity */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Live Activity" title="What's Happening Right Now" desc="See real-time activity from our community of young entrepreneurs." />
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "127", label: "Active now", to: "/co-founders" as const, search: {} },
              { value: "2547", label: "Total members", to: "/co-founders" as const, search: {} },
              { value: "23", label: "Ideas shared today", to: "/discover" as const, search: { q: "" } },
            ].map((s) => (
              <Link
                key={s.label}
                to={s.to}
                search={s.search as never}
                className="rounded-lg border bg-card p-5 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="font-display text-2xl font-bold text-primary">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </Link>
            ))}
          </div>
          <div className="mt-6 rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-green opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-green" />
              </span>
              Live Activity Feed
            </div>
            <ul className="space-y-4">
              {ACTIVITY.map((a, i) => (
                <li key={i}>
                  <Link
                    to="/co-founders"
                    className="flex items-start gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-accent"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary font-display text-xs font-bold text-secondary-foreground">
                      {a.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                    <div className="text-sm">
                      <span className="font-semibold">{a.name}</span>{" "}
                      <span className="text-muted-foreground">{a.time}</span>
                      <div className="text-muted-foreground">{a.action}</div>
                      {a.meta && <div className="text-xs text-muted-foreground">{a.meta}</div>}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/mentors" className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2.5 text-sm font-semibold shadow-sm hover:bg-accent">
              <MessageCircle className="h-4 w-4 text-primary" /> Talk to a Mentor
            </Link>
            <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2.5 text-sm font-semibold shadow-sm hover:bg-accent">
              <Lightbulb className="h-4 w-4 text-primary" /> Share Your Idea
            </Link>
            <Link to="/discover" search={{ q: "" }} className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2.5 text-sm font-semibold shadow-sm hover:bg-accent">
              <Rocket className="h-4 w-4 text-primary" /> Explore Startups
            </Link>
            <Link to="/discover" search={{ q: "" }} className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2.5 text-sm font-semibold shadow-sm hover:bg-accent">
              <Users className="h-4 w-4 text-primary" /> Find Team Members
            </Link>
          </div>
        </div>
      </section>

      {/* Gamification */}
      <section id="gamification" className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Gamified Journey" title="Level Up Your Startup Journey" desc="Complete quests, claim achievements, and climb the weekly leaderboard." />
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Level + leaderboard */}
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-brand-purple to-brand-pink text-primary-foreground">
                  <Trophy className="h-7 w-7" />
                </span>
                <div>
                  <div className="font-display text-xl font-bold">Level {tier.level}</div>
                  <div className="text-sm font-semibold text-primary">{tier.name}</div>
                </div>
                <button
                  onClick={checkIn}
                  className={`ml-auto rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${checkedIn ? "border-brand-green text-brand-green" : "hover:bg-accent"}`}
                >
                  <Flame className="mr-1 inline h-3.5 w-3.5" />
                  {checkedIn ? `${streak} day streak` : "Check in +10 XP"}
                </button>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                {xp} XP • {next ? `${next.xp - xp} XP to ${next.name}` : "Max tier reached"} • {streak} day streak
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-purple to-brand-pink transition-all duration-500"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <div className="mt-2 text-right text-xs text-muted-foreground">{xpPercent}%</div>

              <h4 className="font-display mt-6 mb-3 text-sm font-bold">Weekly Leaders</h4>
              <ul className="space-y-2">
                {board.map((l) => (
                  <li key={l.name}>
                    <Link
                      to="/co-founders"
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent ${l.you ? "bg-secondary" : ""}`}
                    >
                      <span className="font-display w-5 font-bold text-muted-foreground">{l.rank}</span>
                      <span className="flex-1 font-semibold">{l.name}</span>
                      <span className="text-xs text-muted-foreground">Level {l.level} • {l.xp} XP</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link to="/progress" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                Full progress report <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Achievements */}
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="font-display text-sm font-bold">Achievements</h4>
                <span className="text-xs font-semibold text-muted-foreground">{claimed}/{achievements.length} claimed</span>
              </div>
              <ul className="space-y-3">
                {achievements.map((a) => {
                  const ready = a.current >= a.target && !a.claimed;
                  const pct = Math.round((a.current / a.target) * 100);
                  return (
                    <li key={a.title} className={`rounded-xl border p-3 transition-colors ${a.claimed ? "border-brand-green/50" : ready ? "border-primary" : ""}`}>
                      <div className="flex items-center gap-3">
                        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${a.claimed ? "bg-brand-green/15 text-brand-green" : "bg-secondary text-primary"}`}>
                          <Trophy className="h-4 w-4" />
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-sm font-bold">
                            {a.title}
                            <span className={`text-xs font-semibold ${rarityColor[a.rarity]}`}>{a.rarity}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">{a.desc}</div>
                        </div>
                        <button
                          onClick={() => claimAchievement(a.title)}
                          disabled={a.claimed}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                            a.claimed
                              ? "bg-secondary text-muted-foreground"
                              : ready
                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                : "border hover:bg-accent"
                          }`}
                        >
                          {a.claimed ? "Claimed" : ready ? `Claim +${a.xp}` : `${a.current}/${a.target}`}
                        </button>
                      </div>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Path + quests */}
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h4 className="font-display mb-4 text-sm font-bold">Your Path</h4>
              <ul className="space-y-2">
                {PATH.map((p) => {
                  const isCurrent = p.level === tier.level;
                  const unlocked = xp >= p.xp;
                  return (
                    <li key={p.name}>
                      <Link
                        to="/progress"
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-transform hover:-translate-y-0.5 ${
                          isCurrent ? "bg-gradient-to-r from-brand-purple to-brand-pink text-primary-foreground" : `border ${unlocked ? "" : "opacity-60"}`
                        }`}
                      >
                        <span className="font-display font-bold">{p.name}</span>
                        {isCurrent && <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">Current</span>}
                        <span className={`ml-auto text-xs ${isCurrent ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                          Level {p.level} • {p.xp} XP
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <h4 className="font-display mt-6 mb-3 text-sm font-bold">Daily Quests</h4>
              <ul className="space-y-2">
                {QUESTS.map((q) => {
                  const done = doneQuests.includes(q.label);
                  return (
                    <li key={q.label}>
                      <button
                        onClick={() => completeQuest(q.label, q.xp, q.boosts)}
                        className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors hover:bg-accent ${done ? "opacity-60" : ""}`}
                      >
                        <CheckCircle2 className={`h-5 w-5 shrink-0 ${done ? "text-brand-green" : "text-muted-foreground/40"}`} />
                        <span className="flex-1">
                          <span className={`block font-semibold ${done ? "line-through" : ""}`}>{q.label}</span>
                          <span className="block text-xs text-muted-foreground">{q.detail}</span>
                        </span>
                        <span className="text-xs font-bold text-primary">+{q.xp}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>


      {/* CTA */}
      <section id="cta" className="px-4 py-24">
        <div className="mx-auto max-w-4xl rounded-xl bg-gradient-to-br from-brand-purple via-brand-pink to-brand-orange p-12 text-center text-primary-foreground shadow-2xl">
          <h2 className="font-display text-3xl font-bold sm:text-5xl">Join the Movement</h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/90">
            Thousands of young entrepreneurs are already turning ideas into momentum.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { v: "2.5K+", l: "Active Founders" },
              { v: "500+", l: "Ideas Shared" },
              { v: "150+", l: "Teams Formed" },
              { v: "50+", l: "MVPs Built" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display text-3xl font-extrabold">{s.v}</div>
                <div className="text-xs text-primary-foreground/80">{s.l}</div>
              </div>
            ))}
          </div>
          <Link to="/profile" search={{ mode: "signup" }} className="mt-10 inline-flex items-center gap-2 rounded-xl bg-card px-8 py-4 text-sm font-bold text-primary shadow-xl transition-transform hover:scale-105">
            Start Your Journey Today <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

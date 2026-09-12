import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Users, Heart, Plus, Bookmark, Shuffle, Flame } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";

export const Route = createFileRoute("/discover")({
  validateSearch: (search: Record<string, unknown>): { q?: string } => ({
    q: typeof search["q"] === "string" ? search["q"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Discover Startups — STARTIFY" },
      { name: "description", content: "Explore ideas and join teams. Find exciting early-stage startups to join, follow, or get inspired by." },
      { property: "og:title", content: "Discover Startups — STARTIFY" },
      { property: "og:description", content: "Explore ideas and join teams. Find exciting early-stage startups to join, follow, or get inspired by." },
    ],
  }),
  component: DiscoverPage,
});

const STARTUPS = [
  { initial: "E", name: "EcoTrack", author: "Sarah Chen", stage: "MVP", category: "Sustainability", desc: "Help young entrepreneurs track and reduce their carbon footprint through gamified daily challenges and community competitions.", team: 3, likes: 47, date: "2d ago", needs: ["React dev", "Designer"] },
  { initial: "S", name: "StudyBuddy AI", author: "Marcus Johnson", stage: "Idea", category: "EdTech", desc: "A personalized study companion that creates personalized learning paths and connects learners for collaborative study sessions.", team: 2, likes: 32, date: "5d ago", needs: ["ML engineer", "Growth"] },
  { initial: "L", name: "LocalEats", author: "Emma Rodriguez", stage: "Validation", category: "Food & Dining", desc: "Connect young entrepreneurs with local restaurants offering exclusive discounts and healthy meal options.", team: 4, likes: 28, date: "1w ago", needs: ["Ops lead", "Sales"] },
  { initial: "F", name: "FitCampus", author: "Jordan Lee", stage: "Idea", category: "Fitness", desc: "Community-wide fitness challenges with gym buddy matching and intramural league organization tools.", team: 1, likes: 19, date: "1w ago", needs: ["Co-founder", "Mobile dev"] },
  { initial: "N", name: "NoteSwap", author: "Amy Foster", stage: "MVP", category: "EdTech", desc: "Peer-to-peer note sharing marketplace with smart summaries and study guides for every subject.", team: 5, likes: 41, date: "2w ago", needs: ["Backend dev"] },
  { initial: "B", name: "BudgetU", author: "Ryan Kim", stage: "Validation", category: "FinTech", desc: "Simple budgeting app that tracks everyday spending, subscriptions, and finds local deals automatically.", team: 2, likes: 15, date: "3w ago", needs: ["Fintech advisor", "Designer"] },
];

const CATEGORIES = ["All", "Sustainability", "EdTech", "Food & Dining", "Fitness", "FinTech"];
const STAGES = ["All", "Idea", "Validation", "MVP"];
const SORTS = ["Newest", "Most Liked", "Biggest Team"];

function DiscoverPage() {
  const { q } = Route.useSearch();
  const [query, setQuery] = useState(q ?? "");
  const [following, setFollowing] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [liked, setLiked] = useState<string[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [selected, setSelected] = useState<(typeof STARTUPS)[number] | null>(null);
  const [category, setCategory] = useState("All");
  const [stage, setStage] = useState("All");
  const [sort, setSort] = useState("Newest");

  const likesFor = (s: (typeof STARTUPS)[number]) => s.likes + (liked.includes(s.name) ? 1 : 0);

  const results = STARTUPS.filter((s) => {
    const needle = query.toLowerCase();
    const matchesQuery =
      !needle ||
      s.name.toLowerCase().includes(needle) ||
      s.desc.toLowerCase().includes(needle) ||
      s.author.toLowerCase().includes(needle) ||
      s.needs.some((n) => n.toLowerCase().includes(needle));
    const matchesCategory = category === "All" || s.category === category;
    const matchesStage = stage === "All" || s.stage === stage;
    const matchesSaved = !savedOnly || saved.includes(s.name);
    return matchesQuery && matchesCategory && matchesStage && matchesSaved;
  }).sort((a, b) => {
    if (sort === "Most Liked") return likesFor(b) - likesFor(a);
    if (sort === "Biggest Team") return b.team - a.team;
    return 0;
  });

  const toggle = (list: string[], setList: (v: string[]) => void, name: string) =>
    setList(list.includes(name) ? list.filter((n) => n !== name) : [...list, name]);

  const surprise = () => {
    const pick = STARTUPS[Math.floor(Math.random() * STARTUPS.length)]!;
    setSelected(pick);
    toast("Inspire me", { description: `Here's ${pick.name} — ${pick.category}` });
  };

  const resetFilters = () => {
    setQuery("");
    setCategory("All");
    setStage("All");
    setSort("Newest");
    setSavedOnly(false);
  };

  return (
    <div className="bg-mesh min-h-screen font-sans text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <span className="text-sm font-semibold text-primary">Discover Startups</span>
        <h1 className="font-display mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Explore Ideas & <span className="text-gradient">Join Teams</span>
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Find exciting startups to join, follow, or get inspired by
        </p>

        {/* Trending searches */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
            <Flame className="h-3.5 w-3.5 text-brand-orange" /> Trending:
          </span>
          {["Sustainability", "EdTech", "Designer", "Co-founder", "FinTech"].map((t) => (
            <button
              key={t}
              onClick={() => setQuery(t)}
              className="rounded-full border px-3 py-1 text-xs font-medium hover:border-primary hover:text-primary"
            >
              {t}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ideas, founders, or roles needed"
              className="h-10 w-full rounded-lg border bg-background pl-9 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              Category
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-10 rounded-lg border bg-background px-3 text-sm text-foreground outline-none">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              Stage
              <select value={stage} onChange={(e) => setStage(e.target.value)} className="h-10 rounded-lg border bg-background px-3 text-sm text-foreground outline-none">
                {STAGES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              Sort by
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-10 rounded-lg border bg-background px-3 text-sm text-foreground outline-none">
                {SORTS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSavedOnly((v) => !v)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-accent ${savedOnly ? "border-primary text-primary" : ""}`}
          >
            <Bookmark className="h-4 w-4" /> Saved ({saved.length})
          </button>
          <button onClick={surprise} className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-accent">
            <Shuffle className="h-4 w-4" /> Inspire me
          </button>
          <button onClick={resetFilters} className="rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-accent">
            Reset filters
          </button>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="font-bold text-foreground">{results.length}</span> startups found
          </p>
          <Link to="/validate" className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" /> Create Startup
          </Link>
        </div>

        {results.length === 0 ? (
          <div className="mt-16 rounded-lg border border-dashed bg-card p-16 text-center">
            <p className="font-display text-lg font-bold">0 startups found</p>
            <p className="mt-1 text-sm text-muted-foreground">Try a different search or filter — or create your own!</p>
            <button onClick={resetFilters} className="mt-5 rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-accent">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((s) => (
              <div
                key={s.name}
                role="button"
                tabIndex={0}
                onClick={() => setSelected(s)}
                onKeyDown={(e) => e.key === "Enter" && setSelected(s)}
                className="cursor-pointer rounded-lg border bg-card p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-primary hover:shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-purple to-brand-pink font-display text-lg font-bold text-primary-foreground">
                    {s.initial}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-display font-bold">{s.name}</h3>
                    <p className="text-xs text-muted-foreground">by {s.author} • {s.date}</p>
                  </div>
                  <button
                    aria-label={saved.includes(s.name) ? `Unsave ${s.name}` : `Save ${s.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle(saved, setSaved, s.name);
                      toast.success(saved.includes(s.name) ? `Removed ${s.name} from saved` : `Saved ${s.name}`);
                    }}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border hover:bg-accent ${saved.includes(s.name) ? "border-primary text-primary" : ""}`}
                  >
                    <Bookmark className={`h-4 w-4 ${saved.includes(s.name) ? "fill-current" : ""}`} />
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-secondary px-3 py-0.5 text-xs font-semibold text-secondary-foreground">{s.stage}</span>
                  <span className="rounded-full border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">{s.category}</span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{s.desc}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Looking for: <span className="font-semibold text-foreground">{s.needs.join(", ")}</span>
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {s.team} people</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle(liked, setLiked, s.name);
                    }}
                    aria-label={`Like ${s.name}`}
                    className={`flex items-center gap-1 rounded-full border px-2.5 py-1 hover:bg-accent ${liked.includes(s.name) ? "border-brand-pink text-brand-pink" : ""}`}
                  >
                    <Heart className={`h-3.5 w-3.5 ${liked.includes(s.name) ? "fill-current" : ""}`} /> {likesFor(s)}
                  </button>
                </div>
                <div className="mt-5 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const isFollowing = following.includes(s.name);
                      toggle(following, setFollowing, s.name);
                      toast.success(isFollowing ? `Unfollowed ${s.name}` : `Now following ${s.name}`);
                    }}
                    className={`flex-1 rounded-lg border py-2 text-sm font-semibold hover:bg-accent ${following.includes(s.name) ? "border-primary text-primary" : ""}`}
                  >
                    {following.includes(s.name) ? "Following" : "Follow"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(s);
                    }}
                    className="flex-1 rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selected && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <div className="w-full max-w-lg rounded-lg border bg-card p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-purple to-brand-pink font-display text-lg font-bold text-primary-foreground">
                  {selected.initial}
                </span>
                <div>
                  <h2 className="font-display text-xl font-bold">{selected.name}</h2>
                  <p className="text-xs text-muted-foreground">by {selected.author} • {selected.stage} • {selected.category}</p>
                </div>
              </div>
              <p className="mt-5 text-sm text-muted-foreground">{selected.desc}</p>
              <p className="mt-4 text-sm">
                <span className="text-muted-foreground">Roles open:</span>{" "}
                <span className="font-semibold">{selected.needs.join(", ")}</span>
              </p>
              <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {selected.team} people</span>
                <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {likesFor(selected)} likes</span>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    toast.success(`Request sent to join ${selected.name}`);
                    setSelected(null);
                  }}
                  className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Request to Join
                </button>
                <Link
                  to="/co-founders"
                  className="flex-1 rounded-lg border py-2.5 text-center text-sm font-semibold hover:bg-accent"
                >
                  Meet the Team
                </Link>
                <button onClick={() => setSelected(null)} className="w-full rounded-lg border py-2.5 text-sm font-semibold hover:bg-accent">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

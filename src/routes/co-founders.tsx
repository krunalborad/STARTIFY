import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Users, MapPin, Search, MessageSquare, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";

export const Route = createFileRoute("/co-founders")({
  head: () => ({
    meta: [
      { title: "Find a Co-Founder — STARTIFY" },
      { name: "description", content: "Match with ambitious builders, designers and marketers looking for a co-founder to start something real." },
      { property: "og:title", content: "Find a Co-Founder — STARTIFY" },
      { property: "og:description", content: "Match with ambitious builders, designers and marketers ready to co-found your startup." },
    ],
  }),
  component: CoFoundersPage,
});

const PEOPLE = [
  { initials: "AK", name: "Aisha Khan", role: "Full-Stack Developer", school: "MIT · Junior", location: "Boston, MA", match: 94, bio: "Ships fast with React and Node. Looking for a business-minded co-founder for an EdTech product.", skills: ["React", "Node.js", "Postgres"], looking: "Business / Growth" },
  { initials: "TN", name: "Tomas Novak", role: "Product Designer", school: "RISD · Senior", location: "Providence, RI", match: 91, bio: "Design systems and prototyping. I've shipped 3 community apps and want a technical partner.", skills: ["Figma", "UX Research", "Branding"], looking: "Engineering" },
  { initials: "LM", name: "Lena Martins", role: "Growth Marketer", school: "NYU · Sophomore", location: "New York, NY", match: 88, bio: "Grew an independent newsletter to 12k readers. I handle distribution, you handle product.", skills: ["Content", "SEO", "Community"], looking: "Technical Founder" },
  { initials: "RS", name: "Rahul Shah", role: "ML Engineer", school: "Georgia Tech · Senior", location: "Atlanta, GA", match: 86, bio: "Building recommendation systems. Interested in AI tools for learners.", skills: ["Python", "PyTorch", "LLMs"], looking: "Design / Product" },
  { initials: "CB", name: "Chloe Bennett", role: "Business & Ops", school: "Wharton · Junior", location: "Philadelphia, PA", match: 83, bio: "Finance background, ran two early ventures. I love unit economics and fundraising.", skills: ["Fundraising", "Ops", "Finance"], looking: "Engineering" },
  { initials: "DO", name: "Daniel Osei", role: "iOS Developer", school: "UT Austin · Senior", location: "Austin, TX", match: 80, bio: "Swift developer with two App Store launches. Want to build a consumer mobile startup.", skills: ["Swift", "SwiftUI", "Firebase"], looking: "Marketing" },
];

const ROLES = ["All", "Full-Stack Developer", "Product Designer", "Growth Marketer", "ML Engineer", "Business & Ops", "iOS Developer"];

function CoFoundersPage() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("All");
  const [invited, setInvited] = useState<string[]>([]);
  const [selected, setSelected] = useState<(typeof PEOPLE)[number] | null>(null);

  const results = PEOPLE.filter((p) => {
    const q = query.toLowerCase();
    const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.bio.toLowerCase().includes(q) || p.skills.some((s) => s.toLowerCase().includes(q));
    return matchesQuery && (role === "All" || p.role === role);
  }).sort((a, b) => b.match - a.match);

  const invite = (name: string) => {
    setInvited((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
    toast.success(invited.includes(name) ? "Invite withdrawn" : `Invite sent to ${name}`);
  };

  return (
    <div className="bg-mesh min-h-screen font-sans text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div className="mt-6 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-semibold text-primary">
            <Users className="h-3.5 w-3.5" /> Co-Founder Matching
          </span>
          <h1 className="font-display mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Find Your <span className="text-gradient">Co-Founder</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Match with ambitious builders, designers and marketers who want to start something real
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, skill or interest"
              className="h-10 w-full rounded-lg border bg-background pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            aria-label="Filter by role"
            className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {results.map((p) => (
            <div key={p.name} className="flex flex-col rounded-lg border bg-card p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">{p.initials}</span>
                  <div>
                    <h2 className="font-display font-bold">{p.name}</h2>
                    <p className="text-xs text-muted-foreground">{p.role}</p>
                  </div>
                </div>
                <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-primary">{p.match}% match</span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{p.school}</p>
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {p.location}</p>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{p.bio}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.skills.map((s) => (
                  <span key={s} className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">{s}</span>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Looking for: <span className="font-semibold text-foreground">{p.looking}</span></p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => invite(p.name)}
                  className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold ${invited.includes(p.name) ? "border bg-accent" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
                >
                  <UserPlus className="h-4 w-4" /> {invited.includes(p.name) ? "Invited" : "Invite"}
                </button>
                <button onClick={() => setSelected(p)} className="inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-accent">
                  <MessageSquare className="h-4 w-4" /> Message
                </button>
              </div>
            </div>
          ))}
          {results.length === 0 && (
            <p className="col-span-full py-16 text-center text-sm text-muted-foreground">No matches yet — try a different search.</p>
          )}
        </div>
      </main>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-xl font-bold">Message {selected.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{selected.role} · {selected.school}</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success(`Message sent to ${selected.name}`);
                setSelected(null);
              }}
            >
              <textarea
                rows={4}
                required
                placeholder={`Hi ${selected.name.split(" ")[0]}, I'm building…`}
                className="mt-4 w-full rounded-lg border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <div className="mt-4 flex gap-2">
                <button type="submit" className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Send</button>
                <button type="button" onClick={() => setSelected(null)} className="rounded-lg border px-4 py-2.5 text-sm font-semibold hover:bg-accent">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
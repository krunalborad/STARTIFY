import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Star, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";

export const Route = createFileRoute("/mentors")({
  head: () => ({
    meta: [
      { title: "Book a Mentor — STARTIFY" },
      { name: "description", content: "Get personalized guidance from experienced entrepreneurs, investors, and industry experts." },
      { property: "og:title", content: "Book a Mentor — STARTIFY" },
      { property: "og:description", content: "Book 1:1 sessions with founders, designers, engineers, marketers and startup lawyers." },
    ],
  }),
  component: MentorsPage,
});

const MENTORS = [
  { initials: "DSC", name: "Dr. Sarah Chen", role: "Serial Entrepreneur & Investor", rating: 4.9, sessions: 127, bio: "Founded 3 startups with 2 successful exits. Angel investor with 50+ portfolio companies.", tags: ["Product Strategy", "Fundraising", "Market Analysis"], slots: ["Monday 10:00", "Wednesday 14:00", "Friday 11:00"] },
  { initials: "JP", name: "James Park", role: "UX Design Lead", rating: 4.9, sessions: 73, bio: "Former design lead at Airbnb. Passionate about user-centric product development.", tags: ["UI/UX Design", "User Research", "Prototyping"], slots: ["Tuesday 11:00", "Thursday 13:00"] },
  { initials: "MJ", name: "Marcus Johnson", role: "CTO at TechVentures", rating: 4.8, sessions: 89, bio: "Former Google engineer. Built systems serving 100M+ users.", tags: ["Technical Architecture", "Scaling", "AI/ML"], slots: ["Tuesday 09:00", "Thursday 15:00"] },
  { initials: "PS", name: "Priya Sharma", role: "Growth Marketing Expert", rating: 4.7, sessions: 156, bio: "Grew 5 startups from 0 to 1M users. Marketing advisor to YC companies.", tags: ["Growth Hacking", "SEO", "Content Strategy", "Social Media"], slots: ["Monday 13:00", "Wednesday 10:00", "Friday 14:00"] },
  { initials: "ER", name: "Elena Rodriguez", role: "Startup Lawyer & Advisor", rating: 4.6, sessions: 94, bio: "Helped 200+ startups with legal structuring and IP strategy.", tags: ["Legal", "Fundraising", "IP Protection", "Incorporation"], slots: ["Monday 15:00", "Friday 09:00"] },
];

function MentorsPage() {
  const [booking, setBooking] = useState<(typeof MENTORS)[number] | null>(null);
  const [slot, setSlot] = useState("");
  const [booked, setBooked] = useState<string[]>([]);

  const confirm = () => {
    if (!booking) return;
    if (!slot) {
      toast.error("Pick a time slot");
      return;
    }
    setBooked((b) => [...b, booking.name]);
    toast.success(`Session booked with ${booking.name}`, { description: slot });
    setBooking(null);
    setSlot("");
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
            <GraduationCap className="h-3.5 w-3.5" /> Expert Mentors
          </span>
          <h1 className="font-display mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Book a <span className="text-gradient">Mentor Session</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Get personalized guidance from experienced entrepreneurs and industry experts
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {MENTORS.map((m) => (
            <div key={m.name} className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                  {m.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-lg font-bold">{m.name}</h2>
                  <p className="text-sm text-muted-foreground">{m.role}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                      <Star className="h-3.5 w-3.5 fill-current text-primary" /> {m.rating}
                    </span>
                    <span>{m.sessions} sessions</span>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{m.bio}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {m.tags.map((t) => (
                  <span key={t} className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">{t}</span>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">Available: {m.slots.join(", ")}</p>
              <button
                onClick={() => { setBooking(m); setSlot(m.slots[0] ?? ""); }}
                className="mt-4 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                {booked.includes(m.name) ? "Book Another Session" : "Book Session"}
              </button>
            </div>
          ))}
        </div>
      </main>

      {booking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4" onClick={() => setBooking(null)}>
          <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-xl font-bold">Book {booking.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{booking.role}</p>
            <div className="mt-4 space-y-2">
              {booking.slots.map((s) => (
                <button
                  key={s}
                  onClick={() => setSlot(s)}
                  className={`w-full rounded-lg border px-4 py-2.5 text-left text-sm font-medium ${slot === s ? "border-primary bg-accent" : "hover:bg-accent"}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="mt-5 flex gap-2">
              <button onClick={confirm} className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                Confirm Booking
              </button>
              <button onClick={() => setBooking(null)} className="rounded-lg border px-4 py-2.5 text-sm font-semibold hover:bg-accent">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}

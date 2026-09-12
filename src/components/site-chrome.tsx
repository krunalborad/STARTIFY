import { Link, useNavigate } from "@tanstack/react-router";
import { Rocket, Bell, Share2, LogOut, Plus, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export type StoredUser = { name: string; email: string };

export function useStoredUser() {
  const [user, setUser] = useState<StoredUser | null>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("sl_user");
      if (raw) setUser(JSON.parse(raw) as StoredUser);
    } catch {
      /* ignore */
    }
  }, []);
  return user;
}

const NAV = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Tools", to: "/tools" },
  { label: "Discover", to: "/discover" },
  { label: "Validate", to: "/validate" },
  { label: "Co-Founders", to: "/co-founders" },
  { label: "Mentors", to: "/mentors" },
  { label: "Progress", to: "/progress" },
  { label: "StartupTV", to: "/startup-tv" },
];

type Notice = { id: string; title: string; body: string; to: string; read: boolean };

const DEFAULT_NOTICES: Notice[] = [
  { id: "n1", title: "New co-founder match", body: "Priya (Design) is a 92% match for your startup.", to: "/co-founders", read: false },
  { id: "n2", title: "Mentor slot opened", body: "Arjun Mehta has 2 new slots this week.", to: "/mentors", read: false },
  { id: "n3", title: "Your pitch got feedback", body: "3 founders rated your latest StartupTV pitch.", to: "/startup-tv", read: false },
];

function useNotices() {
  const [notices, setNotices] = useState<Notice[]>(DEFAULT_NOTICES);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("sl_notices");
      if (raw) setNotices(JSON.parse(raw) as Notice[]);
    } catch {
      /* ignore */
    }
  }, []);
  const persist = (next: Notice[]) => {
    setNotices(next);
    try {
      localStorage.setItem("sl_notices", JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };
  return { notices, persist };
}

function NotificationBell() {
  const { notices, persist } = useNotices();
  const [open, setOpen] = useState(false);
  const unread = notices.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        aria-label="Notifications"
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-accent"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <>
          <button aria-hidden className="fixed inset-0 z-40 cursor-default" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border bg-card p-2 shadow-xl">
            <div className="flex items-center justify-between px-2 py-1.5">
              <span className="text-sm font-semibold">Notifications</span>
              <button
                className="text-xs text-primary hover:underline"
                onClick={() => persist(notices.map((n) => ({ ...n, read: true })))}
              >
                Mark all read
              </button>
            </div>
            {notices.length === 0 ? (
              <p className="px-2 py-6 text-center text-sm text-muted-foreground">You're all caught up.</p>
            ) : (
              <ul className="space-y-1">
                {notices.map((n) => (
                  <li key={n.id}>
                    <Link
                      to={n.to}
                      onClick={() => {
                        persist(notices.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
                        setOpen(false);
                      }}
                      className={`block rounded-lg px-3 py-2 hover:bg-accent ${n.read ? "opacity-60" : ""}`}
                    >
                      <span className="block text-sm font-semibold">{n.title}</span>
                      <span className="block text-xs text-muted-foreground">{n.body}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export function SiteHeader() {
  const user = useStoredUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const signOut = () => {
    try {
      localStorage.removeItem("sl_user");
    } catch {
      /* ignore */
    }
    toast.success("Signed out");
    navigate({ to: "/profile", search: { mode: "signin" } });
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Rocket className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold text-primary">STARTIFY</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="text-foreground/80 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary font-semibold" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <NotificationBell />
          <Link
            to="/create"
            className="hidden items-center gap-1.5 rounded-lg border border-primary/40 px-3 py-1.5 text-sm font-semibold text-primary hover:bg-accent sm:inline-flex"
          >
            <Plus className="h-4 w-4" /> Create Startup
          </Link>
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-semibold hover:bg-accent"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="hidden sm:inline">{user.name}</span>
              </Link>
              <button
                onClick={signOut}
                aria-label="Sign out"
                className="hidden h-9 w-9 items-center justify-center rounded-lg border hover:bg-accent sm:flex"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Link
              to="/profile"
              search={{ mode: "signup" }}
              className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-105 sm:px-4"
            >
              Get Started
            </Link>
          )}
          <button
            aria-label="Open menu"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-accent lg:hidden"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="border-t bg-background px-4 py-3 lg:hidden">
          <nav className="grid gap-1 text-sm font-medium">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2 hover:bg-accent"
                activeProps={{ className: "bg-accent text-primary font-semibold" }}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/create" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 font-semibold text-primary hover:bg-accent">
              + Create Startup
            </Link>
            {user && (
              <button onClick={signOut} className="rounded-lg px-3 py-2 text-left hover:bg-accent">
                Sign out
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t px-4 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Rocket className="h-4 w-4" />
          </span>
          <span className="font-display font-bold text-primary">STARTIFY</span>
        </div>
        <p className="text-xs text-muted-foreground">© 2026 STARTIFY. Built for ambitious young entrepreneurs.</p>
        <div className="flex gap-2">
          <Link to="/discover" className="flex h-9 items-center rounded-lg border px-3 text-xs font-semibold hover:bg-accent">
            Explore ideas
          </Link>
          <button
            aria-label="Share STARTIFY"
            onClick={async () => {
              const url = typeof window !== "undefined" ? window.location.href : "";
              try {
                await navigator.clipboard.writeText(url);
                toast.success("Link copied to clipboard");
              } catch {
                toast("Share this page", { description: url });
              }
            }}
            className="flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-accent"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

type Mode = "signin" | "signup";

export const Route = createFileRoute("/profile")({
  validateSearch: (search: Record<string, unknown>): { mode?: Mode } => ({
    mode: search["mode"] === "signup" ? "signup" : "signin",
  }),
  head: () => ({
    meta: [
      { title: "Sign In — STARTIFY" },
      { name: "description", content: "Sign in or create your STARTIFY account and start building your startup today." },
      { property: "og:title", content: "Sign In — STARTIFY" },
      { property: "og:description", content: "Sign in or create your STARTIFY account and start building your startup today." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const setMode = (next: Mode) => navigate({ to: "/profile", search: { mode: next } });

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Read straight from the form so a value typed before hydration still counts.
    const data = new FormData(e.currentTarget);
    const emailValue = String(data.get("email") ?? "").trim() || email.trim();
    const passwordValue = String(data.get("password") ?? "").trim() || password.trim();
    const nameValue = String(data.get("name") ?? "").trim() || name.trim();

    if (!emailValue || !passwordValue || (mode === "signup" && !nameValue)) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(emailValue)) {
      toast.error("Enter a valid email address");
      return;
    }
    if (passwordValue.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      localStorage.setItem(
        "sl_user",
        JSON.stringify({ name: nameValue || emailValue.split("@")[0], email: emailValue }),
      );
    } catch {
      /* storage unavailable — continue anyway */
    }
    toast.success(mode === "signin" ? "Welcome back!" : "Account created — welcome aboard!");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="bg-mesh flex min-h-screen items-center justify-center px-4 py-16 font-sans text-foreground">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-bold text-primary">STARTIFY</span>
        </Link>

        <div className="rounded-lg border bg-card p-8 shadow-xl">
          <h1 className="font-display text-center text-2xl font-bold">
            {mode === "signin" ? "Welcome Back" : "Create Your Account"}
          </h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "Sign in to continue building" : "Start your startup journey today"}
          </p>

          <form className="mt-6 space-y-4" onSubmit={submit}>
            {mode === "signup" && (
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium">Full Name</label>
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Johnson"
                  className="h-11 w-full rounded-lg border bg-background px-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label>
              <input
                id="email"
                name="email"
                autoComplete="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-11 w-full rounded-lg border bg-background px-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium">Password</label>
              <input
                id="password"
                name="password"
                autoComplete="current-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 w-full rounded-lg border bg-background px-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
              />
            </div>
            <button type="submit" className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90">
              {mode === "signin" ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="font-semibold text-primary hover:underline"
            >
              {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>

        <Link to="/" className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
      </div>
    </div>
  );
}

import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Lightbulb, Rocket, Target, Users, X } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create Your Startup — STARTIFY" },
      { name: "description", content: "Share your startup idea with the community, define your stage, and start building your founding team." },
      { property: "og:title", content: "Create Your Startup — STARTIFY" },
      { property: "og:description", content: "Launch your idea, set your stage, and find the people who help you build it." },
    ],
  }),
  component: CreateStartupPage,
});

const CATEGORIES = ["Tech", "Health", "Education", "Sustainability", "Fintech", "Consumer", "Creator Economy", "Other"];
const STAGES = ["Idea", "Validation", "Prototype", "Beta", "Launch", "Scaling"];

export type StoredStartup = {
  name: string;
  category: string;
  description: string;
  stage: string;
  teamSize: string;
  website: string;
  lookingFor: string[];
  skills: string[];
  createdAt: string;
};

function CreateStartupPage() {
  const navigate = useNavigate();
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [roleInput, setRoleInput] = useState("");
  const [skillInput, setSkillInput] = useState("");

  const addTag = (
    value: string,
    list: string[],
    setList: (v: string[]) => void,
    clear: () => void,
  ) => {
    const v = value.trim();
    if (!v) return;
    if (list.includes(v)) {
      toast.message("Already added");
      return;
    }
    setList([...list, v]);
    clear();
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const startup: StoredStartup = {
      name: String(fd.get("name") ?? "").trim(),
      category: String(fd.get("category") ?? ""),
      description: String(fd.get("description") ?? "").trim(),
      stage: String(fd.get("stage") ?? ""),
      teamSize: String(fd.get("teamSize") ?? ""),
      website: String(fd.get("website") ?? ""),
      lookingFor,
      skills,
      createdAt: new Date().toISOString(),
    };

    if (!startup.name || !startup.category || !startup.description || !startup.stage) {
      toast.error("Fill in name, category, description and stage");
      return;
    }

    try {
      const raw = localStorage.getItem("sl_startups");
      const all = raw ? (JSON.parse(raw) as StoredStartup[]) : [];
      localStorage.setItem("sl_startups", JSON.stringify([startup, ...all]));
      localStorage.setItem("sl_active_startup", startup.name);
    } catch {
      /* ignore */
    }

    toast.success(`${startup.name} launched`, { description: "Track its milestones on the Progress page." });
    navigate({ to: "/progress" });
  };

  return (
    <div className="bg-mesh min-h-screen font-sans text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="mt-6 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-semibold text-primary">
            <Rocket className="h-3.5 w-3.5" /> Launch Your Idea
          </span>
          <h1 className="font-display mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Create Your <span className="text-gradient">Startup</span>
          </h1>
          <p className="mt-3 text-muted-foreground">
            Share your idea with the community and start building your team.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 rounded-lg border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="font-display flex items-center gap-2 text-xl font-bold">
            <Lightbulb className="h-5 w-5 text-primary" /> Startup Details
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label="Startup Name *">
              <input name="name" required placeholder="Enter your startup name" className={inputCls} />
            </Field>
            <Field label="Category *">
              <select name="category" required defaultValue="" className={inputCls}>
                <option value="" disabled>Select category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          </div>

          <div className="mt-5">
            <Field label="Description *">
              <textarea name="description" required rows={5} placeholder="Describe your startup idea..." className={inputCls} />
            </Field>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field label="Current Stage *">
              <select name="stage" required defaultValue="" className={inputCls}>
                <option value="" disabled>Select stage</option>
                {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Team Size">
              <input name="teamSize" placeholder="e.g., 2-3 people" className={inputCls} />
            </Field>
          </div>

          <div className="mt-5">
            <Field label="Website / Demo (Optional)">
              <input name="website" type="url" placeholder="https://yourwebsite.com" className={inputCls} />
            </Field>
          </div>

          <TagField
            icon={Target}
            label="Looking For"
            placeholder="e.g., Co-founder, Developer..."
            value={roleInput}
            onChange={setRoleInput}
            tags={lookingFor}
            onAdd={() => addTag(roleInput, lookingFor, setLookingFor, () => setRoleInput(""))}
            onRemove={(t) => setLookingFor(lookingFor.filter((x) => x !== t))}
          />

          <TagField
            icon={Users}
            label="Required Skills"
            placeholder="e.g., React, Design..."
            value={skillInput}
            onChange={setSkillInput}
            tags={skills}
            onAdd={() => addTag(skillInput, skills, setSkills, () => setSkillInput(""))}
            onRemove={(t) => setSkills(skills.filter((x) => x !== t))}
          />

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => navigate({ to: "/dashboard" })}
              className="rounded-lg border px-4 py-3 text-sm font-semibold hover:bg-accent"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02]"
            >
              <Rocket className="h-4 w-4" /> Launch Startup
            </button>
          </div>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

function TagField({
  icon: Icon,
  label,
  placeholder,
  value,
  onChange,
  tags,
  onAdd,
  onRemove,
}: {
  icon: React.ElementType;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  tags: string[];
  onAdd: () => void;
  onRemove: (t: string) => void;
}) {
  return (
    <div className="mt-5">
      <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
        <Icon className="h-4 w-4 text-primary" /> {label}
      </span>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd();
            }
          }}
          placeholder={placeholder}
          className={inputCls}
        />
        <button type="button" onClick={onAdd} className="shrink-0 rounded-lg border px-4 text-sm font-semibold hover:bg-accent">
          Add
        </button>
      </div>
      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onRemove(t)}
              className="inline-flex items-center gap-1 rounded-full border bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground hover:bg-accent"
            >
              {t} <X className="h-3 w-3" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Upload, Play, FileText, Image as ImageIcon, Video, Tv, Heart, Star, MessageCircle, Trophy } from "lucide-react";
import { SiteHeader, SiteFooter, useStoredUser } from "@/components/site-chrome";
import { toast } from "sonner";

export const Route = createFileRoute("/startup-tv")({
  head: () => ({
    meta: [
      { title: "StartupTV — Pitch Hub for Young Founders" },
      { name: "description", content: "Watch, rate and comment on startup pitches. Upload your own pitch video, deck or images and get investor-style feedback from the community." },
      { property: "og:title", content: "StartupTV — Pitch Hub for Young Founders" },
      { property: "og:description", content: "Watch, rate and comment on startup pitches and get investor-style feedback." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StartupTVPage,
});

type Comment = { author: string; text: string };
type Pitch = {
  id: string;
  title: string;
  founder: string;
  description: string;
  videoName: string;
  videoUrl?: string | undefined;
  likes: number;
  liked: boolean;
  ratings: number[];
  comments: Comment[];
};

const SEED: Pitch[] = [
  {
    id: "p1",
    title: "EcoTrack — carbon habits that stick",
    founder: "Maya Chen",
    description: "A 60-second pitch on how we turn daily habits into measurable carbon savings for Gen-Z users.",
    videoName: "ecotrack-pitch.mp4",
    likes: 128,
    liked: false,
    ratings: [5, 4, 5, 4],
    comments: [{ author: "Arjun", text: "Strong problem framing. Show retention numbers next time." }],
  },
  {
    id: "p2",
    title: "SkillSwap — learn by trading skills",
    founder: "Diego Ruiz",
    description: "Peer-to-peer skill exchange marketplace. 2,400 swaps in the first beta month.",
    videoName: "skillswap-demo.mp4",
    likes: 94,
    liked: false,
    ratings: [4, 4, 5],
    comments: [],
  },
  {
    id: "p3",
    title: "MediMind — clinic queues, solved",
    founder: "Priya Nair",
    description: "Smart queueing for small clinics. Cut average wait time by 38% in pilot.",
    videoName: "medimind.mp4",
    likes: 61,
    liked: false,
    ratings: [4, 3, 5],
    comments: [],
  },
];

const avg = (r: number[]) => (r.length ? r.reduce((a, b) => a + b, 0) / r.length : 0);

function UploadBox({
  icon: Icon,
  label,
  hint,
  accept,
  multiple,
  fileName,
  onFiles,
}: {
  icon: typeof Video;
  label: string;
  hint: string;
  accept: string;
  multiple?: boolean;
  fileName: string;
  onFiles: (name: string, url?: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          const files = e.target.files;
          if (!files?.length) return;
          const first = files[0]!;
          const name = files.length > 1 ? `${files.length} files selected` : first.name;
          onFiles(name, first.type.startsWith("video/") ? URL.createObjectURL(first) : undefined);
          toast.success(`${label} added`, { description: name });
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed bg-background px-4 py-8 text-center transition-colors hover:border-primary hover:bg-accent ${fileName ? "border-primary" : ""}`}
      >
        <Icon className="h-7 w-7 text-primary" />
        <span className="text-sm font-semibold">{label}</span>
        <span className="text-xs text-muted-foreground">{fileName || hint}</span>
      </button>
    </>
  );
}

function StartupTVPage() {
  const user = useStoredUser();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [docs, setDocs] = useState("");
  const [images, setImages] = useState("");
  const [pitches, setPitches] = useState<Pitch[]>(SEED);
  const [currentId, setCurrentId] = useState<string>(SEED[0]!.id);
  const [comment, setComment] = useState("");
  const [tab, setTab] = useState<"latest" | "top">("latest");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sl_pitches");
      if (raw) {
        const saved = JSON.parse(raw) as Pitch[];
        if (saved.length) {
          setPitches(saved);
          setCurrentId(saved[0]!.id);
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  const save = (next: Pitch[]) => {
    setPitches(next);
    try {
      localStorage.setItem("sl_pitches", JSON.stringify(next.map((p) => ({ ...p, videoUrl: undefined }))));
    } catch {
      /* ignore */
    }
  };

  const current = pitches.find((p) => p.id === currentId) ?? pitches[0] ?? null;
  const ordered = useMemo(
    () => (tab === "top" ? [...pitches].sort((a, b) => avg(b.ratings) - avg(a.ratings) || b.likes - a.likes) : pitches),
    [pitches, tab],
  );
  const featured = useMemo(
    () => [...pitches].sort((a, b) => b.likes + avg(b.ratings) * 10 - (a.likes + avg(a.ratings) * 10))[0] ?? null,
    [pitches],
  );

  const upload = () => {
    if (!title.trim()) {
      toast.error("Add a pitch title first");
      return;
    }
    const pitch: Pitch = {
      id: `p${Date.now()}`,
      title: title.trim(),
      founder: user?.name ?? "You",
      description: description.trim(),
      videoName: video,
      videoUrl,
      likes: 0,
      liked: false,
      ratings: [],
      comments: [],
    };
    save([pitch, ...pitches]);
    setCurrentId(pitch.id);
    setTitle("");
    setDescription("");
    setVideo("");
    setVideoUrl(undefined);
    setDocs("");
    setImages("");
    toast.success("Pitch published!", { description: `${pitch.title} is now live on StartupTV.` });
  };

  const toggleLike = (id: string) =>
    save(pitches.map((p) => (p.id === id ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p)));

  const rate = (id: string, score: number) => {
    save(pitches.map((p) => (p.id === id ? { ...p, ratings: [...p.ratings, score] } : p)));
    toast.success(`Rated ${score}/5`, { description: "Thanks for the investor-style feedback." });
  };

  const addComment = () => {
    if (!current || !comment.trim()) return;
    save(
      pitches.map((p) =>
        p.id === current.id ? { ...p, comments: [...p.comments, { author: user?.name ?? "You", text: comment.trim() }] } : p,
      ),
    );
    setComment("");
    toast.success("Feedback posted");
  };

  return (
    <div className="bg-mesh min-h-screen font-sans text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-brand-purple to-brand-pink text-primary-foreground">
            <Tv className="h-6 w-6" />
          </span>
          <div>
            <h1 className="font-display text-4xl font-extrabold tracking-tight">
              Startup<span className="text-gradient">TV</span>
            </h1>
            <p className="text-sm text-muted-foreground">Pitch, watch, rate — get real feedback from founders</p>
          </div>
        </div>

        {featured && (
          <button
            onClick={() => setCurrentId(featured.id)}
            className="mt-8 flex w-full items-center gap-4 rounded-xl border border-primary/40 bg-card p-5 text-left shadow-sm transition-colors hover:bg-accent"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Trophy className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-bold uppercase tracking-wide text-primary">Pitch of the week</span>
              <span className="block truncate font-display text-lg font-bold">{featured.title}</span>
              <span className="block text-sm text-muted-foreground">
                {featured.founder} · {featured.likes} likes · {avg(featured.ratings).toFixed(1)}/5
              </span>
            </span>
          </button>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-5">
          {/* Upload */}
          <div className="rounded-lg border bg-card p-6 shadow-sm lg:col-span-2">
            <h2 className="font-display text-lg font-bold">Upload Your Startup Pitch</h2>
            <div className="mt-5 space-y-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Pitch title"
                className="h-11 w-full rounded-lg border bg-background px-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your startup in a few sentences..."
                rows={3}
                className="w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
              />
              <UploadBox
                icon={Video}
                label="Pitch Video"
                hint="Click to upload — MP4 up to 500MB"
                accept="video/*"
                fileName={video}
                onFiles={(name, url) => {
                  setVideo(name);
                  setVideoUrl(url);
                }}
              />
              <div className="grid grid-cols-2 gap-3">
                <UploadBox icon={FileText} label="Documents" hint="Click to upload" accept=".pdf,.doc,.docx,.ppt,.pptx" multiple fileName={docs} onFiles={setDocs} />
                <UploadBox icon={ImageIcon} label="Images" hint="Click to upload" accept="image/*" multiple fileName={images} onFiles={setImages} />
              </div>
              <button onClick={upload} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                <Upload className="h-4 w-4" /> Publish Pitch
              </button>
            </div>
          </div>

          {/* Player */}
          <div className="rounded-lg border bg-card p-6 shadow-sm lg:col-span-3">
            {current?.videoUrl ? (
              <video src={current.videoUrl} controls className="aspect-video w-full rounded-xl bg-black" />
            ) : (
              <div className="flex aspect-video flex-col items-center justify-center gap-3 rounded-xl bg-secondary text-muted-foreground">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-card shadow-md">
                  <Play className="h-7 w-7 text-primary" />
                </span>
                {current ? (
                  <div className="px-6 text-center">
                    <p className="font-display text-base font-bold text-foreground">{current.title}</p>
                    {current.description && <p className="mt-1 text-sm">{current.description}</p>}
                    {current.videoName && <p className="mt-1 text-xs">{current.videoName}</p>}
                  </div>
                ) : (
                  <p className="text-sm font-medium">Select a pitch to watch</p>
                )}
              </div>
            )}

            {current && (
              <>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => toggleLike(current.id)}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold hover:bg-accent ${current.liked ? "border-primary text-primary" : ""}`}
                  >
                    <Heart className={`h-4 w-4 ${current.liked ? "fill-current" : ""}`} /> {current.likes}
                  </button>
                  <div className="inline-flex items-center gap-1 rounded-lg border px-2 py-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} aria-label={`Rate ${s}`} onClick={() => rate(current.id, s)} className="p-0.5 text-primary hover:scale-110">
                        <Star className={`h-4 w-4 ${avg(current.ratings) >= s ? "fill-current" : ""}`} />
                      </button>
                    ))}
                    <span className="ml-1 text-xs text-muted-foreground">
                      {avg(current.ratings).toFixed(1)} ({current.ratings.length})
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MessageCircle className="h-4 w-4" /> {current.comments.length} feedback
                  </span>
                </div>

                <div className="mt-5 rounded-xl border p-4">
                  <h3 className="font-display text-sm font-bold">Founder feedback</h3>
                  <ul className="mt-3 space-y-2">
                    {current.comments.length === 0 && <li className="text-sm text-muted-foreground">No feedback yet — be the first.</li>}
                    {current.comments.map((c, i) => (
                      <li key={i} className="rounded-lg bg-secondary px-3 py-2 text-sm">
                        <span className="font-semibold">{c.author}: </span>
                        {c.text}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex gap-2">
                    <input
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addComment()}
                      placeholder="Give constructive feedback..."
                      className="h-10 flex-1 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                    <button onClick={addComment} className="rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                      Post
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="mt-6 flex items-center gap-2">
              <h3 className="font-display text-sm font-bold">All Pitches</h3>
              <div className="ml-auto flex gap-1 rounded-lg border p-0.5 text-xs font-semibold">
                {(["latest", "top"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`rounded-md px-2.5 py-1 capitalize ${tab === t ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
                  >
                    {t === "top" ? "Top rated" : "Latest"}
                  </button>
                ))}
              </div>
            </div>
            <ul className="mt-3 space-y-2">
              {ordered.map((p) => (
                <li key={p.id}>
                  <button
                    onClick={() => setCurrentId(p.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left hover:bg-accent ${current?.id === p.id ? "border-primary" : ""}`}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                      <Play className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{p.title}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {p.founder}
                        {p.description ? ` · ${p.description}` : ""}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      ♥ {p.likes} · ★ {avg(p.ratings).toFixed(1)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
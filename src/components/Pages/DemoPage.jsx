import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  PlayCircle,
  Users,
  GraduationCap,
  TrendingUp,
} from "lucide-react";
import Button from "../ui/Button";
import ThemeToggle from "../ui/ThemeToggle";

const VIDEO_ID = "8mAITcNt710";
const FEATURES = [
  {
    Icon: Users,
    title: "Live mentor sessions",
    text: "Join weekly mentor-led sessions, get your code reviewed on a real PR, and unblock 1-on-1.",
  },
  {
    Icon: GraduationCap,
    title: "Hands-on projects",
    text: "Every track ships with a capstone you can put on your portfolio and show in interviews.",
  },
  {
    Icon: TrendingUp,
    title: "Career growth",
    text: "Mock interviews, resume review, and warm intros to companies hiring our graduates.",
  },
];

export default function DemoPage() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="relative min-h-screen overflow-hidden bg-bg text-text">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 blueprint-grid opacity-50"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-primary-soft blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-10%] right-[-10%] -z-10 h-[460px] w-[460px] rounded-full bg-accent-soft blur-[140px]"
      />

      <div className="absolute right-5 top-5 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1280px] flex-col items-center justify-start px-6 py-20">
        <Link
          to="/"
          className="mb-10 inline-flex items-center gap-2 self-start rounded-lg border border-border bg-surface px-4 py-2 text-[13px] font-medium text-muted transition hover:border-primary hover:text-primary"
        >
          <ArrowLeft size={14} />
          Back to home
        </Link>

        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-4 py-1.5 text-[12px] font-semibold text-primary">
          <PlayCircle size={14} />
          Interactive product demo
        </span>

        <h1 className="mt-6 max-w-[800px] text-center font-display text-[32px] font-bold leading-tight tracking-[-0.02em] text-text md:text-[52px]">
          Experience learning like{" "}
          <span className="gradient-text">never before</span>
        </h1>
        <p className="mt-4 max-w-[640px] text-center text-[15px] leading-7 text-muted md:text-[17px]">
          A 90-second walkthrough of the Cloud Nexus learner workspace &mdash;
          mentors, modules, and live sessions in one place.
        </p>

        <div className="mt-10 w-full max-w-[1080px]">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-elevated p-3 shadow-[var(--shadow-elevated)]">
            <div className="relative overflow-hidden rounded-xl bg-bg">
              {playing ? (
                <iframe
                  className="aspect-video w-full"
                  src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1`}
                  title="Cloud Nexus product demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  aria-label="Play demo video"
                  className="group relative block aspect-video w-full overflow-hidden"
                >
                  <img
                    src={`https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`}
                    alt="Cloud Nexus product demo thumbnail"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
                  />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-bg shadow-2xl transition group-hover:scale-110 md:h-20 md:w-20">
                      <PlayCircle size={36} />
                    </span>
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 grid w-full max-w-[1080px] gap-5 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border bg-elevated p-6 shadow-[var(--shadow-card)] transition hover:border-primary/40"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <f.Icon size={18} />
              </span>
              <h3 className="mt-4 text-[16px] font-semibold text-text">
                {f.title}
              </h3>
              <p className="mt-2 text-[13px] leading-6 text-muted">{f.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-3">
          <Button to="/signup" size="lg">
            Start your free trial
          </Button>
          <p className="text-[12px] text-subtle">
            7 days free &middot; no credit card &middot; cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}

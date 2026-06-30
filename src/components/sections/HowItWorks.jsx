import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Compass, Users, Award, Check } from "lucide-react";
import { howItWorksSteps as mockSteps } from '@/data/howItWorks';
import { fetchHowItWorks } from '@/lib/api/catalogApi';
import SectionShell from "@/app/layouts/SectionShell";
import SectionHeading from "@/app/layouts/SectionHeading";
import Container from '@/components/ui/Container';

const ICONS = { Compass, Users, Award };

const FALLBACK_DURATION_MS = 9000;

const VIDEO_SRC = "/videos/how-it-works.mp4";

function StepRow({ step, index, isActive, isCompleted, circleRef }) {
  const Icon = ICONS[step.icon];

  return (
    <motion.li
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex gap-5 pb-8 last:pb-0"
    >
      <div className="relative z-20 shrink-0">
        <div
          ref={circleRef}
          className={`relative flex h-14 w-14 items-center justify-center rounded-lg border-2 transition-all duration-500 ${
            isActive
              ? "scale-110 border-primary bg-primary text-white shadow-[0_0_30px_var(--primary-soft)]"
              : isCompleted
                ? "border-primary/60 bg-primary-soft text-primary"
                : "border-border bg-elevated text-muted"
          }`}
        >
          {isCompleted && !isActive ? (
            <Check size={22} strokeWidth={2.5} />
          ) : Icon ? (
            <Icon size={22} />
          ) : null}

          {isActive ? (
            <span
              aria-hidden
              className="absolute inset-0 rounded-lg border-2 border-primary opacity-70"
              style={{ animation: "ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite" }}
            />
          ) : null}
        </div>
      </div>

      <div
        className={`relative flex-1 rounded-lg border bg-elevated p-5 transition-all duration-500 ${
          isActive
            ? "-translate-y-0.5 border-primary/40 shadow-[var(--shadow-elevated)]"
            : "border-border"
        }`}
      >
        {isActive ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[2px] rounded-t-lg bg-gradient-to-r from-transparent via-primary to-transparent opacity-80"
          />
        ) : null}

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
            Step {step.step}
          </span>
          {isActive ? (
            <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          ) : null}
        </div>

        <h3
          className={`mt-2 font-display text-[19px] font-bold leading-tight tracking-[-0.01em] transition-colors duration-500 ${
            isActive ? "text-text" : "text-text/85"
          }`}
        >
          {step.title}
        </h3>

        <p className="mt-2 text-[14px] leading-7 text-muted">
          {step.description}
        </p>
      </div>
    </motion.li>
  );
}

function VideoPlaceholder() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-soft via-elevated to-accent-soft"
    >
      <div className="absolute inset-0 blueprint-grid opacity-40" />
      <div className="float-1 absolute -left-12 -top-12 h-44 w-44 rounded-full bg-primary/25 blur-3xl" />
      <div className="float-2 absolute -right-10 -bottom-10 h-44 w-44 rounded-full bg-accent/25 blur-3xl" />

      <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-lg border border-border bg-elevated/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted backdrop-blur-md">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
        Demo Walkthrough
      </div>

      <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-primary/30 bg-elevated/80 shadow-[0_0_50px_var(--primary-soft)] backdrop-blur-md">
        <span className="ml-1 inline-block h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-primary" />
      </div>

      <div className="absolute bottom-4 right-4 text-[11px] font-mono text-muted">
        9s &middot; loop
      </div>
    </div>
  );
}

function VideoFrame({ src, videoRef, onReady }) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <>
      {(!ready || failed) && <VideoPlaceholder />}

      {src && !failed ? (
        <video
          ref={videoRef}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="How it works walkthrough"
          onLoadedData={() => {
            setReady(true);
            onReady?.();
          }}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : null}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
      />
    </>
  );
}

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const olRef = useRef(null);
  const stepCircleRefs = useRef([]);
  const startRef = useRef(0);
  const rafRef = useRef(null);

  const [activeStep, setActiveStep] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [howItWorksSteps, setHowItWorksSteps] = useState(mockSteps);
  // Measured pixel Y centres of each step circle, relative to the <ol>.
  const [stepCentres, setStepCentres] = useState([]);

  useEffect(() => {
    fetchHowItWorks()
      .then((data) => { if (data?.length) setHowItWorksSteps(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const measure = () => {
      const ol = olRef.current;
      if (!ol) return;
      const olRect = ol.getBoundingClientRect();
      const positions = stepCircleRefs.current.map((el) => {
        if (!el) return 0;
        const r = el.getBoundingClientRect();
        return r.top + r.height / 2 - olRect.top;
      });
      setStepCentres((prev) => {
        if (
          prev.length === positions.length &&
          prev.every((v, i) => Math.abs(v - positions[i]) < 0.5)
        ) {
          return prev;
        }
        return positions;
      });
    };

    measure();

    const ro = new ResizeObserver(measure);
    if (olRef.current) ro.observe(olRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    if (!isInView) {
      cancelAnimationFrame(rafRef.current);
      const v = videoRef.current;
      if (v && !v.paused) v.pause();
      return;
    }

    const v = videoRef.current;
    if (v?.paused) v.play().catch(() => {});

    startRef.current = performance.now();

    const tick = (now) => {
      const vid = videoRef.current;
      let frac;

      if (
        vid &&
        !vid.paused &&
        Number.isFinite(vid.duration) &&
        vid.duration > 0
      ) {
        frac = vid.currentTime / vid.duration;
      } else {
        frac =
          ((now - startRef.current) % FALLBACK_DURATION_MS) /
          FALLBACK_DURATION_MS;
      }

      const clamped = Math.max(0, Math.min(0.99999, frac));
      const next = Math.floor(clamped * howItWorksSteps.length);

      setActiveStep((prev) => (prev !== next ? next : prev));
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [isInView]);

  const measured = stepCentres.length === howItWorksSteps.length;
  const firstY = measured ? stepCentres[0] : 28;
  const lastY = measured ? stepCentres[stepCentres.length - 1] : 28;
  const dotY = measured ? stepCentres[activeStep] : firstY;
  const filledHeight = Math.max(0, dotY - firstY);
  const totalLineHeight = Math.max(0, lastY - firstY);
  const trackTransition = "all 700ms cubic-bezier(0.16, 1, 0.3, 1)";

  return (
    <SectionShell id="how-it-works" pattern glow>
      <Container>
        <SectionHeading
          align="center"
          eyebrow="How it works"
          title="From signup to certificate"
          highlight="in 3 simple steps"
          description="A clear, mentor-guided path to a real, verifiable outcome."
        />

        <div
          ref={sectionRef}
          className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-14"
        >
          <div className="relative order-2 lg:order-1">
            <div
              aria-hidden
              className="pointer-events-none absolute left-7 w-[2px] rounded-full bg-border"
              style={{
                top: `${firstY}px`,
                height: `${totalLineHeight}px`,
                visibility: measured ? "visible" : "hidden",
              }}
            />

            <div
              aria-hidden
              className="pointer-events-none absolute left-7 w-[2px] rounded-full bg-primary shadow-[0_0_12px_var(--primary)]"
              style={{
                top: `${firstY}px`,
                height: `${filledHeight}px`,
                visibility: measured ? "visible" : "hidden",
                transition: trackTransition,
              }}
            />

            <div
              aria-hidden
              className="pointer-events-none absolute left-7 z-10"
              style={{
                top: `${dotY}px`,
                visibility: measured ? "visible" : "hidden",
                transition: trackTransition,
              }}
            >
              <span className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_18px_var(--primary)]" />
              <span className="absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-primary/40" />
            </div>

            <ol ref={olRef} className="relative">
              {howItWorksSteps.map((step, i) => (
                <StepRow
                  key={step.step}
                  step={step}
                  index={i}
                  isActive={i === activeStep}
                  isCompleted={i < activeStep}
                  circleRef={(el) => {
                    stepCircleRefs.current[i] = el;
                  }}
                />
              ))}
            </ol>
          </div>

          <div className="relative order-1 lg:order-2">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-6 -z-10 rounded-lg bg-gradient-to-br from-primary/20 via-transparent to-accent/15 blur-2xl"
            />

            {/* TV bezel */}
            <div className="relative rounded-lg bg-gradient-to-b from-[#1c2235] to-[#0a0e1c] p-2 shadow-[0_25px_50px_-12px_rgba(11,16,32,0.45)] md:p-3">
              {/* Inner chrome ring */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-1 rounded-lg ring-1 ring-inset ring-white/[0.05] md:inset-1.5"
              />

              {/* Webcam dot (top center of bezel) */}
              <div
                aria-hidden
                className="absolute left-1/2 top-1.5 z-10 -translate-x-1/2"
              >
                <span className="block h-1 w-1 rounded-full bg-white/35 ring-2 ring-white/[0.06]" />
              </div>

              {/* Screen */}
              <div className="relative aspect-video overflow-hidden rounded-lg bg-elevated">
                <VideoFrame src={VIDEO_SRC} videoRef={videoRef} />

                {/* Subtle screen glare */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5"
                />
              </div>

              {/* Bottom bezel — power LED + tiny brand mark */}
              <div className="absolute bottom-1 right-3 flex items-center gap-1.5 md:bottom-1.5">
                <span className="text-[7px] font-bold uppercase tracking-[0.18em] text-white/30">
                  Live
                </span>
                <span className="relative flex h-1 w-1">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex h-1 w-1 rounded-full bg-success shadow-[0_0_4px_var(--success)]" />
                </span>
              </div>
            </div>

            {/* TV stand — neck + base pedestal */}
            <div
              aria-hidden
              className="relative mx-auto flex flex-col items-center"
            >
              <div
                className="h-2.5 w-10 bg-gradient-to-b from-[#1c2235] to-[#10162a]"
                style={{ clipPath: "polygon(20% 0, 80% 0, 100% 100%, 0 100%)" }}
              />
              <div className="h-1.5 w-24 rounded-b-[5px] bg-gradient-to-b from-[#10162a] to-[#0a0e1c] shadow-[0_8px_18px_-6px_rgba(11,16,32,0.35)]" />
            </div>
          </div>
        </div>
      </Container>
    </SectionShell>
  );
}

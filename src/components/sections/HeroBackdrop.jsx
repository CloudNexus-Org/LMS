import { useId, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

export default function HeroBackdrop({
  id,
  imageSrc,
  children,
  className = "",
  imageLayerClassName,
  position = "center center",
  positions,
  fits,
}) {
  const uid = id || useId();
  const safeUid = String(uid).replace(/[^a-zA-Z0-9_-]/g, "-");

  const mobilePos = (positions && positions.mobile) || position;
  const tabletPos = (positions && positions.tablet) || position;
  const desktopPos = (positions && positions.desktop) || position;
  const mobileFit = (fits && fits.mobile) || "cover";
  const tabletFit = (fits && fits.tablet) || "cover";
  const desktopFit = (fits && fits.desktop) || "cover";

  const css = `
    section[data-hero-uid="${safeUid}"] img.hero-bg-img {
      object-fit: ${mobileFit} !important;
      object-position: ${mobilePos} !important;
    }
    @media (min-width: 768px) {
      section[data-hero-uid="${safeUid}"] img.hero-bg-img {
        object-fit: ${tabletFit} !important;
        object-position: ${tabletPos} !important;
      }
    }
    @media (min-width: 1024px) {
      section[data-hero-uid="${safeUid}"] img.hero-bg-img {
        object-fit: ${desktopFit} !important;
        object-position: ${desktopPos} !important;
      }
    }
  `;

  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  const contentY = useTransform(scrollY, [0, 800], [0, 120]);
  const contentOpacity = useTransform(scrollY, [0, 800], [1, 0.85]);
  const overlayY = useTransform(scrollY, [0, 800], [0, 50]);

  return (
    <section
      id={id}
      ref={ref}
      data-hero-uid={safeUid}
      className={`relative isolate overflow-hidden bg-bg ${className}`}
    >
      <style>{css}</style>

      <div
        className={
          imageLayerClassName ||
          "pointer-events-none absolute inset-0 -z-10"
        }
        style={{ clipPath: "inset(0)" }}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt=""
            className="hero-bg-img absolute inset-0 h-full w-full object-cover opacity-35 transition-opacity duration-300 dark:opacity-25"
            aria-hidden
          />
        ) : null}
      </div>

      {!shouldReduceMotion ? (
        <motion.div
          style={{ y: overlayY }}
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-bg via-transparent to-bg/20"
          aria-hidden
        />
      ) : (
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-bg to-bg/15"
          aria-hidden
        />
      )}

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 -z-10 bg-gradient-to-t from-bg to-transparent"
        aria-hidden
      />

      {!shouldReduceMotion ? (
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative z-10"
        >
          {children}
        </motion.div>
      ) : (
        <div className="relative z-10">{children}</div>
      )}
    </section>
  );
}

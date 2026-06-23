import { useId, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import useIsDarkTheme from "../../hooks/useIsDarkTheme";

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
  const isDarkTheme = useIsDarkTheme();
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
      className={`relative overflow-hidden isolate bg-bg ${className}`}
    >
      <style>{css}</style>

      {/* Full-bleed background — extends behind navbar */}
      <div
        className={
          imageLayerClassName ||
          "absolute inset-0 -z-10 pointer-events-none"
        }
      >
        {isDarkTheme ? (
          <>
            {/* Same stack as rest of page: solid base + bg token */}
            <div className="absolute inset-0 bg-[var(--bg-solid,#171717)]" aria-hidden />

            <img
              src={imageSrc}
              alt=""
              className="hero-bg-img absolute inset-0 h-full w-full object-cover opacity-[0.14]"
              aria-hidden
            />

            <div className="absolute inset-0 bg-bg" aria-hidden />

            {/* Texture only in upper hero — bottom stays flat for seamless join */}
            <div
              className="absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-primary/[0.04] to-transparent"
              aria-hidden
            />
            <div
              className="absolute -left-32 top-[5%] h-72 w-72 rounded-full bg-primary/[0.05] blur-[120px]"
              aria-hidden
            />
          </>
        ) : (
          <>
            <img
              src={imageSrc}
              alt=""
              className="hero-bg-img absolute inset-0 h-full w-full object-cover transition-[filter,opacity] duration-300"
              aria-hidden
            />
            <div
              className="absolute inset-0 bg-gradient-to-b from-[var(--hero-base)]/30 via-transparent to-bg/10"
              aria-hidden
            />
          </>
        )}
      </div>

      {!shouldReduceMotion ? (
        <motion.div
          style={{ y: overlayY }}
          className={`absolute inset-0 pointer-events-none -z-10 ${
            isDarkTheme
              ? ""
              : "bg-gradient-to-b from-transparent via-transparent to-bg/12"
          }`}
          aria-hidden
        />
      ) : (
        <div
          className={`absolute inset-0 pointer-events-none -z-10 ${
            isDarkTheme ? "" : "bg-gradient-to-b from-transparent to-bg/10"
          }`}
          aria-hidden
        />
      )}

      {!isDarkTheme && (
        <div
          className="absolute inset-x-0 bottom-0 h-20 -z-10 pointer-events-none bg-gradient-to-t from-bg to-transparent"
          aria-hidden
        />
      )}

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

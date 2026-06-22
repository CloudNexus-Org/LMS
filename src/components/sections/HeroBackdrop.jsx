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
    ${
      isDarkTheme
        ? `
    section[data-hero-uid="${safeUid}"] img.hero-bg-img {
      filter: brightness(0.62) saturate(1.05) contrast(1.02) !important;
    }
    `
        : ""
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
      className={`relative overflow-hidden isolate bg-[var(--hero-base)] ${className}`}
    >
      <style>{css}</style>

      {/* Full-bleed background — extends behind navbar */}
      <div
        className={
          imageLayerClassName ||
          "absolute inset-0 -z-10 pointer-events-none"
        }
      >
        <img
          src={imageSrc}
          alt=""
          className="hero-bg-img absolute inset-0 h-full w-full object-cover transition-[filter,opacity] duration-300"
          aria-hidden
        />

        {isDarkTheme ? (
          <>
            {/* Dark veil — texture faintly visible */}
            <div
              className="absolute inset-0 bg-[var(--hero-base)]/62"
              aria-hidden
            />
            <div
              className="absolute inset-0 bg-gradient-to-b from-[var(--hero-base)]/35 via-[var(--hero-base)]/10 to-[var(--hero-base)]/45"
              aria-hidden
            />
            <div
              className="absolute inset-0 bg-gradient-to-br from-primary/[0.025] via-transparent to-[#1a2a4a]/[0.04]"
              aria-hidden
            />

            {/* Faint purple/blue ambient blobs */}
            <div
              className="absolute -left-36 bottom-[-10%] h-[460px] w-[460px] rounded-full bg-[#3d2a6b]/16 blur-[130px]"
              aria-hidden
            />
            <div
              className="absolute -right-28 bottom-[-6%] h-[400px] w-[400px] rounded-full bg-primary/10 blur-[115px]"
              aria-hidden
            />
            <div
              className="absolute right-[8%] top-[18%] h-[280px] w-[280px] rounded-full bg-[#1e3a6e]/8 blur-[100px]"
              aria-hidden
            />
          </>
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-b from-[var(--hero-base)]/30 via-transparent to-bg/10"
            aria-hidden
          />
        )}
      </div>

      {!shouldReduceMotion ? (
        <motion.div
          style={{ y: overlayY }}
          className="absolute inset-0 pointer-events-none -z-10 bg-gradient-to-b from-transparent via-transparent to-bg/12"
          aria-hidden
        />
      ) : (
        <div
          className="absolute inset-0 pointer-events-none -z-10 bg-gradient-to-b from-transparent to-bg/10"
          aria-hidden
        />
      )}

      <div
        className="absolute inset-x-0 bottom-0 h-20 -z-10 pointer-events-none bg-gradient-to-t from-bg to-transparent"
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

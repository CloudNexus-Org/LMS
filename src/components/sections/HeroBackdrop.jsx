import  { useId, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

export default function HeroBackdrop({
  id,
  imageSrc,
  children,
  className = "",
  imageLayerClassName,
  // Set default position to center 15% to move the image downward
  position = "center 15%",
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

  // Parallax setup
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  // Premium, stable parallax: smooth 150px movement
  const imageY = useTransform(scrollY, [0, 1000], [0, 150]);

  // Content Parallax transformations (applied to content layer only, NOT the image)
  const contentY = useTransform(scrollY, [0, 800], [0, 120]);
  const contentOpacity = useTransform(scrollY, [0, 800], [1, 0.85]);

  // Subtle atmospheric overlay motion
  const overlayY = useTransform(scrollY, [0, 800], [0, 50]);

  return (
    <section
      id={id}
      ref={ref}
      data-hero-uid={safeUid}
      className={`relative overflow-hidden isolate ${className}`}
    >
      <style>{css}</style>

      {/* fixed visual image - remains completely stationary relative to viewport, clipped strictly to parent */}
      <div
        className={
          imageLayerClassName ||
          "absolute inset-x-0 top-[58px] bottom-0 -z-10 pointer-events-none"
        }
        style={{ clipPath: "inset(0)" }}
      >
        <img
          src={imageSrc}
          alt=""
          className="hero-bg-img absolute inset-0 w-full h-full object-cover transition-colors duration-300"
          aria-hidden
        />
      </div>

      {/* animated overlays/gradients */}
      {!shouldReduceMotion ? (
        <motion.div
          style={{ y: overlayY }}
          className="absolute inset-0 pointer-events-none -z-10 bg-gradient-to-b from-transparent via-bg/5 to-bg/20"
          aria-hidden
        />
      ) : (
        <div className="absolute inset-0 pointer-events-none -z-10 bg-transparent" aria-hidden />
      )}

      {/* Hero content - receives parallax depth motion */}
      {!shouldReduceMotion ? (
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative z-10"
        >
          {children}
        </motion.div>
      ) : (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </section>
  );
}

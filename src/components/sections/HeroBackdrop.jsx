import React, { useId, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, useMotionValueEvent } from "framer-motion";

export default function HeroBackdrop({
  id,
  imageSrc,
  children,
  className = "",
  // Set default position to center 15% to move the image downward
  position = "center 15%",
  positions,
}) {
  const uid = id || useId();
  const safeUid = String(uid).replace(/[^a-zA-Z0-9_-]/g, "-");

  const mobilePos = (positions && positions.mobile) || position;
  const tabletPos = (positions && positions.tablet) || position;
  const desktopPos = (positions && positions.desktop) || position;

  const css = `
    section[data-hero-uid="${safeUid}"] img.hero-bg-img { object-position: ${mobilePos} !important; }
    @media (min-width: 768px) { section[data-hero-uid="${safeUid}"] img.hero-bg-img { object-position: ${tabletPos} !important; } }
    @media (min-width: 1024px) { section[data-hero-uid="${safeUid}"] img.hero-bg-img { object-position: ${desktopPos} !important; } }
  `;

  // Parallax setup
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  // Premium, stable parallax: smooth 150px movement
  const imageY = useTransform(scrollY, [0, 1000], [0, 150]);

  return (
    <section id={id} ref={ref} data-hero-uid={safeUid} className="relative isolate overflow-hidden">
      <style>{css}</style>

      <div aria-hidden className={`absolute inset-x-0 bottom-0 top-[68px] -z-10 overflow-hidden bg-bg ${className}`}>
        <motion.img
          src={imageSrc}
          alt=""
          aria-hidden
          className="hero-bg-img absolute inset-0 h-full w-full object-cover"
          style={{
            objectPosition: desktopPos,
            y: shouldReduceMotion ? 0 : imageY,
            willChange: "transform", // Hardware acceleration for buttery smooth stability
          }}
        />
      </div>

      {children}
    </section>
  );
}
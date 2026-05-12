import { useState } from "react";

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
}

const SIZES = {
  xs: "h-7 w-7 text-[10px]",
  sm: "h-9 w-9 text-[11px]",
  md: "h-11 w-11 text-[12px]",
  lg: "h-14 w-14 text-[14px]",
  xl: "h-16 w-16 text-[16px]",
};

const PALETTES = [
  "bg-primary-soft text-primary",
  "bg-accent-soft text-accent",
  "bg-success/10 text-success",
  "bg-warning/10 text-warning",
];

function paletteFor(name = "") {
  let h = 0;
  for (let i = 0; i < name.length; i += 1) h = (h + name.charCodeAt(i)) | 0;
  return PALETTES[Math.abs(h) % PALETTES.length];
}

export default function Avatar({
  src,
  name = "",
  size = "md",
  className = "",
  alt,
}) {
  const [errored, setErrored] = useState(false);
  const initials = getInitials(name);
  const palette = paletteFor(name);
  const sizeCls = SIZES[size] || SIZES.md;

  if (!src || errored) {
    return (
      <span
        aria-label={alt || name}
        role="img"
        className={`inline-flex items-center justify-center rounded-full border border-border font-semibold ${palette} ${sizeCls} ${className}`}
      >
        {initials || "?"}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt || name}
      loading="lazy"
      onError={() => setErrored(true)}
      className={`rounded-full border border-border object-cover ${sizeCls} ${className}`}
    />
  );
}

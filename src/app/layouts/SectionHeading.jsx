export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  highlight,
  className = "",
  children,
}) {
  const alignment = align === "left" ? "text-left items-start" : "text-center items-center mx-auto";
  const maxW = align === "left" ? "max-w-[640px]" : "max-w-[780px]";

  return (
    <div className={`mb-8 flex flex-col gap-3 md:mb-10 ${alignment} ${maxW} ${className}`}>
      {eyebrow ? (
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-primary-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
          {eyebrow}
        </span>
      ) : null}

      <h2 className="font-display text-[34px] font-bold leading-[1.1] tracking-[-0.02em] text-text md:text-[44px] lg:text-[48px]">
        {highlight ? (
          <>
            {title} <span className="gradient-text">{highlight}</span>
          </>
        ) : (
          title
        )}
      </h2>

      {description ? (
        <p className="max-w-[640px] text-[25px] leading-7 text-muted md:text-[20px]">
          {description}
        </p>
      ) : null}

      {children}
    </div>
  );
}

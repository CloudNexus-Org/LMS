export default function SectionShell({
  id,
  children,
  className = "",
  pattern = false,
  glow = false,
  size = "default",
  ...props
}) {
  const padding = {
    sm: "pt-4 pb-10 md:pt-5 md:pb-14",
    default: "pt-5 pb-12 md:pt-6 md:pb-16",
    lg: "pt-6 pb-16 md:pt-8 md:pb-20",
  }[size];

  return (
    <section
      id={id}
      className={`relative scroll-mt-[68px] overflow-hidden bg-transparent ${padding} ${className}`}
      {...props}
    >
      {pattern ? (
        <div className="pointer-events-none absolute inset-0 blueprint-grid opacity-60" aria-hidden />
      ) : null}

      {glow ? (
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]"
        />
      ) : null}

      <div className="relative z-10">{children}</div>
    </section>
  );
}

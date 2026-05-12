export default function Card({
  children,
  as: Comp = "div",
  hover = false,
  padded = true,
  elevated = false,
  className = "",
  ...props
}) {
  const base =
    "rounded-xl border border-border bg-elevated transition-all duration-300";
  const padding = padded ? "p-6 md:p-7" : "";
  const elevation = elevated ? "shadow-[var(--shadow-card)]" : "";
  const hoverCls = hover
    ? "hover:border-primary/40 hover:shadow-[var(--shadow-elevated)] hover:-translate-y-0.5"
    : "";

  return (
    <Comp className={`${base} ${padding} ${elevation} ${hoverCls} ${className}`} {...props}>
      {children}
    </Comp>
  );
}

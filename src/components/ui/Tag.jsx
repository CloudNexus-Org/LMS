export default function Tag({
  children,
  variant = "default",
  size = "md",
  icon,
  className = "",
}) {
  const variants = {
    default: "border-border bg-surface text-muted",
    primary: "border-primary/20 bg-primary-soft text-primary",
    accent: "border-accent/20 bg-accent-soft text-accent",
    success: "border-success/20 bg-success/10 text-success",
    warning: "border-warning/20 bg-warning/10 text-warning",
  };

  const sizes = {
    sm: "h-6 px-2 text-[10px]",
    md: "h-7 px-2.5 text-[11px]",
    lg: "h-8 px-3 text-[12px]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-semibold uppercase tracking-wide ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
    >
      {icon ? <span className="inline-flex">{icon}</span> : null}
      {children}
    </span>
  );
}

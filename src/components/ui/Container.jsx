export default function Container({
  children,
  size = "default",
  className = "",
  as: Comp = "div",
  ...props
}) {
  const widths = {
    sm: "max-w-[800px]",
    default: "max-w-[1200px]",
    lg: "max-w-[1320px]",
    xl: "max-w-[1440px]",
  };

  return (
    <Comp
      className={`mx-auto w-full px-5 sm:px-6 lg:px-8 ${widths[size] || widths.default} ${className}`}
      {...props}
    >
      {children}
    </Comp>
  );
}

/** Shared shell — Navbar + Hero share the same horizontal bounds */
export const SHELL_MAX_WIDTH = "max-w-[1440px]";
export const SHELL_PADDING = "px-5 sm:px-6 lg:px-10 xl:px-12";

export function shellClassName(className = "") {
  return `mx-auto w-full ${SHELL_PADDING} ${SHELL_MAX_WIDTH}${className ? ` ${className}` : ""}`;
}

const DEFAULT_PADDING = "px-5 sm:px-6 lg:px-10 xl:px-12";

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
    xl: SHELL_MAX_WIDTH,
    shell: SHELL_MAX_WIDTH,
  };

  const padding = size === "shell" || size === "xl" ? SHELL_PADDING : DEFAULT_PADDING;

  return (
    <Comp
      className={`mx-auto w-full ${padding} ${widths[size] || widths.default} ${className}`}
      {...props}
    >
      {children}
    </Comp>
  );
}

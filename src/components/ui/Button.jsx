import { forwardRef } from "react";
import { Link } from "react-router-dom";

const VARIANTS = {
  primary:
    "bg-primary text-white hover:bg-primary-hover shadow-[0_8px_24px_-8px_var(--primary)] hover:shadow-[0_12px_32px_-8px_var(--primary)]",
  secondary:
    "bg-surface text-text border border-border hover:border-primary hover:text-primary",
  ghost:
    "bg-transparent text-text hover:bg-surface hover:text-primary",
  outline:
    "bg-transparent text-text border border-border-strong hover:border-primary hover:text-primary",
  link: "bg-transparent text-primary hover:text-primary-hover underline-offset-4 hover:underline px-0",
};

const SIZES = {
  sm: "h-9 px-4 text-[13px] gap-2",
  md: "h-11 px-5 text-[14px] gap-2",
  lg: "h-[54px] px-7 text-[15px] gap-3",
};

const BASE =
  "inline-flex items-center justify-center font-sans font-semibold tracking-tight rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg whitespace-nowrap";

const Button = forwardRef(function Button(
  {
    as,
    to,
    href,
    type = "button",
    variant = "primary",
    size = "md",
    angular = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    children,
    className = "",
    ...props
  },
  ref
) {
  const cls = `${BASE} ${VARIANTS[variant] || VARIANTS.primary} ${
    SIZES[size] || SIZES.md
  } ${angular ? "clip-angular rounded-none" : ""} ${
    fullWidth ? "w-full" : ""
  } ${className}`;

  const content = (
    <>
      {leftIcon ? <span className="inline-flex shrink-0">{leftIcon}</span> : null}
      <span className="font-sans font-semibold tracking-tight text-base leading-[1.2]">{children}</span>
      {rightIcon ? <span className="inline-flex shrink-0">{rightIcon}</span> : null}
    </>
  );

  if (to) {
    return (
      <Link ref={ref} to={to} className={cls} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a ref={ref} href={href} className={cls} {...props}>
        {content}
      </a>
    );
  }

  const Comp = as || "button";
  return (
    <Comp ref={ref} type={Comp === "button" ? type : undefined} className={cls} {...props}>
      {content}
    </Comp>
  );
});

export default Button;

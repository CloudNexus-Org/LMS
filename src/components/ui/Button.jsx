import { forwardRef } from "react";
import { Link } from "react-router-dom";

const VARIANTS = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  secondary:
    "bg-transparent text-text border border-border hover:border-primary/40 hover:bg-primary/5",
  ghost: "bg-transparent text-text hover:bg-primary/5 hover:text-primary",
  outline:
    "bg-transparent text-text border border-border hover:border-primary hover:text-primary",
  link: "bg-transparent text-text font-medium hover:text-primary px-0 h-auto min-h-0 rounded-none",
};

const SIZES = {
  sm: "h-9 px-5 text-[13px] gap-2",
  md: "h-11 px-6 text-[14px] gap-2",
  lg: "h-12 px-8 text-[15px] gap-2.5",
};

const BASE =
  "inline-flex items-center justify-center font-sans font-semibold tracking-tight rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg whitespace-nowrap";

const Button = forwardRef(function Button(
  {
    as,
    to,
    href,
    type = "button",
    variant = "primary",
    size = "md",
    fullWidth = false,
    leftIcon,
    rightIcon,
    children,
    className = "",
    ...props
  },
  ref
) {
  const isLink = variant === "link";
  const cls = `${BASE} ${VARIANTS[variant] || VARIANTS.primary} ${
    isLink ? "" : SIZES[size] || SIZES.md
  } ${fullWidth ? "w-full" : ""} ${className}`;

  const content = (
    <>
      {leftIcon ? <span className="inline-flex shrink-0">{leftIcon}</span> : null}
      <span className="font-sans font-semibold tracking-tight leading-[1.2]">
        {children}
      </span>
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

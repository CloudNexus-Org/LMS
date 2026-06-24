import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { authItemMotion } from "./authMotion";

function preventAutofillFocus(event) {
  event.target.removeAttribute("readonly");
}

export default function AuthPasswordField({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  showPassword,
  onToggle,
  onBlur,
  error,
  compact = false,
  delay = 0,
  extraAction,
  autoComplete = "new-password",
}) {
  return (
    <motion.div {...authItemMotion(delay)}>
      <div className={`${compact ? "mb-1.5" : "mb-2"}`}>
        <label
          htmlFor={id}
          className={`font-medium text-muted ${compact ? "text-[11px]" : "text-[12px]"}`}
        >
          {label}
          <span className="ml-0.5 text-danger" aria-hidden>
            *
          </span>
        </label>
      </div>

      <div
        className={`
          flex
          items-center
          rounded-xl
          border
          bg-bg
          px-4
          transition-all
          duration-200
          focus-within:ring-2
          dark:bg-elevated
          ${compact ? "h-11" : "h-11 sm:h-12"}
          ${
            error
              ? "border-danger focus-within:border-danger focus-within:ring-danger/15"
              : "border-border focus-within:border-primary focus-within:ring-primary/15 dark:border-white/10"
          }
        `}
      >
        <input
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          required
          autoComplete={autoComplete}
          readOnly
          onFocus={preventAutofillFocus}
          data-lpignore="true"
          data-1p-ignore="true"
          data-bwignore="true"
          data-form-type="other"
          className="
            w-full
            bg-transparent
            text-[14px]
            text-text
            outline-none
            placeholder:text-subtle
          "
        />

        <button
          type="button"
          onClick={onToggle}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="ml-2 shrink-0 text-muted transition-colors hover:text-primary"
        >
          {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>

      {extraAction ? (
        <div className="mt-1.5 flex justify-end">{extraAction}</div>
      ) : null}

      {error ? <p className="mt-1 text-[11px] text-danger">{error}</p> : null}
    </motion.div>
  );
}

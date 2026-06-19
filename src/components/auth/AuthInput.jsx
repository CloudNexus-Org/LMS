import { motion } from "framer-motion";
import { authItemMotion } from "./authMotion";

function preventAutofillFocus(event) {
  event.target.removeAttribute("readonly");
}

export default function AuthInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  prefix,
  suffix,
  compact = false,
  delay = 0,
  autoComplete = "off",
  inputProps = {},
}) {
  return (
    <motion.div {...authItemMotion(delay)}>
      <label
        htmlFor={name}
        className={`block font-medium text-muted ${compact ? "mb-1.5 text-[11px]" : "mb-2 text-[12px]"}`}
      >
        {label}
        {required ? (
          <span className="ml-0.5 text-danger" aria-hidden>
            *
          </span>
        ) : null}
      </label>

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
          focus-within:border-primary
          focus-within:ring-2
          focus-within:ring-primary/15
          dark:bg-elevated
          ${compact ? "h-11" : "h-11 sm:h-12"}
          ${error ? "border-danger focus-within:border-danger focus-within:ring-danger/15" : "border-border dark:border-white/10"}
        `}
      >
        {prefix ? (
          <span className="mr-2 shrink-0 text-muted">{prefix}</span>
        ) : null}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="
            w-full
            bg-transparent
            text-[14px]
            text-text
            outline-none
            placeholder:text-subtle
          "
          {...inputProps}
          autoComplete={autoComplete}
          readOnly
          onFocus={(event) => {
            preventAutofillFocus(event);
            inputProps.onFocus?.(event);
          }}
          data-lpignore="true"
          data-1p-ignore="true"
          data-bwignore="true"
          data-form-type="other"
        />

        {suffix ? (
          <span className="ml-2 shrink-0 text-muted">{suffix}</span>
        ) : null}
      </div>

      {error ? (
        <p className="mt-1 text-[11px] text-danger">{error}</p>
      ) : null}
    </motion.div>
  );
}

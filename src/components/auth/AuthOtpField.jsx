import { useRef } from "react";
import { motion } from "framer-motion";
import { authItemMotion } from "./authMotion";

const OTP_LENGTH = 4;

export default function AuthOtpField({
  value,
  onChange,
  error,
  delay = 0,
  onComplete,
}) {
  const inputRefs = useRef([]);

  const focusInput = (index) => {
    inputRefs.current[index]?.focus();
  };

  const updateDigit = (index, digit) => {
    const next = [...value];
    next[index] = digit;
    onChange(next);

    if (digit && index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }

    if (digit && index === OTP_LENGTH - 1 && next.every((d) => d)) {
      onComplete?.(next);
    }
  };

  const handleChange = (index, raw) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    if (raw && !digit) return;
    updateDigit(index, digit);
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace") {
      if (value[index]) {
        const next = [...value];
        next[index] = "";
        onChange(next);
        return;
      }

      if (index > 0) {
        event.preventDefault();
        const next = [...value];
        next[index - 1] = "";
        onChange(next);
        focusInput(index - 1);
      }
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusInput(index - 1);
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      event.preventDefault();
      focusInput(index + 1);
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) return;

    const next = Array.from({ length: OTP_LENGTH }, (_, i) => pasted[i] ?? "");
    onChange(next);

    const nextFocus = Math.min(pasted.length, OTP_LENGTH - 1);
    focusInput(nextFocus);

    if (next.every((d) => d)) {
      onComplete?.(next);
    }
  };

  return (
    <motion.div {...authItemMotion(delay)}>
      <p className="mb-2 block text-[12px] font-medium text-muted">
        Verification code
        <span className="ml-0.5 text-danger" aria-hidden>
          *
        </span>
      </p>

      <div
        className="flex items-center justify-center gap-2.5 sm:gap-3"
        onPaste={handlePaste}
      >
        {value.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            id={`otp-${index}`}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
            className={`
              h-12
              w-11
              rounded-xl
              border
              bg-bg
              text-center
              text-[18px]
              font-semibold
              tracking-widest
              text-text
              outline-none
              transition-all
              duration-200
              focus:border-primary
              focus:ring-2
              focus:ring-primary/15
              dark:bg-elevated
              sm:h-12
              sm:w-12
              sm:text-[20px]
              ${error ? "border-danger focus:border-danger focus:ring-danger/15" : "border-border dark:border-white/10"}
            `}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
          />
        ))}
      </div>

      {error ? (
        <p className="mt-2 text-center text-[11px] text-danger">{error}</p>
      ) : null}
    </motion.div>
  );
}

import { useState } from "react";

import {
  ShieldCheck,
} from "lucide-react";

import ThemeToggle from "../components/ui/ThemeToggle";

export default function OtpVerificationPage() {

  const [otp, setOtp] = useState(["", "", "", ""]);

  const handleChange = (value, index) => {

    if (!/^[0-9]?$/.test(value)) return;

    const updatedOtp = [...otp];

    updatedOtp[index] = value;

    setOtp(updatedOtp);

    // AUTO FOCUS NEXT
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-bg text-text transition-colors duration-300 font-sans">

      {/* CENTER GLOW */}
      <div
        className="
          pointer-events-none absolute
          left-1/2 top-1/2
          h-[700px] w-[700px]
          -translate-x-1/2 -translate-y-1/2
          rounded-full
          bg-blue-500/10
          blur-[170px]
        "
      />

      {/* GRID */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 blueprint-grid opacity-40"
      />

      {/* EXTRA GLOW */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute
          top-[-10%] left-[-10%]
          h-[420px] w-[420px]
          rounded-full
          bg-primary/10
          blur-[120px]
        "
      />

      {/* THEME TOGGLE */}
      <div className="absolute right-5 top-5 z-30">
        <ThemeToggle />
      </div>

      {/* MAIN */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10">

        <div
          className="
            relative
            w-full max-w-[520px]
            h-[540px]
            overflow-hidden
            rounded-[5px]
          "
        >

          {/* ANIMATED BORDER */}
          <div className="absolute inset-[3px] rounded-[5px] p-[80px] overflow-hidden">

            {/* rotating border glow */}
            <div
              className="
                absolute
                top-[-50%]
                left-[-50%]
                h-[200%]
                w-[200%]
                animate-[spin_6s_linear_infinite]
                bg-[conic-gradient(from_0deg,transparent_0deg,transparent_300deg,rgba(59,130,246,0.95)_340deg,transparent_360deg)]
              "
            />

            {/* INNER BOX */}
            <div
              className="
                absolute inset-[3px]
                rounded-[5px]
                bg-elevated/95
                backdrop-blur-xl
                shadow-[0_30px_100px_rgba(0,0,0,0.35)]
              "
            />
          </div>

          {/* CONTENT */}
          <div className="relative z-10 flex h-full flex-col justify-between p-10">

            {/* TOP */}
            <div>

            

              {/* ICON */}
              <div
                className="
                  mb-6 flex h-[80px] w-[80px]
                  items-center justify-center
                  rounded-full
                  bg-blue-500/10
                  shadow-[0_0_40px_rgba(59,130,246,0.25)]
                "
              >

                <ShieldCheck
                  size={34}
                  className="text-blue-400"
                />

              </div>

              {/* TITLE */}
              <h1 className="text-[40px] font-black tracking-[-0.04em]">
                Verify OTP
              </h1>

              {/* DESCRIPTION */}
              <p className="mt-3 text-[15px] leading-7 text-muted">
                Enter the 4-digit verification code sent to
                your email address.
              </p>

            </div>

            {/* OTP FORM */}
            <form className="mt-10 flex flex-1 flex-col justify-between">

              {/* OTP INPUTS */}
              <div className="flex items-center justify-center gap-4">

                {otp.map((digit, index) => (

                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    autoComplete="one-time-code"
                    className="
                      h-16 w-14
                      rounded-xl
                      border border-border
                      bg-bg
                      text-center
                      text-[1.6rem]
                      font-bold
                      tracking-widest
                      text-text
                      outline-none
                      transition-all
                      focus:border-primary
                      focus:ring-2
                      focus:ring-primary/20
                    "
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                  />

                ))}

              </div>

              {/* VERIFY BUTTON */}
              <button
                type="submit"
                className="btn btn-primary btn-lg flex w-full"
              >
                Verify OTP →
              </button>

              {/* RESEND */}
              <div className="text-center">

                <p className="text-[14px] text-muted">
                  Didn&apos;t receive the code?{" "}

                  <button
                    type="button"
                    className="
                      font-semibold text-primary
                      transition
                      hover:underline
                    "
                  >
                    Resend OTP
                  </button>

                </p>

              </div>

            </form>

          </div>

        </div>

      </div>
    </section>
  );
}

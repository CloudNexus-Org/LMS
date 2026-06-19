import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import ThemeToggle from "../components/ui/ThemeToggle";

export default function ForgotPasswordPage() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-bg text-text transition-colors duration-300">

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
                <Mail
                  size={34}
                  className="text-blue-400"
                />
              </div>

              {/* TITLE */}
              <h1 className="text-[40px] font-black tracking-[-0.04em]">
                Forgot Password
              </h1>

              {/* DESCRIPTION */}
              <p className="mt-3 text-[15px] leading-7 text-muted">
                Enter your email address, and we'll send you OTP to reset your password.
              </p>

            </div>

            {/* FORM */}
            <form className="mt-8 flex flex-1 flex-col justify-between">

              <div className="space-y-5">

                {/* EMAIL */}
                <div>

                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-subtle">
                    Email Address
                  </label>

                  <div
                    className="
                      flex h-[58px] items-center
                      rounded-[5px]
                      border border-border
                      bg-bg px-4
                      transition
                      focus-within:border-primary
                      focus-within:ring-2
                      focus-within:ring-primary/20
                    "
                  >

                    <span className="mr-3 text-muted">
                      @
                    </span>

                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="
                        w-full bg-transparent
                        text-[15px] text-text
                        outline-none
                        placeholder:text-subtle
                      "
                    />

                  </div>

                </div>

              </div>

              {/* BUTTON */}
              <Link
                to="/verify-otp"
                className="
                  mt-10
                  flex h-[54px] w-full items-center justify-center
                  rounded-[5px]
                  bg-primary
                  text-[14px] font-bold
                  text-white
                  shadow-[0_10px_40px_rgba(59,130,246,0.35)]
                  transition duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_20px_50px_rgba(59,130,246,0.45)]
                "
              >
                Send OTP →
              </Link>

            </form>

          </div>

        </div>

      </div>

    </section>
  );
}
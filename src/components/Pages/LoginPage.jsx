import { useState } from "react";
import { Link } from "react-router-dom";
import {
  X,
  Eye,
  EyeOff,
} from "lucide-react";

import { FaGoogle, FaGithub } from "react-icons/fa";
import ThemeToggle from "../ui/ThemeToggle";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="relative min-h-screen overflow-hidden bg-bg text-text transition-colors duration-300">
{/* CENTER BG GLOW */}
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

      {/* GLOW */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute
          left-[-10%] top-[-10%]
          h-[420px] w-[420px]
          rounded-full
          bg-primary/10
          blur-[120px]
        "
      />

      <div
        aria-hidden
        className="
          pointer-events-none absolute
          bottom-[-10%] right-[-10%]
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
            relative grid
            w-full max-w-[980px]
            h-[780px]
            overflow-hidden
            rounded-[34px]
            border-2 border-blue-500/90
            bg-elevated/90
            shadow-[0_30px_100px_rgba(0,0,0,0.35)]
            
            md:grid-cols-[0.9fr_1.1fr]
          "
        >

          {/* CLOSE BUTTON */}
          <Link
            to="/"
            className="
              absolute right-5 top-5 z-20
              flex h-10 w-10 items-center justify-center
              rounded-full border border-border
              bg-bg
              text-muted
              transition hover:border-primary hover:text-primary
            "
          >
            <X size={16} />
          </Link>

{/* LEFT SIDE */}
<div
  className="
    relative hidden overflow-hidden
    border-r border-border
    bg-bg
    p-10
    md:flex md:flex-col
  "
>

  {/* MAIN BLUE GLOW */}
  <div
    className="
      absolute left-1/2 top-1/2
      h-[420px] w-[420px]
      -translate-x-1/2 -translate-y-1/2
      rounded-full
      bg-blue-500/20
      blur-[120px]
    "
  />

  {/* EXTRA GLOW */}
  <div
    className="
      absolute left-1/2 top-[45%]
      h-[160px] w-[160px]
      
      -translate-x-1/2 -translate-y-1/2
      rounded-full
      bg-blue-500/30
       shadow-[0_0_20px_rgba(59,130,246,0.9)]
    "
  />

  {/* BRAND */}
  <div className="relative z-10 flex items-center gap-2">

    <span
      className="
        h-3 w-3 rounded-full
        bg-blue-400
        shadow-[0_0_20px_rgba(59,130,246,0.9)]
      "
    />

    <span className="text-[24px] font-black tracking-tight text-text">
      Cloud Nexus
    </span>

  </div>

  {/* CENTER ORB */}
  <div className="relative z-10 flex flex-1 items-center justify-center">

    {/* OUTER GLOW */}
    <div
      className="
        absolute h-[50px] w-[50px]
        rounded-full
        bg-blue-500/20
        blur-[90px]
      "
    />

    {/* OUTER CIRCLE */}
    <div
      className="
        relative flex h-[150px] w-[150px]
        items-center justify-center
        rounded-full

        bg-bg

        shadow-[0_25px_70px_rgba(59,130,246,0.22)]
      "
    >

      {/* INNER BALL */}
      <div
        className="
          h-[90px] w-[90px]
          animate-float
          rounded-full

          bg-gradient-to-br
          from-blue-300
          via-blue-500
          to-blue-700

          shadow-[0_0_40px_rgba(59,130,246,0.55)]
        "
      />

    </div>

  </div>

  {/* TEXT */}
  <div className="relative z-10 text-center">

    <h3 className="text-[30px] font-black text-text">
      Welcome back,
    </h3>

    <p className="mt-3 text-[15px] leading-7 text-muted">
      Sign in to continue your learning journey and
      access your dashboard.
    </p>

  </div>
</div>

          {/* RIGHT PANEL */}
          <div className="flex flex-col justify-center px-6 py-10 md:px-12">

            {/* TITLE */}
            <h1 className="text-[42px] font-black tracking-[-0.04em] text-text">
              Sign In
            </h1>

            <p className="mt-2 text-[14px] leading-7 text-muted">
              Enter your credentials to access your account
            </p>

            {/* FORM */}
            <form className="mt-8 space-y-5">

              {/* USERNAME */}
              <div>

                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-subtle">
                  Username
                </label>

                <div
                  className="
                    flex h-[58px] items-center
                    rounded-[16px]
                    border border-border
                    bg-bg px-4
                    transition
                    focus-within:border-primary
                    focus-within:ring-2
                    focus-within:ring-primary/20
                  "
                >

                  <span className="mr-3 text-muted">@</span>

                  <input
                    type="text"
                    placeholder="your_username"
                    className="
                      
                    "
                  />

                </div>
              </div>

              {/* PASSWORD */}
              <div>

                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-subtle">
                  Password
                </label>

                <div
                  className="
                    flex h-[58px] items-center
                    rounded-[16px]
                    border border-border
                    bg-bg px-4
                    transition
                    focus-within:border-primary
                    focus-within:ring-2
                    focus-within:ring-primary/20
                  "
                >

                  <span className="mr-3 text-muted">
                    🔓︎
                  </span>

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="
                      w-full bg-transparent
                      text-[15px] text-text
                      outline-none
                      placeholder:text-subtle
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="text-muted transition hover:text-text"
                  >
                    {showPassword
                      ? <EyeOff size={18} />
                      : <Eye size={18} />}
                  </button>

                </div>
              </div>

              {/* SIGN IN BUTTON */}
              <button
                type="submit"
                className="
                  flex h-[52px] w-full items-center justify-center
                  rounded-[16px]
                  bg-primary
                  text-[14px] font-bold
                  text-white
                  shadow-[0_10px_40px_rgba(59,130,246,0.35)]
                  transition duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_20px_50px_rgba(59,130,246,0.45)]
                "
              >
                Sign In →
              </button>

              {/* DIVIDER */}
              <div className="flex items-center gap-4 py-2">

                <div className="h-px flex-1 bg-border" />

                <span className="text-[12px] text-subtle">
                  or continue with
                </span>

                <div className="h-px flex-1 bg-border" />

              </div>

              {/* GOOGLE */}
              <button
                type="button"
                className="
                  flex h-[54px] w-full items-center justify-center gap-3
                  rounded-[15px]
                  border border-border
                  bg-bg
                  text-[14px] font-semibold text-text
                  transition
                  hover:border-primary/40
                  hover:bg-primary/5
                "
              >

                <FaGoogle />

                Continue with Google

              </button>

              {/* APPLE */}
              <button
                type="button"
                className="
                  flex h-[54px] w-full items-center justify-center gap-3
                  rounded-[15px]
                  border border-border
                  bg-bg
                  text-[14px] font-semibold text-text
                  transition
                  hover:border-primary/40
                  hover:bg-primary/5
                "
              >

                <FaGithub />

                Continue with Github

              </button>

              {/* OTP LINKS */}
              <div className="pt-2 text-center">

                <div className="flex items-center justify-center gap-3 text-[13px]">

             

                </div>

                {/* SIGNUP */}
                <p className="mt-5 text-[13px] text-muted">

                  Don&apos;t have an account?{" "}

                  <Link
                    to="/signup"
                    className="font-semibold text-primary hover:underline"
                  >
                    Create one
                  </Link>

                </p>

              </div>

            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
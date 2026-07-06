import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, ShieldCheck } from "lucide-react";
import ThemeToggle from "../components/ui/ThemeToggle";
import {
  resendOtp,
  resetPassword,
  verifyOtp,
} from "@/lib/api/authApi";
import { clearResetSession, getResetEmail, getResetOtp, setResetOtp } from "@/pages/ForgotPasswordPage";
import { parseApiError } from "@/lib/api/apiHelpers";

const OTP_LENGTH = 6;

export default function OtpVerificationPage() {
  const navigate = useNavigate();
  const email = getResetEmail();
  const devOtp = getResetOtp();

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [step, setStep] = useState("verify");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < OTP_LENGTH - 1) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const otpCode = otp.join("");

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email) {
      navigate("/forgot-password");
      return;
    }
    if (otpCode.length !== OTP_LENGTH) {
      setError("Please enter the full verification code.");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      await verifyOtp(email, otpCode);
      setStep("reset");
      setMessage("OTP verified. Choose a new password.");
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      await resetPassword(email, otpCode, newPassword);
      clearResetSession();
      navigate("/login", { state: { message: "Password reset successfully. Please sign in." } });
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setIsLoading(true);
    setError("");
    try {
      const result = await resendOtp(email);
      if (result?.otp) setResetOtp(result.otp);
      setMessage("A new code was sent to your email.");
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setIsLoading(false);
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
          rounded-lg
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
          rounded-lg
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
            min-h-[540px]
            overflow-hidden
            rounded-[5px]
          "
        >

          {/* ANIMATED BORDER */}
          <div className="absolute inset-[3px] rounded-[5px] p-[80px] overflow-hidden">

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
          <div className="relative z-10 flex min-h-[540px] flex-col justify-between p-10">

            <div>
              <div
                className="
                  mb-6 flex h-[80px] w-[80px]
                  items-center justify-center
                  rounded-lg
                  bg-blue-500/10
                  shadow-[0_0_40px_rgba(59,130,246,0.25)]
                "
              >
                <ShieldCheck size={34} className="text-blue-400" />
              </div>

              <h1 className="text-[40px] font-black tracking-[-0.04em]">
                {step === "verify" ? "Verify OTP" : "New Password"}
              </h1>

              <p className="mt-3 text-[15px] leading-7 text-muted">
                {step === "verify"
                  ? `Enter the ${OTP_LENGTH}-digit verification code sent to your email address.`
                  : "Create a strong password for your account."}
              </p>
              {step === "verify" && devOtp ? (
                <p className="mt-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-[13px] text-primary">
                  Dev mode: your verification code is <strong className="font-mono tracking-widest">{devOtp}</strong>
                </p>
              ) : null}
            </div>

            {step === "verify" ? (
              <form onSubmit={handleVerify} className="mt-10 flex flex-1 flex-col justify-between">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      autoComplete="one-time-code"
                      className="
                        h-14 w-12
                        rounded-xl
                        border border-border
                        bg-bg
                        text-center
                        text-[1.4rem]
                        font-bold
                        tracking-widest
                        text-text
                        outline-none
                        transition-all
                        focus:border-primary
                        focus:ring-2
                        focus:ring-primary/20
                        sm:h-16 sm:w-14
                      "
                      value={digit}
                      onChange={(e) => handleChange(e.target.value, index)}
                    />
                  ))}
                </div>

                {error ? <p className="mt-4 text-center text-[13px] text-danger">{error}</p> : null}
                {message ? <p className="mt-4 text-center text-[13px] text-success">{message}</p> : null}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="
                    mt-8 flex h-[56px] w-full items-center justify-center gap-2
                    rounded-[5px]
                    bg-primary
                    text-[15px] font-bold
                    text-white
                    shadow-[0_10px_40px_rgba(59,130,246,0.35)]
                    transition duration-300
                    hover:-translate-y-1
                    hover:shadow-[0_20px_50px_rgba(59,130,246,0.45)]
                    disabled:opacity-70 disabled:hover:translate-y-0
                  "
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
                  Verify OTP →
                </button>

                <div className="text-center">
                  <p className="text-[14px] text-muted">
                    Didn&apos;t receive the code?{" "}
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={isLoading}
                      className="font-semibold text-primary transition hover:underline disabled:opacity-60"
                    >
                      Resend OTP
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              <form onSubmit={handleReset} className="mt-10 flex flex-1 flex-col gap-5">
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-subtle">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-[54px] w-full rounded-[5px] border border-border bg-bg px-4 text-[15px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-subtle">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-[54px] w-full rounded-[5px] border border-border bg-bg px-4 text-[15px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Confirm new password"
                  />
                </div>

                {error ? <p className="text-[13px] text-danger">{error}</p> : null}
                {message ? <p className="text-[13px] text-success">{message}</p> : null}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="
                    flex h-[56px] w-full items-center justify-center gap-2
                    rounded-[5px]
                    bg-primary
                    text-[15px] font-bold
                    text-white
                    shadow-[0_10px_40px_rgba(59,130,246,0.35)]
                    transition duration-300
                    hover:-translate-y-1
                    disabled:opacity-70 disabled:hover:translate-y-0
                  "
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
                  Reset Password →
                </button>
              </form>
            )}

            <p className="mt-4 text-center text-[13px] text-muted">
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Back to sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

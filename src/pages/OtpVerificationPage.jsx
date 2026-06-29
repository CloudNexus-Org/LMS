import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import AuthShell from "@/components/auth/AuthShell";
import AuthOtpField from "@/components/auth/AuthOtpField";
import AuthPrimaryButton from "@/components/auth/AuthPrimaryButton";
import AuthAutofillTrap from "@/components/auth/AuthAutofillTrap";
import { authItemMotion } from "@/components/auth/authMotion";
import { validateOtp, validateOtpForm } from "@/lib/authValidation";

const EMPTY_OTP = ["", "", "", ""];

export default function OtpVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState(EMPTY_OTP);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const isFormValid = useMemo(() => validateOtpForm(otp).isValid, [otp]);

  const subtitle = email
    ? `Enter the 4-digit verification code sent to ${email}`
    : "Enter the 4-digit verification code sent to your email address";

  const handleOtpChange = (nextOtp) => {
    setOtp(nextOtp);
    if (touched && error) {
      setError(validateOtp(nextOtp));
    } else if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);

    const { errors: submitErrors, isValid } = validateOtpForm(otp);
    const otpError = submitErrors.otp ?? "";

    setError(otpError);
    if (!isValid) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      navigate("/login", {
        state: { message: "Password reset verified. You can sign in now." },
      });
    }, 1200);
  };

  const handleResend = () => {
    if (isResending) return;

    setIsResending(true);
    setOtp(EMPTY_OTP);
    setError("");
    setTouched(false);

    setTimeout(() => {
      setIsResending(false);
    }, 1200);
  };

  return (
    <AuthShell title="Verify OTP" subtitle={subtitle}>
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="relative space-y-4"
        noValidate
      >
        <AuthAutofillTrap />

        <AuthOtpField
          value={otp}
          onChange={handleOtpChange}
          error={touched ? error : ""}
          delay={0.1}
        />

        <AuthPrimaryButton delay={0.18} disabled={isLoading || !isFormValid}>
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify OTP"
          )}
        </AuthPrimaryButton>

        <motion.p
          {...authItemMotion(0.24)}
          className="text-center text-[13px] text-muted"
        >
          Didn&apos;t receive the code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="font-semibold text-primary transition-colors hover:text-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isResending ? "Sending..." : "Resend OTP"}
          </button>
        </motion.p>

        <motion.p
          {...authItemMotion(0.28)}
          className="pt-0.5 text-center text-[13px] text-muted"
        >
          Wrong email?{" "}
          <Link
            to="/forgot-password"
            className="font-semibold text-primary transition-colors hover:text-primary-hover"
          >
            Go back
          </Link>
        </motion.p>
      </form>
    </AuthShell>
  );
}

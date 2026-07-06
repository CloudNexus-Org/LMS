import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import AuthShell from "@/components/auth/AuthShell";
import AuthInput from "@/components/auth/AuthInput";
import AuthPrimaryButton from "@/components/auth/AuthPrimaryButton";
import AuthAutofillTrap from "@/components/auth/AuthAutofillTrap";
import { authItemMotion } from "@/components/auth/authMotion";
import { forgotPassword } from "@/lib/api/authApi";
import { parseApiError } from "@/lib/api/apiHelpers";

const RESET_EMAIL_KEY = "lms-reset-email";
const RESET_OTP_KEY = "lms-reset-otp";

export function getResetEmail() {
  return sessionStorage.getItem(RESET_EMAIL_KEY) || "";
}

export function setResetEmail(email) {
  sessionStorage.setItem(RESET_EMAIL_KEY, email);
}

export function getResetOtp() {
  return sessionStorage.getItem(RESET_OTP_KEY) || "";
}

export function setResetOtp(otp) {
  if (otp) {
    sessionStorage.setItem(RESET_OTP_KEY, otp);
  } else {
    sessionStorage.removeItem(RESET_OTP_KEY);
  }
}

export function clearResetSession() {
  sessionStorage.removeItem(RESET_EMAIL_KEY);
  sessionStorage.removeItem(RESET_OTP_KEY);
}

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isValid = /^\S+@\S+\.\S+$/.test(email.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^\S+@\S+\.\S+$/.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const result = await forgotPassword(trimmed);
      setResetEmail(trimmed);
      setResetOtp(result?.otp || "");
      navigate("/verify-otp");
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Forgot Password"
      subtitle="Enter your email address and we'll send you an OTP to reset your password"
    >
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="relative space-y-3.5"
        noValidate
      >
        <AuthAutofillTrap />

        <AuthInput
          label="E-mail Address"
          name="email"
          type="email"
          inputMode="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
          placeholder="Enter email address"
          required
          error={error}
          delay={0.1}
        />

        <AuthPrimaryButton delay={0.18} disabled={isLoading || !isValid}>
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Sending OTP...
            </>
          ) : (
            "Send OTP"
          )}
        </AuthPrimaryButton>

        <motion.p
          {...authItemMotion(0.24)}
          className="pt-0.5 text-center text-[13px] text-muted"
        >
          Remember your password?{" "}
          <Link
            to="/login"
            className="font-semibold text-primary transition-colors hover:text-primary-hover"
          >
            Sign in
          </Link>
        </motion.p>
      </form>
    </AuthShell>
  );
}

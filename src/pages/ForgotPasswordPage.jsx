import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import AuthShell from "@/components/auth/AuthShell";
import AuthInput from "@/components/auth/AuthInput";
import AuthPrimaryButton from "@/components/auth/AuthPrimaryButton";
import AuthAutofillTrap from "@/components/auth/AuthAutofillTrap";
import { authItemMotion } from "@/components/auth/authMotion";
import {
  trimForgotPasswordValues,
  validateForgotPasswordField,
  validateForgotPasswordForm,
} from "@/lib/authValidation";

const FORGOT_PASSWORD_FIELDS = ["email"];

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const [formData, setFormData] = useState({
    email: "",
  });

  const [errors, setErrors] = useState({});

  const isFormValid = useMemo(
    () => validateForgotPasswordForm(formData).isValid,
    [formData]
  );

  const setFieldError = (name, nextFormData) => {
    setErrors((prev) => ({
      ...prev,
      [name]: validateForgotPasswordField(name, nextFormData),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextFormData = { ...formData, [name]: value };
    setFormData(nextFormData);

    if (touched[name]) {
      setFieldError(name, nextFormData);
    } else if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setFieldError(name, formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = trimForgotPasswordValues(formData);
    const { errors: submitErrors, isValid } =
      validateForgotPasswordForm(trimmed);

    setTouched(
      FORGOT_PASSWORD_FIELDS.reduce(
        (acc, field) => ({ ...acc, [field]: true }),
        {}
      )
    );
    setErrors(submitErrors);

    if (!isValid) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      navigate("/verify-otp", { state: { email: trimmed.email } });
    }, 1200);
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
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email address"
          required
          error={errors.email}
          delay={0.1}
          inputProps={{ onBlur: handleBlur }}
        />

        <AuthPrimaryButton delay={0.18} disabled={isLoading || !isFormValid}>
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
            Sign In
          </Link>
        </motion.p>
      </form>
    </AuthShell>
  );
}

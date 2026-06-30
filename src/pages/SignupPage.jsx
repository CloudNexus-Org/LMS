import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/protectedroutes/routePaths";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import AuthShell from "@/components/auth/AuthShell";
import AuthInput from "@/components/auth/AuthInput";
import AuthDivider from "@/components/auth/AuthDivider";
import SocialAuthButtons from "@/components/auth/SocialAuthButtons";
import AuthPasswordField from "@/components/auth/AuthPasswordField";
import AuthPrimaryButton from "@/components/auth/AuthPrimaryButton";
import AuthAutofillTrap from "@/components/auth/AuthAutofillTrap";
import PasswordStrengthMeter from "@/components/ui/PasswordStrengthMeter";
import { authItemMotion } from "@/components/auth/authMotion";
import useAuthStore from "@/store/useAuthStore";
import { register as apiRegister } from "@/lib/api/authApi";
import { dashboardPathForRole, parseApiError } from "@/lib/api/apiHelpers";
import {
  trimSignupValues,
  validateSignupField,
  validateSignupForm,
} from "@/lib/authValidation";

const SIGNUP_FIELDS = ["name", "email", "password", "confirmPassword"];

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  const redirectTo = location.state?.from || ROUTES.student.dashboard;

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const isFormValid = useMemo(
    () => validateSignupForm(formData).isValid,
    [formData]
  );

  const setFieldError = (name, nextFormData) => {
    setErrors((prev) => ({
      ...prev,
      [name]: validateSignupField(name, nextFormData),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextFormData = { ...formData, [name]: value };
    setFormData(nextFormData);

    if (touched[name]) {
      setFieldError(name, nextFormData);
    }

    if (name === "password" && touched.confirmPassword) {
      setFieldError("confirmPassword", nextFormData);
    }

    if (!touched[name] && errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setFieldError(name, formData);

    if (name === "password" && touched.confirmPassword) {
      setFieldError("confirmPassword", formData);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = trimSignupValues(formData);
    const { errors: submitErrors, isValid } = validateSignupForm(trimmed);

    setTouched(
      SIGNUP_FIELDS.reduce((acc, field) => ({ ...acc, [field]: true }), {})
    );
    setErrors(submitErrors);

    if (!isValid) return;

    setIsLoading(true);
    setSubmitError("");

    try {
      const { user, accessToken, refreshToken } = await apiRegister({
        fullName: trimmed.name,
        email: trimmed.email,
        password: trimmed.password,
      });
      login(user, accessToken, refreshToken);
      navigate(dashboardPathForRole(user.role));
    } catch (err) {
      setSubmitError(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      compact
      title="Create Account"
      subtitle="Please enter your details to get started"
    >
      <form onSubmit={handleSubmit} autoComplete="off" className="relative space-y-2.5" noValidate>
        <AuthAutofillTrap />
        <SocialAuthButtons delay={0.04} />

        <AuthDivider delay={0.08} />

        <AuthInput
          compact
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
          error={errors.name}
          delay={0.12}
          inputProps={{ onBlur: handleBlur }}
        />

        <AuthInput
          compact
          label="E-mail Address"
          name="email"
          type="email"
          inputMode="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email address"
          required
          error={errors.email}
          delay={0.16}
          inputProps={{ onBlur: handleBlur }}
        />

        <AuthPasswordField
          compact
          id="password"
          name="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter password"
          showPassword={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
          error={errors.password}
          delay={0.2}
        />

        <AuthPasswordField
          compact
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Confirm password"
          showPassword={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
          error={errors.confirmPassword}
          delay={0.24}
        />

        {formData.password ? (
          <motion.div {...authItemMotion(0.24)}>
            <PasswordStrengthMeter compact password={formData.password} />
          </motion.div>
        ) : null}

        <AuthPrimaryButton compact delay={0.28} disabled={isLoading || !isFormValid}>
          {isLoading ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              Creating Account...
            </>
          ) : (
            "Sign Up"
          )}
        </AuthPrimaryButton>

        {submitError ? (
          <motion.p
            {...authItemMotion(0.3)}
            className="text-center text-[12px] text-danger"
          >
            {submitError}
            {submitError.includes("already registered") ? (
              <>
                {" "}
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  Sign in
                </Link>
              </>
            ) : null}
          </motion.p>
        ) : null}

        <motion.p
          {...authItemMotion(0.32)}
          className="pt-0.5 text-center text-[12px] text-muted"
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-primary transition-colors hover:text-primary-hover dark:text-[#5B8CFF]"
          >
            Sign In
          </Link>
        </motion.p>
      </form>
    </AuthShell>
  );
}

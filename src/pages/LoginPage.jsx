import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import AuthShell from "@/components/auth/AuthShell";
import AuthInput from "@/components/auth/AuthInput";
import AuthDivider from "@/components/auth/AuthDivider";
import SocialAuthButtons from "@/components/auth/SocialAuthButtons";
import AuthPasswordField from "@/components/auth/AuthPasswordField";
import AuthPrimaryButton from "@/components/auth/AuthPrimaryButton";
import AuthAutofillTrap from "@/components/auth/AuthAutofillTrap";
import { authItemMotion } from "@/components/auth/authMotion";
import useAuthStore from "@/store/useAuthStore";
import { resolvePostLoginRedirect } from "@/lib/authNavigation";
import {
  authenticateDemoUser,
  getDefaultDashboardForRole,
} from "@/lib/demoCredentials";
import {
  trimLoginValues,
  validateLoginField,
  validateLoginForm,
} from "@/lib/authValidation";

const LOGIN_FIELDS = ["email", "password"];

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  const redirectTo =
    location.state?.from || getDefaultDashboardForRole("student");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [touched, setTouched] = useState({});

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const isFormValid = useMemo(
    () => validateLoginForm(formData).isValid,
    [formData]
  );

  const setFieldError = (name, nextFormData) => {
    setErrors((prev) => ({
      ...prev,
      [name]: validateLoginField(name, nextFormData),
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

    const trimmed = trimLoginValues(formData);
    const { errors: submitErrors, isValid } = validateLoginForm(trimmed);

    setTouched(
      LOGIN_FIELDS.reduce((acc, field) => ({ ...acc, [field]: true }), {})
    );
    setErrors(submitErrors);

    if (!isValid) return;

    const account = authenticateDemoUser(trimmed.email, trimmed.password);

    if (!account) {
      setErrors({
        email: "",
        password: "Invalid email or password. Use a demo account below.",
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      login(
        {
          ...account,
          rememberMe,
        },
        "mock-jwt-token"
      );

      navigate(resolvePostLoginRedirect(redirectTo, account.role), {
        replace: true,
      });
    }, 1200);
  };

  return (
    <AuthShell
      title="Sign In"
      subtitle="Enter your credentials to access your account"
    >
      <form onSubmit={handleSubmit} autoComplete="off" className="relative space-y-3.5" noValidate>
        <AuthAutofillTrap />
        <SocialAuthButtons delay={0.05} />

        <AuthDivider delay={0.1} />

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
          delay={0.14}
          inputProps={{ onBlur: handleBlur }}
        />

        <AuthPasswordField
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
          delay={0.18}
          autoComplete="current-password"
          extraAction={
            <Link
              to="/forgot-password"
              className="shrink-0 text-[10px] font-medium text-primary transition-colors hover:text-primary-hover sm:text-[11px]"
            >
              Forgot Password?
            </Link>
          }
        />

        <motion.label
          {...authItemMotion(0.22)}
          className="flex cursor-pointer items-center gap-2.5"
        >
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="
              h-4
              w-4
              rounded
              border-border
              bg-bg
              accent-primary
            "
          />
          <span className="text-[13px] text-muted">Remember me</span>
        </motion.label>

        <AuthPrimaryButton delay={0.26} disabled={isLoading || !isFormValid}>
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </AuthPrimaryButton>

        <motion.p
          {...authItemMotion(0.3)}
          className="pt-0.5 text-center text-[13px] text-muted"
        >
          Don&apos;t have an account yet?{" "}
          <Link
            to="/signup"
            state={{ from: location.state?.from }}
            className="font-semibold text-primary transition-colors hover:text-primary-hover"
          >
            Sign Up
          </Link>
        </motion.p>

        <motion.div
          {...authItemMotion(0.34)}
          className="mt-4 rounded-xl border border-border/80 bg-bg/60 p-3.5 text-left"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
            Demo credentials
          </p>
          <ul className="mt-2 space-y-1.5 text-[12px] text-muted">
            <li>
              <span className="font-medium text-text">Student:</span>{" "}
              student@cloudnexus.com / password123
            </li>
            <li>
              <span className="font-medium text-text">Mentor:</span>{" "}
              mentor@cloudnexus.com / password123
            </li>
            <li>
              <span className="font-medium text-text">Admin:</span>{" "}
              admin@cloudnexus.com / password123
            </li>
          </ul>
        </motion.div>
      </form>
    </AuthShell>
  );
}

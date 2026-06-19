import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      login(
        {
          username: formData.username,
          fullName: formData.username,
          role: "student",
          rememberMe,
        },
        "mock-jwt-token"
      );

      navigate("/student/dashboard");
    }, 1200);
  };

  return (
    <AuthShell
      title="Sign In"
      subtitle="Enter your credentials to access your account"
    >
      <form onSubmit={handleSubmit} autoComplete="off" className="relative space-y-3.5">
        <AuthAutofillTrap />
        <SocialAuthButtons delay={0.05} />

        <AuthDivider delay={0.1} />

        <AuthInput
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter username"
          required
          prefix="@"
          error={errors.username}
          delay={0.14}
        />

        <AuthPasswordField
          id="password"
          name="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter Password"
          showPassword={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
          error={errors.password}
          delay={0.18}
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

        <AuthPrimaryButton delay={0.26} disabled={isLoading}>
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
            className="font-semibold text-primary transition-colors hover:text-primary-hover"
          >
            Sign Up
          </Link>
        </motion.p>
      </form>
    </AuthShell>
  );
}

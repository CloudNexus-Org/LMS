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
import PasswordStrengthMeter from "@/components/ui/PasswordStrengthMeter";
import { authItemMotion } from "@/components/auth/authMotion";
import useAuthStore from "@/store/useAuthStore";

export default function SignupPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
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
          email: formData.email,
          fullName: formData.username,
          role: "student",
        },
        "mock-jwt-token"
      );

      navigate("/student/dashboard");
    }, 1500);
  };

  return (
    <AuthShell
      compact
      title="Create Account"
      subtitle="Please enter your details to get started"
    >
      <form onSubmit={handleSubmit} autoComplete="off" className="relative space-y-2.5">
        <AuthAutofillTrap />
        <SocialAuthButtons delay={0.04} />

        <AuthDivider delay={0.08} />

        <AuthInput
          compact
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter username"
          required
          prefix="@"
          error={errors.username}
          delay={0.12}
        />

        <AuthInput
          compact
          label="E-mail Address"
          name="email"
          type="text"
          inputMode="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter Email ID"
          required
          error={errors.email}
          delay={0.16}
        />

        <AuthPasswordField
          compact
          id="password"
          name="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter Password"
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
          placeholder="Confirm Password"
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

        <AuthPrimaryButton compact delay={0.28} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              Creating Account...
            </>
          ) : (
            "Sign Up"
          )}
        </AuthPrimaryButton>

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

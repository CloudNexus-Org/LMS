import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Shield, Sparkles } from "lucide-react";
import AuthInput from "@/components/auth/AuthInput";
import AuthPasswordField from "@/components/auth/AuthPasswordField";
import AuthPrimaryButton from "@/components/auth/AuthPrimaryButton";
import AuthAutofillTrap from "@/components/auth/AuthAutofillTrap";
import PasswordStrengthMeter from "@/components/ui/PasswordStrengthMeter";
import { authItemMotion } from "@/components/auth/authMotion";
import {
  MENTOR_TRACK_OPTIONS,
} from "@/data/adminUsers";
import useAuthStore from "@/store/useAuthStore";
import { createMentor } from "@/lib/api/userApi";
import { parseApiError } from "@/lib/api/apiHelpers";

const EASE = [0.16, 1, 0.3, 1];

const initialForm = {
  fullName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  professionalRole: "",
  company: "",
  trackLabel: MENTOR_TRACK_OPTIONS[0],
  location: "",
  bio: "",
};

export default function AddMentorPage() {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const next = {};

    if (!formData.fullName.trim()) next.fullName = "Full name is required";
    if (!formData.username.trim()) next.username = "Username is required";
    if (!formData.email.trim()) {
      next.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      next.email = "Please enter a valid email";
    }
    if (!formData.password) {
      next.password = "Password is required";
    } else if (formData.password.length < 8) {
      next.password = "Password must be at least 8 characters";
    }
    if (!formData.confirmPassword) {
      next.confirmPassword = "Please confirm the password";
    } else if (formData.confirmPassword !== formData.password) {
      next.confirmPassword = "Passwords do not match";
    }
    if (!formData.professionalRole.trim()) {
      next.professionalRole = "Professional role is required";
    }
    if (!formData.company.trim()) next.company = "Company is required";
    if (!formData.trackLabel) next.trackLabel = "Teaching track is required";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setSubmitError("");

    try {
      if (user && token) {
        await createMentor(user, token, {
          fullName: formData.fullName.trim(),
          username: formData.username.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          professionalRole: formData.professionalRole.trim(),
          company: formData.company.trim(),
          trackLabel: formData.trackLabel,
          location: formData.location.trim(),
          bio: formData.bio.trim(),
        });
      }

      navigate("/admin/users", {
        state: { mentorAdded: formData.fullName.trim() },
      });
    } catch (err) {
      setSubmitError(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="dashboard-page mx-auto w-full max-w-[720px] space-y-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <Link
        to="/admin/users"
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to user management
      </Link>

      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
          <Sparkles className="h-3 w-3" />
          Admin · Mentor onboarding
        </div>
        <h1 className="text-[32px] font-bold tracking-tight text-text sm:text-[36px]">
          Add Mentor
        </h1>
        <p className="text-[15px] text-muted">
          Create a mentor account with credentials and teaching profile — same fields as signup, plus mentor details.
        </p>
      </div>

      <div className="dashboard-card overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border bg-bg/40 px-5 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-text">Mentor account setup</p>
            <p className="text-xs text-muted">Account credentials &amp; teaching profile</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          className="space-y-3 p-5 sm:p-6"
        >
          <AuthAutofillTrap />

          <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Account details
          </p>

          <AuthInput
            compact
            label="Full name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Dr. Sarah Jenkins"
            required
            error={errors.fullName}
            delay={0.04}
          />

          <AuthInput
            compact
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="sarah.jenkins"
            required
            prefix="@"
            error={errors.username}
            delay={0.08}
          />

          <AuthInput
            compact
            label="E-mail address"
            name="email"
            type="text"
            inputMode="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="mentor@cloudnexus.com"
            required
            error={errors.email}
            delay={0.12}
          />

          <AuthPasswordField
            compact
            id="password"
            name="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a secure password"
            showPassword={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
            error={errors.password}
            delay={0.16}
          />

          <AuthPasswordField
            compact
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter password"
            showPassword={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
            error={errors.confirmPassword}
            delay={0.2}
          />

          {formData.password ? (
            <motion.div {...authItemMotion(0.2)}>
              <PasswordStrengthMeter compact password={formData.password} />
            </motion.div>
          ) : null}

          <p className="pt-2 text-[11px] font-bold uppercase tracking-wider text-muted">
            Teaching profile
          </p>

          <AuthInput
            compact
            label="Professional role"
            name="professionalRole"
            value={formData.professionalRole}
            onChange={handleChange}
            placeholder="Staff Software Engineer"
            required
            error={errors.professionalRole}
            delay={0.24}
          />

          <AuthInput
            compact
            label="Company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Ex-Google"
            required
            error={errors.company}
            delay={0.28}
          />

          <motion.div {...authItemMotion(0.32)}>
            <label
              htmlFor="trackLabel"
              className="mb-1.5 block text-[11px] font-medium text-muted"
            >
              Teaching track
              <span className="ml-0.5 text-danger" aria-hidden>
                *
              </span>
            </label>
            <div
              className={`flex h-11 items-center rounded-xl border bg-bg px-4 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 dark:bg-elevated ${
                errors.trackLabel
                  ? "border-danger focus-within:border-danger focus-within:ring-danger/15"
                  : "border-border dark:border-white/10"
              }`}
            >
              <select
                id="trackLabel"
                name="trackLabel"
                value={formData.trackLabel}
                onChange={handleChange}
                className="w-full bg-transparent text-[14px] text-text outline-none"
              >
                {MENTOR_TRACK_OPTIONS.map((track) => (
                  <option key={track} value={track}>
                    {track}
                  </option>
                ))}
              </select>
            </div>
            {errors.trackLabel ? (
              <p className="mt-1 text-[11px] text-danger">{errors.trackLabel}</p>
            ) : null}
          </motion.div>

          <AuthInput
            compact
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="San Francisco, CA"
            delay={0.36}
          />

          <motion.div {...authItemMotion(0.4)}>
            <label
              htmlFor="bio"
              className="mb-1.5 block text-[11px] font-medium text-muted"
            >
              Short bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              placeholder="Brief background and teaching focus..."
              className="w-full resize-none rounded-xl border border-border bg-bg px-4 py-3 text-[14px] text-text outline-none transition-all placeholder:text-subtle focus:border-primary focus:ring-2 focus:ring-primary/15 dark:border-white/10 dark:bg-elevated"
            />
          </motion.div>

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:items-center sm:justify-end">
            <Link
              to="/admin/users"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-border px-5 text-[13px] font-semibold text-muted transition-colors hover:border-primary/30 hover:text-text"
            >
              Cancel
            </Link>
            <div className="sm:min-w-[200px]">
              <AuthPrimaryButton compact delay={0.44} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Creating mentor...
                  </>
                ) : (
                  "Add mentor"
                )}
              </AuthPrimaryButton>
              {submitError ? (
                <p className="mt-2 text-center text-[12px] text-danger">{submitError}</p>
              ) : null}
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

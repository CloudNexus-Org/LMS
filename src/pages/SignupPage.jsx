import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  X,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2
} from "lucide-react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import PasswordStrengthMeter from "@/components/ui/PasswordStrengthMeter";
import useAuthStore from "@/store/useAuthStore";

export default function SignupPage() {

  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);

  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {

    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
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
          fullName: formData.fullName,
          role: 'student'
        },
        'mock-jwt-token'
      );

      navigate('/student/dashboard');

    }, 1500);
  };

  return (
    <>
      {/* MAIN */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-4">

        {/* MAIN BOX */}
        <div
          className="
            relative
            w-full max-w-[980px]
            h-[780px]
            overflow-hidden
            rounded-[5px]
          "
        >

          {/* ANIMATED BORDER */}
          <div className="absolute inset-[1px] rounded-[5px] p-[80px] overflow-hidden">

            {/* ROTATING BORDER */}
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

            {/* INNER BOX */}
            <div
              className="
                absolute inset-[3px]
                rounded-[5px]
                bg-elevated/90
                shadow-[0_30px_100px_rgba(0,0,0,0.35)]
                backdrop-blur-xl
              "
            />
          </div>

          {/* ORIGINAL CONTENT */}
          <div
            className="
              relative z-10 grid
              h-full
              md:grid-cols-[0.9fr_1.1fr]
            "
          >

            {/* LEFT MID GLOW */}
            <div
              className="
                pointer-events-none absolute
                left-0 top-1/2
                h-[120px] w-[2px]
                -translate-y-1/2
                bg-blue-500/80
                shadow-[0_0_20px_rgba(59,130,246,0.9)]
              "
            />

            {/* LEFT BOTTOM GLOW */}
            <div
              className="
                pointer-events-none absolute
                bottom-0 left-[80px]
                h-[2px] w-[140px]
                bg-blue-500/80
                shadow-[0_0_20px_rgba(59,130,246,0.9)]
              "
            />

            {/* CLOSE BUTTON */}
            <Link
              to="/"
              className="
                absolute right-5 top-5 z-20
                flex h-10 w-10 items-center justify-center
                rounded-full
                border border-border
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
                p-8
                md:flex md:flex-col
              "
            >

              {/* MAIN GLOW */}
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

              {/* ORB */}
              <div className="relative z-10 flex flex-1 items-center justify-center">

                {/* OUTER GLOW */}
                <div
                  className="
                    absolute h-[220px] w-[220px]
                    rounded-full
                    bg-blue-500/10
                    blur-[45px]
                  "
                />

                {/* SOFT RING */}
                <div
                  className="
                    absolute h-[175px] w-[175px]
                    rounded-full
                    border border-blue-500/10
                    shadow-[0_0_60px_rgba(59,130,246,0.22)]
                  "
                />

                {/* MAIN CIRCLE */}
                <div
                  className="
                    relative flex
                    h-[150px] w-[150px]
                    items-center justify-center
                    overflow-hidden
                    rounded-full
                    bg-bg
                    border border-blue-500/10
                    shadow-[0_0_45px_rgba(59,130,246,0.12)]
                  "
                >

                  {/* INNER BALL */}
                  <div
                    className="
                      h-[92px]
                      w-[92px]
                      animate-float
                      rounded-full
                      bg-gradient-to-br
                      from-blue-300
                      via-blue-500
                      to-blue-700
                      shadow-[0_0_35px_rgba(59,130,246,0.28)]
                    "
                  />

                </div>

              </div>

              {/* TEXT */}
              <div className="relative z-10 text-center">

                <h3 className="text-[28px] font-black text-text">
                  Join Cloud Nexus
                </h3>

                <p className="mt-2 text-[14px] leading-6 text-muted">
                  Create your account and start your
                  learning journey today.
                </p>

              </div>

            </div>

            {/* RIGHT PANEL */}
            <div
              style={{ fontFamily: "Arial, sans-serif" }}
              className="flex flex-col justify-center px-6 py-6 md:px-10"
            >

              {/* TITLE */}
              <h1
                style={{ fontFamily: "Arial, sans-serif" }}
                className="text-[38px] font-black tracking-[-0.04em] text-text"
              >
                Sign Up
              </h1>

              <p className="mt-1 text-[13px] leading-6 text-muted">
                Create your account to start your journey
              </p>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">

                {/* FULL NAME */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.15em] text-subtle">
                    Full Name
                  </label>

                  <div
                    className={`
                      flex h-[52px] items-center
                      rounded-[5px]
                      border ${errors.fullName ? 'border-danger' : 'border-border'}
                      bg-bg px-4
                      transition
                      focus-within:ring-2
                    `}
                  >
                    <input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      type="text"
                      placeholder="John Doe"
                      className="w-full bg-transparent text-[14px] text-text outline-none placeholder:text-subtle"
                    />
                  </div>
                </div>

                {/* USERNAME */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.15em] text-subtle">
                    Username
                  </label>

                  <div
                    className={`
                      flex h-[52px] items-center
                      rounded-[5px]
                      border ${errors.username ? 'border-danger' : 'border-border'}
                      bg-bg px-4
                      transition
                      focus-within:ring-2
                    `}
                  >
                    <span className="mr-3 text-muted">@</span>

                    <input
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      type="text"
                      placeholder="your_username"
                      className="w-full bg-transparent text-[14px] text-text outline-none placeholder:text-subtle"
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.15em] text-subtle">
                    Email Address
                  </label>

                  <div
                    className={`
                      flex h-[52px] items-center
                      rounded-[5px]
                      border ${errors.email ? 'border-danger' : 'border-border'}
                      bg-bg px-4
                      transition
                      focus-within:ring-2
                    `}
                  >
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="name@example.com"
                      className="w-full bg-transparent text-[14px] text-text outline-none placeholder:text-subtle"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.15em] text-subtle">
                    Password
                  </label>

                  <div
                    className={`
                      flex h-[52px] items-center
                      rounded-[5px]
                      border ${errors.password ? 'border-danger' : 'border-border'}
                      bg-bg px-4
                      transition
                      focus-within:ring-2
                    `}
                  >
                    <span className="mr-3 text-muted">🔓︎</span>

                    <input
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      type={showPassword ? "text" : "password"}
                      placeholder="Create password"
                      className="w-full bg-transparent text-[14px] text-text outline-none placeholder:text-subtle"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-muted transition hover:text-text"
                    >
                      {showPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>

                  <PasswordStrengthMeter password={formData.password} />
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="
                    flex h-[52px] w-full items-center justify-center gap-2
                    rounded-[5px]
                    bg-primary
                    text-[14px] font-bold
                    text-white
                    shadow-[0_10px_40px_rgba(59,130,246,0.35)]
                    transition duration-300
                    hover:-translate-y-1
                    hover:shadow-[0_20px_50px_rgba(59,130,246,0.45)]
                  "
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account →'
                  )}
                </button>

                {/* DIVIDER */}
                <div className="flex items-center gap-4 py-1">

                  <div className="h-px flex-1 bg-border" />

                  <span className="text-[11px] text-subtle">
                    or continue with
                  </span>

                  <div className="h-px flex-1 bg-border" />

                </div>

                {/* GOOGLE */}
                <button
                  type="button"
                  className="
                    flex h-[50px] w-full items-center justify-center gap-3
                    rounded-[5px]
                    border border-border
                    bg-bg
                    text-[13px] font-semibold text-text
                    transition
                    hover:border-primary/40
                    hover:bg-primary/5
                  "
                >
                  <FaGoogle />
                  Continue with Google
                </button>

                {/* GITHUB */}
                <button
                  type="button"
                  className="
                    flex h-[50px] w-full items-center justify-center gap-3
                    rounded-[5px]
                    border border-border
                    bg-bg
                    text-[13px] font-semibold text-text
                    transition
                    hover:border-primary/40
                    hover:bg-primary/5
                  "
                >
                  <FaGithub />
                  Continue with Github
                </button>

                {/* LOGIN */}
                <div className="pt-1 text-center">

                  <p className="mt-3 text-[12px] text-muted">

                    Already have an account?{" "}

                    <Link
                      to="/login"
                      className="font-semibold text-primary hover:underline"
                    >
                      Sign In
                    </Link>

                  </p>

                </div>

              </form>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}
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
import useAuthStore from "@/store/useAuthStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Set the user in the global store
      login({ username: formData.username, role: 'student' }, 'mock-jwt-token');
      navigate('/student/dashboard'); // Proceed to dashboard after "login"
    }, 1500);
  };

  return (
    <>
      {/* MAIN */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10">

        <div
          className="
            relative grid
            w-full max-w-[980px]
            h-[780px]
            overflow-hidden
            rounded-[34px]
            border-2 border-blue-500/90
            bg-elevated/90
            shadow-[0_30px_100px_rgba(0,0,0,0.35)]
            
            md:grid-cols-[0.9fr_1.1fr]
          "
        >

          {/* CLOSE BUTTON */}
          <Link
            to="/"
            className="
              absolute right-5 top-5 z-20
              flex h-10 w-10 items-center justify-center
              rounded-full border border-border
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
    p-10
    md:flex md:flex-col
  "
>

  {/* MAIN BLUE GLOW */}
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

  {/* EXTRA GLOW */}
  <div
    className="
      absolute left-1/2 top-[45%]
      h-[160px] w-[160px]
      
      -translate-x-1/2 -translate-y-1/2
      rounded-full
      bg-blue-500/30
       shadow-[0_0_20px_rgba(59,130,246,0.9)]
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

  {/* CENTER ORB */}
  <div className="relative z-10 flex flex-1 items-center justify-center">

    {/* OUTER GLOW */}
    <div
      className="
        absolute h-[50px] w-[50px]
        rounded-full
        bg-blue-500/20
        blur-[90px]
      "
    />

    {/* OUTER CIRCLE */}
    <div
      className="
        relative flex h-[150px] w-[150px]
        items-center justify-center
        rounded-full

        bg-bg

        shadow-[0_25px_70px_rgba(59,130,246,0.22)]
      "
    >

      {/* INNER BALL */}
      <div
        className="
          h-[90px] w-[90px]
          animate-float
          rounded-full

          bg-gradient-to-br
          from-blue-300
          via-blue-500
          to-blue-700

          shadow-[0_0_40px_rgba(59,130,246,0.55)]
        "
      />

    </div>

  </div>

  {/* TEXT */}
  <div className="relative z-10 text-center">

    <h3 className="text-[30px] font-black text-text">
      Welcome back,
    </h3>

    <p className="mt-3 text-[15px] leading-7 text-muted">
      Sign in to continue your learning journey and
      access your dashboard.
    </p>

  </div>
</div>

          {/* RIGHT PANEL */}
          <div className="flex flex-col justify-center px-6 py-10 md:px-12">

            {/* TITLE */}
            <h1 className="text-[42px] font-black tracking-[-0.04em] text-text">
              Sign In
            </h1>

            <p className="mt-2 text-[14px] leading-7 text-muted">
              Enter your credentials to access your account
            </p>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">

              {/* USERNAME */}
              <div>
                <label htmlFor="username" className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-subtle">
                  Username
                </label>
                <div
                  className={`
                    flex h-[58px] items-center
                    rounded-[16px]
                    border ${errors.username ? 'border-danger' : 'border-border'}
                    bg-bg px-4
                    transition
                    focus-within:${errors.username ? 'border-danger ring-danger/20' : 'border-primary ring-primary/20'}
                    focus-within:ring-2
                  `}
                >
                  <span className="mr-3 text-muted">@</span>
                  <input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    aria-invalid={!!errors.username}
                    type="text"
                    placeholder="your_username"
                    className="w-full bg-transparent text-[15px] text-text outline-none placeholder:text-subtle"
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 flex items-center gap-1 text-[12px] text-danger">
                    <AlertCircle size={14} /> {errors.username}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-subtle">
                    Password
                  </label>
                  <Link to="#" className="text-[12px] text-primary hover:underline font-medium">Forgot?</Link>
                </div>
                <div
                  className={`
                    flex h-[58px] items-center
                    rounded-[16px]
                    border ${errors.password ? 'border-danger' : 'border-border'}
                    bg-bg px-4
                    transition
                    focus-within:${errors.password ? 'border-danger ring-danger/20' : 'border-primary ring-primary/20'}
                    focus-within:ring-2
                  `}
                >
                  <span className="mr-3 text-muted">🔓︎</span>
                  <input
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    aria-invalid={!!errors.password}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full bg-transparent text-[15px] text-text outline-none placeholder:text-subtle"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted transition hover:text-text"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 flex items-center gap-1 text-[12px] text-danger">
                    <AlertCircle size={14} /> {errors.password}
                  </p>
                )}
              </div>

              {/* SIGN IN BUTTON */}
              <button
                type="submit"
                disabled={isLoading}
                className={`
                  flex h-[52px] w-full items-center justify-center gap-2
                  rounded-[16px]
                  bg-primary
                  text-[14px] font-bold
                  text-white
                  shadow-[0_10px_40px_rgba(59,130,246,0.35)]
                  transition duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_20px_50px_rgba(59,130,246,0.45)]
                  disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0
                `}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In →'
                )}
              </button>

              {/* DIVIDER */}
              <div className="flex items-center gap-4 py-2">

                <div className="h-px flex-1 bg-border" />

                <span className="text-[12px] text-subtle">
                  or continue with
                </span>

                <div className="h-px flex-1 bg-border" />

              </div>

              {/* GOOGLE */}
              <button
                type="button"
                className="
                  flex h-[54px] w-full items-center justify-center gap-3
                  rounded-[15px]
                  border border-border
                  bg-bg
                  text-[14px] font-semibold text-text
                  transition
                  hover:border-primary/40
                  hover:bg-primary/5
                "
              >

                <FaGoogle />

                Continue with Google

              </button>

              {/* APPLE */}
              <button
                type="button"
                className="
                  flex h-[54px] w-full items-center justify-center gap-3
                  rounded-[15px]
                  border border-border
                  bg-bg
                  text-[14px] font-semibold text-text
                  transition
                  hover:border-primary/40
                  hover:bg-primary/5
                "
              >

                <FaGithub />

                Continue with Github

              </button>

              {/* OTP LINKS */}
              <div className="pt-2 text-center">

                <div className="flex items-center justify-center gap-3 text-[13px]">

             

                </div>

                {/* SIGNUP */}
                <p className="mt-5 text-[13px] text-muted">

                  Don&apos;t have an account?{" "}

                  <Link
                    to="/signup"
                    className="font-semibold text-primary hover:underline"
                  >
                    Create one
                  </Link>

                </p>

              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}
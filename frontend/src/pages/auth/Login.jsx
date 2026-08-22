import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi";

import { loginUser } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const data = await loginUser(values);
      login(data);
      toast.success("Login Successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#111114] px-4 py-16">
      <div className="w-full max-w-md animate-card-in rounded-3xl border border-white/[0.08] bg-[#1A1A1E] p-14 sm:p-20 shadow-[0_1px_2px_rgba(0,0,0,0.3),0_16px_40px_rgba(0,0,0,0.4)]">

        {/* Logo */}
        <div className="mb-14 flex flex-col items-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-[#FF6C37] font-mono text-2xl font-bold text-white">
            {"</>"}
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            DevPilot
          </h1>
          <p className="mt-3 text-lg text-[#8B8B96]">
            Login to continue
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-9">
          <Field
            label="Email"
            icon={<FiMail />}
            type="email"
            placeholder="you@company.com"
            registration={register("email")}
            error={errors.email?.message}
            delay="0s"
          />

          <Field
            label="Password"
            icon={<FiLock />}
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            registration={register("password")}
            error={errors.password?.message}
            delay="0.06s"
            rightSlot={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="text-xl text-[#6B6B76] transition-colors duration-150 hover:text-[#D0D0D6]"
                tabIndex={-1}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            }
          />

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-[#8B8B96] transition-colors duration-150 hover:text-[#FF6C37]"
            >
              Forgot password?
            </Link>
          </div>

          <button
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-3 rounded-xl bg-[#FF6C37] px-4 py-5 text-lg font-semibold text-white transition-all duration-150 hover:bg-[#FF7D4D] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && (
              <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-90"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="my-11 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/[0.08]" />
          <span className="text-sm text-[#6B6B76]">or</span>
          <div className="h-px flex-1 bg-white/[0.08]" />
        </div>

        <p className="text-center text-lg text-[#8B8B96]">
          Don't have an account?
          <Link
            to="/signup"
            className="ml-2 font-medium text-[#FF6C37] transition-colors duration-150 hover:text-[#FF7D4D]"
          >
            Signup
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes card-in {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-card-in { animation: card-in 0.4s ease-out both; }

        @keyframes field-in {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-field-in { animation: field-in 0.35s ease-out both; }

        @media (prefers-reduced-motion: reduce) {
          .animate-card-in, .animate-field-in { animation: none; }
        }
      `}</style>
    </div>
  );
}

function Field({ label, icon, type, placeholder, registration, error, rightSlot, delay = "0s" }) {
  return (
    <div className="animate-field-in" style={{ animationDelay: delay }}>
      <label className="mb-2.5 block text-base font-medium text-[#B0B0BA]">
        {label}
      </label>
      <div
        className={`flex items-center gap-3.5 rounded-xl border bg-[#0F0F12] px-5 py-5 transition-all duration-150 focus-within:border-[#FF6C37] focus-within:ring-2 focus-within:ring-[#FF6C37]/20 ${
          error ? "border-red-500/60" : "border-white/[0.1]"
        }`}
      >
        <span className="text-[#6B6B76] text-xl">{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          {...registration}
          className="w-full bg-transparent text-lg text-white placeholder-[#55555F] outline-none"
        />
        {rightSlot}
      </div>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}
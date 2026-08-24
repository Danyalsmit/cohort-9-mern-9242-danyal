import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { signupSchema } from "../utils/validationSchemas";
import { signupUser } from "../api/authApi";
import { UserIcon, MailIcon, LockIcon, EyeIcon, EyeOffIcon, LoaderIcon, LogoIcon, AlertIcon } from "../components/Icons";

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      await signupUser(data);
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-600 rounded-xl shadow-lg shadow-amber-600/20 mb-4">
            <LogoIcon className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-slate-800">Create account</h1>
          <p className="text-stone-500 mt-2 text-sm">Start capturing your ideas today</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl border border-stone-200/80 shadow-xl shadow-stone-200/50 p-8 space-y-5"
        >
          <div>
            <label htmlFor="signup-name" className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <UserIcon />
              </div>
              <input
                id="signup-name"
                {...register("name")}
                placeholder="John Doe"
                className="w-full pl-11 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-slate-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white transition-all"
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                <AlertIcon />
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="signup-email" className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <MailIcon />
              </div>
              <input
                id="signup-email"
                type="email"
                {...register("email")}
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-slate-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white transition-all"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                <AlertIcon />
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="signup-password" className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <LockIcon />
              </div>
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Min 6 characters"
                className="w-full pl-11 pr-11 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-slate-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                <AlertIcon />
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-amber-700 hover:shadow-lg hover:shadow-amber-600/25 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <LoaderIcon />
                Creating account...
              </>
            ) : (
              "Sign up"
            )}
          </button>

          <p className="text-sm text-center text-stone-500 pt-1">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-amber-700 hover:text-amber-800 transition-colors">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { loginSchema } from "../utils/validationSchemas";
import { loginUser } from "../api/authApi";
import { setCredentials } from "../redux/slices/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

//   use form hook
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

// Submit Function
  const onSubmit = async (data) => {
    try {
      const res = await loginUser(data);
      dispatch(setCredentials({ user: res.data.user, token: res.data.token }));
      toast.success("Logged in successfully");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-gray-900">Log in</h1>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...register("email")}
            className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            {...register("password")}
            className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>

        <p className="text-sm text-center text-gray-600">
          Don't have an account? <Link to="/signup" className="text-indigo-600">Sign up</Link>
        </p>
      </form>
    </div>
  );
}
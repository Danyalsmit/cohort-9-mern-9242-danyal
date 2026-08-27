import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logoutUser } from "../api/authApi";
import { logout } from "../redux/slices/authSlice";
import { ArrowLeftIcon, MailIcon, UserIcon, CalendarIcon, LogoutIcon } from "../components/Icons";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
    } catch {
      toast.error("Logout request failed, but you've been signed out locally");
    } finally {
      dispatch(logout());
      navigate("/login");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
        <p className="text-stone-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <header className="bg-white/80 backdrop-blur-md border-b border-stone-200/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-2 text-stone-600 hover:text-slate-800 font-medium text-sm transition-colors"
            >
              <ArrowLeftIcon />
              Back to Notes
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full mb-4">
            <span className="font-display text-3xl font-bold text-amber-700">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-800">{user.name}</h1>
          <p className="text-stone-500 text-sm mt-1">Your personal profile</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-amber-600 shadow-sm">
                <UserIcon />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Full Name</p>
                <p className="text-sm font-semibold text-slate-800">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-amber-600 shadow-sm">
                <MailIcon />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Email Address</p>
                <p className="text-sm font-semibold text-slate-800">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-amber-600 shadow-sm">
                <CalendarIcon />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Member Since</p>
                <p className="text-sm font-semibold text-slate-800">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-stone-100 p-6">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2.5 rounded-xl font-semibold text-sm hover:bg-red-100 active:scale-[0.98] transition-all duration-200"
            >
              <LogoutIcon />
              Log Out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
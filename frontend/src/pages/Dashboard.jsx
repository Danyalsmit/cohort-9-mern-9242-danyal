import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logoutUser } from "../api/authApi";
import { logout } from "../redux/slices/authSlice";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
    } catch (err) {
      toast.error("Logout request failed, but you've been signed out locally");
    } finally {
      dispatch(logout());
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-between items-center p-6 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <div className="p-8">
        <p className="text-gray-600">Notes list coming soon...</p>
      </div>
    </div>
  );
}
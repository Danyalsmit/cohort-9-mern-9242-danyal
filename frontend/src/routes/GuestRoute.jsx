import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function GuestRoute({ children }) {
  const token = useSelector((state) => state.auth.token);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
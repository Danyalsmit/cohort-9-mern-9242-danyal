import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NoteEditor from "./pages/NoteEditor";
import Profile from "./pages/Profile";
import ProtectedRoute from "./routes/ProtectedRoute";
import GuestRoute from "./routes/GuestRoute";
import { getCurrentUser } from "./api/authApi";
import { setCredentials } from "./redux/slices/authSlice";

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    let cancelled = false;

    if (token && !user) {
      getCurrentUser()
        .then((res) => {
          if (!cancelled) {
            dispatch(setCredentials({ user: res.data.user, token }));
          }
        })
        .catch(() => {
          if (!cancelled) {
            dispatch(setCredentials({ user: null, token: null }));
          }
        });
    }

    return () => {
      cancelled = true;
    };
  }, [token, user, dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestRoute>
              <Signup />
            </GuestRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/new"
          element={
            <ProtectedRoute>
              <NoteEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/:id"
          element={
            <ProtectedRoute>
              <NoteEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { describe, it, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../redux/slices/authSlice";
import ProtectedRoute from "../ProtectedRoute";

const renderWithAuth = (token, initialRoute = "/dashboard") => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: { user: null, token } },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe("ProtectedRoute", () => {
  it("renders children when token exists", () => {
    renderWithAuth("fake-token");
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects to /login when token is missing", () => {
    renderWithAuth(null);
    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });
});
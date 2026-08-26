import { describe, it, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../redux/slices/authSlice";
import GuestRoute from "../GuestRoute";

const renderWithAuth = (token, initialRoute = "/login") => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: { user: null, token } },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route
            path="/login"
            element={
              <GuestRoute>
                <div>Login Page</div>
              </GuestRoute>
            }
          />
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe("GuestRoute", () => {
  it("renders children when no token exists", () => {
    renderWithAuth(null);
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("redirects to /dashboard when token exists", () => {
    renderWithAuth("fake-token");
    expect(screen.getByText("Dashboard Page")).toBeInTheDocument();
    expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
  });
});
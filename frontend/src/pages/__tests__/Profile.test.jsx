import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../../redux/slices/authSlice";
import Profile from "../Profile";

import * as authApi from "../../api/authApi";

jest.mock("../../api/authApi", () => ({
  logoutUser: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const renderProfile = (user) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: { user, token: "fake-token" } },
  });
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    </Provider>
  );
};

describe("Profile page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows a loading message when the user is not yet available", () => {
    renderProfile(null);
    expect(screen.getByText(/loading profile/i)).toBeInTheDocument();
  });

  it("renders the user's name and email", () => {
    renderProfile({
      id: 1,
      name: "Ali Khan",
      email: "ali@example.com",
      createdAt: "2024-01-15T00:00:00.000Z",
    });

    expect(screen.getAllByText("Ali Khan").length).toBeGreaterThan(0);
    expect(screen.getByText("ali@example.com")).toBeInTheDocument();
    expect(screen.getByText("15 January 2024")).toBeInTheDocument();
  });

  it("shows N/A for member-since date when createdAt is missing", () => {
    renderProfile({ id: 1, name: "Ali Khan", email: "ali@example.com" });
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it("logs out and redirects to /login when Log Out is clicked", async () => {
    authApi.logoutUser.mockResolvedValueOnce({});
    renderProfile({ id: 1, name: "Ali Khan", email: "ali@example.com" });

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /log out/i }));

    await waitFor(() => {
      expect(authApi.logoutUser).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("still logs out locally and redirects even if the API call fails", async () => {
    authApi.logoutUser.mockRejectedValueOnce(new Error("network error"));
    renderProfile({ id: 1, name: "Ali Khan", email: "ali@example.com" });

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /log out/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});
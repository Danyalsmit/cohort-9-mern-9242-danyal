import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../../redux/slices/authSlice";
import Signup from "../Signup";

import * as authApi from "../../api/authApi";

jest.mock("../../api/authApi", () => ({
  signupUser: jest.fn(),
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

const renderSignup = () => {
  const store = configureStore({ reducer: { auth: authReducer } });
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    </Provider>
  );
};

describe("Signup page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders name, email and password fields", () => {
    renderSignup();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
  });

  it("shows validation errors when submitting an empty form", async () => {
    renderSignup();
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /sign up/i }));

    expect(
      await screen.findByText(/at least 3 characters/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument();
  });

  it("calls signupUser and redirects to /login on valid submit", async () => {
    authApi.signupUser.mockResolvedValueOnce({ data: { id: 1 } });

    renderSignup();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/full name/i), "Ali Khan");
    await user.type(screen.getByLabelText(/^Email$/i), "ali@example.com");
    await user.type(screen.getByLabelText(/^Password$/i), "secret123");

    await user.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(authApi.signupUser).toHaveBeenCalledWith({
        name: "Ali Khan",
        email: "ali@example.com",
        password: "secret123",
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("shows an error toast when the API call fails", async () => {
    const toast = require("react-hot-toast").default;
    authApi.signupUser.mockRejectedValueOnce({
      response: { data: { message: "Email already in use" } },
    });

    renderSignup();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/full name/i), "Ali Khan");
    await user.type(screen.getByLabelText(/^Email$/i), "ali@example.com");
    await user.type(screen.getByLabelText(/^Password$/i), "secret123");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Email already in use");
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("toggles password visibility", async () => {
    renderSignup();
    const user = userEvent.setup();

    const passwordInput = screen.getByLabelText(/^Password$/i);
    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(screen.getByLabelText(/show password/i));
    expect(passwordInput).toHaveAttribute("type", "text");

    await user.click(screen.getByLabelText(/hide password/i));
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});
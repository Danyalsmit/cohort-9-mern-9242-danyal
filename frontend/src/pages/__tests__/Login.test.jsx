import { describe, it, expect, jest } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../../redux/slices/authSlice";
import Login from "../Login";

import * as authApi from "../../api/authApi";

jest.mock("../../api/authApi", () => ({
    loginUser: jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
    __esModule: true,
    default: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

const renderLogin = () => {
    const store = configureStore({ reducer: { auth: authReducer } });
    return render(
        <Provider store={store}>
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        </Provider>
    );
};

describe("Login page", () => {
    it("renders email and password fields", () => {
        renderLogin();
        expect(screen.getByLabelText(/^Email$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    });

    it("shows validation error when submitting empty form", async () => {
        renderLogin();
        const user = userEvent.setup();

        await user.click(screen.getByRole("button", { name: /log in/i }));

        expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
    });

    it("calls loginUser API on valid submit", async () => {
        authApi.loginUser.mockResolvedValueOnce({
            data: {
                token: "fake-token",
                user: { id: 1, name: "Test User", email: "test@example.com" },
            },
        });

        renderLogin();
        const user = userEvent.setup();

        await user.type(
            screen.getByLabelText(/^Email$/i),
            "test@example.com"
        );

        await user.type(
            screen.getByLabelText(/^Password$/i),
            "password123"
        );

        await user.click(
            screen.getByRole("button", { name: /log in/i })
        );

        await waitFor(() => {
            expect(authApi.loginUser).toHaveBeenCalledWith({
                email: "test@example.com",
                password: "password123",
            });
        });
    });
});
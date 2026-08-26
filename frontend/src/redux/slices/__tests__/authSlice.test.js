import { describe, it, expect, beforeEach } from "@jest/globals";
import authReducer, { setCredentials, logout } from "../authSlice";

describe("authSlice", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns initial state", () => {
    const state = authReducer(undefined, { type: "@@INIT" });
    expect(state.user).toBeNull();
  });

  it("sets user and token on setCredentials", () => {
    const initialState = { user: null, token: null };
    const action = setCredentials({
      user: { id: 1, name: "Test User", email: "test@example.com" },
      token: "fake-token",
    });

    const state = authReducer(initialState, action);

    expect(state.user).toEqual({ id: 1, name: "Test User", email: "test@example.com" });
    expect(state.token).toBe("fake-token");
  });

  it("stores token in localStorage on setCredentials", () => {
    const initialState = { user: null, token: null };
    const action = setCredentials({
      user: { id: 1, name: "Test User" },
      token: "fake-token",
    });

    authReducer(initialState, action);

    expect(localStorage.getItem("accessToken")).toBe("fake-token");
  });

  it("clears user and token on logout", () => {
    const loggedInState = {
      user: { id: 1, name: "Test User" },
      token: "fake-token",
    };

    const state = authReducer(loggedInState, logout());

    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  it("removes token from localStorage on logout", () => {
    localStorage.setItem("accessToken", "fake-token");
    const loggedInState = { user: { id: 1 }, token: "fake-token" };

    authReducer(loggedInState, logout());

    expect(localStorage.getItem("accessToken")).toBeNull();
  });
});
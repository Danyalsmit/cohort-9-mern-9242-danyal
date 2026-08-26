import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../../redux/slices/authSlice";
import Dashboard from "../Dashboard";

import * as notesApi from "../../api/notesApi";
import * as authApi from "../../api/authApi";

jest.mock("../../api/notesApi", () => ({
  getNotes: jest.fn(),
  deleteNote: jest.fn(),
}));

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

const sampleNotes = [
  { id: 1, title: "Grocery List", content: "<p>Milk, eggs, bread</p>", updatedAt: new Date().toISOString() },
  { id: 2, title: "Trip Plan", content: "<p>Book flights to Lahore</p>", updatedAt: new Date().toISOString() },
];

const renderDashboard = (preloadedState) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: preloadedState || {
      auth: { user: { id: 1, name: "Test User" }, token: "fake-token" },
    },
  });
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    </Provider>
  );
};

describe("Dashboard page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows notes after they load", async () => {
    notesApi.getNotes.mockResolvedValueOnce({ data: sampleNotes });

    renderDashboard();

    expect(await screen.findByText("Grocery List")).toBeInTheDocument();
    expect(screen.getByText("Trip Plan")).toBeInTheDocument();
    expect(screen.getByText("2 notes")).toBeInTheDocument();
  });

  it("shows an error message when loading notes fails", async () => {
    notesApi.getNotes.mockRejectedValueOnce({
      response: { data: { message: "Server unavailable" } },
    });

    renderDashboard();

    expect(await screen.findByText("Server unavailable")).toBeInTheDocument();
  });

  it("shows an empty state when there are no notes", async () => {
    notesApi.getNotes.mockResolvedValueOnce({ data: [] });

    renderDashboard();

    expect(await screen.findByText(/no notes yet/i)).toBeInTheDocument();
  });

  it("filters notes by the search query", async () => {
    notesApi.getNotes.mockResolvedValueOnce({ data: sampleNotes });
    renderDashboard();
    await screen.findByText("Grocery List");

    const user = userEvent.setup();
    await user.type(
      screen.getByPlaceholderText(/search notes/i),
      "flights"
    );

    expect(screen.queryByText("Grocery List")).not.toBeInTheDocument();
    expect(screen.getByText("Trip Plan")).toBeInTheDocument();
  });

  it("deletes a note when the delete button is clicked", async () => {
    notesApi.getNotes.mockResolvedValueOnce({ data: sampleNotes });
    notesApi.deleteNote.mockResolvedValueOnce({});

    renderDashboard();
    const card = (await screen.findByText("Grocery List")).closest("div.group");
    const user = userEvent.setup();

    await user.click(within(card).getByTitle("Delete"));

    await waitFor(() => {
      expect(notesApi.deleteNote).toHaveBeenCalledWith(1);
    });
    await waitFor(() => {
      expect(screen.queryByText("Grocery List")).not.toBeInTheDocument();
    });
  });

  it("logs out and redirects to /login", async () => {
    notesApi.getNotes.mockResolvedValueOnce({ data: [] });
    authApi.logoutUser.mockResolvedValueOnce({});

    renderDashboard();
    await screen.findByText(/no notes yet/i);

    const user = userEvent.setup();
    await user.click(screen.getByTitle("Logout"));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});
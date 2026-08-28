import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
} from "@jest/globals";

import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";

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
  {
    id: 1,
    title: "Grocery List",
    content: "<p>Milk, eggs, bread</p>",
    updatedAt: "2026-08-20T10:00:00.000Z",
  },
  {
    id: 2,
    title: "Trip Plan",
    content: "<p>Book flights to Lahore</p>",
    updatedAt: "2026-08-20T11:00:00.000Z",
  },
];


const renderDashboard = (preloadedState) => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },

    preloadedState:
      preloadedState || {
        auth: {
          user: {
            id: 1,
            name: "Test User",
          },
          token: "fake-token",
        },
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
    notesApi.getNotes.mockResolvedValueOnce({
      data: sampleNotes,
    });

    renderDashboard();

    expect(
      await screen.findByText("Grocery List")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Trip Plan")
    ).toBeInTheDocument();

    expect(
      screen.getByText("2 notes")
    ).toBeInTheDocument();
  });


  it("shows loading skeletons while notes are loading", async () => {
    let resolveRequest;

    notesApi.getNotes.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        })
    );

    renderDashboard();

    // Dashboard renders 8 skeleton cards.
    const skeletons = document.querySelectorAll(
      ".animate-pulse"
    );

    expect(skeletons.length).toBe(8);

    resolveRequest({
      data: [],
    });

    expect(
      await screen.findByText(/no notes yet/i)
    ).toBeInTheDocument();
  });


  it("shows an error message when loading notes fails", async () => {
    notesApi.getNotes.mockRejectedValueOnce({
      response: {
        data: {
          message: "Server unavailable",
        },
      },
    });

    renderDashboard();

    expect(
      await screen.findByText("Server unavailable")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /try again/i,
      })
    ).toBeInTheDocument();
  });


  it("shows default error message when API error has no message", async () => {
    notesApi.getNotes.mockRejectedValueOnce(
      new Error("Network error")
    );

    renderDashboard();

    expect(
      await screen.findByText("Failed to load notes")
    ).toBeInTheDocument();
  });


  it("shows an empty state when there are no notes", async () => {
    notesApi.getNotes.mockResolvedValueOnce({
      data: [],
    });

    renderDashboard();

    expect(
      await screen.findByText(/no notes yet/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /start writing — your first note is one click away/i
      )
    ).toBeInTheDocument();
  });


  it("shows singular note when there is only one note", async () => {
    notesApi.getNotes.mockResolvedValueOnce({
      data: [sampleNotes[0]],
    });

    renderDashboard();

    await screen.findByText("Grocery List");

    expect(
      screen.getByText("1 note")
    ).toBeInTheDocument();
  });


  it("filters notes by title", async () => {
    notesApi.getNotes.mockResolvedValueOnce({
      data: sampleNotes,
    });

    renderDashboard();

    await screen.findByText("Grocery List");

    const user = userEvent.setup();

    const searchInput = screen.getByRole("textbox", {
      name: "Search notes",
    });

    await user.type(searchInput, "grocery");

    expect(
      screen.getByText("Grocery List")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Trip Plan")
    ).not.toBeInTheDocument();
  });


  it("filters notes by content", async () => {
    notesApi.getNotes.mockResolvedValueOnce({
      data: sampleNotes,
    });

    renderDashboard();

    await screen.findByText("Grocery List");

    const user = userEvent.setup();

    const searchInput = screen.getByRole("textbox", {
      name: "Search notes",
    });

    await user.type(searchInput, "lahore");

    expect(
      screen.getByText("Trip Plan")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Grocery List")
    ).not.toBeInTheDocument();
  });


  it("searches notes case-insensitively", async () => {
    notesApi.getNotes.mockResolvedValueOnce({
      data: sampleNotes,
    });

    renderDashboard();

    await screen.findByText("Grocery List");

    const user = userEvent.setup();

    const searchInput = screen.getByRole("textbox", {
      name: "Search notes",
    });

    await user.type(searchInput, "GROCERY");

    expect(
      screen.getByText("Grocery List")
    ).toBeInTheDocument();
  });

  it("trims whitespace from search query", async () => {
    notesApi.getNotes.mockResolvedValueOnce({
      data: sampleNotes,
    });

    renderDashboard();

    await screen.findByText("Grocery List");

    const user = userEvent.setup();

    const searchInput = screen.getByRole("textbox", {
      name: "Search notes",
    });

    await user.type(searchInput, "   grocery   ");

    expect(
      screen.getByText("Grocery List")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Trip Plan")
    ).not.toBeInTheDocument();
  });


  it("shows no matches when search returns no results", async () => {
    notesApi.getNotes.mockResolvedValueOnce({
      data: sampleNotes,
    });

    renderDashboard();

    await screen.findByText("Grocery List");

    const user = userEvent.setup();

    const searchInput = screen.getByRole("textbox", {
      name: "Search notes",
    });

    await user.type(searchInput, "xyz-not-found");

    expect(
      screen.getByText("No matches found")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /try adjusting your search terms/i
      )
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Grocery List")
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("Trip Plan")
    ).not.toBeInTheDocument();
  });


  it("shows all notes again when search is cleared", async () => {
    notesApi.getNotes.mockResolvedValueOnce({
      data: sampleNotes,
    });

    renderDashboard();

    await screen.findByText("Grocery List");

    const user = userEvent.setup();

    const searchInput = screen.getByRole("textbox", {
      name: "Search notes",
    });

    await user.type(searchInput, "grocery");

    expect(
      screen.queryByText("Trip Plan")
    ).not.toBeInTheDocument();

    await user.clear(searchInput);

    expect(
      screen.getByText("Grocery List")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Trip Plan")
    ).toBeInTheDocument();
  });


  it("deletes a note when the delete button is clicked", async () => {
    notesApi.getNotes.mockResolvedValueOnce({
      data: sampleNotes,
    });

    notesApi.deleteNote.mockResolvedValueOnce({});

    renderDashboard();

    expect(
      await screen.findByText("Grocery List")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Trip Plan")
    ).toBeInTheDocument();

    const user = userEvent.setup();

    const deleteButtons = screen.getAllByRole("button", {
      name: "Delete note",
    });

    expect(deleteButtons).toHaveLength(2);

    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(
        notesApi.deleteNote
      ).toHaveBeenCalledTimes(1);
    });

    expect(
      notesApi.deleteNote
    ).toHaveBeenCalledWith(1);

    await waitFor(() => {
      expect(
        screen.queryByText("Grocery List")
      ).not.toBeInTheDocument();
    });

    expect(
      screen.getByText("Trip Plan")
    ).toBeInTheDocument();
  });


  it("shows an error toast when deleting a note fails", async () => {
    notesApi.getNotes.mockResolvedValueOnce({
      data: sampleNotes,
    });

    notesApi.deleteNote.mockRejectedValueOnce(
      new Error("Delete failed")
    );

    renderDashboard();

    await screen.findByText("Grocery List");

    const user = userEvent.setup();

    const deleteButtons = screen.getAllByRole("button", {
      name: "Delete note",
    });

    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(
        notesApi.deleteNote
      ).toHaveBeenCalledWith(1);
    });

    expect(
      screen.getByText("Grocery List")
    ).toBeInTheDocument();
  });

  it("navigates to note page when edit is clicked", async () => {
    notesApi.getNotes.mockResolvedValueOnce({
      data: sampleNotes,
    });

    renderDashboard();

    await screen.findByText("Grocery List");

    const user = userEvent.setup();

    const editButtons = screen.getAllByRole("button", {
      name: /edit note/i,
    });

    await user.click(editButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/notes/1"
    );
  });


  it("navigates to profile when profile button is clicked", async () => {
    notesApi.getNotes.mockResolvedValueOnce({
      data: [],
    });

    renderDashboard();

    await screen.findByText(/no notes yet/i);

    const user = userEvent.setup();

    const profileButton = screen.getByRole("button", {
      name: "Open profile",
    });

    await user.click(profileButton);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/profile"
    );
  });


  it("navigates to new note page from empty state", async () => {
    notesApi.getNotes.mockResolvedValueOnce({
      data: [],
    });

    renderDashboard();

    await screen.findByText(/no notes yet/i);

    const user = userEvent.setup();

    const createButton = screen.getByRole("button", {
      name: /create your first note/i,
    });

    await user.click(createButton);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/notes/new"
    );
  });

  it("logs out and redirects to /login", async () => {
    notesApi.getNotes.mockResolvedValueOnce({
      data: [],
    });

    authApi.logoutUser.mockResolvedValueOnce({});

    renderDashboard();

    await screen.findByText(/no notes yet/i);

    const user = userEvent.setup();

    const logoutButton = screen.getByRole("button", {
      name: "Logout",
    });

    await user.click(logoutButton);

    await waitFor(() => {
      expect(
        mockNavigate
      ).toHaveBeenCalledWith("/login");
    });

    expect(
      authApi.logoutUser
    ).toHaveBeenCalledTimes(1);
  });


  it("still logs out locally when logout API fails", async () => {
    notesApi.getNotes.mockResolvedValueOnce({
      data: [],
    });

    authApi.logoutUser.mockRejectedValueOnce(
      new Error("Logout failed")
    );

    renderDashboard();

    await screen.findByText(/no notes yet/i);

    const user = userEvent.setup();

    const logoutButton = screen.getByRole("button", {
      name: "Logout",
    });

    await user.click(logoutButton);

    await waitFor(() => {
      expect(
        mockNavigate
      ).toHaveBeenCalledWith("/login");
    });

    expect(
      authApi.logoutUser
    ).toHaveBeenCalledTimes(1);
  });


  it("shows first letter of user name in profile button", async () => {
    notesApi.getNotes.mockResolvedValueOnce({
      data: [],
    });

    renderDashboard();

    await screen.findByText(/no notes yet/i);

    const profileButton = screen.getByRole("button", {
      name: "Open profile",
    });

    expect(profileButton).toHaveTextContent("T");
  });



  it("shows U when user name is unavailable", async () => {
    notesApi.getNotes.mockResolvedValueOnce({
      data: [],
    });

    renderDashboard({
      auth: {
        user: null,
        token: "fake-token",
      },
    });

    await screen.findByText(/no notes yet/i);

    const profileButton = screen.getByRole("button", {
      name: "Open profile",
    });

    expect(profileButton).toHaveTextContent("U");
  });
});

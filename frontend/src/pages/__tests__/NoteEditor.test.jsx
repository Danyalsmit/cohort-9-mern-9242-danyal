
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import NoteEditor from "../NoteEditor";

import {
    getNoteById,
    createNote,
    updateNote,
} from "../../api/notesApi";

import toast from "react-hot-toast";


const mockNavigate = jest.fn();
const mockGetHTML = jest.fn();
const mockSetContent = jest.fn();

let mockEditor;

jest.mock("react-router-dom", () => ({
    useParams: jest.fn(),
    useNavigate: () => mockNavigate,
}));

jest.mock("../../api/notesApi", () => ({
    getNoteById: jest.fn(),
    createNote: jest.fn(),
    updateNote: jest.fn(),
}));


jest.mock("react-hot-toast", () => ({
    __esModule: true,
    default: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

jest.mock("@tiptap/react", () => ({
    useEditor: jest.fn(() => mockEditor),

    EditorContent: () => (
        <div data-testid="editor-content">
            Mock Editor
        </div>
    ),
}));

jest.mock("@tiptap/starter-kit", () => ({
    __esModule: true,
    default: {},
}));

jest.mock("@tiptap/extension-character-count", () => ({
    __esModule: true,
    default: {},
}));

jest.mock("../../components/EditorToolbar", () => ({
    __esModule: true,
    default: () => (
        <div data-testid="editor-toolbar">
            Editor Toolbar
        </div>
    ),
}));

jest.mock("../../components/Icons", () => ({
    ArrowLeftIcon: () => <span data-testid="back-icon" />,
    SaveIcon: () => <span data-testid="save-icon" />,
}));


const { useParams } = require("react-router-dom");

beforeEach(() => {
    jest.clearAllMocks();

    mockGetHTML.mockReturnValue("<p>Test note content</p>");

    mockEditor = {
        getHTML: mockGetHTML,
        commands: {
            setContent: mockSetContent,
        },
        storage: {
            characterCount: {
                characters: jest.fn(() => 10),
            },
        },
    };

    useParams.mockReturnValue({});
});

describe("NoteEditor", () => {
    test("renders create mode correctly", () => {
        render(<NoteEditor />);

        expect(
            screen.getByPlaceholderText("Note title")
        ).toBeInTheDocument();

        expect(screen.getByText("Creating new note")).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: /save/i })
        ).toBeInTheDocument();

        expect(screen.getByText("10 characters")).toBeInTheDocument();

        expect(screen.getByTestId("editor-content")).toBeInTheDocument();

        expect(screen.getByTestId("editor-toolbar")).toBeInTheDocument();
    });

    test("allows user to enter a note title", async () => {
        const user = userEvent.setup();

        render(<NoteEditor />);

        const titleInput = screen.getByPlaceholderText("Note title");

        await user.type(titleInput, "My First Note");

        expect(titleInput).toHaveValue("My First Note");
    });

    test("shows validation error when saving without a title", async () => {
        const user = userEvent.setup();

        render(<NoteEditor />);

        const saveButton = screen.getByRole("button", {
            name: /save/i,
        });

        await user.click(saveButton);

        expect(toast.error).toHaveBeenCalledWith(
            "Title is required"
        );

        expect(createNote).not.toHaveBeenCalled();
        expect(updateNote).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    test("creates a new note successfully", async () => {
        const user = userEvent.setup();

        createNote.mockResolvedValue({
            data: {
                id: "123",
            },
        });

        render(<NoteEditor />);

        const titleInput = screen.getByPlaceholderText("Note title");

        await user.type(titleInput, "My First Note");

        await user.click(
            screen.getByRole("button", { name: /save/i })
        );

        await waitFor(() => {
            expect(createNote).toHaveBeenCalledWith({
                title: "My First Note",
                content: "<p>Test note content</p>",
            });
        });

        expect(toast.success).toHaveBeenCalledWith(
            "Note created"
        );

        expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });

    test("shows Saving state while creating a note", async () => {
        const user = userEvent.setup();

        let resolveCreate;

        createNote.mockImplementation(
            () =>
                new Promise((resolve) => {
                    resolveCreate = resolve;
                })
        );

        render(<NoteEditor />);

        await user.type(
            screen.getByPlaceholderText("Note title"),
            "My Note"
        );

        await user.click(
            screen.getByRole("button", { name: /^save$/i })
        );

        expect(
            screen.getByRole("button", { name: /saving/i })
        ).toBeDisabled();

        resolveCreate({
            data: {
                id: "123",
            },
        });

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith(
                "Note created"
            );
        });
    });

    test("shows API error message when creating note fails", async () => {
        const user = userEvent.setup();

        createNote.mockRejectedValue({
            response: {
                data: {
                    message: "Unable to create note",
                },
            },
        });

        render(<NoteEditor />);

        await user.type(
            screen.getByPlaceholderText("Note title"),
            "My Note"
        );

        await user.click(
            screen.getByRole("button", { name: /save/i })
        );

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                "Unable to create note"
            );
        });

        expect(mockNavigate).not.toHaveBeenCalled();
    });

    test("shows generic error when create API fails without message", async () => {
        const user = userEvent.setup();

        createNote.mockRejectedValue(new Error("Network error"));

        render(<NoteEditor />);

        await user.type(
            screen.getByPlaceholderText("Note title"),
            "My Note"
        );

        await user.click(
            screen.getByRole("button", { name: /save/i })
        );

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                "Failed to save note"
            );
        });
    });

    test("loads an existing note in edit mode", async () => {
        useParams.mockReturnValue({
            id: "123",
        });

        getNoteById.mockResolvedValue({
            data: {
                title: "Existing Note",
                content: "<p>Existing content</p>",
            },
        });

        render(<NoteEditor />);

        expect(
            screen.getByText("Loading note...")
        ).toBeInTheDocument();

        await waitFor(() => {
            expect(getNoteById).toHaveBeenCalledWith("123");
        });

        await waitFor(() => {
            expect(
                screen.getByDisplayValue("Existing Note")
            ).toBeInTheDocument();
        });

        expect(
            screen.getByText("Editing existing note")
        ).toBeInTheDocument();

        await waitFor(() => {
            expect(mockSetContent).toHaveBeenCalledWith(
                "<p>Existing content</p>"
            );
        });
    });

    test("updates an existing note successfully", async () => {
        const user = userEvent.setup();

        useParams.mockReturnValue({
            id: "123",
        });

        getNoteById.mockResolvedValue({
            data: {
                title: "Old Title",
                content: "<p>Old content</p>",
            },
        });

        updateNote.mockResolvedValue({
            data: {
                id: "123",
            },
        });

        render(<NoteEditor />);

        await waitFor(() => {
            expect(
                screen.getByDisplayValue("Old Title")
            ).toBeInTheDocument();
        });

        const titleInput = screen.getByDisplayValue("Old Title");

        await user.clear(titleInput);
        await user.type(titleInput, "Updated Title");

        await user.click(
            screen.getByRole("button", { name: /save/i })
        );

        await waitFor(() => {
            expect(updateNote).toHaveBeenCalledWith("123", {
                title: "Updated Title",
                content: "<p>Test note content</p>",
            });
        });

        expect(toast.success).toHaveBeenCalledWith(
            "Note updated"
        );

        expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });

    test("shows API error message when updating note fails", async () => {
        const user = userEvent.setup();

        useParams.mockReturnValue({
            id: "123",
        });

        getNoteById.mockResolvedValue({
            data: {
                title: "Existing Note",
                content: "<p>Existing content</p>",
            },
        });

        updateNote.mockRejectedValue({
            response: {
                data: {
                    message: "Unable to update note",
                },
            },
        });

        render(<NoteEditor />);

        await waitFor(() => {
            expect(
                screen.getByDisplayValue("Existing Note")
            ).toBeInTheDocument();
        });

        await user.click(
            screen.getByRole("button", { name: /save/i })
        );

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                "Unable to update note"
            );
        });

        expect(mockNavigate).not.toHaveBeenCalled();
    });

    test("navigates to dashboard when Back is clicked", async () => {
        const user = userEvent.setup();

        render(<NoteEditor />);

        await user.click(
            screen.getByRole("button", { name: /back/i })
        );

        expect(mockNavigate).toHaveBeenCalledWith(
            "/dashboard"
        );
    });

    test("navigates to dashboard when Cancel is clicked", async () => {
        const user = userEvent.setup();

        render(<NoteEditor />);

        await user.click(
            screen.getByRole("button", { name: /cancel/i })
        );

        expect(mockNavigate).toHaveBeenCalledWith(
            "/dashboard"
        );
    });

    test("handles note loading failure", async () => {
        useParams.mockReturnValue({
            id: "123",
        });

        getNoteById.mockRejectedValue(
            new Error("Failed to load")
        );

        render(<NoteEditor />);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                "Failed to load note"
            );
        });

        expect(mockNavigate).toHaveBeenCalledWith(
            "/dashboard"
        );
    });
});


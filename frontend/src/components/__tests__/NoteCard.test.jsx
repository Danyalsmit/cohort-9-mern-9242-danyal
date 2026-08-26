import { describe, it, expect, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NoteCard from "../NoteCard";

const mockNote = {
  id: 1,
  title: "Test Note",
  content: "<p>This is test content</p>",
  updatedAt: "2026-08-20T10:00:00.000Z",
};

describe("NoteCard", () => {
  it("renders note title", () => {
    render(<NoteCard note={mockNote} onDelete={jest.fn()} onEdit={jest.fn()} index={0} />);
    expect(screen.getByText("Test Note")).toBeInTheDocument();
  });

  it("renders note content", () => {
    render(<NoteCard note={mockNote} onDelete={jest.fn()} onEdit={jest.fn()} index={0} />);
    expect(screen.getByText("This is test content")).toBeInTheDocument();
  });

  it("shows empty note message when content is missing", () => {
    const emptyNote = { ...mockNote, content: "" };
    render(<NoteCard note={emptyNote} onDelete={jest.fn()} onEdit={jest.fn()} index={0} />);
    expect(screen.getByText(/empty note/i)).toBeInTheDocument();
  });

  it("calls onEdit with note id when Edit button is clicked", async () => {
    const onEdit = jest.fn();
    render(<NoteCard note={mockNote} onDelete={jest.fn()} onEdit={onEdit} index={0} />);
    const user = userEvent.setup();

    await user.click(screen.getByTitle(/edit/i));
    expect(onEdit).toHaveBeenCalledWith(1);
  });

  it("calls onDelete with note id when Delete button is clicked", async () => {
    const onDelete = jest.fn();
    render(<NoteCard note={mockNote} onDelete={onDelete} onEdit={jest.fn()} index={0} />);
    const user = userEvent.setup();

    await user.click(screen.getByTitle(/delete/i));
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it("sanitizes malicious content (XSS protection)", () => {
    const maliciousNote = {
      ...mockNote,
      content: "<img src=x onerror=\"window.__xss=true\">",
    };
    render(<NoteCard note={maliciousNote} onDelete={jest.fn()} onEdit={jest.fn()} index={0} />);
    expect(window.__xss).toBeUndefined();
  });
});
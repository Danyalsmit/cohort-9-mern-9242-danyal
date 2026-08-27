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

const renderNoteCard = (props = {}) => {
  return render(
    <NoteCard
      note={mockNote}
      onDelete={jest.fn()}
      onEdit={jest.fn()}
      index={0}
      {...props}
    />
  );
};

describe("NoteCard", () => {
  it("renders note title", () => {
    renderNoteCard();

    expect(screen.getByText("Test Note")).toBeInTheDocument();
  });

  it("renders note content", () => {
    renderNoteCard();

    expect(
      screen.getByText("This is test content")
    ).toBeInTheDocument();
  });

  it("shows empty note message when content is missing", () => {
    renderNoteCard({
      note: {
        ...mockNote,
        content: "",
      },
    });

    expect(
      screen.getByText(/empty note/i)
    ).toBeInTheDocument();
  });

  it("calls onEdit with note id when Edit button is clicked", async () => {
    const onEdit = jest.fn();

    renderNoteCard({
      onEdit,
    });

    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", {
        name: /edit note/i,
      })
    );

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(1);
  });

  it("calls onDelete with note id when Delete button is clicked", async () => {
    const onDelete = jest.fn();

    renderNoteCard({
      onDelete,
    });

    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", {
        name: /delete note/i,
      })
    );

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it("opens note when the card is clicked", async () => {
    const onEdit = jest.fn();

    renderNoteCard({
      onEdit,
    });

    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", {
        name: /open note: test note/i,
      })
    );

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(1);
  });

  it("opens note with keyboard Enter", async () => {
    const onEdit = jest.fn();

    renderNoteCard({
      onEdit,
    });

    const user = userEvent.setup();

    const card = screen.getByRole("button", {
      name: /open note: test note/i,
    });

    card.focus();

    await user.keyboard("{Enter}");

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(1);
  });

  it("opens note with keyboard Space", async () => {
    const onEdit = jest.fn();

    renderNoteCard({
      onEdit,
    });

    const user = userEvent.setup();

    const card = screen.getByRole("button", {
      name: /open note: test note/i,
    });

    card.focus();

    await user.keyboard(" ");

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(1);
  });

  it("sanitizes malicious content", () => {
    const maliciousNote = {
      ...mockNote,
      content:
        '<img src="x" onerror="window.__xss=true"><script>window.__xss=true</script>',
    };

    renderNoteCard({
      note: maliciousNote,
    });

    const preview = document.querySelector(".note-preview");

    expect(preview).toBeInTheDocument();
    expect(preview.querySelector("script")).not.toBeInTheDocument();
    expect(preview.querySelector("img")).not.toHaveAttribute("onerror");
  });
});

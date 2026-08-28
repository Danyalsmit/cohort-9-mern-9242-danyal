import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import axiosInstance from "../axiosInstance";
import * as notesApi from "../notesApi";

jest.mock("../axiosInstance");

describe("notesApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getNotes calls GET /notes", () => {
    notesApi.getNotes();
    expect(axiosInstance.get).toHaveBeenCalledWith("/notes");
  });

  it("getNoteById calls GET /notes/:id", () => {
    notesApi.getNoteById(5);
    expect(axiosInstance.get).toHaveBeenCalledWith("/notes/5");
  });

  it("createNote calls POST /notes with data", () => {
    const data = { title: "Test", content: "<p>Hello</p>" };
    notesApi.createNote(data);
    expect(axiosInstance.post).toHaveBeenCalledWith("/notes", data);
  });

  it("updateNote calls PUT /notes/:id with data", () => {
    const data = { title: "Updated", content: "<p>Updated</p>" };
    notesApi.updateNote(5, data);
    expect(axiosInstance.put).toHaveBeenCalledWith("/notes/5", data);
  });

  it("deleteNote calls DELETE /notes/:id", () => {
    notesApi.deleteNote(5);
    expect(axiosInstance.delete).toHaveBeenCalledWith("/notes/5");
  });
});
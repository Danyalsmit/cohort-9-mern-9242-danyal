import axiosInstance from "./axiosInstance";

export const getNotes = () => axiosInstance.get("/notes");
export const getNoteById = (id) => axiosInstance.get(`/notes/${id}`);
export const createNote = (data) => axiosInstance.post("/notes", data);
export const updateNote = (id, data) => axiosInstance.put(`/notes/${id}`, data);
export const deleteNote = (id) => axiosInstance.delete(`/notes/${id}`);
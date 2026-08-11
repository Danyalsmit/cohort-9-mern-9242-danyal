import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

import { createNote, getUserNotes, getNoteById, updateNote, deleteNote } from '../services/notesService.js';

export const create = asyncHandler(async (req, res) => {
  const { title, content } = req.body ?? {};
  if (!title || typeof title !== 'string' || !title.trim()) {
    throw new AppError('Title is required', 400);
  }
  const note = await createNote({ title, content, userId: req.user.id });
  res.status(201).json(note);
});

export const getAll = asyncHandler(async (req, res) => {
  const notes = await getUserNotes(req.user.id);
  res.json(notes);
});

export const getOne = asyncHandler(async (req, res) => {
  const note = await getNoteById(req.params.id, req.user.id);
  res.json(note);
});

export const update = asyncHandler(async (req, res) => {
  const { title, content } = req.body ?? {};
  const note = await updateNote(req.params.id, req.user.id, { title, content });
  res.json(note);
});

export const remove = asyncHandler(async (req, res) => {
  await deleteNote(req.params.id, req.user.id);
  res.json({ message: 'Note deleted successfully' });
});
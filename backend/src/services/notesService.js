import prisma from '../config/prisma.js';
import AppError from '../utils/AppError.js';

//  create Notes
export const createNote = async ({ title, content, userId }) => {
  return prisma.note.create({ data: { title, content, userId } });
};

// Get Notes
export const getUserNotes = async (userId) => {
  return prisma.note.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
};

// Get Single Notes
export const getNoteById = async (id, userId) => {
  const note = await prisma.note.findUnique({ where: { id: Number(id) } });
  if (!note) throw new AppError('Note not found', 404);
  if (note.userId !== userId) throw new AppError('Not authorized to access this note', 403);
  return note;
};

// Update Notes 
export const updateNote = async (id, userId, { title, content }) => {
  await getNoteById(id, userId);
  return prisma.note.update({
    where: { id: Number(id) },
    data: { title, content },
  });
};

// Delete Notes 
export const deleteNote = async (id, userId) => {
  await getNoteById(id, userId);
  return prisma.note.delete({ where: { id: Number(id) } });
};
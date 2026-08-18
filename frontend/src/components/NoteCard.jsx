export default function NoteCard({ note, onDelete, onEdit }) {
  const preview = note.content.replace(/<[^>]+>/g, "").slice(0, 100);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition">
      <h3 className="font-semibold text-lg text-gray-900 truncate">{note.title}</h3>
      <p className="text-gray-600 text-sm mt-2 line-clamp-3">{preview}</p>
      <p className="text-xs text-gray-400 mt-3">
        {new Date(note.updatedAt).toLocaleDateString()}
      </p>
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onEdit(note.id)}
          className="text-indigo-600 text-sm hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(note.id)}
          className="text-red-600 text-sm hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
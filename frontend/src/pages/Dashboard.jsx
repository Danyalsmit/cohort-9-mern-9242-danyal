import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logoutUser } from "../api/authApi";
import { getNotes, deleteNote } from "../api/notesApi";
import { logout } from "../redux/slices/authSlice";
import NoteCard from "../components/NoteCard";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const res = await getNotes();
        setNotes(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load notes");
      } finally {
        setLoading(false);
      }
    };
    loadNotes();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
    } catch (err) {
      toast.error("Logout request failed, but you've been signed out locally");
    } finally {
      dispatch(logout());
      navigate("/login");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((note) => note.id !== id));
      toast.success("Note deleted");
    } catch {
      toast.error("Failed to delete note");
    }
  };

  const handleEdit = (id) => {
    navigate(`/notes/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-between items-center p-6 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/notes/new")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            + New Note
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="p-8">
        {loading && <p className="text-gray-500">Loading notes...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && notes.length === 0 && (
          <p className="text-gray-500">No notes yet. Create your first note.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} onDelete={handleDelete} onEdit={handleEdit} />
          ))}
        </div>
      </div>
    </div>
  );
}
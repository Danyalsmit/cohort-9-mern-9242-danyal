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
    <div className="min-h-screen bg-stone-50">
      <div className="flex justify-between items-center px-8 py-5 bg-white border-b border-stone-200">
        <div>
          <h1 className="font-display text-2xl font-semibold text-slate-800">My Notes</h1>
          <p className="text-sm text-stone-500 mt-0.5">
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/notes/new")}
            className="bg-amber-600 text-white px-4 py-2 rounded-md font-medium hover:bg-amber-700 transition-colors"
          >
            + New Note
          </button>
          <button
            onClick={handleLogout}
            className="text-stone-600 px-4 py-2 rounded-md font-medium border border-stone-300 hover:bg-stone-100 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="px-8 py-8 max-w-6xl mx-auto">
        {loading && <p className="text-stone-500">Loading notes...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && notes.length === 0 && (
          <div className="text-center py-20">
            <p className="font-display text-xl text-slate-700 mb-2">No notes yet</p>
            <p className="text-stone-500 mb-6">Start writing — your first note is one click away.</p>
            <button
              onClick={() => navigate("/notes/new")}
              className="bg-amber-600 text-white px-5 py-2.5 rounded-md font-medium hover:bg-amber-700 transition-colors"
            >
              Create your first note
            </button>
          </div>
        )}

        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
          {notes.map((note, index) => (
            <div key={note.id} className="mb-4 break-inside-avoid">
              <NoteCard
                key={note.id}
                note={note}
                index={index}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
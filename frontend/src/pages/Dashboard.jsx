import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { logoutUser } from "../api/authApi";
import { getNotes, deleteNote } from "../api/notesApi";
import { logout } from "../redux/slices/authSlice";

import NoteCard from "../components/NoteCard";
import {
  PlusIcon,
  LogoutIcon,
  SearchIcon,
  DocumentIcon,
  LogoIcon,
  AlertIcon,
} from "../components/Icons";

const SKELETON_COUNT = 8;

const SkeletonCard = ({ id }) => (
  <div
    key={id}
    className="
      bg-white
      rounded-xl
      border border-stone-100
      p-5
      mb-5
      break-inside-avoid
      animate-pulse
    "
  >
    <div className="h-4 bg-stone-200 rounded-lg w-3/4 mb-4" />
    <div className="h-3 bg-stone-100 rounded w-full mb-2" />
    <div className="h-3 bg-stone-100 rounded w-5/6 mb-2" />
    <div className="h-3 bg-stone-100 rounded w-4/6 mb-2" />
    <div className="h-3 bg-stone-100 rounded w-full mb-4" />
    <div className="h-3 bg-stone-200 rounded w-1/3 mt-4" />
  </div>
);

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadNotes = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getNotes();
        setNotes(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load notes"
        );
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, []);

  const filteredNotes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return notes;
    }

    return notes.filter(
      (note) =>
        note.title?.toLowerCase().includes(query) ||
        note.content?.toLowerCase().includes(query)
    );
  }, [notes, searchQuery]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
    } catch {
      toast.error(
        "Logout request failed, but you've been signed out locally"
      );
    } finally {
      dispatch(logout());
      navigate("/login");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);

      setNotes((prevNotes) =>
        prevNotes.filter((note) => note.id !== id)
      );

      toast.success("Note deleted");
    } catch {
      toast.error("Failed to delete note");
    }
  };

  const handleEdit = (id) => {
    navigate(`/notes/${id}`);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center shadow-sm shadow-amber-600/20">
                <LogoIcon
                  size={16}
                  className="text-white"
                  strokeWidth={2.5}
                />
              </div>

              <div>
                <h1 className="font-display text-xl font-bold text-slate-800 leading-tight">
                  My Notes
                </h1>

                <p className="text-xs text-stone-500 font-medium">
                  {notes.length}{" "}
                  {notes.length === 1 ? "note" : "notes"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => navigate("/notes/new")}
                className="
                  inline-flex items-center gap-2
                  bg-amber-600
                  text-white
                  px-4 py-2
                  rounded-lg
                  font-semibold
                  text-sm
                  hover:bg-amber-700
                  hover:shadow-lg
                  hover:shadow-amber-600/20
                  active:scale-95
                  transition-all duration-200
                "
              >
                <PlusIcon />
                <span className="hidden sm:inline">
                  New Note
                </span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="
                  inline-flex items-center gap-2
                  text-stone-600
                  px-3 py-2
                  rounded-lg
                  font-medium
                  text-sm
                  border border-stone-200
                  hover:bg-stone-50
                  hover:border-stone-300
                  active:scale-95
                  transition-all duration-200
                "
                title="Logout"
              >
                <LogoutIcon />
                <span className="hidden sm:inline">
                  Logout
                </span>
              </button>

              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="
                  w-9 h-9
                  rounded-full
                  bg-amber-100
                  text-amber-700
                  font-bold
                  text-sm
                  flex items-center justify-center
                  hover:bg-amber-200
                  transition-colors
                  border-2 border-amber-200
                "
                title="Profile"
                aria-label="Open profile"
              >
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative group">
            <div
              className="
                absolute inset-y-0 left-0
                pl-4
                flex items-center
                pointer-events-none
                text-stone-400
                group-focus-within:text-amber-600
                transition-colors
              "
            >
              <SearchIcon />
            </div>

            <input
              type="text"
              placeholder="Search notes by title or content..."
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              className="
                w-full
                pl-11 pr-4
                py-3
                bg-white
                border border-stone-200
                rounded-xl
                text-sm
                text-slate-700
                placeholder-stone-400
                focus:outline-none
                focus:ring-2
                focus:ring-amber-500/20
                focus:border-amber-500
                transition-all
                shadow-sm
                hover:shadow-md
              "
              aria-label="Search notes"
            />
          </div>
        </div>

        {loading && (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5">
            {Array.from({ length: SKELETON_COUNT }, (_, skeletonIndex) => (
              <SkeletonCard
                key={`skeleton-${skeletonIndex}`}
                id={`skeleton-${skeletonIndex}`}
              />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-20 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
              <AlertIcon
                size={24}
                className="text-red-500"
              />
            </div>

            <p className="text-red-500 font-medium">
              {error}
            </p>

            <button
              type="button"
              onClick={handleRetry}
              className="
                mt-4
                text-amber-600
                hover:text-amber-700
                text-sm
                font-medium
              "
            >
              Try again
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          filteredNotes.length === 0 && (
            <div className="text-center py-24 animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-stone-100 mb-6">
                <DocumentIcon />
              </div>

              <h3 className="font-display text-2xl font-bold text-slate-800 mb-2">
                {searchQuery
                  ? "No matches found"
                  : "No notes yet"}
              </h3>

              <p className="text-stone-500 mb-8 max-w-sm mx-auto leading-relaxed">
                {searchQuery
                  ? "Try adjusting your search terms to find what you're looking for."
                  : "Start writing — your first note is one click away. Capture ideas, tasks, and memories."}
              </p>

              {!searchQuery && (
                <button
                  type="button"
                  onClick={() => navigate("/notes/new")}
                  className="
                    inline-flex items-center gap-2
                    bg-amber-600
                    text-white
                    px-6 py-3
                    rounded-xl
                    font-semibold
                    hover:bg-amber-700
                    hover:shadow-lg
                    hover:shadow-amber-600/20
                    active:scale-95
                    transition-all duration-200
                  "
                >
                  <PlusIcon />
                  Create your first note
                </button>
              )}
            </div>
          )}

        {!loading &&
          !error &&
          filteredNotes.length > 0 && (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5">
              {filteredNotes.map((note, index) => (
                <div
                  key={note.id}
                  className="mb-5 break-inside-avoid animate-fade-in-up"
                  style={{
                    animationDelay: `${Math.min(
                      index * 50,
                      500
                    )}ms`,
                  }}
                >
                  <NoteCard
                    note={note}
                    index={index}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                </div>
              ))}
            </div>
          )}
      </main>
    </div>
  );
}

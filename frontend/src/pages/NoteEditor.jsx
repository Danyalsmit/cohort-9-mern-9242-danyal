import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import toast from "react-hot-toast";
import { getNoteById, createNote, updateNote } from "../api/notesApi";
import EditorToolbar from "../components/EditorToolbar";

export default function NoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [noteContent, setNoteContent] = useState(null);
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    editorProps: {
      attributes: {
        class:
          "max-w-none min-h-[300px] px-4 pb-4 focus:outline-none text-gray-800",
      },
    },
  });
  useEffect(() => {
    if (!isEditMode) return;
    let cancelled = false;

    const loadNote = async () => {
      try {
        const res = await getNoteById(id);
        if (!cancelled) {
          setTitle(res.data.title);
          setNoteContent(res.data.content);
        }
      } catch (err) {
        if (!cancelled) {
          toast.error("Failed to load note");
          navigate("/dashboard");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadNote();
    return () => { cancelled = true; };
  }, [id, isEditMode, navigate]);

  useEffect(() => {
    if (editor && noteContent !== null) {
      editor.commands.setContent(noteContent);
    }
  }, [editor, noteContent]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    const content = editor.getHTML();
    setSaving(true);

    try {
      if (isEditMode) {
        await updateNote(id, { title, content });
        toast.success("Note updated");
      } else {
        await createNote({ title, content });
        toast.success("Note created");
      }
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save note");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="p-8 text-gray-500">Loading note...</p>;
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="flex justify-between items-center px-8 py-5 bg-white border-b border-stone-200">
        <h1 className="font-display text-2xl font-semibold text-slate-800">
          {isEditMode ? "Edit Note" : "New Note"}
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 rounded-md border border-stone-300 text-stone-600 font-medium hover:bg-stone-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-amber-600 text-white px-4 py-2 rounded-md font-medium hover:bg-amber-700 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="px-8 py-8 max-w-3xl mx-auto">
        <input
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full font-display text-2xl font-semibold text-slate-800 border-b border-stone-300 pb-3 mb-6 focus:outline-none focus:border-amber-600 bg-transparent"
        />

        <div className="bg-white rounded-lg border border-stone-200">
          <EditorToolbar editor={editor} />
          <div className="px-4 pb-4 pt-2 overflow-x-hidden overflow-y-auto max-h-[600px] ">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
}
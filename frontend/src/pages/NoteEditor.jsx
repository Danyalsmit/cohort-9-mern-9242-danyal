import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CharacterCount from "@tiptap/extension-character-count";
import toast from "react-hot-toast";
import { getNoteById, createNote, updateNote } from "../api/notesApi";
import EditorToolbar from "../components/EditorToolbar";
import { ArrowLeftIcon, SaveIcon } from "../components/Icons";

export default function NoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [noteContent, setNoteContent] = useState(null);
  const [characterCount, setCharacterCount] = useState(0);

  const editor = useEditor({
    extensions: [StarterKit, CharacterCount],
    content: "",
    editorProps: {
      attributes: {
        class:
          "max-w-none min-h-[400px] px-6 pb-6 focus:outline-none text-slate-700",
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
      } catch {
        if (!cancelled) {
          toast.error("Failed to load note");
          navigate("/dashboard");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadNote();

    return () => {
      cancelled = true;
    };
  }, [id, isEditMode, navigate]);

  useEffect(() => {
    if (editor && noteContent !== null) {
      editor.commands.setContent(noteContent);
    }
  }, [editor, noteContent]);

  useEffect(() => {
    if (!editor?.storage?.characterCount?.characters) return;

    const updateCharacterCount = () => {
      setCharacterCount(editor.storage.characterCount.characters());
    };

    updateCharacterCount();
    editor.on("update", updateCharacterCount);

    return () => {
      editor.off("update", updateCharacterCount);
    };
  }, [editor]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!editor) {
      toast.error("Editor is not ready");
      return;
    }

    const content = editor.getHTML();

    setSaving(true);

    try {
      if (isEditMode) {
        await updateNote(id, {
          title: title.trim(),
          content,
        });

        toast.success("Note updated");
      } else {
        await createNote({
          title: title.trim(),
          content,
        });

        toast.success("Note created");
      }

      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to save note"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin" />

          <p className="text-stone-500 text-sm font-medium">
            Loading note...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-stone-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-2 text-stone-600 hover:text-slate-800 font-medium text-sm transition-colors"
            >
              <ArrowLeftIcon />
              Back
            </button>

            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-200 text-stone-600 font-medium text-sm hover:bg-stone-50 hover:border-stone-300 active:scale-95 transition-all duration-200"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 bg-amber-600 text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-amber-700 hover:shadow-lg hover:shadow-amber-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <SaveIcon />
                {saving ? "Saving..." : "Save"}
              </button>

            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-24">

        <input
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full font-display text-3xl sm:text-4xl font-bold text-slate-800 placeholder-stone-300 border-none pb-4 mb-2 focus:outline-none focus:ring-0 bg-transparent"
        />

        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
          <EditorToolbar editor={editor} />

          <div className="overflow-x-hidden overflow-y-auto max-h-[calc(100vh-280px)]">
            <EditorContent editor={editor} />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-stone-400 px-1">
          <span>
            {isEditMode
              ? "Editing existing note"
              : "Creating new note"}
          </span>

          <span>
            {characterCount} characters
          </span>
        </div>

      </main>
    </div>
  );
}

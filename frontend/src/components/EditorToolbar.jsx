export default function EditorToolbar({ editor }) {
  if (!editor) return null;

  const btnClass = (isActive) =>
    `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? "bg-amber-600 text-white"
        : "bg-stone-100 text-slate-700 hover:bg-stone-200"
    }`;

  return (
    <div className="flex flex-wrap gap-1.5 border-b border-stone-200 px-4 py-3">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btnClass(editor.isActive("bold"))}
      >
        Bold
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btnClass(editor.isActive("italic"))}
      >
        Italic
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={btnClass(editor.isActive("strike"))}
      >
        Strike
      </button>

      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        className={btnClass(
          editor.isActive("heading", { level: 2 })
        )}
      >
        H2
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btnClass(editor.isActive("bulletList"))}
      >
        Bullet List
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btnClass(editor.isActive("orderedList"))}
      >
        Numbered List
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btnClass(editor.isActive("blockquote"))}
      >
        Quote
      </button>

      <div className="w-px h-6 bg-stone-200 mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        className={btnClass(false)}
      >
        Undo
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        className={btnClass(false)}
      >
        Redo
      </button>
    </div>
  );
}
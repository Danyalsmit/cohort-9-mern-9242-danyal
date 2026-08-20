import { BoldIcon, ItalicIcon, StrikeIcon, HeadingIcon, ListIcon, OrderedListIcon, QuoteIcon, UndoIcon, RedoIcon } from "./Icons";

export default function EditorToolbar({ editor }) {
  if (!editor) return null;

  const btnClass = (isActive, isDisabled = false) =>
    `p-2.5 rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
        : "text-stone-500 hover:text-slate-700 hover:bg-stone-100"
    } ${isDisabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer active:scale-90"}`;

  const tools = [
    { icon: <BoldIcon />, action: () => editor.chain().focus().toggleBold().run(), isActive: () => editor.isActive("bold"), title: "Bold" },
    { icon: <ItalicIcon />, action: () => editor.chain().focus().toggleItalic().run(), isActive: () => editor.isActive("italic"), title: "Italic" },
    { icon: <StrikeIcon />, action: () => editor.chain().focus().toggleStrike().run(), isActive: () => editor.isActive("strike"), title: "Strikethrough" },
    { icon: <HeadingIcon />, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive: () => editor.isActive("heading", { level: 2 }), title: "Heading" },
    { icon: <ListIcon />, action: () => editor.chain().focus().toggleBulletList().run(), isActive: () => editor.isActive("bulletList"), title: "Bullet List" },
    { icon: <OrderedListIcon />, action: () => editor.chain().focus().toggleOrderedList().run(), isActive: () => editor.isActive("orderedList"), title: "Numbered List" },
    { icon: <QuoteIcon />, action: () => editor.chain().focus().toggleBlockquote().run(), isActive: () => editor.isActive("blockquote"), title: "Quote" },
  ];

  return (
    <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-stone-200/60 px-4 py-2.5">
      <div className="flex flex-wrap items-center gap-1">
        {tools.map((tool, i) => (
          <button
            key={i}
            type="button"
            onClick={tool.action}
            className={btnClass(tool.isActive())}
            title={tool.title}
          >
            {tool.icon}
          </button>
        ))}

        <div className="w-px h-6 bg-stone-200 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={btnClass(false, !editor.can().undo())}
          title="Undo"
        >
          <UndoIcon />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={btnClass(false, !editor.can().redo())}
          title="Redo"
        >
          <RedoIcon />
        </button>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { BoldIcon, ItalicIcon, StrikeIcon, HeadingIcon, ListIcon, OrderedListIcon, QuoteIcon, UndoIcon, RedoIcon } from "./Icons";

export default function EditorToolbar({ editor }) {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const [activeStates, setActiveStates] = useState({
    bold: false,
    italic: false,
    strike: false,
    heading: false,
    bulletList: false,
    orderedList: false,
    blockquote: false,
  });

  useEffect(() => {
    if (!editor) return;

    const updateStates = () => {
      setCanUndo(editor.can().undo());
      setCanRedo(editor.can().redo());

      setActiveStates({
        bold: editor.isActive("bold"),
        italic: editor.isActive("italic"),
        strike: editor.isActive("strike"),
        heading: editor.isActive("heading", { level: 2 }),
        bulletList: editor.isActive("bulletList"),
        orderedList: editor.isActive("orderedList"),
        blockquote: editor.isActive("blockquote"),
      });
    };

    updateStates();

    editor.on("update", updateStates);
    editor.on("selectionUpdate", updateStates);

    return () => {
      editor.off("update", updateStates);
      editor.off("selectionUpdate", updateStates);
    };
  }, [editor]);

  if (!editor) return null;

  const btnClass = (isActive, isDisabled = false) =>
    `p-2.5 rounded-lg transition-all duration-200 ${isActive
      ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
      : "text-stone-500 hover:text-slate-700 hover:bg-stone-100"
    } ${isDisabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer active:scale-90"}`;

  const tools = [
    { icon: <BoldIcon />, action: () => editor.chain().focus().toggleBold().run(), isActive: activeStates.bold, title: "Bold" },
    { icon: <ItalicIcon />, action: () => editor.chain().focus().toggleItalic().run(), isActive: activeStates.italic, title: "Italic" },
    { icon: <StrikeIcon />, action: () => editor.chain().focus().toggleStrike().run(), isActive: activeStates.strike, title: "Strikethrough" },
    { icon: <HeadingIcon />, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive: activeStates.heading, title: "Heading" },
    { icon: <ListIcon />, action: () => editor.chain().focus().toggleBulletList().run(), isActive: activeStates.bulletList, title: "Bullet List" },
    { icon: <OrderedListIcon />, action: () => editor.chain().focus().toggleOrderedList().run(), isActive: activeStates.orderedList, title: "Numbered List" },
    { icon: <QuoteIcon />, action: () => editor.chain().focus().toggleBlockquote().run(), isActive: activeStates.blockquote, title: "Quote" },
  ];

  return (
    <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-stone-200/60 px-4 py-2.5">
      <div className="flex flex-wrap items-center gap-1">
        {tools.map((tool, i) => (
          <button
            key={i}
            type="button"
            onClick={tool.action}
            className={btnClass(tool.isActive)}
            title={tool.title}
            aria-label={tool.title}
            aria-pressed={tool.isActive}
          >
            {tool.icon}
          </button>
        ))}

        <div className="w-px h-6 bg-stone-200 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!canUndo}
          className={btnClass(false, !canUndo)}
          title="Undo"
        >
          <UndoIcon />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!canRedo}
          className={btnClass(false, !canRedo)}
          title="Redo"
        >
          <RedoIcon />
        </button>
      </div>
    </div>
  );
}
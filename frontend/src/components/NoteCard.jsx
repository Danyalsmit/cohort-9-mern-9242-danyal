import { useEffect, useRef, useState } from "react";

const bgColors = [
  { className: "bg-amber-50", color: "#fffbeb" },
  { className: "bg-white", color: "#ffffff" },
  { className: "bg-orange-50", color: "#fff7ed" },
  { className: "bg-stone-50", color: "#fafaf9" },
  { className: "bg-yellow-50", color: "#fefce8" },
];

export default function NoteCard({ note, onDelete, onEdit, index }) {
  const bg = bgColors[index % bgColors.length];

  const previewRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const element = previewRef.current;

    if (!element) return;

    const checkOverflow = () => {
      setIsOverflowing(element.scrollHeight > element.clientHeight + 1);
    };

    checkOverflow();

    const resizeObserver = new ResizeObserver(() => {
      checkOverflow();
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [note.content]);

  return (
    <div
      style={{ "--card-bg": bg.color }}
      className={`
        group relative
        ${bg.className}
        rounded-xl
        border border-stone-200
        p-4
        mb-4
        break-inside-avoid
        hover:shadow-md
        transition-shadow duration-200
      `}
    >
      <h3 className="font-display font-semibold text-base text-slate-800 mb-2">
        {note.title}
      </h3>

      <div
        ref={previewRef}
        className={`note-preview text-stone-600 text-sm leading-6 ${
          isOverflowing ? "has-overflow" : ""
        }`}
        dangerouslySetInnerHTML={{
          __html:
            note.content ||
            "<p class='text-stone-400 italic'>Empty note</p>",
        }}
      />

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-200/60">
        <p className="text-xs text-stone-400">
          {new Date(note.updatedAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
          })}
        </p>

        <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(note.id)}
            className="text-xs font-medium text-amber-700 hover:text-amber-900"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(note.id)}
            className="text-xs font-medium text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useRef, useState } from "react";
import { EditIcon, TrashIcon } from "./Icons";
import DOMPurify from "dompurify";


const bgColors = [
  { className: "bg-[#fffbeb]", color: "#fffbeb", border: "#fbbf24" },
  { className: "bg-[#ffffff]", color: "#ffffff", border: "#e7e5e4" },
  { className: "bg-[#fff7ed]", color: "#fff7ed", border: "#fb923c" },
  { className: "bg-[#f0fdf4]", color: "#f0fdf4", border: "#4ade80" },
  { className: "bg-[#eff6ff]", color: "#eff6ff", border: "#60a5fa" },
  { className: "bg-[#faf5ff]", color: "#faf5ff", border: "#c084fc" },
  { className: "bg-[#fff1f2]", color: "#fff1f2", border: "#fb7185" },
  { className: "bg-[#f0f9ff]", color: "#f0f9ff", border: "#38bdf8" },
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
    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, [note.content]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <div
      className={`
        group relative
        ${bg.className}
        rounded-2xl
        border border-stone-200/80
        p-5
        break-inside-avoid
        hover:shadow-xl hover:shadow-stone-200/50
        hover:-translate-y-1
        transition-all duration-300 ease-out
        cursor-pointer
      `}
      onClick={() => onEdit(note.id)}
      style={{ backgroundColor: bg.color }}
    >
      <div
        className="absolute top-0 left-5 right-5 h-[3px] rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: bg.border }}
      />

      <h3 className="font-display font-bold text-base text-slate-800 mb-3 line-clamp-2 leading-snug pr-6">
        {note.title}
      </h3>

      <div className="relative">
        <div
          className="note-preview text-stone-600 text-sm leading-relaxed max-h-[180px] overflow-hidden"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              note.content || "<p class='text-stone-400 italic'>Empty note</p>"
            ),
          }}
        />
        {isOverflowing && (
          <div
            className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[var(--card-bg)] to-transparent pointer-events-none"
            style={{ "--card-bg": bg.color }}
          />
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-200/60">
        <p className="text-xs font-medium text-stone-400 tabular-nums">
          {formatDate(note.updatedAt)}
        </p>

        <div
          className="flex gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 translate-y-1 group-hover:translate-y-0 group-focus-within:translate-y-0 transition-all duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onEdit(note.id)}
            className="p-2 rounded-lg text-stone-500 hover:text-amber-700 hover:bg-amber-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-600 transition-all duration-200"
            title="Edit"
          >
            <EditIcon />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-2 rounded-lg text-stone-500 hover:text-red-600 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600 transition-all duration-200"
            title="Delete"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
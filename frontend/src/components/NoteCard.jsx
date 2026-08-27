import DOMPurify from "dompurify";
import { EditIcon, TrashIcon } from "./Icons";

const backgrounds = [
  {
    className: "bg-amber-50",
    color: "#fffbeb",
    border: "#f59e0b",
  },
  {
    className: "bg-orange-50",
    color: "#fff7ed",
    border: "#f97316",
  },
  {
    className: "bg-yellow-50",
    color: "#fefce8",
    border: "#eab308",
  },
  {
    className: "bg-stone-50",
    color: "#fafaf9",
    border: "#a8a29e",
  },
];

export default function NoteCard({
  note,
  onDelete,
  onEdit,
  index = 0,
}) {
  const bg = backgrounds[index % backgrounds.length];

  const cleanContent = DOMPurify.sanitize(
    note.content ||
    "<p class='text-stone-400 italic'>Empty note</p>"
  );

  const handleCardKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onEdit(note.id);
    }
  };

  return (
    <article
      className={`
        group relative w-full text-left
        ${bg.className}
        rounded-2xl
        border border-stone-200/80
        break-inside-avoid
        hover:shadow-xl hover:shadow-stone-200/50
        hover:-translate-y-1
        transition-all duration-300 ease-out
      `}
      style={{ backgroundColor: bg.color }}
    >
      <button
        type="button"
        aria-label={`Open note: ${note.title}`}
        className="
          block
          w-full
          text-left
          p-5
          rounded-2xl
          focus-visible:outline
          focus-visible:outline-2
          focus-visible:outline-amber-600
          focus-visible:outline-offset-2
          cursor-pointer
        "
        onClick={() => onEdit(note.id)}
        onKeyDown={handleCardKeyDown}
      >
        <div
          className="absolute top-0 left-5 right-5 h-[3px] rounded-full opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{ backgroundColor: bg.border }}
        />

        <h3 className="font-display font-bold text-base text-slate-800 mb-3 line-clamp-2 leading-snug pr-20">
          {note.title}
        </h3>

        <div
          className="note-preview text-sm text-stone-600 leading-relaxed line-clamp-6 break-words"
          dangerouslySetInnerHTML={{ __html: cleanContent }}
        />

        <div className="mt-5 pt-3 border-t border-stone-200/60">
          <p className="text-xs text-stone-400">
            {note.updatedAt
              ? new Date(note.updatedAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
              : ""}
          </p>
        </div>
      </button>

      <div
        className="
    absolute
    top-3
    right-3
    flex
    gap-1
    opacity-0
    group-hover:opacity-100
    group-focus-within:opacity-100
    translate-y-1
    group-hover:translate-y-0
    group-focus-within:translate-y-0
    transition-all
    duration-200
    z-10
  "
      >
        <button
          type="button"
          aria-label="Edit note"
          onClick={(event) => {
            event.stopPropagation();
            onEdit(note.id);
          }}
          className="
      p-2
      rounded-lg
      text-stone-500
      hover:text-amber-700
      hover:bg-amber-50
      focus-visible:outline
      focus-visible:outline-2
      focus-visible:outline-amber-600
      transition-all
      duration-200
    "
          title="Edit"
        >
          <EditIcon />
        </button>

        <button
          type="button"
          aria-label="Delete note"
          onClick={(event) => {
            event.stopPropagation();
            onDelete(note.id);
          }}
          className="
           p-2
           rounded-lg
           text-stone-500
           hover:text-red-600
           hover:bg-red-50
           focus-visible:outline
           focus-visible:outline-2
           focus-visible:outline-red-600
           transition-all
           duration-200
           "
          title="Delete"
        >
          <TrashIcon />
        </button>
      </div>

    </article>
  );
}

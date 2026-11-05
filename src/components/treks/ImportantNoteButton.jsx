"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

// Sidebar "Important Note" — a button that opens the notes in a modal, instead of
// a long inline list crowding the compact Trek Cost card.
export default function ImportantNoteButton({ notes = [] }) {
  const [open, setOpen] = useState(false);
  if (!notes.length) return null;

  // Portal the modal to <body> so it escapes the sidebar's stacking context and
  // renders above the sticky section nav (which otherwise shows over it).
  const modal = (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-4"
      onClick={() => setOpen(false)}
    >
          <div
            className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-card sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <h3 className="text-lg font-bold text-ink">Important Note</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-lg p-1 text-gray-400 hover:bg-slate-100"
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>
            <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-gray-600">
              {notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ol>
          </div>
        </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl2 border border-line/70 px-4 py-3 text-sm font-semibold text-ink transition hover:border-primary hover:text-primary"
      >
        <i className="bi bi-info-circle" /> Important Note
      </button>
      {open && typeof document !== "undefined" && createPortal(modal, document.body)}
    </>
  );
}

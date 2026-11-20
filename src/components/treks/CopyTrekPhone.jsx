"use client";

import { useState } from "react";

export default function CopyTrekPhone({ phone }) {
  const [status, setStatus] = useState("");

  async function copy() {
    try {
      await navigator.clipboard.writeText(phone);
      setStatus("Number copied");
    } catch {
      setStatus("Couldn’t copy. Select the number to copy it.");
    }
  }

  return (
    <div className="shrink-0">
      <button type="button" onClick={copy} aria-label={`Copy ${phone}`}
        className="rounded-full border border-[#a6bdaa] px-3 py-1 text-xs font-semibold text-[#18382b] transition hover:bg-white">
        {status === "Number copied" ? "Copied" : "Copy"}
      </button>
      <span role="status" className="sr-only">{status}</span>
    </div>
  );
}

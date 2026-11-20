"use client";

import { Plus, Trash2 } from "lucide-react";
import type { TrekHighlight } from "@/lib/trekHighlights";

export default function HighlightEditor({ items, onChange, inputClass }: {
  items: TrekHighlight[];
  onChange: (items: TrekHighlight[]) => void;
  inputClass: string;
}) {
  function update(index: number, field: keyof TrekHighlight, value: string) {
    onChange(items.map((item, i) => i === index ? { ...item, [field]: value } : item));
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="space-y-3 rounded-xl border border-line bg-slate-50/60 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-ink">Highlight {i + 1}</span>
            <button type="button" aria-label={`Remove highlight ${i + 1}`} onClick={() => onChange(items.filter((_, index) => index !== i))} className="text-gray-400 hover:text-red-600">
              <Trash2 size={15} />
            </button>
          </div>
          <label className="grid gap-1.5 text-xs font-semibold text-ink">
            Title
            <input className={inputClass} value={item.title} required={!!item.subtext.trim()} onChange={(event) => update(i, "title", event.target.value)} />
          </label>
          <label className="grid gap-1.5 text-xs font-semibold text-ink">
            <span>Subtext <span className="font-normal text-gray-400">· optional</span></span>
            <textarea rows={2} className={inputClass} value={item.subtext} onChange={(event) => update(i, "subtext", event.target.value)} />
          </label>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, { title: "", subtext: "" }])} className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-line px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/5">
        <Plus size={15} /> Add highlight
      </button>
    </div>
  );
}

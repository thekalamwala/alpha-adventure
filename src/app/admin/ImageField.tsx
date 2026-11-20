"use client";

import { useId, useRef, useState } from "react";
import { CheckCircle2, Loader2, Upload } from "lucide-react";
import { createImageUpload } from "./upload/actions";

// PUT the file straight to Supabase Storage with real progress + a timeout.
function putWithProgress(url: string, file: File, onProgress: (pct: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.setRequestHeader("cache-control", "max-age=31536000");
    xhr.timeout = 120_000;
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error(`Storage rejected the file (${xhr.status}).`)));
    xhr.onerror = () => reject(new Error("Network error during upload."));
    xhr.ontimeout = () => reject(new Error("Upload timed out. Try a smaller file."));
    xhr.send(file);
  });
}

// URL input + "Upload" button. Keeps the paste-a-URL option and adds direct
// image upload to the `media` bucket; on success the returned public URL fills
// the field. Drop-in replacement for the plain image <input> on admin forms.
export default function ImageField({
  value,
  onChange,
  className,
  placeholder,
  folder = "misc",
  itineraryPdf = false,
  onUploading,
  label,
  previewClassName,
}: {
  value: string;
  onChange: (url: string) => void;
  className?: string;
  placeholder?: string;
  folder?: string;
  itineraryPdf?: boolean;
  onUploading?: (uploading: boolean) => void;
  label?: string;
  previewClassName?: string;
}) {
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [pct, setPct] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!file) return;
    setErr(null);
    setPct(0);
    setBusy(true);
    onUploading?.(true);
    setStatus("Preparing…");
    try {
      if (itineraryPdf && await file.slice(0, 5).text() !== "%PDF-") throw new Error("Choose a valid PDF file.");
      const r = await createImageUpload({ type: file.type, size: file.size, folder, kind: itineraryPdf ? "itinerary" : undefined });
      if (!r.ok) throw new Error(r.error);
      setStatus(`Uploading ${file.name}`);
      await putWithProgress(r.uploadUrl, file, setPct);
      onChange(r.publicUrl);
      setStatus("Uploaded");
    } catch (x) {
      setStatus(null);
      setErr(x instanceof Error ? x.message : "Upload failed. Check your connection and try again.");
    } finally {
      setBusy(false);
      onUploading?.(false);
    }
  }

  const preview = !itineraryPdf && value && (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={value} alt="" className={previewClassName ?? "mt-2 h-20 w-32 rounded-lg border border-line object-cover"} />
  );

  return (
    <div className="min-w-0">
      {label && <label htmlFor={inputId} className="mb-2 block text-xs font-semibold text-ink">{label}</label>}
      <div className="flex items-center gap-2">
        {itineraryPdf ? (
          <span className="text-xs text-gray-500">{value ? "PDF selected" : "No PDF selected"}</span>
        ) : (
          <input id={inputId} className={`min-w-0 ${className ?? ""}`} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
        )}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          aria-label={label ? `Upload ${label.toLowerCase()}` : undefined}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm font-medium text-ink hover:bg-slate-100 disabled:opacity-50"
        >
          {busy ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />} {busy ? "Uploading…" : "Upload"}
        </button>
        {itineraryPdf && value && <button type="button" disabled={busy} className="text-xs text-red-600" onClick={() => { onChange(""); setStatus(null); }}>Remove PDF</button>}
        <input ref={fileRef} type="file" accept={itineraryPdf ? "application/pdf,.pdf" : "image/*"} className="hidden" onChange={onPick} />
      </div>
      {previewClassName && (preview || (
        <div className={`grid place-items-center border-dashed text-xs text-gray-500 ${previewClassName}`}>No photo selected</div>
      ))}
      {busy && (
        <div className="mt-2" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="flex justify-between text-xs text-slate-500"><span className="truncate">{status}</span><span>{pct}%</span></div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full bg-primary transition-[width]" style={{ width: `${pct}%` }} /></div>
        </div>
      )}
      {!busy && status === "Uploaded" && <p className="mt-1 flex items-center gap-1 text-xs font-medium text-green-600"><CheckCircle2 size={13} /> Uploaded — save the form to keep it.</p>}
      {err && <p className="mt-1 text-xs font-medium text-red-600">{err}</p>}
      {!previewClassName && preview}
    </div>
  );
}

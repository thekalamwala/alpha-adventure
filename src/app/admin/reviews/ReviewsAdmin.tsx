"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { approveReview, rejectReview, resetReview } from "./actions";
import {
  reviewStatusLabel,
  REVIEW_PENDING,
  REVIEW_APPROVED,
  REVIEW_REJECTED,
} from "@/domain/review/review";

type Row = {
  id: string; rating: number; title: string; body: string; status: string;
  created: string; customer: string; reference: string; trek: string;
};

const FILTERS = [
  { key: "pending", label: "Pending", status: REVIEW_PENDING },
  { key: "approved", label: "Approved", status: REVIEW_APPROVED },
  { key: "rejected", label: "Rejected", status: REVIEW_REJECTED },
  { key: "all", label: "All", status: null },
] as const;

const badge: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-gray-200 text-gray-600",
};

export default function ReviewsAdmin({ rows }: { rows: Row[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("pending");
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  const active = FILTERS.find((f) => f.key === filter)!;
  const shown = active.status ? rows.filter((r) => r.status === active.status) : rows;
  const count = (status: string) => rows.filter((r) => r.status === status).length;

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>, ok: string) =>
    start(async () => {
      const r = await fn();
      setMsg(r.ok ? ok : (r.error ?? "Something went wrong."));
    });

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">Customer Reviews</h1>
          <p className="text-sm text-gray-500">Approve or reject booking-verified reviews. Only approved reviews show publicly.</p>
        </div>
        <Link href="/admin" className="text-sm text-gray-500 hover:text-ink">← Admin</Link>
      </div>

      <div className="mb-4 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-3 py-1 text-sm ${filter === f.key ? "bg-ink text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {f.label}{f.status ? ` (${count(f.status)})` : ` (${rows.length})`}
          </button>
        ))}
      </div>

      {msg && <div className="mb-3 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700">{msg}</div>}

      <div className="space-y-3">
        {shown.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center text-gray-400">
            No {active.label.toLowerCase()} reviews.
          </div>
        )}
        {shown.map((r) => {
          const label = reviewStatusLabel(r.status);
          return (
            <div key={r.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="mb-1 flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-ink">{r.title || "(no title)"}</div>
                  <div className="text-xs text-gray-500">
                    {r.customer} · {r.trek} · {r.reference} · {new Date(r.created).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </div>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${badge[label]}`}>{label}</span>
              </div>
              <div className="mb-3 text-amber-500" aria-label={`${r.rating} out of 5`}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
              {r.body && <p className="mb-3 whitespace-pre-wrap text-sm text-gray-700">{r.body}</p>}
              <div className="flex gap-2">
                {r.status !== REVIEW_APPROVED && (
                  <button disabled={pending} onClick={() => run(() => approveReview(r.id), "Approved — now public.")} className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50">Approve</button>
                )}
                {r.status !== REVIEW_REJECTED && (
                  <button disabled={pending} onClick={() => run(() => rejectReview(r.id), "Rejected — hidden from public.")} className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50">Reject</button>
                )}
                {r.status !== REVIEW_PENDING && (
                  <button disabled={pending} onClick={() => run(() => resetReview(r.id), "Back to pending.")} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50">Reset to pending</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

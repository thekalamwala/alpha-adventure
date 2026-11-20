"use client";

import { useRef, useState } from "react";

const fields = [
  { name: "name", label: "Full name", type: "text", autoComplete: "name", maxLength: 120, placeholder: "e.g. John Smith", icon: "person" },
  { name: "phone", label: "Phone number", type: "tel", autoComplete: "tel", maxLength: 40, placeholder: "Enter your phone number", icon: "telephone" },
  { name: "email", label: "Email address", type: "email", autoComplete: "email", maxLength: 200, placeholder: "john@example.com", icon: "envelope" },
];

const fallbackError = "Could not send your request. Please try again.";

export default function TrekCallbackCard({ trekName }) {
  const submitting = useRef(false);
  const [status, setStatus] = useState({ state: "idle", message: "" });

  async function requestCallback(event) {
    event.preventDefault();
    if (submitting.current) return;

    const form = event.currentTarget;
    const values = new FormData(form);
    const name = values.get("name").trim();
    const phone = values.get("phone").trim();
    const email = values.get("email").trim();
    if (!name || !/^\+?[\d\s().-]+$/.test(phone) || phone.replace(/\D/g, "").length < 10) {
      setStatus({ state: "error", message: "Enter your name and a valid phone number." });
      return;
    }

    submitting.current = true;
    setStatus({ state: "pending", message: "" });
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          company: values.get("company"),
          subject: "Trek callback request",
          message: `Please call me back about ${trekName}.`,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        setStatus({ state: "error", message: result.error?.message || fallbackError });
        return;
      }
      form.reset();
      setStatus({ state: "success", message: "Request received. Our team will call you back." });
    } catch {
      setStatus({ state: "error", message: fallbackError });
    } finally {
      submitting.current = false;
    }
  }

  return (
    <section aria-labelledby="trek-callback-title" className="mt-5 overflow-hidden rounded-[24px] border border-[#c7d9ca] bg-white shadow-soft">
      <div className="border-b border-[#c7d9ca] bg-[#edf6ef] px-5 py-4 sm:px-6">
        <h3 id="trek-callback-title" className="m-0 text-xl font-bold text-[#18382b]">Your Trip, Your Way!</h3>
        <p className="mb-0 mt-1 text-sm text-[#426454]">
          Planning a private getaway or looking to customise an itinerary? We&apos;d love to hear from you!
        </p>
      </div>
      <form method="post" onSubmit={requestCallback} className="p-5 sm:p-6">
        <fieldset disabled={status.state === "pending"} className="m-0 grid min-w-0 gap-3 border-0 p-0">
          {fields.map(({ label, icon, ...input }) => (
            <label key={input.name} className="grid gap-1 text-sm font-semibold text-[#18382b]">
              <span>{label} <span aria-hidden="true">*</span></span>
              <span className="relative">
                <i aria-hidden="true" className={`bi bi-${icon} pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#426454]`} />
                <input {...input} required className="w-full rounded-xl border border-[#aebfb1] bg-white py-2.5 pl-10 pr-3 font-normal text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </span>
            </label>
          ))}
          <input type="text" name="company" tabIndex={-1} autoComplete="off" hidden />
          <button type="submit" className="primary-btn1 mt-1 w-full justify-content-center disabled:opacity-60">
            <span>{status.state === "pending" ? "Sending…" : "Request callback"}</span>
          </button>
        </fieldset>
        <p role="status" className={`mb-0 text-sm ${status.message ? "mt-3" : ""} ${status.state === "error" ? "text-red-700" : "text-[#426454]"}`}>
          {status.message}
        </p>
      </form>
    </section>
  );
}

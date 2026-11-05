"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

// The site header is static HTML (orig-topbar/header), so we enhance it on the
// client: replace the "Dashboard" button with a circular profile avatar —
// initials + dropdown (Dashboard / Profile / Sign out) when signed in, or a
// person icon linking to /login when signed out. Runs on every (site) page.
const esc = (s) =>
  String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

export default function HeaderProfile() {
  useEffect(() => {
    const supabase = createClient();
    let live = true;
    const docCleanups = [];

    async function load() {
      let user = null, name = "", email = "";
      try {
        const { data } = await supabase.auth.getUser();
        user = data?.user ?? null;
        if (user) {
          email = user.email ?? "";
          const { data: p } = await supabase
            .from("profiles").select("first_name,last_name").eq("id", user.id).maybeSingle();
          name = [p?.first_name, p?.last_name].filter(Boolean).join(" ");
        }
      } catch { /* treat as signed out */ }
      if (!live) return;
      render(user, name, email);
    }

    function render(user, name, email) {
      const buttons = document.querySelectorAll("a.primary-btn1.four.transparent");
      buttons.forEach((btn) => {
        if (btn.dataset.aaProfile) return;      // already enhanced
        btn.dataset.aaProfile = "1";

        const wrap = document.createElement("div");
        wrap.className = "aa-profile";

        if (!user) {
          wrap.innerHTML = `<a href="/login" class="aa-profile-avatar" aria-label="Log in"><i class="bi bi-person"></i></a>`;
          btn.replaceWith(wrap);
          return;
        }

        const initials = (name || email || "A").trim().slice(0, 1).toUpperCase();
        wrap.innerHTML = `
          <button type="button" class="aa-profile-avatar" aria-label="Account" aria-haspopup="menu">${esc(initials)}</button>
          <div class="aa-profile-menu" role="menu" hidden>
            <div class="aa-profile-head"><strong>${esc(name || "Account")}</strong>${email ? `<span>${esc(email)}</span>` : ""}</div>
            <a href="/user-dashboard" role="menuitem">Dashboard</a>
            <a href="/user-dashboard" role="menuitem">Profile &amp; Medical</a>
            <button type="button" class="aa-signout" role="menuitem">Sign out</button>
          </div>`;
        btn.replaceWith(wrap);

        const avatar = wrap.querySelector(".aa-profile-avatar");
        const menu = wrap.querySelector(".aa-profile-menu");
        const onAvatar = (e) => { e.preventDefault(); menu.hidden = !menu.hidden; };
        const onDoc = (e) => { if (!wrap.contains(e.target)) menu.hidden = true; };
        avatar.addEventListener("click", onAvatar);
        document.addEventListener("click", onDoc);
        docCleanups.push(() => document.removeEventListener("click", onDoc));

        wrap.querySelector(".aa-signout").addEventListener("click", async () => {
          try { await supabase.auth.signOut(); } catch { /* clear anyway */ }
          window.location.href = "/";
        });
      });
    }

    load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      // reset so a sign-in/out re-enhances with the new state
      document.querySelectorAll(".aa-profile").forEach((el) => el.remove());
      document.querySelectorAll("[data-aa-profile]").forEach((el) => delete el.dataset.aaProfile);
      load();
    });

    return () => {
      live = false;
      sub.subscription.unsubscribe();
      docCleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}

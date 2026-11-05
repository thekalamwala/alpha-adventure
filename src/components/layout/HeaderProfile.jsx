"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

// The site header is static HTML (orig-topbar/header), so we enhance it on the
// client: replace the "Dashboard" button with a circular profile avatar —
// initials + dropdown (Dashboard / Profile / Sign out) when signed in, or a
// person icon linking to /login when signed out.
// The dropdown is appended to <body> and fixed-positioned under the avatar, so it
// escapes the header's stacking context (z-index up to 99999) and never renders
// behind the nav bar.
const esc = (s) =>
  String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

export default function HeaderProfile() {
  useEffect(() => {
    const supabase = createClient();
    let live = true;
    const cleanups = [];

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
        if (btn.dataset.aaProfile) return;
        btn.dataset.aaProfile = "1";

        const wrap = document.createElement("div");
        wrap.className = "aa-profile";

        if (!user) {
          wrap.innerHTML = `<a href="/login" class="aa-profile-avatar" aria-label="Log in"><i class="bi bi-person"></i></a>`;
          btn.replaceWith(wrap);
          return;
        }

        const initials = (name || email || "A").trim().slice(0, 1).toUpperCase();
        wrap.innerHTML = `<button type="button" class="aa-profile-avatar" aria-label="Account" aria-haspopup="menu">${esc(initials)}</button>`;
        btn.replaceWith(wrap);
        const avatar = wrap.querySelector(".aa-profile-avatar");

        // Dropdown lives on <body> so the header's stacking context can't hide it.
        const menu = document.createElement("div");
        menu.className = "aa-profile-menu";
        menu.setAttribute("role", "menu");
        menu.style.display = "none";
        menu.innerHTML = `
          <div class="aa-profile-head"><strong>${esc(name || "Account")}</strong>${email ? `<span>${esc(email)}</span>` : ""}</div>
          <a href="/user-dashboard" role="menuitem">Dashboard</a>
          <a href="/user-dashboard" role="menuitem">Profile &amp; Medical</a>
          <button type="button" class="aa-signout" role="menuitem">Sign out</button>`;
        document.body.appendChild(menu);
        cleanups.push(() => menu.remove());

        const place = () => {
          const r = avatar.getBoundingClientRect();
          menu.style.top = `${r.bottom + 8}px`;
          menu.style.right = `${Math.max(8, window.innerWidth - r.right)}px`;
        };
        const onAvatar = (e) => {
          e.preventDefault();
          if (menu.style.display === "none") { place(); menu.style.display = "block"; }
          else menu.style.display = "none";
        };
        const onDoc = (e) => { if (!menu.contains(e.target) && !wrap.contains(e.target)) menu.style.display = "none"; };
        const onScroll = () => { if (menu.style.display !== "none") place(); };
        avatar.addEventListener("click", onAvatar);
        document.addEventListener("click", onDoc);
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        cleanups.push(() => {
          document.removeEventListener("click", onDoc);
          window.removeEventListener("scroll", onScroll);
          window.removeEventListener("resize", onScroll);
        });

        menu.querySelector(".aa-signout").addEventListener("click", async () => {
          try { await supabase.auth.signOut(); } catch { /* clear anyway */ }
          window.location.href = "/";
        });
      });
    }

    load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      document.querySelectorAll(".aa-profile-menu").forEach((el) => el.remove());
      document.querySelectorAll(".aa-profile").forEach((el) => el.remove());
      document.querySelectorAll("[data-aa-profile]").forEach((el) => delete el.dataset.aaProfile);
      load();
    });

    return () => {
      live = false;
      sub.subscription.unsubscribe();
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}

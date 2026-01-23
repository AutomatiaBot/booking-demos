(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav
  const nav = document.querySelector("[data-nav]");
  const toggle = document.querySelector("[data-nav-toggle]");
  if (nav && toggle) {
    toggle.addEventListener("click", () => {
      const open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", String(!open));
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", !open ? "Close menu" : "Open menu");
    });

    nav.addEventListener("click", (e) => {
      const t = e.target;
      if (t && t.tagName === "A") {
        nav.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      }
    });
  }

  // Smooth scroll with reduced-motion respect
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
      history.pushState(null, "", href);
    });
  });

  // Callback form: build a mailto draft (no backend)
  const form = document.getElementById("callbackForm");
  const status = document.getElementById("formStatus");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const fd = new FormData(form);
      const name = String(fd.get("name") || "").trim();
      const phone = String(fd.get("phone") || "").trim();
      const reason = String(fd.get("reason") || "").trim();
      const notes = String(fd.get("notes") || "").trim();

      // Basic validation
      const digits = phone.replace(/\D/g, "");
      if (digits.length < 10) {
        if (status) status.textContent = "Please enter a valid phone number (at least 10 digits).";
        return;
      }

      const subject = encodeURIComponent(`Callback request — ${name}`);
      const bodyLines = [
        "Callback request from website",
        "",
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Reason: ${reason}`,
        notes ? `Notes: ${notes}` : "Notes: (none)",
        "",
        "Preferred next step: Please call the patient to schedule."
      ];
      const body = encodeURIComponent(bodyLines.join("\n"));

      const mailto = `mailto:intake@restoremotionpt.example?subject=${subject}&body=${body}`;
      window.location.href = mailto;

      if (status) status.textContent = "Opening your email app to send the request…";
      form.reset();
    });
  }
})();

(function () {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("nav--open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
  }

  // Simple client-side validation for demo forms
  const form = document.querySelector("[data-demo-form]");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = form.querySelector('input[name="name"]');
      const phone = form.querySelector('input[name="phone"]');
      const email = form.querySelector('input[name="email"]');

      const errors = [];
      if (!name || !name.value.trim()) errors.push("Please enter your name.");
      if (!phone || phone.value.replace(/\D/g, "").length < 10) errors.push("Please enter a valid phone number (10+ digits).");
      if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) errors.push("Please enter a valid email address.");

      const out = form.querySelector("[data-form-status]");
      if (out) {
        out.innerHTML = "";
        if (errors.length) {
          out.className = "notice";
          out.innerHTML = "<strong>Almost there:</strong><ul style='margin:8px 0 0 18px;'>" + errors.map(e => "<li>" + e + "</li>").join("") + "</ul>";
          return;
        }
        out.className = "notice";
        out.innerHTML = "<strong>Request received (demo):</strong> Thanks—our team will call you back shortly. For urgent concerns, please call the clinic.";
        form.reset();
      }
    });
  }
})();

(function() {
  // ========== LANGUAGE TOGGLE ==========
  let currentLang = localStorage.getItem('restoremotion-lang') || 'en';

  function applyTranslations(lang) {
    if (typeof translations === 'undefined') return;

    const t = translations[lang];
    if (!t) return;

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      const key = el.getAttribute('data-i18n');
      if (t[key]) {
        // Check if it contains HTML
        if (t[key].includes('<')) {
          el.innerHTML = t[key];
        } else {
          el.textContent = t[key];
        }
      }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
      const key = el.getAttribute('data-i18n-placeholder');
      if (t[key]) {
        el.placeholder = t[key];
      }
    });

    // Update html lang attribute
    document.documentElement.lang = lang;

    // Update language toggle button text
    document.querySelectorAll('[data-lang-toggle]').forEach(function(btn) {
      const langText = btn.querySelector('.lang-text');
      if (langText) {
        langText.textContent = lang === 'en' ? 'ES' : 'EN';
      }
    });

    // Store preference
    localStorage.setItem('restoremotion-lang', lang);
    currentLang = lang;
  }

  function toggleLanguage() {
    const newLang = currentLang === 'en' ? 'es' : 'en';
    applyTranslations(newLang);
  }

  // Initialize language toggle buttons
  document.querySelectorAll('[data-lang-toggle]').forEach(function(btn) {
    btn.addEventListener('click', toggleLanguage);
  });

  // Apply saved language on page load
  if (currentLang !== 'en') {
    if (typeof translations !== 'undefined') {
      applyTranslations(currentLang);
    } else {
      setTimeout(function() {
        if (typeof translations !== 'undefined') {
          applyTranslations(currentLang);
        }
      }, 100);
    }
  }

  // ========== YEAR ==========
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ========== MOBILE NAV ==========
  const nav = document.querySelector("[data-nav]");
  const toggle = document.querySelector("[data-nav-toggle]");
  if (nav && toggle) {
    toggle.addEventListener("click", function() {
      const open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", String(!open));
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", !open ? "Close menu" : "Open menu");
    });

    nav.addEventListener("click", function(e) {
      const t = e.target;
      if (t && t.tagName === "A") {
        nav.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target) && !toggle.contains(e.target) && nav.getAttribute("data-open") === "true") {
        nav.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      }
    });
  }

  // ========== SMOOTH SCROLL ==========
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener("click", function(e) {
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

  // ========== SCROLL ANIMATIONS ==========
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const animationObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in, .stagger-children').forEach(function(el) {
    animationObserver.observe(el);
  });

  // ========== PARALLAX SHAPES ==========
  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        const scrollY = window.scrollY;
        const shapes = document.querySelectorAll('.floating-shape');
        shapes.forEach(function(shape, i) {
          const speed = 0.03 + (i * 0.01);
          shape.style.transform = 'translateY(' + (scrollY * speed) + 'px)';
        });
        ticking = false;
      });
      ticking = true;
    }
  });

  // ========== CALLBACK FORM ==========
  const form = document.getElementById("callbackForm");
  const status = document.getElementById("formStatus");
  if (form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();

      const fd = new FormData(form);
      const name = String(fd.get("name") || "").trim();
      const phone = String(fd.get("phone") || "").trim();
      const reason = String(fd.get("reason") || "").trim();
      const notes = String(fd.get("notes") || "").trim();

      // Basic validation
      const digits = phone.replace(/\D/g, "");
      if (digits.length < 10) {
        if (status) status.textContent = currentLang === 'es' 
          ? "Por favor ingresa un número de teléfono válido (al menos 10 dígitos)."
          : "Please enter a valid phone number (at least 10 digits).";
        return;
      }

      const subject = encodeURIComponent("Callback request — " + name);
      const bodyLines = [
        "Callback request from website",
        "",
        "Name: " + name,
        "Phone: " + phone,
        "Reason: " + reason,
        notes ? "Notes: " + notes : "Notes: (none)",
        "",
        "Preferred next step: Please call the patient to schedule."
      ];
      const body = encodeURIComponent(bodyLines.join("\n"));

      const mailto = "mailto:intake@restoremotionpt.example?subject=" + subject + "&body=" + body;
      window.location.href = mailto;

      if (status) status.textContent = currentLang === 'es'
        ? "Abriendo tu aplicación de correo para enviar la solicitud…"
        : "Opening your email app to send the request…";
      form.reset();
    });
  }
})();

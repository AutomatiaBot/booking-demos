(function () {
  // Language toggle functionality
  let currentLang = localStorage.getItem('pawsandpines-lang') || 'en';
  
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
    const langToggle = document.querySelector('[data-lang-toggle]');
    if (langToggle) {
      const langText = langToggle.querySelector('.lang-text');
      if (langText) {
        langText.textContent = lang === 'en' ? 'ES' : 'EN';
      }
    }
    
    // Store preference
    localStorage.setItem('pawsandpines-lang', lang);
    currentLang = lang;
  }
  
  function toggleLanguage() {
    const newLang = currentLang === 'en' ? 'es' : 'en';
    applyTranslations(newLang);
  }
  
  // Initialize language toggle button
  const langToggle = document.querySelector('[data-lang-toggle]');
  if (langToggle) {
    langToggle.addEventListener('click', toggleLanguage);
  }
  
  // Apply saved language on page load
  if (currentLang !== 'en') {
    // Wait for translations to be loaded
    if (typeof translations !== 'undefined') {
      applyTranslations(currentLang);
    } else {
      // Try again after a short delay
      setTimeout(function() {
        if (typeof translations !== 'undefined') {
          applyTranslations(currentLang);
        }
      }, 100);
    }
  }

  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("nav--open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
  }

  // Scroll-triggered animations
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

  // Observe all fade-in and stagger-children elements
  document.querySelectorAll('.fade-in, .stagger-children').forEach(function(el) {
    animationObserver.observe(el);
  });

  // Parallax effect for floating shapes (subtle)
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

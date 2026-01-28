(function () {
  // =====================
  // MOBILE NAVIGATION
  // =====================
  const toggle = document.querySelector('[data-mobile-toggle]');
  const navLinks = document.querySelector('[data-nav-links]');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
    });
  }

  // Active nav link based on current page
  const path = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-links a:not(.nav-portal):not(.lang-toggle)').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === path) a.classList.add('active');
  });

  // =====================
  // LANGUAGE TOGGLE
  // =====================
  const STORAGE_KEY = 'stonebridge_lang';
  let currentLang = localStorage.getItem(STORAGE_KEY) || 'en';

  // Initialize language on page load
  function initLanguage() {
    document.documentElement.lang = currentLang;
    updateLanguageToggleButtons();
    applyTranslations();
  }

  // Update all language toggle buttons
  function updateLanguageToggleButtons() {
    document.querySelectorAll('.lang-toggle').forEach(btn => {
      const langText = btn.querySelector('.lang-text');
      if (langText) {
        langText.textContent = currentLang === 'en' ? 'ES' : 'EN';
      }
    });
  }

  // Apply translations to all elements with data-i18n attribute
  function applyTranslations() {
    if (typeof translations === 'undefined') return;
    
    const lang = translations[currentLang] || translations.en;
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (lang[key]) {
        // Check if it's an input placeholder
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = lang[key];
        } else if (el.tagName === 'OPTION') {
          el.textContent = lang[key];
        } else {
          el.textContent = lang[key];
        }
      }
    });

    // Handle HTML content (for elements that need inner HTML)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (lang[key]) {
        el.innerHTML = lang[key];
      }
    });
  }

  // Toggle language
  function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'es' : 'en';
    localStorage.setItem(STORAGE_KEY, currentLang);
    document.documentElement.lang = currentLang;
    updateLanguageToggleButtons();
    applyTranslations();
  }

  // Attach click handlers to language toggle buttons
  document.querySelectorAll('.lang-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleLanguage();
    });
  });

  // Initialize language on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguage);
  } else {
    initLanguage();
  }

  // =====================
  // CHAT MODAL
  // =====================
  const modal = document.getElementById('chatModal');
  const openBtns = document.querySelectorAll('[data-chat-open]');
  const closeBtns = document.querySelectorAll('[data-chat-close]');
  
  if (modal) {
    const close = () => {
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
    const open = () => {
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const closeBtn = modal.querySelector('[data-chat-close]');
      if (closeBtn) closeBtn.focus();
    };

    openBtns.forEach(btn => btn.addEventListener('click', open));
    closeBtns.forEach(btn => btn.addEventListener('click', close));
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });
    
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') close();
    });
  }

  // =====================
  // CONTACT FORM
  // =====================
  const form = document.querySelector('[data-contact-form]');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('[name="name"]').value.trim();
      const phone = form.querySelector('[name="phone"]').value.trim();
      const email = form.querySelector('[name="email"]').value.trim();
      const intent = form.querySelector('[name="intent"]').value;
      const message = form.querySelector('[name="message"]').value.trim();

      const digits = phone.replace(/\D/g, '');
      
      // Validation messages based on language
      const isSpanish = currentLang === 'es';
      const msgs = {
        nameRequired: isSpanish ? 'Por favor ingresa tu nombre.' : 'Please enter your name.',
        phoneInvalid: isSpanish ? 'Por favor ingresa un número de teléfono válido (al menos 10 dígitos).' : 'Please enter a valid phone number (at least 10 digits).',
        emailInvalid: isSpanish ? 'Por favor ingresa un email válido (o déjalo en blanco).' : 'Please enter a valid email (or leave it blank).',
        intentRequired: isSpanish ? 'Por favor selecciona en qué necesitas ayuda.' : 'Please select what you need help with.'
      };
      
      if (!name) return alert(msgs.nameRequired);
      if (digits.length < 10) return alert(msgs.phoneInvalid);
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert(msgs.emailInvalid);
      if (!intent) return alert(msgs.intentRequired);

      const subject = encodeURIComponent('Stonebridge Realty — New Inquiry');
      const body = encodeURIComponent(
        `Name: ${name}\nPhone: ${phone}\nEmail: ${email || '(not provided)'}\nInterest: ${intent}\n\nMessage:\n${message || '(no details provided)'}\n\nNote: This message was created from the website contact form.`
      );

      const mailto = `mailto:${form.getAttribute('data-to')}?subject=${subject}&body=${body}`;
      window.location.href = mailto;
    });
  }

  // =====================
  // FAQ ACCORDION (Details/Summary)
  // =====================
  // The <details> element handles this natively, but we can add smooth animations
  document.querySelectorAll('.faq-item').forEach(item => {
    const summary = item.querySelector('summary');
    const content = item.querySelector('.faq-content');
    
    if (summary && content) {
      summary.addEventListener('click', (e) => {
        // Add animation class
        content.style.animation = item.open ? 'none' : 'fadeInUp 0.3s ease';
      });
    }
  });

  // =====================
  // SCROLL ANIMATIONS
  // =====================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements that should animate on scroll
  document.querySelectorAll('.card, .testimonial-card, .agent-card, .property-card, .faq-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });

  // Override animate-in class behavior
  const style = document.createElement('style');
  style.textContent = `
    .animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);

  // =====================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // =====================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
})();

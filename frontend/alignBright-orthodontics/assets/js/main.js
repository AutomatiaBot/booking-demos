// AlignBright Orthodontics - Main JavaScript
(function() {
  'use strict';

  // ===== LANGUAGE TOGGLE =====
  const STORAGE_KEY = 'alignbright-lang';
  
  // Detect browser language or use stored preference
  function getInitialLanguage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (stored === 'en' || stored === 'es')) {
      return stored;
    }
    // Detect browser language
    const browserLang = navigator.language || navigator.userLanguage;
    return browserLang.startsWith('es') ? 'es' : 'en';
  }

  let currentLang = getInitialLanguage();

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

    // Update aria-labels
    document.querySelectorAll('[data-i18n-aria]').forEach(function(el) {
      const key = el.getAttribute('data-i18n-aria');
      if (t[key]) {
        el.setAttribute('aria-label', t[key]);
      }
    });

    // Update html lang attribute
    document.documentElement.lang = lang;

    // Update language toggle button text
    const langToggles = document.querySelectorAll('[data-lang-toggle]');
    langToggles.forEach(function(toggle) {
      toggle.textContent = lang === 'en' ? 'ES' : 'EN';
    });

    // Store preference
    localStorage.setItem(STORAGE_KEY, lang);
    currentLang = lang;

    // Update meta description if available
    const metaDesc = document.querySelector('meta[name="description"]');
    const metaDescKey = document.querySelector('meta[data-i18n-content]');
    if (metaDescKey && t[metaDescKey.getAttribute('data-i18n-content')]) {
      metaDesc.setAttribute('content', t[metaDescKey.getAttribute('data-i18n-content')]);
    }
  }

  function toggleLanguage() {
    const newLang = currentLang === 'en' ? 'es' : 'en';
    applyTranslations(newLang);
  }

  // Initialize language toggle buttons
  document.querySelectorAll('[data-lang-toggle]').forEach(function(btn) {
    btn.addEventListener('click', toggleLanguage);
  });

  // Apply initial language (only if not default English or stored preference exists)
  if (typeof translations !== 'undefined') {
    applyTranslations(currentLang);
  }

  // ===== MOBILE MENU =====
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');
  
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function() {
      const isOpen = mobileNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when clicking a link
    mobileNav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        mobileNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        mobileNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // ===== SCROLL ANIMATIONS =====
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

  // Observe all animated elements
  document.querySelectorAll('.fade-in, .stagger-children').forEach(function(el) {
    animationObserver.observe(el);
  });

  // ===== HEADER SCROLL EFFECT =====
  const header = document.querySelector('.header');
  let lastScroll = 0;

  if (header) {
    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== CONTACT FORM HANDLING =====
  const contactForm = document.querySelector('[data-contact-form]');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const firstname = contactForm.querySelector('[name="firstname"]');
      const lastname = contactForm.querySelector('[name="lastname"]');
      const phone = contactForm.querySelector('[name="phone"]');
      const email = contactForm.querySelector('[name="email"]');
      const reason = contactForm.querySelector('[name="reason"]');
      const message = contactForm.querySelector('[name="message"]');
      const consent = contactForm.querySelector('[name="consent"]');

      // Validation
      if (!firstname || firstname.value.trim().length < 2) {
        showError(firstname, currentLang === 'es' ? 'Por favor ingresa tu nombre.' : 'Please enter your first name.');
        return;
      }

      if (!lastname || lastname.value.trim().length < 2) {
        showError(lastname, currentLang === 'es' ? 'Por favor ingresa tu apellido.' : 'Please enter your last name.');
        return;
      }

      const digits = (phone.value || '').replace(/\D/g, '');
      if (digits.length < 10) {
        showError(phone, currentLang === 'es' ? 'Por favor ingresa un número de teléfono válido (al menos 10 dígitos).' : 'Please enter a valid phone number (at least 10 digits).');
        return;
      }

      if (email && email.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) {
        showError(email, currentLang === 'es' ? 'Por favor ingresa un correo electrónico válido o déjalo vacío.' : 'Please enter a valid email address or leave it blank.');
        return;
      }

      if (!reason || !reason.value) {
        showError(reason, currentLang === 'es' ? 'Por favor selecciona un motivo para tu visita.' : 'Please select a reason for your visit.');
        return;
      }

      if (consent && !consent.checked) {
        showError(consent, currentLang === 'es' ? 'Por favor acepta ser contactado.' : 'Please agree to be contacted.');
        return;
      }

      // Show success message
      const successDiv = document.querySelector('[data-form-success]');
      if (successDiv) {
        const t = translations[currentLang];
        successDiv.innerHTML = `
          <div class="form-success">
            <h4>${t['form-success-title']}</h4>
            <p>${t['form-success-text']}</p>
          </div>
        `;
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Hide form
      contactForm.style.display = 'none';
    });
  }

  // Home page short form
  const homeForm = document.querySelector('[data-home-form]');
  
  if (homeForm) {
    homeForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const firstname = homeForm.querySelector('[name="firstname"]');
      const phone = homeForm.querySelector('[name="phone"]');
      const reason = homeForm.querySelector('[name="reason"]');

      if (!firstname || firstname.value.trim().length < 2) {
        showError(firstname, currentLang === 'es' ? 'Por favor ingresa tu nombre.' : 'Please enter your first name.');
        return;
      }

      const digits = (phone.value || '').replace(/\D/g, '');
      if (digits.length < 10) {
        showError(phone, currentLang === 'es' ? 'Por favor ingresa un número de teléfono válido.' : 'Please enter a valid phone number.');
        return;
      }

      // Show success
      const successDiv = document.querySelector('[data-home-form-success]');
      if (successDiv) {
        const t = translations[currentLang];
        successDiv.innerHTML = `
          <div class="form-success">
            <h4>${t['form-success-title']}</h4>
            <p>${t['form-success-text']}</p>
          </div>
        `;
      }
      homeForm.style.display = 'none';
    });
  }

  function showError(element, message) {
    alert(message);
    if (element && element.focus) {
      element.focus();
    }
  }

  // ===== FAQ ACCORDIONS =====
  document.querySelectorAll('details.faq-item').forEach(function(details) {
    details.addEventListener('toggle', function() {
      if (this.open) {
        // Close other open details in the same category
        const parent = this.closest('.faq-list, .faq-grid');
        if (parent) {
          parent.querySelectorAll('details.faq-item[open]').forEach(function(other) {
            if (other !== details) {
              other.removeAttribute('open');
            }
          });
        }
      }
    });
  });

  // ===== REVIEWS FILTER =====
  const filterButtons = document.querySelectorAll('[data-filter]');
  const reviewCards = document.querySelectorAll('[data-review-type]');

  if (filterButtons.length && reviewCards.length) {
    filterButtons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter');
        
        // Update active button
        filterButtons.forEach(function(b) {
          b.classList.remove('active');
        });
        this.classList.add('active');

        // Filter reviews
        reviewCards.forEach(function(card) {
          const type = card.getAttribute('data-review-type').toLowerCase();
          if (filter === 'all' || type.includes(filter.toLowerCase())) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ===== PHONE NUMBER FORMATTING =====
  document.querySelectorAll('input[type="tel"]').forEach(function(input) {
    input.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 10) value = value.slice(0, 10);
      
      if (value.length >= 6) {
        value = '(' + value.slice(0, 3) + ') ' + value.slice(3, 6) + '-' + value.slice(6);
      } else if (value.length >= 3) {
        value = '(' + value.slice(0, 3) + ') ' + value.slice(3);
      }
      
      e.target.value = value;
    });
  });

  // ===== CLICK TO CALL TRACKING =====
  document.querySelectorAll('a[href^="tel:"]').forEach(function(link) {
    link.addEventListener('click', function() {
      // Analytics tracking could go here
      console.log('Phone click:', this.href);
    });
  });

  // ===== ESCAPE HTML HELPER =====
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function(m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }

  // ===== HERO CAROUSEL =====
  const carousel = document.querySelector('[data-carousel]');
  if (carousel) {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.carousel-dot');
    let currentSlide = 0;
    let autoplayInterval;

    function goToSlide(index) {
      slides.forEach(function(slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function(dot, i) {
        dot.classList.toggle('active', i === index);
      });
      currentSlide = index;
    }

    function nextSlide() {
      const next = (currentSlide + 1) % slides.length;
      goToSlide(next);
    }

    function startAutoplay() {
      autoplayInterval = setInterval(nextSlide, 5500);
    }

    function stopAutoplay() {
      clearInterval(autoplayInterval);
    }

    // Dot click handlers
    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        const slideIndex = parseInt(this.getAttribute('data-slide'), 10);
        goToSlide(slideIndex);
        stopAutoplay();
        startAutoplay();
      });
    });

    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    // Start autoplay
    startAutoplay();
  }

})();

(function(){
  // Language toggle functionality
  let currentLang = localStorage.getItem('harborlight-lang') || 'en';
  
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
    localStorage.setItem('harborlight-lang', lang);
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

  // Mobile menu toggle
  const menuBtn = document.querySelector('[data-menu-btn]');
  const menu = document.querySelector('[data-menu]');
  if(menuBtn && menu){
    menuBtn.addEventListener('click', function(){
      const open = menu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function(e){
      if(!menu.contains(e.target) && !menuBtn.contains(e.target) && menu.classList.contains('open')){
        menu.classList.remove('open');
        menuBtn.setAttribute('aria-expanded','false');
      }
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
        // Optional: stop observing after animation
        // animationObserver.unobserve(entry.target);
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

  // Client-side form behavior (demo-only)
  const form = document.querySelector('[data-contact-form]');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const name = form.querySelector('input[name="name"]');
      const phone = form.querySelector('input[name="phone"]');
      const email = form.querySelector('input[name="email"]');
      const interest = form.querySelector('select[name="interest"]');
      const message = form.querySelector('textarea[name="message"]');

      const digits = (phone.value || '').replace(/\D/g,'');
      if((name.value || '').trim().length < 2){
        alert('Please enter your name.');
        name.focus(); return;
      }
      if(digits.length < 10){
        alert('Please enter a valid phone number (at least 10 digits).');
        phone.focus(); return;
      }
      if(email.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)){
        alert('Please enter a valid email address or leave it blank.');
        email.focus(); return;
      }
      if((message.value || '').trim().length < 10){
        alert('Please share a short message (at least 10 characters).');
        message.focus(); return;
      }

      const out = document.querySelector('[data-form-success]');
      if(out){
        out.innerHTML = `
          <div class="notice">
            <strong>Thanks, ${escapeHtml(name.value.trim())}.</strong>
            <div class="small">We received your message about <b>${escapeHtml(interest.value)}</b>. For scheduling, please call <a href="tel:+15556412289">(555) 641-2289</a> or email <a href="mailto:contact@harborlightcounseling.example">contact@harborlightcounseling.example</a>.</div>
          </div>
        `;
        out.scrollIntoView({behavior:'smooth', block:'start'});
      }
      form.reset();
    });
  }

  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, function(m){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]);
    });
  }
})();

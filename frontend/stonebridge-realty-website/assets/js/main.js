(function () {
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
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === path) a.classList.add('active');
  });

  // Chat modal (demo placeholder)
  const modal = document.getElementById('chatModal');
  const openBtn = document.querySelector('[data-chat-open]');
  const closeBtn = document.querySelector('[data-chat-close]');
  if (modal && openBtn && closeBtn) {
    const close = () => {
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
    const open = () => {
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      // Focus close for accessibility
      closeBtn.focus();
    };

    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') close();
    });
  }

  // Contact form: basic validation + mailto fallback
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
      if (!name) return alert('Please enter your name.');
      if (digits.length < 10) return alert('Please enter a valid phone number (at least 10 digits).');
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert('Please enter a valid email (or leave it blank).');
      if (!intent) return alert('Please select what you need help with.');

      const subject = encodeURIComponent('Stonebridge Realty — New Inquiry');
      const body = encodeURIComponent(
        `Name: ${name}\nPhone: ${phone}\nEmail: ${email || '(not provided)'}\nInterest: ${intent}\n\nMessage:\n${message || '(no details provided)'}\n\nNote: This message was created from the website contact form.`
      );

      const mailto = `mailto:${form.getAttribute('data-to')}?subject=${subject}&body=${body}`;
      window.location.href = mailto;
    });
  }
})();

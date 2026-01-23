(function(){
  const burger = document.querySelector('[data-burger]');
  const mobileNav = document.querySelector('[data-mobile-nav]');
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('show');
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Lightweight "lead capture" demo (no backend): validates and shows a toast
  const form = document.querySelector('[data-lead-form]');
  const toast = document.querySelector('[data-toast]');
  const toastClose = document.querySelector('[data-toast-close]');
  const phoneDigits = (v) => (v || '').replace(/\D/g,'');
  const isEmailLike = (v) => !v || (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(v));

  function showToast(title, msg){
    if(!toast) return;
    toast.querySelector('[data-toast-title]').textContent = title;
    toast.querySelector('[data-toast-msg]').textContent = msg;
    toast.classList.add('show');
    window.setTimeout(()=> toast.classList.remove('show'), 6500);
  }

  if (toastClose && toast) {
    toastClose.addEventListener('click', () => toast.classList.remove('show'));
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const phone = phoneDigits(String(data.get('phone') || ''));
      const email = String(data.get('email') || '').trim();
      const reason = String(data.get('reason') || '').trim();

      if (!name) return showToast('Missing info', 'Please enter your name so we can follow up.');
      if (phone.length < 10) return showToast('Check phone number', 'Please enter a valid phone number (at least 10 digits).');
      if (!isEmailLike(email)) return showToast('Check email', 'Please enter a valid email address (or leave it blank).');
      if (!reason) return showToast('Tell us what you need', 'Please select what you’d like help with.');

      // Store locally for demo purposes
      const payload = { name, phone, email, reason, createdAt: new Date().toISOString() };
      try { localStorage.setItem('clearview_lead_last', JSON.stringify(payload)); } catch(_) {}

      form.reset();
      showToast('Request received', 'Thanks! For scheduling, please call (555) 203-7811. If urgent symptoms are present, seek immediate care.');
    });
  }
})();

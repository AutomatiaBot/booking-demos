(function(){
  const hamb = document.querySelector('[data-hamburger]');
  const panel = document.querySelector('[data-mobile-panel]');
  if(hamb && panel){
    hamb.addEventListener('click', () => {
      const open = panel.classList.toggle('open');
      hamb.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // simple active nav highlighting
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('a[data-nav]').forEach(a=>{
    const href = (a.getAttribute('href') || '').toLowerCase();
    if(href === path) a.classList.add('active');
  });

  // Contact form -> mailto fallback
  const form = document.querySelector('[data-contact-form]');
  const toast = document.querySelector('[data-toast]');
  function showToast(msg){
    if(!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(()=>toast.classList.remove('show'), 4200);
  }

  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const fd = new FormData(form);
      const name = (fd.get('name')||'').toString().trim();
      const phone = (fd.get('phone')||'').toString().trim();
      const email = (fd.get('email')||'').toString().trim();
      const topic = (fd.get('topic')||'').toString();
      const message = (fd.get('message')||'').toString().trim();

      if(!name || !phone){
        showToast('Please enter your name and phone so our team can reach you.');
        return;
      }
      // At least 10 digits check (demo-friendly)
      const digits = phone.replace(/\D/g,'');
      if(digits.length < 10){
        showToast('Please confirm your phone number (at least 10 digits).');
        return;
      }

      const subject = encodeURIComponent('New website inquiry — ' + topic);
      const body = encodeURIComponent(
        `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nTopic: ${topic}\n\nMessage:\n${message}\n\n— Sent from PeakPoint website`
      );

      const mailto = form.getAttribute('data-mailto');
      if(mailto){
        window.location.href = `mailto:${mailto}?subject=${subject}&body=${body}`;
        showToast('Opening your email app to send your request.');
      } else {
        showToast('Thanks—your info is ready. Please call the clinic to schedule.');
      }
      form.reset();
    });
  }
})();

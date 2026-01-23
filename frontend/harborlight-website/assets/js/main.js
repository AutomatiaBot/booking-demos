(function(){
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

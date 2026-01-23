(function(){
  const nav = document.querySelector('.nav');
  const btn = document.querySelector('.menu-btn');
  if(btn && nav){
    btn.addEventListener('click', () => {
      const open = nav.classList.toggle('mobile-open');
      btn.setAttribute('aria-expanded', String(open));
    });
  }

  // Simple client-side validation + mailto generation for the contact page
  const form = document.querySelector('[data-contact-form]');
  if(form){
    const status = document.querySelector('[data-form-status]');
    const privacyUrl = form.getAttribute('data-privacy-url') || '#';

    const digitsOnly = (s) => (s || '').replace(/\D/g, '');

    const validate = () => {
      const name = form.querySelector('[name="name"]').value.trim();
      const phone = form.querySelector('[name="phone"]').value.trim();
      const email = form.querySelector('[name="email"]').value.trim();
      const matter = form.querySelector('[name="matter"]').value;
      const message = form.querySelector('[name="message"]').value.trim();

      if(!name) return "Please enter your name.";
      if(digitsOnly(phone).length < 10) return "Please enter a valid phone number (at least 10 digits).";
      if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address, or leave it blank.";
      if(!matter) return "Please select a matter type.";
      if(!message) return "Please add a short message (no confidential details).";
      return null;
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const err = validate();
      if(err){
        status.className = 'alert warn';
        status.textContent = err;
        status.hidden = false;
        return;
      }

      // Privacy consent reminder (matches the prompt behavior)
      const consent = form.querySelector('[name="consent"]').checked;
      if(!consent){
        status.className = 'alert warn';
        status.innerHTML = 'Before we proceed, please confirm you agree to our Privacy Policy: ' + privacyUrl;
        status.hidden = false;
        return;
      }

      const name = form.querySelector('[name="name"]').value.trim();
      const phone = form.querySelector('[name="phone"]').value.trim();
      const email = form.querySelector('[name="email"]').value.trim();
      const matter = form.querySelector('[name="matter"]').value;
      const urgency = form.querySelector('[name="urgency"]').value;
      const message = form.querySelector('[name="message"]').value.trim();

      const subject = encodeURIComponent(`New intake inquiry — ${matter}`);
      const body = encodeURIComponent(
`Name: ${name}
Phone: ${phone}
Email: ${email || '(not provided)'}
Matter: ${matter}
Urgency: ${urgency || '(not selected)'}

Message (please avoid confidential details in email as well):
${message}

— Sent from website intake form`
      );

      const to = form.getAttribute('data-intake-email');
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;

      status.className = 'alert success';
      status.textContent = "Thanks—your email draft is ready. If it doesn't open, please call the office phone number shown on this page.";
      status.hidden = false;
      form.reset();
    });
  }
})();

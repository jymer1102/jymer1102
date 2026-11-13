/* connect.js : Connect page only (phone/email pop-ups, glowing inputs, contact form) */

// --- Phone and email pop-ups ---
(function () {
  const phoneLink = document.getElementById('phone-link');
  const phoneModal = document.getElementById('phone-modal');
  const closeModal = document.getElementById('close-modal');

  phoneLink.addEventListener('click', (e) => {
    e.preventDefault();
    phoneModal.classList.add('is-visible');
  });

  closeModal.addEventListener('click', () => {
    phoneModal.classList.remove('is-visible');
  });

  phoneModal.addEventListener('click', (e) => {
    if (e.target === phoneModal) {
      phoneModal.classList.remove('is-visible');
    }
  });

  const emailLink = document.getElementById('email-link');
  const emailModal = document.getElementById('email-modal');
  const closeEmailModal = document.getElementById('close-email-modal');
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const emailAddress = 'theoneandonly@jymer1102.me';
  const copyEmailDefaultHTML = copyEmailBtn.innerHTML;

  emailLink.addEventListener('click', (e) => {
    e.preventDefault();
    emailModal.classList.add('is-visible');
  });

  closeEmailModal.addEventListener('click', () => {
    emailModal.classList.remove('is-visible');
  });

  emailModal.addEventListener('click', (e) => {
    if (e.target === emailModal) {
      emailModal.classList.remove('is-visible');
    }
  });

  copyEmailBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(emailAddress);
      copyEmailBtn.innerHTML = '<re-icon icon="check-circle" weight="outline" decorative></re-icon> Copied!';
    } catch (err) {
      console.error('Copy failed:', err);
      copyEmailBtn.innerHTML = '<re-icon icon="x-circle" weight="outline" decorative></re-icon> Copy failed';
    }
    setTimeout(() => {
      copyEmailBtn.innerHTML = copyEmailDefaultHTML;
    }, 1600);
  });
})();

// --- Glowing form fields ---
(function () {
  document.querySelectorAll('.glow-input-wrapper').forEach(wrapper => {
    const hiddenInput = wrapper.querySelector('.glow-input-hidden');
    const displayText = wrapper.querySelector('.display-text');
    const displayBox = wrapper.querySelector('.glow-input-display');
    const caret = wrapper.querySelector('.custom-caret');

    hiddenInput.addEventListener('input', () => {
      displayText.textContent = hiddenInput.value;
      displayBox.scrollTop = hiddenInput.scrollTop;
    });

    hiddenInput.addEventListener('scroll', () => {
      displayBox.scrollTop = hiddenInput.scrollTop;
    });

    hiddenInput.addEventListener('focus', () => {
      caret.style.display = 'inline-block';
    });

    hiddenInput.addEventListener('blur', () => {
      caret.style.display = 'none';
    });
  });
})();

// --- Contact form submit ---
(function () {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const statusBox = document.getElementById('form-status');
  const submitBtnDefaultHTML = submitBtn.innerHTML;

  const showStatus = (type, message) => {
    statusBox.classList.remove('status-success', 'status-error');
    statusBox.classList.add(type === 'success' ? 'status-success' : 'status-error');
    const icon = type === 'success' ? 'check-circle' : 'alert-circle';
    statusBox.innerHTML = `<re-icon icon="${icon}" weight="outline" decorative></re-icon><span>${message}</span>`;
    statusBox.classList.add('is-visible');
  };

  const hideStatus = () => {
    statusBox.classList.remove('is-visible');
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideStatus();

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<re-icon icon="loader" weight="outline" decorative></re-icon> Sending…';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.reset();
        // The custom glow-input fields mirror their hidden inputs in a
        // separate display span — clear those out too since form.reset()
        // only clears the real <input>/<textarea> elements.
        form.querySelectorAll('.display-text').forEach(span => span.textContent = '');
        showStatus('success', "Thanks — your message is on its way. I'll get back to you soon.");
      } else {
        const data = await response.json().catch(() => null);
        const detail = data && data.errors && data.errors.length
        ? data.errors.map(err => err.message).join(', ')
        : 'Something went wrong sending your message.';
        showStatus('error', `${detail} Try again, or email me directly at theoneandonly@jymer1102.me.`);
      }
    } catch (err) {
      console.error('Form submission failed:', err);
      showStatus('error', "Couldn't reach the server. Try again, or email me directly at theoneandonly@jymer1102.me.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = submitBtnDefaultHTML;
    }
  });
})();

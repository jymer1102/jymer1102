/* main.js : behaviour shared by every page (loaded from _includes/scripts.html) */

// Scroll animations (AOS is only loaded on pages that use it)
if (window.AOS) {
  AOS.init({
    once: false,
    mirror: true,
    duration: 800,
    easing: 'ease-out-cubic'
  });
}

// Cursor-following glow on every .js-interactive-container
(function () {
  function attachGlow(container) {
    if (container.__glowAttached) return;
    container.__glowAttached = true;

    const updateGlowPosition = (clientX, clientY) => {
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      container.style.setProperty('--mx', `${x}px`);
      container.style.setProperty('--my', `${y}px`);
    };

    container.addEventListener('mousemove', (e) => updateGlowPosition(e.clientX, e.clientY));
    container.addEventListener('pointerdown', (e) => updateGlowPosition(e.clientX, e.clientY));
    container.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      if (touch) updateGlowPosition(touch.clientX, touch.clientY);
    });
  }

  document.querySelectorAll('.js-interactive-container').forEach(attachGlow);

  // Lets scripts that build cards later (like the cookie banner) opt in to the glow
  window.jymerAttachGlow = attachGlow;
})();

// Footer year
(function () {
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

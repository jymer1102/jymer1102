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
  const interactiveContainers = document.querySelectorAll('.js-interactive-container');

  interactiveContainers.forEach(container => {
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
  });
})();

// Footer year
(function () {
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

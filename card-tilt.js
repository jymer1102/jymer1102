/* card-tilt.js
   - Cursor-as-weight 3D tilt on hover/touch
   - Scroll-velocity tilt (faster scroll = more forward-lean)
   - Respects prefers-reduced-motion
   - Harmonized with AOS animations */

(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* ── Tunables ──────────────────────────────────────────────────────────── */
  const SELECTORS    = '.split-card, .project-card, .connect-panel, .form-container';
  const MAX_TILT     = 13;     // pointer tilt, degrees
  const LIFT_PX      = 12;     // max translateZ on pointer tilt
  const PERSPECTIVE  = 900;    // px
  const SNAP_EASE    = '0.55s cubic-bezier(0.22, 0.8, 0.28, 1)';
  const MOVE_EASE    = '0.10s ease-out';

  /* scroll-tilt tunables */
  const SCROLL_MAX_TILT  = 14;   
  const SCROLL_MAX_VEL   = 1800; 
  const SCROLL_DECAY     = 0.88; 

  /* ── State ─────────────────────────────────────────────────────────────── */
  const cards        = [];       
  let   lastScrollY  = window.scrollY;
  let   lastTime     = performance.now();
  let   scrollVel    = 0;        
  let   rafId        = null;

  /* ── Helpers ────────────────────────────────────────────────────────────── */
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  function applyTransform(card, rx, ry, rz, lift) {
    card.el.style.transition = `transform ${MOVE_EASE}, box-shadow ${MOVE_EASE}`;
    card.el.style.transform  =
      `perspective(${PERSPECTIVE}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) translateZ(${lift}px)`;
    card.el.style.boxShadow  =
      `0 ${14 + lift}px ${36 + lift * 2}px -16px rgba(0,0,0,${0.35 + lift * 0.016})`;
    card.el.style.setProperty('--tilt-rx', rx);
    card.el.style.setProperty('--tilt-ry', ry);
  }

  function snapReset(card) {
    card.el.style.transition = `transform ${SNAP_EASE}, box-shadow ${SNAP_EASE}`;
    card.el.style.transform  = 'perspective(900px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateZ(0px)';
    card.el.style.boxShadow  = '';
    card.el.style.setProperty('--tilt-rx', 0);
    card.el.style.setProperty('--tilt-ry', 0);

    // Clear inline styles after the snap transition finishes so AOS can regain control of the element
    clearTimeout(card.resetTimer);
    card.resetTimer = setTimeout(() => {
      if (!card.pointerActive && Math.abs(card.scrollTilt) < 0.05) {
        card.el.style.transition = '';
        card.el.style.transform = '';
      }
    }, 600);
  }

  /* ── Pointer tilt ───────────────────────────────────────────────────────── */
  function pointerTilt(card, clientX, clientY) {
    const rect = card.el.getBoundingClientRect();
    const nx   = ((clientX - rect.left) / rect.width  - 0.5) * 2;
    const ny   = ((clientY - rect.top)  / rect.height - 0.5) * 2;
    const rx   = -ny * MAX_TILT;
    const ry   =  nx * MAX_TILT;
    const lift = LIFT_PX * Math.min(Math.sqrt(nx * nx + ny * ny), 1);
    const sRx = card.scrollTilt;
    
    applyTransform(card, rx + sRx * 0.4, ry, 0, lift);
  }

  /* ── Scroll-velocity tilt loop ──────────────────────────────────────────── */
  function tick(now) {
    const dt    = Math.max(now - lastTime, 1);       
    lastTime    = now;
    const sy    = window.scrollY;
    const rawV  = (sy - lastScrollY) / dt * 1000;   
    lastScrollY = sy;
    scrollVel = scrollVel * 0.7 + rawV * 0.3;
    const tiltAngle = clamp(scrollVel / SCROLL_MAX_VEL, -1, 1) * SCROLL_MAX_TILT;

    cards.forEach(card => {
      if (!card.readyForTilt) return; // Completely skip this card if AOS is currently animating it

      if (Math.abs(tiltAngle) < 0.3) {
        card.scrollTilt *= SCROLL_DECAY;
        if (Math.abs(card.scrollTilt) < 0.05) card.scrollTilt = 0;
      } else {
        const rect = card.el.getBoundingClientRect();
        const visible = rect.bottom > 0 && rect.top < window.innerHeight;
        if (visible) {
          const centre = (rect.top + rect.bottom) / 2 / window.innerHeight;
          const weight = 1 - Math.abs(centre - 0.5) * 1.4; 
          card.scrollTilt = tiltAngle * Math.max(weight, 0.15);
        }
      }

      if (!card.pointerActive) {
        if (Math.abs(card.scrollTilt) > 0.05) {
          applyTransform(card, card.scrollTilt, 0, 0, Math.abs(card.scrollTilt) * 0.5);
        } else {
          snapReset(card);
        }
      }
    });

    rafId = requestAnimationFrame(tick);
  }

  /* ── Card setup ─────────────────────────────────────────────────────────── */
  function attachCard(el) {
    const isAos = el.hasAttribute('data-aos');
    const card = { 
      el, 
      pointerActive: false, 
      scrollTilt: 0, 
      isAos, 
      readyForTilt: !isAos, 
      resetTimer: null 
    };
    
    cards.push(card);

    // AOS Integration: Watch for the aos-animate class to trigger before enabling tilt
    if (isAos) {
      if (el.classList.contains('aos-animate')) {
         setTimeout(() => { card.readyForTilt = true; }, 1000);
      }
      
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(m => {
          if (m.attributeName === 'class') {
            if (el.classList.contains('aos-animate')) {
              // Wait 1000ms (AOS 800ms duration + 200ms buffer) before allowing tilts
              setTimeout(() => { card.readyForTilt = true; }, 1000);
            } else {
              card.readyForTilt = false;
              // Immediately strip tilt inline styles so AOS can handle the scroll-up hide animation
              card.el.style.transition = '';
              card.el.style.transform = '';
              card.el.style.boxShadow = '';
            }
          }
        });
      });
      observer.observe(el, { attributes: true });
    }

    /* — Mouse — */
    el.addEventListener('mousemove', (e) => {
      if (!card.readyForTilt) return;
      card.pointerActive = true;
      pointerTilt(card, e.clientX, e.clientY);
    });
    
    el.addEventListener('mouseleave', () => {
      card.pointerActive = false;
    });

    /* — Touch — */
    el.addEventListener('touchstart', (e) => {
      if (!card.readyForTilt) return;
      card.pointerActive = true;
      const t = e.touches[0];
      if (t) pointerTilt(card, t.clientX, t.clientY);
    }, { passive: true });

    el.addEventListener('touchmove', (e) => {
      if (!card.readyForTilt) return;
      const t = e.touches[0];
      if (!t) return;
      const rect = el.getBoundingClientRect();
      const inside =
        t.clientX >= rect.left && t.clientX <= rect.right &&
        t.clientY >= rect.top  && t.clientY <= rect.bottom;
      if (inside) {
        pointerTilt(card, t.clientX, t.clientY);
      } else {
        card.pointerActive = false;
      }
    }, { passive: true });

    el.addEventListener('touchend',    () => { card.pointerActive = false; });
    el.addEventListener('touchcancel', () => { card.pointerActive = false; });
  }

  /* ── Init ───────────────────────────────────────────────────────────────── */
  function init() {
    document.querySelectorAll(SELECTORS).forEach(attachCard);
    if (cards.length) rafId = requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

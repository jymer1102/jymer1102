/* card-tilt.js
   - Cursor-as-weight 3D tilt on hover/touch
   - Scroll-velocity tilt (faster scroll = more forward-lean, like Instagram)
   - Respects prefers-reduced-motion                                          */

(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* ── Tunables ──────────────────────────────────────────────────────────── */
  const SELECTORS    = '.split-card, .project-card';
  const MAX_TILT     = 13;     // pointer tilt, degrees
  const LIFT_PX      = 12;     // max translateZ on pointer tilt
  const PERSPECTIVE  = 900;    // px – lower = more dramatic
  const SNAP_EASE    = '0.55s cubic-bezier(0.22, 0.8, 0.28, 1)';
  const MOVE_EASE    = '0.10s ease-out';

  /* scroll-tilt tunables */
  const SCROLL_MAX_TILT  = 14;   // degrees of forward lean at full speed
  const SCROLL_MAX_VEL   = 1800; // px/s considered "max speed"
  const SCROLL_DECAY     = 0.88; // how fast the tilt snaps back (per frame)

  /* ── State ─────────────────────────────────────────────────────────────── */
  const cards        = [];       // { el, pointerActive, scrollTilt }
  let   lastScrollY  = window.scrollY;
  let   lastTime     = performance.now();
  let   scrollVel    = 0;        // smoothed scroll velocity (px/s, signed)
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
  }

  /* ── Pointer tilt ───────────────────────────────────────────────────────── */
  function pointerTilt(card, clientX, clientY) {
    const rect = card.el.getBoundingClientRect();
    const nx   = ((clientX - rect.left) / rect.width  - 0.5) * 2;
    const ny   = ((clientY - rect.top)  / rect.height - 0.5) * 2;
    const rx   = -ny * MAX_TILT;
    const ry   =  nx * MAX_TILT;
    const lift = LIFT_PX * Math.min(Math.sqrt(nx * nx + ny * ny), 1);

    /* blend pointer tilt with any live scroll tilt */
    const sRx = card.scrollTilt;
    applyTransform(card, rx + sRx * 0.4, ry, 0, lift);
  }

  /* ── Scroll-velocity tilt loop ──────────────────────────────────────────── */
  function tick(now) {
    const dt    = Math.max(now - lastTime, 1);       // ms
    lastTime    = now;
    const sy    = window.scrollY;
    const rawV  = (sy - lastScrollY) / dt * 1000;   // px/s
    lastScrollY = sy;

    /* exponential smoothing so it doesn't feel jittery */
    scrollVel = scrollVel * 0.7 + rawV * 0.3;

    /* map velocity → tilt angle (forward lean = negative rotateX = tilt top away) */
    const tiltAngle = clamp(scrollVel / SCROLL_MAX_VEL, -1, 1) * SCROLL_MAX_TILT;

    cards.forEach(card => {
      /* decay scroll tilt when near-zero */
      if (Math.abs(tiltAngle) < 0.3) {
        card.scrollTilt *= SCROLL_DECAY;
        if (Math.abs(card.scrollTilt) < 0.05) card.scrollTilt = 0;
      } else {
        /* only tilt cards currently visible in the viewport */
        const rect = card.el.getBoundingClientRect();
        const visible =
          rect.bottom > 0 && rect.top < window.innerHeight;
        if (visible) {
          /* amount depends on how centred the card is vertically in viewport */
          const centre = (rect.top + rect.bottom) / 2 / window.innerHeight;
          const weight = 1 - Math.abs(centre - 0.5) * 1.4; // 1 at centre, fades edges
          card.scrollTilt = tiltAngle * Math.max(weight, 0.15);
        }
      }

      /* only apply scroll tilt when pointer isn't controlling the card */
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
    const card = { el, pointerActive: false, scrollTilt: 0 };
    cards.push(card);

    /* — Mouse — */
    el.addEventListener('mousemove', (e) => {
      card.pointerActive = true;
      pointerTilt(card, e.clientX, e.clientY);
    });
    el.addEventListener('mouseleave', () => {
      card.pointerActive = false;
      /* let the RAF loop snap it back smoothly */
    });

    /* — Touch — */
    el.addEventListener('touchstart', (e) => {
      card.pointerActive = true;
      const t = e.touches[0];
      if (t) pointerTilt(card, t.clientX, t.clientY);
    }, { passive: true });

    el.addEventListener('touchmove', (e) => {
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

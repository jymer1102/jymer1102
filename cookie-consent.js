/*
 * cookie-consent.js
 *
 * - Shows a GDPR/CCPA-style consent banner (Accept / Decline) on a visitor's first visit.
 * - Remembers the choice for 180 days in a first-party cookie (localStorage fallback).
 * - Honors the browser's Global Privacy Control signal (treated as "Decline").
 * - Lets visitors reopen the banner from any element with the [data-cookie-settings] attribute.
 * - Keeps the footer year current: any element with [data-year] is filled with the current year.
 *
 * Nothing optional (analytics, ads, etc.) is loaded by this site today. If you add something
 * like that later, only load it after consent, using the API below:
 *
 *   window.jymerConsent.analytics          -> true / false (current choice)
 *   window.jymerConsent.onChange(function (granted) { ... })
 *                                          -> runs now (if a choice exists) and on every change
 *   window.jymerConsent.open()             -> reopens the banner
 *
 * Example (Google Analytics 4). Replace G-XXXXXXXXXX with your own measurement ID:
 *
 *   window.jymerConsent.onChange(function (granted) {
 *     if (!granted || window.__gaLoaded) return;
 *     window.__gaLoaded = true;
 *     var s = document.createElement('script');
 *     s.async = true;
 *     s.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
 *     document.head.appendChild(s);
 *     window.dataLayer = window.dataLayer || [];
 *     window.gtag = function () { dataLayer.push(arguments); };
 *     gtag('js', new Date());
 *     gtag('config', 'G-XXXXXXXXXX', { anonymize_ip: true });
 *   });
 *
 * If you do add analytics, also update the Privacy Policy (privacy.html) to name the service.
 */
(function () {
    'use strict';

    var STORAGE_KEY = 'jymer1102_consent';
    var POLICY_VERSION = 1;                       // bump to ask everyone again after a policy change
    var MAX_AGE_SECONDS = 60 * 60 * 24 * 180;     // 180 days
    var PRIVACY_URL = '/privacy/';

    var state = null;        // 'granted' | 'denied' | null (not decided yet)
    var listeners = [];
    var banner = null;
    var lastTrigger = null;
    var hideTimer = null;

    /* ---------------------------------------------------------------- storage */

    function readCookie() {
        var parts = document.cookie ? document.cookie.split('; ') : [];
        for (var i = 0; i < parts.length; i++) {
            var eq = parts[i].indexOf('=');
            if (parts[i].slice(0, eq) === STORAGE_KEY) {
                return decodeURIComponent(parts[i].slice(eq + 1));
            }
        }
        return null;
    }

    function parse(value) {
        // stored as "<version>.<granted|denied>"
        if (!value) return null;
        var bits = String(value).split('.');
        if (Number(bits[0]) !== POLICY_VERSION) return null;
        return bits[1] === 'granted' || bits[1] === 'denied' ? bits[1] : null;
    }

    function readStored() {
        var fromCookie = parse(readCookie());
        if (fromCookie) return fromCookie;
        try {
            var raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
            if (raw && Date.now() - raw.t < MAX_AGE_SECONDS * 1000) return parse(raw.v);
        } catch (e) { /* storage unavailable */ }
        return null;
    }

    function writeStored(choice) {
        var value = POLICY_VERSION + '.' + choice;
        var cookie = STORAGE_KEY + '=' + encodeURIComponent(value) +
            '; Max-Age=' + MAX_AGE_SECONDS + '; Path=/; SameSite=Lax';
        if (location.protocol === 'https:') cookie += '; Secure';
        document.cookie = cookie;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: value, t: Date.now() }));
        } catch (e) { /* storage unavailable */ }
    }

    /* ------------------------------------------------------------- public API */

    function notify() {
        var granted = state === 'granted';
        api.analytics = granted;
        for (var i = 0; i < listeners.length; i++) {
            try { listeners[i](granted); } catch (e) { /* a bad listener must not break others */ }
        }
        try {
            window.dispatchEvent(new CustomEvent('jymer-consent', { detail: { analytics: granted } }));
        } catch (e) { /* very old browsers */ }
    }

    var api = {
        analytics: false,
        onChange: function (fn) {
            if (typeof fn !== 'function') return;
            listeners.push(fn);
            if (state !== null) { try { fn(state === 'granted'); } catch (e) {} }
        },
        open: function (trigger) { showBanner(trigger || null); }
    };
    window.jymerConsent = api;

    function choose(choice) {
        state = choice;
        writeStored(choice);
        notify();
        hideBanner(true);
    }

    /* ----------------------------------------------------------------- banner */

    function buildBanner() {
        var el = document.createElement('div');
        el.className = 'cookie-banner';
        el.id = 'cookie-banner';
        el.setAttribute('role', 'dialog');
        el.setAttribute('aria-modal', 'false');
        el.setAttribute('aria-labelledby', 'cookie-banner-title');
        el.setAttribute('aria-describedby', 'cookie-banner-desc');
        el.hidden = true;
        el.innerHTML =
            '<h2 id="cookie-banner-title">Your privacy choices</h2>' +
            '<p id="cookie-banner-desc">This site uses a small amount of essential storage to remember your theme and this choice. ' +
            'If optional analytics or other non-essential cookies are ever added, they stay off unless you accept. ' +
            'Change your mind anytime with <strong>Cookie Settings</strong> in the footer. ' +
            'Read the <a href="' + PRIVACY_URL + '">Privacy Policy</a>.</p>' +
            '<div class="cookie-banner-actions">' +
            '<button type="button" class="cookie-btn" data-consent="denied">Decline</button>' +
            '<button type="button" class="cookie-btn" data-consent="granted">Accept</button>' +
            '</div>';

        el.addEventListener('click', function (event) {
            var btn = event.target.closest('[data-consent]');
            if (btn) choose(btn.getAttribute('data-consent'));
        });

        el.addEventListener('keydown', function (event) {
            // Escape only closes the banner if a choice already exists (never skips the decision).
            if (event.key === 'Escape' && state !== null) hideBanner(true);
        });

        document.body.appendChild(el);
        return el;
    }

    function showBanner(trigger) {
        if (!banner) banner = buildBanner();
        lastTrigger = trigger;
        clearTimeout(hideTimer);

        var buttons = banner.querySelectorAll('[data-consent]');
        for (var i = 0; i < buttons.length; i++) {
            var selected = state !== null && buttons[i].getAttribute('data-consent') === state;
            buttons[i].classList.toggle('is-selected', selected);
            buttons[i].setAttribute('aria-pressed', selected ? 'true' : 'false');
        }

        banner.hidden = false;
        document.body.classList.add('cookie-banner-open');
        window.requestAnimationFrame(function () {
            banner.classList.add('is-visible');
            // Only move focus when the visitor asked for it (footer link); never on first load.
            if (trigger) {
                var first = banner.querySelector('[data-consent]');
                if (first) first.focus();
            }
        });
    }

    function hideBanner(restoreFocus) {
        if (!banner) return;
        banner.classList.remove('is-visible');
        document.body.classList.remove('cookie-banner-open');
        hideTimer = setTimeout(function () { banner.hidden = true; }, 300);
        if (restoreFocus && lastTrigger && typeof lastTrigger.focus === 'function') {
            lastTrigger.focus();
        }
        lastTrigger = null;
    }

    /* ------------------------------------------------------------------- init */

    function fillYear() {
        var year = String(new Date().getFullYear());
        var nodes = document.querySelectorAll('[data-year]');
        for (var i = 0; i < nodes.length; i++) nodes[i].textContent = year;
    }

    function init() {
        fillYear();

        document.addEventListener('click', function (event) {
            var trigger = event.target.closest('[data-cookie-settings]');
            if (trigger) {
                event.preventDefault();
                showBanner(trigger);
            }
        });

        state = readStored();

        if (state === null && navigator.globalPrivacyControl === true) {
            // Global Privacy Control = an opt-out signal. Honor it without nagging.
            state = 'denied';
            writeStored('denied');
        }

        api.analytics = state === 'granted';

        if (state === null) {
            showBanner(null);
        } else {
            notify();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

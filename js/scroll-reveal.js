// Shared scroll behavior for the whole site:
// - Fades the scroll indicator out over 0.5s once the user scrolls past 10px
// - Hides "reveal" containers until the user starts scrolling
(function () {
    // Homepage: always start at the top on reload (no restored scroll position)
    if (location.pathname === '/' || location.pathname === '/index.html') {
        if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }

    function updateScrollState() {
        var indicator = document.getElementById('scroll-indicator');
        var revealEls = document.querySelectorAll('.reveal-on-scroll');
        var past10px = window.scrollY > 10;

        if (indicator) {
            indicator.classList.toggle('is-hidden', past10px);
        }

        revealEls.forEach(function (el) {
            el.classList.toggle('is-visible', past10px);
        });
    }

    // Throttle or passive listener for performance
    window.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('DOMContentLoaded', updateScrollState);
})();

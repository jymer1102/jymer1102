// Shared scroll behavior for the whole site:
// - Fades the scroll indicator out over 0.5s once the user scrolls past 10px
// - Hides "reveal" containers until the user starts scrolling
(function () {
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

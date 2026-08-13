// Shared scroll behavior for the whole site:
// - Fades the scroll indicator out over 0.5s once the user scrolls past 10px
//   (CSS handles the actual 0.5s fade via the .is-hidden class / transition).
// - Hides "reveal" containers (cards/panels) until the user starts scrolling,
//   then fades them in. Scrolling back up to the top hides them again and
//   brings the scroll indicator back.
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

        if (!past10px && window.AOS) {
            AOS.refresh();
        }
    }

    window.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('DOMContentLoaded', updateScrollState);
})();

// Wires up the light/dark toggle button. The initial theme itself is decided
// by a tiny inline script in <head> (runs before paint to avoid a flash):
// it uses the saved preference if one exists, otherwise the device's
// prefers-color-scheme, otherwise falls back to dark.
(function () {
    var SPIN_DURATION = 500;

    function updateIcon(theme) {
        var icon = document.querySelector('#theme-toggle i');
        if (!icon) return;
        icon.className = (theme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon') + (icon.classList.contains('icon-spin') ? ' icon-spin' : '');
    }

    function currentTheme() {
        return document.documentElement.getAttribute('data-theme') || 'dark';
    }

    document.addEventListener('DOMContentLoaded', function () {
        updateIcon(currentTheme());

        var btn = document.getElementById('theme-toggle');
        if (btn) {
            btn.addEventListener('click', function () {
                var icon = document.querySelector('#theme-toggle i');
                var next = currentTheme() === 'dark' ? 'light' : 'dark';

                if (icon) {
                    icon.classList.remove('icon-spin');
                    // Force reflow so the animation restarts if clicked rapidly.
                    void icon.offsetWidth;
                    icon.classList.add('icon-spin');
                    setTimeout(function () {
                        icon.classList.remove('icon-spin');
                    }, SPIN_DURATION);
                }

                // Swap the symbol at the midpoint of the spin, so it flips
                // from sun to moon (or back) right as the icon is edge-on.
                setTimeout(function () {
                    document.documentElement.setAttribute('data-theme', next);
                    try { localStorage.setItem('theme', next); } catch (e) {}
                    updateIcon(next);
                }, SPIN_DURATION / 2);
            });
        }

        // If the person hasn't manually chosen a theme, keep following the
        // device's setting live if it changes while the page is open.
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
                var stored;
                try { stored = localStorage.getItem('theme'); } catch (err) { stored = null; }
                if (stored) return;
                var theme = e.matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', theme);
                updateIcon(theme);
            });
        }
    });
})();

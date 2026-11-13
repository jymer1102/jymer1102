// Wires up the light/dark toggle button. The initial theme itself is decided
// by a tiny inline script in <head> (runs before paint to avoid a flash):
// it uses the saved preference if one exists, otherwise the device's
// prefers-color-scheme, otherwise falls back to dark.
(function () {
    var SPIN_DURATION = 500;

    function ensureLabelElements(btn) {
        if (!btn) return null;

        // Wrap the button if it isn't already inside .theme-toggle-wrapper
        var wrapper = btn.parentElement;
        if (!wrapper || !wrapper.classList.contains('theme-toggle-wrapper')) {
            wrapper = document.createElement('div');
            wrapper.className = 'theme-toggle-wrapper';
            btn.parentNode.insertBefore(wrapper, btn);
            wrapper.appendChild(btn);
        }

        // Create the sibling .theme-label span right after the button if missing
        var textSpan = wrapper.querySelector('.theme-label');
        if (!textSpan) {
            textSpan = document.createElement('span');
            textSpan.className = 'theme-label';
            wrapper.appendChild(textSpan);
        }

        return textSpan;
    }

    function updateButton(theme) {
        var btn = document.getElementById('theme-toggle');
        var icon = document.querySelector('#theme-toggle re-icon');
        var label = theme === 'dark' ? 'Toggle Light Mode' : 'Toggle Dark Mode';
        
        if (btn) {
            btn.setAttribute('aria-label', label);
            var textSpan = ensureLabelElements(btn);
            if (textSpan) {
                textSpan.textContent = label;
            }
        }

        if (icon) {
            icon.setAttribute('icon', theme === 'light' ? 'sun' : 'moon');
        }
    }

    function currentTheme() {
        return document.documentElement.getAttribute('data-theme') || 'dark';
    }

    document.addEventListener('DOMContentLoaded', function () {
        updateButton(currentTheme());

        var btn = document.getElementById('theme-toggle');
        if (btn) {
            btn.addEventListener('click', function () {
                var icon = document.querySelector('#theme-toggle re-icon');
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

                // Swap the symbol and label at the midpoint of the spin, so it flips
                // from sun to moon (or back) right as the icon is edge-on.
                setTimeout(function () {
                    document.documentElement.setAttribute('data-theme', next);
                    try { localStorage.setItem('theme', next); } catch (e) {}
                    updateButton(next);
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
                updateButton(theme);
            });
        }
    });
})();

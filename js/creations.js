/* creations.js : loaded in the <head> of the Creations page because the
   project images call jyFallback() from their onerror attribute. */
function jyFallback(img, initials) {
  img.style.display = 'none';
  var icon = img.closest('.project-icon');
  icon.classList.add('icon-fallback');
  var span = document.createElement('span');
  span.textContent = initials;
  icon.appendChild(span);
}


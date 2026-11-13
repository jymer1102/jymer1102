/* index.js : home page only (fades the banner out after the GIF finishes) */
window.addEventListener('DOMContentLoaded', () => {
  const banner = document.getElementById('banner-container');
  if (banner) {
    const gifDuration = 9500;
    setTimeout(() => {
      banner.classList.add('fade-out');
    }, gifDuration);
  }
});

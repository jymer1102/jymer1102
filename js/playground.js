/* playground.js : Playground page only */
(function () {
const DEFAULT_HTML = `<h1><re-icon icon="handshake"></re-icon> Hello, user<span class="cursor"></span></h1>
<p>Edit the HTML, CSS, and JS boxes above and watch the preview update.</p>
<button id="demo-btn"><span><re-icon icon="cursor" weight="outline" decorative></re-icon> Click me!</span></button>
`;

const DEFAULT_CSS = `
:root {
  --bg-color: #0a0a0c;
  --card-bg: #111116;
  --text-main: #f7f7f7;
  --text-muted: #a3a3ac;
  --accent-color: #1E56E0;
  --accent-bright: #4FA9FF;
  --accent-glow: rgba(30, 86, 224, 0.35);
  --border-color: rgba(255, 255, 255, 0.08);
  --radius: 12px;
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

:root[data-theme="light"] {
  --bg-color: #f4f5f8;
  --card-bg: #ffffff;
  --text-main: #15151a;
  --text-muted: #46464f;
  --accent-bright: #145dc7;
  --border-color: rgba(10, 10, 12, 0.09);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  background-color: var(--bg-color);
  color: var(--text-main);
  font-family: var(--font-family);
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  text-align: center;
  cursor: url('data:image/svg+xml,%3Csvg%20width%3D%2232%22%20height%3D%2232%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cpath%20d%3D%22M17.2607%2012.4008C19.3774%2011.2626%2020.4357%2010.6935%2020.7035%2010.0084C20.9359%209.41393%2020.8705%208.74423%2020.5276%208.20587C20.1324%207.58551%2018.984%207.23176%2016.6872%206.52425L8.00612%203.85014C6.06819%203.25318%205.09923%202.95471%204.45846%203.19669C3.90068%203.40733%203.46597%203.85584%203.27285%204.41993C3.051%205.06794%203.3796%206.02711%204.03681%207.94545L6.94793%2016.4429C7.75632%2018.8025%208.16052%2019.9824%208.80519%2020.3574C9.36428%2020.6826%2010.0461%2020.7174%2010.6354%2020.4507C11.3149%2020.1432%2011.837%2019.0106%2012.8813%2016.7454L13.6528%2015.0719C13.819%2014.7113%2013.9021%2014.531%2014.0159%2014.3736C14.1168%2014.2338%2014.2354%2014.1078%2014.3686%2013.9984C14.5188%2013.8752%2014.6936%2013.7812%2015.0433%2013.5932L17.2607%2012.4008Z%22%20stroke%3D%22%234faafe%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3C%2Fsvg%3E') 4 4, default;
}

a, button, select, input[type="submit"] {
  cursor: url('data:image/svg+xml,%3Csvg%20width%3D%2232%22%20height%3D%2232%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22%234faafe%22%20fill-opacity%3D%220.35%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cpath%20d%3D%22M17.2607%2012.4008C19.3774%2011.2626%2020.4357%2010.6935%2020.7035%2010.0084C20.9359%209.41393%2020.8705%208.74423%2020.5276%208.20587C20.1324%207.58551%2018.984%207.23176%2016.6872%206.52425L8.00612%203.85014C6.06819%203.25318%205.09923%202.95471%204.45846%203.19669C3.90068%203.40733%203.46597%203.85584%203.27285%204.41993C3.051%205.06794%203.3796%206.02711%204.03681%207.94545L6.94793%2016.4429C7.75632%2018.8025%208.16052%2019.9824%208.80519%2020.3574C9.36428%2020.6826%2010.0461%2020.7174%2010.6354%2020.4507C11.3149%2020.1432%2011.837%2019.0106%2012.8813%2016.7454L13.6528%2015.0719C13.819%2014.7113%2013.9021%2014.531%2014.0159%2014.3736C14.1168%2014.2338%2014.2354%2014.1078%2014.3686%2013.9984C14.5188%2013.8752%2014.6936%2013.7812%2015.0433%2013.5932L17.2607%2012.4008Z%22%20stroke%3D%22%234faafe%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3C%2Fsvg%3E') 4 4, pointer !important;
}

h1 {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
  background: linear-gradient(120deg, #ffffff 0%, #ffffff 45%, var(--accent-bright) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

:root[data-theme="light"] h1 {
  background: linear-gradient(120deg, #0a0a0c 0%, #0a0a0c 45%, var(--accent-bright) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

p {
  color: var(--text-muted);
  font-size: 1rem;
  line-height: 1.6;
  max-width: 480px;
  margin-bottom: 1.75rem;
}

#demo-btn {
  font-family: var(--font-family);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-main);
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  padding: 12px 24px;
  border-radius: var(--radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  will-change: transform;
  transform-style: preserve-3d;
  --tilt-rx: 0;
  --tilt-ry: 0;

  transition: transform 0.12s ease-out, 
              border-color 0.3s cubic-bezier(0.22, 0.8, 0.28, 1), 
              box-shadow 0.3s cubic-bezier(0.22, 0.8, 0.28, 1),
              color 0.3s cubic-bezier(0.22, 0.8, 0.28, 1);
}

#demo-btn > * {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transform-style: preserve-3d;
  transform: translateZ(12px) rotateX(calc(var(--tilt-rx) * -1deg)) rotateY(calc(var(--tilt-ry) * -1deg));
  transition: transform 0.35s cubic-bezier(0.22, 0.8, 0.28, 1);
}

#demo-btn:hover {
  border-color: var(--accent-color);
  color: var(--accent-bright);
  box-shadow: 0 0 20px var(--accent-glow);
}

#demo-btn:hover > * {
  transform: translateZ(24px) scale(1.04) rotateX(calc(var(--tilt-rx) * -1deg)) rotateY(calc(var(--tilt-ry) * -1deg));
}

#demo-btn:active {
  transform: translateY(-1px);

}
body {
  cursor: url('data:image/svg+xml,%3Csvg%20width%3D%2232%22%20height%3D%2232%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cpath%20d%3D%22M17.2607%2012.4008C19.3774%2011.2626%2020.4357%2010.6935%2020.7035%2010.0084C20.9359%209.41393%2020.8705%208.74423%2020.5276%208.20587C20.1324%207.58551%2018.984%207.23176%2016.6872%206.52425L8.00612%203.85014C6.06819%203.25318%205.09923%202.95471%204.45846%203.19669C3.90068%203.40733%203.46597%203.85584%203.27285%204.41993C3.051%205.06794%203.3796%206.02711%204.03681%207.94545L6.94793%2016.4429C7.75632%2018.8025%208.16052%2019.9824%208.80519%2020.3574C9.36428%2020.6826%2010.0461%2020.7174%2010.6354%2020.4507C11.3149%2020.1432%2011.837%2019.0106%2012.8813%2016.7454L13.6528%2015.0719C13.819%2014.7113%2013.9021%2014.531%2014.0159%2014.3736C14.1168%2014.2338%2014.2354%2014.1078%2014.3686%2013.9984C14.5188%2013.8752%2014.6936%2013.7812%2015.0433%2013.5932L17.2607%2012.4008Z%22%20stroke%3D%22%234faafe%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3C%2Fsvg%3E') 4 4, auto;
}
a, a *, 
button, button *, 
input[type="submit"], 
input[type="button"], 
[role="button"] {
  cursor: url('data:image/svg+xml,%3Csvg%20width%3D%2232%22%20height%3D%2232%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22%234faafe%22%20fill-opacity%3D%220.35%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cpath%20d%3D%22M17.2607%2012.4008C19.3774%2011.2626%2020.4357%2010.6935%2020.7035%2010.0084C20.9359%209.41393%2020.8705%208.74423%2020.5276%208.20587C20.1324%207.58551%2018.984%207.23176%2016.6872%206.52425L8.00612%203.85014C6.06819%203.25318%205.09923%202.95471%204.45846%203.19669C3.90068%203.40733%203.46597%203.85584%203.27285%204.41993C3.051%205.06794%203.3796%206.02711%204.03681%207.94545L6.94793%2016.4429C7.75632%2018.8025%208.16052%2019.9824%208.80519%2020.3574C9.36428%2020.6826%2010.0461%2020.7174%2010.6354%2020.4507C11.3149%2020.1432%2011.837%2019.0106%2012.8813%2016.7454L13.6528%2015.0719C13.819%2014.7113%2013.9021%2014.531%2014.0159%2014.3736C14.1168%2014.2338%2014.2354%2014.1078%2014.3686%2013.9984C14.5188%2013.8752%2014.6936%2013.7812%2015.0433%2013.5932L17.2607%2012.4008Z%22%20stroke%3D%22%234faafe%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%3C%2Fsvg%3E') 4 4, pointer !important;
}

.cursor {
  display: inline-block;
  width: 0.45em;
  height: 0.9em;
  background-color: var(--accent-bright);
  box-shadow: 0 0 12px var(--accent-glow);
  border-radius: 2px;
  animation: blink 1s step-end infinite;
}


@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
`;

const DEFAULT_JS = `document.getElementById('demo-btn').addEventListener('click', () => {
  alert('Hello from your code!');
});`;

const htmlBox = document.getElementById('html-code');
const cssBox = document.getElementById('css-code');
const jsBox = document.getElementById('js-code');
const frame = document.getElementById('preview-frame');
const runBtn = document.getElementById('run-btn');
const clearBtn = document.getElementById('clear-btn');
const resetBtn = document.getElementById('reset-btn');
const downloadBtn = document.getElementById('download-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const exitFullscreenBtn = document.getElementById('exit-fullscreen-btn');
const previewWrap = document.querySelector('.playground-preview-wrap');

/* Placeholder to preserve DOM location on restoration */
const previewPlaceholder = document.createElement('div');
previewPlaceholder.style.display = 'none';
previewWrap.parentNode.insertBefore(previewPlaceholder, previewWrap);

function loadDefaults() {
htmlBox.value = DEFAULT_HTML;
cssBox.value = DEFAULT_CSS;
jsBox.value = DEFAULT_JS;
}

function clearCode() {
htmlBox.value = '';
cssBox.value = '';
jsBox.value = '';
runCode();
}

function runCode() {
const siteTheme = document.documentElement.getAttribute('data-theme') || 'dark';
const doc = `<!DOCTYPE html>
<html data-theme="${siteTheme}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@7.1.0/css/all.min.css">
<script src="https://cdn.jsdelivr.net/npm/reicon@1.2.5/cdn/reicon.js" defer><\/script>
<style>${cssBox.value}</style>
</head>
<body>
${htmlBox.value}
<script>
try {
${jsBox.value}
} catch (err) {
document.body.insertAdjacentHTML('beforeend', '<pre style="color:#c0392b;white-space:pre-wrap;font-family:monospace;margin-top:16px;">' + err + '</pre>');
}

(function() {
  const btn = document.getElementById('demo-btn');
  if (!btn) return;

  const handlePointerMove = (e) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    
    target.style.setProperty('--tilt-rx', rotateX);
    target.style.setProperty('--tilt-ry', rotateY);
    target.style.transform = \`perspective(1000px) rotateX(\${rotateX}deg) rotateY(\${rotateY}deg)\`;
  };

  const handlePointerLeave = (e) => {
    const target = e.currentTarget;
    target.style.setProperty('--tilt-rx', '0');
    target.style.setProperty('--tilt-ry', '0');
    target.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  };

  btn.addEventListener('mousemove', handlePointerMove);
  btn.addEventListener('touchmove', handlePointerMove, { passive: true });
  btn.addEventListener('mouseleave', handlePointerLeave);
  btn.addEventListener('touchend', handlePointerLeave);
})();
<\/script>
</body>
</html>`;
frame.srcdoc = doc;
}

let debounceTimer;
function scheduleRun() {
clearTimeout(debounceTimer);
debounceTimer = setTimeout(runCode, 400);
}

loadDefaults();
runCode();

[htmlBox, cssBox, jsBox].forEach((box) => {
box.addEventListener('input', scheduleRun);
box.addEventListener('keydown', (e) => {
if (e.key === 'Tab') {
e.preventDefault();
const start = box.selectionStart;
const end = box.selectionEnd;
box.value = box.value.substring(0, start) + '  ' + box.value.substring(end);
box.selectionStart = box.selectionEnd = start + 2;
scheduleRun();
}
});
});

runBtn.addEventListener('click', runCode);
clearBtn.addEventListener('click', clearCode);
resetBtn.addEventListener('click', () => {
loadDefaults();
runCode();
});

/* Fullscreen Handler */
function enterFullscreen() {
  document.documentElement.classList.add('preview-fullscreen-active');
  document.body.classList.add('preview-fullscreen-active');
  
  // Move preview element directly under <body> so all other <body> children can be hidden cleanly
  document.body.appendChild(previewWrap);
  previewWrap.classList.add('is-fullscreen');
  fullscreenBtn.querySelector('re-icon').setAttribute('icon', 'minimize');

  // Request native browser fullscreen if supported
  if (previewWrap.requestFullscreen) {
    previewWrap.requestFullscreen().catch(() => {});
  } else if (previewWrap.webkitRequestFullscreen) {
    previewWrap.webkitRequestFullscreen();
  }
}

function exitFullscreen() {
  document.documentElement.classList.remove('preview-fullscreen-active');
  document.body.classList.remove('preview-fullscreen-active');
  
  // Restore preview back to its original slot in the layout
  if (previewPlaceholder.parentNode) {
    previewPlaceholder.parentNode.insertBefore(previewWrap, previewPlaceholder);
  }
  previewWrap.classList.remove('is-fullscreen');
  fullscreenBtn.querySelector('re-icon').setAttribute('icon', 'maximize');

  if (document.fullscreenElement || document.webkitFullscreenElement) {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

function toggleFullscreen() {
  const isFS = previewWrap.classList.contains('is-fullscreen') || !!document.fullscreenElement || !!document.webkitFullscreenElement;
  if (isFS) {
    exitFullscreen();
  } else {
    enterFullscreen();
  }
}

function handleFullscreenChange() {
  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    exitFullscreen();
  }
}

fullscreenBtn.addEventListener('click', toggleFullscreen);
exitFullscreenBtn.addEventListener('click', exitFullscreen);

document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    exitFullscreen();
  }
});

new MutationObserver(runCode).observe(document.documentElement, {
attributes: true,
attributeFilter: ['data-theme']
});

async function downloadZip() {
const originalLabel = downloadBtn.innerHTML;
try {
downloadBtn.disabled = true;
downloadBtn.textContent = 'Zipping…';
const zip = new JSZip();
const fullHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>My Code</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@7.1.0/css/all.min.css">
<script src="https://cdn.jsdelivr.net/npm/reicon@1.2.5/cdn/reicon.js" defer><\/script>
<link rel="stylesheet" href="style.css">
</head>
<body>
${htmlBox.value}
<script src="script.js"><\/script>
</body>
</html>`;

zip.file('index.html', fullHtml);
zip.file('style.css', cssBox.value);
zip.file('script.js', jsBox.value);

const blob = await zip.generateAsync({ type: 'blob' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'my-code.zip';
document.body.appendChild(a);
a.click();
a.remove();
URL.revokeObjectURL(url);
} catch (err) {
console.error('Download failed:', err);
alert('Something went wrong creating your zip. Please try again.');
} finally {
downloadBtn.disabled = false;
downloadBtn.innerHTML = originalLabel;
}
}

downloadBtn.addEventListener('click', downloadZip);
})();

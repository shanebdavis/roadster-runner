// Canvas setup and primitive drawing helpers
const cvs = document.getElementById('c');
const ctx = cvs.getContext('2d');
ctx.imageSmoothingEnabled = false;

function fitCanvas() {
  const w = window.innerWidth, h = window.innerHeight;
  const scale = Math.max(1, Math.floor(Math.min(w / VW, h / VH)));
  cvs.style.width  = (VW * scale) + 'px';
  cvs.style.height = (VH * scale) + 'px';
}
window.addEventListener('resize', fitCanvas);
fitCanvas();

function px(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x | 0, y | 0, w | 0, h | 0);
}

function drawText(x, y, str, color, scale) {
  scale = scale || 1;
  for (let i = 0; i < str.length; i++) {
    const g = FONT[str[i]] || FONT[' '];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 3; c++) {
        if (g[r][c] === '1') px(x + (i * 4 + c) * scale, y + r * scale, scale, scale, color);
      }
    }
  }
}

function textWidth(str, scale) { return str.length * 4 * (scale || 1) - (scale || 1); }

// Filled pixel ring (used by loops)
function drawRing(cx, cy, rOuter, rInner, color) {
  const r2out = rOuter * rOuter;
  const r2in  = rInner * rInner;
  for (let dy = -rOuter; dy <= rOuter; dy++) {
    for (let dx = -rOuter; dx <= rOuter; dx++) {
      const d2 = dx * dx + dy * dy;
      if (d2 <= r2out && d2 >= r2in) px(cx + dx, cy + dy, 1, 1, color);
    }
  }
}

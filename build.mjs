// Zero-dependency build: concatenates src/js/*.js in declared order, inlines
// src/css/style.css, and writes a single self-contained dist/index.html
// servable from GitHub Pages.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const srcDir = join(here, 'src');
const distDir = join(here, 'dist');

// Must match the order used by src/index.html (globals-based modules).
const JS_ORDER = [
  'palette.js',
  'config.js',
  'state.js',
  'font.js',
  'render.js',
  'particles.js',
  'parallax.js',
  'roadster.js',
  'vehicles.js',
  'loops.js',
  'spawn.js',
  'hud.js',
  'physics.js',
  'input.js',
  'main.js',
];

function readSrc(p) { return readFileSync(join(srcDir, p), 'utf8'); }

const css = readSrc('css/style.css');
const scripts = JS_ORDER
  .map(name => `// === ${name} ===\n` + readSrc(join('js', name)))
  .join('\n\n');

// Wrap all script content in a single IIFE so each file's top-level consts
// stay scoped and don't collide with anything on window.
const bundle = `(() => {\n${scripts}\n})();`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
<title>Roadster Runner</title>
<style>
${css}
</style>
</head>
<body>
<div id="stage"><canvas id="c" width="320" height="180"></canvas></div>
<div id="help"><b>SPACE</b> JUMP (2X=KICKFLIP) &middot; <b>X</b> ACCEL &middot; <b>SHIFT</b> SUCK</div>
<script>
${bundle}
</script>
</body>
</html>
`;

mkdirSync(distDir, { recursive: true });
writeFileSync(join(distDir, 'index.html'), html);
console.log(`built dist/index.html  (${html.length.toLocaleString()} bytes)`);

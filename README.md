# Roadster Runner

A silly 8-bit Chrome-dino-style endless runner starring the "flying" Tesla Roadster. Hop the Tesla lineup. Nail loop-the-loops with cold-gas thrust.

## Play

Live: https://shanebdavis.github.io/roadster-runner/

Controls:
- **Space** — jump. Tap again mid-air for a kickflip (bonus points if you land it)
- **X** — accelerate (burns fuel)
- **Shift** — suck beam (vacuums vehicles out of the way, burns fuel)

Obstacles are the Tesla fleet in front profile. A single jump clears Cybercabs, Model 3s, and Model Ys. Semis and 3-car rows need a kickflip. Loop-the-loops need you to hold X or Shift going up or you stall at the top and crash cartoonishly.

## Project layout

```
src/
  index.html         # dev entry (loads each JS file directly)
  css/style.css
  js/*.js            # one module per file, globals-based, loaded in order
build.mjs            # zero-dep bundler -> dist/index.html
dist/index.html      # built single-file artifact served by GitHub Pages
```

## Develop

Open `src/index.html` in a browser. No server, no npm install.

## Build

```
npm run build
```

That runs `node build.mjs`, which concatenates `src/js/*.js` (in the order declared in both `build.mjs` and `src/index.html`), inlines `src/css/style.css`, and writes `dist/index.html`.

// Particle + text popup helpers

function steamPuff(x, y, n) {
  // Chunky 8-bit cold-gas "steam cloud" puffs
  for (let i = 0; i < n; i++) {
    const spread = (Math.random() - 0.5) * 8;
    S.particles.push({
      x: x + spread, y: y + Math.random() * 2,
      vx: -1 - Math.random() * 1.5,
      vy: -Math.random() * 0.6 - 0.2,
      life: 24 + Math.random() * 20,
      c: Math.random() < 0.7 ? C.steam : C.steamDim,
      size: 3 + ((Math.random() * 2) | 0),
      steam: true,
    });
  }
}

function flamePuff(x, y, n) {
  for (let i = 0; i < n; i++) {
    S.particles.push({
      x, y,
      vx: -Math.random() * 2 - 0.5,
      vy: (Math.random() - 0.5) * 1.5,
      life: 10 + Math.random() * 10,
      c: Math.random() < 0.5 ? C.flame1 : C.flame2,
      size: 2,
    });
  }
}

function debrisPuff(x, y, n) {
  for (let i = 0; i < n; i++) {
    S.particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 5,
      vy: -Math.random() * 4 - 0.5,
      life: 30 + Math.random() * 25,
      c: Math.random() < 0.3 ? C.steam : (Math.random() < 0.5 ? C.boom1 : C.boom2),
      size: 2,
    });
  }
}

function popup(x, y, text, color) {
  S.popups.push({ x, y, text, color: color || C.text, life: 42 });
}

function updateParticles() {
  for (const p of S.particles) {
    p.x += p.vx; p.y += p.vy;
    if (!p.steam) p.vy += 0.08;
    else p.vy *= 0.96;
    p.life--;
  }
  S.particles = S.particles.filter(p => p.life > 0);
  for (const pp of S.popups) { pp.y -= 0.4; pp.life--; }
  S.popups = S.popups.filter(pp => pp.life > 0);
}

function drawParticles() {
  for (const p of S.particles) {
    const sz = p.size || 2;
    if (p.steam) {
      px(p.x + 1, p.y + 1, sz, sz, C.steamShadow);
      px(p.x,     p.y,     sz, sz, p.c);
    } else {
      px(p.x, p.y, sz, sz, p.c);
    }
  }
  for (const pp of S.popups) drawText(pp.x | 0, pp.y | 0, pp.text, pp.color);
}

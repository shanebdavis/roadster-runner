// Bootstrap + main loop

initParallax();

// Beam visual (SHIFT) draws over obstacles
function drawSuckBeam() {
  if (!(keys.suck && S.fuel > 0 && S.phase === 'playing')) return;
  const c = S.car;
  if (c.loopActive || c.falling) return;
  const bx = c.x + c.w, by = c.y + 4, bw = 60;
  const flick = (S.frame & 1) ? 0 : 1;
  for (let i = 0; i < bw; i += 4) {
    const h = 10 - (i / 8 | 0);
    px(bx + i, by + (10 - h) / 2, 3, h, i < 20 ? C.beam1 : C.beam2);
  }
  px(bx + bw - 2 + flick, by, 2, 10, C.beam1);
}

function render() {
  drawParallax();
  drawSuckBeam();
  // Obstacles behind the car, except the active loop (which the car is on)
  for (const o of S.obstacles) {
    if (o.kind === 'loop') drawLoop(o);
    else drawVehicle(o);
  }
  drawParticles();
  const boosting = keys.accel && S.fuel > 0 && S.phase === 'playing'
                   && !S.car.loopActive && !S.car.falling;
  drawRoadster(S.car.x, S.car.y, boosting, S.car.flipAngle);
  drawHud();
  if (S.phase === 'title') drawTitle();
  if (S.phase === 'dead')  drawDead();
}

function step() {
  S.frame++;
  if (S.phase === 'playing') stepPlaying();
  updateParticles();
}

let last = performance.now();
let acc = 0;
function loop(now) {
  acc += now - last;
  last = now;
  let n = 0;
  while (acc >= DT && n < 4) { step(); acc -= DT; n++; }
  render();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

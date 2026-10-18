// Per-frame game logic: jumping, physics, loop traversal, collisions, scoring.

function tryJump() {
  const c = S.car;
  if (S.phase === 'title' || S.phase === 'dead') { startGame(); return; }
  if (c.loopActive || c.falling) return;

  if (c.jumps === 0) {
    c.vy = JUMP_VY;
    c.onGround = false;
    c.jumps = 1;
    lastJumpTap = S.frame;
    steamPuff(c.x + 2, c.y + c.h, 10);
  } else if (c.jumps === 1 && S.frame - lastJumpTap < DOUBLE_JUMP_WINDOW) {
    // Kickflip: strong second impulse + spin
    c.vy = Math.min(c.vy, -1) - DOUBLE_JUMP_IMPULSE;
    c.jumps = 2;
    c.flipSpin = 0.26;
    steamPuff(c.x + 2, c.y + c.h, 14);
  }
}

function startGame() {
  S.phase = 'playing';
  S.t = 0;
  S.score = 0;
  S.baseSpeed = 2.0;
  S.speed = S.baseSpeed;
  S.fuel = 100;
  const c = S.car;
  c.x = 44;
  c.y = GROUND - c.h;
  c.vy = 0;
  c.onGround = true;
  c.jumps = 0;
  c.flipAngle = 0;
  c.flipSpin = 0;
  c.loopActive = false;
  c.loopAngle = 0;
  c.loopOmega = 0;
  c.falling = false;
  S.activeLoop = null;
  S.obstacles.length = 0;
  S.particles.length = 0;
  S.popups.length = 0;
  S.nextObstacle = 60;
}

function endGame() {
  S.phase = 'dead';
  if (S.score > S.best) {
    S.best = S.score;
    localStorage.setItem('rr_best8', S.best);
  }
  debrisPuff(S.car.x + 16, S.car.y + 8, 40);
}

function carHitbox() {
  return { x: S.car.x + 2, y: S.car.y + 2, w: S.car.w - 4, h: S.car.h - 3 };
}
function rectHit(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function stepPlaying() {
  const c = S.car;

  const usingFuel = (keys.accel || keys.suck) || c.loopActive;
  if (!usingFuel && S.fuel < 100) S.fuel = Math.min(100, S.fuel + 0.4);

  // Difficulty ramp
  S.baseSpeed = 2.0 + Math.min(3.5, S.t / 1800);
  S.t++;
  if ((S.frame % 6) === 0) S.score += 1;

  // Accelerate (X)
  if (keys.accel && S.fuel > 0 && !c.loopActive && !c.falling) {
    S.speed = Math.min(S.baseSpeed + 2.6, S.speed + 0.08);
    S.fuel -= 0.5;
    if ((S.frame & 1) === 0) flamePuff(c.x, c.y + 10, 1);
  } else if (!c.loopActive) {
    S.speed += (S.baseSpeed - S.speed) * 0.04;
  }

  // --- Loop traversal takes over physics while active ---
  if (c.loopActive) {
    stepLoop(c);
    return; // Skip ground physics + hit tests + scroll
  }

  // --- Falling (after a loop stall) ---
  if (c.falling) {
    c.vy += GRAVITY * 1.3;
    c.y += c.vy;
    c.flipAngle += c.flipSpin;
    if (c.y + c.h >= GROUND) {
      c.y = GROUND - c.h;
      debrisPuff(c.x + c.w / 2, GROUND, 36);
      c.falling = false;
      endGame();
      return;
    }
    // No scroll while plummeting (keeps the gag visible)
    return;
  }

  // --- Suck beam (SHIFT) ---
  if (keys.suck && S.fuel > 0) {
    S.fuel -= 0.6;
    const bx = c.x + c.w, by = c.y + 2, bw = 60, bh = c.h - 4;
    for (const o of S.obstacles) {
      if (o.hit) continue;
      if (o.kind === 'loop') continue; // can't suck loops
      if (rectHit({ x: bx, y: by, w: bw, h: bh }, o)) {
        o.x -= 4;
        if (o.x < c.x + c.w) {
          o.hit = true;
          S.score += 50;
          popup(o.x, o.y - 4, '+50', C.gaugeFill);
          for (let i = 0; i < 12; i++) {
            S.particles.push({
              x: o.x + o.w / 2, y: o.y + o.h / 2,
              vx: (Math.random() - 0.5) * 2, vy: -Math.random() * 2,
              life: 20, c: C.beam1, size: 2,
            });
          }
        }
      }
    }
  }

  // --- Standard jump physics ---
  c.vy += GRAVITY;
  c.y += c.vy;
  if (c.flipSpin) {
    c.flipAngle += c.flipSpin;
    if (c.jumps === 2 && c.flipAngle >= Math.PI * 2) {
      c.flipAngle = 0;
      c.flipSpin = 0;
      popup(c.x, c.y - 6, 'KICKFLIP +100', C.flame1);
      S.score += 100;
    }
  }
  if (c.y + c.h >= GROUND) {
    if (!c.onGround) {
      if (c.flipSpin && c.flipAngle < Math.PI * 2) {
        c.flipAngle = 0;
        c.flipSpin = 0;
        popup(c.x, c.y - 6, 'SKETCHY', C.textDim);
      }
      steamPuff(c.x + c.w / 2, GROUND, 8);
    }
    c.y = GROUND - c.h;
    c.vy = 0;
    c.onGround = true;
    c.jumps = 0;
  } else {
    c.onGround = false;
  }

  // --- World scroll + obstacle spawn/move ---
  S.scroll += S.speed;
  updateParallax(S.speed);

  if (--S.nextObstacle <= 0) spawnObstacleGroup();
  for (const o of S.obstacles) o.x -= S.speed;
  S.obstacles = S.obstacles.filter(o => o.x + (o.w || LOOP.w) > -4 && !o.hit);

  // --- Loop entry + vehicle collisions ---
  const hb = carHitbox();
  for (const o of S.obstacles) {
    if (o.kind === 'loop') {
      if (shouldEnterLoop(c, o)) { enterLoop(c, o); break; }
      // loops are not lethal on contact; just pass through visually
    } else {
      if (rectHit(hb, o)) { endGame(); break; }
    }
  }
}

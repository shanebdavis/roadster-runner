// Loop-the-loop obstacle.
// Needs thrust (X-accel or SHIFT-suck) to make it over the top; without
// thrust the Roadster stalls as it climbs, falls off, and crashes.
const LOOP = {
  w: 70,
  h: 70,
  r: 30,
};

function drawLoop(o) {
  const cx = (o.x + LOOP.w / 2) | 0;
  const cy = (o.y + LOOP.h / 2) | 0;

  // Vertical support posts into the ground
  px(cx - 1, cy + LOOP.r - 2, 2, (GROUND + 1) - (cy + LOOP.r - 2), C.loopPost);

  // Outer and inner ring, with a highlight stripe on top
  drawRing(cx, cy, LOOP.r,     LOOP.r - 4, C.loopTrack);
  drawRing(cx, cy, LOOP.r - 1, LOOP.r - 3, C.loopTrackHi);
  drawRing(cx, cy, LOOP.r,     LOOP.r - 1, C.loopTrackLo);

  // Entry/exit arrows at bottom
  px(cx - 10, GROUND - 2, 3, 1, C.flame1);
  px(cx - 9,  GROUND - 1, 1, 1, C.flame1);
  px(cx + 8,  GROUND - 2, 3, 1, C.flame1);
  px(cx + 10, GROUND - 1, 1, 1, C.flame1);
}

// Convert loop angle (0=bottom, grows CW) to world position.
function loopPos(loop, angle, radius) {
  const cx = loop.x + LOOP.w / 2;
  const cy = loop.y + LOOP.h / 2;
  return {
    x: cx + radius * Math.sin(angle),
    y: cy + radius * Math.cos(angle),
  };
}

// Check if the car should enter a given loop obstacle.
function shouldEnterLoop(car, loop) {
  if (loop.kind !== 'loop' || loop.consumed) return false;
  if (!car.onGround || car.loopActive || car.falling) return false;
  const entryX = loop.x + LOOP.w / 2 - 2;
  const carMid = car.x + car.w / 2;
  return Math.abs(carMid - entryX) <= 3;
}

function enterLoop(car, loop) {
  car.loopActive = true;
  car.loopAngle = 0;
  car.loopOmega = LOOP_INITIAL_OMEGA(S.speed);
  S.activeLoop = loop;
  popup(car.x, car.y - 10, 'LOOP!', C.beam1);
}

// Advance the car around the loop one step. Returns 'complete', 'fell', or 'ongoing'.
function stepLoop(car) {
  const loop = S.activeLoop;
  const thrust = (keys.accel || keys.suck) && S.fuel > 0;

  if (thrust) {
    car.loopOmega = Math.min(LOOP_OMEGA_MAX, car.loopOmega + LOOP_THRUST_GAIN);
    S.fuel -= 0.9;
    if ((S.frame & 1) === 0) flamePuff(car.x + 2, car.y + 10, 1);
  } else {
    // Gravity bleeds angular speed proportional to how "up" we're moving.
    // sin(angle) is positive on the ascending (right) half of the loop.
    car.loopOmega -= Math.max(0, Math.sin(car.loopAngle)) * 0.0055;
  }
  car.loopAngle += car.loopOmega;

  // Stall out: not making progress and still somewhere on the way up/over
  if (car.loopOmega <= 0 && car.loopAngle > 0.4 && car.loopAngle < Math.PI * 2 - 0.4) {
    car.loopActive = false;
    car.falling = true;
    car.vy = 0.5;
    car.flipSpin = (Math.random() < 0.5 ? -1 : 1) * (0.15 + Math.random() * 0.15);
    popup(car.x, car.y - 10, 'OOPS!', C.textDim);
    steamPuff(car.x + 8, car.y + 6, 6);
    return 'fell';
  }

  // Complete rotation
  if (car.loopAngle >= Math.PI * 2) {
    car.loopActive = false;
    car.flipAngle = 0;
    car.loopAngle = 0;
    car.y = GROUND - car.h;
    car.x = 44;
    car.vy = 0;
    car.onGround = true;
    car.jumps = 0;
    S.activeLoop.consumed = true;
    S.activeLoop = null;
    S.score += 200;
    popup(car.x, car.y - 10, 'LOOP +200', C.gaugeFill);
    return 'complete';
  }

  // Place car on circle and rotate sprite to tangent
  const p = loopPos(loop, car.loopAngle, LOOP.r - 6);
  car.x = p.x - car.w / 2;
  car.y = p.y - car.h / 2;
  // Tangent direction: derivative of (sin, cos) wrt angle = (cos, -sin)
  car.flipAngle = -car.loopAngle;
  return 'ongoing';
}

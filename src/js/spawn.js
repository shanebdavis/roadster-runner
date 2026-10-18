// Obstacle group spawning: rows of Tesla vehicles, lone semis, and loops.

function spawnObstacleGroup() {
  const r = Math.random();
  const diff = Math.min(1, S.t / 2400); // ramps 0->1 over ~40s

  // Early game is friendlier: no semis for ~15s, no loops for ~8s,
  // and only 1-car rows for the first few seconds.
  const earlyGame = S.t < 180;    // ~3s
  const noSemi    = S.t < 900;    // ~15s
  const noLoop    = S.t < 480;    // ~8s

  let group;

  if (!noLoop && r < 0.14 + diff * 0.08) {
    group = [{
      kind: 'loop',
      w: LOOP.w,
      h: LOOP.h,
      y: GROUND - LOOP.h,
      consumed: false,
    }];
  } else if (!noSemi && r < 0.36) {
    group = [{ kind: 'semi' }];
  } else {
    let n;
    const rr = Math.random();
    if (earlyGame)      n = 1;
    else if (rr < 0.45) n = 1;
    else if (rr < 0.80) n = 2;
    else                n = 3;
    group = [];
    const kinds = ['cybercab', 'model3', 'modely'];
    for (let i = 0; i < n; i++) {
      group.push({ kind: kinds[(Math.random() * kinds.length) | 0] });
    }
  }

  // Place group left-to-right starting just off the right edge
  let cursor = VW + 10;
  for (const o of group) {
    if (o.kind === 'loop') {
      o.x = cursor;
      cursor += o.w + 20;
    } else {
      const d = VEHICLES[o.kind];
      o.x = cursor;
      o.w = d.w;
      o.h = d.h;
      o.y = GROUND - d.h;
      cursor += d.w + 2;
    }
    o.hit = false;
    S.obstacles.push(o);
  }

  const groupW = cursor - (VW + 10);
  const gap = Math.max(100, 180 - (S.speed * 10) | 0) + ((Math.random() * 60) | 0) + (groupW * 0.5) | 0;
  S.nextObstacle = gap | 0;
}

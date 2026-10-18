// Sky, moon, stars, buildings, road

function initParallax() {
  for (let i = 0; i < 48; i++) {
    S.stars.push({
      x: Math.random() * VW,
      y: Math.random() * 90,
      p: Math.random() < 0.3 ? 0.1 : 0.25,
      c: Math.random() < 0.15 ? C.moon : C.star,
    });
  }
  for (let i = 0; i < 10; i++) {
    S.buildings.push({
      x: i * 40 + Math.random() * 20,
      w: 16 + ((Math.random() * 3) | 0) * 6,
      h: 20 + ((Math.random() * 5) | 0) * 6,
    });
  }
}

function updateParallax(scrollSpeed) {
  for (const s of S.stars) {
    s.x -= scrollSpeed * s.p;
    if (s.x < 0) s.x += VW;
  }
  for (const b of S.buildings) {
    b.x -= scrollSpeed * 0.5;
    if (b.x + b.w < 0) {
      b.x += 10 * 40 + 40;
      b.w = 16 + ((Math.random() * 3) | 0) * 6;
      b.h = 20 + ((Math.random() * 5) | 0) * 6;
    }
  }
}

function drawParallax() {
  // Sky bands
  px(0, 0,   VW, 60, C.skyTop);
  px(0, 60,  VW, 50, C.skyMid);
  px(0, 110, VW, 38, C.skyBot);

  // Moon
  px(VW - 46, 18, 14, 14, C.moon);
  px(VW - 50, 22, 4, 6,  C.moon);
  px(VW - 42, 16, 6, 2,  C.moon);
  px(VW - 42, 24, 2, 2,  C.moonDark);
  px(VW - 38, 20, 3, 2,  C.moonDark);

  // Stars
  for (const s of S.stars) px(s.x, s.y, 1, 1, s.c);

  // Buildings
  for (const b of S.buildings) {
    px(b.x | 0, GROUND - b.h, b.w, b.h, C.bldg);
    for (let yy = GROUND - b.h + 4; yy < GROUND - 4; yy += 5) {
      for (let xx = (b.x | 0) + 2; xx < (b.x | 0) + b.w - 2; xx += 4) {
        if (((xx * 7 + yy * 3) % 11) < 4) px(xx, yy, 2, 2, C.bldgLit);
      }
    }
  }

  // Road
  px(0, GROUND, VW, VH - GROUND, C.road);
  px(0, GROUND, VW, 1, C.rim);
  const dashW = 10, gap = 10;
  const offset = (S.scroll % (dashW + gap)) | 0;
  for (let x = -offset; x < VW; x += dashW + gap) {
    px(x, GROUND + 14, dashW, 2, C.roadLine);
  }
}

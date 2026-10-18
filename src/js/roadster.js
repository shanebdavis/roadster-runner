// Tesla Roadster (second generation) side-profile sprite, 32x14.
// Long low pointed nose on the right, swept cabin, short rear deck,
// two wheels tucked up under smoothly-flared arches.
function drawRoadster(x, y, boosting, flipAngle) {
  ctx.save();
  ctx.translate(x + 16, y + 8);
  if (flipAngle) ctx.rotate(flipAngle);
  ctx.translate(-16, -8);

  // Soft shadow underneath
  px(2, 13, 28, 1, C.carLo);

  // Cabin peak + windshield slope
  px(10, 3, 12, 1, C.carHi);
  px(8,  4, 16, 1, C.carBody);
  px(5,  5, 22, 1, C.carBody);
  px(13, 5, 7,  1, C.carWind);
  px(13, 4, 3,  1, C.carWindHi);

  // Upper body sweep (long nose, short tail)
  px(3,  6, 27, 1, C.carBody);
  px(2,  7, 29, 1, C.carHi);
  px(1,  8, 30, 1, C.carLo);
  px(2,  8, 28, 1, C.carBody);
  px(2,  9, 28, 1, C.carLo);

  // Wheels tucked up
  px(21, 10, 7, 3, C.tire);
  px(22, 11, 5, 1, C.rim);
  px(4,  10, 7, 3, C.tire);
  px(5,  11, 5, 1, C.rim);

  // Lights
  px(29, 7, 1, 1, C.headlight);
  px(2,  7, 1, 1, C.carHi);

  // Rear thrust flame (X-accelerate only; cold-gas jumps are drawn via steamPuff)
  if (boosting) {
    const f = (S.frame & 1) ? 0 : 1;
    px(-4 - f, 7, 4 + f, 2, C.flame1);
    px(-7 - f, 8, 3 + f, 1, C.flame2);
  }

  ctx.restore();
}

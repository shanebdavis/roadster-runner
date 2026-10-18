// HUD and overlay screens

function drawGauge() {
  const w = 60, h = 5;
  const x = VW - w - 6, y = 6;
  px(x - 1, y - 1, w + 2, h + 2, C.gaugeBg);
  const fillW = Math.max(0, (S.fuel / 100) * w) | 0;
  const col = S.fuel < 25 ? C.gaugeLow : C.gaugeFill;
  px(x, y, fillW, h, col);
  drawText(x - 20, y, 'FUEL', C.textDim);
}

function drawHud() {
  const sc = String(S.score).padStart(5, '0');
  drawText(6, 6, 'SCORE', C.textDim);
  drawText(6, 14, sc, C.text, 2);
  const bs = String(S.best).padStart(5, '0');
  drawText(6 + textWidth(sc, 2) + 10, 14, 'HI ' + bs, C.textDim);
  drawGauge();
}

function drawTitle() {
  const t = 'ROADSTER RUNNER';
  const scale = 2;
  const w = textWidth(t, scale);
  drawText((VW - w) / 2 | 0, 50, t, C.carBody, scale);
  const sub = 'JUMP THE TESLA LINEUP';
  drawText((VW - textWidth(sub)) / 2 | 0, 74, sub, C.textDim);
  const sub2 = 'LOOP THE LOOPS NEED THRUST';
  drawText((VW - textWidth(sub2)) / 2 | 0, 86, sub2, C.textDim);
  const sub3 = 'HOLD X OR SHIFT GOING UP';
  drawText((VW - textWidth(sub3)) / 2 | 0, 98, sub3, C.textDim);
  drawText((VW - textWidth('PRESS SPACE TO LAUNCH')) / 2 | 0, 120,
    'PRESS SPACE TO LAUNCH', (S.frame >> 4) & 1 ? C.text : C.textDim);
}

function drawDead() {
  const t = 'KA BOOM';
  const scale = 2;
  const w = textWidth(t, scale);
  drawText((VW - w) / 2 | 0, 56, t, C.flame3, scale);
  const line = 'SCORE ' + S.score + '   HI ' + S.best;
  drawText((VW - textWidth(line)) / 2 | 0, 84, line, C.text);
  drawText((VW - textWidth('PRESS SPACE TO RETRY')) / 2 | 0, 100,
    'PRESS SPACE TO RETRY', (S.frame >> 4) & 1 ? C.text : C.textDim);
}

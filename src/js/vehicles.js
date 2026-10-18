// Front-profile sprites for the Tesla lineup you jump over.
// Dimensions chosen so single jump clears cybercab/model3/modely but NOT the semi.
const VEHICLES = {
  cybercab: { w: 26, h: 16 },
  model3:   { w: 28, h: 20 },
  modely:   { w: 30, h: 24 },
  semi:     { w: 48, h: 36 },
};

function drawCybercab(o) {
  const x = o.x, y = o.y, w = o.w, h = o.h;
  // Low rounded gold body
  px(x + 4, y + 0, w - 8, 2, C.cabGold);
  px(x + 2, y + 2, w - 4, 3, C.cabGold);
  px(x + 4, y + 0, w - 8, 1, C.cabGoldHi);
  // Deep windshield
  px(x + 4, y + 4, w - 8, 4, C.teslaBlack);
  // Light bar
  px(x + 2, y + 8, w - 4, 1, C.cabGoldHi);
  // Lower body
  px(x + 1, y + 9, w - 2, h - 11, C.cabGold);
  // Shadow + wheels
  px(x,     y + h - 2, w, 1, C.cabGoldDk);
  px(x + 2, y + h - 2, 4, 2, C.tire);
  px(x + w - 6, y + h - 2, 4, 2, C.tire);
}

function drawModel3(o) {
  const x = o.x, y = o.y, w = o.w, h = o.h;
  px(x + 5, y + 0, w - 10, 3, C.teslaWhite);     // roof
  px(x + 4, y + 3, w - 8, 4, C.teslaBlack);      // windshield
  px(x + 1, y + 7, w - 2, 6, C.teslaWhite);      // hood
  px(x + 2, y + 9, 5, 2, C.headlight);           // left headlight
  px(x + w - 7, y + 9, 5, 2, C.headlight);       // right headlight
  px(x + (w/2 - 1)|0, y + 11, 2, 2, C.teslaSilver); // badge
  px(x, y + h - 3, w, 2, C.teslaSilver);          // bumper
  px(x, y + h - 1, w, 1, C.teslaDark);
  px(x + 1,     y + h - 3, 4, 3, C.tire);
  px(x + w - 5, y + h - 3, 4, 3, C.tire);
}

function drawModelY(o) {
  const x = o.x, y = o.y, w = o.w, h = o.h;
  px(x + 5, y + 0, w - 10, 4, C.teslaWhite);     // taller roof
  px(x + 4, y + 4, w - 8, 5, C.teslaBlack);      // windshield
  px(x + 1, y + 9, w - 2, h - 12, C.teslaWhite); // body
  px(x + 2, y + 12, 5, 2, C.headlight);
  px(x + w - 7, y + 12, 5, 2, C.headlight);
  px(x + (w/2 - 1)|0, y + 14, 2, 2, C.teslaSilver);
  px(x, y + h - 3, w, 2, C.teslaSilver);
  px(x, y + h - 1, w, 1, C.teslaDark);
  px(x + 1,     y + h - 3, 4, 3, C.tire);
  px(x + w - 5, y + h - 3, 4, 3, C.tire);
}

function drawSemi(o) {
  const x = o.x, y = o.y, w = o.w, h = o.h;
  px(x + 2, y + 0, w - 4, 4, C.semi);               // roof slab
  px(x + 6, y + 4, w - 12, 10, C.teslaBlack);       // wrap windshield
  px(x + 8, y + 4, w - 16, 1, C.carWindHi);         // reflection
  px(x + 1, y + 14, w - 2, h - 18, C.semi);         // body
  px(x + 5, y + 14, 1, h - 18, C.semiDark);         // seam
  px(x + w - 6, y + 14, 1, h - 18, C.semiDark);
  px(x + 4, y + h - 10, w - 8, 1, C.headlight);     // light strip
  px(x,     y + h - 4, w, 3, C.semiDark);           // bumper
  px(x,     y + h - 1, w, 1, C.teslaDark);
  px(x + 1,     y + h - 4, 6, 4, C.tire);
  px(x + w - 7, y + h - 4, 6, 4, C.tire);
  px(x + 2,     y + h - 3, 4, 1, C.rim);
  px(x + w - 6, y + h - 3, 4, 1, C.rim);
  // Fake TESLA badge stripe
  px(x + (w/2 - 6)|0, y + 7, 12, 1, C.teslaWhite);
}

function drawVehicle(o) {
  if (o.kind === 'cybercab') drawCybercab(o);
  else if (o.kind === 'model3') drawModel3(o);
  else if (o.kind === 'modely') drawModelY(o);
  else if (o.kind === 'semi')   drawSemi(o);
}

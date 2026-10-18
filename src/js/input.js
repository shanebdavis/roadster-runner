// Keyboard + pointer handling

window.addEventListener('keydown', e => {
  if (e.repeat) { e.preventDefault(); return; }
  if (e.code === 'Space' || e.code === 'ArrowUp') { tryJump(); e.preventDefault(); }
  if (e.code === 'KeyX') { keys.accel = true; e.preventDefault(); }
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') { keys.suck = true; e.preventDefault(); }
});
window.addEventListener('keyup', e => {
  if (e.code === 'KeyX') keys.accel = false;
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.suck = false;
});
cvs.addEventListener('pointerdown', e => { tryJump(); e.preventDefault(); });

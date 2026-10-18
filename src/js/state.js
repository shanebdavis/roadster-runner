// Global mutable game state
const S = {
  phase: 'title', // 'title' | 'playing' | 'dead'
  t: 0,
  frame: 0,
  score: 0,
  best: +(localStorage.getItem('rr_best8') || 0),
  speed: 2.0,
  baseSpeed: 2.0,
  fuel: 100,

  car: {
    x: 44,
    y: GROUND - 14,
    vy: 0,
    w: 32,
    h: 14,
    onGround: true,
    jumps: 0,
    flipAngle: 0,
    flipSpin: 0,

    // Loop traversal
    loopActive: false,
    loopAngle: 0,
    loopOmega: 0,
    // Falling state (after loop stall)
    falling: false,
  },

  activeLoop: null,

  obstacles: [],
  particles: [],
  stars: [],
  buildings: [],
  popups: [],

  nextObstacle: 60,
  scroll: 0,
};

const keys = {};
let lastJumpTap = -999;

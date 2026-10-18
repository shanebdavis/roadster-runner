// Virtual pixel resolution + physics constants
const VW = 320;
const VH = 180;
const GROUND = 148;
const DT = 1000 / 60;

// Tuned physics so a single jump clears cybercab/model3/modely but NOT the semi,
// and a double jump clears the semi + wider 3-car rows.
const GRAVITY = 0.32;
const JUMP_VY = -3.6;
const DOUBLE_JUMP_IMPULSE = 2.9; // added to current vy (made more negative)
const DOUBLE_JUMP_WINDOW = 24;   // frames after first jump to count as kickflip

// Loop traversal
const LOOP_THRUST_GAIN = 0.004;
const LOOP_OMEGA_MAX = 0.14;
const LOOP_INITIAL_OMEGA = (speed) => speed * 0.08;


/* ============================================================================
   tuning.js — HOW THE GAME FEELS
   ============================================================================ */

const TUNING = {

  /* HOLE 1 — The feel you can see */

  // How fast you fall
  GRAVITY: 2000,

  // The fastest you can fall
  MAX_FALL_SPEED: 900,

  // Top running speed
  MOVE_SPEED: 220,

  // How quickly you reach top speed
  GROUND_ACCEL: 2400,

  // How quickly you stop
  GROUND_FRICTION: 2600,

  // How much you can steer in the air
  AIR_ACCEL: 1500,

  // How quickly you slow down in the air
  AIR_FRICTION: 500,

  // Jump strength
  JUMP_VELOCITY: 620,


  /* HOLE 2 — The feel you can't see */

  // Coyote time
  COYOTE_TIME: 0.10,

  // Jump buffer
  JUMP_BUFFER: 0.12,

  // Let go of jump early
  JUMP_RELEASE_CUT: 0.45,

  // Gravity near the top of a jump
  APEX_GRAVITY_MULT: 0.6,

  // Near the top of a jump
  APEX_THRESHOLD: 90,


  /* HOLE 3 — Extra jumps */

  MAX_AIR_JUMPS: 0,


  /* Other settings */

  // Bounce after landing on an enemy
  STOMP_BOUNCE: 480,

  // Starting lives
  LIVES: 3,
};

/* DEFAULTS — Original values:

GRAVITY: 1800
MAX_FALL_SPEED: 900
MOVE_SPEED: 220
GROUND_ACCEL: 2400
GROUND_FRICTION: 2600
AIR_ACCEL: 1500
AIR_FRICTION: 500
JUMP_VELOCITY: 620
COYOTE_TIME: 0.10
JUMP_BUFFER: 0.12
JUMP_RELEASE_CUT: 0.45
APEX_GRAVITY_MULT: 0.6
APEX_THRESHOLD: 90
MAX_AIR_JUMPS: 0
STOMP_BOUNCE: 480
LIVES: 3
*/

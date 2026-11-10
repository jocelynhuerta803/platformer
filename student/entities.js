
/* ============================================================================
   entities.js — ENEMIES, PICKUPS, AND WHAT EACH MAP LETTER MEANS
   ============================================================================ */

const ENEMY_TYPES = {
  walker: {
    movement: "patrol",
    speed: 60,
    width: 20,
    height: 20,
    color: "#e0605a",
    stompable: true,
    points: 100,
    turnsAtLedges: true,
  },

  flyer: {
    movement: "hover",
    speed: 70,
    width: 22,
    height: 16,
    color: "#b07cff",
    stompable: true,
    points: 150,
    loopWidth: 60,
    loopHeight: 18,
  },

  hopper: {
    movement: "hop",
    speed: 40,
    width: 18,
    height: 18,
    color: "#ff9f43",
    stompable: true,
    points: 200,
    turnsAtLedges: true,
    hopPower: 460,
    hopEvery: 1.4,
  },

  sentry: {
    movement: "chase",
    speed: 50,
    width: 22,
    height: 26,
    color: "#ff4444",
    stompable: false,
    points: 0,
    sightRange: 160,
    turnsAtLedges: true,
  },
};

const PICKUP_TYPES = {
  coin: {
    color: "#ffd34d",
    size: 10,
    shape: "circle",
    points: 10,
    treasure: true,
  },

  gem: {
    color: "#6fe3ff",
    size: 13,
    shape: "diamond",
    points: 50,
    treasure: true,
  },

  boots: {
    color: "#9cff6b",
    size: 14,
    shape: "square",
    points: 0,
    treasure: false,
    power: { speed: 1.6, seconds: 6 },
  },

  feather: {
    color: "#f4f4f4",
    size: 12,
    shape: "diamond",
    points: 0,
    treasure: false,
    power: { jump: 1.35, seconds: 8 },
  },

  heart: {
    color: "#ff4d6d",
    size: 14,
    shape: "circle",
    points: 0,
    treasure: false,
    power: { life: 1 },
  },
};

const LEGEND = {
  ".": { kind: "tile", name: "air" },
  "#": { kind: "tile", name: "solid" },
  "=": { kind: "tile", name: "ledge" },
  "^": { kind: "tile", name: "spikes" },
  "P": { kind: "player" },
  "G": { kind: "goal" },
  "o": { kind: "pickup", name: "coin" },
  "*": { kind: "pickup", name: "gem" },
  "b": { kind: "pickup", name: "boots" },
  "f": { kind: "pickup", name: "feather" },
  "h": { kind: "pickup", name: "heart" },
  "E": { kind: "enemy", name: "walker" },
  "F": { kind: "enemy", name: "flyer" },
  "H": { kind: "enemy", name: "hopper" },
  "S": { kind: "enemy", name: "sentry" },
};

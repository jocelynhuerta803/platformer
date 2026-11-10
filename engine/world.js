
/* Engine: turns a level's text map into a world of tiles and things,
   and moves boxes through that world without letting them pass through walls. */

const World = (() => {

  function mapRows(map) {
    return String(map).replace(/\r/g, "").replace(/^\n+/, "").replace(/\n\s*$/, "").split("\n");
  }

  function build(level) {
    const rows = mapRows(level.map);
    const h = rows.length;
    const w = Math.max(...rows.map((r) => r.length));
    const tiles = [];
    const things = { player: null, goals: [], enemies: [], pickups: [], platforms: [] };

    for (let r = 0; r < h; r++) {
      const line = [];
      for (let c = 0; c < w; c++) {
        const ch = rows[r][c] === undefined || rows[r][c] === " " ? "." : rows[r][c];
        const entry = LEGEND[ch];
        let kind = "air";

        if (entry.kind === "tile") kind = entry.name;
        else if (entry.kind === "player") things.player = { c, r };
        else if (entry.kind === "goal") things.goals.push({ c, r });
        else if (entry.kind === "enemy") things.enemies.push({ c, r, name: entry.name });
        else if (entry.kind === "pickup") things.pickups.push({ c, r, name: entry.name });
        else if (entry.kind === "platform") things.platforms.push({ c, r });

        line.push(kind);
      }
      tiles.push(line);
    }

    const platforms = things.platforms.map(({ c, r }) => ({
      x: c * TILE,
      y: r * TILE,
      w: TILE,
      h: 8,
      startX: c * TILE,
      minX: c * TILE - TILE * 2,
      maxX: c * TILE + TILE * 2,
      speed: 45,
      dir: 1,
      dx: 0,
    }));

    const world = {
      name: level.name, w, h, tiles, things, platforms,
      pxW: w * TILE, pxH: h * TILE,
      kind(c, r) {
        if (c < 0 || c >= w) return "solid";
        if (r < 0 || r >= h) return "air";
        return tiles[r][c];
      },
    };

    return world;
  }

  function updatePlatforms(world, dt) {
    for (const p of world.platforms) {
      const oldX = p.x;
      p.x += p.speed * p.dir * dt;

      if (p.x >= p.maxX) {
        p.x = p.maxX;
        p.dir = -1;
      } else if (p.x <= p.minX) {
        p.x = p.minX;
        p.dir = 1;
      }

      p.dx = p.x - oldX;
    }
  }

  function cells(a) {
    return {
      c0: Math.floor(a.x / TILE),
      c1: Math.floor((a.x + a.w - 0.001) / TILE),
      r0: Math.floor(a.y / TILE),
      r1: Math.floor((a.y + a.h - 0.001) / TILE),
    };
  }

  function moveX(a, world, dx) {
    a.x += dx;
    if (dx === 0) return;

    const { c0, c1, r0, r1 } = cells(a);
    const c = dx > 0 ? c1 : c0;

    for (let r = r0; r <= r1; r++) {
      if (world.kind(c, r) === "solid") {
        a.x = dx > 0 ? c * TILE - a.w : (c + 1) * TILE;
        a.vx = 0;
        a.hitWall = dx > 0 ? 1 : -1;
        return;
      }
    }
  }

  function moveY(a, world, dy) {
    const prevBottom = a.y + a.h;
    a.y += dy;

    if (dy === 0) return;

    const { c0, c1, r0, r1 } = cells(a);

    if (dy > 0) {
      const r = r1;

      for (let c = c0; c <= c1; c++) {
        const k = world.kind(c, r);
        const landsOnLedge = k === "ledge" && prevBottom <= r * TILE + 0.01;

        if (k === "solid" || landsOnLedge) {
          a.y = r * TILE - a.h;
          a.vy = 0;
          a.onGround = true;
          return;
        }
      }

      for (const p of world.platforms) {
        const crossedPlatform = prevBottom <= p.y && a.y + a.h >= p.y;
        const overlapsPlatform = a.x < p.x + p.w && a.x + a.w > p.x;

        if (crossedPlatform && overlapsPlatform) {
          a.y = p.y - a.h;
          a.vy = 0;
          a.onGround = true;
          a.ridingPlatform = p;
          return;
        }
      }

    } else {
      const r = r0;

      for (let c = c0; c <= c1; c++) {
        if (world.kind(c, r) === "solid") {
          a.y = (r + 1) * TILE;
          a.vy = 0;
          a.hitCeiling = true;
          return;
        }
      }
    }
  }

  // Moves in small slices so that even very fast movement can't skip a wall.
  function move(a, world, dt) {
    if (a.ridingPlatform) {
      moveX(a, world, a.ridingPlatform.dx);
    }

    a.ridingPlatform = null;
    a.onGround = false;
    a.hitWall = 0;
    a.hitCeiling = false;

    const dx = a.vx * dt;
    const dy = a.vy * dt;
    const slices = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / (TILE / 2)));

    for (let i = 0; i < slices; i++) {
      moveX(a, world, a.vx * dt / slices);
      moveY(a, world, a.vy * dt / slices);
    }
  }

  // Rectangles of the dangerous part of each spike tile the box touches.
  function spikeRect(c, r) {
    return { x: c * TILE + 3, y: r * TILE + 10, w: TILE - 6, h: TILE - 10 };
  }

  function touching(a, world, kind, rectFor) {
    const { c0, c1, r0, r1 } = cells(a);

    for (let r = r0; r <= r1; r++)
      for (let c = c0; c <= c1; c++)
        if (world.kind(c, r) === kind && overlaps(a, rectFor ? rectFor(c, r) : { x: c * TILE, y: r * TILE, w: TILE, h: TILE }))
          return true;

    return false;
  }

  function overlaps(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  return { build, mapRows, move, updatePlatforms, touching, overlaps, spikeRect };
})();

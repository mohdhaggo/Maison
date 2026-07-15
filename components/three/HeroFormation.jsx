"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";

const COUNT = 2600;
const DUST = 480;
const GATHER = 4.2;
const HOLD = 4.6;
const DISPERSE = 2.0;
export const CYCLE = GATHER + HOLD + DISPERSE; // ~10.8s

// per-concept particle colours (r,g,b 0..1)
const PALETTES = {
  0: [[0.79, 0.66, 0.43], [0.91, 0.63, 0.75], [0.83, 0.53, 0.11]], // Alchemy: gold / rose / amber
  1: [[0.79, 0.66, 0.43], [0.91, 0.84, 0.64], [1.0, 0.84, 0.4]],    // Liquid Gold
  2: [[0.91, 0.84, 0.64], [1.0, 0.98, 0.92], [0.79, 0.66, 0.43]],   // Fragrance Trail (champagne/white)
  3: [[0.79, 0.66, 0.43], [1.0, 0.84, 0.25], [0.62, 0.47, 0.22]],   // Crystal Shatter
};

// luxury flacon silhouette (radius, height) bottom -> top, incl. cap
const PROFILE = [
  [0.0, 0.0], [0.62, 0.0], [0.97, 0.06], [1.0, 0.35], [1.0, 1.35],
  [0.94, 1.55], [0.62, 1.72], [0.34, 1.82], [0.3, 1.98], [0.3, 2.18],
  [0.34, 2.2], [0.34, 2.72], [0.0, 2.72],
];
const CENTER_Y = 1.2;
const SCALE = 1.55;

const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const rnd = (a) => (Math.random() * 2 - 1) * a;

function makeSprite() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,238,196,0.9)");
  g.addColorStop(0.55, "rgba(255,214,140,0.32)");
  g.addColorStop(1, "rgba(255,214,140,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.needsUpdate = true;
  return t;
}

function sampleBottle() {
  // cumulative arc-length weighting for even coverage
  const segLen = [];
  let total = 0;
  for (let i = 1; i < PROFILE.length; i++) {
    const dr = PROFILE[i][0] - PROFILE[i - 1][0];
    const dy = PROFILE[i][1] - PROFILE[i - 1][1];
    const l = Math.hypot(dr, dy) * (0.4 + (PROFILE[i][0] + PROFILE[i - 1][0]) / 2);
    segLen.push(l);
    total += l;
  }
  const r = Math.random() * total;
  let acc = 0, seg = 0;
  for (; seg < segLen.length; seg++) {
    if (acc + segLen[seg] >= r) break;
    acc += segLen[seg];
  }
  const f = segLen[seg] ? (r - acc) / segLen[seg] : 0;
  let rad = THREE.MathUtils.lerp(PROFILE[seg][0], PROFILE[seg + 1][0], f);
  const y = THREE.MathUtils.lerp(PROFILE[seg][1], PROFILE[seg + 1][1], f);
  const theta = Math.random() * Math.PI * 2;
  // ~30% fill the interior a little for a glowing "liquid" core
  if (Math.random() < 0.3 && y < 1.5) rad *= Math.sqrt(Math.random());
  return [
    rad * Math.cos(theta) * SCALE,
    (y - CENTER_Y) * SCALE,
    rad * Math.sin(theta) * SCALE,
  ];
}

function sourceFor(concept, tx, ty, tz) {
  switch (concept) {
    case 1: { // Liquid Gold — rise from a disc below
      const a = Math.random() * Math.PI * 2, rad = Math.random() * 2.6;
      return [Math.cos(a) * rad, -5 - Math.random() * 2.5, Math.sin(a) * rad];
    }
    case 2: // Fragrance Trail — sweep in from the left
      return [-9 - Math.random() * 3, ty + rnd(1.6), tz + rnd(1.6)];
    case 3: { // Crystal Shatter — explode outward on a shell
      const len = Math.hypot(tx, ty, tz) || 1;
      const k = (2.6 + Math.random() * 3) / len;
      return [tx + tx * k + rnd(0.5), ty + ty * k + rnd(0.5), tz + tz * k + rnd(0.5)];
    }
    default: // Alchemy — fall from above with spread
      return [tx * 0.5 + rnd(2.2), 5 + Math.random() * 4, tz * 0.5 + rnd(2.2)];
  }
}

function Formation({ concept }) {
  const points = useRef();
  const core = useRef();
  const dustRef = useRef();
  const group = useRef();
  const cycleStart = useRef(0);
  const resetPending = useRef(true);
  const conceptRef = useRef(concept);

  const sprite = useMemo(makeSprite, []);

  // static per-particle data (targets never change — only the source pattern does)
  const stat = useMemo(() => {
    const targets = new Float32Array(COUNT * 3);
    const swirl = new Float32Array(COUNT);
    const disp = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const [x, y, z] = sampleBottle();
      targets[i * 3] = x; targets[i * 3 + 1] = y; targets[i * 3 + 2] = z;
      swirl[i] = rnd(Math.PI * 2.2);
      disp[i * 3] = rnd(2.2);
      disp[i * 3 + 1] = 4 + Math.random() * 5;
      disp[i * 3 + 2] = rnd(2.2);
    }
    return { targets, swirl, disp };
  }, []);

  const dyn = useMemo(
    () => ({
      positions: new Float32Array(COUNT * 3),
      colors: new Float32Array(COUNT * 3),
      sources: new Float32Array(COUNT * 3),
    }),
    []
  );

  // ambient gold dust
  const dust = useMemo(() => {
    const pos = new Float32Array(DUST * 3);
    const spd = new Float32Array(DUST);
    for (let i = 0; i < DUST; i++) {
      pos[i * 3] = rnd(7);
      pos[i * 3 + 1] = rnd(5);
      pos[i * 3 + 2] = rnd(4) - 1;
      spd[i] = 0.15 + Math.random() * 0.4;
    }
    return { pos, spd };
  }, []);

  // (re)generate the source pattern + colours for the current concept
  function seed() {
    const c0 = conceptRef.current;
    const pal = PALETTES[c0] || PALETTES[0];
    for (let i = 0; i < COUNT; i++) {
      const tx = stat.targets[i * 3], ty = stat.targets[i * 3 + 1], tz = stat.targets[i * 3 + 2];
      const [sx, sy, sz] = sourceFor(c0, tx, ty, tz);
      dyn.sources[i * 3] = sx; dyn.sources[i * 3 + 1] = sy; dyn.sources[i * 3 + 2] = sz;
      dyn.positions[i * 3] = sx; dyn.positions[i * 3 + 1] = sy; dyn.positions[i * 3 + 2] = sz;
      const c = pal[(Math.random() * pal.length) | 0];
      dyn.colors[i * 3] = c[0]; dyn.colors[i * 3 + 1] = c[1]; dyn.colors[i * 3 + 2] = c[2];
    }
    if (points.current) {
      points.current.geometry.attributes.position.needsUpdate = true;
      points.current.geometry.attributes.color.needsUpdate = true;
    }
  }

  // reseed whenever the selected concept changes
  useEffect(() => {
    conceptRef.current = concept;
    seed();
    resetPending.current = true;
  }, [concept, stat, dyn]);

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    if (resetPending.current) {
      cycleStart.current = state.clock.elapsedTime;
      resetPending.current = false;
    }
    let t = state.clock.elapsedTime - cycleStart.current;
    // auto-loop the same concept so the flacon keeps reforming
    if (t >= CYCLE) {
      seed();
      cycleStart.current = state.clock.elapsedTime;
      t = 0;
    }

    let e, dp = 0, opacity;
    if (t < GATHER) {
      e = easeInOut(THREE.MathUtils.clamp(t / GATHER, 0, 1));
      opacity = THREE.MathUtils.clamp(t / 0.6, 0, 1);
    } else if (t < GATHER + HOLD) {
      e = 1; opacity = 1;
    } else {
      e = 1;
      dp = THREE.MathUtils.clamp((t - GATHER - HOLD) / DISPERSE, 0, 1);
      opacity = 1 - dp;
    }

    const arr = points.current.geometry.attributes.position.array;
    const breath = t > GATHER && t < GATHER + HOLD ? Math.sin(t * 1.4) * 0.02 : 0;
    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      const sx = dyn.sources[ix], sy = dyn.sources[ix + 1], sz = dyn.sources[ix + 2];
      const tx = stat.targets[ix], ty = stat.targets[ix + 1], tz = stat.targets[ix + 2];
      let px = sx + (tx - sx) * e;
      let py = sy + (ty - sy) * e;
      let pz = sz + (tz - sz) * e;
      // swirl that unwinds as particles arrive
      const ang = (1 - e) * stat.swirl[i];
      if (ang) {
        const ca = Math.cos(ang), sa = Math.sin(ang);
        const rx = px * ca - pz * sa;
        pz = px * sa + pz * ca;
        px = rx;
      }
      if (dp) {
        px += stat.disp[ix] * dp;
        py += stat.disp[ix + 1] * dp;
        pz += stat.disp[ix + 2] * dp;
      }
      arr[ix] = px;
      arr[ix + 1] = py + breath;
      arr[ix + 2] = pz;
    }
    points.current.geometry.attributes.position.needsUpdate = true;
    points.current.material.opacity = opacity;

    // inner amber glow rises during hold
    const holdF =
      t < GATHER ? 0 : t < GATHER + HOLD ? THREE.MathUtils.clamp((t - GATHER) / 0.9, 0, 1) : 1 - dp;
    core.current.material.opacity = holdF * 0.8;

    // ambient dust drifts upward forever
    const dpos = dustRef.current.geometry.attributes.position.array;
    for (let i = 0; i < DUST; i++) {
      dpos[i * 3 + 1] += dust.spd[i] * d;
      if (dpos[i * 3 + 1] > 5.5) dpos[i * 3 + 1] = -5.5;
    }
    dustRef.current.geometry.attributes.position.needsUpdate = true;

    // turntable + cursor parallax
    const g = group.current;
    g.rotation.y += d * 0.12;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -state.pointer.y * 0.15, 0.05);
    g.position.x = THREE.MathUtils.lerp(g.position.x, state.pointer.x * 0.5, 0.05);
  });

  return (
    <group ref={group}>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dyn.positions, 3]} usage={THREE.DynamicDrawUsage} />
          <bufferAttribute attach="attributes-color" args={[dyn.colors, 3]} usage={THREE.DynamicDrawUsage} />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={0.1}
          map={sprite}
          transparent
          opacity={1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      {/* glowing liquid core */}
      <sprite ref={core} scale={[3, 4.6, 1]}>
        <spriteMaterial
          map={sprite}
          color="#D4881C"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      {/* ambient gold dust */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dust.pos, 3]} usage={THREE.DynamicDrawUsage} />
        </bufferGeometry>
        <pointsMaterial
          size={0.07}
          map={sprite}
          color="#C9A96E"
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

export default function HeroFormation({ concept = 0, active = true }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 9], fov: 35 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <PerformanceMonitor />
      <Formation concept={concept} />
    </Canvas>
  );
}

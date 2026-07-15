"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Environment,
  Lightformer,
  ContactShadows,
  OrbitControls,
  PerformanceMonitor,
} from "@react-three/drei";
import * as THREE from "three";
import Flacon from "./Flacon";

const DUST = 420;

function makeSprite() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.3, "rgba(255,230,170,0.8)");
  g.addColorStop(1, "rgba(255,214,140,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  return t;
}

function GoldDust() {
  const ref = useRef();
  const sprite = useMemo(makeSprite, []);
  const { pos, spd } = useMemo(() => {
    const pos = new Float32Array(DUST * 3);
    const spd = new Float32Array(DUST);
    for (let i = 0; i < DUST; i++) {
      pos[i * 3] = (Math.random() * 2 - 1) * 6;
      pos[i * 3 + 1] = (Math.random() * 2 - 1) * 4;
      pos[i * 3 + 2] = (Math.random() * 2 - 1) * 3 - 0.5;
      spd[i] = 0.1 + Math.random() * 0.35;
    }
    return { pos, spd };
  }, []);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    const arr = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < DUST; i++) {
      arr[i * 3 + 1] += spd[i] * d;
      if (arr[i * 3 + 1] > 4.5) arr[i * 3 + 1] = -4.5;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} usage={THREE.DynamicDrawUsage} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        map={sprite}
        color="#C9A96E"
        transparent
        opacity={0.6}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

export default function HeroBottleScene({ active = true }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0.2, 7], fov: 30 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <PerformanceMonitor />
      <Suspense fallback={null}>
        <ambientLight intensity={0.35} />
        <spotLight position={[6, 9, 5]} angle={0.3} penumbra={1} intensity={2.4} color="#fff2d2" />
        <pointLight position={[-6, 0, -4]} intensity={2.8} color="#C9A96E" />
        <pointLight position={[5, -3, 3]} intensity={1.8} color="#D4881C" />

        <group scale={1.15} position={[0, -0.1, 0]}>
          <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.7}>
            <Flacon color="#D4881C" color2="#E8D5A3" spin={0} />
          </Float>
        </group>

        <GoldDust />

        <ContactShadows position={[0, -1.9, 0]} opacity={0.5} scale={10} blur={2.8} far={5} color="#C9A96E" frames={1} />

        <Environment resolution={64} frames={1}>
          <Lightformer form="rect" intensity={2.4} position={[0, 4, -3]} scale={[8, 3, 1]} color="#fff6e0" />
          <Lightformer form="circle" intensity={2.6} position={[5, 1, 3]} scale={4} color="#C9A96E" />
          <Lightformer form="rect" intensity={1.8} position={[-5, 0, 2]} scale={[3, 6, 1]} color="#E8D5A3" />
        </Environment>

        {/* drag to rotate 360°, gentle auto-spin when idle */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.9}
          enableDamping
          dampingFactor={0.08}
          minPolarAngle={Math.PI / 2.6}
          maxPolarAngle={Math.PI / 1.7}
        />
      </Suspense>
    </Canvas>
  );
}

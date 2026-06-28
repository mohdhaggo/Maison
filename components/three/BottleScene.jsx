"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Float,
  Environment,
  Lightformer,
  ContactShadows,
  PerformanceMonitor,
} from "@react-three/drei";
import Flacon from "./Flacon";

/**
 * WebGL stage for a single flacon.
 * - `active=false` freezes the render loop (frameloop "never") so a canvas that
 *   has scrolled out of view costs zero GPU.
 * - PerformanceMonitor + AdaptiveDpr drop the pixel ratio automatically if the
 *   frame rate sags, keeping interaction smooth on weak GPUs.
 */
export default function BottleScene({
  color = "#d4af65",
  color2 = "#f2e2bd",
  spin = 0.3,
  floatIntensity = 1,
  active = true,
}) {
  const [dpr, setDpr] = useState(1.25);

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 6.2], fov: 34 }}
      dpr={dpr}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <PerformanceMonitor
        onDecline={() => setDpr(1)}
        onIncline={() => setDpr(1.25)}
        flipflops={3}
        onFallback={() => setDpr(0.75)}
      />
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <spotLight position={[6, 9, 6]} angle={0.35} penumbra={1} intensity={2.2} color="#fff4d8" />
        <pointLight position={[-6, -2, -4]} intensity={2.6} color={color} />

        <Float speed={1.6} rotationIntensity={0.3} floatIntensity={floatIntensity}>
          <Flacon color={color} color2={color2} spin={spin} />
        </Float>

        <ContactShadows
          position={[0, -1.7, 0]}
          opacity={0.4}
          scale={9}
          blur={2.6}
          far={4.5}
          color={color}
          frames={1}
        />

        <Environment resolution={64} frames={1}>
          <Lightformer form="rect" intensity={2.2} position={[0, 4, -3]} scale={[7, 3, 1]} color="#fff6e0" />
          <Lightformer form="circle" intensity={2.4} position={[5, 2, 3]} scale={3.5} color={color} />
          <Lightformer form="rect" intensity={1.6} position={[-5, 1, 2]} scale={[3, 5, 1]} color={color2} />
        </Environment>
      </Suspense>
    </Canvas>
  );
}

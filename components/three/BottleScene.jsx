"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, Environment, Lightformer, ContactShadows } from "@react-three/drei";
import Flacon from "./Flacon";

/**
 * Self-contained WebGL stage for a single flacon.
 * Lighting is built from Lightformers (no external HDR download) so it works
 * offline and tints the glass with the perfume's own colours.
 */
export default function BottleScene({
  color = "#d4af65",
  color2 = "#f2e2bd",
  spin = 0.3,
  floatIntensity = 1,
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.2], fov: 34 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.45} />
        <spotLight position={[6, 9, 6]} angle={0.35} penumbra={1} intensity={2.4} color="#fff4d8" />
        <pointLight position={[-6, -2, -4]} intensity={3.2} color={color} />
        <pointLight position={[5, -3, 3]} intensity={2.2} color={color2} />

        <Float speed={2} rotationIntensity={0.35} floatIntensity={floatIntensity}>
          <Flacon color={color} color2={color2} spin={spin} />
        </Float>

        <ContactShadows
          position={[0, -1.7, 0]}
          opacity={0.45}
          scale={9}
          blur={2.6}
          far={4.5}
          color={color}
        />

        <Environment resolution={256}>
          <Lightformer form="rect" intensity={2.2} position={[0, 4, -3]} scale={[7, 3, 1]} color="#fff6e0" />
          <Lightformer form="rect" intensity={1.6} position={[-5, 1, 2]} scale={[3, 5, 1]} color={color2} />
          <Lightformer form="circle" intensity={2.4} position={[5, 2, 3]} scale={3.5} color={color} />
          <Lightformer form="ring" intensity={1.2} position={[0, -3, 2]} scale={5} color="#ffffff" />
        </Environment>
      </Suspense>
    </Canvas>
  );
}

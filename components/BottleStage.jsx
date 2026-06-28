"use client";

import dynamic from "next/dynamic";

const BottleScene = dynamic(() => import("./three/BottleScene"), {
  ssr: false,
  loading: () => <BottleGlow />,
});

function BottleGlow({ color = "#d4af65" }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="h-48 w-24 rounded-[40%] blur-2xl animate-pulse"
        style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }}
      />
    </div>
  );
}

/**
 * Drop-in WebGL flacon. Renders only on the client (WebGL has no SSR) and
 * paints an accent-coloured halo behind the canvas so the bottle always reads
 * as a glowing object, even before three.js finishes warming up.
 */
export default function BottleStage({
  color = "#d4af65",
  color2 = "#f2e2bd",
  spin = 0.3,
  floatIntensity = 1,
  className = "",
}) {
  return (
    <div className={`relative ${className}`}>
      <div
        className="pointer-events-none absolute inset-0 rounded-full blur-3xl opacity-50"
        style={{ background: `radial-gradient(circle at 50% 45%, ${color}66, transparent 65%)` }}
      />
      <BottleScene color={color} color2={color2} spin={spin} floatIntensity={floatIntensity} />
    </div>
  );
}

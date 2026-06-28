"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const BottleScene = dynamic(() => import("./three/BottleScene"), {
  ssr: false,
  loading: () => null,
});

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(m.matches);
    on();
    m.addEventListener?.("change", on);
    return () => m.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

/**
 * Drop-in WebGL flacon. Renders only on the client, freezes its render loop
 * while scrolled out of view, and falls back to a still frame for users who
 * prefer reduced motion. An accent halo sits behind it so it always reads as a
 * glowing object even before three.js warms up.
 */
export default function BottleStage({
  color = "#d4af65",
  color2 = "#f2e2bd",
  spin = 0.3,
  floatIntensity = 1,
  className = "",
}) {
  const wrapRef = useRef(null);
  const [inView, setInView] = useState(true);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { rootMargin: "120px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // live while visible; reduced-motion users get a single static frame
  const active = inView && !reduced;

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <div
        className="pointer-events-none absolute inset-0 rounded-full blur-3xl opacity-50"
        style={{ background: `radial-gradient(circle at 50% 45%, ${color}66, transparent 65%)` }}
      />
      <BottleScene
        color={color}
        color2={color2}
        spin={reduced ? 0 : spin}
        floatIntensity={reduced ? 0 : floatIntensity}
        active={active}
      />
    </div>
  );
}

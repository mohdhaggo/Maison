"use client";

import { useEffect, useState } from "react";

const COLORS = ["#E8A0BF", "#C9A96E", "#E8D5A3", "#d98fb0", "#caa46a"];

// Rose petals drifting down through the empty centre of the tornado.
// Client-only (random values) so it never causes a hydration mismatch,
// and skipped entirely for reduced-motion users.
export default function PetalDrift({ count = 16 }) {
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    setPetals(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 11 + Math.random() * 16,
        fall: 9 + Math.random() * 11,
        delay: -Math.random() * 20,
        sway: 3 + Math.random() * 3,
        color: COLORS[i % COLORS.length],
        rot: Math.random() * 360,
        opacity: 0.3 + Math.random() * 0.45,
      }))
    );
  }, [count]);

  return (
    <div className="absolute inset-0 z-[5] overflow-hidden pointer-events-none" aria-hidden="true">
      {petals.map((p) => (
        <span
          key={p.id}
          className="petal-fall absolute -top-10"
          style={{ left: `${p.left}%`, animationDuration: `${p.fall}s`, animationDelay: `${p.delay}s` }}
        >
          <span className="petal-sway block" style={{ animationDuration: `${p.sway}s` }}>
            <svg
              width={p.size}
              height={p.size * 1.2}
              viewBox="0 0 20 24"
              style={{ opacity: p.opacity, transform: `rotate(${p.rot}deg)`, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.35))" }}
            >
              <path d="M10 0C15 6 20 11 20 16c0 5-4 8-10 8S0 21 0 16C0 11 5 6 10 0Z" fill={p.color} />
            </svg>
          </span>
        </span>
      ))}
    </div>
  );
}

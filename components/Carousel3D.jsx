"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "./CartContext";

/**
 * A 3D coverflow carousel. Cards sit on an arc in real perspective space:
 * the active card faces you, neighbours recede and rotate away. It auto-
 * advances, pauses on hover, and supports drag / arrows / clicking a side card.
 */
export default function Carousel3D({ products }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const n = products.length;

  const next = () => setActive((a) => (a + 1) % n);
  const prev = () => setActive((a) => (a - 1 + n) % n);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(m.matches);
    on();
    m.addEventListener?.("change", on);
    return () => m.removeEventListener?.("change", on);
  }, []);

  // auto-rotate (off when paused or for reduced-motion users)
  useEffect(() => {
    if (paused || reduced) return;
    const id = setInterval(next, 3800);
    return () => clearInterval(id);
  }, [paused, reduced, n]);

  // signed distance from the active card, wrapped to the shortest way round
  function rel(i) {
    let d = i - active;
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    return d;
  }

  const drag = useRef(0);

  return (
    <div
      className="relative select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* stage */}
      <motion.div
        className="relative h-[460px] sm:h-[500px]"
        style={{ perspective: 1400 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragStart={(e, info) => (drag.current = info.point.x)}
        onDragEnd={(e, info) => {
          const dx = info.point.x - drag.current;
          if (dx < -60) next();
          else if (dx > 60) prev();
        }}
      >
        {products.map((p, i) => {
          const d = rel(i);
          const abs = Math.abs(d);
          const visible = abs <= 2;
          const isActive = d === 0;
          return (
            <motion.div
              key={p.slug}
              className="absolute left-1/2 top-1/2 w-[300px] sm:w-[340px]"
              initial={false}
              animate={{
                x: `calc(-50% + ${d * 220}px)`,
                y: "-50%",
                z: -abs * 260,
                rotateY: Math.max(-45, Math.min(45, d * -32)),
                scale: isActive ? 1 : 0.82 - (abs - 1) * 0.06,
                opacity: visible ? 1 - abs * 0.32 : 0,
              }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              style={{
                transformStyle: "preserve-3d",
                zIndex: 100 - abs,
                pointerEvents: visible ? "auto" : "none",
              }}
              onClick={() => !isActive && visible && setActive(i)}
            >
              <Card product={p} isActive={isActive} />
            </motion.div>
          );
        })}
      </motion.div>

      {/* arrows */}
      <button
        onClick={prev}
        aria-label="Previous"
        className="absolute left-0 sm:left-6 top-1/2 -translate-y-1/2 z-[120] h-12 w-12 rounded-full glass-strong flex items-center justify-center text-gold hover:border-gold transition-colors"
      >
        ‹
      </button>
      <button
        onClick={next}
        aria-label="Next"
        className="absolute right-0 sm:right-6 top-1/2 -translate-y-1/2 z-[120] h-12 w-12 rounded-full glass-strong flex items-center justify-center text-gold hover:border-gold transition-colors"
      >
        ›
      </button>

      {/* dots */}
      <div className="flex justify-center gap-2 mt-8">
        {products.map((p, i) => (
          <button
            key={p.slug}
            onClick={() => setActive(i)}
            aria-label={`Go to ${p.name}`}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === active ? 28 : 8,
              background: i === active ? p.accent : "rgba(255,255,255,0.18)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Card({ product, isActive }) {
  const { addItem } = useCart();
  return (
    <div className="relative rounded-[1.8rem] overflow-hidden">
      {/* accent glow ring on the active card */}
      <div
        className="absolute -inset-[2px] rounded-[1.8rem] transition-opacity duration-500"
        style={{
          opacity: isActive ? 1 : 0,
          background: `linear-gradient(140deg, ${product.accent}, ${product.accent2})`,
        }}
      />
      <div className="relative rounded-[1.8rem] overflow-hidden border border-gold/15 bg-plum/85">
        <Link href={`/products/${product.slug}`} className={isActive ? "" : "pointer-events-none"}>
          <div className="relative h-[300px] overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
              style={{
                backgroundImage: `url(${product.image})`,
                transform: isActive ? "scale(1.04)" : "scale(1)",
              }}
            />
            <div
              className="absolute inset-0 mix-blend-multiply transition-opacity"
              style={{
                background: `linear-gradient(160deg, ${product.accent}aa, transparent 60%)`,
                opacity: isActive ? 0.5 : 0.8,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
            <div
              className="absolute top-4 left-4 text-[10px] uppercase-spaced px-3 py-1 rounded-full glass-strong"
              style={{ color: product.accent2 }}
            >
              {product.family}
            </div>
          </div>
        </Link>

        <div className="p-6">
          <h3 className="font-serif text-2xl">{product.name}</h3>
          <p className="text-cream/55 text-sm italic mt-1">{product.tagline}</p>

          <motion.div
            initial={false}
            animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <div className="flex items-center justify-between mt-5">
              <span className="font-serif text-2xl text-gold">${product.price}</span>
              <button
                onClick={() => addItem(product)}
                className="btn-gold rounded-full px-5 py-2 text-sm"
              >
                Add to Cart
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

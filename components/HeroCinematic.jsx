"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HeroFormation = dynamic(() => import("./three/HeroFormation"), {
  ssr: false,
  loading: () => null,
});

const CYCLE_MS = 10800;

const CONCEPTS = [
  { key: "L'Alchimie", tag: "The Invisible Art of Presence" },
  { key: "Or Liquide", tag: "Born of Liquid Gold" },
  { key: "Le Sillage", tag: "Follow the Trail of Scent" },
  { key: "Éclat", tag: "Brilliance, Unbroken" },
];

export default function HeroCinematic() {
  const [concept, setConcept] = useState(0);
  const [inView, setInView] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [paused, setPaused] = useState(false);
  const wrap = useRef(null);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(m.matches);
    on();
    m.addEventListener?.("change", on);
    return () => m.removeEventListener?.("change", on);
  }, []);

  useEffect(() => {
    const el = wrap.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      rootMargin: "80px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || paused) return;
    const id = setInterval(() => setConcept((c) => (c + 1) % CONCEPTS.length), CYCLE_MS);
    return () => clearInterval(id);
  }, [reduced, paused]);

  const active = inView;
  const c = CONCEPTS[concept];

  return (
    <section
      ref={wrap}
      className="relative h-screen w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* cinematic smoke wash behind the particles */}
      <div className="absolute inset-0 -z-0">
        <div className="absolute inset-0 bg-[radial-gradient(1000px_700px_at_50%_40%,rgba(201,169,110,0.12),transparent_60%)]" />
        <motion.div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(600px 500px at 30% 60%, rgba(212,136,28,0.14), transparent 60%), radial-gradient(700px 500px at 72% 35%, rgba(201,169,110,0.12), transparent 60%)",
          }}
          animate={{ opacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* WebGL formation */}
      <div className="absolute inset-0 z-0">
        <HeroFormation concept={concept} active={active} />
      </div>

      {/* vignette for text legibility */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(10,10,10,0.7)_100%)]" />

      {/* overlay copy */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 pointer-events-none">
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.2em" }}
          animate={{ opacity: 1, letterSpacing: "0.5em" }}
          transition={{ duration: 1.4 }}
          className="uppercase text-[11px] text-gold/80 mb-6"
        >
          Maison Lumière · Paris
        </motion.p>

        <AnimatePresence mode="wait">
          <motion.h1
            key={concept}
            initial={{ opacity: 0, y: 26, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
            transition={{ duration: 1 }}
            className="font-display text-4xl sm:text-6xl md:text-7xl leading-[1.02] max-w-4xl drop-shadow-[0_6px_40px_rgba(0,0,0,0.7)]"
          >
            {c.tag.split(" ").map((w, i) =>
              i === c.tag.split(" ").length - 1 ? (
                <span key={i} className="text-shimmer italic"> {w}</span>
              ) : (
                <span key={i}> {w}</span>
              )
            )}
          </motion.h1>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.p
            key={concept + "-sub"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, delay: 0.15 }}
            className="uppercase-spaced text-[11px] text-taupe mt-6"
          >
            {c.key}
          </motion.p>
        </AnimatePresence>

        <div className="flex flex-wrap gap-4 justify-center mt-10 pointer-events-auto">
          <Link href="/products" className="btn-champagne rounded-full px-8 py-3.5 text-sm">
            Discover the Collection
          </Link>
          <Link href="/#notes" className="btn-ghost rounded-full px-8 py-3.5 text-sm">
            The Composition
          </Link>
        </div>

        {/* hero selector — pick a formation */}
        <div className="flex items-center gap-3 mt-10 pointer-events-auto">
          {CONCEPTS.map((cc, i) => (
            <button
              key={cc.key}
              onClick={() => setConcept(i)}
              aria-label={`Show ${cc.key}`}
              className="group flex flex-col items-center gap-2"
            >
              <span
                className="block h-[3px] rounded-full transition-all duration-500"
                style={{
                  width: i === concept ? 34 : 14,
                  background: i === concept ? "#C9A96E" : "rgba(245,240,232,0.25)",
                }}
              />
              <span className="text-[9px] uppercase-spaced text-taupe opacity-0 group-hover:opacity-100 transition-opacity">
                {cc.key}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* animated gold scroll indicator */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="uppercase-spaced text-[9px] text-taupe">Scroll</span>
        <span className="relative block h-9 w-[1px] bg-gold/25 overflow-hidden">
          <span className="absolute left-0 top-0 h-3 w-full bg-gold animate-scrolldot" />
        </span>
      </div>
    </section>
  );
}

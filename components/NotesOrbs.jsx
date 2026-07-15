"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NOTES = [
  {
    tier: "Top",
    title: "The First Breath",
    color: "#E8D5A3",
    glow: "rgba(232,213,163,0.6)",
    notes: ["Sicilian Bergamot", "Pink Pepper", "Blood Orange"],
    desc: "The bright opening — the note that greets the room before you do.",
  },
  {
    tier: "Heart",
    title: "The Living Centre",
    color: "#E8A0BF",
    glow: "rgba(232,160,191,0.55)",
    notes: ["Bulgarian Rose", "Jasmine Sambac", "Orris"],
    desc: "The soul of the fragrance, blooming warm against the skin.",
  },
  {
    tier: "Base",
    title: "The Lasting Trail",
    color: "#D4881C",
    glow: "rgba(212,136,28,0.5)",
    notes: ["Amber", "Agarwood (Oud)", "Sandalwood", "Vanilla"],
    desc: "The memory it leaves — deep, resinous, and impossible to forget.",
  },
];

function Orb({ data, index, active, onSelect }) {
  const positions = [
    "lg:col-start-2 lg:row-start-1", // top (apex)
    "lg:col-start-1 lg:row-start-2", // heart (bottom-left)
    "lg:col-start-3 lg:row-start-2", // base (bottom-right)
  ];
  return (
    <motion.button
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.7 }}
      onClick={() => onSelect(index)}
      onMouseEnter={() => onSelect(index)}
      className={`relative flex flex-col items-center ${positions[index]}`}
    >
      {/* outer halo */}
      <div
        className="relative h-44 w-44 sm:h-52 sm:w-52 rounded-full flex items-center justify-center transition-transform duration-500"
        style={{ transform: active ? "scale(1.06)" : "scale(1)" }}
      >
        <div
          className="absolute inset-0 rounded-full blur-2xl transition-opacity duration-500"
          style={{ background: `radial-gradient(circle, ${data.glow}, transparent 70%)`, opacity: active ? 1 : 0.6 }}
        />
        {/* glass sphere */}
        <div
          className="relative h-36 w-36 sm:h-44 sm:w-44 rounded-full animate-float"
          style={{
            background: `radial-gradient(circle at 35% 30%, #ffffff55, ${data.color}cc 40%, ${data.color}22 75%, transparent)`,
            boxShadow: `inset 0 0 40px ${data.glow}, 0 0 50px ${data.glow}`,
            border: "1px solid rgba(255,255,255,0.14)",
          }}
        >
          {/* floating particles */}
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full animate-float"
              style={{
                width: 4 + (i % 3) * 2,
                height: 4 + (i % 3) * 2,
                left: `${18 + i * 15}%`,
                top: `${25 + ((i * 37) % 50)}%`,
                background: data.color,
                boxShadow: `0 0 8px ${data.glow}`,
                animationDelay: `${i * 0.6}s`,
                animationDuration: `${5 + i}s`,
              }}
            />
          ))}
        </div>
      </div>
      <span className="uppercase-spaced text-[10px] mt-5" style={{ color: data.color }}>
        {data.tier} Note
      </span>
    </motion.button>
  );
}

export default function NotesOrbs() {
  const [active, setActive] = useState(1);
  const d = NOTES[active];

  return (
    <section id="notes" className="relative py-28 overflow-hidden">
      <div className="text-center mb-16 px-6">
        <p className="uppercase-spaced text-xs text-gold/70 mb-4">The Composition</p>
        <h2 className="font-display text-4xl md:text-6xl">
          The <span className="text-shimmer italic">Notes</span> Pyramid
        </h2>
        <p className="text-taupe max-w-xl mx-auto mt-5 text-sm">
          A fragrance is alive — it unfolds in three acts. Touch a sphere to meet each one.
        </p>
      </div>

      <div className="mx-auto max-w-4xl px-6 grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-x-8 gap-y-10 place-items-center">
        {NOTES.map((n, i) => (
          <Orb key={n.tier} data={n} index={i} active={active === i} onSelect={setActive} />
        ))}
      </div>

      {/* detail card */}
      <div className="mx-auto max-w-lg px-6 mt-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            className="glass rounded-2xl p-7 text-center"
            style={{ borderColor: `${d.color}55` }}
          >
            <h3 className="font-serif text-2xl" style={{ color: d.color }}>
              {d.title}
            </h3>
            <p className="text-cream/70 text-sm mt-2">{d.desc}</p>
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {d.notes.map((note) => (
                <span
                  key={note}
                  className="text-xs rounded-full px-3 py-1"
                  style={{ background: `${d.color}18`, color: d.color, border: `1px solid ${d.color}40` }}
                >
                  {note}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

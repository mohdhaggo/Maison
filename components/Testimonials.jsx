"use client";

import { motion } from "framer-motion";

const REVIEWS = [
  {
    quote:
      "I wore it once and three strangers stopped me to ask what it was. It has become my signature — I will never wear anything else.",
    name: "Isabelle R.",
    place: "Paris",
  },
  {
    quote:
      "It doesn't smell like a perfume. It smells like a memory I didn't know I had. Worth every franc.",
    name: "Daniel K.",
    place: "Geneva",
  },
  {
    quote:
      "The projection is unreal — soft, warm, and it lingers on my scarf for days. Pure liquid luxury.",
    name: "Amara N.",
    place: "London",
  },
];

function Stars() {
  return (
    <div className="flex gap-1 justify-center" aria-label="5 out of 5 stars">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="#C9A96E">
          <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5.9 21.4l1.4-6.8L2.2 9.9l6.9-.8z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(800px_500px_at_50%_50%,rgba(201,169,110,0.06),transparent_60%)]" />
      <div className="text-center mb-16 px-6">
        <p className="uppercase-spaced text-xs text-gold/70 mb-4">Worn & Adored</p>
        <h2 className="font-display text-4xl md:text-6xl">
          Their <span className="text-shimmer italic">Words</span>
        </h2>
      </div>

      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-3 gap-7">
        {REVIEWS.map((r, i) => (
          <motion.figure
            key={r.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.6 }}
            className="rounded-3xl p-8 border border-gold/20 bg-plum/40 flex flex-col"
          >
            <Stars />
            <blockquote className="font-serif italic text-lg text-cream/85 leading-relaxed mt-5 flex-1">
              “{r.quote}”
            </blockquote>
            <figcaption className="mt-6 text-sm">
              <span className="text-gold">{r.name}</span>
              <span className="text-taupe"> · {r.place}</span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

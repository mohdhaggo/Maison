"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useCart } from "./CartContext";
import ProductCard from "./ProductCard";
import BottleStage from "./BottleStage";

function NoteColumn({ title, notes, accent, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotateX: -8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      style={{ transformStyle: "preserve-3d" }}
      className="glass rounded-2xl p-6"
    >
      <h4 className="uppercase-spaced text-[10px] mb-4" style={{ color: accent }}>
        {title} Notes
      </h4>
      <ul className="space-y-2">
        {notes.map((n) => (
          <li key={n} className="flex items-center gap-3 text-cream/80">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
            {n}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function ProductDetail({ product, related }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const bottleY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  function handleAdd() {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="pt-24">
      {/* ambient color wash driven by the perfume's palette */}
      <div
        className="pointer-events-none fixed inset-0 -z-0 opacity-50"
        style={{
          background: `radial-gradient(1000px 600px at 20% 10%, ${product.accent}55, transparent 60%), radial-gradient(900px 600px at 90% 40%, ${product.accent2}44, transparent 60%)`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <Link href="/products" className="text-cream/60 hover:text-gold text-sm inline-flex items-center gap-2 mb-8">
          ← Back to Collection
        </Link>

        <div ref={heroRef} className="grid lg:grid-cols-2 gap-14 items-center">
          {/* 3D FLACON */}
          <motion.div style={{ y: bottleY }} className="relative h-[560px]">
            {/* slow color halo */}
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              className="absolute inset-8 rounded-full opacity-40 blur-3xl"
              style={{ background: `conic-gradient(from 0deg, ${product.accent}, ${product.accent2}, ${product.accent})` }}
            />
            <BottleStage
              color={product.accent}
              color2={product.accent2}
              spin={0.32}
              floatIntensity={1}
              className="absolute inset-0"
            />
            <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] uppercase-spaced text-cream/40">
              Drag your cursor · the flacon follows
            </p>
          </motion.div>

          {/* INFO */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span
                className="text-[10px] uppercase-spaced px-3 py-1 rounded-full glass inline-block mb-5"
                style={{ color: product.accent2 }}
              >
                {product.family}
              </span>
              <h1 className="font-serif text-5xl md:text-6xl leading-none">{product.name}</h1>
              <p className="text-cream/50 italic text-xl mt-2">{product.tagline}</p>

              <div className="flex gap-2 mt-5">
                {product.mood.map((m) => (
                  <span key={m} className="text-xs glass rounded-full px-3 py-1 text-cream/70">
                    {m}
                  </span>
                ))}
              </div>

              <motion.blockquote
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-serif text-2xl leading-relaxed mt-8 text-cream/90 border-l-2 pl-5"
                style={{ borderColor: product.accent }}
              >
                {product.story}
              </motion.blockquote>

              <p className="text-cream/65 leading-relaxed mt-6">{product.description}</p>

              <div className="flex items-center gap-5 mt-9">
                <span className="font-serif text-4xl text-gold">${product.price}</span>
                <div className="flex items-center border border-gold/40 rounded-full">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-2 text-gold text-lg">−</button>
                  <span className="w-8 text-center">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} className="px-4 py-2 text-gold text-lg">+</button>
                </div>
              </div>

              <button onClick={handleAdd} className="btn-gold rounded-full px-10 py-4 mt-7 w-full sm:w-auto relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {added ? (
                    <motion.span key="added" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="inline-block">
                      ✓ Added to your selection
                    </motion.span>
                  ) : (
                    <motion.span key="add" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="inline-block">
                      Add to Cart · ${(product.price * qty).toFixed(0)}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          </div>
        </div>

        {/* INGREDIENTS / NOTES PYRAMID */}
        <section className="mt-28" style={{ perspective: 1200 }}>
          <div className="text-center mb-12">
            <p className="uppercase-spaced text-xs text-gold/70 mb-3">The Composition</p>
            <h2 className="font-serif text-4xl">How It Unfolds on Skin</h2>
            <p className="text-cream/55 max-w-xl mx-auto mt-4 text-sm">
              A fragrance is alive — it changes with you through the hours. Here is
              every ingredient, in the order you will meet them.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <NoteColumn title="Top" notes={product.notes.top} accent={product.accent2} delay={0} />
            <NoteColumn title="Heart" notes={product.notes.heart} accent={product.accent} delay={0.12} />
            <NoteColumn title="Base" notes={product.notes.base} accent={product.accent} delay={0.24} />
          </div>
        </section>

        {/* RELATED */}
        <section className="mt-28 pb-12">
          <h2 className="font-serif text-3xl mb-10 text-center">
            You May Also <span className="text-shimmer">Fall For</span>
          </h2>
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

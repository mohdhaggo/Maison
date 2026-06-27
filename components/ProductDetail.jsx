"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartContext";
import ProductCard from "./ProductCard";

function NoteColumn({ title, notes, accent, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
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

  function handleAdd() {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="pt-24">
      {/* ambient color wash */}
      <div
        className="pointer-events-none fixed inset-0 -z-0 opacity-40"
        style={{
          background: `radial-gradient(1000px 600px at 20% 10%, ${product.accent}55, transparent 60%), radial-gradient(800px 500px at 90% 30%, ${product.accent2}44, transparent 60%)`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <Link href="/products" className="text-cream/60 hover:text-gold text-sm inline-flex items-center gap-2 mb-8">
          ← Back to Collection
        </Link>

        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-8 rounded-full opacity-30 blur-3xl"
              style={{ background: `conic-gradient(from 0deg, ${product.accent}, ${product.accent2}, ${product.accent})` }}
            />
            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative h-[520px] rounded-[2rem] overflow-hidden glass"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${product.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
            </motion.div>
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

              {/* Emotional story */}
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
        <section className="mt-28">
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
        <section className="mt-28">
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

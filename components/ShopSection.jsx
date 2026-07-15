"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { useCart } from "./CartContext";

const SIZES = [
  { ml: "30ml", mult: 0.7, note: "The Discovery" },
  { ml: "50ml", mult: 1.0, note: "Most Loved", featured: true },
  { ml: "100ml", mult: 1.65, note: "The Signature" },
];

export default function ShopSection({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(null);

  function buy(size) {
    const price = Math.round(product.price * size.mult);
    addItem({
      slug: `${product.slug}-${size.ml}`,
      name: `${product.name} · ${size.ml}`,
      price,
      image: product.image,
      accent: product.accent,
    });
    setAdded(size.ml);
    setTimeout(() => setAdded((s) => (s === size.ml ? null : s)), 1600);
  }

  return (
    <section id="shop" className="relative py-28 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-0 opacity-40"
        style={{
          background: `radial-gradient(900px 500px at 50% 20%, ${product.accent}33, transparent 60%)`,
        }}
      />
      <div className="text-center mb-16 px-6">
        <p className="uppercase-spaced text-xs text-gold/70 mb-4">Acquire</p>
        <h2 className="font-display text-4xl md:text-6xl">
          Choose Your <span className="text-shimmer italic">Ritual</span>
        </h2>
        <p className="text-taupe max-w-lg mx-auto mt-5 text-sm">
          {product.name} — {product.tagline}. Three sizes, one obsession.
        </p>
      </div>

      <div className="mx-auto max-w-5xl px-6 grid sm:grid-cols-3 gap-7 items-stretch">
        {SIZES.map((size, i) => {
          const price = Math.round(product.price * size.mult);
          const isAdded = added === size.ml;
          return (
            <motion.div
              key={size.ml}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`group relative rounded-3xl p-8 flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-2 ${
                size.featured
                  ? "border border-gold/50 bg-plum/70"
                  : "border border-gold/15 bg-plum/40"
              }`}
              style={{ boxShadow: size.featured ? "0 0 44px -12px rgba(201,169,110,0.5)" : "none" }}
            >
              {size.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] uppercase-spaced px-3 py-1 rounded-full bg-gold text-ink font-semibold">
                  {size.note}
                </span>
              )}

              <div
                className="h-40 w-24 rounded-b-[2rem] rounded-t-lg mb-6 relative overflow-hidden transition-transform duration-500 group-hover:scale-105"
                style={{
                  background: `linear-gradient(180deg, ${product.accent2 || "#E8D5A3"}30, ${product.accent}66)`,
                  border: "1px solid rgba(255,255,255,0.12)",
                  boxShadow: `inset 0 -20px 30px -10px ${product.accent}88`,
                }}
              >
                <span className="absolute top-2 left-1/2 -translate-x-1/2 h-4 w-6 rounded-sm bg-gold/80" />
                <span className="absolute inset-x-3 bottom-3 text-[8px] uppercase-spaced text-cream/70">
                  {size.ml}
                </span>
              </div>

              {!size.featured && (
                <span className="text-[10px] uppercase-spaced text-taupe mb-1">{size.note}</span>
              )}
              <div className="font-serif text-2xl">{size.ml}</div>
              <div className="font-display text-4xl text-gold mt-2">${price}</div>

              <button
                onClick={() => buy(size)}
                className="btn-champagne rounded-full px-7 py-3 text-sm mt-6 w-full"
              >
                {isAdded ? "✓ Added to Bag" : "Add to Bag"}
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center mt-12">
        <Link href="/products" className="btn-ghost rounded-full px-8 py-3 inline-block text-sm">
          Explore All Nine Fragrances
        </Link>
      </div>
    </section>
  );
}

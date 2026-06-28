"use client";

import { motion } from "framer-motion";
import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function CollectionPage() {
  return (
    <div className="pt-32 pb-20 mx-auto max-w-7xl px-6">
      <div className="text-center mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="uppercase-spaced text-xs text-gold/70 mb-4"
        >
          The Complete Collection
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-5xl md:text-6xl"
        >
          Nine <span className="text-shimmer">Stories</span> in Glass
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-cream/60 max-w-xl mx-auto mt-5"
        >
          Find the one that already feels like you.
        </motion.p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p, i) => (
          <ProductCard key={p.slug} product={p} index={i} />
        ))}
      </div>
    </div>
  );
}

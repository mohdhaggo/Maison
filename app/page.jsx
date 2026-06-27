"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  const featured = products.slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ scale }} className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-plum/40 to-ink" />
        </motion.div>

        {/* floating orbs */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-2xl"
            style={{
              width: 120 + i * 40,
              height: 120 + i * 40,
              left: `${10 + i * 15}%`,
              top: `${15 + (i % 3) * 25}%`,
              background:
                i % 2 === 0
                  ? "radial-gradient(circle, rgba(212,175,101,0.4), transparent 70%)"
                  : "radial-gradient(circle, rgba(232,160,191,0.35), transparent 70%)",
            }}
            animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
            transition={{ duration: 8 + i, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        <motion.div style={{ y, opacity }} className="relative z-10 text-center px-6">
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.4em" }}
            transition={{ duration: 1.2 }}
            className="uppercase text-xs text-gold/80 mb-6"
          >
            Maison Lumière · Paris
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-serif text-5xl md:text-8xl leading-[0.95]"
          >
            Bottled <span className="text-shimmer italic">Emotion</span>
            <br /> Worn as Light
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-cream/70 max-w-xl mx-auto mt-7 text-lg font-light"
          >
            Eight fragrances. Eight stories. Each one composed to find the
            feeling you didn't have words for — and let you wear it.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="flex flex-wrap gap-4 justify-center mt-10"
          >
            <Link href="/products" className="btn-gold rounded-full px-8 py-3.5 text-base">
              Discover the Collection
            </Link>
            <Link href="/#story" className="btn-ghost rounded-full px-8 py-3.5 text-base">
              The Maison
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold/60 text-xs uppercase-spaced"
        >
          Scroll
        </motion.div>
      </section>

      {/* FEATURED */}
      <section className="relative mx-auto max-w-7xl px-6 py-28">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="uppercase-spaced text-xs text-gold/70 mb-4"
          >
            The Signature Four
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-5xl"
          >
            Begin Your <span className="text-shimmer">Story</span>
          </motion.h2>
        </div>
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
        <div className="text-center mt-14">
          <Link href="/products" className="btn-ghost rounded-full px-8 py-3 inline-block">
            View All Eight Fragrances
          </Link>
        </div>
      </section>

      {/* STORY */}
      <section id="story" className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-wine/30 via-transparent to-amethyst/20" />
        <div className="relative mx-auto max-w-5xl px-6 grid md:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-96 rounded-3xl overflow-hidden glass"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center" />
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="uppercase-spaced text-xs text-gold/70 mb-4">Our Philosophy</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight">
              A scent is the <span className="text-shimmer">shortest path</span> to a memory.
            </h2>
            <p className="text-cream/70 mt-6 leading-relaxed">
              We do not make perfume to smell good. We make it to make you
              <em> feel</em> something — the warmth of a person who once loved you,
              the courage you forgot you had, the quiet of a morning that belonged
              only to you.
            </p>
            <p className="text-cream/70 mt-4 leading-relaxed">
              Every bottle is composed by hand in our Paris atelier from the rarest
              naturals on earth. Nothing rushed. Nothing ordinary.
            </p>
          </motion.div>
        </div>
      </section>

      {/* PROMISE STRIP */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { t: "Composed in Paris", d: "Hand-blended from rare naturals." },
            { t: "Pay Your Way", d: "Card or cash on delivery." },
            { t: "Wrapped in Gold", d: "Complimentary luxury shipping." },
          ].map((f, i) => (
            <motion.div
              key={f.t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-7 text-center"
            >
              <h3 className="font-serif text-xl text-gold">{f.t}</h3>
              <p className="text-cream/60 text-sm mt-2">{f.d}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}

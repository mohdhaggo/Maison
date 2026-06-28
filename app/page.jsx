"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { products } from "@/lib/products";
import BottleStage from "@/components/BottleStage";
import Carousel3D from "@/components/Carousel3D";

export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const bottleScale = useTransform(scrollYProgress, [0, 1], [1, 1.35]);
  const bottleOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <>
      {/* ============ HERO ============ */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* floating colour orbs (kept light for smooth compositing) */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-2xl will-change-transform"
            style={{
              width: 200 + i * 60,
              height: 200 + i * 60,
              left: `${12 + i * 28}%`,
              top: `${16 + (i % 2) * 30}%`,
              background:
                i % 2 === 0
                  ? "radial-gradient(circle, rgba(212,175,101,0.3), transparent 70%)"
                  : "radial-gradient(circle, rgba(232,160,191,0.28), transparent 70%)",
            }}
            animate={{ y: [0, -28, 0], x: [0, 16, 0] }}
            transition={{ duration: 11 + i * 2, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        {/* 3D flacon, centred behind the headline */}
        <motion.div
          style={{ scale: bottleScale, opacity: bottleOpacity }}
          className="absolute inset-0 z-0"
        >
          <BottleStage
            color="#d4af65"
            color2="#f2e2bd"
            spin={0.35}
            floatIntensity={1.1}
            className="h-full w-full"
          />
        </motion.div>

        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="relative z-10 text-center px-6 pointer-events-none"
        >
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
            className="font-serif text-5xl md:text-8xl leading-[0.95] drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)]"
          >
            Bottled <span className="text-shimmer italic">Emotion</span>
            <br /> Worn as Light
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-cream/75 max-w-xl mx-auto mt-7 text-lg font-light"
          >
            Nine fragrances. Nine stories. Each one composed to find the feeling
            you didn't have words for — and let you wear it.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="flex flex-wrap gap-4 justify-center mt-10 pointer-events-auto"
          >
            <Link href="/products" className="btn-gold rounded-full px-8 py-3.5 text-base">
              Discover the Collection
            </Link>
            <Link href="/#spectrum" className="btn-ghost rounded-full px-8 py-3.5 text-base">
              Explore the Spectrum
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold/60 text-xs uppercase-spaced z-10"
        >
          Scroll
        </motion.div>
      </section>

      {/* ============ COLOUR SPECTRUM ============ */}
      <SpectrumSection />

      {/* ============ FEATURED ============ */}
      <section className="relative mx-auto max-w-7xl px-6 py-28">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="uppercase-spaced text-xs text-gold/70 mb-4"
          >
            The Maison Collection
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

        <Carousel3D products={products} />

        <div className="text-center mt-14">
          <Link href="/products" className="btn-ghost rounded-full px-8 py-3 inline-block">
            View All Nine Fragrances
          </Link>
        </div>
      </section>

      {/* ============ STORY ============ */}
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

      {/* ============ PROMISE STRIP ============ */}
      <section className="mx-auto max-w-7xl px-6 py-10 pb-24">
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

/* ---- Scroll-driven colour spectrum: the whole section bleeds through every
   perfume's accent colour as you scroll, OnePlus-style. ---- */
function SpectrumSection() {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // pin a viewport-height stage and slide the horizontal rail across it
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-78%"]);

  return (
    <section
      id="spectrum"
      ref={ref}
      className="relative"
      style={{ height: `${products.length * 60}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        {/* colour wash that follows the active perfume */}
        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 -z-0"
          style={{
            background: `radial-gradient(1100px 700px at 25% 30%, ${products[active].accent}55, transparent 60%), radial-gradient(900px 600px at 85% 70%, ${products[active].accent2}44, transparent 60%)`,
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl w-full px-6 mb-8">
          <p className="uppercase-spaced text-xs text-gold/70 mb-3">The Spectrum</p>
          <h2 className="font-serif text-4xl md:text-6xl">
            Nine Colours of <span className="text-shimmer">Feeling</span>
          </h2>
        </div>

        <motion.div style={{ x }} className="relative z-10 flex gap-7 px-6 will-change-transform">
          {products.map((p, i) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              onMouseEnter={() => setActive(i)}
              className="group relative shrink-0 w-[78vw] sm:w-[44vw] lg:w-[27vw] h-[58vh] rounded-[2rem] overflow-hidden border border-gold/15 bg-ink/40"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${p.image})` }}
              />
              <div
                className="absolute inset-0 opacity-65 transition-opacity group-hover:opacity-45"
                style={{ background: `linear-gradient(160deg, ${p.accent}bb, ${p.accent2}44 60%, transparent)` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7">
                <span
                  className="text-[10px] uppercase-spaced px-3 py-1 rounded-full glass-strong inline-block mb-3"
                  style={{ color: p.accent2 }}
                >
                  {p.family}
                </span>
                <h3 className="font-serif text-3xl leading-none">{p.name}</h3>
                <p className="text-cream/70 italic text-sm mt-1">{p.tagline}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="font-serif text-xl text-gold">${p.price}</span>
                  <span className="text-xs uppercase-spaced text-cream/70 group-hover:text-gold transition-colors">
                    Discover →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>

        <div className="relative z-10 mx-auto max-w-7xl w-full px-6 mt-8 flex gap-2">
          {products.map((p, i) => (
            <div
              key={p.slug}
              className="h-1 flex-1 rounded-full transition-all"
              style={{
                background: i === active ? p.accent : "rgba(255,255,255,0.12)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

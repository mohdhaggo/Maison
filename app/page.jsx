"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { products, getProduct } from "@/lib/products";
import Carousel3D from "@/components/Carousel3D";
import HeroBottle from "@/components/HeroBottle";
import NotesOrbs from "@/components/NotesOrbs";
import Testimonials from "@/components/Testimonials";
import ShopSection from "@/components/ShopSection";

export default function HomePage() {
  const feature = getProduct("oud-royal") || products[0];

  return (
    <>
      {/* 1 · CINEMATIC PHOTOREAL HERO (auto-swaps to public/videos/hero.mp4 if present) */}
      <HeroBottle />

      {/* 2 · FRAGRANCE STORY */}
      <StorySection />

      {/* 3 · THE NOTES PYRAMID */}
      <NotesOrbs />

      {/* 4 · THE SPECTRUM (colour reveal of all nine) */}
      <SpectrumSection />

      {/* 5 · BEGIN YOUR STORY — 3D carousel */}
      <section className="relative mx-auto max-w-7xl px-6 py-28">
        <div className="text-center mb-16">
          <p className="uppercase-spaced text-xs text-gold/70 mb-4">The Maison Collection</p>
          <h2 className="font-display text-4xl md:text-6xl">
            Begin Your <span className="text-shimmer italic">Story</span>
          </h2>
        </div>
        <Carousel3D products={products} />
        <div className="text-center mt-14">
          <Link href="/products" className="btn-ghost rounded-full px-8 py-3 inline-block">
            View All Nine Fragrances
          </Link>
        </div>
      </section>

      {/* 6 · TESTIMONIALS */}
      <Testimonials />

      {/* 7 · SHOP / CTA */}
      <ShopSection product={feature} />
    </>
  );
}

/* ---- Fragrance story with parallax ---- */
function StorySection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <section id="story" ref={ref} className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-wine/40 via-transparent to-amber/10" />
      <div className="relative mx-auto max-w-5xl px-6 grid md:grid-cols-2 gap-14 items-center">
        <motion.div style={{ y: y1 }} className="relative h-96 rounded-3xl overflow-hidden glass">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center" />
          <motion.div
            animate={{ opacity: [0.35, 0.65, 0.35] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent"
          />
        </motion.div>
        <motion.div style={{ y: y2 }}>
          <p className="uppercase-spaced text-xs text-gold/70 mb-4">Our Philosophy</p>
          <h2 className="font-display text-4xl md:text-5xl leading-tight">
            A scent is the <span className="text-shimmer italic">shortest path</span> to a memory.
          </h2>
          <p className="text-cream/70 mt-6 leading-relaxed">
            We do not make perfume to smell good. We make it to make you
            <em> feel</em> something — the warmth of a person who once loved you,
            the courage you forgot you had, the quiet of a morning that belonged
            only to you.
          </p>
          <p className="text-taupe mt-4 leading-relaxed">
            Every bottle is composed by hand in our Paris atelier from the rarest
            naturals on earth. Nothing rushed. Nothing ordinary.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ---- Scroll-driven colour spectrum of all nine fragrances ---- */
function SpectrumSection() {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-78%"]);

  return (
    <section id="spectrum" ref={ref} className="relative" style={{ height: `${products.length * 60}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
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
          <h2 className="font-display text-4xl md:text-6xl">
            Nine Colours of <span className="text-shimmer italic">Feeling</span>
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
                <h3 className="font-display text-3xl leading-none">{p.name}</h3>
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
              style={{ background: i === active ? p.accent : "rgba(255,255,255,0.12)" }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

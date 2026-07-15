"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HeroVideo() {
  const wrap = useRef(null);
  const videoRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ["start start", "end start"],
  });

  // gentle scroll parallax on the footage (cheap: transform only, no seeking)
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const vidY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // make sure it starts playing (muted autoplay)
  useEffect(() => {
    const v = videoRef.current;
    if (v) v.play().catch(() => {});
  }, []);

  return (
    <section ref={wrap} className="relative h-screen w-full overflow-hidden bg-ink">
      {/* looping cinematic footage */}
      <motion.div style={{ scale, y: vidY }} className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src="/videos/hero-loop.mp4"
          poster="/videos/hero-poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        />
      </motion.div>

      {/* vignette + wash for legibility */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(10,10,10,0.78)_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-ink via-transparent to-ink/40" />

      {/* overlay copy */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 pointer-events-none"
      >
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.2em" }}
          animate={{ opacity: 1, letterSpacing: "0.5em" }}
          transition={{ duration: 1.4 }}
          className="uppercase text-[11px] text-gold/80 mb-6"
        >
          Maison Lumière · Paris
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 26, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, delay: 0.2 }}
          className="font-display text-4xl sm:text-6xl md:text-7xl leading-[1.03] max-w-4xl drop-shadow-[0_6px_40px_rgba(0,0,0,0.8)]"
        >
          The Invisible Art of <span className="text-shimmer italic">Presence</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-taupe text-sm sm:text-base mt-6 max-w-md"
        >
          Hand-composed in Paris from the rarest naturals on earth.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="flex flex-wrap gap-4 justify-center mt-9 pointer-events-auto"
        >
          <Link href="/products" className="btn-champagne rounded-full px-8 py-3.5 text-sm">
            Discover the Collection
          </Link>
          <Link href="/#notes" className="btn-ghost rounded-full px-8 py-3.5 text-sm">
            The Composition
          </Link>
        </motion.div>
      </motion.div>

      {/* scroll indicator */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="uppercase tracking-[0.32em] text-[9px] text-taupe">Scroll</span>
        <span className="relative block h-9 w-[1px] bg-gold/25 overflow-hidden">
          <span className="absolute left-0 top-0 h-3 w-full bg-gold animate-scrolldot" />
        </span>
      </div>
    </section>
  );
}

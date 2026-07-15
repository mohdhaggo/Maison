"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

const VIDEO = "/videos/hero-scroll.mp4";

export default function HeroScrollVideo() {
  const wrap = useRef(null);
  const videoRef = useRef(null);
  const dur = useRef(0);
  const target = useRef(0);

  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ["start start", "end end"],
  });

  // scroll position -> desired video time
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    target.current = v;
  });

  // prime the video, then scrub its currentTime toward the scroll target each frame
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onMeta = () => {
      dur.current = v.duration || 10;
    };
    v.addEventListener("loadedmetadata", onMeta);
    // prime decoding (muted) so seeking paints frames, then pause
    v.play().then(() => v.pause()).catch(() => {});

    let raf;
    const tick = () => {
      if (dur.current) {
        const want = target.current * (dur.current - 0.05);
        const cur = v.currentTime;
        const diff = want - cur;
        if (Math.abs(diff) > 0.008) {
          try {
            v.currentTime = cur + diff * 0.25; // ease toward target
          } catch {}
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      v.removeEventListener("loadedmetadata", onMeta);
    };
  }, []);

  // text choreography across the scroll
  const introOpacity = useTransform(scrollYProgress, [0, 0.18, 0.28], [1, 1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.28], [0, -60]);
  const midOpacity = useTransform(scrollYProgress, [0.34, 0.48, 0.62, 0.72], [0, 1, 1, 0]);
  const outroOpacity = useTransform(scrollYProgress, [0.78, 0.9, 1], [0, 1, 1]);
  const outroY = useTransform(scrollYProgress, [0.78, 1], [40, 0]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  return (
    <section ref={wrap} className="relative h-[320vh] bg-ink">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* scrubbed cinematic video */}
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={VIDEO}
          muted
          playsInline
          preload="auto"
        />

        {/* vignette + warm wash for legibility */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(10,10,10,0.78)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />

        {/* fixed brand eyebrow */}
        <motion.p
          style={{ opacity: hintOpacity }}
          className="absolute top-24 left-1/2 -translate-x-1/2 uppercase tracking-[0.5em] text-[11px] text-gold/80"
        >
          Maison Lumière · Paris
        </motion.p>

        {/* intro headline */}
        <motion.div
          style={{ opacity: introOpacity, y: introY }}
          className="absolute inset-0 flex items-center justify-center px-6 text-center"
        >
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl leading-[1.03] max-w-4xl drop-shadow-[0_6px_40px_rgba(0,0,0,0.8)]">
            The Invisible Art of <span className="text-shimmer italic">Presence</span>
          </h1>
        </motion.div>

        {/* mid headline */}
        <motion.div
          style={{ opacity: midOpacity }}
          className="absolute inset-0 flex items-center justify-center px-6 text-center"
        >
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl leading-tight max-w-3xl drop-shadow-[0_6px_40px_rgba(0,0,0,0.8)]">
            Composed by hand from the <span className="text-shimmer italic">rarest naturals</span> on earth.
          </h2>
        </motion.div>

        {/* outro CTA */}
        <motion.div
          style={{ opacity: outroOpacity, y: outroY }}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        >
          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl leading-[1.03] max-w-4xl drop-shadow-[0_6px_40px_rgba(0,0,0,0.8)]">
            Bottled Light, <span className="text-shimmer italic">Worn as Memory</span>
          </h2>
          <div className="flex flex-wrap gap-4 justify-center mt-10">
            <Link href="/products" className="btn-champagne rounded-full px-8 py-3.5 text-sm">
              Discover the Collection
            </Link>
            <Link href="/#notes" className="btn-ghost rounded-full px-8 py-3.5 text-sm">
              The Composition
            </Link>
          </div>
        </motion.div>

        {/* scroll hint */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="uppercase tracking-[0.32em] text-[9px] text-taupe">Scroll</span>
          <span className="relative block h-9 w-[1px] bg-gold/25 overflow-hidden">
            <span className="absolute left-0 top-0 h-3 w-full bg-gold animate-scrolldot" />
          </span>
        </motion.div>
      </div>
    </section>
  );
}

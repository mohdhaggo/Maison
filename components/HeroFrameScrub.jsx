"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const FRAMES = 80;
const framePath = (i) => `/frames/f-${String(i + 1).padStart(3, "0")}.jpg`;

export default function HeroFrameScrub() {
  const wrap = useRef(null);
  const canvasRef = useRef(null);
  const imgs = useRef([]);
  const curIdx = useRef(0);
  const [progressPct, setProgressPct] = useState(0);

  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ["start start", "end end"],
  });

  // ---- draw an object-cover frame to the canvas ----
  function draw(idx) {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    let im = imgs.current[idx];
    if (!im || !im.complete || !im.naturalWidth) {
      // fall back to the nearest already-loaded frame
      for (let d = 1; d < FRAMES; d++) {
        const a = imgs.current[idx - d];
        if (a && a.complete && a.naturalWidth) { im = a; break; }
        const b = imgs.current[idx + d];
        if (b && b.complete && b.naturalWidth) { im = b; break; }
      }
    }
    if (!im || !im.naturalWidth) return;
    const cw = cvs.width, ch = cvs.height, iw = im.naturalWidth, ih = im.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale, dh = ih * scale;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(im, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  }

  function sizeCanvas() {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cvs.width = Math.floor(window.innerWidth * dpr);
    cvs.height = Math.floor(window.innerHeight * dpr);
    draw(curIdx.current);
  }

  // preload every frame; draw as soon as the first arrives
  useEffect(() => {
    let loaded = 0;
    const arr = [];
    for (let i = 0; i < FRAMES; i++) {
      const im = new Image();
      im.src = framePath(i);
      im.onload = () => {
        loaded++;
        setProgressPct(Math.round((loaded / FRAMES) * 100));
        if (i === 0) { sizeCanvas(); draw(0); }
        else draw(curIdx.current);
      };
      arr.push(im);
    }
    imgs.current = arr;
    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);
    return () => window.removeEventListener("resize", sizeCanvas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // scroll drives the frame — native listener (robust, synchronous), instant
  // image draw, no video decode and no rAF dependency
  useEffect(() => {
    const onScroll = () => {
      const el = wrap.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      const idx = Math.min(FRAMES - 1, Math.round(p * (FRAMES - 1)));
      if (idx !== curIdx.current) {
        curIdx.current = idx;
        draw(idx);
        if (canvasRef.current) canvasRef.current.dataset.frame = String(idx);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // text choreography across the scroll
  const introOpacity = useTransform(scrollYProgress, [0, 0.16, 0.26], [1, 1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.26], [0, -60]);
  const midOpacity = useTransform(scrollYProgress, [0.34, 0.48, 0.62, 0.72], [0, 1, 1, 0]);
  const outroOpacity = useTransform(scrollYProgress, [0.78, 0.9, 1], [0, 1, 1]);
  const outroY = useTransform(scrollYProgress, [0.78, 1], [40, 0]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  return (
    <section ref={wrap} className="relative h-[320vh] bg-ink">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* loading shimmer until the first frames arrive */}
        {progressPct < 6 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-40 w-24 rounded-[40%] blur-2xl animate-pulse bg-[radial-gradient(circle,#C9A96E,transparent_70%)]" />
          </div>
        )}

        {/* vignette + wash */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(10,10,10,0.78)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />

        {/* brand eyebrow */}
        <motion.p
          style={{ opacity: hintOpacity }}
          className="absolute top-24 left-1/2 -translate-x-1/2 uppercase tracking-[0.5em] text-[11px] text-gold/80"
        >
          Maison Lumière · Paris
        </motion.p>

        {/* intro */}
        <motion.div style={{ opacity: introOpacity, y: introY }} className="absolute inset-0 flex items-center justify-center px-6 text-center">
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl leading-[1.03] max-w-4xl drop-shadow-[0_6px_40px_rgba(0,0,0,0.8)]">
            The Invisible Art of <span className="text-shimmer italic">Presence</span>
          </h1>
        </motion.div>

        {/* mid */}
        <motion.div style={{ opacity: midOpacity }} className="absolute inset-0 flex items-center justify-center px-6 text-center">
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl leading-tight max-w-3xl drop-shadow-[0_6px_40px_rgba(0,0,0,0.8)]">
            Composed from the <span className="text-shimmer italic">rarest naturals</span> on earth.
          </h2>
        </motion.div>

        {/* outro */}
        <motion.div style={{ opacity: outroOpacity, y: outroY }} className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
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
        <motion.div style={{ opacity: hintOpacity }} className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="uppercase tracking-[0.32em] text-[9px] text-taupe">Scroll</span>
          <span className="relative block h-9 w-[1px] bg-gold/25 overflow-hidden">
            <span className="absolute left-0 top-0 h-3 w-full bg-gold animate-scrolldot" />
          </span>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AudioToggle from "./AudioToggle";

const HeroBottleScene = dynamic(() => import("./three/HeroBottleScene"), {
  ssr: false,
  loading: () => null,
});

const TAGLINES = [
  "The Invisible Art of Presence",
  "Bottled Light, Worn as Memory",
  "Nine Stories, Told in Gold",
];

// If you drop a rendered clip at public/videos/hero.mp4 it plays automatically.
const HERO_VIDEO = "/videos/hero.mp4";

export default function HeroBottle() {
  const wrap = useRef(null);
  const [mode, setMode] = useState("probe"); // probe -> video | canvas
  const [inView, setInView] = useState(true);
  const [line, setLine] = useState(0);

  // fall back to the live 3D bottle if no hero video is present
  useEffect(() => {
    const v = document.createElement("video");
    let settled = false;
    const toCanvas = () => { if (!settled) { settled = true; setMode("canvas"); } };
    const toVideo = () => { if (!settled) { settled = true; setMode("video"); } };
    v.onloadeddata = toVideo;
    v.onerror = toCanvas;
    v.src = HERO_VIDEO;
    const t = setTimeout(toCanvas, 2500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = wrap.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "80px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setLine((l) => (l + 1) % TAGLINES.length), 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <section ref={wrap} className="relative h-screen w-full overflow-hidden bg-ink">
      {/* cinematic drifting smoke */}
      <div className="absolute inset-0 -z-0">
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(650px 520px at 32% 62%, rgba(212,136,28,0.16), transparent 62%), radial-gradient(720px 520px at 70% 34%, rgba(201,169,110,0.14), transparent 62%)",
          }}
          animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.06, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(900px_640px_at_50%_45%,rgba(201,169,110,0.10),transparent_60%)]" />
      </div>

      {/* rendered hero video (auto-plays if provided) */}
      {mode === "video" && (
        <video
          className="absolute inset-0 z-0 h-full w-full object-cover"
          src={HERO_VIDEO}
          autoPlay
          loop
          muted
          playsInline
        />
      )}

      {/* live photoreal flacon fallback */}
      {mode === "canvas" && (
        <div className="absolute inset-0 z-0">
          <HeroBottleScene active={inView} />
        </div>
      )}

      {/* vignette */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(10,10,10,0.72)_100%)]" />

      {/* overlay copy */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 pointer-events-none">
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.2em" }}
          animate={{ opacity: 1, letterSpacing: "0.5em" }}
          transition={{ duration: 1.4 }}
          className="uppercase text-[11px] text-gold/80 mb-6"
        >
          Maison Lumière · Paris
        </motion.p>

        <AnimatePresence mode="wait">
          <motion.h1
            key={line}
            initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -18, filter: "blur(6px)" }}
            transition={{ duration: 1 }}
            className="font-display text-4xl sm:text-6xl md:text-7xl leading-[1.03] max-w-4xl drop-shadow-[0_6px_40px_rgba(0,0,0,0.75)]"
          >
            {TAGLINES[line].split(" ").map((w, i, a) =>
              i === a.length - 1 ? (
                <span key={i} className="text-shimmer italic"> {w}</span>
              ) : (
                <span key={i}> {w}</span>
              )
            )}
          </motion.h1>
        </AnimatePresence>

        <p className="text-taupe text-sm sm:text-base mt-6 max-w-md">
          Hand-composed in Paris from the rarest naturals on earth.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mt-9 pointer-events-auto">
          <Link href="/products" className="btn-champagne rounded-full px-8 py-3.5 text-sm">
            Discover the Collection
          </Link>
          <Link href="/#notes" className="btn-ghost rounded-full px-8 py-3.5 text-sm">
            The Composition
          </Link>
        </div>

        <p className="text-[10px] uppercase-spaced text-taupe/70 mt-8">
          Drag the flacon to rotate
        </p>
      </div>

      {/* ambient audio (plays your ElevenLabs track from public/audio/ambience.mp3) */}
      <AudioToggle />

      {/* scroll indicator */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="uppercase-spaced text-[9px] text-taupe">Scroll</span>
        <span className="relative block h-9 w-[1px] bg-gold/25 overflow-hidden">
          <span className="absolute left-0 top-0 h-3 w-full bg-gold animate-scrolldot" />
        </span>
      </div>
    </section>
  );
}

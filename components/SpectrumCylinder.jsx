"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { products } from "@/lib/products";

const N = products.length;
const STEP = 360 / N;          // angle between cards
const SWEEP = STEP * (N - 1);  // total rotation to pass all cards to the front

export default function SpectrumCylinder() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const setSize = () => {
      const vw = window.innerWidth;
      const W = Math.min(340, Math.max(220, vw * 0.6));
      const H = Math.round(W * 1.4);
      const R = Math.round(W * 1.85); // radius so cards fan out without overlap
      stage.style.setProperty("--w", W + "px");
      stage.style.setProperty("--h", H + "px");
      stage.style.setProperty("--r", R + "px");
    };

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      const rot = p * SWEEP; // degrees

      stage.style.transform = `translateZ(calc(var(--r) * -1)) rotateY(${-rot}deg)`;

      let best = 0;
      let bestFront = -2;
      cardRefs.current.forEach((c, i) => {
        if (!c) return;
        let a = i * STEP - rot;
        a = (((a % 360) + 540) % 360) - 180; // normalize to [-180,180]
        const front = Math.cos((a * Math.PI) / 180); // 1 = facing us, -1 = behind
        const f = Math.max(0, front);
        c.style.opacity = (0.12 + 0.88 * f).toFixed(3);
        c.style.filter = `brightness(${(0.45 + 0.55 * f).toFixed(2)})`;
        c.style.zIndex = String(Math.round(front * 100) + 100);
        if (front > bestFront) {
          bestFront = front;
          best = i;
        }
      });
      setActive(best);
    };

    setSize();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => {
      setSize();
      onScroll();
    });
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section ref={sectionRef} className="relative" style={{ height: `${Math.max(340, N * 42)}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        {/* colour wash follows the front fragrance */}
        <div
          key={active}
          className="absolute inset-0 -z-0 transition-opacity duration-700"
          style={{
            background: `radial-gradient(1100px 720px at 30% 35%, ${products[active].accent}55, transparent 60%), radial-gradient(900px 620px at 78% 68%, ${products[active].accent2}44, transparent 60%)`,
          }}
        />

        {/* heading */}
        <div className="relative z-20 mx-auto max-w-7xl w-full px-6 mb-2 pt-6">
          <p className="uppercase tracking-[0.32em] text-xs text-gold/70 mb-3">The Spectrum</p>
          <h2 className="font-display text-4xl md:text-6xl">
            Nine Colours of <span className="text-shimmer italic">Feeling</span>
          </h2>
        </div>

        {/* 3D cylinder */}
        <div className="relative flex-1 flex items-center justify-center" style={{ perspective: "1500px" }}>
          <div
            ref={stageRef}
            className="absolute inset-0"
            style={{ transformStyle: "preserve-3d", willChange: "transform" }}
          >
            {products.map((p, i) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                ref={(el) => (cardRefs.current[i] = el)}
                className="group absolute block rounded-[1.6rem] overflow-hidden border border-gold/20 bg-ink/50 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]"
                style={{
                  width: "var(--w)",
                  height: "var(--h)",
                  left: "calc(50% - (var(--w) / 2))",
                  top: "calc(50% - (var(--h) / 2))",
                  transform: `rotateY(${i * STEP}deg) translateZ(var(--r))`,
                  backfaceVisibility: "hidden",
                }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${p.image})` }}
                />
                <div
                  className="absolute inset-0 opacity-70"
                  style={{ background: `linear-gradient(165deg, ${p.accent}bb, ${p.accent2}44 55%, transparent)` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span
                    className="text-[10px] uppercase tracking-[0.32em] px-3 py-1 rounded-full bg-ink/60 border border-gold/20 inline-block mb-3"
                    style={{ color: p.accent2 }}
                  >
                    {p.family}
                  </span>
                  <h3 className="font-display text-2xl leading-none">{p.name}</h3>
                  <p className="text-cream/70 italic text-sm mt-1">{p.tagline}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-serif text-xl text-gold">${p.price}</span>
                    <span className="text-xs uppercase tracking-[0.2em] text-cream/70 group-hover:text-gold transition-colors">
                      Discover →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* progress rail */}
        <div className="relative z-20 mx-auto max-w-7xl w-full px-6 pb-8 flex gap-2">
          {products.map((p, i) => (
            <div
              key={p.slug}
              className="h-1 flex-1 rounded-full transition-all duration-300"
              style={{ background: i === active ? p.accent : "rgba(255,255,255,0.12)" }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

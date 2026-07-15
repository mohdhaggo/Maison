"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { products } from "@/lib/products";

const N = products.length;
const STEP = 360 / N;

export default function CardsTornado() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const [active, setActive] = useState(0);

  // physics state (kept in refs so the rAF loop is stable)
  const rot = useRef(0);        // current rotation (deg)
  const vel = useRef(0);        // angular velocity (deg/frame)
  const lastScrollY = useRef(0);
  const inView = useRef(true);
  const drag = useRef({ on: false, lastX: 0, moved: 0 });

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    let W = 240, H = 320, R = 420, ystep = 108;
    const setSize = () => {
      const vw = window.innerWidth;
      W = Math.min(260, Math.max(180, vw * 0.52));
      H = Math.round(W * 1.32);
      R = Math.round(W * 1.7);
      ystep = Math.round(H * 0.34);
      stage.style.setProperty("--w", W + "px");
      stage.style.setProperty("--h", H + "px");
      cardRefs.current.forEach((c, i) => {
        if (!c) return;
        const y = (i - (N - 1) / 2) * ystep;
        c.style.transform = `translateY(${y}px) rotateY(${i * STEP}deg) translateZ(${R}px)`;
      });
    };

    lastScrollY.current = window.scrollY;

    const render = () => {
      // gentle idle drift + inertia
      rot.current += vel.current + 0.02;
      vel.current *= 0.93;
      if (Math.abs(vel.current) < 0.002) vel.current = 0;

      stage.style.transform = `translateZ(${-R}px) rotateX(-7deg) rotateY(${rot.current}deg)`;

      let best = 0, bestFront = -2;
      for (let i = 0; i < N; i++) {
        const c = cardRefs.current[i];
        if (!c) continue;
        let a = i * STEP + rot.current;
        a = (((a % 360) + 540) % 360) - 180;
        const front = Math.cos((a * Math.PI) / 180);
        const f = Math.max(0, front);
        c.style.opacity = (0.1 + 0.9 * f).toFixed(3);
        c.style.filter = `brightness(${(0.4 + 0.6 * f).toFixed(2)})`;
        c.style.zIndex = String(Math.round(front * 100) + 100);
        if (front > bestFront) { bestFront = front; best = i; }
      }
      setActive((prev) => (prev === best ? prev : best));
    };

    let raf;
    const loop = () => {
      render();
      raf = requestAnimationFrame(loop);
    };

    // scroll velocity: spin accelerates with scroll, flips on reverse
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;
      lastScrollY.current = y;
      const rect = section.getBoundingClientRect();
      const engaged = rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight * 0.4;
      if (engaged) {
        vel.current += delta * 0.07;
        vel.current = Math.max(-5, Math.min(5, vel.current));
      }
    };

    // drag / swipe (pointer events cover mouse + touch)
    const onDown = (e) => {
      drag.current = { on: true, lastX: e.clientX, moved: 0 };
      vel.current = 0;
      stage.style.cursor = "grabbing";
      try { e.target.setPointerCapture?.(e.pointerId); } catch {}
    };
    const onMove = (e) => {
      const d = drag.current;
      if (!d.on) return;
      const dx = e.clientX - d.lastX;
      d.lastX = e.clientX;
      d.moved += Math.abs(dx);
      rot.current += dx * 0.3;
      vel.current = dx * 0.3; // carry momentum on release
    };
    const onUp = () => {
      drag.current.on = false;
      stage.style.cursor = "grab";
    };
    // swallow the click that follows a real drag so cards don't navigate
    const onClickCapture = (e) => {
      if (drag.current.moved > 6) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const io = new IntersectionObserver(
      ([e]) => {
        inView.current = e.isIntersecting;
        if (e.isIntersecting && !raf) raf = requestAnimationFrame(loop);
        if (!e.isIntersecting && raf) { cancelAnimationFrame(raf); raf = null; }
      },
      { rootMargin: "60px" }
    );

    setSize();
    io.observe(section);
    raf = requestAnimationFrame(loop);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", setSize);
    stage.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    stage.addEventListener("click", onClickCapture, true);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", setSize);
      stage.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      stage.removeEventListener("click", onClickCapture, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section ref={sectionRef} id="spectrum" className="relative" style={{ height: "240vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        {/* colour wash follows the front fragrance */}
        <div
          key={active}
          className="absolute inset-0 -z-0 transition-opacity duration-700"
          style={{
            background: `radial-gradient(1100px 760px at 32% 34%, ${products[active].accent}55, transparent 60%), radial-gradient(900px 640px at 74% 70%, ${products[active].accent2}44, transparent 60%)`,
          }}
        />

        <div className="relative z-20 mx-auto max-w-7xl w-full px-6 pt-8">
          <p className="uppercase tracking-[0.32em] text-xs text-gold/70 mb-3">The Spectrum</p>
          <h2 className="font-display text-4xl md:text-6xl">
            Nine Colours of <span className="text-shimmer italic">Feeling</span>
          </h2>
          <p className="text-taupe text-sm mt-3">Scroll to spin · drag to explore</p>
        </div>

        {/* tornado */}
        <div className="relative flex-1 flex items-center justify-center" style={{ perspective: "1600px" }}>
          <div
            ref={stageRef}
            className="absolute inset-0"
            style={{ transformStyle: "preserve-3d", cursor: "grab", touchAction: "pan-y", willChange: "transform" }}
          >
            {products.map((p, i) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                ref={(el) => (cardRefs.current[i] = el)}
                className="group absolute block rounded-2xl overflow-hidden border border-gold/20 bg-ink/50 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.85)]"
                style={{
                  width: "var(--w)",
                  height: "var(--h)",
                  left: "calc(50% - (var(--w) / 2))",
                  top: "calc(50% - (var(--h) / 2))",
                  backfaceVisibility: "hidden",
                }}
                draggable={false}
              >
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${p.image})` }} />
                <div
                  className="absolute inset-0 opacity-70"
                  style={{ background: `linear-gradient(165deg, ${p.accent}bb, ${p.accent2}44 55%, transparent)` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span
                    className="text-[9px] uppercase tracking-[0.3em] px-2.5 py-1 rounded-full bg-ink/60 border border-gold/20 inline-block mb-2"
                    style={{ color: p.accent2 }}
                  >
                    {p.family}
                  </span>
                  <h3 className="font-display text-xl leading-none">{p.name}</h3>
                  <p className="text-cream/70 italic text-xs mt-1">{p.tagline}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-serif text-lg text-gold">${p.price}</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-cream/70 group-hover:text-gold transition-colors">
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

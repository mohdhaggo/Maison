"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useCart } from "./CartContext";

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart();
  const ref = useRef(null);

  // 3D tilt that follows the cursor
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [9, -9]), { stiffness: 180, damping: 16 });
  const ry = useSpring(useTransform(mx, [0, 1], [-9, 9]), { stiffness: 180, damping: 16 });
  const glareX = useTransform(mx, [0, 1], ["0%", "100%"]);
  const glare = useTransform(
    glareX,
    (x) => `radial-gradient(120px 120px at ${x} 30%, rgba(255,255,255,0.28), transparent 60%)`
  );

  function onMove(e) {
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }
  function onLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08 }}
      style={{ perspective: 1000 }}
      className="group relative"
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="relative"
      >
        <div
          className="absolute -inset-0.5 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
          style={{ background: `linear-gradient(135deg, ${product.accent}, ${product.accent2})` }}
        />
        <div className="relative glass rounded-3xl overflow-hidden">
          <Link href={`/products/${product.slug}`}>
            <div className="relative h-72 overflow-hidden" style={{ transform: "translateZ(40px)" }}>
              <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${product.image})` }}
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
              {/* moving glare */}
              <motion.div
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: glare }}
              />
              <div
                className="absolute top-4 left-4 text-[10px] uppercase-spaced px-3 py-1 rounded-full glass-strong"
                style={{ color: product.accent2 }}
              >
                {product.family}
              </div>
            </div>
          </Link>

          <div className="p-6" style={{ transform: "translateZ(28px)" }}>
            <Link href={`/products/${product.slug}`}>
              <h3 className="font-serif text-2xl group-hover:text-shimmer transition-all">
                {product.name}
              </h3>
            </Link>
            <p className="text-cream/55 text-sm italic mt-1">{product.tagline}</p>
            <p className="text-cream/65 text-sm mt-3 line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center justify-between mt-5">
              <span className="font-serif text-2xl text-gold">${product.price}</span>
              <button
                onClick={() => addItem(product)}
                className="btn-gold rounded-full px-5 py-2 text-sm"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

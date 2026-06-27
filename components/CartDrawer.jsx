"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartContext";

export default function CartDrawer() {
  const { items, open, setOpen, updateQty, removeItem, subtotal } = useCart();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="fixed right-0 top-0 z-[70] h-full w-full max-w-md glass-strong flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-gold/20">
              <h2 className="font-serif text-2xl text-shimmer">Your Selection</h2>
              <button onClick={() => setOpen(false)} className="text-cream/70 hover:text-gold text-2xl leading-none">
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="text-center text-cream/60 mt-20">
                  <p className="font-serif text-xl mb-2">Your cart awaits.</p>
                  <p className="text-sm">Every scent here is a story. Choose your first.</p>
                  <Link href="/products" onClick={() => setOpen(false)} className="btn-ghost inline-block mt-6 px-6 py-2 rounded-full text-sm">
                    Explore the Collection
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.slug}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    className="flex gap-4 glass rounded-2xl p-3"
                  >
                    <div
                      className="h-20 w-16 rounded-xl bg-cover bg-center shrink-0"
                      style={{
                        backgroundImage: `url(${item.image})`,
                        boxShadow: `0 8px 20px -8px ${item.accent}`,
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-lg leading-tight">{item.name}</p>
                      <p className="text-gold text-sm">${item.price}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-gold/30 rounded-full">
                          <button onClick={() => updateQty(item.slug, item.qty - 1)} className="px-2.5 text-gold">−</button>
                          <span className="text-sm w-5 text-center">{item.qty}</span>
                          <button onClick={() => updateQty(item.slug, item.qty + 1)} className="px-2.5 text-gold">+</button>
                        </div>
                        <button onClick={() => removeItem(item.slug)} className="text-xs text-cream/50 hover:text-rose">
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-gold/20 px-6 py-5 space-y-4">
                <div className="flex justify-between text-cream/80">
                  <span>Subtotal</span>
                  <span className="text-gold font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <p className="text-xs text-cream/50">Complimentary shipping on every order.</p>
                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className="btn-gold w-full rounded-full py-3 text-center block"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/CartContext";

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, hydrated } = useCart();

  if (hydrated && items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 pt-24">
        <h1 className="font-serif text-4xl">Your cart is empty</h1>
        <p className="text-cream/55 mt-3">Every great scent begins with a single choice.</p>
        <Link href="/products" className="btn-gold rounded-full px-8 py-3 mt-8">
          Explore the Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 mx-auto max-w-5xl px-6">
      <h1 className="font-serif text-5xl mb-10">Your <span className="text-shimmer">Selection</span></h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.slug}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 40 }}
                className="glass rounded-2xl p-4 flex gap-5 items-center"
              >
                <div className="h-24 w-20 rounded-xl bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${item.image})` }} />
                <div className="flex-1">
                  <Link href={`/products/${item.slug}`} className="font-serif text-2xl hover:text-gold">{item.name}</Link>
                  <p className="text-gold">${item.price}</p>
                </div>
                <div className="flex items-center border border-gold/30 rounded-full">
                  <button onClick={() => updateQty(item.slug, item.qty - 1)} className="px-3 py-1.5 text-gold">−</button>
                  <span className="w-8 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.slug, item.qty + 1)} className="px-3 py-1.5 text-gold">+</button>
                </div>
                <div className="w-20 text-right font-serif text-xl">${(item.price * item.qty).toFixed(0)}</div>
                <button onClick={() => removeItem(item.slug)} className="text-cream/40 hover:text-rose text-xl">×</button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="glass-strong rounded-2xl p-7 h-fit">
          <h2 className="font-serif text-2xl mb-5">Summary</h2>
          <div className="flex justify-between text-cream/80 mb-2">
            <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-cream/80 mb-4">
            <span>Shipping</span><span className="text-gold">Free</span>
          </div>
          <div className="border-t border-gold/20 pt-4 flex justify-between text-xl font-serif">
            <span>Total</span><span className="text-gold">${subtotal.toFixed(2)}</span>
          </div>
          <Link href="/checkout" className="btn-gold w-full rounded-full py-3.5 mt-6 block text-center">
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/CartContext";
import { useAuth } from "@/components/AuthContext";

export default function CheckoutPage() {
  const { items, subtotal, clear, hydrated } = useCart();
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", city: "", notes: "",
  });
  const [payment, setPayment] = useState("cod");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [placed, setPlaced] = useState(null);

  useEffect(() => {
    if (user) setForm((f) => ({ ...f, name: f.name || user.name, email: f.email || user.email }));
  }, [user]);

  function set(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function placeOrder(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: form, items, paymentMethod: payment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");
      clear();
      setPlaced({ ...data.order, paymentMethod: payment });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Confirmation screen
  if (placed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full glass-strong rounded-3xl p-10 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="mx-auto h-20 w-20 rounded-full bg-gold/20 border border-gold flex items-center justify-center text-4xl text-gold mb-6"
          >
            ✓
          </motion.div>
          <h1 className="font-serif text-4xl">Merci beaucoup.</h1>
          <p className="text-cream/70 mt-3">
            Your order <span className="text-gold">#{placed.id.slice(-6).toUpperCase()}</span> is confirmed.
          </p>
          <div className="glass rounded-2xl p-5 mt-6 text-left text-sm text-cream/75 space-y-1">
            <div className="flex justify-between"><span>Total</span><span className="text-gold">${placed.total.toFixed(2)}</span></div>
            <div className="flex justify-between">
              <span>Payment</span>
              <span>{placed.paymentMethod === "cod" ? "Cash on Delivery" : "Card (pending)"}</span>
            </div>
          </div>
          {placed.paymentMethod === "card" && (
            <p className="text-xs text-rose/90 mt-4">
              Card payments are being set up — our concierge will email you a secure
              payment link shortly to complete this order.
            </p>
          )}
          <p className="text-cream/60 text-sm mt-5">
            We've sent a confirmation to {form.email || "your email"}.
          </p>
          <Link href="/products" className="btn-gold rounded-full px-8 py-3 mt-7 inline-block">
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  if (hydrated && items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 pt-24">
        <h1 className="font-serif text-4xl">Nothing to check out yet</h1>
        <Link href="/products" className="btn-gold rounded-full px-8 py-3 mt-8">Explore the Collection</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 mx-auto max-w-6xl px-6">
      <h1 className="font-serif text-5xl mb-3">Checkout</h1>
      {!user && (
        <p className="text-cream/55 mb-8 text-sm">
          Checking out as a guest.{" "}
          <Link href="/login" className="text-gold hover:underline">Sign in</Link> to save your order history.
        </p>
      )}

      <form onSubmit={placeOrder} className="grid lg:grid-cols-3 gap-8">
        {/* DETAILS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-2xl p-6">
            <h2 className="font-serif text-2xl mb-5">Delivery Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full Name" value={form.name} onChange={(v) => set("name", v)} />
              <Field label="Phone" value={form.phone} onChange={(v) => set("phone", v)} />
              <Field label="Email" type="email" value={form.email} onChange={(v) => set("email", v)} />
              <Field label="City" value={form.city} onChange={(v) => set("city", v)} />
              <div className="sm:col-span-2">
                <Field label="Address" value={form.address} onChange={(v) => set("address", v)} />
              </div>
              <div className="sm:col-span-2">
                <Field label="Order Notes (optional)" value={form.notes} onChange={(v) => set("notes", v)} required={false} />
              </div>
            </div>
          </div>

          {/* PAYMENT */}
          <div className="glass rounded-2xl p-6">
            <h2 className="font-serif text-2xl mb-5">Payment Method</h2>
            <div className="space-y-3">
              <PaymentOption
                active={payment === "cod"}
                onClick={() => setPayment("cod")}
                title="Cash on Delivery"
                desc="Pay in cash when your fragrance arrives."
                icon="💵"
              />
              <PaymentOption
                active={payment === "card"}
                onClick={() => setPayment("card")}
                title="Credit / Debit Card"
                desc="Secure card checkout — being configured, you'll receive a payment link."
                icon="💳"
              />
            </div>

            <AnimatePresence>
              {payment === "card" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="glass-strong rounded-xl p-4 mt-4 text-sm text-cream/70">
                    <p className="text-gold mb-2">Card gateway coming soon</p>
                    Place your order now and our concierge will send a secure link to
                    complete payment. No card details are collected here yet.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="glass-strong rounded-2xl p-7 h-fit lg:sticky lg:top-28">
          <h2 className="font-serif text-2xl mb-5">Order Summary</h2>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {items.map((i) => (
              <div key={i.slug} className="flex gap-3 items-center">
                <div className="h-12 w-10 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${i.image})` }} />
                <div className="flex-1 text-sm">
                  <p className="text-cream/90 leading-tight">{i.name}</p>
                  <p className="text-cream/50">×{i.qty}</p>
                </div>
                <span className="text-sm text-gold">${(i.price * i.qty).toFixed(0)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gold/20 mt-5 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-cream/80"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-cream/80"><span>Shipping</span><span className="text-gold">Free</span></div>
            <div className="flex justify-between text-xl font-serif pt-2"><span>Total</span><span className="text-gold">${subtotal.toFixed(2)}</span></div>
          </div>

          {error && <p className="text-rose text-sm mt-4">{error}</p>}

          <button disabled={loading} className="btn-gold w-full rounded-full py-3.5 mt-6 disabled:opacity-60">
            {loading ? "Placing order…" : payment === "cod" ? "Place Order" : "Place Order · Pay Later"}
          </button>
          <p className="text-xs text-cream/40 text-center mt-3">
            By ordering you agree to our terms. Free returns within 14 days.
          </p>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required = true }) {
  return (
    <label className="block">
      <span className="text-xs uppercase-spaced text-cream/60">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="mt-2 w-full bg-white/5 border border-gold/25 rounded-xl px-4 py-3 text-cream placeholder-cream/30 focus:border-gold focus:outline-none transition-colors"
      />
    </label>
  );
}

function PaymentOption({ active, onClick, title, desc, icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-xl p-4 border transition-all flex gap-4 items-center ${
        active ? "border-gold bg-gold/10" : "border-gold/20 hover:border-gold/50"
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <p className="font-medium text-cream">{title}</p>
        <p className="text-xs text-cream/55">{desc}</p>
      </div>
      <span className={`h-5 w-5 rounded-full border-2 ${active ? "border-gold bg-gold" : "border-gold/40"}`} />
    </button>
  );
}

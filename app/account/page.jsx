"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthContext";

const STATUS_LABELS = {
  confirmed: "Confirmed",
  pending: "Pending",
  awaiting_payment: "Awaiting Payment",
  shipped: "Shipped",
};

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      fetch("/api/orders", { cache: "no-store" })
        .then((r) => r.json())
        .then((d) => setOrders(d.orders || []))
        .finally(() => setFetching(false));
    }
  }, [user]);

  if (loading || !user) {
    return <div className="min-h-[60vh] flex items-center justify-center text-cream/50 pt-24">Loading…</div>;
  }

  return (
    <div className="pt-32 pb-20 mx-auto max-w-4xl px-6">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="uppercase-spaced text-xs text-gold/70 mb-2">My Account</p>
          <h1 className="font-serif text-5xl">Bonjour, <span className="text-shimmer">{user.name.split(" ")[0]}</span></h1>
          <p className="text-cream/55 mt-2">{user.email}</p>
        </div>
        <button onClick={() => { logout(); router.push("/"); }} className="btn-ghost rounded-full px-5 py-2 text-sm">
          Sign out
        </button>
      </div>

      <h2 className="font-serif text-2xl mb-5">Your Orders</h2>

      {fetching ? (
        <p className="text-cream/50">Fetching your orders…</p>
      ) : orders.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <p className="text-cream/60">You haven't placed any orders yet.</p>
          <Link href="/products" className="btn-gold rounded-full px-7 py-3 mt-6 inline-block">Discover the Collection</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o, i) => (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-cream">Order #{o.id.slice(-6).toUpperCase()}</p>
                  <p className="text-xs text-cream/50">{new Date(o.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="text-xs glass-strong rounded-full px-3 py-1 text-gold">
                  {STATUS_LABELS[o.status] || o.status}
                </span>
              </div>
              <div className="flex gap-2 mt-4 flex-wrap">
                {o.items.map((it) => (
                  <span key={it.slug} className="text-xs text-cream/65 glass rounded-full px-3 py-1">
                    {it.name} ×{it.qty}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gold/15">
                <span className="text-cream/55 text-sm">
                  {o.paymentMethod === "cod" ? "Cash on Delivery" : "Card"}
                </span>
                <span className="font-serif text-xl text-gold">${o.total.toFixed(2)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

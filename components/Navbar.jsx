"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const { count, setOpen } = useCart();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? "glass-strong py-3" : "py-5 bg-transparent"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-5 flex items-center justify-between">
          <Link href="/" className="group">
            <div className="leading-none">
              <div className="font-serif text-2xl tracking-wide text-shimmer">
                Maison Lumière
              </div>
              <div className="uppercase-spaced text-[9px] text-gold/70 mt-1">
                Parfums · Paris
              </div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm text-cream/80">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <Link href="/products" className="hover:text-gold transition-colors">Collection</Link>
            <Link href="/#story" className="hover:text-gold transition-colors">The Maison</Link>
            {user ? (
              <Link href="/account" className="hover:text-gold transition-colors">My Account</Link>
            ) : null}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="hidden sm:flex items-center gap-3 text-xs text-cream/70">
                <span className="text-gold/90">Bonjour, {user.name.split(" ")[0]}</span>
                <button onClick={logout} className="hover:text-gold transition-colors underline-offset-4 hover:underline">
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline text-xs uppercase-spaced text-cream/80 hover:text-gold transition-colors"
              >
                Sign in
              </Link>
            )}

            <button
              onClick={() => setOpen(true)}
              className="relative rounded-full border border-gold/40 p-2.5 hover:border-gold transition-colors"
              aria-label="Open cart"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1.5 -right-1.5 bg-gold text-ink text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              onClick={() => setMenu((m) => !m)}
              className="md:hidden text-gold p-1"
              aria-label="Menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {menu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-6 py-4 flex flex-col gap-4 text-cream/85">
                <Link href="/" onClick={() => setMenu(false)}>Home</Link>
                <Link href="/products" onClick={() => setMenu(false)}>Collection</Link>
                <Link href="/#story" onClick={() => setMenu(false)}>The Maison</Link>
                {user ? (
                  <>
                    <Link href="/account" onClick={() => setMenu(false)}>My Account</Link>
                    <button className="text-left" onClick={() => { logout(); setMenu(false); }}>Sign out</button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setMenu(false)}>Sign in</Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <CartDrawer />
    </>
  );
}

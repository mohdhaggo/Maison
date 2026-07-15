"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setDone(true);
    setEmail("");
    setTimeout(() => setDone(false), 3000);
  }

  return (
    <form onSubmit={submit} className="mt-4">
      <div className="flex items-center rounded-full border border-gold/40 overflow-hidden bg-plum/40 focus-within:border-gold transition-colors">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          aria-label="Email for newsletter"
          className="flex-1 bg-transparent px-5 py-3 text-sm text-cream placeholder:text-taupe outline-none"
        />
        <button type="submit" className="btn-champagne px-6 py-3 text-xs uppercase-spaced">
          Join
        </button>
      </div>
      <p className="text-[11px] mt-2 h-4" style={{ color: done ? "#C9A96E" : "transparent" }}>
        Welcome to the Maison. Check your inbox.
      </p>
    </form>
  );
}

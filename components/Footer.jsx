import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative z-10 mt-32 border-t border-gold/15">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-serif text-3xl text-shimmer">Maison Lumière</div>
          <p className="text-cream/60 mt-4 max-w-sm leading-relaxed">
            Fragrance is memory you can wear. Each Maison Lumière creation is
            composed in Paris from the world's rarest materials — bottled emotion,
            made to be remembered.
          </p>
        </div>
        <div>
          <h4 className="uppercase-spaced text-xs text-gold/70 mb-4">Explore</h4>
          <ul className="space-y-2 text-cream/70 text-sm">
            <li><Link href="/products" className="hover:text-gold">The Collection</Link></li>
            <li><Link href="/#story" className="hover:text-gold">Our Story</Link></li>
            <li><Link href="/login" className="hover:text-gold">Sign In</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="uppercase-spaced text-xs text-gold/70 mb-4">Care</h4>
          <ul className="space-y-2 text-cream/70 text-sm">
            <li>Free shipping &amp; returns</li>
            <li>Cash on delivery available</li>
            <li>concierge@maisonlumiere.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gold/10 py-6 text-center text-xs text-cream/40">
        © {new Date().getFullYear()} Maison Lumière. Crafted with devotion.
      </div>
    </footer>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <p className="uppercase-spaced text-xs text-gold/70 mb-4">404</p>
      <h1 className="font-serif text-5xl">This scent has drifted away.</h1>
      <p className="text-cream/55 mt-3">The page you're looking for doesn't exist.</p>
      <Link href="/" className="btn-gold rounded-full px-8 py-3 mt-8">Return Home</Link>
    </div>
  );
}

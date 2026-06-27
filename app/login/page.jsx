"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/account");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-strong rounded-3xl p-9"
      >
        <h1 className="font-serif text-4xl text-center">Welcome <span className="text-shimmer">Back</span></h1>
        <p className="text-cream/55 text-center text-sm mt-2 mb-8">
          Your stories are waiting for you.
        </p>

        {error && (
          <div className="bg-rose/15 border border-rose/40 text-rose text-sm rounded-xl px-4 py-3 mb-5">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
          <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
          <button disabled={loading} className="btn-gold w-full rounded-full py-3.5 mt-2 disabled:opacity-60">
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-cream/60 text-sm mt-6">
          New to the Maison?{" "}
          <Link href="/signup" className="text-gold hover:underline">Create an account</Link>
        </p>
        <p className="text-center text-cream/40 text-xs mt-4">
          <Link href="/products" className="hover:text-gold">Continue as guest →</Link>
        </p>
      </motion.div>
    </div>
  );
}

function Field({ label, type, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-xs uppercase-spaced text-cream/60">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="mt-2 w-full bg-white/5 border border-gold/25 rounded-xl px-4 py-3 text-cream placeholder-cream/30 focus:border-gold focus:outline-none transition-colors"
      />
    </label>
  );
}

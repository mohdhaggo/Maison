"use client";

import { CartProvider } from "@/components/CartContext";
import { AuthProvider } from "@/components/AuthContext";

export function Providers({ children }) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
}

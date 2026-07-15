/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark Luxe Cinematic palette
        ink: "#0A0A0A",        // near black (primary bg)
        noir: "#0A0A0A",
        plum: "#1A1A1A",       // dark charcoal (secondary bg)
        charcoal: "#1A1A1A",
        wine: "#241a0e",       // warm charcoal for gradients
        gold: "#C9A96E",       // warm gold accent
        goldlight: "#E8D5A3",  // champagne
        champagne: "#E8D5A3",
        amber: "#D4881C",      // liquid amber glow
        brightgold: "#FFD700", // CTA highlight
        rose: "#E8A0BF",       // heart-note accent
        amethyst: "#8a6a30",   // muted bronze (legacy gradient use)
        teal: "#1f6f6b",
        cream: "#F5F0E8",      // warm white (text primary)
        taupe: "#8A8278",      // muted taupe (text secondary)
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        glowpulse: {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(201,169,110,0.0)" },
          "50%": { boxShadow: "0 0 40px 4px rgba(201,169,110,0.35)" },
        },
        scrolldot: {
          "0%": { transform: "translateY(0)", opacity: "0" },
          "30%": { opacity: "1" },
          "100%": { transform: "translateY(26px)", opacity: "0" },
        },
      },
      animation: {
        shimmer: "shimmer 6s linear infinite",
        float: "float 6s ease-in-out infinite",
        glowpulse: "glowpulse 3s ease-in-out infinite",
        scrolldot: "scrolldot 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

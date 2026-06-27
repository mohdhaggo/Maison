# Maison Lumière — Luxury Perfume E-commerce

An animated, full-stack perfume storefront built with **Next.js 14**, **Tailwind CSS**,
**Framer Motion**, and a real auth + orders backend (**Prisma + SQLite**).

## Features

- 🎬 Cinematic animations throughout (parallax hero, floating orbs, motion product cards, animated product pages)
- 🧴 8 perfumes, each with a dedicated animated page, emotional story, and full ingredient breakdown (top / heart / base notes)
- 🔐 Real authentication — register / login with hashed passwords (bcrypt) and JWT httpOnly cookie sessions
- 🛍️ Guest checkout — no account required to buy
- 🛒 Persistent cart (localStorage) with slide-out drawer
- 💳 Payment: **Cash on Delivery** (live) and **Card** (placeholder — order is saved as `awaiting_payment` until you wire a gateway)
- 📦 Order history for logged-in users

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Create the database (SQLite) and generate the Prisma client
npm run db:setup

# 3. Run the dev server
npm run dev
```

Then open http://localhost:3000

## Wiring up real card payments later

Card orders are currently saved with status `awaiting_payment`. To add Stripe:

1. `npm install stripe @stripe/stripe-js`
2. Create a `POST /api/checkout/stripe` route that creates a Checkout Session from the cart.
3. In `app/checkout/page.jsx`, when `payment === "card"`, redirect to the Stripe session URL instead of saving directly.
4. Add a Stripe webhook to flip the order status to `confirmed` on payment success.

Your secret keys go in `.env` (already gitignored).

## Project structure

```
app/
  page.jsx              Home (hero + featured + story)
  products/             Collection grid + [slug] detail pages
  cart/ checkout/       Cart + checkout (COD / Card)
  login/ signup/ account/   Auth + order history
  api/auth/*            register / login / logout / me
  api/orders            create + list orders
components/             Navbar, Footer, ProductCard, CartDrawer, ProductDetail, contexts
lib/                    db (prisma), auth (jwt), products (catalog data)
prisma/schema.prisma    User + Order models
```

## Notes

- Product imagery is loaded from Unsplash (needs internet on first load).
- Change `AUTH_SECRET` in `.env` before deploying anywhere.

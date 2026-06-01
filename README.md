# Vivero Chiriquí — Frontend

Mobile-first digital catalog UI for Vivero Chiriquí. Built with **Next.js 14 (App Router)**, **TypeScript**, **TailwindCSS**, and **next-intl**.

## Quick start

```bash
# 1. Install
npm install

# 2. Configure environment
cp .env.example .env.local
#   NEXT_PUBLIC_API_URL=http://localhost:4000
#   NEXT_PUBLIC_WHATSAPP_PHONE=50760000000

# 3. Run dev server
npm run dev
```

Open `http://localhost:3000`.

## Highlights

- **Mobile-first**: bottom navigation, sticky CTAs, large tap targets, optimized image loading via `next/image`.
- **WhatsApp flow**: the request list builds a friendly multilingual message and opens `wa.me/<phone>?text=...`.
- **Wholesale access**: password-only flow (`/wholesale/login`) issues a JWT stored client-side; the backend reveals `wholesale_price` only when the token is present.
- **Retail / wholesale display rules**: ProductCard shows crossed-out retail price next to the wholesale price when wholesale mode is active.
- **i18n**: Spanish (default) + English using `next-intl`. Toggle via the in-app language switcher; URLs use `as-needed` prefixes (`/` for ES, `/en/...` for EN).
- **Admin panel** (`/admin`): mobile-friendly product CRUD, image uploads (auto-WebP), category management, stock/featured toggles.

## Project layout

```
src/
  app/
    [locale]/                 # All locale-aware routes
      page.tsx                # Home
      catalog/page.tsx        # Catalog with categories + filters
      product/[id]/page.tsx   # Product detail
      list/page.tsx           # Request list (cart-as-quote)
      wholesale/login/        # Password-only wholesale access
      admin/                  # Admin panel (login + CRUD)
      contact/page.tsx
      layout.tsx              # Root layout (i18n provider)
      not-found.tsx
  components/                 # Reusable UI
    Header, BottomNav, ProductCard, ...
    admin/AdminShell.tsx
  views/                      # Page-level client views
  lib/
    api.ts                    # Typed REST client
    types.ts
    cart-store.ts             # Zustand cart with persistence
    auth-store.ts             # Wholesale + admin tokens
    whatsapp.ts               # Quote message generator
    format.ts                 # Currency formatter, cn helper
  i18n/                       # next-intl config + request loader
  messages/{es,en}.json
  middleware.ts               # next-intl locale routing
```

## Environment variables

| Variable                       | Description                                          |
| ------------------------------ | ---------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`          | Base URL of the backend API.                         |
| `NEXT_PUBLIC_WHATSAPP_PHONE`   | International phone number for WhatsApp quotes.      |
| `NEXT_PUBLIC_BUSINESS_EMAIL`   | Email shown in the contact panel.                    |

## Deployment notes

- Production build: `npm run build && npm start` (or deploy to Vercel — the App Router and `next-intl` middleware are fully compatible).
- Image optimization: configure `next.config.mjs > images.remotePatterns` to allow your CDN/storage origin.
- For multi-region SEO, the locale prefix strategy can be flipped to `'always'` in `src/middleware.ts`.

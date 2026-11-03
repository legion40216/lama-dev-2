# Garment Store

Next.js 16 (App Router, Cache Components) + Tailwind v4 + shadcn/ui (Base UI) + zustand.

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint     # biome
npx tsc --noEmit
```

## Routes

| Route | Status |
| --- | --- |
| `/` | done – hero, category tabs, first 8 products |
| `/products` | done – filters (category, size, price, in stock, featured), sort, search `?q=` |
| `/categories` | done – category tabs + the same listing |
| `/products/[slug]` | **todo** – product cards already link here (`getProductBySlug` is ready) |
| `/checkout` | **todo** – the cart and quick view already link here |

State lives in the URL (`?category=hoodies&size=M&minPrice=20`) and is validated in `src/schema`.
Anything invalid falls back to a default, so a hand-edited URL never breaks the page.

## Product data (`src/data/data.ts`)

```ts
{
  id: "5",
  slug: "classic-fleece-hoodie",          // unique, used in the URL
  name, description,
  category: "hoodies",                    // must be a slug from src/data/categories.ts
  colors: [                               // defined once; first colour = card image
    { name: "Black", code: "#2b2f33", image: "/assets/products/5bl.png" },
  ],
  sizes: [
    {
      size: "M",                          // must exist in src/data/sizes.ts
      price: 39.99,
      discount: 4,                        // amount off (not %), omit for none
      stock: { Black: 18, Orange: 10 },   // keys must be colour names
    },                                    //   0 = sold out, key missing = not made in this size
  ],
  isNew, isFeatured, isArchived,          // archived products are hidden everywhere
  createdAt: "2024-06-10T14:20:00Z",
}
```

**Adding a category:** add it to `src/data/categories.ts` (pick a lucide icon). The tabs, sidebar
filter and URL validation all follow.
**Adding a size** (e.g. `"XXL"` or `"One Size"`): add it to `src/data/sizes.ts` first.

Prices are plain dollars (`19.99`). Convert to integer cents when you wire up payments.

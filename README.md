# Pronto Receipts (POC)

A clickable proof of concept of the Pronto order-history and receipt flow,
built from the design handoff in `docs/design/`. There is no backend: **every
order, the profile and the payment methods come from one file,
`data/app-data.json`.**

## Screens
Home (map) → side drawer → My Trips → Order Summary → Itemized Receipt, plus
Order Again (with the "added to cart" confirmation), Help → Message History,
My Profile and Payment Methods. Buttons that would need a real backend show a
"coming soon" toast.

## Changing the data
Edit `data/app-data.json` (or send the details to Claude and have it edited),
then rebuild:

```sh
npm install      # once
npm run check    # checks the data and lists any problems
npm run build    # writes dist/index.html (open it in a browser) and dist/artifact.html
```

### An order (the comments are explanations; leave them out of the real file)
```jsonc
{
  "id": "wings-burger",                 // any unique short name
  "merchant": "Wings Burger Bar",
  "status": "Completed",                // "Completed" (green) or "Canceled" (red)
  "date": "2025-10-12T22:10",           // year-month-day T hour:minute (24h)
  "orderId": "5764644957201640012",     // keep the quotes
  "items": [
    { "qty": 1, "name": "Combo Alitas BBQ 12 unidades", "price": 4200 }
  ],
  "deliveryFee": 561,
  "deliveryCoupon": 0,                  // shown as a negative line and "You saved"
  "serviceFee": 200,
  "tip": 0,                             // the Tip line only shows when above 0
  "payment": { "type": "mastercard", "last4": "2341" },   // "visa", "mastercard" or "cash"
  "banner": "images/wings.jpg"          // optional, a file in data/images/
}
```

- `price` is the **line total** as printed on the receipt (2 × ₡450 → `900`).
- Totals are calculated: items + (delivery fee − coupon) + service fee + tip.
- Orders are listed newest first, whatever their order in the file.
- More than 8 items turns on "Show more" on the Order Summary.
- Amounts are whole colones. Change `"currency"` at the top to use another symbol.

### Images (optional)
Put files in `data/images/` and reference them by path. They are embedded into
the built page. Supported fields: `profile.avatar`, each order's `banner`, and
`images.homeHero`. Without images the app uses drawn placeholders.

## Layout
| Path | What it is |
|---|---|
| `data/app-data.json` | All data shown in the app |
| `src/model.js` | Totals, money and date formatting, data validation |
| `src/screens.jsx` | The screens |
| `src/app.jsx` | Navigation stack and startup |
| `src/styles.css` | Design tokens and styles from the handoff |
| `scripts/build.mjs` | Validates data, embeds images, bundles to `dist/` |
| `docs/design/` | The original design handoff (open `Receipt.html`) |

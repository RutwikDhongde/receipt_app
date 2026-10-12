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
                 # (or use npm run phone to see it on your iPhone, see below)
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

## Run it on your iPhone (Expo Go)
The `mobile/` folder is a small Expo app that shows the page full-screen, so you
can try it on a real iPhone and watch it update while you edit the data.

**Once:** install [Node.js](https://nodejs.org) (LTS) and Git on your computer,
**Expo Go** from the App Store on your iPhone, and download this repository
(`git clone`, or *Code → Download ZIP* on GitHub). Keep the phone and the
computer on the same Wi-Fi.

**Each time:** in a terminal, inside the repository folder:
```sh
npm install      # the first time, and after pulling new code
npm run phone    # the first run also installs the iPhone app's packages
```
1. A QR code appears in the terminal. Scan it with the iPhone **Camera** app
   and tap the banner; the app opens in Expo Go.
2. Edit `data/app-data.json` and save. The phone reloads within a few seconds.
   If the file has a mistake, the terminal says what is wrong and the phone
   keeps the last good version until you fix it.
3. Press **Ctrl+C** in the terminal to stop.

If Expo Go says it cannot connect (some office or public Wi-Fi blocks it), stop
it and run `npm run phone -- --tunnel` instead.

## Layout
| Path | What it is |
|---|---|
| `data/app-data.json` | All data shown in the app |
| `src/model.js` | Totals, money and date formatting, data validation |
| `src/screens.jsx` | The screens |
| `src/app.jsx` | Navigation stack and startup |
| `src/styles.css` | Design tokens and styles from the handoff |
| `scripts/build.mjs` | Validates data, embeds images, bundles to `dist/` and `mobile/app-html.js` |
| `scripts/phone.mjs` | `npm run phone`: rebuilds on every change and starts Expo |
| `mobile/` | The Expo (iPhone) app that shows the built page |
| `docs/design/` | The original design handoff (open `Receipt.html`) |

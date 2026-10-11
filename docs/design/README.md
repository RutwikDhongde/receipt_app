# Handoff: Food-Delivery Order & Receipt Flow

## Overview
A mobile (iOS/Android-style) flow for a food/grocery delivery app, covering:
map landing → side drawer → order history → order summary → itemized receipt,
plus reorder, help, profile, and payment-methods screens. The user can browse
past orders, view a per-order summary and a full cost breakdown, re-order, get
help, and manage profile/payment.

> ⚠️ **Branding note:** These screens were modeled on the *flow structure* of a
> well-known delivery app, but deliberately implemented as an **original,
> neutrally-branded app**. The placeholder brand is **"Pronto"** (a single
> constant — rename freely). Do not reintroduce another company's name, logo,
> mascot, or proprietary visual identity. Use your own brand system.

## About the Design Files
The files in this bundle are **design references created in HTML/React (via
in-browser Babel)** — prototypes showing intended look and behavior, **not**
production code to ship directly. The task is to **recreate these designs in the
target codebase's environment** (React Native, SwiftUI, Flutter, a web app,
etc.) using its established components, navigation, and styling patterns. If no
codebase exists yet, pick the framework that best fits the product (for a real
phone app, React Native or SwiftUI/Jetpack Compose) and implement there.

The HTML uses a hand-rolled screen-stack "navigator" and a custom `<image-slot>`
web component purely so the prototype runs standalone in a browser — replace
both with the platform's real navigation stack and image components.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, iconography, transitions,
and copy are all specified below and should be recreated faithfully. The one
exception: illustrations/photography are represented by drop-in placeholders
(`<image-slot>`) — supply real art in implementation.

---

## Design Tokens

### Colors
| Token | Hex | Usage |
|---|---|---|
| Ink (text) | `#16161a` | Primary text, dark icons |
| Muted | `#9a9aa2` | Secondary text, captions, chevrons-on-dark |
| Hairline | `#ededf0` | 1px dividers / row borders |
| Pill bg | `#f0f0f3` | Quantity chips, section backgrounds, list bg |
| Pill ink | `#6f6f78` | Quantity chip text |
| Green (success) | `#07b15f` | "Completed" status, copied confirmation, success check |
| Red (alert) | `#e0463a` | "Canceled" status, "Unverified" flag, Delete Account |
| Accent (default) | `#ff7a08` | Primary buttons, active tab underline, discounts, links. **Themeable** (see Tweaks) |
| Map base | `#e7eae6` | Schematic map background |
| Cream banner | `#f4e3c1` | Itemized-receipt header background |
| Map water | `#c2d9ea` | River on map |
| Map park | `#d7e6cd` | Park blobs on map |

Per-merchant accent "tints" used for list thumbnails & order-summary banners:
`#6a1f9c`, `#b5471f`, `#1f6f8b`, `#2f7d4f` (purely decorative; replace with real
merchant imagery).

Primary-button gradient (derived from accent):
`linear-gradient(95deg, lighten(accent,~26%) 0%, accent 60%, darken-warm(accent) 100%)`
with shadow `0 8px 18px rgba(accent, .36)`.

### Typography
- **Family:** `DM Sans` (UI). `DM Mono` used only for tabular amounts in the
  itemized receipt's line items. Swap for the codebase's system/brand font; DM
  Sans ≈ any geometric humanist sans (system-ui is an acceptable fallback).
- **Scale (px / weight / tracking):**
  | Role | Size | Weight | Letter-spacing |
  |---|---|---|---|
  | Screen title (large, e.g. "My Trips", "My Profile") | 28 | 800 | -0.5 |
  | Home headline / "Thank you" header | 30 / 28 | 800 | -0.7 / -0.6 |
  | Order-summary merchant name | 27 | 700 | -0.4 |
  | Nav-header title (centered) | 18 | 700 | -0.2 |
  | Section heading ("Ordered Item(s)") | 21 | 700 | -0.2 |
  | Item name / row label | 16–17 | 600–700 | -0.1 |
  | Body / values | 15–16 | 500–600 | — |
  | Caption / meta / labels | 13–14.5 | 500 | — |
  | Big total amount | 30 | 800 | -0.6 |
- **Minimum body size:** 13px. Hit targets ≥ 44px.

### Spacing & Radii
- Screen horizontal padding: **22–24px**.
- Card/sheet radius: **22–26px** (top corners on bottom sheets).
- Inner card radius: **14–16px**; chips/buttons: **7–14px**; pills: full.
- Row vertical padding: **14–20px**. Dividers: 1px `#ededf0`.
- Button height: **58px**, radius **14px**.
- Top safe-area spacer: **44px** (reserve for the OS status bar — the prototype
  draws an empty bar here; the real OS status bar occupies it).

### Shadows
- Floating map chips: `0 3px 12px rgba(0,0,0,.14)`
- Bottom sheet / card: `0 -10px 30px rgba(0,0,0,.12)` / `0 8px 24px rgba(0,0,0,.08)`
- Drawer: `14px 0 40px rgba(0,0,0,.18)`

### Motion
- Screen push/pop: **280ms / 260ms**, easing `cubic-bezier(.32,.72,.34,1)`
  (enter) and `cubic-bezier(.4,0,.6,1)` (exit). Incoming screen slides in from
  the right with a left-edge shadow; back pops it out to the right. (Themeable:
  "Slide" vs "Instant".)
- Drawer: slide-in from left **300ms** same easing; scrim fade **280ms**.
- Accordion / collapse: height+opacity **280ms** ease.
- Success check: scale-in pop `cubic-bezier(.2,1.3,.4,1)` 400ms.
- Toasts: fade+rise 200ms, auto-dismiss ~1.7s.

---

## Screens / Views

Canvas is a single phone frame **445 × 942** (design width 445; scale to device).
Navigation is a **push/pop stack**; "Home" is the root. Back/Close pops.

### 1. Home (root)
- **Purpose:** App landing / map. Entry to the side drawer.
- **Layout:** Full-bleed schematic map (`#e7eae6` with white roads, river, park
  blobs, building blocks) filling the screen. Floating round chips: hamburger
  (top-left, 46px), scan (top-right, 46px), both white with shadow. "Safety
  Toolkit" pill below the hamburger (white, blue shield icon, 15px/700 label).
  A location pin (blue dot, white ring) near center. A bottom sheet card
  (rounded top 26px, padding 30/26) holds: a centered hero **illustration
  placeholder** (image-slot, ~180px tall, horizontally centered), a left-aligned
  headline **"Pronto isn't available in your area yet"** (30/800), and a
  full-width primary button **"Enter Address"**.
- **Interactions:** Hamburger → opens side drawer. Scan / Safety Toolkit /
  Enter Address → toast ("… — coming soon") placeholders.

### 2. Side Drawer (overlay on Home)
- **Purpose:** Primary navigation menu.
- **Layout:** Left drawer, **80% width (max 340px)**, white, right corners
  rounded 24px, slides over a dimmed scrim (`rgba(20,20,26,.4)`). Header band
  (subtle gray gradient `#eef0f3→#f7f8fa`, top padding 64px) with user name
  **"Rutwik Dhongde"** (21/800), "Edit Personal Info ›" (13.5/600 muted), and a
  circular avatar (58px, image-slot). The whole header is tappable.
  Menu items (each: 26px colored icon + 17/600 label, 15px vertical padding,
  hover bg `#f5f5f7`):
  - My Trips (orange book) · Payment (green wallet) · Help (indigo headset) ·
    Messages (green chat) · Safety Center (blue shield) · Settings (blue gear)
  - — divider —
  - Invite Friends (orange gift) · Discounts (green ticket) · Scan (orange scan)
- **Interactions:** Header → **My Profile**. My Trips → **My Trips**. Payment →
  **Payment Methods**. Help → **Help**. Others → toast. Scrim tap / item tap
  closes the drawer (180ms before navigating).

### 3. My Trips
- **Purpose:** Order history.
- **Layout:** Top: Close (✕) button, title **"My Trips"** (28/800). Segmented
  tabs **Ride | Food** (18px; active = accent color + 64px accent underline).
  Body on gray (`#f0f0f3`). "history" label (14/500 muted). Each order is a
  white card (padding 18/22, 10px gap between):
  - Row 1: kind **"Delivery"** (15/600) · status right-aligned with chevron
    ("Completed" gray `#6b6b73`, "Canceled" red `#e0463a`).
  - Clock icon + date/time (e.g. "15/10/2025 2:08 AM").
  - Merchant name (16/600).
  - "Total of N" and "Total ₡X,XXX" (14/500 muted).
  - "Ride" tab shows an empty state ("No rides yet").
- **Interactions:** Tap a card → **Order Summary** for that order. Close → Home.

### 4. Order Summary (the original "receipt" screen)
- **Purpose:** Per-order detail.
- **Layout:** Top **banner** (250px, merchant tint color, full-bleed
  **image-slot** for promo/store image) with a round white Back button
  (top-left) and a white "Help" pill with headset icon (top-right). A white
  sheet overlaps the banner (rounded top 22px, pulled up 22px):
  - Merchant name (27/700) with a trailing chevron.
  - Status line: colored status + muted full timestamp.
  - Divider.
  - Section header: cloche icon + **"Ordered Item(s)"** (21/700); right-aligned
    **"Show more / Show less"** toggle with rotating chevron (only if >8 items).
  - Item rows: gray **qty pill** (e.g. "x1", min 34px, radius 7) + bold item
    name (17/700). Extra items beyond 8 are collapsed (animated height).
  - Divider.
  - Total block: receipt icon + **"Total: ₡X,XXX"** (22/800) and
    **"Order ID: …"** (14.5 muted) with a copy button (turns into a green check
    + "Copied" for 1.6s).
  - Footer (fixed): primary **"Order Again"**, secondary **"View receipt"**.
- **Interactions:** Back → My Trips. Help → Help. Show more/less toggles list.
  Copy → copies Order ID. Order Again → Reorder. View receipt → Itemized Receipt.

### 5. Itemized Receipt ("Thank you")
- **Purpose:** Full cost breakdown.
- **Layout:** Cream banner (`#f4e3c1`) with Back chevron, headline **"Thank you
  for choosing Pronto Food"** (28/800), and a **3D-illustration placeholder**
  (image-slot, ~170px). White body, scrollable:
  - **Total** row: "Total" (21/800) left; big amount (30/800) right; if savings
    > 0, "You saved ₡XXX" (14/600 accent) beneath.
  - Grouped fee blocks (each separated by a 1px top border). Each block has a
    **bold head row** (label + summed amount, 17/800) and muted sub-rows
    (15px): 
    - **Food Fee** → Item Total
    - **Delivery Fee** → Delivery Fee, and "Delivery Coupons" (accent, negative
      `-₡XXX`) when a coupon applies
    - **Other Fees** → Service Fee, Tip (shown only if > 0)
  - **Payment row** (top border): card brand logo + last-4 (e.g. "•••• 2341")
    left; total amount right (18/700).
- **Interactions:** Back → Order Summary.

### 6. Reorder
- **Purpose:** Confirm adding a past order's items to cart.
- **Layout:** Nav header "Order again" + Back. Heading **"Add these items to
  your cart"** (23/800) + "From {merchant}". List of items (qty chip + name +
  mono price, hairline-separated). Fixed footer: primary **"+ Add N items ·
  ₡X,XXX"** (item subtotal).
- **Interactions:** Add → **success overlay**: green check (pop animation),
  "Added to your cart", count + merchant copy, then "Go to cart" (primary) and
  "Back to orders" (secondary → pops to Home root).

### 7. Help
- **Purpose:** Support entry.
- **Layout:** Nav header "Help" + Back. Peach hero (`#fdeee3→#fbf3ec`) with
  **"How can we help you?"** (22/700) and a support **illustration placeholder**
  (image-slot, anchored bottom-right). A white card (overlapping the hero -18px,
  shadow) with one row: chat icon + **"Message History"** (17/600) + chevron.
  Rest of screen light gray.
- **Interactions:** Message History → **Message History** screen (empty state
  "No messages yet"). Back → previous screen.

### 8. My Profile
- **Purpose:** View/edit account info.
- **Layout:** Close (✕) + title **"My Profile"** (28/800). White scroll body
  with a gray 12px gap band separating groups:
  - Avatar (78px circle, image-slot) + **"Edit Profile Picture ›"** (17/700).
  - Field rows (label 13.5 muted над value 18/700): **First Name** "Rutwik",
    **Last Name** "Dhongde".
  - Gray gap.
  - Settings rows (label 17/600, right value muted, chevron): **Mobile Number**
    "62****81"; **Email** "d***@gmail.com" + **"Unverified"** (red);
    **Password**; **Third-party Account**; **Device Management**;
    **Delete Account**.
- **Interactions:** Rows → toast placeholders. Close → previous screen.

### 9. Payment Methods
- **Purpose:** Manage payment instruments.
- **Layout:** Centered nav title **"Payment Methods"** + Back. Rows
  (logo 38px + name 18/700 + chevron, hairline-separated):
  - **Cash** (orange "$" chip)
  - **VISA •••• 7422**, **Mastercard •••• 2341**, **VISA •••• 8538**
  - **+ Credit / Debit Card** (gray plus circle) with sub "Visa/MasterCard".
- **Interactions:** Rows → toast placeholders. Back → previous screen.

---

## Interactions & Behavior (summary)
- **Navigation:** push/pop stack; root = Home. Drawer is an overlay on Home, not
  a stacked screen. "Back to orders" from Reorder success pops to root.
- **Transitions:** native-style horizontal slide (see Motion tokens).
- **Toasts:** transient placeholders for unimplemented actions.
- **Copy Order ID:** writes to clipboard, 1.6s success affirmation.
- **Show more/less, Help accordion (n/a now), success states:** animate height.
- **Responsive:** fixed 445px design; the prototype scales the frame to the
  viewport. In a real app, lay out fluidly to device width; keep the 44px top
  safe-area and the fixed bottom button docks.

## State Management
Per the prototype, state needed:
- **Navigation stack** (array of `{screen, orderId?}`), plus a transient
  "exiting" entry to animate pops.
- **Selected order** (resolved from `orderId`).
- **UI-local:** drawer open/closed; Order-Summary "show more" + "copied";
  Trips active tab (Ride/Food); Reorder "added" success; toast message.
- **Theme tweaks (optional):** accent color, transition style.
- **Data fetching:** replace the static `ORDERS`, `PROFILE`, `PAYMENTS` arrays
  with API calls (order history list, order detail, profile, payment methods).

## Data Model (recreate as API/types)
```ts
type Order = {
  id: string;
  merchant: string;
  kind: string;                 // "Delivery"
  status: "Completed" | "Canceled" | string;
  date: string;                 // display string
  orderId: string;              // long numeric, for "Order ID" + copy
  tint: string;                 // decorative; replace with merchant image
  items: { qty: string; name: string; price: number }[];
  deliveryFee: number;
  deliveryCoupon: number;       // subtracted; shown as negative if > 0
  serviceFee: number;
  tip: number;
  payment: { brand: "visa" | "mastercard" | "cash"; last4?: string };
};
// Derived: itemTotal = Σ items.price; delivery = deliveryFee - deliveryCoupon;
//          other = serviceFee + tip; total = itemTotal + delivery + other;
//          saved = deliveryCoupon (+ any extra).
type Profile  = { firstName; lastName; mobile; email; emailVerified: boolean };
type Payment  = { id; type: "cash"|"visa"|"mastercard"; last4?; label? };
```
Currency: Costa Rican colón, formatted `₡` + thousands-separated integer (no
decimals), e.g. `₡24,673`.

## Assets
- **Icons:** all inline SVG in the prototype (status/nav chevrons, headset,
  cloche, receipt, copy/check, menu, scan, shield, clock, wallet, chat, gear,
  gift, ticket, pin, card logos, plus). Recreate with the codebase's icon set
  (e.g. SF Symbols / Material / Lucide) — they're generic.
- **Card brand logos:** simple recreations (VISA wordmark, Mastercard circles,
  cash "$"). Use official brand marks per each network's brand guidelines in
  production.
- **Illustrations / photos:** **not included** — every `<image-slot>` is a
  placeholder for art you provide (home hero, order-summary banners, itemized
  3D art, help support art, avatars).
- **Map:** schematic SVG placeholder — replace with the real map SDK
  (MapKit / Google Maps / Mapbox).
- **Font:** DM Sans / DM Mono (Google Fonts) — substitute as needed.

## Files
- `Receipt.html` — entry point: design tokens (CSS), icon set, **data tables**
  (`ORDERS`, `PROFILE`, `PAYMENTS`, `BRAND`, `USER`), helpers (`colones`,
  `totals`), shared chrome (`StatusBar`, `NavHeader`), the navigation stack, and
  the Tweaks panel.
- `screens.jsx` — all screen components: `HomeScreen` (+drawer), `TripsScreen`,
  `ReceiptScreen` (order summary), `ItemizedScreen`, `ReorderScreen`,
  `HelpScreen`, `MessageHistory`, `ProfileScreen`, `PaymentScreen`.
- `tweaks-panel.jsx`, `image-slot.js` — prototype-only helpers (themeable
  controls; drag-drop image placeholder). **Do not port** — replace with the
  platform's theming and image components.

Open `Receipt.html` in a browser to interact with the reference.

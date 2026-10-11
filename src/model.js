// Pure helpers for turning app-data.json into what the screens show.
// No React here, so scripts/build.mjs can reuse validate() at build time.

export const STATUS_COLORS = { Completed: "#07b15f", Canceled: "#e0463a" };

// Decorative merchant tints, used when an order has no banner image.
const TINTS = ["#6a1f9c", "#b5471f", "#1f6f8b", "#2f7d4f"];

export function money(n, currency = "₡") {
  const sign = n < 0 ? "-" : "";
  return sign + currency + Math.round(Math.abs(n)).toLocaleString("en-US");
}

// Every item's `price` is the line total as printed on the receipt (qty already applied).
export function totals(o) {
  const itemTotal = o.items.reduce((s, it) => s + it.price, 0);
  const itemCount = o.items.reduce((s, it) => s + it.qty, 0);
  const delivery = (o.deliveryFee || 0) - (o.deliveryCoupon || 0);
  const other = (o.serviceFee || 0) + (o.tip || 0);
  const total = itemTotal + delivery + other;
  const saved = (o.deliveryCoupon || 0) + (o.saved || 0);
  return { itemTotal, itemCount, delivery, other, total, saved };
}

// "2025-10-15T02:08" -> "15/10/2025 2:08 AM". Parsed by hand so the result never
// shifts with the viewer's time zone.
export function formatDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/.exec(iso || "");
  if (!m) return iso || "";
  const [, y, mo, d, hh = "00", mm = "00"] = m;
  const h = Number(hh);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${d}/${mo}/${y} ${h12}:${mm} ${h < 12 ? "AM" : "PM"}`;
}

export function prepareOrders(orders) {
  return [...orders]
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .map((o, i) => ({
      kind: "Delivery",
      ...o,
      tint: o.tint || TINTS[i % TINTS.length],
      statusColor: STATUS_COLORS[o.status] || "#6b6b73",
      dateLabel: formatDate(o.date),
    }));
}

// Returns a list of human-readable problems; empty means the data is good.
export function validate(data) {
  const errs = [];
  const need = (cond, msg) => { if (!cond) errs.push(msg); };
  need(data && typeof data === "object", "The file must contain one JSON object.");
  if (errs.length) return errs;
  need(Array.isArray(data.orders), '"orders" must be a list.');
  need(data.profile && typeof data.profile === "object", '"profile" is missing.');
  need(Array.isArray(data.payments), '"payments" must be a list.');
  const ids = new Set();
  (data.orders || []).forEach((o, i) => {
    const at = `orders[${i}]${o && o.merchant ? ` (${o.merchant})` : ""}`;
    need(typeof o.id === "string" && o.id, `${at}: "id" is required.`);
    need(!ids.has(o.id), `${at}: id "${o.id}" is used twice.`);
    ids.add(o.id);
    need(typeof o.merchant === "string", `${at}: "merchant" is required.`);
    need(typeof o.orderId === "string", `${at}: "orderId" must be a string in quotes (it is too long for a number).`);
    need(/^\d{4}-\d{2}-\d{2}/.test(o.date || ""), `${at}: "date" must look like 2025-10-15T14:08.`);
    need(Array.isArray(o.items) && o.items.length > 0, `${at}: "items" needs at least one item.`);
    (o.items || []).forEach((it, j) => {
      need(Number.isInteger(it.qty) && it.qty > 0, `${at} item ${j + 1}: "qty" must be a whole number like 2.`);
      need(typeof it.name === "string", `${at} item ${j + 1}: "name" is required.`);
      need(typeof it.price === "number", `${at} item ${j + 1}: "price" must be a number.`);
    });
    for (const k of ["deliveryFee", "deliveryCoupon", "serviceFee", "tip"]) {
      need(o[k] === undefined || typeof o[k] === "number", `${at}: "${k}" must be a number.`);
    }
  });
  return errs;
}

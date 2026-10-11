// All flow screens, ported from the design handoff's screens.jsx.
// Data comes from data/app-data.json through AppData (see app.jsx).
import {
  Chevron, ChevDown, Back, Headset, Cloche, ReceiptIco, CopyIco, CheckIco, PlusIco,
  Menu, Scan, Shield, Close, Clock, Book, Wallet, Chat, Gear, Gift, Ticket, Pin,
  CardLogo, VisaLogo, CashLogo, PlusCircle, ChatLine,
} from "./icons.jsx";
import { HomeArt, ThankYouArt, HelpArt, Avatar } from "./art.jsx";
import { money, totals } from "./model.js";

const { useState, useRef, useLayoutEffect, useContext, createContext } = React;

export const AppData = createContext(null);
const useApp = () => useContext(AppData);

function useToast() {
  const [msg, setMsg] = useState("");
  const timer = useRef(0);
  const ping = (m) => {
    setMsg(m);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(""), 1700);
  };
  const el = <div className={"toast" + (msg ? " show" : "")} role="status">{msg}</div>;
  return [ping, el];
}
const soon = (label) => `${label} is coming soon`;

const StatusBar = () => <div className="statusbar" />;

function NavHeader({ title, onBack }) {
  return (
    <div className="navhead">
      <button className="nav-back" onClick={onBack} aria-label="Back"><Back /></button>
      <div className="nav-title">{title}</div>
      <div />
    </div>
  );
}

function PayLogo({ type }) {
  if (type === "visa") return <VisaLogo />;
  if (type === "mastercard") return <CardLogo />;
  if (type === "cash") return <CashLogo />;
  return null;
}

/* =====================  HOME  (map + side drawer)  ===================== */
function MapBg() {
  return (
    <svg className="map" viewBox="0 0 445 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="445" height="640" fill="#e7eae6" />
      <ellipse cx="80" cy="120" rx="120" ry="90" fill="#d7e6cd" opacity=".7" />
      <ellipse cx="390" cy="430" rx="130" ry="100" fill="#d7e6cd" opacity=".6" />
      <path d="M-20 250 C 120 230 160 360 300 350 S 460 300 470 320" fill="none" stroke="#c2d9ea" strokeWidth="20" strokeLinecap="round" />
      <g stroke="#d4d7d2" strokeWidth="20" fill="none" strokeLinecap="round">
        <path d="M-10 90 L 250 130 L 470 90" /><path d="M60 -10 L 110 300 L 70 660" />
        <path d="M-10 520 L 240 470 L 470 540" /><path d="M330 -10 L 360 320 L 320 660" />
      </g>
      <g stroke="#ffffff" strokeWidth="12" fill="none" strokeLinecap="round">
        <path d="M-10 90 L 250 130 L 470 90" /><path d="M60 -10 L 110 300 L 70 660" />
        <path d="M-10 520 L 240 470 L 470 540" /><path d="M330 -10 L 360 320 L 320 660" />
      </g>
      <g fill="#dde0db">
        <rect x="150" y="180" width="60" height="44" rx="5" /><rect x="230" y="190" width="48" height="40" rx="5" />
        <rect x="170" y="380" width="55" height="48" rx="5" /><rect x="250" y="400" width="60" height="40" rx="5" />
      </g>
    </svg>
  );
}

const MENU = [
  { key: "trips", label: "My Trips", Ico: Book, go: "trips" },
  { key: "payment", label: "Payment", Ico: Wallet, go: "payment" },
  { key: "help", label: "Help", Ico: Headset, go: "help" },
  { key: "messages", label: "Messages", Ico: Chat, go: "messages" },
  { key: "safety", label: "Safety Center", Ico: Shield },
  { key: "settings", label: "Settings", Ico: Gear },
  { sep: true },
  { key: "invite", label: "Invite Friends", Ico: Gift },
  { key: "discounts", label: "Discounts", Ico: Ticket },
  { key: "scan", label: "Scan", Ico: Scan },
];

export function HomeScreen({ onGo }) {
  const { brand, profile, images } = useApp();
  const [open, setOpen] = useState(false);
  const [ping, toast] = useToast();

  const go = (dest) => { setOpen(false); setTimeout(() => onGo(dest), 180); };
  const choose = (m) => (m.go ? go(m.go) : (setOpen(false), ping(soon(m.label))));

  return (
    <>
      <div className="home-map">
        <MapBg />
        <button className="map-chip left" onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></button>
        <button className="map-chip right" onClick={() => ping(soon("Scan"))} aria-label="Scan"><Scan /></button>
        <button className="safety-chip" onClick={() => ping(soon("Safety Toolkit"))}><Shield col="#2a6fdb" /> Safety Toolkit</button>
        <span className="home-pin"><Pin /></span>
      </div>

      <div className="home-card">
        <HomeArt src={images.homeHero} />
        <h2>{brand} isn't available in your area yet</h2>
        <button className="btn btn-primary" style={{ marginBottom: 0 }} onClick={() => ping(soon("Address entry"))}>Enter Address</button>
      </div>

      <div className={"drawer-scrim" + (open ? " show" : "")} onClick={() => setOpen(false)} />
      <nav className={"drawer" + (open ? " open" : "")} aria-hidden={!open}>
        <button className="drawer-head" onClick={() => go("profile")} style={{ border: "none", textAlign: "left", cursor: "pointer" }}>
          <div>
            <div className="dh-name">{profile.firstName} {profile.lastName}</div>
            <div className="dh-edit">Edit Personal Info <Chevron size={14} w={2.4} /></div>
          </div>
          <div className="drawer-avatar"><Avatar profile={profile} size={58} /></div>
        </button>
        <div className="drawer-menu">
          {MENU.map((m, i) => m.sep ? <div className="drawer-sep" key={i} /> : (
            <button className="drawer-item" key={m.key} onClick={() => choose(m)} tabIndex={open ? 0 : -1}>
              <span className="di-ico"><m.Ico /></span>
              <span className="di-label">{m.label}</span>
            </button>
          ))}
        </div>
      </nav>
      {toast}
    </>
  );
}

/* =====================  MY TRIPS  ===================== */
export function TripsScreen({ onOpen, onClose }) {
  const { orders, currency } = useApp();
  const [tab, setTab] = useState("Food");
  return (
    <>
      <StatusBar />
      <div className="trips-head">
        <button className="trips-close" onClick={onClose} aria-label="Close"><Close /></button>
        <h1>My Trips</h1>
        <div className="trips-tabs" role="tablist">
          {["Ride", "Food"].map((tb) => (
            <button key={tb} role="tab" aria-selected={tab === tb} className={"trips-tab" + (tab === tb ? " active" : "")} onClick={() => setTab(tb)}>{tb}</button>
          ))}
        </div>
      </div>

      <div className="trips-body">
        {tab === "Food" && orders.length > 0 && (
          <>
            <div className="trips-section">history</div>
            {orders.map((o) => {
              const { total, itemCount } = totals(o);
              return (
                <button className="trip-card" key={o.id} onClick={() => onOpen(o.id)}>
                  <div className="trip-row1">
                    <span className="trip-kind">{o.kind}</span>
                    <span className={"trip-status" + (o.status === "Canceled" ? " canceled" : "")}>{o.status} <Chevron size={16} w={2.2} /></span>
                  </div>
                  <div className="trip-when"><Clock /> {o.dateLabel}</div>
                  <div className="trip-merchant">{o.merchant}</div>
                  <div className="trip-meta">Total of {itemCount} {itemCount === 1 ? "item" : "items"}</div>
                  <div className="trip-meta">Total {money(total, currency)}</div>
                </button>
              );
            })}
            <div style={{ height: 20 }} />
          </>
        )}
        {tab === "Food" && orders.length === 0 && (
          <div className="trips-empty"><h3>No orders yet</h3><p>Your food orders will show up here.</p></div>
        )}
        {tab === "Ride" && (
          <div className="trips-empty"><h3>No rides yet</h3><p>Your ride history will show up here.</p></div>
        )}
      </div>
    </>
  );
}

/* =====================  ORDER SUMMARY  ===================== */
function ItemRow({ item }) {
  return (
    <div className="item">
      <div className="qty">x{item.qty}</div>
      <div className="item-name">{item.name}</div>
    </div>
  );
}

const VISIBLE = 8;

export function ReceiptScreen({ order, onBack, onHelp, onItemized, onReorder }) {
  const { currency } = useApp();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const hiddenRef = useRef(null);
  const [hiddenH, setHiddenH] = useState(0);

  const shown = order.items.slice(0, VISIBLE);
  const hidden = order.items.slice(VISIBLE);
  const { total } = totals(order);

  useLayoutEffect(() => { if (hiddenRef.current) setHiddenH(hiddenRef.current.scrollHeight); }, [open]);

  const copy = () => {
    try { navigator.clipboard.writeText(order.orderId).catch(() => {}); } catch (e) { /* clipboard unavailable */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <>
      <div className="banner" style={{ background: order.tint }}>
        {order.banner
          ? <img className="photo" src={order.banner} alt="" style={{ position: "absolute", inset: 0 }} />
          : <div className="banner-mark" aria-hidden="true">{order.merchant.split(/\s+/).slice(0, 2).map((w) => w[0]).join("")}</div>}
        <div className="top-controls">
          <button className="circle-btn" aria-label="Back" onClick={onBack}><Back /></button>
          <button className="help-btn" onClick={onHelp}><Headset /> Help</button>
        </div>
      </div>

      <div className="sheet">
        <div className="scroll">
          <h1 className="place-name">{order.merchant}<span className="chev"><Chevron size={20} /></span></h1>
          <div className="status-line">
            <span className="done" style={{ color: order.statusColor }}>{order.status}</span>
            <span className="date">{order.dateLabel}</span>
          </div>

          <hr className="rule" />

          <div className="section-head">
            <div className="left"><Cloche /><h2>Ordered Item(s)</h2></div>
            {hidden.length > 0 && (
              <button className={"show-more" + (open ? " open" : "")} onClick={() => setOpen((v) => !v)} aria-expanded={open}>
                {open ? "Show less" : "Show more"}<span className="chev"><ChevDown /></span>
              </button>
            )}
          </div>

          <div className="items">
            {shown.map((it, i) => <ItemRow key={i} item={it} />)}
            {hidden.length > 0 && (
              <div className="collapsing" style={{ height: open ? hiddenH : 0, opacity: open ? 1 : 0 }}>
                <div ref={hiddenRef}>{hidden.map((it, i) => <ItemRow key={i} item={it} />)}</div>
              </div>
            )}
          </div>

          <hr className="rule" />

          <div className="total-wrap">
            <span className="receipt-ico"><ReceiptIco /></span>
            <div style={{ minWidth: 0 }}>
              <div className="total-line">Total: {money(total, currency)}</div>
              <div className="order-id">
                <span style={{ userSelect: "all" }}>Order ID: {order.orderId}</span>
                <button className={"copy-btn" + (copied ? " copied" : "")} onClick={copy} aria-label="Copy order ID">
                  {copied ? <CheckIco /> : <CopyIco />}
                </button>
                {copied && <span className="copied-toast">Copied</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="footer">
          <button className="btn btn-primary" onClick={onReorder}>Order Again</button>
          <button className="btn btn-secondary" onClick={onItemized}>View receipt</button>
        </div>
      </div>
    </>
  );
}

/* =====================  ITEMIZED RECEIPT (thank you)  ===================== */
export function ItemizedScreen({ order, onBack }) {
  const { brand, currency } = useApp();
  const { itemTotal, delivery, other, total, saved } = totals(order);
  const m = (n) => money(n, currency);
  const pay = order.payment || {};
  return (
    <>
      <div className="ty-banner">
        <button className="ty-back" onClick={onBack} aria-label="Back"><Back /></button>
        <h1>Thank you for choosing {brand} Food</h1>
        <ThankYouArt />
      </div>

      <div className="ty-body">
        <div className="ty-total">
          <span className="lbl">Total</span>
          <span className="amt">
            <div className="big">{m(total)}</div>
            {saved > 0 && <div className="saved">You saved {m(saved)}</div>}
          </span>
        </div>

        <div className="ty-group">
          <div className="ty-line head"><span className="l" style={{ color: "var(--ink)" }}>Food Fee</span><span className="r">{m(itemTotal)}</span></div>
          <div className="ty-line"><span className="l">Item Total</span><span className="r">{m(itemTotal)}</span></div>
        </div>

        <div className="ty-group">
          <div className="ty-line head"><span className="l" style={{ color: "var(--ink)" }}>Delivery Fee</span><span className="r">{m(delivery)}</span></div>
          <div className="ty-line"><span className="l">Delivery Fee</span><span className="r">{m(order.deliveryFee || 0)}</span></div>
          {order.deliveryCoupon > 0 && (
            <div className="ty-line"><span className="l disc">Delivery Coupons</span><span className="r disc">{m(-order.deliveryCoupon)}</span></div>
          )}
        </div>

        <div className="ty-group">
          <div className="ty-line head"><span className="l" style={{ color: "var(--ink)" }}>Other Fees</span><span className="r">{m(other)}</span></div>
          <div className="ty-line"><span className="l">Service Fee</span><span className="r">{m(order.serviceFee || 0)}</span></div>
          {order.tip > 0 && <div className="ty-line"><span className="l">Tip</span><span className="r">{m(order.tip)}</span></div>}
        </div>

        <div className="ty-pay">
          <span className="who"><PayLogo type={pay.type} /> {pay.type === "cash" ? "Cash" : `•••• ${pay.last4 || ""}`}</span>
          <span className="amt">{m(total)}</span>
        </div>
      </div>
    </>
  );
}

/* =====================  REORDER  ===================== */
export function ReorderScreen({ order, onBack, onDone }) {
  const { currency } = useApp();
  const [done, setDone] = useState(false);
  const [ping, toast] = useToast();
  const { itemTotal, itemCount } = totals(order);
  const noun = itemCount === 1 ? "item" : "items";
  return (
    <>
      <StatusBar />
      <NavHeader title="Order again" onBack={onBack} />
      <div className="scroll" style={{ padding: 0 }}>
        <div className="ro-head">
          <h2>Add these items to your cart</h2>
          <p>From {order.merchant}</p>
        </div>
        <div className="ro-list">
          {order.items.map((it, i) => (
            <div className="ro-item" key={i}>
              <span className="ro-q">x{it.qty}</span>
              <span className="ro-n">{it.name}</span>
              <span className="ro-p">{money(it.price, currency)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="footer">
        <button className="btn btn-primary" style={{ marginBottom: 0 }} onClick={() => setDone(true)}>
          <PlusIco /> Add {itemCount} {noun} · {money(itemTotal, currency)}
        </button>
      </div>

      {done && (
        <div className="ro-success">
          <div className="ro-check"><CheckIco size={44} w={3} /></div>
          <h3>Added to your cart</h3>
          <p>{itemCount} {noun} from {order.merchant} are ready to check out.</p>
          <div style={{ width: "100%", marginTop: 30 }}>
            <button className="btn btn-primary" onClick={() => ping(soon("Checkout"))}>Go to cart</button>
            <button className="btn btn-secondary" onClick={onDone}>Back to orders</button>
          </div>
        </div>
      )}
      {toast}
    </>
  );
}

/* =====================  HELP  ===================== */
export function HelpScreen({ onBack, onMessages }) {
  return (
    <>
      <StatusBar />
      <NavHeader title="Help" onBack={onBack} />
      <div className="help-hero">
        <h2>How can we help you?</h2>
        <HelpArt />
      </div>
      <div className="help-card">
        <button className="help-row" onClick={onMessages}>
          <ChatLine />
          <span className="hr-label">Message History</span>
          <Chevron size={20} w={2.2} />
        </button>
      </div>
      <div className="help-bg" />
    </>
  );
}

export function MessageHistory({ onBack }) {
  return (
    <>
      <StatusBar />
      <NavHeader title="Message History" onBack={onBack} />
      <div className="set-body" style={{ background: "var(--pill-bg)" }}>
        <div className="trips-empty"><h3>No messages yet</h3><p>Conversations with support will appear here.</p></div>
      </div>
    </>
  );
}

/* =====================  MY PROFILE  ===================== */
export function ProfileScreen({ onBack }) {
  const { profile } = useApp();
  const [ping, toast] = useToast();
  const rows = [
    { label: "Mobile Number", value: profile.mobile },
    { label: "Email", value: profile.email, flag: profile.emailVerified ? null : "Unverified" },
    { label: "Password" },
    { label: "Third-party Account" },
    { label: "Device Management" },
    { label: "Delete Account", danger: true },
  ];
  return (
    <>
      <StatusBar />
      <div className="trips-head" style={{ paddingBottom: 6 }}>
        <button className="trips-close" onClick={onBack} aria-label="Close"><Close /></button>
        <h1>My Profile</h1>
      </div>
      <div className="set-body">
        <div className="set-gap" />
        <button className="prof-head" onClick={() => ping(soon("Profile pictures"))} style={{ width: "100%", background: "none", border: "none", cursor: "pointer" }}>
          <div className="prof-avatar"><Avatar profile={profile} size={78} /></div>
          <span className="prof-edit">Edit Profile Picture <Chevron size={18} w={2.2} /></span>
        </button>
        <div className="prof-field"><div className="pf-label">First Name</div><div className="pf-value">{profile.firstName}</div></div>
        <div className="prof-field"><div className="pf-label">Last Name</div><div className="pf-value">{profile.lastName}</div></div>
        <div className="set-gap" />
        {rows.map((r) => (
          <button className="set-row" key={r.label} onClick={() => ping(soon(r.label))}>
            <span className="sr-label" style={r.danger ? { color: "var(--red)" } : null}>{r.label}</span>
            {r.value && <span className="sr-value">{r.value}</span>}
            {r.flag && <span className="sr-flag">{r.flag}</span>}
            <span className="sr-chev"><Chevron size={18} w={2.3} /></span>
          </button>
        ))}
      </div>
      {toast}
    </>
  );
}

/* =====================  PAYMENT METHODS  ===================== */
export function PaymentScreen({ onBack }) {
  const { payments } = useApp();
  const [ping, toast] = useToast();
  const name = (p) => p.label || `${p.type === "visa" ? "VISA" : "Mastercard"} •••• ${p.last4}`;
  return (
    <>
      <StatusBar />
      <NavHeader title="Payment Methods" onBack={onBack} />
      <div className="set-body">
        {payments.map((p) => (
          <button className="pay-row" key={p.id} onClick={() => ping(soon("Editing " + name(p)))}>
            <span className="pay-logo"><PayLogo type={p.type} /></span>
            <span className="pay-name">{name(p)}</span>
            <Chevron size={20} w={2.2} />
          </button>
        ))}
        <button className="pay-row" onClick={() => ping(soon("Adding a card"))}>
          <span className="pay-logo"><PlusCircle /></span>
          <span className="pay-name">Credit / Debit Card<div className="pn-sub">Visa/MasterCard</div></span>
          <Chevron size={20} w={2.2} />
        </button>
      </div>
      {toast}
    </>
  );
}

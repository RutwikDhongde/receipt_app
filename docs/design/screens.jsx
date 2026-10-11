/* screens.jsx — flow screens. Loaded as a separate babel script (wrapped in an IIFE
   to avoid top-level name collisions with the other babel scripts).
   Pulls shared bits off window: IconKit, ORDERS, OrderUtils, Chrome, AppMeta. */
(function () {
  const { useState: useS, useRef: useR, useLayoutEffect: useLE } = React;
  const {
    Chevron, ChevDown, Back, Headset, Cloche, ReceiptIco, CopyIco, CheckIco, PlusIco,
    ChatIco, ShareIco, Menu, Scan, Shield, Close, Clock, Book, Wallet, Chat, Gear,
    Gift, Ticket, Pin, CardLogo, VisaLogo, CashLogo, PlusCircle, ChatLine
  } = window.IconKit;
  const { colones, totals } = window.OrderUtils;
  const { StatusBar, NavHeader } = window.Chrome;
  const { BRAND, USER, PROFILE, PAYMENTS } = window.AppMeta;

  /* =====================  HOME  (map + side drawer)  ===================== */
  function MapBg() {
    return (
      <svg className="map" viewBox="0 0 445 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="445" height="640" fill="#e7eae6" />
      <ellipse cx="80" cy="120" rx="120" ry="90" fill="#d7e6cd" opacity=".7" />
      <ellipse cx="390" cy="430" rx="130" ry="100" fill="#d7e6cd" opacity=".6" />
      {/* river */}
      <path d="M-20 250 C 120 230 160 360 300 350 S 460 300 470 320" fill="none" stroke="#c2d9ea" strokeWidth="20" strokeLinecap="round" />
      {/* road casings + roads */}
      <g stroke="#d4d7d2" strokeWidth="20" fill="none" strokeLinecap="round">
        <path d="M-10 90 L 250 130 L 470 90" />
        <path d="M60 -10 L 110 300 L 70 660" />
        <path d="M-10 520 L 240 470 L 470 540" />
        <path d="M330 -10 L 360 320 L 320 660" />
      </g>
      <g stroke="#ffffff" strokeWidth="12" fill="none" strokeLinecap="round">
        <path d="M-10 90 L 250 130 L 470 90" />
        <path d="M60 -10 L 110 300 L 70 660" />
        <path d="M-10 520 L 240 470 L 470 540" />
        <path d="M330 -10 L 360 320 L 320 660" />
      </g>
      {/* a few blocks */}
      <g fill="#dde0db">
        <rect x="150" y="180" width="60" height="44" rx="5" />
        <rect x="230" y="190" width="48" height="40" rx="5" />
        <rect x="170" y="380" width="55" height="48" rx="5" />
        <rect x="250" y="400" width="60" height="40" rx="5" />
      </g>
    </svg>);

  }

  const MENU = [
  { key: "trips", label: "My Trips", Ico: Book, go: "trips" },
  { key: "payment", label: "Payment", Ico: Wallet, go: "payment" },
  { key: "help", label: "Help", Ico: Headset, go: "help" },
  { key: "messages", label: "Messages", Ico: Chat },
  { key: "safety", label: "Safety Center", Ico: Shield },
  { key: "settings", label: "Settings", Ico: Gear },
  { sep: true },
  { key: "invite", label: "Invite Friends", Ico: Gift },
  { key: "discounts", label: "Discounts", Ico: Ticket },
  { key: "scan", label: "Scan", Ico: Scan }];


  function HomeScreen({ onGo }) {
    const [open, setOpen] = useS(false);
    const [toast, setToast] = useS("");
    const ping = (msg) => {setToast(msg);setTimeout(() => setToast(""), 1700);};

    const choose = (m) => {
      if (m.go) {setOpen(false);setTimeout(() => onGo(m.go), 180);} else
      {setOpen(false);ping(m.label + " — coming soon");}
    };
    const editProfile = () => {setOpen(false);setTimeout(() => onGo("profile"), 180);};

    return (
      <React.Fragment>
      <div className="home-map">
        <MapBg />
        <StatusBar over dark />
        <button className="map-chip left" onClick={() => setOpen(true)} aria-label="Menu"><Menu /></button>
        <button className="map-chip right" onClick={() => ping("Scan — coming soon")} aria-label="Scan"><Scan /></button>
        <button className="safety-chip" onClick={() => ping("Safety Toolkit")}><Shield col="#2a6fdb" /> Safety Toolkit</button>
        <span className="home-pin"><Pin /></span>
      </div>

      <div className="home-card">
        <image-slot id="home-illo" className="home-illo" shape="rounded" radius="16"
          placeholder="Drop hero illustration"></image-slot>
        <h2>{BRAND} isn't available in your area yet</h2>
        <button className="btn btn-primary" style={{ marginBottom: 0 }} onClick={() => ping("Address entry — coming soon")}>Enter Address</button>
      </div>

      {/* side drawer */}
      <div className={"drawer-scrim" + (open ? " show" : "")} onClick={() => setOpen(false)} />
      <div className={"drawer" + (open ? " open" : "")}>
        <button className="drawer-head" onClick={editProfile}>
          <div>
            <div className="dh-name" style={{ fontWeight: "700" }}>{USER}</div>
            <div className="dh-edit">Edit Personal Info <Chevron size={14} w={2.4} /></div>
          </div>
          <div className="drawer-avatar">
            <image-slot id="user-avatar" shape="circle" style={{ width: "58px", height: "58px" }}
              placeholder="Photo"></image-slot>
          </div>
        </button>
        <div className="drawer-menu">
          {MENU.map((m, i) => m.sep ? <div className="drawer-sep" key={i} /> :
            <button className="drawer-item" key={m.key} onClick={() => choose(m)}>
              <span className="di-ico"><m.Ico /></span>
              <span className="di-label">{m.label}</span>
            </button>
            )}
        </div>
      </div>

      <div className={"toast" + (toast ? " show" : "")}>{toast}</div>
    </React.Fragment>);

  }

  /* =====================  MY TRIPS  ===================== */
  function TripsScreen({ onOpen, onClose }) {
    const [tab, setTab] = useS("Food");
    return (
      <React.Fragment>
      <StatusBar dark />
      <div className="trips-head">
        <button className="trips-close" onClick={onClose} aria-label="Close"><Close /></button>
        <h1>My Trips</h1>
        <div className="trips-tabs">
          {["Ride", "Food"].map((tb) =>
            <button key={tb} className={"trips-tab" + (tab === tb ? " active" : "")} onClick={() => setTab(tb)}>{tb}</button>
            )}
        </div>
      </div>

      <div className="trips-body">
        {tab === "Food" ?
          <React.Fragment>
            <div className="trips-section">history</div>
            {ORDERS.map((o) => {
              const { total } = totals(o);
              const canceled = o.status === "Canceled";
              return (
                <div className="trip-card" key={o.id} onClick={() => onOpen(o.id)}>
                  <div className="trip-row1">
                    <span className="trip-kind">{o.kind}</span>
                    <span className={"trip-status" + (canceled ? " canceled" : "")}>{o.status} <Chevron size={16} w={2.2} /></span>
                  </div>
                  <div className="trip-when"><Clock /> {o.date}</div>
                  <div className="trip-merchant">{o.merchant}</div>
                  <div className="trip-meta">Total of {o.items.length}</div>
                  <div className="trip-meta">Total {colones(total)}</div>
                </div>);

            })}
            <div style={{ height: 20 }} />
          </React.Fragment> :

          <div className="trips-empty">
            <h3>No rides yet</h3>
            <p>Your ride history will show up here.</p>
          </div>
          }
      </div>
    </React.Fragment>);

  }

  /* =====================  ORDER SUMMARY (receipt)  ===================== */
  function ItemRow({ item }) {
    return (
      <div className="item">
      <div className="qty">{item.qty}</div>
      <div className="item-name">{item.name}</div>
    </div>);

  }

  function ReceiptScreen({ order, onBack, onHelp, onItemized, onReorder }) {
    const [open, setOpen] = useS(false);
    const [copied, setCopied] = useS(false);
    const hiddenRef = useR(null);
    const [hiddenH, setHiddenH] = useS(0);

    const VISIBLE = 8;
    const shown = order.items.slice(0, VISIBLE);
    const hidden = order.items.slice(VISIBLE);
    const { total } = totals(order);

    useLE(() => {if (hiddenRef.current) setHiddenH(hiddenRef.current.scrollHeight);}, [open]);

    const copy = () => {
      navigator.clipboard && navigator.clipboard.writeText(order.orderId).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    };

    return (
      <React.Fragment>
      <div className="banner" style={{ background: order.tint }}>
        <image-slot id={"banner-" + order.id} shape="rect" fit="cover"
          placeholder="Drop top image (promo / store banner)"></image-slot>
        <StatusBar over />
        <div className="top-controls">
          <button className="circle-btn" aria-label="Back" onClick={onBack}><Back /></button>
          <button className="help-btn" onClick={onHelp}><Headset /> Help</button>
        </div>
      </div>

      <div className="sheet">
        <div className="scroll">
          <h1 className="place-name">
            {order.merchant}
            <span className="chev"><Chevron size={20} /></span>
          </h1>
          <div className="status-line">
            <span className="done" style={{ color: order.statusColor }}>{order.status}</span>
            <span className="date">{order.date}</span>
          </div>

          <hr className="rule" />

          <div className="section-head">
            <div className="left"><Cloche /><h2>Ordered Item(s)</h2></div>
            {hidden.length > 0 &&
              <button className={"show-more" + (open ? " open" : "")} onClick={() => setOpen((o) => !o)}>
                {open ? "Show less" : "Show more"}
                <span className="chev"><ChevDown /></span>
              </button>
              }
          </div>

          <div className="items">
            {shown.map((it, i) => <ItemRow key={i} item={it} />)}
            <div className="collapsing" style={{ height: open ? hiddenH : 0, opacity: open ? 1 : 0 }}>
              <div ref={hiddenRef}>{hidden.map((it, i) => <ItemRow key={i} item={it} />)}</div>
            </div>
          </div>

          <hr className="rule" />

          <div className="total-wrap">
            <span className="receipt-ico"><ReceiptIco /></span>
            <div>
              <div className="total-line">Total: {colones(total)}</div>
              <div className="order-id">
                <span>Order ID: {order.orderId}</span>
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
    </React.Fragment>);

  }

  /* =====================  ITEMIZED RECEIPT (thank you)  ===================== */
  function ItemizedScreen({ order, onBack }) {
    const { itemTotal, delivery, other, total, saved } = totals(order);
    const pay = order.payment || {};
    return (
      <React.Fragment>
      <div className="ty-banner">
        <button className="ty-back" onClick={onBack} aria-label="Back"><Back /></button>
        <StatusBar over dark />
        <h1>Thank you for choosing {BRAND} Food</h1>
        <image-slot id={"ty-illo-" + order.id} className="ty-illo" shape="rounded" radius="14"
          placeholder="Drop 3D illustration"></image-slot>
      </div>

      <div className="ty-body">
        <div className="ty-total">
          <span className="lbl">Total</span>
          <span className="amt">
            <div className="big">{colones(total)}</div>
            {saved > 0 && <div className="saved">You saved {colones(saved)}</div>}
          </span>
        </div>

        <div className="ty-group">
          <div className="ty-line head"><span className="l" style={{ color: "var(--ink)" }}>Food Fee</span><span className="r">{colones(itemTotal)}</span></div>
          <div className="ty-line"><span className="l">Item Total</span><span className="r">{colones(itemTotal)}</span></div>
        </div>

        <div className="ty-group">
          <div className="ty-line head"><span className="l" style={{ color: "var(--ink)" }}>Delivery Fee</span><span className="r">{colones(delivery)}</span></div>
          <div className="ty-line"><span className="l">Delivery Fee</span><span className="r">{colones(order.deliveryFee || 0)}</span></div>
          {order.deliveryCoupon > 0 &&
            <div className="ty-line"><span className="l disc">Delivery Coupons</span><span className="r disc">-{colones(order.deliveryCoupon)}</span></div>
            }
        </div>

        <div className="ty-group">
          <div className="ty-line head"><span className="l" style={{ color: "var(--ink)" }}>Other Fees</span><span className="r">{colones(other)}</span></div>
          <div className="ty-line"><span className="l">Service Fee</span><span className="r">{colones(order.serviceFee || 0)}</span></div>
          {order.tip > 0 && <div className="ty-line"><span className="l">Tip</span><span className="r">{colones(order.tip)}</span></div>}
        </div>

        <div className="ty-pay">
          <span className="who"><CardLogo /> {pay.last4}</span>
          <span className="amt">{colones(total)}</span>
        </div>
      </div>
    </React.Fragment>);

  }

  /* =====================  REORDER  ===================== */
  function ReorderScreen({ order, onBack, onDone }) {
    const [done, setDone] = useS(false);
    const { itemTotal } = totals(order);
    const count = order.items.length;
    return (
      <React.Fragment>
      <StatusBar dark />
      <NavHeader title="Order again" onBack={onBack} />
      <div className="scroll" style={{ padding: 0 }}>
        <div className="ro-head">
          <h2>Add these items to your cart</h2>
          <p>From {order.merchant}</p>
        </div>
        <div className="ro-list">
          {order.items.map((it, i) =>
            <div className="ro-item" key={i}>
              <span className="ro-q">{it.qty}</span>
              <span className="ro-n">{it.name}</span>
              <span className="ro-p">{colones(it.price)}</span>
            </div>
            )}
        </div>
      </div>
      <div className="footer">
        <button className="btn btn-primary" onClick={() => setDone(true)}>
          <PlusIco /> Add {count} items · {colones(itemTotal)}
        </button>
      </div>

      {done &&
        <div className="ro-success">
          <div className="ro-check"><CheckIco size={44} w={3} /></div>
          <h3>Added to your cart</h3>
          <p>{count} items from {order.merchant} are ready to check out.</p>
          <div style={{ width: "100%", marginTop: 30 }}>
            <button className="btn btn-primary">Go to cart</button>
            <button className="btn btn-secondary" onClick={onDone}>Back to orders</button>
          </div>
        </div>
        }
    </React.Fragment>);

  }

  /* =====================  HELP  ===================== */
  const HELP_TOPICS = [
  { q: "Missing or wrong items", a: "Tell us which items were missing or incorrect and we'll review a refund for just those items — usually within a few minutes." },
  { q: "Where is my order", a: "You can track active orders from the order detail screen. Completed orders show the delivery time on the receipt." },
  { q: "Request a refund", a: "Refunds are reviewed within 24 hours and returned to your original payment method once approved." },
  { q: "Payment & charges", a: "Open 'View receipt' on any order to see a full breakdown of items, delivery, and service fees." },
  { q: "Report a problem", a: "Describe what went wrong and our support team will follow up by email about this order." }];


  function HelpScreen({ onBack, onMessages }) {
    return (
      <React.Fragment>
      <StatusBar dark />
      <NavHeader title="Help" onBack={onBack} />
      <div className="help-hero">
        <h2>How can we help you?</h2>
        <image-slot id="help-illo" className="help-illo" shape="rounded" radius="14"
          placeholder="Drop support art"></image-slot>
      </div>
      <div className="help-card">
        <button className="help-row" onClick={onMessages}>
          <ChatLine />
          <span className="hr-label">Message History</span>
          <Chevron size={20} w={2.2} />
        </button>
      </div>
      <div className="help-bg" />
    </React.Fragment>);

  }

  /* =====================  MESSAGE HISTORY  ===================== */
  function MessageHistory({ onBack }) {
    return (
      <React.Fragment>
      <StatusBar dark />
      <NavHeader title="Message History" onBack={onBack} />
      <div className="set-body" style={{ background: "#f0f0f3" }}>
        <div className="trips-empty">
          <h3>No messages yet</h3>
          <p>Conversations with support will appear here.</p>
        </div>
      </div>
    </React.Fragment>);

  }

  /* =====================  MY PROFILE  ===================== */
  function ProfileScreen({ onBack }) {
    const [toast, setToast] = useS("");
    const ping = (m) => {setToast(m);setTimeout(() => setToast(""), 1600);};
    const rows = [
    { label: "Mobile Number", value: PROFILE.mobile },
    { label: "Email", value: PROFILE.email, flag: PROFILE.emailVerified ? null : "Unverified" },
    { label: "Password" },
    { label: "Third-party Account" },
    { label: "Device Management" },
    { label: "Delete Account" }];

    return (
      <React.Fragment>
      <StatusBar dark />
      <div className="trips-head" style={{ paddingBottom: 6 }}>
        <button className="trips-close" onClick={onBack} aria-label="Close"><Close /></button>
        <h1>My Profile</h1>
      </div>
      <div className="set-body">
        <div className="set-gap" />
        <button className="prof-head" onClick={() => ping("Edit profile picture")} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
          <div className="prof-avatar">
            <image-slot id="profile-avatar" shape="circle" style={{ width: "90px", height: "90px" }} placeholder="Photo"></image-slot>
          </div>
          <span className="prof-edit">Edit Profile Picture <Chevron size={18} w={2.2} /></span>
        </button>
        <div className="prof-field"><div className="pf-label">First Name</div><div className="pf-value">{PROFILE.firstName}</div></div>
        <div className="prof-field"><div className="pf-label">Last Name</div><div className="pf-value">{PROFILE.lastName}</div></div>
        <div className="set-gap" />
        {rows.map((r, i) =>
          <button className="set-row" key={i} onClick={() => ping(r.label)}>
            <span className="sr-label">{r.label}</span>
            {r.value && <span className="sr-value">{r.value}</span>}
            {r.flag && <span className="sr-flag">{r.flag}</span>}
            <span className="sr-chev"><Chevron size={18} w={2.3} /></span>
          </button>
          )}
      </div>
      <div className={"toast" + (toast ? " show" : "")}>{toast ? toast + " — coming soon" : ""}</div>
    </React.Fragment>);

  }

  /* =====================  PAYMENT METHODS  ===================== */
  function PayLogo({ type }) {
    if (type === "visa") return <VisaLogo />;
    if (type === "mastercard") return <CardLogo />;
    if (type === "cash") return <CashLogo />;
    return null;
  }
  function PaymentScreen({ onBack }) {
    const [toast, setToast] = useS("");
    const ping = (m) => {setToast(m);setTimeout(() => setToast(""), 1600);};
    return (
      <React.Fragment>
      <StatusBar dark />
      <NavHeader title="Payment Methods" onBack={onBack} />
      <div className="set-body">
        {PAYMENTS.map((p) =>
          <button className="pay-row" key={p.id} onClick={() => ping(p.label || "Card \u00b7\u00b7\u00b7\u00b7 " + p.last4)}>
            <span className="pay-logo"><PayLogo type={p.type} /></span>
            <span className="pay-name">{p.label || <span><span className="pay-dots">••••</span> {p.last4}</span>}</span>
            <Chevron size={20} w={2.2} />
          </button>
          )}
        <button className="pay-row" onClick={() => ping("Add card")}>
          <span className="pay-logo"><PlusCircle /></span>
          <span className="pay-name">Credit / Debit Card<div className="pn-sub">Visa/MasterCard</div></span>
          <Chevron size={20} w={2.2} />
        </button>
      </div>
      <div className={"toast" + (toast ? " show" : "")}>{toast ? toast + " — coming soon" : ""}</div>
    </React.Fragment>);

  }

  Object.assign(window, { HomeScreen, TripsScreen, ReceiptScreen, ItemizedScreen, ReorderScreen, HelpScreen, MessageHistory, ProfileScreen, PaymentScreen });
})();
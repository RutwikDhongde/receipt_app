// Entry point: reads the data embedded by scripts/build.mjs and runs the
// push/pop screen stack. React and ReactDOM are globals loaded from the CDN.
import {
  AppData, HomeScreen, TripsScreen, ReceiptScreen, ItemizedScreen, ReorderScreen,
  HelpScreen, MessageHistory, ProfileScreen, PaymentScreen,
} from "./screens.jsx";
import { prepareOrders, validate } from "./model.js";

const { useState, useRef, useMemo } = React;

function App({ data }) {
  const app = useMemo(() => ({
    brand: data.brand || "Pronto",
    currency: data.currency || "₡",
    profile: data.profile,
    payments: data.payments,
    images: data.images || {},
    orders: prepareOrders(data.orders),
  }), [data]);

  const keyRef = useRef(1);
  const [stack, setStack] = useState([{ key: 0, screen: "home" }]);
  const [exiting, setExiting] = useState(null);

  const push = (screen, params = {}) => setStack((s) => [...s, { key: keyRef.current++, screen, ...params }]);
  const popTo = (depth) => setStack((s) => {
    if (s.length <= depth) return s;
    setExiting(s[s.length - 1]);
    setTimeout(() => setExiting(null), 320);
    return s.slice(0, depth);
  });
  const pop = () => popTo(stack.length - 1);
  const popToRoot = () => popTo(1);

  const render = (item) => {
    const order = item.orderId ? app.orders.find((o) => o.id === item.orderId) : null;
    switch (item.screen) {
      case "home": return <HomeScreen onGo={(dest) => push(dest)} />;
      case "trips": return <TripsScreen onOpen={(id) => push("receipt", { orderId: id })} onClose={pop} />;
      case "receipt": return <ReceiptScreen order={order} onBack={pop}
        onHelp={() => push("help")}
        onItemized={() => push("itemized", { orderId: order.id })}
        onReorder={() => push("reorder", { orderId: order.id })} />;
      case "itemized": return <ItemizedScreen order={order} onBack={pop} />;
      case "reorder": return <ReorderScreen order={order} onBack={pop} onDone={popToRoot} />;
      case "help": return <HelpScreen onBack={pop} onMessages={() => push("messages")} />;
      case "messages": return <MessageHistory onBack={pop} />;
      case "profile": return <ProfileScreen onBack={pop} />;
      case "payment": return <PaymentScreen onBack={pop} />;
      default: return null;
    }
  };

  return (
    <AppData.Provider value={app}>
      <div className="phone">
        {stack.map((item, i) => (
          <div className={"screen" + (i > 0 ? " enter" : "")} key={item.key} style={{ zIndex: i + 1 }} inert={i < stack.length - 1 ? "" : undefined}>
            {render(item)}
          </div>
        ))}
        {exiting && (
          <div className="screen exit" key={"ex" + exiting.key} style={{ zIndex: 999 }}>{render(exiting)}</div>
        )}
      </div>
    </AppData.Provider>
  );
}

function BootError({ errors }) {
  return (
    <div className="boot-error">
      <h1>The order data has a problem</h1>
      <p>Fix these in data/app-data.json and rebuild:</p>
      <ul>{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
    </div>
  );
}

const rootEl = document.getElementById("root");
let data = null;
let errors = [];
try {
  data = JSON.parse(document.getElementById("app-data").textContent);
  errors = validate(data);
} catch (e) {
  errors = ["app-data.json is not valid JSON: " + e.message];
}
ReactDOM.createRoot(rootEl).render(errors.length ? <BootError errors={errors} /> : <App data={data} />);

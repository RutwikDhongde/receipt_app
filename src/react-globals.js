// esbuild injects these wherever the app code uses the React / ReactDOM
// globals, so React is bundled into the page instead of loaded from a CDN.
import * as React from "react";
import * as ReactDOM from "react-dom/client";

export { React, ReactDOM };

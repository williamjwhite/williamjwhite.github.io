import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { getPlatformClass } from "./lib/platform";

document.documentElement.classList.add("dark");
document.documentElement.classList.add(getPlatformClass());

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

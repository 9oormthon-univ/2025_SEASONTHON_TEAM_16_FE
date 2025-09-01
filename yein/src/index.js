import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const el = document.getElementById("root");
console.log("root element:", el); // ✅ 콘솔에 찍혀야 함
createRoot(el).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

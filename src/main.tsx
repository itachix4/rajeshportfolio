import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { inject } from "@vercel/analytics";
import App from "./App.tsx";
import "./site.css";

inject();

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}

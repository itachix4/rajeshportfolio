import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";

export const render = (pathname = "/") =>
  renderToString(
    <StrictMode>
      <App pathname={pathname} />
    </StrictMode>,
  );

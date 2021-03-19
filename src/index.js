import { StrictMode } from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { initialize } from "./sync";

initialize();

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  rootElement
);

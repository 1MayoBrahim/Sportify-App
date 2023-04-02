import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { CurrentUserProvider } from "../src/components/all-contexts/currentUserContext";
import { CurrentUserLocationProvider } from "./components/all-contexts/currentLocationContext";

ReactDOM.render(
  <CurrentUserProvider>
    <CurrentUserLocationProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </CurrentUserLocationProvider>
  </CurrentUserProvider>,
  document.getElementById("root")
);

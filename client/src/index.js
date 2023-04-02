import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { CurrentUserProvider } from "./components/all-contexts/currentUserContext";
import { CurrentUserLocationProvider } from "./components/all-contexts/currentLocationContext";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

root.render(
  <CurrentUserProvider>
    <CurrentUserLocationProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </CurrentUserLocationProvider>
  </CurrentUserProvider>
);

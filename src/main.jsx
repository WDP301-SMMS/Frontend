import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { HealthProfileProvider } from "./libs/contexts/HealthProfileContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HealthProfileProvider>
      <App />
    </HealthProfileProvider>
  </StrictMode>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { HealthProfileProvider } from "./libs/contexts/HealthProfileContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HealthProfileProvider>
      <App />
    </HealthProfileProvider>
    <ToastContainer />
  </StrictMode>
);

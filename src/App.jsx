import { BrowserRouter } from "react-router";
import "./App.css";
import { Suspense } from "react";
import AppRoutes from "~pages/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <AppRoutes />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

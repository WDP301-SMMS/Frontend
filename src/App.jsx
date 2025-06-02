import { BrowserRouter } from "react-router";
import { Suspense } from "react";
import AppRoutes from "~/routers/AppRoutes";

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

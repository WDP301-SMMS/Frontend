import { BrowserRouter } from "react-router-dom";
import { Suspense } from "react";
import AppRoutes from "~/routers/AppRoutes";
import { AuthProvider, useAuth } from "./libs/contexts/AuthContext";

// 🔄 Loading Component
const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-primary rounded-full animate-spin mb-4"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-blue-400 rounded-full animate-spin animation-delay-75"></div>
        </div>

        {/* Text + bouncing dots */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-700 animate-pulse">Đang tải...</h2>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-100"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-200"></div>
          </div>
        </div>
      </div>

      {/* Background glow */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-indigo-200 rounded-full opacity-20 animate-pulse animation-delay-300"></div>
      <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse animation-delay-500"></div>

      <style>{`
        .animation-delay-75 { animation-delay: 0.075s; }
        .animation-delay-100 { animation-delay: 0.1s; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-500 { animation-delay: 0.5s; }
      `}</style>
    </div>
  );
};

// 🔐 Auth wrapper để chờ AuthProvider loading xong
const AuthGate = ({ children }) => {
  const { loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthGate>
          <Suspense fallback={<LoadingSpinner />}>
            <AppRoutes />
          </Suspense>
        </AuthGate>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

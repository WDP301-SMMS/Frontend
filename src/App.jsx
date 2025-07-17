import { BrowserRouter } from "react-router-dom";
import { Suspense } from "react";
import AppRoutes from "~/routers/AppRoutes";
import { AuthProvider, useAuth } from "./libs/contexts/AuthContext";

// 🔄 Loading Component
const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center z-50">
      <div className="wrapper absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-transparent border-none select-none">
        <div className="box-wrap w-[70%] h-[70%] mx-auto my-auto relative -rotate-45">
          <div className="box one absolute inset-0 bg-gradient-to-r from-[#141562] via-[#486FBC] via-[#EAB5A1] via-[#8DD6FF] via-[#4973C9] via-[#D07CA7] via-[#F4915E] via-[#F5919E] via-[#B46F89] to-[#141562] bg-[length:1000%_1000%] bg-[0%_50%] animate-[moveGradient_15s_infinite,oneMove_3.5s_infinite]" />
          <div className="box two absolute inset-0 bg-gradient-to-r from-[#141562] via-[#486FBC] via-[#EAB5A1] via-[#8DD6FF] via-[#4973C9] via-[#D07CA7] via-[#F4915E] via-[#F5919E] via-[#B46F89] to-[#141562] bg-[length:1000%_1000%] bg-[0%_50%] animate-[moveGradient_15s_infinite,twoMove_3.5s_0.15s_infinite]" />
          <div className="box three absolute inset-0 bg-gradient-to-r from-[#141562] via-[#486FBC] via-[#EAB5A1] via-[#8DD6FF] via-[#4973C9] via-[#D07CA7] via-[#F4915E] via-[#F5919E] via-[#B46F89] to-[#141562] bg-[length:1000%_1000%] bg-[0%_50%] animate-[moveGradient_15s_infinite,threeMove_3.5s_0.3s_infinite]" />
          <div className="box four absolute inset-0 bg-gradient-to-r from-[#141562] via-[#486FBC] via-[#EAB5A1] via-[#8DD6FF] via-[#4973C9] via-[#D07CA7] via-[#F4915E] via-[#F5919E] via-[#B46F89] to-[#141562] bg-[length:1000%_1000%] bg-[0%_50%] animate-[moveGradient_15s_infinite,fourMove_3.5s_0.575s_infinite]" />
          <div className="box five absolute inset-0 bg-gradient-to-r from-[#141562] via-[#486FBC] via-[#EAB5A1] via-[#8DD6FF] via-[#4973C9] via-[#D07CA7] via-[#F4915E] via-[#F5919E] via-[#B46F89] to-[#141562] bg-[length:1000%_1000%] bg-[0%_50%] animate-[moveGradient_15s_infinite,fiveMove_3.5s_0.725s_infinite]" />
          <div className="box six absolute inset-0 bg-gradient-to-r from-[#141562] via-[#486FBC] via-[#EAB5A1] via-[#8DD6FF] via-[#4973C9] via-[#D07CA7] via-[#F4915E] via-[#F5919E] via-[#B46F89] to-[#141562] bg-[length:1000%_1000%] bg-[0%_50%] animate-[moveGradient_15s_infinite,sixMove_3.5s_0.875s_infinite]" />
        </div>
      </div>

      <style>{`
        .wrapper * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .box {
          visibility: hidden;
        }

        @keyframes moveGradient {
          to {
            background-position: 100% 50%;
          }
        }

        @keyframes oneMove {
          0% {
            visibility: visible;
            clip-path: inset(0% 35% 70% round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          14.2857% {
            clip-path: inset(0% 35% 70% round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          28.5714% {
            clip-path: inset(35% round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          42.8571% {
            clip-path: inset(35% 70% 35% 0 round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          57.1428% {
            clip-path: inset(35% 70% 35% 0 round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          71.4285% {
            clip-path: inset(0% 70% 70% 0 round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          85.7142% {
            clip-path: inset(0% 70% 70% 0 round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          100% {
            clip-path: inset(0% 35% 70% round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
        }

        @keyframes twoMove {
          0% {
            visibility: visible;
            clip-path: inset(0% 70% 70% 0 round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          14.2857% {
            clip-path: inset(0% 70% 70% 0 round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          28.5714% {
            clip-path: inset(0% 35% 70% round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          42.8571% {
            clip-path: inset(0% 35% 70% round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          57.1428% {
            clip-path: inset(35% round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          71.4285% {
            clip-path: inset(35% 70% 35% 0 round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          85.7142% {
            clip-path: inset(35% 70% 35% 0 round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          100% {
            clip-path: inset(0% 70% 70% 0 round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
        }

        @keyframes threeMove {
          0% {
            visibility: visible;
            clip-path: inset(35% 70% 35% 0 round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          14.2857% {
            clip-path: inset(35% 70% 35% 0 round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          28.5714% {
            clip-path: inset(0% 70% 70% 0 round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          42.8571% {
            clip-path: inset(0% 70% 70% 0 round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          57.1428% {
            clip-path: inset(0% 35% 70% round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          71.4285% {
            clip-path: inset(0% 35% 70% round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          85.7142% {
            clip-path: inset(35% round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          100% {
            clip-path: inset(35% 70% 35% 0 round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
        }

        @keyframes fourMove {
          0% {
            visibility: visible;
            clip-path: inset(35% 0% 35% 70% round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          14.2857% {
            clip-path: inset(35% 0% 35% 70% round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          28.5714% {
            clip-path: inset(35% round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          42.8571% {
            clip-path: inset(70% 35% 0% 35% round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          57.1428% {
            clip-path: inset(70% 35% 0% 35% round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          71.4285% {
            clip-path: inset(70% 0 0 70% round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          85.7142% {
            clip-path: inset(70% 0 0 70% round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          100% {
            clip-path: inset(35% 0% 35% 70% round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
        }

        @keyframes fiveMove {
          0% {
            visibility: visible;
            clip-path: inset(70% 0 0 70% round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          14.2857% {
            clip-path: inset(70% 0 0 70% round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          28.5714% {
            clip-path: inset(35% 0% 35% 70% round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          42.8571% {
            clip-path: inset(35% 0% 35% 70% round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          57.1428% {
            clip-path: inset(35% round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          71.4285% {
            clip-path: inset(70% 35% 0% 35% round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          85.7142% {
            clip-path: inset(70% 35% 0% 35% round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          100% {
            clip-path: inset(70% 0 0 70% round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
        }

        @keyframes sixMove {
          0% {
            visibility: visible;
            clip-path: inset(70% 35% 0% 35% round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          14.2857% {
            clip-path: inset(70% 35% 0% 35% round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          28.5714% {
            clip-path: inset(70% 0 0 70% round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          42.8571% {
            clip-path: inset(70% 0 0 70% round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          57.1428% {
            clip-path: inset(35% 0% 35% 70% round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          71.4285% {
            clip-path: inset(35% 0% 35% 70% round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          85.7142% {
            clip-path: inset(35% round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
          100% {
            clip-path: inset(70% 35% 0% 35% round 5%);
            animation-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
          }
        }
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

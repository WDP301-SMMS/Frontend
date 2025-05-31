import {
  About,
  Contact,
  ForgotPassword,
  Home,
  Login,
  Register,
   NurseDashboard,
  ManagerDashboard,
  ResetPassword,
  VerifyOTP,
} from "./lazyRoutes";
import ManagementLayout from "./management/Layout"
import NotFound from "./NotFound";

const basicRoutes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
];

const authenticatedRoutes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/verify-otp",
    element: <VerifyOTP />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
];

export const mainRoutes = [
  ...basicRoutes,
  ...authenticatedRoutes,
  { path: "*", element: <NotFound /> },
];

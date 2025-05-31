import {
  About,
  Contact,
  ForgotPassword,
  Home,
  Login,
  Register,
  NurseDashboard,
  ManagerDashboard,
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
];

export const mainRoutes = [
  ...basicRoutes,
  ...authenticatedRoutes,
  { path: "*", element: <NotFound /> },
];

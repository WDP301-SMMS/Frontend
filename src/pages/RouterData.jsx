import {
  About,
  Contact,
  ForgotPassword,
  Home,
  Login,
  Register,
  NurseDashboard,
  ManagerDashboard,
  AdminDashboard,
  Message,
  Notification,
  ManagementProfile
} from "./lazyRoutes";
import NotFound from "./NotFound";

import ManagementLayout from "./management/Layout"

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

//management routes
const managementRoutes = {
  path: "/management",
  element: <ManagementLayout />,
  children: [
    { path: "nurse", element: <NurseDashboard /> },
    { path: "nurse/message", element: <Message /> },
    { path: "manager", element: <ManagerDashboard />, },
    { path: "admin", element: <AdminDashboard />, },
    { path: "notification", element: <Notification />, },
    { path: "profile", element: <ManagementProfile />, }
  ],
};

export const mainRoutes = [
  ...basicRoutes,
  ...authenticatedRoutes,
  managementRoutes,
  { path: "*", element: <NotFound /> },
];

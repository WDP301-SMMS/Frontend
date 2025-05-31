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
    { path: "manager", element: <ManagerDashboard /> }
  ],
};

export const mainRoutes = [...basicRoutes, ...authenticatedRoutes, managementRoutes];

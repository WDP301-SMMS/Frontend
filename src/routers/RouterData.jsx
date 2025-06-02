import {
  About,
  Contact,
  ForgotPassword,
  Home,
  Login,
  Register,
  Profile,
  Blogs,
  BlogDetail,
  VerifyOTP,
  ResetPassword,
  VaccinHistoryManagement,
  NurseDashboard,
  ManagerDashboard,
  AdminDashboard,
  Message,
  Notification,
  ManagementProfile
} from "./lazyRoutes";
import NotFound from "../pages/basic-pages/NotFound";

import ManagementLayout from "../pages/management/Layout"

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
  {
    path: "/settings",
    element: <Profile />,
  },
  {
    path: "/blogs",
    element: <Blogs />,
  },
  {
    path: "/blog-detail",
    element: <BlogDetail />,
  }
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

const vaccinHistoryManagementRoutes = [
  {
    path: "/vaccination-history-management",
    element: <VaccinHistoryManagement />,
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
  ...vaccinHistoryManagementRoutes,
  managementRoutes,
  { path: "*", element: <NotFound /> },
];

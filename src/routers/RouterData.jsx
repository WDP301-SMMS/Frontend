import {
  Home,
  About,
  Contact,
  Profile,
  Blogs,
  BlogDetail,
  Login,
  Register,
  ForgotPassword,
  VerifyOTP,
  ResetPassword,
  VaccinHistoryManagement,
  NurseDashboard,
  Message,
  ManagerDashboard,
  MedicineInventory,
  NurseManagement,
  StudentManagement,
  AdminDashboard,
  BlogManagement,
  UserManagement,
  Notification,
  ManagementProfile,
  Vaccination,
  HealthCheck,
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
    { path: "manager", element: <ManagerDashboard /> },
    { path: "manager/medicine", element: <MedicineInventory /> },
    { path: "manager/nurse", element: <NurseManagement /> },
    { path: "manager/student", element: <StudentManagement /> },
    { path: "admin", element: <AdminDashboard /> },
    { path: "admin/blogs", element: <BlogManagement /> },
    { path: "admin/users", element: <UserManagement /> },
    { path: "notification", element: <Notification /> },
    { path: "profile", element: <ManagementProfile /> },
    { path: "vaccination", element: <Vaccination /> },
    { path: "health-check", element: <HealthCheck /> },
  ],
};

export const mainRoutes = [
  ...basicRoutes,
  ...authenticatedRoutes,
  ...vaccinHistoryManagementRoutes,
  managementRoutes,
  { path: "*", element: <NotFound /> },
];

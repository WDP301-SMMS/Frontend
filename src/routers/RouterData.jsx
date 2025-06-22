import {
  Home,
  About,
  Contact,
  Profile,
  Blogs,
  BlogDetail,
  ParentHealthProfiles,
  ParentHealthProfileForm,
  ParentHealthProfileDetail,
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
  StudentManagementAdmin,
  ClassManagement,
  PartnerManagement,
  InventoryManagement,
} from "./lazyRoutes";
import NotFound from "../pages/basic-pages/NotFound";
import Layout from "../pages/layout/Layout";
import ManagementLayout from "../pages/management/Layout";

const basicRoutes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "settings",
        element: <Profile />,
      },
      {
        path: "blogs",
        element: <Blogs />,
      },
      {
        path: "blog-detail",
        element: <BlogDetail />,
      },
      {
        path: "health-profiles",
        element: <ParentHealthProfiles />,
      },
      {
        path: "health-profile/new",
        element: <ParentHealthProfileForm />,
      },
      {
        path: "health-profile/:profileId",
        element: <ParentHealthProfileDetail />,
      },
      {
        path: "health-profile/:profileId/edit",
        element: <ParentHealthProfileForm />,
      },
    ],
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
    { path: "admin/students", element: <StudentManagementAdmin /> },
    { path: "admin/classes", element: <ClassManagement /> },
    { path: "admin/partners", element: <PartnerManagement /> },
    { path: "admin/inventory", element: <InventoryManagement /> },
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

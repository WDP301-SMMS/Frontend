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
  CompleteProfile,
  VaccinHistoryManagement,
  Message,
  ManagerDashboard,
  MedicineInventory,
  NurseManagement,
  StudentManagement,
  // AdminDashboard,
  BlogManagement,
  UserManagement,
  Notification,
  // ManagementProfile,
  Vaccination,
  HealthCheck,
  RecordIncident,
  IncidentHistory,
} from "./lazyRoutes";
import NotFound from "../pages/basic-pages/NotFound";
import DashboardHome from "~/pages/management/nurse/DashboardHome";
import NurseDashboard from "~/pages/layout/Dashboard";
import ManageMedicalSupplies from "~/pages/management/nurse/MedicationAndSuppliesManagement/ManageMedicalSupplies/ManageMedicalSupplies";
import SendVaccinationConsent from "~/pages/management/nurse/InjectionManagement/SendVaccinationConsent";
import PrepareVaccinationList from "~/pages/management/nurse/InjectionManagement/PrepareVaccinationList";

const ManageSupplies = () => <div>Quản lý vật tư</div>;
const SendConsent = () => <div>Gửi phiếu đồng thuận</div>;
const PrepareList = () => <div>Chuẩn bị danh sách</div>;
const PrepareCheckupList = () => <div>Chuẩn bị danh sách khám</div>;
const PerformCheckup = () => <div>Thực hiện khám & Ghi nhận</div>;
const SendResultsConsult = () => <div>Gửi kết quả & Tư vấn</div>;
const Settings = () => <div>Cài đặt</div>;
import Layout from "../pages/layout/Layout";
import ManagementLayout from "../pages/management/Layout";
import VaccinateRecord from "~/pages/management/nurse/InjectionManagement/VaccinateRecord";
import PostVaccinationMonitoring from "~/pages/management/nurse/InjectionManagement/PostVaccinationMonitoring";

//ProtectedRoute
import ProtectedRoute from "./ProtectedRoute";
import SendCheckupNotice from "~/pages/management/nurse/MedicalCheckup/SendCheckupNotice";
import { SidebarManager } from "~/pages/management/manager/SideBar";
import CampaignsManagement from "~/pages/management/manager/CampaignsManagement";
import MedicalCheckupManagement from "~/pages/management/manager/MedicalCheckUpManagement";
import { Outlet } from "react-router";
import NursesManagement from "~/pages/management/manager/NursesManagement";
import MedicalSupplyCRUD from "~/pages/management/nurse/MedicationAndSuppliesManagement/ManageMedicalSupplies/MedicalSupplyCRUD";
import SuppliesCRUD from "~/pages/management/nurse/MedicationAndSuppliesManagement/ManageMedicalSupplies/SuppliesCRUD";
import DispenseMedicationAndSupplies from "~/pages/management/nurse/MedicationAndSuppliesManagement/ManageMedications/DispenseMedicationAndSupplies";
import MedicineCRUD from "~/pages/management/nurse/MedicationAndSuppliesManagement/ManageMedications/MedicineCRUD";
import PartnerManagement from "~/pages/management/manager/PartnerManagement";
import HealthCheckCampaignsManagement from "~/pages/management/manager/HealthCheckCampaignsManagement";

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
    ],
  },
];

const authenticatedRoutes = [
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/complete-profile", element: <CompleteProfile /> },
];

export const parentRoutes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        element: <ProtectedRoute allowedRoles={["Parent"]} />,
        children: [
          { path: "health-profiles", element: <ParentHealthProfiles /> },
          { path: "health-profile/new", element: <ParentHealthProfileForm /> },
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
    ],
  },
];

const vaccinHistoryManagementRoutes = [
  {
    element: (
      <ProtectedRoute allowedRoles={["Parent", "Nurse", "Manager", "Admin"]} />
    ),
    children: [
      {
        path: "/vaccination-history-management",
        element: <VaccinHistoryManagement />,
      },
    ],
  },
];

const nurseRoutes = [
  {
    path: "/management/nurse",
    element: (
      <ProtectedRoute allowedRoles={["Nurse"]}>
        <NurseDashboard />
      </ProtectedRoute>
      // <NurseDashboard />
    ),
    children: [
      { path: "", element: <DashboardHome /> },
      { path: "record-incidents", element: <RecordIncident /> },
      { path: "view-medical-records", element: <IncidentHistory /> },
      { path: "message", element: <Message /> },
      { path: "manage-medications", element: <DispenseMedicationAndSupplies /> },
      { path: "manage-supplies", element: <ManageMedicalSupplies /> },
      { path: "send-vaccination-consent", element: <SendVaccinationConsent /> },
      { path: "prepare-vaccination-list", element: <PrepareVaccinationList /> },
      { path: "vaccinate-record", element: <VaccinateRecord /> },
      {
        path: "post-vaccination-monitoring",
        element: <PostVaccinationMonitoring />,
      },
      { path: "send-checkup-notice", element: <SendCheckupNotice /> },
      { path: "prepare-checkup-list", element: <PrepareCheckupList /> },
      { path: "perform-checkup", element: <PerformCheckup /> },
      { path: "send-results-consult", element: <SendResultsConsult /> },
      { path: "settings", element: <Settings /> },
    ],
  },
];

const managerRoutes = [
  {
    path: "/management/manager",
    element: (
      <ProtectedRoute allowedRoles={["Manager"]}>
        <div className="flex h-screen bg-gray-100 font-sans text-gray-800">
          <SidebarManager />
          <Outlet />
        </div>
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <ManagerDashboard /> },
      { path: "campaigns-management", element: <CampaignsManagement /> },
      {
        path: "medical-check-up-management",
        element: <MedicalCheckupManagement />,
      },
      { path: "nurse-management", element: <NursesManagement /> },
      { path: "manage-medications", element: <MedicineCRUD /> },
      { path: "manage-supplies", element: <SuppliesCRUD /> },
      {path: "manage-partner", element: <PartnerManagement /> },
      {path: "manage-health-check-campaigns", element: <HealthCheckCampaignsManagement /> },
    ],
  },
];

const adminRoutes = [
  {
    path: "/management/admin",
    element: (
      <ProtectedRoute allowedRoles={["Admin"]}>
        <NurseDashboard />
      </ProtectedRoute>
    ),
    children: [
      // { path: "", element: <AdminDashboard /> },
      { path: "blogs", element: <BlogManagement /> },
      { path: "users", element: <UserManagement /> },
    ],
  },
];

const sharedManagementRoutes = [
  {
    path: "/management",
    element: (
      <ProtectedRoute allowedRoles={["Nurse, Manager, Admin"]}>
        <NurseDashboard />
      </ProtectedRoute>
    ),
    children: [
      { path: "notification", element: <Notification /> },
      // { path: "profile", element: <ManagementProfile /> },
      { path: "vaccination", element: <Vaccination /> },
      { path: "health-check", element: <HealthCheck /> },
    ],
  },
];


export const mainRoutes = [
  ...basicRoutes,
  ...authenticatedRoutes,
  ...parentRoutes,
  ...vaccinHistoryManagementRoutes,
  ...nurseRoutes,
  ...managerRoutes,
  ...adminRoutes,
  ...sharedManagementRoutes,
  { path: "*", element: <NotFound /> },
];

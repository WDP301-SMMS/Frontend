import {
  Home,
  About,
  Contact,
  Profile,
  Blogs,
  // BlogDetail,
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
  AdminDashboard,
  BlogManagement,
  UserManagement,
  Notification,
  ManagementProfile,
  Vaccination,
  HealthCheck,
  RecordIncident,
  IncidentHistory,
  StudentManagementAdmin,
} from "./lazyRoutes";
import NotFound from "../pages/basic-pages/NotFound";
import DashboardHome from "~/pages/management/nurse/DashboardHome";
import NurseDashboard from "~/pages/layout/Dashboard";
import AdminLayout from "~/pages/management/admin/AdminLayout";
import ManageMedications from "~/pages/management/nurse/MedicationAndSuppliesManagement/ManageMedications/ManageMedications";
import ManageMedicalSupplies from "~/pages/management/nurse/MedicationAndSuppliesManagement/ManageMedicalSupplies/ManageMedicalSupplies";
import SendVaccinationConsent from "~/pages/management/nurse/InjectionManagement/SendVaccinationConsent";
import PrepareVaccinationList from "~/pages/management/nurse/InjectionManagement/PrepareVaccinationList";

const SendResultsConsult = () => <div>Gửi kết quả & Tư vấn</div>;
import Settings from "../pages/setting/Profile";
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
import MedicineCRUD from "~/pages/management/nurse/MedicationAndSuppliesManagement/ManageMedications/MedicineCRUD";
import SuppliesCRUD from "~/pages/management/nurse/MedicationAndSuppliesManagement/ManageMedicalSupplies/SuppliesCRUD";
import ClassManagement from "~/pages/management/admin/ClassManagement";
import PartnerManagement from "~/pages/management/admin/PartnerManagement";
import DispenseMedicationAndSupplies from "~/pages/management/nurse/MedicationAndSuppliesManagement/ManageMedications/DispenseMedicationAndSupplies";
import HealthCheckCampaignsManagement from "~/pages/management/manager/HealthCheckCampaignsManagement";
import PrepareCheckupList from "~/pages/management/nurse/MedicalCheckup/PrepareCheckupList";
import PerformCheckup from "~/pages/management/nurse/MedicalCheckup/PerformCheckup";
import MedicationRequests from "~/pages/management/nurse/MedicationRequestsManagement/MedicationRequests";
import MedicationSchedules from "~/pages/management/nurse/MedicationRequestsManagement/MedicationSchedules";

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
      // {
      //   path: "blog-detail",
      //   element: <BlogDetail />,
      // },
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

      { path: "medication-requests", element: <MedicationRequests /> },
      { path: "medication-schedules", element: <MedicationSchedules /> },

      { path: "message", element: <Message /> },
      {
        path: "manage-medications",
        element: <DispenseMedicationAndSupplies />,
      },
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
        <div className="flex h-screen overflow-hidden bg-gray-100 font-sans text-gray-800">
          <SidebarManager />
          <div className="flex-1 overflow-y-auto">
            <Outlet />
          </div>
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
      { path: "manage-partner", element: <PartnerManagement /> },
      {
        path: "manage-health-check-campaigns",
        element: <HealthCheckCampaignsManagement />,
      },
      { path: "manage-blogs", element: <BlogManagement /> },
      { path: "settings", element: <Settings /> },
    ],
  },
];

const adminRoutes = [
  {
    path: "/management/admin",
    element: (
      <ProtectedRoute allowedRoles={["Admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      // { path: "", element: <AdminDashboard /> },
      // { path: "blogs", element: <BlogManagement /> },
      { path: "users", element: <UserManagement /> },
      { path: "students", element: <StudentManagementAdmin /> },
      { path: "classes", element: <ClassManagement /> },
      { path: "partners", element: <PartnerManagement /> },
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
      { path: "profile", element: <ManagementProfile /> },
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

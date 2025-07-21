import React from "react";

// Basic Routes
const Home = React.lazy(() => import("../pages/basic-pages/Home"));
const About = React.lazy(() => import("../pages/basic-pages/About"));
const Contact = React.lazy(() => import("../pages/basic-pages/Contact"));

const Profile = React.lazy(() => import("../pages/setting/Profile"));
const Blogs = React.lazy(() => import("../pages/blogs/Blogs"));


// Health Profile Routes for Parents
const ParentHealthProfiles = React.lazy(() =>
  import("../pages/health/Profiles")
);
const ParentHealthProfileForm = React.lazy(() =>
  import("../pages/health/ProfileForm")
);
const ParentHealthProfileDetail = React.lazy(() =>
  import("../pages/health/ProfileDetail")
);

// Authenticated Routes
const Login = React.lazy(() => import("../pages/authentication/login/Login"));
const Register = React.lazy(() =>
  import("../pages/authentication/register/Register")
);
const ForgotPassword = React.lazy(() =>
  import("../pages/authentication/forgot-password/ForgotPassword")
);
const CompleteProfile = React.lazy(() =>
  import("../pages/authentication/complete-profile/complete-profile")
);
const VaccinHistoryManagement = React.lazy(() =>
  import("../pages/vaccination/vaccinHistoryManagement")
);

// Management Routes
// Nurse Routes
const NurseDashboard = React.lazy(() => import("../pages/layout/Dashboard"));
const Message = React.lazy(() => import("../pages/management/nurse/Message"));

const RecordIncident = React.lazy(() =>
  import("../pages/management/nurse/MedicalEventManagement/RecordIncidents")
);

const IncidentHistory = React.lazy(() =>
  import("../pages/management/nurse/MedicalEventManagement/ViewMedicalRecords")
);

const DispenseMedicationAndSupplies = React.lazy(() =>
  import(
    "../pages/management/nurse/MedicationAndSuppliesManagement/ManageMedications/DispenseMedicationAndSupplies"
  )
);

const ManageMedications = React.lazy(() =>
  import("../pages/management/nurse/MedicationAndSuppliesManagement/ManageMedications/ManageMedications")
);
// Manager Routes
const ManagerDashboard = React.lazy(() =>
  import("../pages/management/manager/Dashboard")
);
const MedicineInventory = React.lazy(() =>
  import("../pages/management/manager/MedicineInventory")
);
const NurseManagement = React.lazy(() => import("../pages/layout/Dashboard"));
const StudentManagement = React.lazy(() =>
  import("../pages/management/manager/StudentManagement")
);

// Admin Routes
const AdminDashboard = React.lazy(() =>
  import("../pages/management/admin/Dashboard")
);
const BlogManagement = React.lazy(() =>
  import("../pages/management/manager/BlogManagement")
);
const UserManagement = React.lazy(() =>
  import("../pages/management/admin/UserManagement")
);

const ClassManagement = React.lazy(() =>
  import("../pages/management/admin/ClassManagement")
);

const PartnerManagement = React.lazy(() =>
  import("../pages/management/admin/PartnerManagement")
);

const StudentManagementAdmin = React.lazy(() =>
  import("../pages/management/admin/StudentManagement")
);

// Shared Management Routes
const Notification = React.lazy(() =>
  import("../pages/management/shared-page/Notification")
);
const ManagementProfile = React.lazy(() =>
  import("../pages/management/shared-page/Profile")
);
const Vaccination = React.lazy(() =>
  import("../pages/management/shared-page/Vaccination")
);
const HealthCheck = React.lazy(() =>
  import("../pages/management/shared-page/HealthCheck")
);

export {
  Home,
  About,
  Contact,
  Profile,
  Blogs,
  ParentHealthProfiles,
  ParentHealthProfileForm,
  ParentHealthProfileDetail,
  Login,
  Register,
  ForgotPassword,
  CompleteProfile,
  VaccinHistoryManagement,
  AdminDashboard,
  ClassManagement,
  NurseDashboard,
  Message,
  ManagerDashboard,
  MedicineInventory,
  NurseManagement,
  StudentManagement,
  BlogManagement,
  UserManagement,
  PartnerManagement,
  Notification,
  ManagementProfile,
  Vaccination,
  HealthCheck,
  RecordIncident,
  IncidentHistory,
  StudentManagementAdmin,
};

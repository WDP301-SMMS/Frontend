import React from "react";

// Basic Routes
const Home = React.lazy(() => import("../pages/basic-pages/Home"));
const About = React.lazy(() => import("../pages/basic-pages/About"));
const Contact = React.lazy(() => import("../pages/basic-pages/Contact"));

const Profile = React.lazy(() => import("../pages/setting/Profile"));
const Blogs = React.lazy(() => import("../pages/blogs/Blogs"));
const BlogDetail = React.lazy(() => import("../pages/blogs/BlogDetail"));

// Authenticated Routes
const Login = React.lazy(() => import("../pages/authentication/login/Login"));
const Register = React.lazy(() =>
  import("../pages/authentication/register/Register")
);
const ForgotPassword = React.lazy(() =>
  import("../pages/authentication/forgot-password/ForgotPassword")
);
const VerifyOTP = React.lazy(() =>
  import("../pages/authentication/forgot-password/VerifyOTP")
);
const ResetPassword = React.lazy(() =>
  import("../pages/authentication/forgot-password/ResetPassword")
);
const VaccinHistoryManagement = React.lazy(() =>
  import("../pages/vaccination/vaccinHistoryManagement")
);

// Management Routes
// Nurse Routes
const NurseDashboard = React.lazy(() =>
  import("../pages/management/nurse/Dashboard")
);
const Message = React.lazy(() => import("../pages/management/nurse/Message"));

// Manager Routes
const ManagerDashboard = React.lazy(() =>
  import("../pages/management/manager/Dashboard")
);
const MedicineInventory = React.lazy(() =>
  import("../pages/management/manager/MedicineInventory")
);
const NurseManagement = React.lazy(() =>
  import("../pages/management/manager/NurseManagement")
);
const StudentManagement = React.lazy(() =>
  import("../pages/management/manager/StudentManagement")
);

// Admin Routes
const AdminDashboard = React.lazy(() =>
  import("../pages/management/admin/Dashboard")
);
const BlogManagement = React.lazy(() =>
  import("../pages/management/admin/BlogManagement")
);
const UserManagement = React.lazy(() =>
  import("../pages/management/admin/UserManagement")
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
};

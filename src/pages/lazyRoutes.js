import React from "react";

// Basic Routes
const Home = React.lazy(() => import("./basic-pages/Home"));
const About = React.lazy(() => import("./basic-pages/About"));
const Contact = React.lazy(() => import("./basic-pages/Contact"));

// Authenticated Routes
const Login = React.lazy(() => import("./authentication/login/Login"));
const Register = React.lazy(() => import("./authentication/register/Register"));
const ForgotPassword = React.lazy(() =>
  import("./authentication/forgot-password/ForgotPassword")
);

// Management Routes
// Nurse Routes
const NurseDashboard = React.lazy(() => import("./management/nurse/Dashboard"));
const Message = React.lazy(() => import("./management/nurse/Message"));

// Manager Routes
const ManagerDashboard = React.lazy(() =>
  import("./management/manager/Dashboard")
);

// Admin Routes
const AdminDashboard = React.lazy(() =>
  import("./management/manager/Dashboard")
);

// Shared Management Routes
const Notification = React.lazy(() =>
  import("./management/shared-page/Notification")
);
const ManagementProfile = React.lazy(() =>
  import("./management/shared-page/Profile")
);

export {
  Home,
  About,
  Contact,
  Login,
  Register,
  ForgotPassword,
  NurseDashboard,
  ManagerDashboard,
  AdminDashboard,
  Message,
  Notification,
  ManagementProfile,
};

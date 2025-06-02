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
const Register = React.lazy(() => import("../pages/authentication/register/Register"));
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

export {
  Home,
  About,
  Contact,
  Login,
  Register,
  ForgotPassword,
  VerifyOTP,
  ResetPassword,
  VaccinHistoryManagement,
  Profile,
  Blogs,
  BlogDetail
};

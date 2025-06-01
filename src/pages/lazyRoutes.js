import React from "react";

// Basic Routes
const Home = React.lazy(() => import("./basic-pages/Home"));
const About = React.lazy(() => import("./basic-pages/About"));
const Contact = React.lazy(() => import("./basic-pages/Contact"));
const Profile = React.lazy(() => import("./setting/Profile"));

// Authenticated Routes
const Login = React.lazy(() => import("./authentication/login/Login"));
const Register = React.lazy(() => import("./authentication/register/Register"));
const ForgotPassword = React.lazy(() =>
  import("./authentication/forgot-password/ForgotPassword")
);
const VerifyOTP = React.lazy(() =>
  import("./authentication/forgot-password/VerifyOTP")
);
const ResetPassword = React.lazy(() =>
  import("./authentication/forgot-password/ResetPassword")
);

export {
  Home,
  About,
  Contact,
  Profile,
  Login,
  Register,
  ForgotPassword,
  VerifyOTP,
  ResetPassword,
};

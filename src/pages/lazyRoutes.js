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

export { Home, About, Contact, Login, Register, ForgotPassword };

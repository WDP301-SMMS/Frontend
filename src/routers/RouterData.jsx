
import {
  About,
  Contact,
  ForgotPassword,
  Home,
  Profile,
  Login,
  Register,
  ResetPassword,
  VaccinHistoryManagement,
  VerifyOTP,
  Blogs,
  BlogDetail,
} from "./lazyRoutes";
import NotFound from "../pages/basic-pages/NotFound";

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
    element: <VaccinHistoryManagement/>,
  },
];

export const mainRoutes = [
  ...basicRoutes,
  ...authenticatedRoutes,
  ...vaccinHistoryManagementRoutes,
  { path: "*", element: <NotFound /> },
];

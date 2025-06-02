
import {
  About,
  Contact,
  ForgotPassword,
  Home,
  Profile,
  Login,
  Register,
  ResetPassword,
  VerifyOTP,
  Blogs,
  BlogDetail,
} from "./lazyRoutes";
import NotFound from "./NotFound";

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

export const mainRoutes = [
  ...basicRoutes,
  ...authenticatedRoutes,
  { path: "*", element: <NotFound /> },
];

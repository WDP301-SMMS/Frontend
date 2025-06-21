import React from "react";
import Stanford from "~assets/images/stanford.jpg";
import TextInput from "~components/input/TextInput";
import Button from "~/libs/components/button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faLock, faHome } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";

const Login = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
      console.log(values); // 👉 In ra dữ liệu khi submit
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <img src={Stanford} style={{ height: "100vh", objectFit: "cover" }} />
      </div>
      <div className="flex items-center justify-center bg-white p-8 relative">
        <div className="w-full max-w-md text-center">
          <div className="mb-15">
            <h1 className="text-4xl font-bold mb-2">Sign In</h1>
            <p className="text-gray-500">
              Please enter your credentials to access your account.
            </p>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="flex w-full flex-col justify-center items-center space-y-4">
              <TextInput
                name="email"
                placeholder="Enter your email"
                leftIcon={<FontAwesomeIcon icon={faEnvelope} />}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && formik.errors.email}
              />
              <TextInput
                name="password"
                type="password"
                placeholder="Enter your password"
                leftIcon={<FontAwesomeIcon icon={faLock} />}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && formik.errors.password}
              />
            </div>

            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="block"
            >
              <p
                className="text-gray-500 text-end hover:text-primary cursor-pointer"
                style={{ fontSize: "14px", marginTop: "8px" }}
              >
                Forgot Password?
              </p>
            </button>

            <Button type="submit" className="mt-15 w-full">
              Sign In
            </Button>
          </form>

          <p className="text-gray-500 mt-4">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-primary hover:underline"
            >
              Sign Up
            </button>
          </p>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center px-4 py-2 bg-gray-50 hover:bg-primary hover:text-white text-gray-600 rounded-full transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-lg border border-gray-200 hover:border-primary transform hover:scale-105"
            >
              <FontAwesomeIcon icon={faHome} className="mr-2" />
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

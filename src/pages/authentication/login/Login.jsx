import React from "react";
import Stanford from "~assets/images/stanford.jpg";
import TextInput from "~components/input/TextInput";
import Button from "~/libs/components/button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faLock, faArrowLeft, faHome } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";

const Login = () => {
  // const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <img src={Stanford} style={{ height: "100vh", objectFit: "cover" }} />
      </div>
      <div className="flex items-center justify-center bg-white p-8 relative">
        <div className="w-full max-w-md text-center">
          <div className="mb-15">
            <h1 className="text-4xl font-bold mb-2">Sign In</h1>
            <p className="text-gray-500 ">
              Please enter your credentials to access your account.{" "}
            </p>
          </div>
          <form>
            <div className="flex w-full flex-col justify-center items-center space-y-4">
              <TextInput
                placeholder="Enter your email"
                leftIcon={<FontAwesomeIcon icon={faEnvelope} />}
              />
              <TextInput
                placeholder="Enter your password"
                type="password"
                leftIcon={<FontAwesomeIcon icon={faLock} />}
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

            <Button className="mt-15 w-full">Sign In</Button>
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

          {/* Alternative: Home link at bottom - more prominent version */}
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

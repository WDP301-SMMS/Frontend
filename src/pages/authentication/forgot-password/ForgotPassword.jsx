import React from "react";
import Stanford from "~assets/images/stanford.jpg";
import TextInput from "~components/input/TextInput";
import Button from "~/libs/components/button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faLock, faArrowLeft, faHome } from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from "react-router";

const ForgotPassword = () => {
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
            <h1 className="text-4xl font-bold mb-2">Forgot Password</h1>
            <p className="text-gray-500 ">
              Please enter your credentials to recover your account.{" "}
            </p>
          </div>
          <form>
            <div className="flex w-full flex-col justify-center items-center space-y-4">
              <TextInput
                placeholder="Enter your email"
                leftIcon={<FontAwesomeIcon icon={faEnvelope} />}
              />
            </div>
            <Button
              onClick={() => navigate("/verify-otp")}
              className="mt-15 w-full"
            >
              Send OTP
            </Button>
          </form>
          
          {/* Navigation buttons at bottom */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate("/login")}
                className="inline-flex items-center px-4 py-2 bg-blue-50 hover:bg-blue-500 text-blue-600 hover:text-white rounded-full transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-lg border border-blue-200 hover:border-blue-500 transform hover:scale-105"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Back to Login
              </button>
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
    </div>
  );
};

export default ForgotPassword;
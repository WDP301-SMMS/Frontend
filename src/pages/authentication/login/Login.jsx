import React from "react";
import "./Login.css";
import Stanford from "~assets/images/stanford.jpg";
import TextInput from "~components/input/TextInput";
import Button from "~/libs/components/button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";



const Login = () => {
  // const { register, handleSubmit } = useForm();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <img src={Stanford} style={{ height: "100vh", objectFit: "cover" }} />
      </div>
      <div className="flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md text-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Sign In</h1>
            <p className="text-gray-500 mb-10">
              Please enter your credentials to access your account.{" "}
            </p>
          </div>
          <form>
            <div className="flex w-full flex-col justify-center items-center space-y-4">
              <TextInput placeholder="Enter your email" leftIcon={<FontAwesomeIcon icon={faEnvelope} />} />
              <TextInput placeholder="Enter your password" type="password" leftIcon={<FontAwesomeIcon icon={faLock} />} />
            </div>
            <a href="/forgot-password" className="block">
              <p
                className="text-gray-500 text-end hover:text-blue-600 cursor-pointer"
                style={{ fontSize: "14px", marginTop: "8px" }}
              >
                Forgot Password?
              </p>
            </a>
            <Button className="mt-14 w-full">Sign In</Button>
          </form>
          <p className="text-gray-500 mt-4">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

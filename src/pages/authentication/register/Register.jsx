import React from "react";
import Stanford from "~assets/images/stanford_2.jpg";
import TextInput from "~components/input/TextInput";
import Button from "~/libs/components/button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faArrowLeft, faHome } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";

const Register = () => {
  // const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <img src={Stanford} style={{ height: "100vh", objectFit: "cover" }} />
      </div>
      <div className="flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md text-center">
          <div className="mb-15">
            <h1 className="text-4xl font-bold mb-2">Sign Up</h1>
            <p className="text-gray-500">
              Already Have An Account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-primary hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
          <form>
            <div className="grid grid-cols-2 gap-4 ">
              <TextInput placeholder="First Name" />
              <TextInput placeholder="Last Name" />
              <div className="col-span-2">
                <TextInput placeholder="Phone Number" type="tel" />
              </div>
              <div className="col-span-2">
                <TextInput placeholder="Enter your email" />
              </div>
              <TextInput placeholder="Enter your password" type="password" />
              <TextInput placeholder="Re-enter your password" type="password" />
            </div>
            <Button className="mt-15 w-full">Sign Up</Button>
          </form>
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

export default Register;

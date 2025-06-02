import React from "react";
import Stanford from "~assets/images/stanford.jpg";
import TextInput from "~components/input/TextInput";
import Button from "~/libs/components/button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router";

const ForgotPassword = () => {
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
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

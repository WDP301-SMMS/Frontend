import React from "react";
import Stanford from "~assets/images/stanford.jpg";
import TextInput from "~components/input/TextInput";
import Button from "~/libs/components/button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router";
import { faLock } from "@fortawesome/free-solid-svg-icons";

const ResetPassword = () => {
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
            <h1 className="text-4xl font-bold mb-2">Reset Password</h1>
            <p className="text-gray-500 ">
              Set a new password and it should be 8-10 characters long{" "}
            </p>
          </div>
          <form>
            <div className="flex w-full flex-col justify-center items-center space-y-4">
              <TextInput
                placeholder="Set your password"
                leftIcon={<FontAwesomeIcon icon={faLock} />}
              />
              <TextInput
                placeholder="Re-enter your password"
                leftIcon={<FontAwesomeIcon icon={faLock} />}
              />
            </div>
            <Button
              onClick={() => navigate("/login")}
              className="mt-15 w-full"
            >
              Reset Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

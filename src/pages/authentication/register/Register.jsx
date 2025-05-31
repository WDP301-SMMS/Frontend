import React from "react";
import Stanford from "~assets/images/stanford_2.jpg";
import TextInput from "~components/input/TextInput";
import Button from "~/libs/components/button/Button";

const Register = () => {
  // const { register, handleSubmit } = useForm();

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
              <a href="/login" className="text-blue-600 hover:underline">
                Sign In
              </a>
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
                <TextInput
                  placeholder="Enter your email"
                />
              </div>
              <TextInput
                placeholder="Enter your password"
                type="password"
              />
              <TextInput
                placeholder="Re-enter your password"
                type="password"
              />
            </div>
            <Button className="mt-15 w-full">Sign Up</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

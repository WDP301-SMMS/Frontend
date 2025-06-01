import React, { useState } from "react";
import { Mail, ArrowLeft, Lock } from "lucide-react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setOtpError("");

    // Simulate API call to send OTP
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 2000);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setOtpError("");

    // Simulate OTP verification API call
    setTimeout(() => {
      if (otp.length === 6 && /^\d+$/.test(otp)) {
        setIsOtpVerified(true);
      } else {
        setOtpError("Please enter a valid 6-digit OTP");
      }
      setIsLoading(false);
    }, 2000);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setPasswordError("");

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    // Simulate API call to reset password
    setTimeout(() => {
      setIsLoading(false);
      setIsPasswordReset(true);
    }, 2000);
  };

  const handleBackToLogin = () => {
    // Navigate back to login
    console.log("Navigate back to login");
  };

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 via-white rounded-3xl mt-[20px] mb-[20px] to-blue-100 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-400 to-blue-600 rounded-bl-full opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-300 to-blue-500 rounded-tr-full opacity-15"></div>

      <div className="w-full max-w-6xl flex items-center justify-between">
        {/* Left side - GIF Illustration */}
        <div className="hidden lg:flex flex-1 justify-center items-center">
          <div className="relative">
            <div className="relative bg-white/20 backdrop-blur-sm rounded-3xl p-[20px] m-[25px] shadow-2xl">
              <img
                src="./src/assets/original-6b5f1f5fa9f4013ef00331bf60e96b9b.gif"
                alt="Forgot Password Animation"
                className="w-full max-w-md h-auto rounded-2xl shadow-lg"
                style={{ maxHeight: "400px", objectFit: "contain" }}
              />
            </div>
            {/* Decorative floating elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500/20 rounded-full animate-pulse"></div>
            <div
              className="absolute -bottom-6 -left-6 w-12 h-12 bg-purple-500/10 rounded-full animate-bounce"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute top-1/4 -left-8 w-6 h-6 bg-green-500/15 rounded-full animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="flex-1 max-w-md mx-auto lg:mx-0">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            {!isSubmitted ? (
              <>
                {/* Email Input Form */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Forgot Your Password?
                  </h1>
                  <p className="text-gray-600 text-sm">
                    Don't worry! Enter your email address and we'll send you an
                    OTP.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Sending...
                      </div>
                    ) : (
                      "SEND OTP"
                    )}
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <button
                    onClick={handleBackToLogin}
                    className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    <ArrowLeft size={16} className="mr-1" />
                    Back to Login
                  </button>
                </div>
              </>
            ) : !isOtpVerified ? (
              <>
                {/* OTP Input Form */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Enter OTP
                  </h1>
                  <p className="text-gray-600 text-sm">
                    We've sent a 6-digit OTP to <strong>{email}</strong>. Please
                    enter it below.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="otp"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      OTP Code
                    </label>
                    <input
                      id="otp"
                      type="text"
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow only digits and enforce 6-digit limit
                        if (value.length <= 6 && /^\d*$/.test(value)) {
                          setOtp(value);
                        }
                      }}
                      onKeyPress={(e) => {
                        // Prevent non-numeric input and 'e' character
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      className="block w-full px-3 py-3 text-red-600 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center tracking-widest"
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      required
                    />
                    {otpError && (
                      <p className="mt-2 text-sm text-red-600">{otpError}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleOtpSubmit}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Verifying...
                      </div>
                    ) : (
                      "VERIFY OTP"
                    )}
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setOtp("");
                      setOtpError("");
                    }}
                    className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    <ArrowLeft size={16} className="mr-1" />
                    Resend OTP
                  </button>
                </div>
              </>
            ) : !isPasswordReset ? (
              <>
                {/* Password Reset Form */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Reset Your Password
                  </h1>
                  <p className="text-gray-600 text-sm">
                    Enter your new password below.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="block w-full pl-10 text-gray-600 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter new password"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="block w-full pl-10 pr-3 text-gray-600 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Confirm new password"
                        required
                      />
                    </div>
                    {passwordError && (
                      <p className="mt-2 text-sm text-red-600">
                        {passwordError}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handlePasswordSubmit}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Updating...
                      </div>
                    ) : (
                      "RESET PASSWORD"
                    )}
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <button
                    onClick={handleBackToLogin}
                    className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    <ArrowLeft size={16} className="mr-1" />
                    Back to Login
                  </button>
                </div>
              </>
            ) : (
              /* Success State after Password Reset */
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Password Reset Successful!
                </h2>
                <p className="text-gray-600 mb-6">
                  Your password has been successfully updated. You can now log
                  in with your new password.
                </p>
                <button
                  onClick={handleBackToLogin}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Back to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

import React, { useEffect, useState } from "react";
import Stanford from "~assets/images/stanford.jpg";
import TextInput from "~components/input/TextInput";
import Button from "~/libs/components/button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import authService from "~/libs/api/services/authService";
import { LoaderCircle, MoveLeft } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setInterval(() => setResendCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const sendOtp = async () => {
    if (!email.trim()) return toast.warning("Vui lòng nhập email.");
    if (!isValidEmail(email)) return toast.warning("Email không hợp lệ.");

    try {
      setLoading(true);
      await authService.forgotPassword({ email });
      toast.success("Đã gửi mã OTP đến email của bạn.");
      setStep("otp");
      setResendCountdown(60);
    } catch {
      toast.error("Gửi OTP thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!/^\d{6}$/.test(token)) {
      return toast.warning("Mã OTP phải gồm đúng 6 chữ số.");
    }

    try {
      setLoading(true);
      const res = await authService.verifyOTP({ email, token });
      const receivedToken = res?.data?.resetToken;
      if (!receivedToken) return toast.error("Không nhận được mã đặt lại từ server.");
      setResetToken(receivedToken);
      toast.success("Xác thực OTP thành công.");
      setStep("reset");
    } catch {
      toast.error("OTP không chính xác hoặc đã hết hạn.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!newPassword || !confirmPassword)
      return toast.warning("Vui lòng nhập đầy đủ mật khẩu.");

    if (newPassword.length < 6)
      return toast.warning("Mật khẩu phải có ít nhất 6 ký tự.");

    if (newPassword !== confirmPassword)
      return toast.warning("Mật khẩu xác nhận không khớp.");

    try {
      setLoading(true);
      await authService.resetPassword({
        email,
        resetToken,
        newPassword,
        confirmNewPassword: confirmPassword,
      });
      toast.success("Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.");
      navigate("/login");
    } catch {
      toast.error("Đặt lại mật khẩu thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === "email") sendOtp();
    else if (step === "otp") verifyOtp();
    else if (step === "reset") resetPassword();
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left side image */}
      <div className="hidden md:block">
        <img
          src={Stanford}
          alt="Forgot Password"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side form */}
      <div className="flex items-center justify-center bg-gradient-to-br from-white via-gray-100 to-white p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">Quên mật khẩu</h1>
            <p className="text-sm text-gray-600 mt-2">
              {step === "email" && "Nhập email để nhận mã OTP xác nhận."}
              {step === "otp" && "Nhập mã OTP đã được gửi đến email của bạn."}
              {step === "reset" && "Nhập mật khẩu mới của bạn bên dưới."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email field */}
            <TextInput
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={step !== "email"}
              leftIcon={<FontAwesomeIcon icon={faEnvelope} />}
            />

            {/* OTP field */}
            {step === "otp" && (
              <TextInput
                placeholder="Mã OTP 6 chữ số"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
            )}

            {/* New password fields */}
            {step === "reset" && (
              <>
                <TextInput
                  type="password"
                  placeholder="Mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextInput
                  type="password"
                  placeholder="Xác nhận mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </>
            )}

            {/* Submit button with loader */}
            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2"
              disabled={loading}
            >
              <span className="flex items-center gap-2">
                {loading && (
                  <LoaderCircle className="animate-spin w-4 h-4 shrink-0" />
                )}
                {step === "email"
                  ? "Gửi mã OTP"
                  : step === "otp"
                    ? "Xác nhận OTP"
                    : "Đặt lại mật khẩu"}
              </span>
            </Button>

            {/* Resend OTP countdown */}
            {step === "otp" && (
              <div className="text-sm text-center text-gray-600">
                {resendCountdown > 0 ? (
                  <>Gửi lại OTP sau <strong>{resendCountdown}s</strong></>
                ) : (
                  <button
                    type="button"
                    onClick={sendOtp}
                    className="text-blue-600 hover:underline"
                  >
                    Gửi lại mã OTP
                  </button>
                )}
              </div>
            )}
          </form>

          {/* Back to login button */}
          <div className="text-center">
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 hover:underline"
            >
              <MoveLeft className="w-4 h-4" />
              Quay về trang đăng nhập
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

import { useEffect } from "react";
import Stanford from "~assets/images/stanford.jpg";
import Google from "~/assets/images/google.svg";
import TextInput from "~components/input/TextInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faHome } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "~/libs/contexts/AuthContext";
import { Loader } from "lucide-react";
import { toast } from "react-toastify";
import authService from "~/libs/api/services/authService";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
      password: Yup.string().required("Mật khẩu là bắt buộc"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await authService.login(values);
        login(response.data.accessToken);
        toast.success("Đăng nhập thành công!", {
          position: "bottom-right",
          autoClose: 3000,
        });
      } catch (error) {
        toast.error(error.response.data.message, {
          position: "bottom-right",
          autoClose: 3000,
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleGoogle = async () => {
    try {
      const data = await authService.openGoogleLoginPopup();
      const { accessToken, isNewUser, hasMissingFields } = data;

      if (!accessToken) {
        toast.error("Không nhận được access token");
        return;
      }

      localStorage.setItem("hasGoogleLoggedIn", "true");

      await login(accessToken);
      toast.success("Đăng nhập thành công!", {
        position: "bottom-right",
        autoClose: 3000,
      });

      if (isNewUser || hasMissingFields) {
        navigate("/complete-profile");
      }
    } catch (error) {
      toast.error(error.message || "Lỗi đăng nhập Google");
    }
  };

  useEffect(() => {
    const receiveMessage = async (event) => {
      if (event.origin !== "http://localhost:3000") return;

      const { accessToken, isNewUser, hasMissingFields } = event.data;

      if (!accessToken) {
        toast.error("Không nhận được access token");
        return;
      }

      localStorage.setItem("hasGoogleLoggedIn", "true");

      await login(accessToken);
      toast.success("Đăng nhập thành công!", {
        position: "bottom-right",
        autoClose: 3000,
      });

      if (isNewUser || hasMissingFields) {
        navigate("/complete-profile");
      }
    };

    window.addEventListener("message", receiveMessage);
    return () => window.removeEventListener("message", receiveMessage);
  }, [login, navigate]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen w-full">
      {/* Left Image */}
      <div className="hidden md:block">
        <img
          src={Stanford}
          alt="Stanford University"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Form */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md text-center">
          <h1 className="text-4xl font-bold mb-2 text-primary">Đăng nhập</h1>
          <p className="text-gray-500 mb-6">
            Vui lòng nhập thông tin đăng nhập để truy cập tài khoản của bạn.
          </p>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <TextInput
              name="email"
              placeholder="Nhập địa chỉ email của bạn"
              leftIcon={<FontAwesomeIcon icon={faEnvelope} />}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && formik.errors.email}
            />
            <TextInput
              name="password"
              type="password"
              placeholder="Nhập mật khẩu của bạn"
              leftIcon={<FontAwesomeIcon icon={faLock} />}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && formik.errors.password}
            />

            <div className="text-end">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-gray-500 hover:text-primary"
              >
                Quên mật khẩu?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-md bg-primary text-white font-semibold hover:bg-primary/90 transition duration-300"
              disabled={loading}
            >
              {loading ? (
                <Loader className="animate-spin w-5 h-5 mx-auto" />
              ) : (
                "Đăng nhập"
              )}
            </button>

            <button
              type="button"
              onClick={handleGoogle}
              className="w-full py-3 border border-primary text-primary rounded-md flex items-center justify-center gap-3 hover:bg-blue-50 transition duration-300"
            >
              <img src={Google} alt="Google" className="w-5 h-5" />
              <span>Đăng nhập bằng Google</span>
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-4">
            Bạn chưa có tài khoản?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-primary hover:underline"
            >
              Đăng ký
            </button>
          </p>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center px-4 py-2 border border-primary text-primary rounded-full hover:bg-primary hover:text-white transition-all duration-300 text-sm font-medium shadow-sm transform hover:scale-105"
            >
              <FontAwesomeIcon icon={faHome} className="mr-2" />
              Quay lại Trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

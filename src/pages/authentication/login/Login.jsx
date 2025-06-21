import React from "react";
import Stanford from "~assets/images/stanford.jpg";
import TextInput from "~components/input/TextInput";
import Button from "~/libs/components/button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faLock, faHome } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "~/libs/contexts/AuthContext";
import api from '~/libs/hooks/axiosInstance';
import { Loader } from 'lucide-react';
import { toast } from 'react-toastify';

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
        const response = await api.post('/auth/login', values);
        login(response.data.data);
        toast.success("Đăng nhập thành công!", {
          position: "bottom-right",
          autoClose: 3000,
        });
        navigate('/');
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error("Email hoặc mật khẩu không đúng.", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          toast.error("Đã xảy ra lỗi. Vui lòng thử lại.", {
            position: "bottom-right",
            autoClose: 3000,
          });
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <img src={Stanford} style={{ height: "100vh", objectFit: "cover" }} alt="Stanford University" />
      </div>
      <div className="flex items-center justify-center bg-white p-8 relative">
        <div className="w-full max-w-md text-center">
          <div className="mb-15">
            <h1 className="text-4xl font-bold mb-2">Đăng nhập</h1>
            <p className="text-gray-500">
              Vui lòng nhập thông tin đăng nhập để truy cập tài khoản của bạn.
            </p>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="flex w-full flex-col justify-center items-center space-y-4">
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
                Quên mật khẩu?
              </p>
            </button>

            <Button type="submit" className="mt-15 w-full">
              {loading ? <Loader className="animate-spin w-5 h-5 mx-auto" /> : 'Đăng nhập'}
            </Button>
          </form>

          <p className="text-gray-500 mt-4">
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
              className="inline-flex items-center px-4 py-2 bg-gray-50 hover:bg-primary hover:text-white text-gray-600 rounded-full transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-lg border border-gray-200 hover:border-primary transform hover:scale-105"
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
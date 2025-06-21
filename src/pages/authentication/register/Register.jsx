import React from "react";
import Stanford from "~assets/images/stanford_2.jpg";
import TextInput from "~components/input/TextInput";
import Button from "~/libs/components/button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faHome, faUser, faPhone, faEnvelope, faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from 'react-toastify';
import api from '~/libs/hooks/axiosInstance';
import DatePicker from "react-datepicker";
import { parse, format, isValid } from "date-fns";
import { Loader } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      dob: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Họ và tên là bắt buộc"),
      phoneNumber: Yup.string()
        .matches(/^[0-9]+$/, "Số điện thoại không hợp lệ")
        .required("Số điện thoại là bắt buộc"),
      email: Yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
      password: Yup.string()
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
        .required("Mật khẩu là bắt buộc"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Mật khẩu xác nhận không khớp')
        .required("Xác nhận mật khẩu là bắt buộc"),
      dob: Yup.string()
        .required("Ngày sinh là bắt buộc")
        .matches(/^\d{2}\/\d{2}\/\d{4}$/, "Định dạng phải là dd/mm/yyyy")
        .test("isValidDate", "Ngày không hợp lệ hoặc ở tương lai", (value) => {
          if (!value) return false;
          const parsed = parse(value, "dd/MM/yyyy", new Date());
          return isValid(parsed) && parsed <= new Date();
        }),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const dataToSubmit = {
          username: values.username,
          password: values.password,
          confirmPassword: values.confirmPassword,
          email: values.email,
          dob: values.dob, // already formatted dd/MM/yyyy
          phone: values.phoneNumber,
        };

        await api.post('/auth/register', dataToSubmit);

        toast.success("Đăng ký thành công! Vui lòng xác nhận qua email bạn vừa đăng ký.", {
          position: "bottom-right",
          autoClose: 3000,
        });
        resetForm();
        navigate('/login');
      } catch (error) {
        let errorMessage = "Đã xảy ra lỗi. Vui lòng thử lại.";
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        toast.error(errorMessage, {
          position: "bottom-right",
          autoClose: 3000,
        });
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
      <div className="flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md text-center">
          <div className="mb-15">
            <h1 className="text-4xl font-bold mb-2">Đăng ký</h1>
            <p className="text-gray-500">
              Đã có tài khoản?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-primary hover:underline"
              >
                Đăng nhập
              </button>
            </p>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <TextInput
                  name="username"
                  placeholder="Họ và tên"
                  leftIcon={<FontAwesomeIcon icon={faUser} />}
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.username && formik.errors.username}
                />
              </div>
              <div className="col-span-2">
                <TextInput
                  name="phoneNumber"
                  placeholder="Số điện thoại"
                  type="tel"
                  leftIcon={<FontAwesomeIcon icon={faPhone} />}
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phoneNumber && formik.errors.phoneNumber}
                />
              </div>
              <div className="col-span-2">
                <TextInput
                  name="email"
                  placeholder="Nhập địa chỉ email của bạn"
                  leftIcon={<FontAwesomeIcon icon={faEnvelope} />}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && formik.errors.email}
                />
              </div>
              <div className="col-span-2 relative">
                <div className="flex items-center border rounded px-3 py-2 w-full">
                  <FontAwesomeIcon icon={faCalendarDays} className="mr-2" />
                  <DatePicker
                    placeholderText="dd/mm/yyyy"
                    dateFormat="dd/MM/yyyy"
                    selected={
                      formik.values.dob
                        ? parse(formik.values.dob, "dd/MM/yyyy", new Date())
                        : null
                    }
                    onChange={(date) => {
                      const formatted = format(date, "dd/MM/yyyy");
                      formik.setFieldValue("dob", formatted);
                    }}
                    className="w-full outline-none"
                    maxDate={new Date()}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                </div>
                {formik.touched.dob && formik.errors.dob && (
                  <p className="text-red-500 text-sm mt-1 text-left">{formik.errors.dob}</p>
                )}
              </div>
              <TextInput
                name="password"
                placeholder="Nhập mật khẩu của bạn"
                type="password"
                leftIcon={<FontAwesomeIcon icon={faLock} />}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && formik.errors.password}
              />
              <TextInput
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                type="password"
                leftIcon={<FontAwesomeIcon icon={faLock} />}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmPassword && formik.errors.confirmPassword}
              />
            </div>
            <Button type="submit" className="mt-15 w-full" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? <Loader className="animate-spin w-5 h-5 mx-auto" /> : 'Đăng ký'}
            </Button>
          </form>
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

export default Register;

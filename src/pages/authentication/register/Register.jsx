import { useState, useRef } from "react";
import Stanford from "~assets/images/stanford_2.jpg";
import TextInput from "~components/input/TextInput";
import Button from "~/libs/components/button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faHome,
  faUser,
  faPhone,
  faEnvelope,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import api from "~/libs/hooks/axiosInstance";
import { Loader } from "lucide-react";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Typography,
} from "@mui/material";

const Register = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      dob: null,
      gender: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Họ và tên là bắt buộc"),
      phoneNumber: Yup.string()
        .matches(/^[0-9]+$/, "Số điện thoại không hợp lệ")
        .required("Số điện thoại là bắt buộc"),
      email: Yup.string()
        .email("Email không hợp lệ")
        .required("Email là bắt buộc"),
      password: Yup.string()
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
        .required("Mật khẩu là bắt buộc"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Mật khẩu xác nhận không khớp")
        .required("Xác nhận mật khẩu là bắt buộc"),
      dob: Yup.date()
        .nullable()
        .required("Ngày sinh là bắt buộc")
        .max(new Date(), "Ngày không hợp lệ hoặc ở tương lai"),
      gender: Yup.string().required("Giới tính là bắt buộc"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const dataToSubmit = {
          username: values.username,
          password: values.password,
          confirmPassword: values.confirmPassword,
          email: values.email,
          dob: values.dob ? dayjs(values.dob).format("DD/MM/YYYY") : "",
          phone: values.phoneNumber,
          gender: values.gender,
        };

        await api.post("/auth/register", dataToSubmit);

        toast.success(
          "Đăng ký thành công! Vui lòng xác nhận qua email bạn vừa đăng ký.",
          { position: "bottom-right", autoClose: 3000 }
        );

        resetForm();
        navigate("/login");
      } catch (error) {
        if (error.response?.data?.errors?.length > 0) {
          error.response.data.errors.forEach((err) => {
            if (err?.msg) {
              toast.error(err.msg, {
                position: "bottom-right",
                autoClose: 3000,
              });
            }
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
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      <div className="hidden md:block">
        <img
          src={Stanford}
          alt="Stanford University"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md text-center">
          <h1 className="text-4xl font-bold mb-2 text-primary">Đăng ký</h1>
          <p className="text-gray-500 mb-6">
            Đã có tài khoản?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-primary hover:underline"
            >
              Đăng nhập
            </button>
          </p>

          <form onSubmit={formik.handleSubmit} className="space-y-4 text-left">
            <TextInput
              name="username"
              placeholder="Họ và tên"
              leftIcon={<FontAwesomeIcon icon={faUser} />}
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && formik.errors.username}
            />

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

            <TextInput
              name="email"
              placeholder="Email"
              leftIcon={<FontAwesomeIcon icon={faEnvelope} />}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && formik.errors.email}
            />

            {/* Ngày sinh */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => {
                  setOpen(false);
                  formik.setFieldTouched("dob", true);
                }}
                value={formik.values.dob}
                onChange={(newValue) => formik.setFieldValue("dob", newValue)}
                slotProps={{
                  textField: {
                    sx: {
                      opacity: 0,
                      width: 0,
                      height: 0,
                      position: "absolute",
                      pointerEvents: "none",
                    },
                  },
                }}
              />
              <div
                onClick={() => setOpen(true)}
                className={`flex items-center border rounded px-3 py-2 w-full cursor-pointer ${formik.touched.dob && formik.errors.dob
                    ? "border-red-500"
                    : "border-gray-300"
                  }`}
              >
                <FontAwesomeIcon icon={faCalendarDays} className="mr-2" />
                <span
                  className={`${formik.values.dob ? "text-black" : "text-gray-400"
                    }`}
                >
                  {formik.values.dob
                    ? dayjs(formik.values.dob).format("DD/MM/YYYY")
                    : "dd/mm/yyyy"}
                </span>
              </div>
              {formik.touched.dob && formik.errors.dob && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.dob}
                </p>
              )}
            </LocalizationProvider>

            {/* Giới tính */}
            <FormControl component="fieldset" className="mt-2">
              <FormLabel component="legend">Giới tính</FormLabel>
              <RadioGroup
                row
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <FormControlLabel value="MALE" control={<Radio />} label="Nam" />
                <FormControlLabel value="FEMALE" control={<Radio />} label="Nữ" />
              </RadioGroup>
              {formik.touched.gender && formik.errors.gender && (
                <Typography className="text-red-500 text-sm">
                  {formik.errors.gender}
                </Typography>
              )}
            </FormControl>

            <TextInput
              name="password"
              placeholder="Mật khẩu"
              type="password"
              leftIcon={<FontAwesomeIcon icon={faLock} />}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && formik.errors.password}
            />

            <TextInput
              name="confirmPassword"
              placeholder="Xác nhận mật khẩu"
              type="password"
              leftIcon={<FontAwesomeIcon icon={faLock} />}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.confirmPassword &&
                formik.errors.confirmPassword
              }
            />

            <Button
              type="submit"
              className="mt-6 w-full bg-primary hover:bg-primary/90 text-white"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? (
                <Loader className="animate-spin w-5 h-5 mx-auto" />
              ) : (
                "Đăng ký"
              )}
            </Button>
          </form>

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

export default Register;

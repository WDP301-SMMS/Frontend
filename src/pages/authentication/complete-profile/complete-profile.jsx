import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  Stack,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "~/libs/hooks/axiosInstance";
import { toast } from "react-toastify";

const CompleteProfile = () => {
  const [error, setError] = useState("");

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, "Mật khẩu phải ít nhất 6 ký tự")
      .required("Vui lòng nhập mật khẩu mới"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Mật khẩu xác nhận không khớp")
      .required("Vui lòng xác nhận mật khẩu"),
    dob: Yup.date()
      .nullable()
      .required("Vui lòng nhập ngày sinh")
      .max(dayjs(), "Ngày sinh không thể ở trong tương lai"),
    phone: Yup.string()
      .matches(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ")
      .required("Vui lòng nhập số điện thoại"),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
      dob: null,
      phone: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setError("");
      try {
        await api.put("/user/complete-profile", {
          password: values.password,
          dob: values.dob ? dayjs(values.dob).format("DD/MM/YYYY") : null,
          phone: values.phone,
        });

        toast.success("Cập nhật thành công!", { autoClose: 3000 });
        window.location.href = "/";
      } catch (err) {
        if (err.response?.data?.errors?.length > 0) {
          err.response.data.errors.forEach((e) => {
            setError(e.msg); // Hoặc toast.error(e.msg)
          });
        } else {
          setError(err.response?.data?.message || "Cập nhật thất bại.");
        }
      }
    }
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="sm" className="min-h-screen flex items-center justify-center p-4">
        <Box
          className="w-full rounded-xl shadow-lg bg-white p-6 sm:p-10 border-t-[6px] border-primary"
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            className="text-primary font-bold mb-8"
          >
            Hoàn thiện hồ sơ y tế
          </Typography>

          <form onSubmit={formik.handleSubmit} noValidate>
            <Stack spacing={3}>
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Mật khẩu mới"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                sx={{
                  "& .MuiInputLabel-root.Mui-focused": { color: "var(--tw-prose-primary)" },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgb(59 130 246)", // blue-500
                  },
                }}
              />

              <TextField
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                label="Xác nhận mật khẩu"
                type="password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.confirmPassword &&
                  Boolean(formik.errors.confirmPassword)
                }
                helperText={
                  formik.touched.confirmPassword && formik.errors.confirmPassword
                }
                sx={{
                  "& .MuiInputLabel-root.Mui-focused": { color: "var(--tw-prose-primary)" },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgb(59 130 246)",
                  },
                }}
              />

              <DatePicker
                label="Ngày sinh"
                value={formik.values.dob}
                onChange={(newValue) => formik.setFieldValue("dob", newValue)}
                onBlur={() => formik.setFieldTouched("dob", true)}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: formik.touched.dob && Boolean(formik.errors.dob),
                    helperText: formik.touched.dob && formik.errors.dob,
                    sx: {
                      "& .MuiInputLabel-root.Mui-focused": { color: "var(--tw-prose-primary)" },
                      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgb(59 130 246)",
                      },
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                id="phone"
                name="phone"
                label="Số điện thoại"
                type="tel"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
                sx={{
                  "& .MuiInputLabel-root.Mui-focused": { color: "var(--tw-prose-primary)" },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgb(59 130 246)",
                  },
                }}
              />

              {error && <Alert severity="error">{error}</Alert>}

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={2}>
                <Button
                  variant="outlined"
                  fullWidth
                  color="inherit"
                  onClick={() => (window.location.href = "/")}
                  className="border-primary text-primary hover:bg-primary/10 hover:border-primary"
                >
                  Cập nhật sau
                </Button>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  Cập nhật thông tin
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default CompleteProfile;

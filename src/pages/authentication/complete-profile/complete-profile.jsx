import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  Stack,
  Avatar,
} from "@mui/material";
import Background from "~assets/images/completeProfile.png";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "~/libs/hooks/axiosInstance";
import { toast } from "react-toastify";
import HealthIcon from "@mui/icons-material/HealthAndSafety";
import { motion } from "framer-motion";

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
    validationSchema,
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
          err.response.data.errors.forEach((e) => setError(e.msg));
        } else {
          setError(err.response?.data?.message || "Cập nhật thất bại.");
        }
      }
    },
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage: `url(${Background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(4px)",
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Box
              className="w-full rounded-xl shadow-xl bg-white p-6 sm:p-10 border-t-[6px] border-primary"
            >
              <Stack alignItems="center" spacing={1} mb={4}>
                <Avatar
                  sx={{ bgcolor: "#3b82f6", width: 64, height: 64 }}
                >
                  <HealthIcon />
                </Avatar>
                <Typography
                  variant="h5"
                  className="font-bold text-primary"
                >
                  Hoàn thiện hồ sơ y tế
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Giúp chúng tôi phục vụ bạn tốt hơn bằng cách cập nhật thông tin cá nhân.
                </Typography>
              </Stack>

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
                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
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
                  />

                  {error && <Alert severity="error">{error}</Alert>}

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={2}>
                    <Button
                      variant="outlined"
                      fullWidth
                      color="inherit"
                      onClick={() => (window.location.href = "/")}
                      className="border-primary text-primary hover:bg-primary/10"
                    >
                      Cập nhật sau
                    </Button>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-blue-200"
                    >
                      Cập nhật thông tin
                    </Button>
                  </Stack>
                </Stack>
              </form>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </LocalizationProvider>
  );
};

export default CompleteProfile;

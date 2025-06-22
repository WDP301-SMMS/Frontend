import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  CssBaseline,
  Card,
  CardContent,
  Grid,
  Paper,
  Avatar,
  Badge,
  Button,
  TextField,
  Chip,
  createTheme,
  ThemeProvider,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  LocalHospital as LocalHospitalIcon,
  Warning as WarningIcon,
  Assessment as AssessmentIcon,
  Vaccines as VaccinesIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  NotificationsActive as NotificationsActiveIcon,
  Edit as EditIcon,
  Phone as PhoneIcon,
  DateRange as DateRangeIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { debounce } from "lodash";
import { userService } from "~/libs/api";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2", light: "#42a5f5", dark: "#1565c0" },
    secondary: { main: "#9c27b0", light: "#ba68c8", dark: "#7b1fa2" },
    background: { default: "#f5f5f5", paper: "#ffffff" },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease",
          "&:hover": { transform: "translateY(-4px)", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" },
        },
      },
    },
    MuiButton: {
      styleOverrides: { root: { borderRadius: 12, textTransform: "none", fontWeight: 600 } },
    },
  },
});

const monthlyHealthData = [
  { month: "T1", checkups: 45, incidents: 8 },
  { month: "T2", checkups: 52, incidents: 5 },
  { month: "T3", checkups: 48, incidents: 12 },
  { month: "T4", checkups: 61, incidents: 7 },
  { month: "T5", checkups: 55, incidents: 9 },
  { month: "T6", checkups: 68, incidents: 6 },
];

const classHealthData = [
  { class: "Lớp 1A", students: 28, healthyRate: 95 },
  { class: "Lớp 2B", students: 30, healthyRate: 88 },
  { class: "Lớp 3A", students: 32, healthyRate: 92 },
  { class: "Lớp 4C", students: 29, healthyRate: 90 },
  { class: "Lớp 5A", students: 31, healthyRate: 94 },
];

const incidentTypes = [
  { name: "Cảm cúm", value: 35, color: "#FF6B6B" },
  { name: "Đau bụng", value: 20, color: "#4ECDC4" },
  { name: "Chấn thương", value: 15, color: "#45B7D1" },
  { name: "Dị ứng", value: 12, color: "#96CEB4" },
  { name: "Khác", value: 18, color: "#FECA57" },
];

const StatCard = React.memo(({ title, value, icon: Icon, color, trend, trendValue }) => (
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${color}.light`, color: "white" }}>
          <Icon sx={{ fontSize: 28 }} />
        </Box>
        {trend && <Chip size="small" label={trendValue} color={trend === "up" ? "success" : "error"} />}
      </Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>{title}</Typography>
      <Typography variant="h5">{value}</Typography>
    </CardContent>
  </Card>
));

const SimpleBarChart = React.memo(({ data, title, color = "#1976d2" }) => {
  const maxValue = Math.max(...data.map((item) => item.healthyRate));
  return (
    <Card sx={{ height: 350 }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Avatar sx={{ bgcolor: "success.light" }}><PeopleIcon /></Avatar>
          <Typography variant="h6">{title}</Typography>
        </Box>
        <Box sx={{ height: 240, display: "flex", alignItems: "end", gap: 2, justifyContent: "space-around" }}>
          {data.map((item, index) => (
            <Box key={index} sx={{ textAlign: "center", flex: 1 }}>
              <Box
                sx={{
                  height: `${(item.healthyRate / maxValue) * 160}px`,
                  bgcolor: color,
                  borderRadius: "8px 8px 0 0",
                  mb: 1,
                  transition: "all 0.3s ease",
                  "&:hover": { bgcolor: theme.palette.primary.dark, transform: "scale(1.05)" },
                }}
              />
              <Typography variant="caption" sx={{ fontSize: "10px" }}>{item.class}</Typography>
              <Typography variant="body2">{item.healthyRate}%</Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
});

const SimpleLineChart = React.memo(({ data, title }) => {
  const maxCheckups = Math.max(...data.map((item) => item.checkups));
  const maxIncidents = Math.max(...data.map((item) => item.incidents));
  return (
    <Card sx={{ height: 350 }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Avatar sx={{ bgcolor: "primary.light" }}><TrendingUpIcon /></Avatar>
          <Typography variant="h6">{title}</Typography>
        </Box>
        <Box sx={{ height: 240, position: "relative", p: 2 }}>
          <Box sx={{ position: "absolute", left: 0, top: 0, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <Typography variant="caption">80</Typography>
            <Typography variant="caption">60</Typography>
            <Typography variant="caption">40</Typography>
            <Typography variant="caption">20</Typography>
            <Typography variant="caption">0</Typography>
          </Box>
          <Box sx={{ ml: 3, height: "100%", position: "relative" }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <Box key={i} sx={{ position: "absolute", top: `${i * 25}%`, left: 0, right: 0, height: "1px", bgcolor: "grey.200" }} />
            ))}
            <Box sx={{ display: "flex", justifyContent: "space-between", height: "100%", alignItems: "end" }}>
              {data.map((item, index) => (
                <Box key={index} sx={{ textAlign: "center", position: "relative", flex: 1 }}>
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: `${(item.checkups / maxCheckups) * 80}%`,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "#1976d2",
                      border: "2px solid white",
                      boxShadow: 1,
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: `${(item.incidents / maxIncidents) * 80}%`,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "#d32f2f",
                      border: "2px solid white",
                      boxShadow: 1,
                    }}
                  />
                  <Typography variant="caption" sx={{ position: "absolute", bottom: -20, left: "50%", transform: "translateX(-50%)" }}>{item.month}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 3, mt: 3, justifyContent: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#1976d2" }} />
              <Typography variant="caption">Khám sức khỏe</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#d32f2f" }} />
              <Typography variant="caption">Sự cố y tế</Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
});

const SimplePieChart = React.memo(({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;
  return (
    <Card sx={{ height: 350 }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Avatar sx={{ bgcolor: "warning.light" }}><WarningIcon /></Avatar>
          <Typography variant="h6">{title}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: `conic-gradient(${data
                .map((item) => {
                  const percentage = (item.value / total) * 100;
                  const startPercentage = cumulativePercentage;
                  cumulativePercentage += percentage;
                  return `${item.color} ${startPercentage}% ${cumulativePercentage}%`;
                })
                .join(", ")})`,
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 50,
                height: 50,
                borderRadius: "50%",
                bgcolor: "white",
              }}
            />
          </Box>
        </Box>
        <Box sx={{ mt: 2 }}>
          {data.map((item, index) => (
            <Box key={index} display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Box display="flex" alignItems="center" gap={1}>
                <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: item.color }} />
                <Typography variant="body2">{item.name}</Typography>
              </Box>
              <Typography variant="body2">{item.value}%</Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
});

const NurseInfoCard = React.memo(({ nurseInfo, onEditClick, loading }) => (
  <Card sx={{ height: "fit-content", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
    <CardContent sx={{ p: 3 }}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress color="inherit" />
        </Box>
      ) : (
        <>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Avatar sx={{ bgcolor: "white", color: "primary.main", width: 60, height: 60, fontSize: "1.5rem" }}>
              {nurseInfo.username?.charAt(0)?.toUpperCase() || "?"}
            </Avatar>
            <Box>
              <Typography variant="h6" gutterBottom>{nurseInfo.username || "N/A"}</Typography>
              <Chip label={nurseInfo.email || "N/A"} size="small" sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }} />
            </Box>
          </Box>
          <Divider sx={{ bgcolor: "rgba(255,255,255,0.3)", mb: 3 }} />
          <Box display="flex" flexDirection="column" gap={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <PhoneIcon sx={{ fontSize: 20, opacity: 0.8 }} />
              <Typography variant="body2">{nurseInfo.phone || "N/A"}</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <DateRangeIcon sx={{ fontSize: 20, opacity: 0.8 }} />
              <Typography variant="body2">{nurseInfo.dob || "N/A"}</Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={onEditClick}
            fullWidth
            sx={{ mt: 3, bgcolor: "rgba(255,255,255,0.2)", "&:hover": { bgcolor: "rgba(255,255,255,0.3)" }, backdropFilter: "blur(10px)" }}
          >
            Chỉnh sửa thông tin
          </Button>
        </>
      )}
    </CardContent>
  </Card>
));

const CustomProfileEditDialog = React.memo(({ open, onClose, formData, formErrors, onInputChange, onSubmit, loading, error }) => {
  if (!open) return null;
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1300,
      }}
      onClick={onClose}
    >
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          width: { xs: "90%", sm: 500 },
          maxWidth: "100%",
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Chỉnh sửa thông tin cá nhân
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            key="username"
            label="Tên người dùng"
            name="username"
            value={formData.username || ""}
            onChange={onInputChange}
            error={!!formErrors.username}
            helperText={formErrors.username}
            fullWidth
            disabled={loading}
          />
          <TextField
            key="email"
            label="Email"
            name="email"
            type="email"
            value={formData.email || ""}
            onChange={onInputChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
            fullWidth
            disabled={loading}
          />
          <TextField
            key="phone"
            label="Số điện thoại"
            name="phone"
            value={formData.phone || ""}
            onChange={onInputChange}
            error={!!formErrors.phone}
            helperText={formErrors.phone}
            fullWidth
            disabled={loading}
          />
          <TextField
            key="dob"
            label="Ngày sinh"
            name="dob"
            type="date"
            value={formData.dob || ""}
            onChange={onInputChange}
            error={!!formErrors.dob}
            helperText={formErrors.dob}
            InputLabelProps={{ shrink: true }}
            fullWidth
            disabled={loading}
          />
          {error && <Typography color="error" variant="body2">{error}</Typography>}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
          <Button onClick={onClose} color="primary" disabled={loading}>
            Hủy
          </Button>
          <Button onClick={onSubmit} color="primary" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Cập nhật"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
});

const DashboardHome = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nurseInfo, setNurseInfo] = useState({
    username: "",
    email: "",
    dob: "",
    phone: "",
    _id: "",
  });
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    dob: "",
    phone: "",
  });
  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    dob: "",
    phone: "",
  });

  const loadProfile = useCallback(async () => {
    if (editDialogOpen) return; // Prevent reloading profile while dialog is open
    try {
      setLoading(true);
      setError(null);
      const result = await userService.getProfile();
      if (result.success) {
        const data = result.data.data;
        const formattedDob = data.dob ? new Date(data.dob).toLocaleDateString("en-GB") : "";
        const formDob = data.dob ? new Date(data.dob).toISOString().split("T")[0] : "";
        const profileData = {
          username: data.username || "",
          email: data.email || "",
          phone: data.phone || "",
          dob: formattedDob,
          _id: data._id || "",
        };
        setNurseInfo(profileData);
        setFormData({
          username: data.username || "",
          email: data.email || "",
          phone: data.phone || "",
          dob: formDob,
        });
      } else {
        setError(result.message || "Không thể tải thông tin hồ sơ");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tải hồ sơ");
    } finally {
      setLoading(false);
    }
  }, [editDialogOpen]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const validateForm = useCallback(() => {
    const errors = { username: "", email: "", dob: "", phone: "" };
    let isValid = true;

    if (!formData.username.trim()) {
      errors.username = "Tên người dùng không được để trống";
      isValid = false;
    }
    if (!formData.email.match(/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      errors.email = "Email không hợp lệ";
      isValid = false;
    }
    if (!formData.phone.match(/^\+?\d{10,15}$/)) {
      errors.phone = "Số điện thoại không hợp lệ";
      isValid = false;
    }
    if (!formData.dob || isNaN(new Date(formData.dob).getTime())) {
      errors.dob = "Ngày sinh không hợp lệ";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  }, [formData]);

  const debouncedSetFormData = useCallback(
    debounce((name, value) => {
      setFormData((prev) => {
        const newData = { ...prev, [name]: value };
        console.log("New formData:", newData); // Temporary log for debugging
        return newData;
      });
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }, 300),
    []
  );

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    debouncedSetFormData(name, value);
  }, [debouncedSetFormData]);

  const handleUpdateProfile = useCallback(async () => {
    if (!validateForm()) return;
    try {
      setLoading(true);
      setError(null);
      const result = await userService.updateProfile({
        ...formData,
        dob: new Date(formData.dob).toISOString(),
      });
      if (result.success) {
        await loadProfile();
        setEditDialogOpen(false);
      } else {
        setError(result.message || "Cập nhật hồ sơ thất bại");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi cập nhật hồ sơ");
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, loadProfile]);

  const handleOpenEditDialog = useCallback(() => {
    setFormData({
      username: nurseInfo.username || "",
      email: nurseInfo.email || "",
      phone: nurseInfo.phone || "",
      dob: nurseInfo.dob ? new Date(nurseInfo.dob.split("/").reverse().join("-")).toISOString().split("T")[0] : "",
    });
    setFormErrors({ username: "", email: "", dob: "", phone: "" });
    setError(null);
    setEditDialogOpen(true);
  }, [nurseInfo]);

  const handleCloseEditDialog = useCallback(() => {
    setEditDialogOpen(false);
    setFormErrors({ username: "", email: "", dob: "", phone: "" });
    setError(null);
  }, []);

  const quickActions = useMemo(() => [
    { name: "Khám định kỳ", color: "primary", icon: LocalHospitalIcon },
    { name: "Báo cáo sự cố", color: "error", icon: WarningIcon },
    { name: "Lịch tiêm chủng", color: "success", icon: VaccinesIcon },
    { name: "Thống kê", color: "secondary", icon: AssessmentIcon },
  ], []);

  const notifications = useMemo(() => [
    { message: "Khám sức khỏe lớp 3A hoàn thành", time: "2 giờ trước", color: "success" },
    { message: "Cần bổ sung thuốc cảm cúm", time: "4 giờ trước", color: "warning" },
    { message: "Lịch tiêm chủng tuần tới đã cập nhật", time: "1 ngày trước", color: "info" },
  ], []);

  const MainContent = () => (
    <Box component="main" sx={{ flexGrow: 1, p: 3, width: "100%" }}>
      <Box display="flex" gap={3}>
        <Box sx={{ width: "70%" }}>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={3}>
              <StatCard title="Tổng số lớp" value="15" icon={PeopleIcon} color="primary" trend="up" trendValue="+2" />
            </Grid>
            <Grid item xs={3}>
              <StatCard title="Tổng số học sinh" value="420" icon={PersonAddIcon} color="success" trend="up" trendValue="+15" />
            </Grid>
            <Grid item xs={3}>
              <StatCard title="Khám sức khỏe tháng này" value="68" icon={LocalHospitalIcon} color="secondary" trend="up" trendValue="+13" />
            </Grid>
            <Grid item xs={3}>
              <StatCard title="Sự kiện cần xử lý" value="5" icon={WarningIcon} color="error" trend="down" trendValue="-3" />
            </Grid>
          </Grid>
          <Grid item xs={12} sx={{ mb: 3 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Avatar sx={{ bgcolor: "secondary.light" }}><ScheduleIcon /></Avatar>
                  <Typography variant="h6">Hành động nhanh</Typography>
                </Box>
                <Box display="flex" flexDirection="column" gap={2}>
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="contained"
                      color={action.color}
                      startIcon={<action.icon />}
                      fullWidth
                      sx={{ py: 1.5, justifyContent: "flex-start" }}
                    >
                      {action.name}
                    </Button>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sx={{ mb: 3 }}>
            <SimplePieChart data={incidentTypes} title="Loại sự cố y tế" />
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <SimpleLineChart data={monthlyHealthData} title="Xu hướng y tế theo tháng" />
            </Grid>
            <Grid item xs={6}>
              <SimpleBarChart data={classHealthData} title="Tỷ lệ sức khỏe theo lớp" color="#2e7d32" />
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ width: "30%" }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <NurseInfoCard nurseInfo={nurseInfo} onEditClick={handleOpenEditDialog} loading={loading} />
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Badge badgeContent={notifications.length} color="error">
                      <Avatar sx={{ bgcolor: "info.light" }}><NotificationsActiveIcon /></Avatar>
                    </Badge>
                    <Typography variant="h6">Thông báo gần đây</Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {notifications.map((notification, index) => (
                      <Paper key={index} sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                        <Typography variant="body2" gutterBottom>{notification.message}</Typography>
                        <Typography variant="caption" color="text.secondary">{notification.time}</Typography>
                      </Paper>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <CustomProfileEditDialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        formData={formData}
        formErrors={formErrors}
        onInputChange={handleInputChange}
        onSubmit={handleUpdateProfile}
        loading={loading}
        error={error}
      />
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", bgcolor: "background.default", minHeight: "100vh", width: "100%" }}>
        <CssBaseline />
        <MainContent />
      </Box>
    </ThemeProvider>
  );
};

export default DashboardHome;
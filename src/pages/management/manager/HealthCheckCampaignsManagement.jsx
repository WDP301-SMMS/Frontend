import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";

// MUI Imports
import {
  Box,
  Button,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  MenuItem,
  TableContainer,
  TablePagination,
  Stack,
  Divider,
  Tooltip,
  Snackbar,
  Alert,
  Chip,
  InputAdornment,
  Dialog as MuiDialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  Business as BusinessIcon,
  Campaign,
  Assignment,
  CalendarToday,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { Search } from "lucide-react";
import healthCheckCampaignService from "~/libs/api/services/healthCheckCampainService";
import healthCheckConsentService from "~/libs/api/services/healthCheckConsentService";
import healthCheckTemplateService from "~/libs/api/services/healthCheckTemplateService";
import classService from "~/libs/api/services/classService";
import userStudentServiceInstance from "~/libs/api/services/userStudentService";
import { userService } from "~/libs/api";

// Styled Paper cho phần form và detail
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[5],
}));

// Styled TableContainer
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
}));

// Component cho Form thêm/sửa chiến dịch
const CampaignForm = ({
  initialData,
  onSubmit,
  onCancel,
  isEditing,
  showSnackbar,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [startDate, setStartDate] = useState(
    initialData?.startDate
      ? new Date(initialData.startDate).toISOString().split("T")[0]
      : ""
  );
  const [endDate, setEndDate] = useState(
    initialData?.endDate
      ? new Date(initialData.endDate).toISOString().split("T")[0]
      : ""
  );
  const [templateId, setTemplateId] = useState(
    initialData?.templateId?._id || ""
  );
  const [templates, setTemplates] = useState([]);
  const [dateError, setDateError] = useState("");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setStartDate(
        initialData.startDate
          ? new Date(initialData.startDate).toISOString().split("T")[0]
          : ""
      );
      setEndDate(
        initialData.endDate
          ? new Date(initialData.endDate).toISOString().split("T")[0]
          : ""
      );
      setTemplateId(initialData.templateId?._id || "");
    }
  }, [initialData]);

  const fetchData = useCallback(async () => {
    try {
      const templateResponse =
        await healthCheckTemplateService.getListHealthCheckTemplates({
          page: 1,
          limit: 10,
          search: "",
        });
      setTemplates(templateResponse.data || []);

      const profileResponse = await userService.getProfile();
      setProfile(profileResponse.data.data || null);

      if (templateResponse.data.length > 0 && !templateId) {
        setTemplateId(templateResponse.data[0]._id);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
      showSnackbar("Không thể tải dữ liệu. Vui lòng thử lại.", "error");
    }
  }, [showSnackbar, templateId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const validateDates = () => {
    const today = new Date().toISOString().split("T")[0];
    if (startDate && startDate < today) {
      setDateError("Ngày bắt đầu không được là ngày quá khứ.");
      return false;
    }
    if (endDate && startDate && endDate <= startDate) {
      setDateError("Ngày kết thúc phải sau ngày bắt đầu.");
      return false;
    }
    setDateError("");
    return true;
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    if (endDate && newStartDate && endDate <= newStartDate) {
      setEndDate("");
    }
    validateDates();
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    validateDates();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateDates()) {
      showSnackbar(dateError, "error");
      return;
    }
    const formattedData = {
      name,
      startDate,
      endDate,
      templateId,
      createdBy: profile?._id,
    };
    onSubmit(formattedData);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 4,
        background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "linear-gradient(90deg, #2196F3, #21CBF3, #2196F3)",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: "primary.main",
            color: "white",
            mr: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Campaign />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "grey.800",
              mb: 0.5,
            }}
          >
            {isEditing ? "Chỉnh sửa Chiến dịch" : "Tạo Chiến dịch Mới"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isEditing
              ? "Cập nhật thông tin chiến dịch"
              : "Điền thông tin để tạo chiến dịch kiểm tra"}
          </Typography>
        </Box>
        <Chip
          label={isEditing ? "Chỉnh sửa" : "Tạo mới"}
          size="small"
          color={isEditing ? "warning" : "success"}
          variant="outlined"
        />
      </Box>

      <Divider sx={{ mb: 4 }} />

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography
            variant="subtitle2"
            sx={{ mb: 1, fontWeight: 600, color: "grey.700" }}
          >
            Tên Chiến dịch *
          </Typography>
          <TextField
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Nhập tên chiến dịch..."
            inputProps={{
              minLength: 4,
              maxLength: 99,
            }}
            error={name.length > 0 && (name.length < 4 || name.length > 99)}
            helperText={
              name.length > 0 && (name.length < 4 || name.length > 99)
                ? "Tên chiến dịch phải lớn hơn 3 và nhỏ hơn 100 ký tự."
                : ""
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Assignment sx={{ color: "action.active" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                transition: "all 0.3s ease",
                backgroundColor: "white",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(33, 150, 243, 0.15)",
                },
                "&.Mui-focused": {
                  boxShadow: "0 4px 20px rgba(33, 150, 243, 0.25)",
                },
              },
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography
            variant="subtitle2"
            sx={{ mb: 2, fontWeight: 600, color: "grey.700" }}
          >
            Thời gian thực hiện *
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Ngày bắt đầu"
                fullWidth
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                required
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday sx={{ color: "action.active" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "white",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(76, 175, 80, 0.15)",
                    },
                    "&.Mui-focused": {
                      boxShadow: "0 4px 20px rgba(76, 175, 80, 0.25)",
                    },
                  },
                }}
                error={!!dateError}
                helperText={dateError}
                inputProps={{
                  min: today,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Ngày kết thúc"
                fullWidth
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                required
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday sx={{ color: "action.active" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "white",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(244, 67, 54, 0.15)",
                    },
                    "&.Mui-focused": {
                      boxShadow: "0 4px 20px rgba(244, 67, 54, 0.25)",
                    },
                  },
                }}
                error={!!dateError}
                helperText={dateError}
                inputProps={{
                  min: startDate || today,
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Typography
            variant="subtitle2"
            sx={{ mb: 1, fontWeight: 600, color: "grey.700" }}
          >
            Mẫu kiểm tra *
          </Typography>
          <TextField
            fullWidth
            select
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Assignment sx={{ color: "action.active" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "white",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(156, 39, 176, 0.15)",
                },
                "&.Mui-focused": {
                  boxShadow: "0 4px 20px rgba(156, 39, 176, 0.25)",
                },
              },
            }}
          >
            <MenuItem value="" disabled>
              <em>Chọn mẫu kiểm tra</em>
            </MenuItem>
            {templates.map((template) => (
              <MenuItem key={template._id} value={template._id}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Assignment
                    sx={{ mr: 1, fontSize: 18, color: "primary.main" }}
                  />
                  {template.name}
                </Box>
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 4,
          gap: 2,
          pt: 3,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Button
          variant="outlined"
          color="inherit"
          onClick={onCancel}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.5,
            fontWeight: 600,
            textTransform: "none",
            borderColor: "grey.300",
            "&:hover": {
              borderColor: "grey.400",
              backgroundColor: "grey.50",
            },
          }}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={
            !name.trim() ||
            !startDate ||
            !endDate ||
            !templateId.trim() ||
            !!dateError
          }
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1.5,
            fontWeight: 600,
            textTransform: "none",
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            boxShadow: "0 4px 20px rgba(33, 150, 243, 0.3)",
            "&:hover": {
              background: "linear-gradient(45deg, #1976D2 30%, #0288D1 90%)",
              boxShadow: "0 6px 25px rgba(33, 150, 243, 0.4)",
              transform: "translateY(-1px)",
            },
            "&:disabled": {
              background: "grey.300",
              boxShadow: "none",
            },
            transition: "all 0.3s ease",
          }}
        >
          {isEditing ? "Cập nhật" : "Tạo"}
        </Button>
      </Box>
    </Box>
  );
};

// Component cho Form phân công
const AssignmentForm = ({ campaignId, onSubmit, onCancel, showSnackbar }) => {
  const [assignments, setAssignments] = useState([{ classId: "", nurseId: "" }]);
  const [classes, setClasses] = useState([]);
  const [nurses, setNurses] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const classResponse = await classService.getAll({
        page: 1,
        limit: 100,
      });
      setClasses(classResponse.data.classes || []);

      const nurseResponse = await userStudentServiceInstance.getAllUsers({
        page: 1,
        limit: 100,
        role: "Nurse",
      });
      setNurses(nurseResponse.data.users || []); // Uncommented and fixed
    } catch (err) {
      console.error("Failed to fetch assignment data:", err);
      showSnackbar("Không thể tải dữ liệu phân công. Vui lòng thử lại.", "error");
    }
  }, [showSnackbar]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAssignmentChange = (index, field, value) => {
    const newAssignments = [...assignments];
    newAssignments[index] = {
      ...newAssignments[index],
      [field]: value,
    };
    setAssignments(newAssignments);
  };

  const addAssignment = () => {
    setAssignments([...assignments, { classId: "", nurseId: "" }]);
  };

  const removeAssignment = (index) => {
    setAssignments(assignments.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = {
      assignments: assignments.map((assignment) => ({
        classId: assignment.classId,
        nurseId: assignment.nurseId,
      })),
    };
    onSubmit(campaignId, formattedData);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 4,
        background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "linear-gradient(90deg, #2196F3, #21CBF3, #2196F3)",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: "primary.main",
            color: "white",
            mr: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Assignment />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "grey.800",
              mb: 0.5,
            }}
          >
            Phân công Y tá và Lớp học
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Chọn y tá và lớp học để phân công cho chiến dịch
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      <Grid container spacing={3}>
        {assignments.map((assignment, index) => (
          <Grid item xs={12} key={index}>
            <Box sx={{ p: 2, border: 1, borderColor: "divider", borderRadius: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    select
                    label="Lớp học"
                    value={assignment.classId}
                    onChange={(e) =>
                      handleAssignmentChange(index, "classId", e.target.value)
                    }
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Assignment sx={{ color: "action.active" }} />
                        </InputAdornment>
                      ),
                    }}
                  >
                    <MenuItem value="" disabled>
                      Chọn lớp học
                    </MenuItem>
                    {classes.map((cls) => (
                      <MenuItem key={cls._id} value={cls._id}>
                        {`${cls.className} (${cls.gradeLevel} - ${cls.schoolYear})`}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    select
                    label="Y tá"
                    value={assignment.nurseId}
                    onChange={(e) =>
                      handleAssignmentChange(index, "nurseId", e.target.value)
                    }
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Assignment sx={{ color: "action.active" }} />
                        </InputAdornment>
                      ),
                    }}
                  >
                    <MenuItem value="" disabled>
                      Chọn y tá
                    </MenuItem>
                    {nurses.map((nurse) => (
                      <MenuItem key={nurse._id} value={nurse._id}>
                        {nurse.username}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <IconButton
                    color="error"
                    onClick={() => removeAssignment(index)}
                    disabled={assignments.length === 1}
                  >
                    <CloseIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addAssignment}
            sx={{ mt: 2 }}
          >
            Thêm Phân công
          </Button>
        </Grid>
      </Grid>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 4,
          gap: 2,
          pt: 3,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Button
          variant="outlined"
          color="inherit"
          onClick={onCancel}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.5,
            fontWeight: 600,
            textTransform: "none",
            borderColor: "grey.300",
            "&:hover": {
              borderColor: "grey.400",
              backgroundColor: "grey.50",
            },
          }}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={assignments.some(
            (assignment) => !assignment.classId || !assignment.nurseId
          )}
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1.5,
            fontWeight: 600,
            textTransform: "none",
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            boxShadow: "0 4px 20px rgba(33, 150, 243, 0.3)",
            "&:hover": {
              background: "linear-gradient(45deg, #1976D2 30%, #0288D1 90%)",
              boxShadow: "0 6px 25px rgba(33, 150, 243, 0.4)",
              transform: "translateY(-1px)",
            },
            "&:disabled": {
              background: "grey.300",
              boxShadow: "none",
            },
            transition: "all 0.3s ease",
          }}
        >
          Lưu Phân công
        </Button>
      </Box>
    </Box>
  );
};

// Component để hiển thị chi tiết chiến dịch
const CampaignDetail = ({ campaign, onClose, showSnackbar, onAnnounce, onComplete }) => {
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  if (!campaign) return null;
  const campaignData = campaign.data || campaign;

  const handleAssignmentSubmit = async (campaignId, assignmentData) => {
    try {
      await healthCheckCampaignService.assignStaffToCampaign(
        campaignId,
        assignmentData
      );
      showSnackbar("Phân công y tá và lớp học thành công.", "success");
      setShowAssignmentModal(false);
      // Refresh campaign details
      const response = await healthCheckCampaignService.getCampaignDetails(
        campaignId
      );
      campaign.data = response.data;
    } catch (err) {
      console.error("Phân công thất bại:", err);
      showSnackbar("Phân công thất bại. Vui lòng thử lại.", "error");
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: "1200px", mx: "auto" }}>
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            color: "text.secondary",
            fontWeight: "medium",
          }}
        >
          {campaignData.name}
        </Typography>
        <Divider sx={{ mt: 2, mb: 3 }} />
      </Box>

      <Paper elevation={2} sx={{ mb: 4, borderRadius: 2, overflow: "hidden" }}>
        <Box
          sx={{
            backgroundColor: "#6aa6e2ff",
            color: "primary.contrastText",
            p: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Thông tin Chiến dịch
          </Typography>
        </Box>
        <Box sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3} sx={{ width: "22%" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  backgroundColor: "grey.50",
                  width: "100%",
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 1, fontWeight: "bold" }}
                >
                  Năm học
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "medium", flexGrow: 1 }}
                >
                  {campaignData.schoolYear || "Không có"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3} sx={{ width: "22%" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  backgroundColor: "grey.50",
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 1, fontWeight: "bold" }}
                >
                  Trạng thái
                </Typography>
                <Box
                  sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}
                >
                  <Chip
                    label={
                      campaignData.status === "DRAFT"
                        ? "Nháp"
                        : campaignData.status === "ANNOUNCED"
                          ? "Đã thông báo"
                          : campaignData.status === "IN_PROGRESS"
                            ? "Đang tiến hành"
                            : campaignData.status === "COMPLETED"
                              ? "Hoàn thành"
                              : "Đã hủy"
                    }
                    color={
                      campaignData.status === "ANNOUNCED" ||
                        campaignData.status === "IN_PROGRESS"
                        ? "warning"
                        : campaignData.status === "COMPLETED"
                          ? "success"
                          : campaignData.status === "CANCELED"
                            ? "error"
                            : "default"
                    }
                    sx={{ fontWeight: "medium" }}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3} sx={{ width: "22%" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  backgroundColor: "grey.50",
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 1, fontWeight: "bold" }}
                >
                  Ngày bắt đầu
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "medium", flexGrow: 1 }}
                >
                  {campaignData.startDate
                    ? new Date(campaignData.startDate).toLocaleString("vi-VN")
                    : "Không có"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3} sx={{ width: "22%" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  backgroundColor: "grey.50",
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 1, fontWeight: "bold" }}
                >
                  Ngày kết thúc
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "medium", flexGrow: 1 }}
                >
                  {campaignData.endDate
                    ? new Date(campaignData.endDate).toLocaleString("vi-VN")
                    : "Không có"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3} sx={{ width: "22%" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  backgroundColor: "grey.50",
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 1, fontWeight: "bold" }}
                >
                  Ngày bắt đầu thực tế
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "medium", flexGrow: 1 }}
                >
                  {campaignData.actualStartDate
                    ? new Date(campaignData.actualStartDate).toLocaleString(
                      "vi-VN"
                    )
                    : "Không có"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3} sx={{ width: "22%" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  backgroundColor: "grey.50",
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 1, fontWeight: "bold" }}
                >
                  Ngày hoàn thành
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "medium", flexGrow: 1 }}
                >
                  {campaignData.completedDate
                    ? new Date(campaignData.completedDate).toLocaleString(
                      "vi-VN"
                    )
                    : "Không có"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3} sx={{ width: "22%" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  backgroundColor: "grey.50",
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 1, fontWeight: "bold" }}
                >
                  Ngày tạo
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "medium", flexGrow: 1 }}
                >
                  {campaignData.createdAt
                    ? new Date(campaignData.createdAt).toLocaleString("vi-VN")
                    : "Không có"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3} sx={{ width: "22%" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  backgroundColor: "grey.50",
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 1, fontWeight: "bold" }}
                >
                  Người tạo
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "medium", flexGrow: 1 }}
                >
                  {campaignData.createdBy?.username || "Không có"}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Paper elevation={2} sx={{ mb: 4, borderRadius: 2, overflow: "hidden" }}>
        <Box
          sx={{
            backgroundColor: "#ce6ae2ff",
            color: "secondary.contrastText",
            p: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Thông tin Mẫu kiểm tra
          </Typography>
        </Box>
        <Box sx={{ p: 3 }}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  backgroundColor: "grey.50",
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 1, fontWeight: "bold" }}
                >
                  Tên mẫu
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "medium", flexGrow: 1 }}
                >
                  {campaignData.templateId?.name || "Không có"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  backgroundColor: "grey.50",
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 1, fontWeight: "bold" }}
                >
                  Mô tả
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "medium", flexGrow: 1 }}
                >
                  {campaignData.templateId?.description || "Không có"}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Mục kiểm tra
            </Typography>
            {campaignData.templateId?.checkupItems?.length > 0 ? (
              <TableContainer
                component={Paper}
                sx={{
                  boxShadow: 1,
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Table size="medium">
                  <TableHead sx={{ backgroundColor: "grey.50" }}>
                    <TableRow>
                      <TableCell
                        sx={{ fontWeight: "bold", color: "text.primary" }}
                      >
                        Tên mục
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: "bold", color: "text.primary" }}
                      >
                        Đơn vị
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: "bold", color: "text.primary" }}
                      >
                        Kiểu dữ liệu
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: "bold", color: "text.primary" }}
                      >
                        Hướng dẫn
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {campaignData.templateId.checkupItems.map((item, index) => (
                      <TableRow
                        key={item.itemId}
                        sx={{
                          "&:nth-of-type(odd)": { backgroundColor: "grey.25" },
                          "&:hover": { backgroundColor: "action.hover" },
                        }}
                      >
                        <TableCell sx={{ fontWeight: "medium" }}>
                          {item.itemName}
                        </TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>{item.dataType}</TableCell>
                        <TableCell>{item.guideline}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box
                sx={{
                  p: 3,
                  textAlign: "center",
                  backgroundColor: "grey.50",
                  borderRadius: 1,
                  border: "1px dashed",
                  borderColor: "grey.300",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Không có mục kiểm tra
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      <Paper elevation={2} sx={{ mb: 4, borderRadius: 2, overflow: "hidden" }}>
        <Box
          sx={{
            backgroundColor: "#e2a06aff",
            color: "info.contrastText",
            p: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Nhân viên tham gia
          </Typography>
        </Box>
        <Box sx={{ p: 3 }}>
          {campaignData.assignments?.length > 0 ? (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {[...new Map(
                campaignData.assignments
                  .filter(a => a.nurseId && a.nurseId.username)
                  .map(a => [a.nurseId._id, a.nurseId])
              ).values()].map((nurse) => (
                <Chip
                  key={nurse._id}
                  label={nurse.username}
                  variant="outlined"
                  sx={{
                    fontWeight: "medium",
                    "&:hover": { backgroundColor: "action.hover" },
                  }}
                />
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                p: 3,
                textAlign: "center",
                backgroundColor: "grey.50",
                borderRadius: 1,
                border: "1px dashed",
                borderColor: "grey.300",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Không có nhân viên tham gia
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      <Paper elevation={2} sx={{ mb: 4, borderRadius: 2, overflow: "hidden" }}>
        <Box
          sx={{
            backgroundColor: "#6ae274ff",
            color: "success.contrastText",
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Phân công
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setShowAssignmentModal(true)}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Thêm Phân công
          </Button>
        </Box>
        <Box sx={{ p: 3 }}>
          {campaignData.assignments?.length > 0 ? (
            <TableContainer
              component={Paper}
              sx={{
                boxShadow: 1,
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Table size="medium">
                <TableHead sx={{ backgroundColor: "grey.50" }}>
                  <TableRow>
                    <TableCell
                      sx={{ fontWeight: "bold", color: "text.primary" }}
                    >
                      Lớp
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", color: "text.primary" }}
                    >
                      Cấp độ
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", color: "text.primary" }}
                    >
                      Y tá
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", color: "text.primary" }}
                    >
                      Số học sinh
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {campaignData.assignments.map((assignment) => (
                    <TableRow
                      key={assignment.classId._id}
                      sx={{
                        "&:nth-of-type(odd)": { backgroundColor: "grey.25" },
                        "&:hover": { backgroundColor: "action.hover" },
                      }}
                    >
                      <TableCell sx={{ fontWeight: "medium" }}>
                        {assignment.classId.className}
                      </TableCell>
                      <TableCell>{assignment.classId.gradeLevel}</TableCell>
                      <TableCell>
                        {assignment.nurseId?.username || "Không có"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={assignment.classId.totalStudents}
                          size="small"
                          color="info"
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box
              sx={{
                p: 3,
                textAlign: "center",
                backgroundColor: "grey.50",
                borderRadius: 1,
                border: "1px dashed",
                borderColor: "grey.300",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Không có phân công nào
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 4,
          p: 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={onClose}
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            fontWeight: "bold",
            textTransform: "none",
            boxShadow: 2,
            "&:hover": {
              boxShadow: 4,
              transform: "translateY(-1px)",
            },
          }}
        >
          Đóng
        </Button>
        {Array.isArray(campaignData.assignments) && campaignData.assignments.length > 0 && campaignData.status === "DRAFT" && (
          <Button
            variant="contained"
            color="success"
            onClick={() => onAnnounce(campaignData)}
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: "bold",
              textTransform: "none",
              ml: 2,
              boxShadow: 2,
              "&:hover": {
                boxShadow: 4,
                transform: "translateY(-1px)",
              },
            }}
          >
            Gửi thông báo
          </Button>
        )}
        {campaignData.status === "IN_PROGRESS" && (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => onComplete(campaignData)}
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: "bold",
              textTransform: "none",
              ml: 2,
              boxShadow: 2,
              "&:hover": {
                boxShadow: 4,
                transform: "translateY(-1px)",
              },
            }}
          >
            Hoàn thành chiến dịch
          </Button>
        )}
      </Box>

      <Dialog
        open={showAssignmentModal}
        onClose={() => setShowAssignmentModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
            color: "white",
          }}
        >
          Phân công Y tá và Lớp học
          <IconButton
            aria-label="Đóng"
            onClick={() => setShowAssignmentModal(false)}
            sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <AssignmentForm
            campaignId={campaignData._id}
            onSubmit={handleAssignmentSubmit}
            onCancel={() => setShowAssignmentModal(false)}
            showSnackbar={showSnackbar}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

// Component chính
const HealthCheckCampaignsManagement = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [schoolYearFilter, setSchoolYearFilter] = useState("");
  const [totalCampaigns, setTotalCampaigns] = useState(0);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [viewingCampaign, setViewingCampaign] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openAnnounceDialog, setOpenAnnounceDialog] = useState(false);
  const [announceForm, setAnnounceForm] = useState({
    campaignId: "",
    scheduledDate: "",
    location: "",
  });

  const statusOptions = [
    { value: "", label: "Tất cả" },
    { value: "DRAFT", label: "Nháp" },
    { value: "ANNOUNCED", label: "Đã thông báo" },
    { value: "IN_PROGRESS", label: "Đang tiến hành" },
    { value: "COMPLETED", label: "Hoàn thành" },
    { value: "CANCELED", label: "Đã hủy" },
  ];

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response =
        await healthCheckCampaignService.getListHealthCheckCampaigns({
          page: page + 1,
          limit,
          search,
          status: statusFilter,
          schoolYear: schoolYearFilter,
        });
      setCampaigns(response.data.campaigns || []);
      setTotalCampaigns(response.data.pagination?.totalCount || 0);
    } catch (err) {
      setError("Không thể tải danh sách chiến dịch. Vui lòng thử lại.");
      console.error(err);
      showSnackbar(
        "Không thể tải danh sách chiến dịch. Vui lòng thử lại.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, statusFilter, schoolYearFilter]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(0);
  };

  const handleSchoolYearFilterChange = (e) => {
    setSchoolYearFilter(e.target.value);
    setPage(0);
  };

  const handleAddClick = () => {
    setEditingCampaign(null);
    setShowFormModal(true);
  };

  const handleEditClick = async (campaignId, status) => {
    if (!["DRAFT", "ANNOUNCED"].includes(status)) {
      showSnackbar(
        "Chỉ có thể chỉnh sửa chiến dịch ở trạng thái Nháp hoặc Đã thông báo.",
        "error"
      );
      return;
    }
    try {
      const response = await healthCheckCampaignService.getCampaignDetails(
        campaignId
      );
      setEditingCampaign(response.data);
      setShowFormModal(true);
    } catch (err) {
      console.error("Không thể tải chi tiết chiến dịch để chỉnh sửa:", err);
      showSnackbar("Không thể tải chi tiết chiến dịch để chỉnh sửa.", "error");
    }
  };

  const handleViewDetailClick = async (campaignId) => {
    try {
      const response = await healthCheckCampaignService.getCampaignDetails(
        campaignId
      );
      setViewingCampaign(response);
      setShowDetailModal(true);
    } catch (err) {
      console.error("Không thể tải chi tiết chiến dịch:", err);
      showSnackbar("Không thể tải chi tiết chiến dịch.", "error");
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      const requestBody = {
        name: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        templateId: formData.templateId,
        createdBy: formData.createdBy,
      };
      if (editingCampaign) {
        requestBody.status = editingCampaign.status;
        await healthCheckCampaignService.updateHealthCheckCampaign(
          editingCampaign._id,
          requestBody
        );
        showSnackbar("Cập nhật chiến dịch thành công.", "success");
      } else {
        await healthCheckCampaignService.createHealthCheckCampaign(requestBody);
        showSnackbar("Thêm chiến dịch mới thành công.", "success");
      }
      setShowFormModal(false);
      setEditingCampaign(null);
      fetchCampaigns();
    } catch (err) {
      console.error("Lưu chiến dịch thất bại:", err);
      showSnackbar(
        "Lưu chiến dịch thất bại. Vui lòng kiểm tra dữ liệu.",
        "error"
      );
    }
  };

  const handleStatusChange = async (campaignId, currentStatus) => {
    // Define valid next statuses based on current status
    const statusSequence = ["DRAFT", "ANNOUNCED", "IN_PROGRESS", "COMPLETED"];
    const validTransitions = {
      DRAFT: ["ANNOUNCED", "CANCELED"],
      ANNOUNCED: ["IN_PROGRESS", "CANCELED"],
      IN_PROGRESS: ["COMPLETED", "CANCELED"],
      COMPLETED: [],
      CANCELED: [],
    };

    const nextStatuses = validTransitions[currentStatus] || [];

    // If no valid transitions, show a message and return
    if (nextStatuses.length === 0) {
      showSnackbar(
        "Không thể thay đổi trạng thái từ trạng thái hiện tại.",
        "info"
      );
      return;
    }

    // Map next statuses to their display labels
    const statusOptionsMap = nextStatuses.map((status) => ({
      value: status,
      label: statusOptions.find((opt) => opt.value === status)?.label || status,
    }));

    // Show SweetAlert2 modal with dropdown
    const result = await Swal.fire({
      title: "Chọn trạng thái mới",
      text: `Trạng thái hiện tại: ${statusOptions.find((opt) => opt.value === currentStatus)?.label
        }`,
      icon: "question",
      input: "select",
      inputOptions: statusOptionsMap.reduce((acc, opt) => {
        acc[opt.value] = opt.label;
        return acc;
      }, {}),
      inputPlaceholder: "Chọn trạng thái mới",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Cập nhật",
      cancelButtonText: "Hủy",
      inputValidator: (value) => {
        if (!value) {
          return "Vui lòng chọn một trạng thái!";
        }
      },
    });

    if (result.isConfirmed) {
      try {
        await healthCheckCampaignService.updateCampaignStatus(campaignId, {
          status: result.value,
        });
        showSnackbar(`Cập nhật trạng thái chiến dịch thành công.`, "success");
        fetchCampaigns();
      } catch (err) {
        console.error("Cập nhật trạng thái chiến dịch thất bại:", err);
        showSnackbar(
          "Cập nhật trạng thái chiến dịch thất bại. Vui lòng thử lại.",
          "error"
        );
      }
    }
  };

  const handleAnnounceCampaign = (campaign) => {
    setAnnounceForm({
      campaignId: campaign._id,
      scheduledDate: campaign.startDate ? new Date(campaign.startDate).toISOString().substring(0, 10) : "",
      location: campaign.location || "",
    });
    setOpenAnnounceDialog(true);
  };

  const handleSubmitAnnounce = async () => {
    if (!announceForm.scheduledDate || !announceForm.location) {
      showSnackbar("Vui lòng nhập đầy đủ thông tin.", "error");
      return;
    }
    try {
      setLoading(true);
      await healthCheckConsentService.addStudentsToConsent(announceForm.campaignId);
      await healthCheckCampaignService.updateCampaignStatus(announceForm.campaignId, {
        status: "ANNOUNCED",
        // createdBy: userId, nếu cần
      });
      showSnackbar("Gửi thông báo thành công!", "success");
      setOpenAnnounceDialog(false);
      fetchCampaigns();
    } catch (error) {
      showSnackbar(error?.message || "Có lỗi xảy ra khi gửi thông báo.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteCampaign = async (campaign) => {
    setShowDetailModal(false);
    setTimeout(async () => {
      const confirm = await Swal.fire({
        title: "Hoàn thành chiến dịch?",
        text: `Bạn có chắc chắn muốn hoàn thành chiến dịch '${campaign.name}'?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Hoàn thành",
        cancelButtonText: "Hủy",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      });
      if (!confirm.isConfirmed) return;
      try {
        setLoading(true);
        const response = await healthCheckCampaignService.updateCampaignStatus(
          campaign._id,
          { status: "COMPLETED" }
        );
        if (response.success) {
          showSnackbar("Chiến dịch đã hoàn thành!", "success");
          fetchCampaigns();
        } else {
          throw new Error(response.message || "Không thể hoàn thành chiến dịch.");
        }
      } catch (error) {
        showSnackbar(error?.message || "Không thể hoàn thành chiến dịch.", "error");
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <div className="mx-auto">
        <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl border border-blue-100 mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50"></div>
          <div className="relative p-8">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <BusinessIcon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-3 leading-tight">
                  Quản lý Chiến dịch Kiểm tra Sức khỏe
                </h1>
                <p className="text-lg text-gray-600 font-medium leading-relaxed">
                  Quản lý các chiến dịch kiểm tra sức khỏe, phân công và thống
                  kê
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên chiến dịch..."
                  value={search}
                  onChange={handleSearchChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 bg-gray-50 hover:bg-white focus:bg-white"
                />
              </div>
            </div>
            <div className="md:col-span-4">
              <TextField
                label="Lọc theo trạng thái"
                variant="outlined"
                fullWidth
                select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div className="md:col-span-4">
              <TextField
                label="Lọc theo năm học"
                variant="outlined"
                fullWidth
                value={schoolYearFilter}
                onChange={handleSchoolYearFilterChange}
                placeholder="VD: 2023-2024"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </div>
            <div className="md:col-span-12">
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddClick}
                sx={{ textTransform: "none", borderRadius: 2 }}
              >
                Thêm Chiến dịch Mới
              </Button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <CircularProgress size={50} />
          <Typography variant="h6" color="text.secondary">
            Đang tải danh sách chiến dịch...
          </Typography>
        </Box>
      ) : error ? (
        <Typography color="error" align="center" variant="h6" sx={{ mt: 5 }}>
          {error}
        </Typography>
      ) : (
        <StyledPaper elevation={8}>
          <Table>
            <TableHead >
              <TableRow>
                <TableCell sx={{ color: "black", fontWeight: "bold" }}>
                  STT
                </TableCell>
                <TableCell sx={{ color: "black", fontWeight: "bold" }}>
                  Tên Chiến dịch
                </TableCell>
                <TableCell sx={{ color: "black", fontWeight: "bold" }}>
                  Năm học
                </TableCell>
                <TableCell sx={{ color: "black", fontWeight: "bold" }}>
                  Ngày bắt đầu
                </TableCell>
                <TableCell sx={{ color: "black", fontWeight: "bold" }}>
                  Ngày kết thúc
                </TableCell>
                <TableCell sx={{ color: "black", fontWeight: "bold" }}>
                  Số lớp phân công
                </TableCell>
                <TableCell sx={{ color: "black", fontWeight: "bold" }}>
                  Trạng thái
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "black", fontWeight: "bold" }}
                >
                  Hành động
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {campaigns.length > 0 ? (
                campaigns.map((campaign, index) => (
                  <TableRow key={campaign._id}>
                    <TableCell
                      sx={{
                        maxWidth: 150,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {page * limit + index + 1}
                    </TableCell>
                    <TableCell sx={{ fontWeight: "medium" }}>
                      {campaign.name}
                    </TableCell>
                    <TableCell>{campaign.schoolYear}</TableCell>
                    <TableCell>
                      {new Date(campaign.startDate).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell>
                      {new Date(campaign.endDate).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell>{campaign.assignments?.length || 0}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          statusOptions.find(
                            (opt) => opt.value === campaign.status
                          )?.label || campaign.status
                        }
                        color={
                          campaign.status === "ANNOUNCED" ||
                            campaign.status === "IN_PROGRESS"
                            ? "warning"
                            : campaign.status === "COMPLETED"
                              ? "success"
                              : campaign.status === "CANCELED"
                                ? "error"
                                : "default"
                        }
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
                        <Tooltip title="Xem chi tiết">
                          <IconButton
                            color="info"
                            onClick={() => handleViewDetailClick(campaign._id)}
                            sx={{
                              "&:hover": {
                                color: "white",
                                backgroundColor: "info.main",
                              },
                            }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Sửa">
                          <span>
                            <IconButton
                              color="primary"
                              onClick={() =>
                                handleEditClick(campaign._id, campaign.status)
                              }
                              disabled={![
                                "DRAFT",
                                // "ANNOUNCED",
                              ].includes(campaign.status)}
                              sx={{
                                "&:hover": {
                                  color: "white",
                                  backgroundColor: "primary.main",
                                },
                                "&.Mui-disabled": {
                                  color: "grey.400",
                                  cursor: "not-allowed",
                                },
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                        {campaign.status === "DRAFT" && campaign.assignments && campaign.assignments.length > 0 && (
                          <Tooltip title="Gửi thông báo">
                            <IconButton
                              color="success"
                              onClick={() => handleAnnounceCampaign(campaign)}
                              sx={{
                                "&:hover": {
                                  color: "white",
                                  backgroundColor: "success.main",
                                },
                              }}
                            >
                              <Campaign />
                            </IconButton>
                          </Tooltip>
                        )}
                        {/* <Tooltip title="Thay đổi trạng thái">
                          <span>
                            <IconButton
                              color="warning"
                              onClick={() =>
                                handleStatusChange(campaign._id, campaign.status)
                              }
                              disabled={["COMPLETED", "CANCELED"].includes(
                                campaign.status
                              )}
                              sx={{
                                "&:hover": {
                                  color: "white",
                                  backgroundColor: "warning.main",
                                },
                                "&.Mui-disabled": {
                                  color: "grey.400",
                                  cursor: "not-allowed",
                                },
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </span>
                        </Tooltip> */}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    align="center"
                    sx={{ py: 3, fontStyle: "italic", color: "text.secondary" }}
                  >
                    Không có chiến dịch nào để hiển thị.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20, 25]}
            component="div"
            count={totalCampaigns}
            rowsPerPage={limit}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số hàng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) =>
              `Hiển thị ${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
            }
            sx={{ borderTop: "1px solid", borderColor: "divider", pt: 1 }}
          />
        </StyledPaper>
      )}

      <Dialog
        open={showFormModal}
        onClose={() => setShowFormModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <CampaignForm
            initialData={editingCampaign}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowFormModal(false)}
            isEditing={!!editingCampaign}
            showSnackbar={showSnackbar}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
            color: "white",
          }}
        >
          Chi tiết Chiến dịch
          <IconButton
            aria-label="Đóng"
            onClick={() => setShowDetailModal(false)}
            sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <CampaignDetail
            campaign={viewingCampaign}
            onClose={() => setShowDetailModal(false)}
            showSnackbar={showSnackbar}
            onAnnounce={handleAnnounceCampaign}
            onComplete={handleCompleteCampaign}
          />
        </DialogContent>
      </Dialog>

      <MuiDialog open={openAnnounceDialog} onClose={() => setOpenAnnounceDialog(false)} maxWidth="xs" fullWidth>
        <MuiDialogTitle>Kích hoạt chiến dịch</MuiDialogTitle>
        <MuiDialogContent>
          <TextField
            label="Ngày khám"
            type="date"
            fullWidth
            value={announceForm.scheduledDate}
            onChange={e => setAnnounceForm(f => ({ ...f, scheduledDate: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            margin="normal"
            inputProps={{ min: new Date().toISOString().split("T")[0] }}
          />
          <TextField
            label="Địa điểm"
            fullWidth
            value={announceForm.location}
            onChange={e => setAnnounceForm(f => ({ ...f, location: e.target.value }))}
            margin="normal"
          />
        </MuiDialogContent>
        <MuiDialogActions>
          <Button onClick={() => setOpenAnnounceDialog(false)}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleSubmitAnnounce}
            color="primary"
            disabled={loading}
          >
            Kích hoạt chiến dịch
          </Button>
        </MuiDialogActions>
      </MuiDialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HealthCheckCampaignsManagement;
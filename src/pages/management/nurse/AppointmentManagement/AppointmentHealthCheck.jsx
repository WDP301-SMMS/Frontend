import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Chip,
  Container,
  Avatar,
  Alert,
  Divider,
  Stack,
  Grid,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Search,
  Warning,
  Schedule,
  Close,
  Visibility,
  CalendarToday,
} from "@mui/icons-material";
import appointmentsService from "~/libs/api/services/appointmentsService";
import healthCheckRecordService from "~/libs/api/services/healthCheckRecordService";
import dayjs from "dayjs";
import { CheckCircle } from "lucide-react";
import healthCheckCampaignService from "~/libs/api/services/healthCheckCampainService";

const AbnormalHealthCheck = () => {
  const [tabValue, setTabValue] = useState(0);
  const [abnormalStudents, setAbnormalStudents] = useState([]);
  const [filteredAbnormalStudents, setFilteredAbnormalStudents] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [campaignFilter, setCampaignFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    studentId: "",
    parentId: "",
    resultId: "",
    meetingTime: "",
    location: "",
    notes: "",
  });
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openCompleteDialog, setOpenCompleteDialog] = useState(false);
  const [completeData, setCompleteData] = useState({
    status: "COMPLETED",
    reason: "",
  });
  const [openNoteDialog, setOpenNoteDialog] = useState(false);
  const [noteData, setNoteData] = useState({
    afterMeetingNotes: "",
  });
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const currentDate = new Date();

  useEffect(() => {
    fetchCampaigns();
    fetchAbnormalStudents();
    fetchAppointments();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await healthCheckCampaignService.getCampaignsByStatus(
        "COMPLETED"
      );
      console.log("Campaigns:", response);
      if (response.success) {
        setCampaigns(response.data.campaigns);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  const fetchAbnormalStudents = async () => {
    try {
      if (!campaignFilter) {
        setAbnormalStudents([]);
        setFilteredAbnormalStudents([]);
        return;
      }
      console.log(
        "Fetching abnormal students with campaign filter:",
        campaignFilter
      );
      const response = await appointmentsService.getStudentsWithAbnormalResults(
        campaignFilter || undefined
      );
      if (response.success) {
        const studentsWithClass = response.data.map((student) => ({
          ...student,
          className: `Class ${student.studentId.slice(-2)}`,
        }));
        setAbnormalStudents(studentsWithClass);
        setFilteredAbnormalStudents(studentsWithClass);
      }
    } catch (error) {
      console.error("Error fetching abnormal students:", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await appointmentsService.getAppointments({
        page: 1,
        limit: 10,
      });
      if (response.success) {
        setAppointments(response.data);
        setFilteredAppointments(response.data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    fetchAbnormalStudents();
  }, [campaignFilter]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (tabValue === 0) {
      filterAbnormalStudents(query, classFilter, campaignFilter);
    } else {
      filterAppointments(query, startDate, endDate, statusFilter);
    }
  };

  const handleClassChange = (e) => {
    const selectedClass = e.target.value;
    setClassFilter(selectedClass);
    filterAbnormalStudents(searchQuery, selectedClass, campaignFilter);
  };

  const handleCampaignChange = (e) => {
    const selectedCampaign = e.target.value;
    setCampaignFilter(selectedCampaign);
    filterAbnormalStudents(searchQuery, classFilter, selectedCampaign);
  };

  const handleStartDateChange = (e) => {
    const start = e.target.value;
    setStartDate(start);
    filterAppointments(searchQuery, start, endDate, statusFilter);
  };

  const handleEndDateChange = (e) => {
    const end = e.target.value;
    setEndDate(end);
    filterAppointments(searchQuery, startDate, end, statusFilter);
  };

  const handleStatusChange = (e) => {
    const status = e.target.value;
    setStatusFilter(status);
    filterAppointments(searchQuery, startDate, endDate, status);
  };

  const filterAbnormalStudents = (search, className, campaignId) => {
    let filtered = [...abnormalStudents];
    if (search) {
      filtered = filtered.filter((student) =>
        student.studentName.toLowerCase().includes(search)
      );
    }
    if (className) {
      filtered = filtered.filter((student) => student.className === className);
    }
    if (campaignId) {
      filtered = filtered.filter(
        (student) => student.campaignId === campaignId
      );
    }
    setFilteredAbnormalStudents(filtered);
  };

  const filterAppointments = (search, start, end, status) => {
    let filtered = [...appointments];
    if (search) {
      filtered = filtered.filter((appointment) =>
        appointment.studentId.fullName.toLowerCase().includes(search)
      );
    }
    if (start) {
      filtered = filtered.filter(
        (appointment) => new Date(appointment.meetingTime) >= new Date(start)
      );
    }
    if (end) {
      filtered = filtered.filter(
        (appointment) => new Date(appointment.meetingTime) <= new Date(end)
      );
    }
    if (status) {
      filtered = filtered.filter(
        (appointment) => appointment.status === status
      );
    }
    setFilteredAppointments(filtered);
  };

  const handleViewDetails = async (studentId) => {
    try {
      const record =
        await healthCheckRecordService.getLatestStudentHealthRecord(studentId);
      if (record.data) {
        const student = abnormalStudents.find((s) => s.studentId === studentId);
        setSelectedStudent({ ...student, record: record.data });
        setAppointmentData({
          studentId: studentId,
          parentId: student.parentId,
          resultId: record.data._id,
          meetingTime: "",
          location: "",
          notes: "",
        });
        setOpenDialog(true);
      }
    } catch (error) {
      console.error("Error fetching student record:", error);
    }
  };

  const handleViewAppointment = (appointmentId) => {
    const appointment = appointments.find((a) => a._id === appointmentId);
    setSelectedAppointment(appointment);
    setOpenViewDialog(true);
  };

  const handleAppointmentChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleScheduleAppointment = async () => {
    try {
      const response = await appointmentsService.createAppointment(
        appointmentData
      );
      if (response.success) {
        setOpenDialog(false);
        setNotificationMessage("Đặt lịch hẹn thành công !");
        setOpenNotification(true);
        setAppointmentData({
          studentId: "",
          parentId: "",
          resultId: "",
          meetingTime: "",
          location: "",
          notes: "",
        });
        fetchAbnormalStudents();
        fetchAppointments();
      }
    } catch (error) {
      console.error("Error scheduling appointment:", error);
    }
  };

  const handleCompleteAppointment = (appointmentId) => {
    setSelectedAppointment(appointments.find((a) => a._id === appointmentId));
    setOpenCompleteDialog(true);
  };

  const handleCompleteSubmit = async (appointmentId) => {
    try {
      const statusData = {
        status: completeData.status,
        reason: completeData.reason || "Meeting completed successfully",
      };
      const response = await appointmentsService.updateAppointmentStatus(
        appointmentId,
        statusData
      );
      if (response.success) {
        setOpenCompleteDialog(false);
        setNotificationMessage("Hoàn thành cuộc hẹn !");
        setOpenNotification(true);
        setCompleteData({ status: "COMPLETED", reason: "" });
        fetchAppointments();
      }
    } catch (error) {
      console.error("Error completing appointment:", error);
    }
  };

  const handleAddNote = (appointmentId) => {
    setSelectedAppointment(appointments.find((a) => a._id === appointmentId));
    setOpenNoteDialog(true);
  };

  const handleNoteSubmit = async (appointmentId) => {
    try {
      const notesData = {
        afterMeetingNotes:
          noteData.afterMeetingNotes ||
          "Discussed student's vision issue with parent. Recommended consultation with ophthalmologist. Parent agreed to schedule appointment within 2 weeks.",
      };
      const response = await appointmentsService.addAfterMeetingNotes(
        appointmentId,
        notesData
      );
      if (response.success) {
        setOpenNoteDialog(false);
        setNotificationMessage("Đã ghi chú sau cuộc hẹn!");
        setOpenNotification(true);
        setNoteData({ afterMeetingNotes: "" });
        fetchAppointments();
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleCancelAppointment = (appointmentId) => {
    setSelectedAppointment(appointments.find((a) => a._id === appointmentId));
    setOpenCancelDialog(true);
  };

  const handleCancelSubmit = async (appointmentId) => {
    try {
      const response = await appointmentsService.updateAppointmentStatus(
        appointmentId,
        { status: "CANCELLED", reason: "Appointment cancelled by user" }
      );
      if (response.success) {
        setOpenCancelDialog(false);
        setNotificationMessage("Hủy cuộc hẹn thành công!");
        setOpenNotification(true);
        fetchAppointments();
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStudent(null);
    setAppointmentData({
      studentId: "",
      parentId: "",
      resultId: "",
      meetingTime: "",
      location: "",
      notes: "",
    });
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedAppointment(null);
  };

  const handleCloseCompleteDialog = () => {
    setOpenCompleteDialog(false);
    setCompleteData({ status: "COMPLETED", reason: "" });
  };

  const handleCloseNoteDialog = () => {
    setOpenNoteDialog(false);
    setNoteData({ afterMeetingNotes: "" });
  };

  const handleCloseCancelDialog = () => {
    setOpenCancelDialog(false);
  };

  const handleCloseNotification = () => {
    setOpenNotification(false);
    setNotificationMessage("");
  };

  const isUpcomingAppointment = (meetingTime) => {
    const meetingDate = new Date(meetingTime);
    return (
      meetingDate >= currentDate &&
      meetingDate <= new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000)
    );
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "primary";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{ py: 4, bgcolor: "#f5f5f5", minHeight: "100vh" }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: "bold", color: "#1e3a8a" }}
      >
        Theo dõi sau khám
      </Typography>
      <Alert
        severity="info"
        icon={<Warning />}
        sx={{ mb: 3, fontWeight: "medium" }}
      >
        Quản lý học sinh có kết quả bất thường và lên lịch tái khám. Đảm bảo
        thông tin chính xác trước khi lưu.
      </Alert>

      <Paper
        elevation={2}
        sx={{ borderRadius: 3, overflow: "hidden", bgcolor: "#fafbfc" }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "white",
            "& .MuiTab-root": {
              fontWeight: 600,
              textTransform: "none",
              fontSize: "15px",
              minHeight: 64,
              py: 2,
            },
          }}
        >
          <Tab
            icon={
              <Chip
                label={abnormalStudents.length}
                color="error"
                size="small"
                sx={{
                  mr: 1,
                  fontWeight: 600,
                  fontSize: "12px",
                }}
              />
            }
            label="Học Sinh Bất Thường"
            iconPosition="start"
          />
          <Tab
            icon={
              <Chip
                label={appointments.length}
                color="primary"
                size="small"
                sx={{
                  mr: 1,
                  fontWeight: 600,
                  fontSize: "12px",
                }}
              />
            }
            label="Lịch Hẹn"
            iconPosition="start"
          />
        </Tabs>

        {tabValue === 0 && (
          <Box sx={{ p: 3, bgcolor: "#fafbfc" }}>
            {/* Filter Section */}
            <Paper
              elevation={1}
              sx={{
                mb: 3,
                bgcolor: "white",
                borderRadius: 2,
                border: "1px solid #e3e8ef",
              }}
            >
              <Box sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    color: "#1a202c",
                    fontWeight: 600,
                    fontSize: "18px",
                  }}
                >
                  🔍 Bộ Lọc
                </Typography>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={5}>
                    <TextField
                      fullWidth
                      label="Tìm theo tên học sinh"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search sx={{ color: "#64748b" }} />
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor: "#f8fafc",
                        },
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={3}
                    sx={{ width: "auto", minWidth: 200 }}
                  >
                    <FormControl fullWidth size="small">
                      <InputLabel>Chiến dịch</InputLabel>
                      <Select
                        value={campaignFilter}
                        onChange={handleCampaignChange}
                        label="Chiến dịch"
                        sx={{
                          borderRadius: 2,
                          bgcolor: "#f8fafc",
                        }}
                      >
                        <MenuItem value="">Tất cả</MenuItem>
                        {campaigns.map((campaign) => (
                          <MenuItem key={campaign._id} value={campaign._id}>
                            {campaign.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </Paper>

            {/* Table Section */}
            <Paper
              elevation={1}
              sx={{
                borderRadius: 2,
                border: "1px solid #e3e8ef",
                overflow: "hidden",
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: "#f8fafc" }}>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#374151",
                          fontSize: "14px",
                        }}
                      >
                        STT
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#374151",
                          fontSize: "14px",
                        }}
                      >
                        Thông Tin Học Sinh
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#374151",
                          fontSize: "14px",
                        }}
                      >
                        Mã Chiến Dịch
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#374151",
                          fontSize: "14px",
                        }}
                      >
                        Ngày Sinh
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#374151",
                          fontSize: "14px",
                        }}
                      >
                        Kiểm Tra Gần Nhất
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#374151",
                          fontSize: "14px",
                        }}
                        align="center"
                      >
                        Thao Tác
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAbnormalStudents.length > 0 ? (
                      filteredAbnormalStudents.map((student, index) => (
                        <TableRow
                          key={student.studentId}
                          hover
                          sx={{
                            "&:hover": { bgcolor: "#f8fafc" },
                            borderBottom: "1px solid #f1f5f9",
                          }}
                        >
                          <TableCell sx={{ color: "#6b7280", fontWeight: 500 }}>
                            {index + 1}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Avatar
                                sx={{
                                  bgcolor: "#3b82f6",
                                  mr: 2,
                                  width: 40,
                                  height: 40,
                                  fontSize: "16px",
                                  fontWeight: 600,
                                }}
                              >
                                {student.studentName.charAt(0).toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography
                                  variant="body2"
                                  fontWeight="600"
                                  color="#1f2937"
                                >
                                  {student.studentName}
                                </Typography>
                                <Typography variant="caption" color="#6b7280">
                                  Lớp: {student.className}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="#6b7280">
                              {student.campaignId}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={dayjs(student.studentDateOfBirth).format(
                                "DD/MM/YYYY"
                              )}
                              color="default"
                              size="small"
                              variant="outlined"
                              sx={{
                                bgcolor: "#f3f4f6",
                                borderRadius: 2,
                                fontWeight: 500,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Schedule
                                sx={{
                                  mr: 1.5,
                                  fontSize: 18,
                                  color: "#6b7280",
                                }}
                              />
                              <Typography
                                variant="body2"
                                color="#374151"
                                fontWeight="500"
                              >
                                {new Date(
                                  student.latestCheckupDate
                                ).toLocaleString("vi-VN", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant="contained"
                              color="primary"
                              startIcon={<Visibility />}
                              onClick={() =>
                                handleViewDetails(student.studentId)
                              }
                              sx={{
                                textTransform: "none",
                                borderRadius: 2,
                                fontWeight: 600,
                                px: 3,
                                py: 1,
                              }}
                            >
                              Xem Chi Tiết
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                          <Box sx={{ textAlign: "center" }}>
                            <Typography
                              color="textSecondary"
                              variant="h6"
                              sx={{ mb: 1 }}
                            >
                              😊 Tuyệt vời!
                            </Typography>
                            <Typography color="textSecondary" variant="body1">
                              Không có học sinh nào bất thường
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        )}

        {tabValue === 1 && (
          <Box sx={{ p: 3, bgcolor: "#fafbfc" }}>
            {/* Filter Section */}
            <Paper
              elevation={1}
              sx={{
                mb: 3,
                bgcolor: "white",
                borderRadius: 2,
                border: "1px solid #e3e8ef",
              }}
            >
              <Box sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    color: "#1a202c",
                    fontWeight: 600,
                    fontSize: "18px",
                  }}
                >
                  📅 Bộ Lọc Lịch Hẹn
                </Typography>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Tìm theo tên học sinh"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search sx={{ color: "#64748b" }} />
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor: "#f8fafc",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={2.5}>
                    <TextField
                      fullWidth
                      label="Từ ngày"
                      type="date"
                      value={startDate}
                      onChange={handleStartDateChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarToday sx={{ color: "#64748b" }} />
                          </InputAdornment>
                        ),
                      }}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ min: "2025-01-01", max: "2026-12-31" }}
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor: "#f8fafc",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={2.5}>
                    <TextField
                      fullWidth
                      label="Đến ngày"
                      type="date"
                      value={endDate}
                      onChange={handleEndDateChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarToday sx={{ color: "#64748b" }} />
                          </InputAdornment>
                        ),
                      }}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ min: "2025-01-01", max: "2026-12-31" }}
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor: "#f8fafc",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Trạng thái</InputLabel>
                      <Select
                        value={statusFilter}
                        onChange={handleStatusChange}
                        label="Trạng thái"
                        sx={{
                          borderRadius: 2,
                          bgcolor: "#f8fafc",
                        }}
                      >
                        <MenuItem value="">Tất cả</MenuItem>
                        <MenuItem value="SCHEDULED">Đã lên lịch</MenuItem>
                        <MenuItem value="APPROVE">Đã chấp thuận</MenuItem>
                        <MenuItem value="COMPLETED">Đã hoàn thành</MenuItem>
                        <MenuItem value="CANCELLED">Đã hủy</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </Paper>

            {/* Table Section */}
            <Paper
              elevation={1}
              sx={{
                borderRadius: 2,
                border: "1px solid #e3e8ef",
                overflow: "hidden",
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: "#f8fafc" }}>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#374151",
                          fontSize: "14px",
                        }}
                      >
                        STT
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#374151",
                          fontSize: "14px",
                        }}
                      >
                        Học Sinh
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#374151",
                          fontSize: "14px",
                        }}
                      >
                        Mã Chiến Dịch
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#374151",
                          fontSize: "14px",
                        }}
                      >
                        Thời Gian Hẹn
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#374151",
                          fontSize: "14px",
                        }}
                      >
                        Phụ Huynh
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#374151",
                          fontSize: "14px",
                        }}
                      >
                        Địa Điểm
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#374151",
                          fontSize: "14px",
                        }}
                        align="center"
                      >
                        Trạng Thái
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#374151",
                          fontSize: "14px",
                        }}
                        align="center"
                      >
                        Ưu Tiên
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#374151",
                          fontSize: "14px",
                        }}
                        align="center"
                      >
                        Thao Tác
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAppointments.length > 0 ? (
                      filteredAppointments.map((appointment, index) => (
                        <TableRow
                          key={appointment._id}
                          hover
                          sx={{
                            "&:hover": { bgcolor: "#f8fafc" },
                            borderBottom: "1px solid #f1f5f9",
                          }}
                        >
                          <TableCell sx={{ color: "#6b7280", fontWeight: 500 }}>
                            {index + 1}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Avatar
                                sx={{
                                  bgcolor: "#3b82f6",
                                  mr: 2,
                                  width: 40,
                                  height: 40,
                                  fontSize: "16px",
                                  fontWeight: 600,
                                }}
                              >
                                {appointment.studentId.fullName
                                  .charAt(0)
                                  .toUpperCase()}
                              </Avatar>
                              <Typography
                                variant="body2"
                                fontWeight="600"
                                color="#1f2937"
                              >
                                {appointment.studentId.fullName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="#6b7280">
                              {appointment.campaignId}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Schedule
                                sx={{ mr: 1.5, fontSize: 18, color: "#6b7280" }}
                              />
                              <Typography
                                variant="body2"
                                color="#374151"
                                fontWeight="500"
                              >
                                {new Date(
                                  appointment.meetingTime
                                ).toLocaleString("vi-VN", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              fontWeight="500"
                              color="#374151"
                            >
                              {appointment.parentId.username}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="#6b7280">
                              {appointment.location}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={appointment.status}
                              color={getStatusColor(appointment.status)}
                              size="small"
                              variant="filled"
                              sx={{
                                fontWeight: 600,
                                borderRadius: 2,
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            {isUpcomingAppointment(appointment.meetingTime) && (
                              <Chip
                                label="⚡ Sắp Tới"
                                color="warning"
                                size="small"
                                sx={{
                                  fontWeight: 600,
                                  borderRadius: 2,
                                }}
                              />
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                justifyContent: "center",
                                flexWrap: "wrap",
                              }}
                            >
                              {isUpcomingAppointment(
                                appointment.meetingTime
                              ) && (
                                  <>
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      startIcon={<Visibility />}
                                      onClick={() =>
                                        handleViewAppointment(appointment._id)
                                      }
                                      sx={{
                                        textTransform: "none",
                                        borderRadius: 2,
                                        fontWeight: 600,
                                        fontSize: "12px",
                                        px: 2,
                                        py: 0.5,
                                      }}
                                      size="small"
                                    >
                                      Xem
                                    </Button>
                                    {appointment.status !== "CANCELLED" && (
                                      <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<Close />}
                                        onClick={() =>
                                          handleCancelAppointment(appointment._id)
                                        }
                                        sx={{
                                          textTransform: "none",
                                          borderRadius: 2,
                                          fontWeight: 600,
                                          fontSize: "12px",
                                          px: 2,
                                          py: 0.5,
                                        }}
                                        size="small"
                                      >
                                        Hủy
                                      </Button>
                                    )}
                                  </>
                                )}
                              {new Date(appointment.meetingTime) <=
                                currentDate && (
                                  <>
                                    {appointment.status === "SCHEDULED" && (
                                      <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() =>
                                          handleCompleteAppointment(
                                            appointment._id
                                          )
                                        }
                                        sx={{
                                          textTransform: "none",
                                          borderRadius: 2,
                                          fontWeight: 600,
                                          fontSize: "12px",
                                          px: 2,
                                          py: 0.5,
                                        }}
                                        size="small"
                                      >
                                        Hoàn Thành
                                      </Button>
                                    )}
                                    {appointment.status === "COMPLETED" && (
                                      <>
                                        <Button
                                          variant="contained"
                                          color="primary"
                                          startIcon={<Visibility />}
                                          onClick={() =>
                                            handleViewAppointment(appointment._id)
                                          }
                                          sx={{
                                            textTransform: "none",
                                            borderRadius: 2,
                                            fontWeight: 600,
                                            fontSize: "12px",
                                            px: 2,
                                            py: 0.5,
                                          }}
                                          size="small"
                                        >
                                          Xem
                                        </Button>
                                        <Button
                                          variant="outlined"
                                          color="secondary"
                                          onClick={() =>
                                            handleAddNote(appointment._id)
                                          }
                                          sx={{
                                            textTransform: "none",
                                            borderRadius: 2,
                                            fontWeight: 600,
                                            fontSize: "12px",
                                            px: 2,
                                            py: 0.5,
                                          }}
                                          size="small"
                                        >
                                          Ghi Chú
                                        </Button>
                                      </>
                                    )}
                                  </>
                                )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                          <Box sx={{ textAlign: "center" }}>
                            <Typography
                              color="textSecondary"
                              variant="h6"
                              sx={{ mb: 1 }}
                            >
                              📅 Không có lịch hẹn
                            </Typography>
                            <Typography color="textSecondary" variant="body1">
                              Chưa có lịch hẹn nào được tạo
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        )}

        {/* Dialog Chi Tiết Kiểm Tra */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 },
          }}
        >
          <DialogTitle
            sx={{
              bgcolor: "#f0f9ff",
              py: 3,
              borderBottom: "1px solid #e0e7ff",
              borderRadius: "12px 12px 0 0",
            }}
          >
            <Typography variant="h5" fontWeight="700" sx={{ color: "#1e40af" }}>
              🏥 Chi Tiết Kiểm Tra Sức Khỏe Bất Thường
            </Typography>
          </DialogTitle>
          <DialogContent
            dividers
            sx={{ maxHeight: "70vh", overflow: "auto", p: 3 }}
          >
            {selectedStudent && selectedStudent.record && (
              <Box display="flex" flexDirection="column" gap={3}>
                {/* Student Info Header */}
                <Paper
                  elevation={1}
                  sx={{
                    p: 3,
                    bgcolor: "#f8fafc",
                    borderRadius: 3,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Box display="flex" alignItems="center" gap={3}>
                    <Avatar
                      sx={{
                        width: 70,
                        height: 70,
                        bgcolor: "#3b82f6",
                        fontSize: "24px",
                        fontWeight: 700,
                      }}
                    >
                      {selectedStudent.studentName.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box flex={1}>
                      <Typography
                        variant="h5"
                        fontWeight="700"
                        color="#1f2937"
                        sx={{ mb: 1 }}
                      >
                        {selectedStudent.studentName}
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="#6b7280">
                            <strong>Mã HS:</strong> {selectedStudent.studentId}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="#6b7280">
                            <strong>Lớp:</strong> {selectedStudent.className}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="#6b7280">
                            <strong>Mã Chiến Dịch:</strong>{" "}
                            {selectedStudent.campaignId}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="#6b7280">
                            <strong>Ngày sinh:</strong>{" "}
                            {new Date(
                              selectedStudent.studentDateOfBirth
                            ).toLocaleDateString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </Paper>

                {/* Checkup Info */}
                <TextField
                  label="📅 Ngày kiểm tra gần nhất"
                  value={new Date(
                    selectedStudent.latestCheckupDate
                  ).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  disabled
                  fullWidth
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      bgcolor: "#f1f5f9",
                    },
                  }}
                />

                {/* Abnormal Results */}
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight="600"
                    sx={{ mb: 2, color: "#dc2626" }}
                  >
                    ⚠️ Kết Quả Bất Thường
                  </Typography>
                  {selectedStudent.record.resultsData
                    .filter((result) => result.isAbnormal)
                    .map((result, index) => (
                      <Paper
                        key={index}
                        elevation={1}
                        sx={{
                          p: 3,
                          mb: 2,
                          borderRadius: 2,
                          bgcolor: "#fef2f2",
                          border: "1px solid #fecaca",
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight="600"
                          sx={{ mb: 2, color: "#dc2626" }}
                        >
                          {index + 1}. {result.itemName}
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              label={`${result.itemName} (${result.unit || ""
                                })`}
                              value={result.value || "-"}
                              disabled
                              fullWidth
                              variant="outlined"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                  bgcolor: "white",
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              label="Ghi chú"
                              value={result.notes || "-"}
                              disabled
                              fullWidth
                              variant="outlined"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                  bgcolor: "white",
                                },
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Paper>
                    ))}
                  {selectedStudent.record.resultsData.filter(
                    (result) => result.isAbnormal
                  ).length === 0 && (
                      <Alert severity="success" sx={{ borderRadius: 2 }}>
                        ✅ Không có kết quả bất thường nào được ghi nhận
                      </Alert>
                    )}
                </Box>

                {/* Schedule Appointment */}
                <Paper
                  elevation={1}
                  sx={{
                    p: 3,
                    bgcolor: "#f0f9ff",
                    borderRadius: 3,
                    border: "1px solid #bfdbfe",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: "#1e40af", mb: 3, fontWeight: 600 }}
                  >
                    📅 Lên Lịch Tái Khám
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="⏰ Thời gian hẹn"
                        type="datetime-local"
                        name="meetingTime"
                        value={appointmentData.meetingTime}
                        onChange={handleAppointmentChange}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                          min: currentDate.toISOString().slice(0, 16),
                        }}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            bgcolor: "white",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="📍 Địa điểm"
                        name="location"
                        value={appointmentData.location}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.length <= 200) {
                            handleAppointmentChange(e);
                          }
                        }}
                        variant="outlined"
                        placeholder="Nhập địa điểm..."
                        inputProps={{ minLength: 4, maxLength: 200 }}
                        error={
                          appointmentData.location.length > 0 &&
                          appointmentData.location.length < 4
                        }
                        helperText={
                          appointmentData.location.length > 0 &&
                            appointmentData.location.length < 4
                            ? "Địa điểm phải có ít nhất 4 ký tự"
                            : ""
                        }
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            bgcolor: "white",
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sx={{ width: "100%" }}>
                      <TextField
                        fullWidth
                        label="📝 Ghi chú"
                        name="notes"
                        value={appointmentData.notes}
                        onChange={handleAppointmentChange}
                        multiline
                        rows={3}
                        variant="outlined"
                        placeholder="Thêm ghi chú cho lịch hẹn..."
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            bgcolor: "white",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, bgcolor: "#f8fafc", gap: 2 }}>
            <Button
              onClick={handleCloseDialog}
              color="inherit"
              variant="outlined"
              size="large"
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                px: 4,
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleScheduleAppointment}
              color="primary"
              variant="contained"
              size="large"
              disabled={
                !appointmentData.meetingTime || !appointmentData.location
              }
              sx={{
                minWidth: "200px",
                borderRadius: 2,
                fontWeight: 600,
                px: 4,
              }}
            >
              📅 Lên Lịch Hẹn
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog Xem Chi Tiết Cuộc Hẹn */}
        <Dialog
          open={openViewDialog}
          onClose={handleCloseViewDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle
            sx={{
              bgcolor: "#f0f9ff",
              py: 3,
              borderBottom: "1px solid #e0e7ff",
            }}
          >
            <Typography variant="h5" fontWeight="700" sx={{ color: "#1e40af" }}>
              📋 Chi Tiết Cuộc Hẹn
            </Typography>
          </DialogTitle>
          <DialogContent
            dividers
            sx={{ maxHeight: "70vh", overflow: "auto", p: 3 }}
          >
            {selectedAppointment && (
              <Box display="flex" flexDirection="column" gap={3}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 3,
                    bgcolor: "#f8fafc",
                    borderRadius: 3,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Box display="flex" alignItems="center" gap={3}>
                    <Avatar
                      sx={{
                        width: 70,
                        height: 70,
                        bgcolor: "#3b82f6",
                        fontSize: "24px",
                        fontWeight: 700,
                      }}
                    >
                      {selectedAppointment.studentId.fullName
                        .charAt(0)
                        .toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h5"
                        fontWeight="700"
                        color="#1f2937"
                        sx={{ mb: 1 }}
                      >
                        {selectedAppointment.studentId.fullName}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="#6b7280"
                        sx={{ mb: 0.5 }}
                      >
                        <strong>Mã HS:</strong>{" "}
                        {selectedAppointment.studentId._id}
                      </Typography>
                      {/* <Typography
                        variant="body2"
                        color="#6b7280"
                        sx={{ mb: 0.5 }}
                      >
                        <strong>Mã Chiến Dịch:</strong>{" "}
                        {selectedAppointment.campaignId}
                      </Typography> */}
                      <Typography
                        variant="body2"
                        color="#6b7280"
                        sx={{ mb: 0.5 }}
                      >
                        <strong>Ngày sinh:</strong>{" "}
                        {new Date(
                          selectedAppointment.studentId.dateOfBirth
                        ).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </Typography>
                      <Typography variant="body2" color="#6b7280">
                        <strong>Giới tính:</strong>{" "}
                        {selectedAppointment.studentId.gender === "MALE"
                          ? "Nam"
                          : "Nữ"}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="⏰ Thời gian hẹn"
                      value={new Date(
                        selectedAppointment.meetingTime
                      ).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      disabled
                      fullWidth
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor: "#f1f5f9",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="📍 Địa điểm"
                      value={selectedAppointment.location}
                      disabled
                      fullWidth
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor: "#f1f5f9",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="📝 Ghi chú trước hẹn"
                      value={selectedAppointment.notes || "-"}
                      disabled
                      fullWidth
                      variant="outlined"
                      multiline
                      rows={2}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor: "#f1f5f9",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="📋 Ghi chú sau hẹn"
                      value={selectedAppointment.afterMeetingNotes || "-"}
                      disabled
                      fullWidth
                      variant="outlined"
                      multiline
                      rows={2}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor: "#f1f5f9",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="🏷️ Trạng thái"
                      value={selectedAppointment.status}
                      disabled
                      fullWidth
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor: "#f1f5f9",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="👨‍👩‍👧‍👦 Phụ huynh"
                      value={`${selectedAppointment.parentId.email} (${selectedAppointment.parentId.phone})`}
                      disabled
                      fullWidth
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor: "#f1f5f9",
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, bgcolor: "#f8fafc" }}>
            <Button
              onClick={handleCloseViewDialog}
              color="primary"
              variant="contained"
              sx={{ borderRadius: 2, fontWeight: 600, px: 4 }}
            >
              Đóng
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog Hoàn Thành */}
        <Dialog
          open={openCompleteDialog}
          onClose={handleCloseCompleteDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle
            sx={{
              bgcolor: "#f0fdf4",
              py: 3,
              borderBottom: "1px solid #dcfce7",
            }}
          >
            <Typography variant="h5" fontWeight="700" sx={{ color: "#15803d" }}>
              ✅ Hoàn Thành Cuộc Hẹn
            </Typography>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 3 }}>
            <TextField
              fullWidth
              label="📝 Lý do hoàn thành"
              name="reason"
              value={completeData.reason}
              onChange={(e) =>
                setCompleteData((prev) => ({ ...prev, reason: e.target.value }))
              }
              multiline
              rows={4}
              variant="outlined"
              placeholder="Nhập lý do hoàn thành..."
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: "#f9fafb",
                },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, bgcolor: "#f8fafc", gap: 2 }}>
            <Button
              onClick={handleCloseCompleteDialog}
              color="inherit"
              variant="outlined"
              size="large"
              sx={{ borderRadius: 2, fontWeight: 600, px: 4 }}
            >
              Hủy
            </Button>
            <Button
              onClick={() => handleCompleteSubmit(selectedAppointment._id)}
              color="success"
              variant="contained"
              size="large"
              disabled={!completeData.reason}
              sx={{
                minWidth: "200px",
                borderRadius: 2,
                fontWeight: 600,
                px: 4,
              }}
            >
              ✅ Xác Nhận
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog Thêm Ghi Chú */}
        <Dialog
          open={openNoteDialog}
          onClose={handleCloseNoteDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle
            sx={{
              bgcolor: "#fef3c7",
              py: 3,
              borderBottom: "1px solid #fde68a",
            }}
          >
            <Typography variant="h5" fontWeight="700" sx={{ color: "#b45309" }}>
              📝 Thêm Ghi Chú Sau Hẹn
            </Typography>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 3 }}>
            <TextField
              fullWidth
              label="📋 Ghi chú sau hẹn"
              name="afterMeetingNotes"
              value={noteData.afterMeetingNotes}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 200) {
                  setNoteData((prev) => ({
                    ...prev,
                    afterMeetingNotes: value,
                  }));
                }
              }}
              multiline
              rows={5}
              variant="outlined"
              placeholder="Nhập ghi chú sau hẹn..."
              inputProps={{ minLength: 19, maxLength: 200 }}
              error={
                noteData.afterMeetingNotes.length > 0 &&
                noteData.afterMeetingNotes.length < 5
              }
              helperText={
                noteData.afterMeetingNotes.length > 0 &&
                  noteData.afterMeetingNotes.length < 5
                  ? "Ghi chú phải có ít nhất 5 ký tự"
                  : ""
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: "#f9fafb",
                },
              }}
            />
          </DialogContent>

          <DialogActions sx={{ p: 3, bgcolor: "#f8fafc", gap: 2 }}>
            <Button
              onClick={handleCloseNoteDialog}
              color="inherit"
              variant="outlined"
              size="large"
              sx={{ borderRadius: 2, fontWeight: 600, px: 4 }}
            >
              Hủy
            </Button>
            <Button
              onClick={() => handleNoteSubmit(selectedAppointment._id)}
              color="warning"
              variant="contained"
              size="large"
              disabled={!noteData.afterMeetingNotes}
              sx={{
                minWidth: "200px",
                borderRadius: 2,
                fontWeight: 600,
                px: 4,
              }}
            >
              📝 Xác Nhận
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog Hủy Lịch Hẹn */}
        <Dialog
          open={openCancelDialog}
          onClose={handleCloseCancelDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle
            sx={{
              bgcolor: "#fef2f2",
              py: 3,
              borderBottom: "1px solid #fecaca",
            }}
          >
            <Typography variant="h5" fontWeight="700" sx={{ color: "#dc2626" }}>
              ❌ Xác Nhận Hủy Lịch Hẹn
            </Typography>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 3 }}>
            <Alert severity="warning" sx={{ borderRadius: 2, mb: 2 }}>
              <Typography fontWeight="600">
                ⚠️ Bạn có chắc chắn muốn hủy lịch hẹn này không?
              </Typography>
            </Alert>
            <Typography variant="body1" color="#6b7280">
              Hành động này không thể hoàn tác. Phụ huynh sẽ được thông báo về
              việc hủy lịch hẹn.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3, bgcolor: "#f8fafc", gap: 2 }}>
            <Button
              onClick={handleCloseCancelDialog}
              color="inherit"
              variant="outlined"
              size="large"
              sx={{ borderRadius: 2, fontWeight: 600, px: 4 }}
            >
              Không Hủy
            </Button>
            <Button
              onClick={() => handleCancelSubmit(selectedAppointment._id)}
              color="error"
              variant="contained"
              size="large"
              sx={{
                minWidth: "200px",
                borderRadius: 2,
                fontWeight: 600,
                px: 4,
              }}
            >
              ❌ Xác Nhận Hủy
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog Thông Báo */}
        <Dialog
          open={openNotification}
          onClose={handleCloseNotification}
          maxWidth="xs"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle sx={{ bgcolor: "#f0fdf4", textAlign: "center", py: 3 }}>
            <Typography variant="h5" fontWeight="700" sx={{ color: "#15803d" }}>
              🎉 Thành Công
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
              textAlign="center"
            >
              <CheckCircle size={48} style={{ color: "#22c55e" }} />
              <Typography variant="h6" fontWeight="600" color="#374151">
                {notificationMessage}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, justifyContent: "center" }}>
            <Button
              onClick={handleCloseNotification}
              color="success"
              variant="contained"
              size="large"
              sx={{ borderRadius: 2, fontWeight: 600, px: 6 }}
            >
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default AbnormalHealthCheck;

import React, { useState, useEffect, useCallback } from "react";
import Countdown from "react-countdown";
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
  TextField,
  Chip,
  CircularProgress,
  Pagination,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Tooltip,
  Badge,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  IconButton,
  Collapse,
  Container,
  Stack,
} from "@mui/material";
import {
  Save,
  CheckCircle,
  Info,
  AccessTime,
  Warning,
  CheckCircleOutline,
  LocalHospital,
  Refresh,
  ExpandMore,
  ExpandLess,
  Schedule,
} from "@mui/icons-material";
import { students, vaccinationCampaigns, classes } from "~/mock/mock";

function PostVaccinationMonitoring() {
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [monitoringRecords, setMonitoringRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("warning");
  const [openReactionDialog, setOpenReactionDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [reactionDateTime, setReactionDateTime] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [reactionType, setReactionType] = useState("");
  const [otherReaction, setOtherReaction] = useState("");
  const [severity, setSeverity] = useState("");
  const [description, setDescription] = useState("");
  const [treatment, setTreatment] = useState("");
  const [outcome, setOutcome] = useState("");
  const [recordedBy, setRecordedBy] = useState("");
  const [reactions, setReactions] = useState([]);
  const [expandedStats, setExpandedStats] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const itemsPerPage = 10;

  // Format time_left as MM:SS
  const formatTimeLeft = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Get time status for color coding
  const getTimeStatus = (seconds) => {
    if (seconds <= 0) return "completed";
    if (seconds <= 5 * 60) return "critical"; // Last 5 minutes
    if (seconds <= 10 * 60) return "warning"; // Last 10 minutes
    return "normal";
  };

  // Calculate statistics
  const getStats = useCallback(() => {
    const monitoring = monitoringRecords.filter(
      (r) => r.status === "Đang theo dõi"
    );
    const completed = monitoringRecords.filter(
      (r) => r.status === "Đã hoàn thành"
    );
    const critical = monitoring.filter((r) => r.time_left <= 5 * 60);
    const withReactions = monitoringRecords.filter((r) =>
      reactions.some((reaction) => reaction.student_id === r.student_id)
    );

    return {
      total: monitoringRecords.length,
      monitoring: monitoring.length,
      completed: completed.length,
      critical: critical.length,
      withReactions: withReactions.length,
      completionRate:
        monitoringRecords.length > 0
          ? ((completed.length / monitoringRecords.length) * 100).toFixed(1)
          : 0,
    };
  }, [monitoringRecords, reactions]);

  // Load monitoring records
  const loadMonitoringRecords = useCallback((campaignId, classId) => {
    if (!campaignId) {
      setMonitoringRecords([]);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      try {
        const campaign = vaccinationCampaigns.find((c) => c.id === campaignId);
        if (!campaign) {
          setMonitoringRecords([]);
          setSnackbarMessage("Không tìm thấy chiến dịch!");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          setLoading(false);
          return;
        }

        const now = new Date("2025-06-20T15:08:00+07:00"); // Đồng bộ với thời gian hiện tại
        console.log("Current time:", now); // Debug

        const filteredStudents = students
          .filter((student) => {
            const isInTargetClass = campaign.targetClasses.includes(
              student.class_id
            );
            const hasRecentVaccination = student.vaccination_history.some(
              (v) => {
                const vaccinationDate = new Date(v.date);
                const timeDiff = (now - vaccinationDate) / 1000; // Chuyển sang giây
                console.log(
                  `Student ${student.student_id} - Vaccination: ${v.date}, Time diff: ${timeDiff} seconds`
                ); // Debug
                return (
                  v.vaccine_id === campaign.id &&
                  timeDiff >= 0 &&
                  timeDiff <= 30 * 60 // 30 phút = 1800 giây
                );
              }
            );
            return isInTargetClass && hasRecentVaccination;
          })
          .filter((student) => (classId ? student.class_id === classId : true))
          .map((student, index) => {
            const vaccination = student.vaccination_history.find(
              (v) => v.vaccine_id === campaign.id
            );
            if (!vaccination || !vaccination.date) {
              console.error(
                "No valid vaccination data for student:",
                student.student_id
              );
              return null;
            }
            const adminDate = new Date(vaccination.date);
            if (isNaN(adminDate.getTime())) {
              console.error(
                "Invalid vaccination date for student:",
                student.student_id,
                vaccination.date
              );
              return null;
            }
            const endMonitoring = new Date(
              adminDate.getTime() + 30 * 60 * 1000
            );
            if (isNaN(endMonitoring.getTime())) {
              console.error(
                "Invalid end_monitoring date for student:",
                student.student_id
              );
              return null;
            }

            const timeLeftMs = Math.max(0, endMonitoring - now);

            return {
              stt: index + 1,
              student_id: student.student_id,
              full_name: student.full_name,
              class_name:
                classes.find((c) => c.id === student.class_id)?.name || "",
              health_notes: student.health_notes,
              administration_date: adminDate.toLocaleString("vi-VN"),
              end_monitoring: endMonitoring.toLocaleString("vi-VN"),
              time_left_ms: timeLeftMs,
              status: timeLeftMs > 0 ? "Đang theo dõi" : "Đã hoàn thành",
              quick_note: vaccination?.quick_note || "",
              timeStatus: getTimeStatus(Math.floor(timeLeftMs / 1000)),
            };
          })
          .filter((record) => record !== null)
          .sort((a, b) => a.time_left_ms - b.time_left_ms);

        console.log("Filtered students:", filteredStudents); // Debug
        setMonitoringRecords(filteredStudents);

        const criticalStudents = filteredStudents.filter(
          (r) =>
            r.time_left_ms / 1000 <= 5 * 60 &&
            r.time_left_ms / 1000 > 0 &&
            r.status === "Đang theo dõi"
        );
        if (criticalStudents.length > 0) {
          setSnackbarMessage(
            `⚠️ ${criticalStudents.length} học sinh sắp kết thúc thời gian theo dõi!`
          );
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error("Error loading monitoring records:", error);
        setSnackbarMessage("Có lỗi xảy ra khi tải dữ liệu!");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  // Handle campaign change
  const handleCampaignChange = (e) => {
    const campaignId = e.target.value;
    setSelectedCampaign(campaignId);
    setSelectedClass("");
    setCurrentPage(1);
    loadMonitoringRecords(campaignId, "");
  };

  // Handle class change
  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    setCurrentPage(1);
    loadMonitoringRecords(selectedCampaign, classId);
  };

  // Handle quick note change
  const handleQuickNoteChange = (studentId, note) => {
    setMonitoringRecords((prev) =>
      prev.map((record) =>
        record.student_id === studentId
          ? { ...record, quick_note: note }
          : record
      )
    );
    if (note.trim()) {
      setSnackbarMessage("💾 Ghi chú đã được lưu tự động");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    }
  };

  // Handle complete monitoring
  const handleCompleteMonitoring = (studentId, studentName) => {
    setMonitoringRecords((prev) =>
      prev.map((record) =>
        record.student_id === studentId
          ? {
              ...record,
              status: "Đã hoàn thành",
              time_left: 0,
              timeStatus: "completed",
            }
          : record
      )
    );
    setSnackbarMessage(`✅ Đã hoàn tất theo dõi cho ${studentName}`);
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  // Handle reaction dialog
  const handleOpenReactionDialog = (record) => {
    setSelectedStudent(record);
    setReactionDateTime(new Date().toISOString().slice(0, 16));
    setReactionType("");
    setOtherReaction("");
    setSeverity("");
    setDescription("");
    setTreatment("");
    setOutcome("");
    setRecordedBy("");
    setOpenReactionDialog(true);
  };

  const handleOpenDetailsDialog = (record) => {
    setSelectedStudent(record);
    setOpenDetailsDialog(true);
  };

  // Save reaction
  const handleSaveReaction = () => {
    if (!selectedStudent || !reactionType || !severity || !recordedBy) {
      setSnackbarMessage("Vui lòng điền đầy đủ thông tin bắt buộc!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const newReaction = {
        id: `R${Date.now()}`,
        student_id: selectedStudent.student_id,
        reaction_date_time: new Date(reactionDateTime).toLocaleString("vi-VN"),
        reaction_type: reactionType === "Khác" ? otherReaction : reactionType,
        severity,
        description,
        treatment: treatment || "Không có",
        outcome: outcome || "Chưa xác định",
        recorded_by: recordedBy,
        recorded_date: new Date().toLocaleString("vi-VN"),
      };

      setReactions((prev) => [...prev, newReaction]);
      setOpenReactionDialog(false);
      setSnackbarMessage(
        `🏥 Đã ghi nhận phản ứng cho ${selectedStudent.full_name}`
      );
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setLoading(false);
    }, 500);
  };

  // Dialog close handlers
  const handleCloseReactionDialog = () => {
    setOpenReactionDialog(false);
    setSelectedStudent(null);
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setSelectedStudent(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Pagination
  const totalPages = Math.ceil(monitoringRecords.length / itemsPerPage);
  const paginatedList = monitoringRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Real-time countdown timer
  useEffect(() => {
    if (!autoRefresh || monitoringRecords.length === 0) return;

    // Countdown sẽ tự xử lý, chỉ cần cập nhật khi load lại dữ liệu
  }, [autoRefresh, monitoringRecords.length]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const stats = getStats();

  return (
    <Container
      maxWidth="xl"
      sx={{ py: 4, bgcolor: "#f5f5f5", minHeight: "100vh" }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: "bold", color: "#1e3a8a" }}
      >
        Theo dõi sau tiêm
      </Typography>
      <Alert
        severity="info"
        icon={<Warning />}
        sx={{ mb: 3, fontWeight: "medium" }}
      >
        Hệ thống theo dõi tự động với cảnh báo thời gian thực
      </Alert>
      {/* Filters */}
      <Card sx={{ mb: 3, boxShadow: 2 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4} sx={{ width: "50%" }}>
              <FormControl fullWidth>
                <InputLabel>Chọn chiến dịch tiêm chủng</InputLabel>
                <Select
                  value={selectedCampaign}
                  onChange={handleCampaignChange}
                  label="Chọn chiến dịch tiêm chủng"
                  fullWidth
                >
                  <MenuItem value="">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocalHospital fontSize="small" />
                      -- Chọn chiến dịch --
                    </Box>
                  </MenuItem>
                  {vaccinationCampaigns.map((campaign) => (
                    <MenuItem key={campaign.id} value={campaign.id}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <LocalHospital fontSize="small" />
                        {`${campaign.campaignName} (${campaign.vaccineName})`}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4} sx={{ width: "30%" }}>
              <FormControl fullWidth disabled={!selectedCampaign}>
                <InputLabel>Lọc theo lớp</InputLabel>
                <Select
                  value={selectedClass}
                  onChange={handleClassChange}
                  label="Lọc theo lớp"
                >
                  <MenuItem value="">
                    <em>-- Tất cả các lớp --</em>
                  </MenuItem>
                  {classes
                    .filter(
                      (cls) =>
                        selectedCampaign &&
                        vaccinationCampaigns
                          .find((c) => c.id === selectedCampaign)
                          ?.targetClasses.includes(cls.id)
                    )
                    .map((cls) => (
                      <MenuItem key={cls.id} value={cls.id}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <LocalHospital fontSize="small" />
                          {cls.name}
                        </Box>
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card sx={{ mb: 3, boxShadow: 2 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              📈 Thống kê theo dõi
            </Typography>
            <IconButton onClick={() => setExpandedStats(!expandedStats)}>
              {expandedStats ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 2,
                  bgcolor: "primary.light",
                  borderRadius: 2,
                  color: "white",
                }}
              >
                <Typography variant="h4" fontWeight="bold">
                  {stats.total}
                </Typography>
                <Typography variant="body2">Tổng số</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 2,
                  bgcolor: "warning.light",
                  borderRadius: 2,
                  color: "white",
                }}
              >
                <Typography variant="h4" fontWeight="bold">
                  {stats.monitoring}
                </Typography>
                <Typography variant="body2">Đang theo dõi</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 2,
                  bgcolor: "success.light",
                  borderRadius: 2,
                  color: "white",
                }}
              >
                <Typography variant="h4" fontWeight="bold">
                  {stats.completed}
                </Typography>
                <Typography variant="body2">Đã hoàn thành</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 2,
                  bgcolor: "error.light",
                  borderRadius: 2,
                  color: "white",
                }}
              >
                <Typography variant="h4" fontWeight="bold">
                  {stats.critical}
                </Typography>
                <Typography variant="body2">Cần chú ý</Typography>
              </Box>
            </Grid>
          </Grid>
          <Collapse in={expandedStats}>
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="body2">Tỷ lệ hoàn thành:</Typography>
                    <Box sx={{ flex: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={parseFloat(stats.completionRate)}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    <Typography variant="body2" fontWeight="bold">
                      {stats.completionRate}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Warning color="warning" />
                    <Typography variant="body2">
                      Có phản ứng: <strong>{stats.withReactions}</strong> học
                      sinh
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </CardContent>
      </Card>

      {/* Main Table */}
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="300px"
        >
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          <TableBody>
            {paginatedList.length > 0 ? (
              paginatedList.map((record, index) => (
                <TableRow
                  key={record.student_id}
                  sx={{
                    backgroundColor:
                      record.timeStatus === "critical"
                        ? "#ffebee"
                        : record.timeStatus === "warning"
                        ? "#fff8e1"
                        : record.timeStatus === "completed"
                        ? "#f1f8e9"
                        : "white",
                    "&:hover": {
                      backgroundColor:
                        record.timeStatus === "critical"
                          ? "#ffcdd2"
                          : record.timeStatus === "warning"
                          ? "#ffecb3"
                          : record.timeStatus === "completed"
                          ? "#dcedc8"
                          : "#f5f5f5",
                      transform: "translateY(-1px)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    },
                    borderLeft:
                      record.timeStatus === "critical"
                        ? "4px solid #f44336"
                        : record.timeStatus === "warning"
                        ? "4px solid #ff9800"
                        : record.timeStatus === "completed"
                        ? "4px solid #4caf50"
                        : "4px solid transparent",
                    transition: "all 0.2s ease-in-out",
                    position: "relative",
                  }}
                >
                  {/* STT Column */}
                  <TableCell sx={{ width: "50px", textAlign: "center", p: 1 }}>
                    <Typography
                      variant="body2"
                      fontWeight="medium"
                      color="text.secondary"
                    >
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </Typography>
                  </TableCell>

                  {/* Student Info Column */}
                  <TableCell sx={{ minWidth: "250px", p: 1.5 }}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Avatar
                        sx={{
                          bgcolor:
                            record.timeStatus === "critical"
                              ? "error.main"
                              : record.timeStatus === "warning"
                              ? "warning.main"
                              : record.timeStatus === "completed"
                              ? "success.main"
                              : "primary.main",
                          width: 40,
                          height: 40,
                          fontSize: "1rem",
                          fontWeight: "bold",
                        }}
                      >
                        {record.full_name.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          fontWeight="600"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            lineHeight: 1.3,
                          }}
                        >
                          {record.full_name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: "block",
                            mt: 0.25,
                            fontSize: "0.7rem",
                          }}
                        >
                          ID: {record.student_id}
                        </Typography>
                        <Chip
                          label={record.class_name}
                          size="small"
                          variant="outlined"
                          sx={{
                            height: "18px",
                            fontSize: "0.65rem",
                            mt: 0.25,
                          }}
                        />
                        {record.health_notes && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              mt: 0.75,
                              p: 0.75,
                              bgcolor: "warning.50",
                              borderRadius: 0.75,
                              border: "1px solid",
                              borderColor: "warning.200",
                            }}
                          >
                            <Warning
                              sx={{ fontSize: 14, color: "warning.main" }}
                            />
                            <Typography
                              variant="caption"
                              color="warning.dark"
                              sx={{ fontWeight: "medium", fontSize: "0.7rem" }}
                            >
                              {record.health_notes}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Date Info Column */}
                  <TableCell sx={{ minWidth: "140px", p: 1.5 }}>
                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        sx={{ fontSize: "0.8rem" }}
                      >
                        {record.administration_date}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          mt: 0.25,
                          fontSize: "0.7rem",
                        }}
                      >
                        <Schedule sx={{ fontSize: 12 }} />
                        Kết thúc: {record.end_monitoring}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Countdown Column */}
                  <TableCell sx={{ width: "100px", textAlign: "center", p: 1 }}>
                    {record.time_left_ms > 0 ? (
                      <Countdown
                        date={Date.now() + record.time_left_ms}
                        renderer={({ minutes, seconds }) => (
                          <Chip
                            label={`${minutes
                              .toString()
                              .padStart(2, "0")}:${seconds
                              .toString()
                              .padStart(2, "0")}`}
                            color={
                              record.timeStatus === "critical"
                                ? "error"
                                : record.timeStatus === "warning"
                                ? "warning"
                                : "primary"
                            }
                            variant="filled"
                            size="small"
                            sx={{
                              fontWeight: "bold",
                              fontSize: "0.85rem",
                              minWidth: "75px",
                              fontFamily: "monospace",
                              animation:
                                record.timeStatus === "critical"
                                  ? "pulse 1s infinite"
                                  : "none",
                              "@keyframes pulse": {
                                "0%": { opacity: 1 },
                                "50%": { opacity: 0.7 },
                                "100%": { opacity: 1 },
                              },
                            }}
                          />
                        )}
                        onComplete={() => {
                          setMonitoringRecords((prev) =>
                            prev.map((r) =>
                              r.student_id === record.student_id
                                ? {
                                    ...r,
                                    status: "Đã hoàn thành",
                                    time_left_ms: 0,
                                    timeStatus: "completed",
                                  }
                                : r
                            )
                          );
                          setSnackbarMessage(
                            `⏰ Đã hoàn thành theo dõi cho ${record.full_name}`
                          );
                          setSnackbarSeverity("success");
                          setSnackbarOpen(true);
                        }}
                      />
                    ) : (
                      <Chip
                        label="Hoàn thành"
                        color="success"
                        variant="filled"
                        size="small"
                        icon={<CheckCircle sx={{ fontSize: 14 }} />}
                        sx={{
                          fontWeight: "bold",
                          fontSize: "0.7rem",
                          minWidth: "85px",
                        }}
                      />
                    )}
                  </TableCell>

                  {/* Status Column */}
                  <TableCell sx={{ width: "120px", p: 1 }}>
                    <Chip
                      label={record.status}
                      icon={
                        record.status === "Đang theo dõi" ? (
                          <AccessTime sx={{ fontSize: 14 }} />
                        ) : (
                          <CheckCircleOutline sx={{ fontSize: 14 }} />
                        )
                      }
                      color={
                        record.status === "Đang theo dõi" ? "info" : "success"
                      }
                      variant={
                        record.status === "Đang theo dõi"
                          ? "filled"
                          : "outlined"
                      }
                      size="small"
                      sx={{
                        fontWeight: "medium",
                        minWidth: "110px",
                        fontSize: "0.7rem",
                      }}
                    />
                  </TableCell>

                  {/* Quick Note Column */}
                  <TableCell sx={{ minWidth: "200px" }}>
                    <TextField
                      size="small"
                      value={record.quick_note}
                      onChange={(e) =>
                        handleQuickNoteChange(record.student_id, e.target.value)
                      }
                      placeholder="Ghi chú tình trạng..."
                      fullWidth
                      variant="outlined"
                      multiline
                      maxRows={3}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          fontSize: "0.875rem",
                          backgroundColor: "grey.50",
                          "&:hover": {
                            backgroundColor: "grey.100",
                          },
                          "&.Mui-focused": {
                            backgroundColor: "white",
                          },
                        },
                      }}
                    />
                  </TableCell>

                  {/* Actions Column */}
                  <TableCell sx={{ minWidth: "200px" }}>
                    <Stack spacing={1} direction="column">
                      <Stack spacing={1} direction="row">
                        <Tooltip title="Hoàn tất theo dõi" arrow>
                          <span>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              startIcon={<CheckCircle sx={{ fontSize: 16 }} />}
                              onClick={() =>
                                handleCompleteMonitoring(
                                  record.student_id,
                                  record.full_name
                                )
                              }
                              disabled={record.status === "Đã hoàn thành"}
                              sx={{
                                minWidth: "105px",
                                fontSize: "0.75rem",
                                textTransform: "none",
                                fontWeight: "medium",
                              }}
                            >
                              Hoàn tất
                            </Button>
                          </span>
                        </Tooltip>
                        <Tooltip title="Ghi nhận phản ứng" arrow>
                          <Button
                            variant="outlined"
                            color="warning"
                            size="small"
                            startIcon={<Warning sx={{ fontSize: 16 }} />}
                            onClick={() => handleOpenReactionDialog(record)}
                            sx={{
                              minWidth: "105px",
                              fontSize: "0.75rem",
                              textTransform: "none",
                              fontWeight: "medium",
                            }}
                          >
                            Phản ứng
                          </Button>
                        </Tooltip>
                      </Stack>
                      <Tooltip title="Xem chi tiết học sinh" arrow>
                        <Button
                          variant="text"
                          color="info"
                          size="small"
                          startIcon={<Info sx={{ fontSize: 16 }} />}
                          onClick={() => handleOpenDetailsDialog(record)}
                          fullWidth
                          sx={{
                            fontSize: "0.75rem",
                            textTransform: "none",
                            fontWeight: "medium",
                            justifyContent: "flex-start",
                          }}
                        >
                          Xem chi tiết
                        </Button>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <LocalHospital
                      sx={{
                        fontSize: 80,
                        color: "text.disabled",
                        opacity: 0.5,
                      }}
                    />
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      sx={{ fontWeight: "medium" }}
                    >
                      {!selectedCampaign
                        ? "Vui lòng chọn chiến dịch tiêm chủng"
                        : "Không có học sinh nào cần theo dõi"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.disabled"
                      sx={{ maxWidth: 400, textAlign: "center" }}
                    >
                      {!selectedCampaign
                        ? "Chọn một chiến dịch từ danh sách để xem các học sinh cần theo dõi sau tiêm chủng"
                        : "Tất cả học sinh trong chiến dịch này đã hoàn thành thời gian theo dõi"}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}

      {/* Reaction Dialog */}
      <Dialog
        open={openReactionDialog}
        onClose={handleCloseReactionDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "warning.light", color: "white" }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Warning />
            Ghi nhận phản ứng sau tiêm - {selectedStudent?.full_name}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2} direction="column" alignItems="stretch">
            <Grid item xs={12}>
              <TextField
                label="Thời gian phản ứng"
                type="datetime-local"
                value={reactionDateTime}
                onChange={(e) => setReactionDateTime(e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Loại phản ứng"
                value={reactionType}
                onChange={(e) => setReactionType(e.target.value)}
                fullWidth
                variant="outlined"
                select
                required
              >
                <MenuItem value="Sốt">Sốt</MenuItem>
                <MenuItem value="Đau tại chỗ tiêm">Đau tại chỗ tiêm</MenuItem>
                <MenuItem value="Sưng tại chỗ tiêm">Sưng tại chỗ tiêm</MenuItem>
                <MenuItem value="Đỏ tại chỗ tiêm">Đỏ tại chỗ tiêm</MenuItem>
                <MenuItem value="Buồn nôn">Buồn nôn</MenuItem>
                <MenuItem value="Chóng mặt">Chóng mặt</MenuItem>
                <MenuItem value="Dị ứng">Dị ứng</MenuItem>
                <MenuItem value="Khác">Khác</MenuItem>
              </TextField>
            </Grid>
            {reactionType === "Khác" && (
              <Grid item xs={12}>
                <TextField
                  label="Mô tả loại phản ứng khác"
                  value={otherReaction}
                  onChange={(e) => setOtherReaction(e.target.value)}
                  fullWidth
                  variant="outlined"
                  required
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                label="Mức độ nghiêm trọng"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                fullWidth
                variant="outlined"
                select
                required
              >
                <MenuItem value="Nhẹ">Nhẹ</MenuItem>
                <MenuItem value="Vừa">Vừa</MenuItem>
                <MenuItem value="Nặng">Nặng</MenuItem>
                <MenuItem value="Rất nặng">Rất nặng</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Người ghi nhận"
                value={recordedBy}
                onChange={(e) => setRecordedBy(e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="Tên y tá/bác sĩ..."
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Mô tả chi tiết"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                placeholder="Mô tả chi tiết về triệu chứng, thời gian xuất hiện..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Biện pháp xử trí"
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                placeholder="Các biện pháp đã thực hiện..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Kết quả theo dõi"
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                placeholder="Tình trạng sau xử trí, khuyến nghị..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseReactionDialog} color="secondary">
            Hủy
          </Button>
          <Button
            onClick={handleSaveReaction}
            variant="contained"
            color="warning"
            startIcon={loading ? <CircularProgress size={20} /> : <Save />}
            disabled={loading}
          >
            {loading ? "Đang lưu..." : "Lưu phản ứng"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Details Dialog */}
      <Dialog
        open={openDetailsDialog}
        onClose={handleCloseDetailsDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "info.light", color: "white" }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Info />
            Chi tiết theo dõi - {selectedStudent?.full_name}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedStudent && (
            <Box>
              <Box display="flex" gap={2} alignItems="center" mb={3}>
                <Avatar sx={{ width: 60, height: 60, bgcolor: "primary.main" }}>
                  {selectedStudent.full_name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {selectedStudent.full_name}
                  </Typography>
                  <Typography color="text.secondary">
                    Mã HS: {selectedStudent.student_id}
                  </Typography>
                  <Typography color="text.secondary">
                    Lớp: {selectedStudent.class_name}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Thông tin theo dõi
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Thời gian tiêm
                  </Typography>
                  <Typography variant="body1">
                    {selectedStudent.administration_date}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Kết thúc theo dõi
                  </Typography>
                  <Typography variant="body1">
                    {selectedStudent.end_monitoring}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Trạng thái
                  </Typography>
                  <Typography variant="body1">
                    {selectedStudent.status}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Ghi chú sức khỏe
                  </Typography>
                  <Typography variant="body1">
                    {selectedStudent.health_notes || "Không có"}
                  </Typography>
                </Grid>
                {selectedStudent.quick_note && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Ghi chú theo dõi
                    </Typography>
                    <Typography variant="body1">
                      {selectedStudent.quick_note}
                    </Typography>
                  </Grid>
                )}
              </Grid>
              <Typography variant="h6" fontWeight="bold" mt={4} mb={2}>
                Phản ứng sau tiêm
              </Typography>
              <TableContainer
                component={Paper}
                sx={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "grey.100" }}>
                      <TableCell sx={{ fontWeight: "bold" }}>STT</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Ngày/Giờ
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Loại phản ứng
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Mức độ</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Mô tả</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Biện pháp xử lý
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Kết quả</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Người ghi nhận
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Ngày ghi nhận
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reactions
                      .filter(
                        (reaction) =>
                          reaction.student_id === selectedStudent.student_id
                      )
                      .map((reaction, index) => (
                        <TableRow
                          key={reaction.id}
                          sx={{ "&:hover": { backgroundColor: "#f0f0f0" } }}
                        >
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{reaction.reaction_date_time}</TableCell>
                          <TableCell>{reaction.reaction_type}</TableCell>
                          <TableCell>{reaction.severity}</TableCell>
                          <TableCell>
                            {reaction.description || "Không có"}
                          </TableCell>
                          <TableCell>{reaction.treatment}</TableCell>
                          <TableCell>{reaction.outcome}</TableCell>
                          <TableCell>{reaction.recorded_by}</TableCell>
                          <TableCell>{reaction.recorded_date}</TableCell>
                        </TableRow>
                      ))}
                    {reactions.filter(
                      (reaction) =>
                        reaction.student_id === selectedStudent.student_id
                    ).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9} align="center">
                          <Typography color="text.secondary" py={2}>
                            Chưa có phản ứng nào được ghi nhận.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDetailsDialog}
            variant="contained"
            color="primary"
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
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
    </Container>
  );
}

export default PostVaccinationMonitoring;

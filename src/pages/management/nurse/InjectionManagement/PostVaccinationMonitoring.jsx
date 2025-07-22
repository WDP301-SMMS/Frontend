import React, { useState, useEffect, useCallback } from "react";
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
  Card,
  CardContent,
  Grid,
  LinearProgress,
  IconButton,
  Collapse,
  Container,
  Stack,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  Save,
  Warning,
  Info,
  LocalHospital,
  ExpandMore,
  ExpandLess,
  CheckCircle,
} from "@mui/icons-material";
import campaignService from "~/libs/api/services/campaignService";

function PostVaccinationMonitoring() {
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [monitoringRecords, setMonitoringRecords] = useState([]);
  const [immunizationHistory, setImmunizationHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("warning");
  const [openReactionDialog, setOpenReactionDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [reactionData, setReactionData] = useState({
    observedAt: new Date().toISOString().slice(0, 16),
    temperatureLevel: "",
    notes: "",
    isAbnormal: false,
    actionsTaken: "",
  });
  const [reactions, setReactions] = useState([]);
  const [expandedStats, setExpandedStats] = useState(false);
  const [temperatureError, setTemperatureError] = useState("");
  const [openCompleteDialog, setOpenCompleteDialog] = useState(false);
  const itemsPerPage = 10;

  const validateTemperature = (temperature) => {
    const temp = parseFloat(temperature);
    if (isNaN(temp)) return "Nhiệt độ phải là một số hợp lệ!";
    if (temp < 35 || temp > 42)
      return "Nhiệt độ phải nằm trong khoảng 35°C đến 42°C!";
    return "";
  };


  // Handle opening completion dialog
  const handleOpenCompleteDialog = () => {
    setOpenCompleteDialog(true);
  };
  // Handle confirming completion
const handleConfirmComplete = async () => {
  if (!selectedCampaign) return;
  setLoading(true);
  try {
    const nurseID= localStorage.getItem("nurseID");
    const campaignData = {
      status: "COMPLETED",
      createdBy: nurseID, // Replace "userId" with actual user ID
    };
    const response = await campaignService.updateCampaign(selectedCampaign, campaignData);
    setSnackbarMessage("Chiến dịch đã được hoàn tất thành công!");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    setOpenCompleteDialog(false);
    // Optionally refresh campaigns or monitoring records
    const refreshedResponse = await campaignService.getCampaignsByStatus("IN_PROGRESS", 1, 100);
    if (refreshedResponse.success) {
      setCampaigns(refreshedResponse.data || []);
    }
  } catch (error) {
    setSnackbarMessage("Có lỗi xảy ra khi hoàn tất chiến dịch!");
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
  } finally {
    setLoading(false);
  }
};
  // Handle closing dialogs
  const handleCloseCompleteDialog = () => {
    setOpenCompleteDialog(false);
  };
  // Calculate statistics
  const getStats = useCallback(() => {
    const monitoring = monitoringRecords.filter(
      (r) => r.status === "Đang theo dõi" || r.status === "Phản ứng bất thường"
    );
    const completed = monitoringRecords.filter(
      (r) => r.status === "Đã hoàn thành"
    );
    const withReactions = monitoringRecords.filter(
      (r) =>
        r.status === "Phản ứng bất thường" ||
        reactions.some(
          (reaction) =>
            reaction.student_id === r.student_id && reaction.isAbnormal
        )
    );

    return {
      total: monitoringRecords.length,
      monitoring: monitoring.length,
      completed: completed.length,
      withReactions: withReactions.length,
      completionRate:
        monitoringRecords.length > 0
          ? ((completed.length / monitoringRecords.length) * 100).toFixed(1)
          : 0,
    };
  }, [monitoringRecords, reactions]);

  // Load monitoring records
  const loadMonitoringRecords = useCallback((campaignId, classId, query) => {
    console.log(
      "Loading monitoring records for campaignId:",
      campaignId,
      "classId:",
      classId,
      "query:",
      query
    );
    if (!campaignId) {
      console.log("No campaignId provided, resetting monitoringRecords");
      setMonitoringRecords([]);
      return;
    }

    setLoading(true);
    setTimeout(async () => {
      try {
        console.log("Fetching data for campaignId:", campaignId);
        const response = await campaignService.getListVaccination(campaignId);
        console.log("API Response:", response);

        if (!response.success) {
          throw new Error(
            response.message || "API call failed without success flag"
          );
        }

        if (!Array.isArray(response.data) || response.data.length === 0) {
          console.warn(
            "No data or empty array returned from API:",
            response.data
          );
          setMonitoringRecords([]);
          return;
        }
        console.log("Raw records:", response.data);

        const filteredRecords = response.data
          .filter((record) =>
            [
              "PENDING",
              "APPROVED",
              "DECLINED",
              "COMPLETED",
              "REVOKED",
              "UNDER_OBSERVATION",
              "UNDER_OPSERVATION", // Handle typo in sample data
              "ADVERSE_REACTION",
            ].includes(record.vaccinationStatus)
          )
          .filter((record) => (classId ? record.className === classId : true))
          .filter((record) =>
            record.fullName.toLowerCase().includes(query.toLowerCase())
          )
          .map((record, index) => ({
            stt: index + 1,
            student_id: record.studentId,
            full_name: record.fullName,
            class_name: record.className,
            health_notes:
              [
                ...(record.allergies?.length > 0
                  ? record.allergies.map(
                    (c) => `Dị ứng: ${record.allergies}`
                  ):[]),
                ...(record.chronicConditions?.length > 0
                  ? record.chronicConditions.map(
                      (c) => `Bệnh mãn tính: ${c.conditionName}`
                    )
                  : []),
              ].join("; ") || "Không có",
            allergies: record.allergies || [],
            chronicConditions: record.chronicConditions || [],
            administration_date: record.administeredAt
              ? new Date(record.administeredAt).toLocaleString("vi-VN")
              : "Chưa có thông tin",
            status:
              record.vaccinationStatus === "PENDING"
                ? "Chờ xử lý"
                : record.vaccinationStatus === "APPROVED"
                ? "Đã phê duyệt"
                : record.vaccinationStatus === "DECLINED"
                ? "Từ chối"
                : record.vaccinationStatus === "COMPLETED"
                ? "Đã hoàn thành"
                : record.vaccinationStatus === "REVOKED"
                ? "Đã thu hồi"
                : record.vaccinationStatus === "UNDER_OBSERVATION" ||
                  record.vaccinationStatus === "UNDER_OPSERVATION"
                ? "Đang theo dõi"
                : record.vaccinationStatus === "ADVERSE_REACTION"
                ? "Phản ứng bất thường"
                : "Không xác định",
            consentId: record.consentId || "",
          }))
          .sort((a, b) => {
            const statusOrder = {
              "Phản ứng bất thường": 1,
              "Đang theo dõi": 2,
              "Chờ xử lý": 3,
              "Đã phê duyệt": 4,
              "Từ chối": 5,
              "Đã hoàn thành": 6,
              "Đã thu hồi": 7,
              "Không xác định": 8,
            };
            return (
              statusOrder[a.status] - statusOrder[b.status] || a.stt - b.stt
            );
          });

        console.log("Filtered records:", filteredRecords);
        setMonitoringRecords([...filteredRecords]);

        const criticalStudents = filteredRecords.filter(
          (r) =>
            r.status === "Đang theo dõi" || r.status === "Phản ứng bất thường"
        );
        if (criticalStudents.length > 0) {
          setSnackbarMessage(
            `⚠️ ${criticalStudents.length} học sinh cần chú ý!`
          );
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        } else {
          console.log("No critical students found.");
        }
      } catch (error) {
        console.error("Error in loadMonitoringRecords:", error);
        setSnackbarMessage("Có lỗi xảy ra khi tải dữ liệu: " + error.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setMonitoringRecords([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  // Load campaigns
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const response = await campaignService.getCampaignsByStatus(
          "IN_PROGRESS",
          1,
          100
        );
        if (response.success) {
          setCampaigns(response.data || []);
          const firstCampaignId = response.data?.[0]?._id;
          if (firstCampaignId) {
            console.log("Setting initial campaign to:", firstCampaignId);
            setSelectedCampaign(firstCampaignId);
            loadMonitoringRecords(firstCampaignId, selectedClass, searchQuery);
          } else {
            console.warn("No campaigns found in response:", response.data);
            setSelectedCampaign("");
          }
        } else {
          throw new Error(
            response.message || "Không thể tải danh sách chiến dịch."
          );
        }
      } catch (error) {
        console.error("Failed to load campaigns:", error);
        setSnackbarMessage("Có lỗi xảy ra khi tải danh sách chiến dịch!");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, [loadMonitoringRecords, selectedClass, searchQuery]);

  // Fetch immunization history
  useEffect(() => {
    const fetchImmunizationHistory = async () => {
      if (openDetailsDialog && selectedStudent?.consentId) {
        setHistoryLoading(true);
        try {
          const response = await campaignService.getStudentImmunizationHistory(
            selectedStudent.student_id
          );
          if (response.success) {
            const matchedHistory = response.data.find(
              (record) => record.consentId === selectedStudent.consentId
            );
            setImmunizationHistory(matchedHistory || null);

            // Sync postVaccinationChecks with reactions state
            if (matchedHistory) {
              setReactions(
                matchedHistory.postVaccinationChecks.map((check) => ({
                  id: `R${Date.now()}-${check.observedAt}`, // Unique ID
                  student_id: selectedStudent.student_id,
                  observedAt: new Date(check.observedAt).toLocaleString(
                    "vi-VN"
                  ),
                  temperatureLevel: check.temperatureLevel,
                  notes: check.notes,
                  isAbnormal: check.isAbnormal,
                  actionsTaken: check.actionsTaken || "Không có",
                  recorded_date: new Date(check.observedAt).toLocaleString(
                    "vi-VN"
                  ),
                }))
              );
            }
          } else {
            throw new Error(
              response.message || "Không thể tải lịch sử tiêm chủng."
            );
          }
        } catch (error) {
          console.error("Failed to load immunization history:", error);
          setImmunizationHistory(null);
          setReactions([]);
        } finally {
          setHistoryLoading(false);
        }
      } else {
        setImmunizationHistory(null);
        setReactions([]);
      }
    };
    fetchImmunizationHistory();
  }, [openDetailsDialog, selectedStudent]);

  // Handle campaign change
  const handleCampaignChange = (e) => {
    const campaignId = e.target.value;
    setSelectedCampaign(campaignId);
    setSelectedClass("");
    setCurrentPage(1);
    loadMonitoringRecords(campaignId, "", searchQuery);
  };

  // Handle class change
  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    setCurrentPage(1);
    loadMonitoringRecords(selectedCampaign, classId, searchQuery);
  };

  // Handle search change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(1);
    loadMonitoringRecords(selectedCampaign, selectedClass, query);
  };

  // Handle reaction dialog
  const handleOpenReactionDialog = (record) => {
    setSelectedStudent(record);
    setReactionData({
      observedAt: new Date().toISOString().slice(0, 16),
      temperatureLevel: "",
      notes: "",
      isAbnormal: false,
      actionsTaken: "",
    });
    setTemperatureError("");
    setOpenReactionDialog(true);
  };

  // Handle details dialog
  const handleOpenDetailsDialog = (record) => {
    setSelectedStudent(record);
    setOpenDetailsDialog(true);
  };

  // Save reaction
  const handleSaveReaction = async () => {
    const tempError = validateTemperature(reactionData.temperatureLevel);
    if (tempError) {
      setTemperatureError(tempError);
      return;
    }
    if (
      !selectedStudent ||
      !reactionData.observedAt ||
      !reactionData.temperatureLevel ||
      !reactionData.notes ||
      (reactionData.isAbnormal && !reactionData.actionsTaken)
    ) {
      setSnackbarMessage("Vui lòng điền đầy đủ thông tin bắt buộc!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    try {
      const observationData = {
        observedAt: new Date(reactionData.observedAt).toISOString(),
        temperatureLevel: parseFloat(reactionData.temperatureLevel),
        notes: reactionData.notes,
        isAbnormal: reactionData.isAbnormal,
        ...(reactionData.isAbnormal && {
          actionsTaken: reactionData.actionsTaken,
        }),
      };

      await campaignService.addObservation(
        selectedStudent.consentId,
        observationData
      );

      const newReaction = {
        id: `R${Date.now()}`,
        student_id: selectedStudent.student_id,
        observedAt: new Date(reactionData.observedAt).toLocaleString("vi-VN"),
        temperatureLevel: reactionData.temperatureLevel,
        notes: reactionData.notes,
        isAbnormal: reactionData.isAbnormal,
        actionsTaken: reactionData.isAbnormal
          ? reactionData.actionsTaken
          : "Không có",
        recorded_date: new Date().toLocaleString("vi-VN"),
      };

      setReactions((prev) => [...prev, newReaction]);

      if (reactionData.isAbnormal) {
        setMonitoringRecords((prev) =>
          prev.map((record) =>
            record.student_id === selectedStudent.student_id
              ? { ...record, status: "Phản ứng bất thường" }
              : record
          )
        );
        setSnackbarMessage(
          `🏥 Đã ghi nhận phản ứng cho ${selectedStudent.full_name}`
        );
      } else {
        setMonitoringRecords((prev) =>
          prev.map((record) =>
            record.student_id === selectedStudent.student_id
              ? { ...record, status: "Đã hoàn thành" }
              : record
          )
        );
        setSnackbarMessage(
          `✅ Đã ghi nhận quan sát cho ${selectedStudent.full_name}`
        );
      }

      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setOpenReactionDialog(false);
      setTemperatureError("");
    } catch (error) {
      console.error("Error saving reaction:", error);
      setSnackbarMessage("Có lỗi xảy ra khi lưu phản ứng!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Dialog close handlers
  const handleCloseReactionDialog = () => {
    setOpenReactionDialog(false);
    setSelectedStudent(null);
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setSelectedStudent(null);
    setImmunizationHistory(null);
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

  const stats = getStats();

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 4,
        bgcolor: "#f9fafb",
        minHeight: "100vh",
        borderRadius: 2,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: 700,
          color: "#1e3a8a",
          letterSpacing: "-0.5px",
        }}
      >
        Theo dõi sau tiêm
      </Typography>
      <Alert
        severity="info"
        icon={<Warning />}
        sx={{ mb: 3, fontWeight: "medium" }}
      >
     Theo dõi sau tiêm là quá trình quan trọng để đảm bảo sức khỏe của học sinh sau khi tiêm chủng. Vui lòng chọn chiến dịch tiêm chủng và theo dõi tình trạng sức khỏe của học sinh.
      </Alert>
      {/* Filters */}
      <Card
        sx={{ mb: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderRadius: 2 }}
      >
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel sx={{ fontWeight: 500 }}>
                  Chọn chiến dịch tiêm chủng
                </InputLabel>
                <Select
                  value={selectedCampaign}
                  onChange={handleCampaignChange}
                  label="Chọn chiến dịch tiêm chủng"
                  sx={{ borderRadius: 2, bgcolor: "white" }}
                >
                  <MenuItem value="">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocalHospital fontSize="small" />
                      -- Chọn chiến dịch --
                    </Box>
                  </MenuItem>
                  {campaigns.map((campaign) => (
                    <MenuItem key={campaign._id} value={campaign._id}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <LocalHospital fontSize="small" />
                        {`${campaign.name} (${campaign.vaccineName})`}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl
                fullWidth
                sx={{ width: "200px" }}
                disabled={!selectedCampaign}
                variant="outlined"
              >
                <InputLabel sx={{ fontWeight: 500 }}>Lọc theo lớp</InputLabel>
                <Select
                  value={selectedClass}
                  onChange={handleClassChange}
                  label="Lọc theo lớp"
                  sx={{ borderRadius: 2, bgcolor: "white" }}
                >
                  <MenuItem value="">
                    <em>-- Tất cả các lớp --</em>
                  </MenuItem>
                  {monitoringRecords
                    .map((r) => r.class_name)
                    .filter(
                      (value, index, self) => self.indexOf(value) === index
                    )
                    .map((className) => (
                      <MenuItem key={className} value={className}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <LocalHospital fontSize="small" />
                          {className}
                        </Box>
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Tìm kiếm học sinh"
                value={searchQuery}
                onChange={handleSearchChange}
                fullWidth
                variant="outlined"
                placeholder="Nhập tên học sinh..."
                sx={{ borderRadius: 2, bgcolor: "white" }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {/* Statistics */}
<Card
  sx={{
    mb: 3,
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    borderRadius: 3,
    overflow: "hidden",
    border: "1px solid rgba(0,0,0,0.06)",
  }}
>
  <CardContent sx={{ p: 3 }}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: "700",
          color: "text.primary",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        📊 Thống kê theo dõi
      </Typography>
      <Button
        variant="contained"
        color="success"
        onClick={handleOpenCompleteDialog}
        disabled={!selectedCampaign || loading}
        sx={{
          textTransform: "none",
          fontWeight: "600",
          borderRadius: 2,
          px: 3,
          py: 1,
          boxShadow: "0 4px 12px rgba(46, 125, 50, 0.3)",
        }}
      >
        Hoàn tất tiêm chủng
      </Button>
    </Box>

    <Grid container spacing={3}>
      <Grid item xs={6} md={3}>
        <Box
          sx={{
            textAlign: "center",
            p: 3,
            background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
            borderRadius: 3,
            color: "white",
            boxShadow: "0 6px 20px rgba(25, 118, 210, 0.3)",
            transition: "transform 0.2s ease",
            "&:hover": {
              transform: "translateY(-2px)",
            },
          }}
        >
          <Typography variant="h3" fontWeight="700" sx={{ mb: 1 }}>
            {stats.total}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "500", opacity: 0.9 }}>
            Tổng số
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={6} md={3}>
        <Box
          sx={{
            textAlign: "center",
            p: 3,
            background: "linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)",
            borderRadius: 3,
            color: "white",
            boxShadow: "0 6px 20px rgba(245, 124, 0, 0.3)",
            transition: "transform 0.2s ease",
            "&:hover": {
              transform: "translateY(-2px)",
            },
          }}
        >
          <Typography variant="h3" fontWeight="700" sx={{ mb: 1 }}>
            {stats.monitoring}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "500", opacity: 0.9 }}>
            Đang theo dõi
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={6} md={3}>
        <Box
          sx={{
            textAlign: "center",
            p: 3,
            background: "linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)",
            borderRadius: 3,
            color: "white",
            boxShadow: "0 6px 20px rgba(56, 142, 60, 0.3)",
            transition: "transform 0.2s ease",
            "&:hover": {
              transform: "translateY(-2px)",
            },
          }}
        >
          <Typography variant="h3" fontWeight="700" sx={{ mb: 1 }}>
            {stats.completed}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "500", opacity: 0.9 }}>
            Đã hoàn thành
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={6} md={3}>
        <Box
          sx={{
            textAlign: "center",
            p: 3,
            background: "linear-gradient(135deg, #d32f2f 0%, #c62828 100%)",
            borderRadius: 3,
            color: "white",
            boxShadow: "0 6px 20px rgba(211, 47, 47, 0.3)",
            transition: "transform 0.2s ease",
            "&:hover": {
              transform: "translateY(-2px)",
            },
          }}
        >
          <Typography variant="h3" fontWeight="700" sx={{ mb: 1 }}>
            {stats.withReactions}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "500", opacity: 0.9 }}>
            Có phản ứng
          </Typography>
        </Box>
      </Grid>
    </Grid>

    {/* Progress Bar */}
    <Box sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="body1" fontWeight="600" color="text.secondary">
          Tỷ lệ hoàn thành
        </Typography>
        <Typography variant="h6" fontWeight="700" color="success.main">
          {stats.completionRate}%
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={parseFloat(stats.completionRate)}
        sx={{
          height: 12,
          borderRadius: 6,
          bgcolor: "grey.200",
          "& .MuiLinearProgress-bar": {
            background: "linear-gradient(90deg, #4caf50 0%, #66bb6a 100%)",
            borderRadius: 6,
          },
        }}
      />
    </Box>
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
        <TableContainer
          component={Paper}
          sx={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderRadius: 2 }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
                <TableCell sx={{ fontWeight: "bold", py: 3 }}>STT</TableCell>
                <TableCell sx={{ fontWeight: "bold", py: 3 }}>
                  Thông tin học sinh
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", py: 3 }}>
                  Trạng thái
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", py: 3 }}>
                  Hành động
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedList.length > 0 ? (
                paginatedList.map((record, index) => (
                  <TableRow
                    key={record.student_id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                        transform: "translateY(-1px)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    <TableCell
                      sx={{ width: "50px", textAlign: "center", p: 1.5 }}
                    >
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell sx={{ minWidth: "250px", p: 1.5 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            width: 40,
                            height: 40,
                            fontWeight: 600,
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
                            }}
                          >
                            {record.full_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {record.student_id}
                          </Typography>
                          <Box>
                            <Chip
                              label={record.class_name}
                              size="small"
                              variant="outlined"
                              sx={{
                                height: "18px",
                                fontSize: "0.65rem",
                                mt: 0.25,
                                borderColor: "primary.main",
                              }}
                            />
                          </Box>
                          <Typography
                            variant="caption"
                            color={
                              record.health_notes !== "Không có"
                                ? "error.main"
                                : "text.secondary"
                            }
                          >
                            {record.health_notes}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ width: "120px", p: 1 }}>
                      <Chip
                        label={record.status}
                        color={
                          record.status === "Đang theo dõi"
                            ? "warning"
                            : record.status === "Phản ứng bất thường"
                            ? "error"
                            : "success"
                        }
                        variant="outlined"
                        size="small"
                        sx={{
                          fontWeight: "medium",
                          minWidth: "110px",
                          fontSize: "0.7rem",
                          borderWidth: 2,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ minWidth: "180px", p: 1.5 }}>
                      <Stack spacing={1} direction="row">
                        <Tooltip title="Ghi nhận反応" arrow>
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
                              borderRadius: 2,
                              borderWidth: 2,
                            }}
                          >
                            Phản ứng
                          </Button>
                        </Tooltip>
                        <Tooltip title="Xem chi tiết học sinh" arrow>
                          <Button
                            variant="text"
                            color="info"
                            size="small"
                            startIcon={<Info sx={{ fontSize: 16 }} />}
                            onClick={() => handleOpenDetailsDialog(record)}
                            sx={{
                              fontSize: "0.75rem",
                              textTransform: "none",
                              fontWeight: "medium",
                            }}
                          >
                            Chi tiết
                          </Button>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
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
                        {monitoringRecords.length === 0
                          ? "Không có học sinh nào cần theo dõi"
                          : "Không có dữ liệu trên trang hiện tại"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.disabled"
                        sx={{ maxWidth: 400, textAlign: "center" }}
                      >
                        {monitoringRecords.length === 0
                          ? "Tất cả học sinh trong chiến dịch này đã hoàn thành thời gian theo dõi hoặc không khớp với bộ lọc."
                          : "Chuyển sang trang khác để xem thêm dữ liệu."}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={3} mb={2}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
                sx={{ "& .MuiPaginationItem-root": { borderRadius: 2 } }}
              />
            </Box>
          )}
        </TableContainer>
      )}

      {/* Reaction Dialog */}
      <Dialog
        open={openReactionDialog}
        onClose={handleCloseReactionDialog}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogTitle sx={{ bgcolor: "warning.main", color: "white", py: 2 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Warning />
            Ghi nhận phản ứng sau tiêm - {selectedStudent?.full_name}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 3, bgcolor: "#fafafa" }}>
          {selectedStudent && (
            <Box
              sx={{
                mb: 3,
                p: 2,
                bgcolor: "white",
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <Box display="flex" gap={2} alignItems="center">
                <Avatar sx={{ width: 50, height: 50, bgcolor: "primary.main" }}>
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
            </Box>
          )}
          <Grid container spacing={2} direction="column" alignItems="stretch">
            <Grid item xs={12}>
              <TextField
                label="Thời gian quan sát"
                type="datetime-local"
                value={reactionData.observedAt}
                onChange={(e) =>
                  setReactionData({
                    ...reactionData,
                    observedAt: e.target.value,
                  })
                }
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                required
                sx={{ bgcolor: "white", borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Nhiệt độ cơ thể (°C)"
                value={reactionData.temperatureLevel}
                onChange={(e) => {
                  const newTemp = e.target.value;
                  setReactionData({
                    ...reactionData,
                    temperatureLevel: newTemp,
                  });
                  setTemperatureError(validateTemperature(newTemp));
                }}
                fullWidth
                variant="outlined"
                type="number"
                inputProps={{ step: "0.1", min: "35", max: "42" }}
                required
                error={!!temperatureError}
                helperText={temperatureError}
                sx={{ bgcolor: "white", borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Ghi chú triệu chứng"
                value={reactionData.notes}
                onChange={(e) =>
                  setReactionData({
                    ...reactionData,
                    notes: e.target.value,
                  })
                }
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                required
                sx={{ bgcolor: "white", borderRadius: 2 }}
                placeholder="Mô tả triệu chứng, ví dụ: sốt nhẹ, quấy khóc, da nổi mẩn đỏ..."
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={reactionData.isAbnormal}
                    onChange={(e) =>
                      setReactionData({
                        ...reactionData,
                        isAbnormal: e.target.checked,
                      })
                    }
                    color="warning"
                  />
                }
                label="Tình trạng bất thường"
                sx={{ bgcolor: "white", p: 1, borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Biện pháp xử trí"
                value={reactionData.actionsTaken}
                onChange={(e) =>
                  setReactionData({
                    ...reactionData,
                    actionsTaken: e.target.value,
                  })
                }
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                sx={{ bgcolor: "white", borderRadius: 2 }}
                placeholder="Ví dụ: Đã cho uống thuốc hạ sốt và tiếp tục theo dõi..."
                disabled={!reactionData.isAbnormal}
                required={reactionData.isAbnormal}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: "#fafafa" }}>
          <Button
            onClick={handleCloseReactionDialog}
            color="secondary"
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500 }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSaveReaction}
            variant="contained"
            color="warning"
            startIcon={loading ? <CircularProgress size={20} /> : <Save />}
            disabled={loading || !!temperatureError}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500 }}
          >
            {loading ? "Đang lưu..." : "Lưu phản ứng"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Details Dialog */}
      <Dialog
        open={openDetailsDialog}
        onClose={handleCloseDetailsDialog}
        maxWidth="lg"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            overflow: "hidden",
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            py: 3,
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
            },
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            position="relative"
            zIndex={1}
          >
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                backgroundColor: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Info sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="600" mb={0.5}>
                Chi tiết theo dõi
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {selectedStudent?.full_name}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0, bgcolor: "#f8fafc" }}>
          {historyLoading ? (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              minHeight="300px"
              gap={2}
            >
              <CircularProgress size={40} thickness={4} />
              <Typography color="text.secondary">
                Đang tải thông tin...
              </Typography>
            </Box>
          ) : selectedStudent && immunizationHistory ? (
            <Box>
              {/* Student Info Header */}
              <Box
                sx={{
                  background:
                    "linear-gradient(135deg,rgb(12, 63, 107) 0%,rgb(7, 96, 100) 100%)",
                  p: 3,
                  color: "white",
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(10px)",
                  },
                }}
              >
                <Box
                  display="flex"
                  gap={3}
                  alignItems="center"
                  position="relative"
                  zIndex={1}
                >
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: "rgba(255,255,255,0.3)",
                      backdropFilter: "blur(10px)",
                      border: "2px solid rgba(255,255,255,0.3)",
                      fontSize: "2rem",
                      fontWeight: "bold",
                    }}
                  >
                    {selectedStudent.full_name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight="700" mb={1}>
                      {selectedStudent.full_name}
                    </Typography>
                    <Box display="flex" gap={4}>
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Mã học sinh
                        </Typography>
                        <Typography variant="h6" fontWeight="600">
                          {selectedStudent.student_id}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Lớp học
                        </Typography>
                        <Typography variant="h6" fontWeight="600">
                          {selectedStudent.class_name}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Main Content */}
              <Box p={3}>
                {/* Monitoring Information */}
                <Box mb={4}>
                  <Typography
                    variant="h6"
                    fontWeight="700"
                    mb={3}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "primary.main",
                    }}
                  >
                    <Box
                      sx={{
                        width: 4,
                        height: 24,
                        backgroundColor: "primary.main",
                        borderRadius: 1,
                      }}
                    />
                    Thông tin theo dõi
                  </Typography>

                  <Grid container spacing={3}>
                    {/* Left: Health Information */}
                    <Grid item xs={12} md={6} sx={{ width: "48%" }}>
                      <Box
                        sx={{
                          p: 3,
                          bgcolor: "white",
                          borderRadius: 2,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                          border: "1px solid rgba(0,0,0,0.05)",
                          height: "100%",
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight="700"
                          mb={2}
                          sx={{
                            color: "error.main",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Box
                            sx={{
                              width: 4,
                              height: 20,
                              backgroundColor: "error.main",
                              borderRadius: 1,
                            }}
                          />
                          Thông tin y tế
                        </Typography>

                        <Box mb={3}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            mb={1}
                          >
                            Vaccine
                          </Typography>
                          <Typography variant="body1" fontWeight="600">
                            {immunizationHistory.vaccineName ||
                              "Không xác định"}
                          </Typography>
                        </Box>

                        <Box mb={3}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            mb={1}
                          >
                            Dị ứng
                          </Typography>
                          <Typography
                            variant="body1"
                            fontWeight="600"
                            color={
                              selectedStudent.allergies?.length > 0
                                ? "error.main"
                                : "success.main"
                            }
                          >
                            {selectedStudent.allergies?.length > 0
                              ? selectedStudent.allergies.join(", ")
                              : "Không có"}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            mb={1}
                          >
                            Bệnh mãn tính
                          </Typography>
                          {selectedStudent.chronicConditions?.length > 0 ? (
                            <Box sx={{ maxHeight: 150, overflowY: "auto" }}>
                              {selectedStudent.chronicConditions.map(
                                (condition, index) => (
                                  <Box
                                    key={index}
                                    sx={{
                                      mb: 1.5,
                                      p: 1.5,
                                      bgcolor: "#fff4e6",
                                      borderRadius: 1,
                                      border: "1px solid #ffd6a3",
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      color="warning.main"
                                      fontWeight="600"
                                    >
                                      {condition.conditionName}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      display="block"
                                    >
                                      Ngày chẩn đoán:{" "}
                                      {condition.diagnosedDate
                                        ? new Date(
                                            condition.diagnosedDate
                                          ).toLocaleDateString("vi-VN")
                                        : "Không xác định"}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      display="block"
                                    >
                                      Thuốc:{" "}
                                      {condition.medication || "Không có"}
                                    </Typography>
                                    {condition.notes && (
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        display="block"
                                      >
                                        Ghi chú: {condition.notes}
                                      </Typography>
                                    )}
                                  </Box>
                                )
                              )}
                            </Box>
                          ) : (
                            <Typography
                              variant="body1"
                              fontWeight="600"
                              color="success.main"
                            >
                              Không có
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Grid>

                    {/* Right: Vaccination Information */}
                    <Grid item xs={12} md={6} sx={{ width: "49%" }}>
                      <Box
                        sx={{
                          p: 3,
                          bgcolor: "white",
                          borderRadius: 2,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                          border: "1px solid rgba(0,0,0,0.05)",
                          height: "100%",
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight="700"
                          mb={2}
                          sx={{
                            color: "info.main",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Box
                            sx={{
                              width: 4,
                              height: 20,
                              backgroundColor: "info.main",
                              borderRadius: 1,
                            }}
                          />
                          Thông tin tiêm chủng
                        </Typography>

                        <Box mb={3}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            mb={1}
                          >
                            Thời gian tiêm
                          </Typography>
                          <Typography variant="body1" fontWeight="600">
                            {immunizationHistory.administeredAt
                              ? new Date(
                                  immunizationHistory.administeredAt
                                ).toLocaleString("vi-VN")
                              : "Chưa có thông tin"}
                          </Typography>
                        </Box>

                        <Box mb={3}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            mb={1}
                          >
                            Trạng thái
                          </Typography>
                          <Chip
                            label={selectedStudent.status}
                            color={
                              selectedStudent.status === "Đã hoàn thành"
                                ? "success"
                                : selectedStudent.status ===
                                  "Phản ứng bất thường"
                                ? "error"
                                : "warning"
                            }
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>

                        <Box mb={3}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            mb={1}
                          >
                            Người tiêm
                          </Typography>
                          <Typography variant="body1" fontWeight="600">
                            {immunizationHistory.administeredByStaffId
                              ?.fullName || "Không xác định"}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            mb={1}
                          >
                            Liều số
                          </Typography>
                          <Typography variant="body1" fontWeight="600">
                            {immunizationHistory.doseNumber || "Không xác định"}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                {/* Reactions Table */}
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight="700"
                    mb={3}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "primary.main",
                    }}
                  >
                    <Box
                      sx={{
                        width: 4,
                        height: 24,
                        backgroundColor: "primary.main",
                        borderRadius: 1,
                      }}
                    />
                    Phản ứng sau tiêm
                  </Typography>

                  <TableContainer
                    component={Paper}
                    sx={{
                      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                      borderRadius: 3,
                      overflow: "hidden",
                      border: "1px solid rgba(0,0,0,0.05)",
                    }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow
                          sx={{
                            background:
                              "linear-gradient(135deg,rgb(12, 63, 107) 0%,rgb(7, 96, 100) 100%)",
                            "& th": {
                              color: "white",
                              fontWeight: "700",
                              py: 2,
                            },
                          }}
                        >
                          <TableCell>STT</TableCell>
                          <TableCell>Ngày/Giờ</TableCell>
                          <TableCell>Nhiệt độ (°C)</TableCell>
                          <TableCell>Triệu chứng</TableCell>
                          <TableCell>Bất thường</TableCell>
                          <TableCell>Biện pháp xử lý</TableCell>
                          <TableCell>Ngày ghi nhận</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {immunizationHistory.postVaccinationChecks.map(
                          (reaction, index) => (
                            <TableRow
                              key={index}
                              sx={{
                                "&:hover": {
                                  backgroundColor: "rgba(79, 172, 254, 0.04)",
                                },
                                "&:nth-of-type(odd)": {
                                  backgroundColor: "rgba(0,0,0,0.02)",
                                },
                              }}
                            >
                              <TableCell sx={{ fontWeight: 600 }}>
                                {index + 1}
                              </TableCell>
                              <TableCell>
                                {new Date(reaction.observedAt).toLocaleString(
                                  "vi-VN"
                                )}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={reaction.temperatureLevel}
                                  size="small"
                                  color={
                                    parseFloat(reaction.temperatureLevel) > 37.5
                                      ? "error"
                                      : "success"
                                  }
                                  sx={{ fontWeight: 600 }}
                                />
                              </TableCell>
                              <TableCell>{reaction.notes}</TableCell>
                              <TableCell>
                                <Chip
                                  label={reaction.isAbnormal ? "Có" : "Không"}
                                  size="small"
                                  color={
                                    reaction.isAbnormal ? "error" : "success"
                                  }
                                  sx={{ fontWeight: 600 }}
                                />
                              </TableCell>
                              <TableCell>
                                {reaction.actionsTaken || "Không có"}
                              </TableCell>
                              <TableCell>
                                {new Date(reaction.observedAt).toLocaleString(
                                  "vi-VN"
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        )}
                        {immunizationHistory.postVaccinationChecks.length ===
                          0 && (
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              align="center"
                              sx={{ py: 4 }}
                            >
                              <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                gap={2}
                              >
                                <Typography color="text.secondary" variant="h6">
                                  Chưa có phản ứng nào được ghi nhận
                                </Typography>
                                <Typography
                                  color="text.secondary"
                                  variant="body2"
                                >
                                  Học sinh chưa có phản ứng bất thường nào sau
                                  khi tiêm vaccine
                                </Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              minHeight="300px"
              gap={2}
            >
              <Typography color="error" variant="h6">
                Không thể tải thông tin học sinh
              </Typography>
              <Typography color="text.secondary">
                Vui lòng thử lại sau
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            bgcolor: "white",
            borderTop: "1px solid rgba(0,0,0,0.08)",
            gap: 2,
          }}
        >
          <Button
            onClick={handleCloseDetailsDialog}
            variant="contained"
            size="large"
            sx={{
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 600,
              px: 4,
              py: 1.5,
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              boxShadow: "0 4px 16px rgba(79, 172, 254, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                boxShadow: "0 6px 20px rgba(79, 172, 254, 0.4)",
                transform: "translateY(-1px)",
              },
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openCompleteDialog}
        onClose={handleCloseCompleteDialog}
        maxWidth="xs"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogTitle sx={{ bgcolor: "success.main", color: "white", py: 2 }}>
          Xác nhận hoàn tất
        </DialogTitle>
        <DialogContent sx={{ p: 3, bgcolor: "#fafafa" }}>
          <Typography>
            Bạn có chắc muốn hoàn tất chiến dịch tiêm chủng? Hành động này không
            thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: "#fafafa" }}>
          <Button
            onClick={handleCloseCompleteDialog}
            color="secondary"
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500 }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirmComplete}
            variant="contained"
            color="success"
            startIcon={loading ? <CircularProgress size={20} /> : null}
            disabled={loading}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500 }}
          >
            {loading ? "Đang xử lý..." : "Xác nhận"}
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
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default PostVaccinationMonitoring;

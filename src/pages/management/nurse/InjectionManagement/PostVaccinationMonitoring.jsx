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
    observedAt: new Date("2025-06-24T14:12:00+07:00").toISOString().slice(0, 16),
    temperatureLevel: "",
    notes: "",
    isAbnormal: false,
    actionsTaken: "",
  });
  const [reactions, setReactions] = useState([]);
  const [expandedStats, setExpandedStats] = useState(false);
  const itemsPerPage = 10;

  // Calculate statistics
  const getStats = useCallback(() => {
    const monitoring = monitoringRecords.filter(
      (r) => r.status === "Đang theo dõi"
    );
    const completed = monitoringRecords.filter(
      (r) => r.status === "Đã hoàn thành"
    );
    const withReactions = monitoringRecords.filter((r) =>
      reactions.some((reaction) => reaction.student_id === r.student_id)
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
    if (!campaignId) {
      setMonitoringRecords([]);
      return;
    }

    setLoading(true);
    setTimeout(async () => {
      try {
        const response = await campaignService.getListVaccination(campaignId);
        if (!response.success) {
          throw new Error(
            response.message || "Không thể tải danh sách tiêm chủng."
          );
        }

        const now = new Date("2025-06-24T14:12:00+07:00");
        const filteredRecords = response.data
          .filter((record) => record.vaccinationStatus === "COMPLETED")
          .filter((record) => (classId ? record.className === classId : true))
          .filter((record) =>
            record.fullName.toLowerCase().includes(query.toLowerCase())
          )
          .map((record, index) => ({
            stt: index + 1,
            student_id: record.studentId,
            full_name: record.fullName,
            class_name: record.className,
            health_notes: record.allergies || record.chronicConditions || "",
            administration_date: new Date(record.dateOfBirth).toLocaleString(
              "vi-VN"
            ),
            status: "Đã tiêm",
            consentId: record.consentId || "",
          }))
          .sort((a, b) => {
            if (a.status === "Đã tiêm" && b.status !== "Đã tiêm") return -1;
            if (a.status !== "Đã tiêm" && b.status === "Đã tiêm") return 1;
            return 0;
          });

        setMonitoringRecords(filteredRecords);

        const criticalStudents = filteredRecords.filter(
          (r) => r.status === "Đang theo dõi"
        );
        if (criticalStudents.length > 0) {
          setSnackbarMessage(
            `⚠️ ${criticalStudents.length} học sinh cần chú ý!`
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
          setSelectedCampaign(response.data[0]?._id || "");
          if (response.data[0]?._id) {
            loadMonitoringRecords(
              response.data[0]?._id,
              selectedClass,
              searchQuery
            );
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

  // Fetch immunization history for details dialog
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
          } else {
            throw new Error(
              response.message || "Không thể tải lịch sử tiêm chủng."
            );
          }
        } catch (error) {
          console.error("Failed to load immunization history:", error);
          setImmunizationHistory(null);
        } finally {
          setHistoryLoading(false);
        }
      } else {
        setImmunizationHistory(null);
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
      observedAt: new Date("2025-06-24T14:12:00+07:00").toISOString().slice(0, 16),
      temperatureLevel: "",
      notes: "",
      isAbnormal: false,
      actionsTaken: "",
    });
    setOpenReactionDialog(true);
  };

  // Handle details dialog
  const handleOpenDetailsDialog = (record) => {
    setSelectedStudent(record);
    setOpenDetailsDialog(true);
  };

  // Save reaction
  const handleSaveReaction = (complete = false) => {
    if (!selectedStudent || !reactionData.observedAt || !reactionData.notes) {
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
        observedAt: new Date(reactionData.observedAt).toLocaleString("vi-VN"),
        temperatureLevel: reactionData.temperatureLevel || "Không đo",
        notes: reactionData.notes,
        isAbnormal: reactionData.isAbnormal,
        actionsTaken: reactionData.actionsTaken || "Không có",
        recorded_date: new Date().toLocaleString("vi-VN"),
      };

      setReactions((prev) => [...prev, newReaction]);

      if (complete) {
        setMonitoringRecords((prev) =>
          prev.map((record) =>
            record.student_id === selectedStudent.student_id
              ? { ...record, status: "Đã hoàn thành" }
              : record
          )
        );
        setSnackbarMessage(`✅ Đã hoàn tất theo dõi cho ${selectedStudent.full_name}`);
      } else {
        setSnackbarMessage(
          `🏥 Đã ghi nhận phản ứng cho ${selectedStudent.full_name}`
        );
      }

      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setOpenReactionDialog(false);
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
        sx={{
          mb: 3,
          fontWeight: "medium",
          bgcolor: "info.light",
          color: "info.contrastText",
          borderRadius: 2,
        }}
      >
        Hệ thống theo dõi tự động với cảnh báo thời gian thực
      </Alert>
      {/* Filters */}
      <Card sx={{ mb: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderRadius: 2 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel sx={{ fontWeight: 500 }}>Chọn chiến dịch tiêm chủng</InputLabel>
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
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LocalHospital fontSize="small" />
                        {`${campaign.name} (${campaign.vaccineName})`}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth sx={{width:"200px"}} disabled={!selectedCampaign} variant="outlined">
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
                    .filter((value, index, self) => self.indexOf(value) === index)
                    .map((className) => (
                      <MenuItem key={className} value={className}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
      <Card sx={{ mb: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
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
                  bgcolor: "primary.main",
                  borderRadius: 2,
                  color: "white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
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
                  bgcolor: "warning.main",
                  borderRadius: 2,
                  color: "white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
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
                  bgcolor: "success.main",
                  borderRadius: 2,
                  color: "white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
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
                  bgcolor: "error.main",
                  borderRadius: 2,
                  color: "white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <Typography variant="h4" fontWeight="bold">
                  {stats.withReactions}
                </Typography>
                <Typography variant="body2">Có phản ứng</Typography>
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
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: "grey.200",
                          "& .MuiLinearProgress-bar": { bgcolor: "success.main" },
                        }}
                      />
                    </Box>
                    <Typography variant="body2" fontWeight="bold">
                      {stats.completionRate}%
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
        <TableContainer component={Paper} sx={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
                <TableCell sx={{ fontWeight: "bold", py: 3 }}>STT</TableCell>
                <TableCell sx={{ fontWeight: "bold", py: 3 }}>
                  Thông tin học sinh
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", py: 3 }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: "bold", py: 3 }}>Hành động</TableCell>
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
                    <TableCell sx={{ width: "50px", textAlign: "center", p: 1.5 }}>
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell sx={{ minWidth: "250px", p: 1.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
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
                          <Typography>
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
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ width: "120px", p: 1 }}>
                      <Chip
                        label={record.status}
                        color={record.status === "Đã tiêm" ? "warning" : "success"}
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
        sx={{ "& .MuiDialog-paper": { borderRadius: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" } }}
      >
        <DialogTitle sx={{ bgcolor: "warning.main", color: "white", py: 2 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Warning />
            Ghi nhận phản ứng sau tiêm - {selectedStudent?.full_name}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 3, bgcolor: "#fafafa" }}>
          {selectedStudent && (
            <Box sx={{ mb: 3, p: 2, bgcolor: "white", borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
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
                  setReactionData({ ...reactionData, observedAt: e.target.value })
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
                onChange={(e) =>
                  setReactionData({ ...reactionData, temperatureLevel: e.target.value })
                }
                fullWidth
                variant="outlined"
                type="number"
                inputProps={{ step: "0.1" }}
                sx={{ bgcolor: "white", borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Ghi chú triệu chứng"
                value={reactionData.notes}
                onChange={(e) =>
                  setReactionData({ ...reactionData, notes: e.target.value })
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
                      setReactionData({ ...reactionData, isAbnormal: e.target.checked })
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
                  setReactionData({ ...reactionData, actionsTaken: e.target.value })
                }
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                sx={{ bgcolor: "white", borderRadius: 2 }}
                placeholder="Ví dụ: Đã cho uống thuốc hạ sốt và tiếp tục theo dõi..."
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
            onClick={() => handleSaveReaction(false)}
            variant="contained"
            color="warning"
            startIcon={loading ? <CircularProgress size={20} /> : <Save />}
            disabled={loading}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500 }}
          >
            {loading ? "Đang lưu..." : "Lưu phản ứng"}
          </Button>
          <Button
            onClick={() => handleSaveReaction(true)}
            variant="contained"
            color="success"
            startIcon={loading ? <CircularProgress size={20} /> : <CheckCircle />}
            disabled={loading}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500 }}
          >
            {loading ? "Đang lưu..." : "Hoàn tất theo dõi"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Details Dialog */}
      <Dialog
        open={openDetailsDialog}
        onClose={handleCloseDetailsDialog}
        maxWidth="lg"
        fullWidth
        sx={{ "& .MuiDialog-paper": { borderRadius: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" } }}
      >
        <DialogTitle sx={{ bgcolor: "info.main", color: "white", py: 2 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Info />
            Chi tiết theo dõi - {selectedStudent?.full_name}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 3, bgcolor: "#fafafa" }}>
          {historyLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="200px"
            >
              <CircularProgress />
            </Box>
          ) : (
            selectedStudent && (
              <Box>
                <Box display="flex" gap={2} alignItems="center" mb={3}>
                  <Avatar
                    sx={{ width: 60, height: 60, bgcolor: "primary.main" }}
                  >
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
                      {immunizationHistory?.administeredAt
                        ? new Date(
                            immunizationHistory.administeredAt
                          ).toLocaleString("vi-VN")
                        : "Chưa có thông tin"}
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
                  {immunizationHistory && (
                    <>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          Người tiêm
                        </Typography>
                        <Typography variant="body1">
                          {immunizationHistory.administeredByStaffId
                            ?.fullName || "Không xác định"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          Vaccine
                        </Typography>
                        <Typography variant="body1">
                          {immunizationHistory.vaccineName || "Không xác định"}
                        </Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
                <Typography variant="h6" fontWeight="bold" mt={4} mb={2}>
                  Phản ứng sau tiêm
                </Typography>
                <TableContainer
                  component={Paper}
                  sx={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)", borderRadius: 2 }}
                >
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "grey.100" }}>
                        <TableCell sx={{ fontWeight: "bold" }}>STT</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Ngày/Giờ</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Nhiệt độ (°C)
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Triệu chứng
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Bất thường
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Biện pháp xử lý
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
                            <TableCell>{reaction.observedAt}</TableCell>
                            <TableCell>{reaction.temperatureLevel}</TableCell>
                            <TableCell>{reaction.notes}</TableCell>
                            <TableCell>
                              {reaction.isAbnormal ? "Có" : "Không"}
                            </TableCell>
                            <TableCell>{reaction.actionsTaken}</TableCell>
                            <TableCell>{reaction.recorded_date}</TableCell>
                          </TableRow>
                        ))}
                      {reactions.filter(
                        (reaction) =>
                          reaction.student_id === selectedStudent.student_id
                      ).length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} align="center">
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
            )
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: "#fafafa" }}>
          <Button
            onClick={handleCloseDetailsDialog}
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500 }}
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
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default PostVaccinationMonitoring;
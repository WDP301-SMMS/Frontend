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
  Warning,
  CheckCircleOutline,
  LocalHospital,
  Refresh,
  ExpandMore,
  ExpandLess,
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
  const [reactionDateTime, setReactionDateTime] = useState(
    new Date("2025-06-24T14:12:00+07:00").toISOString().slice(0, 16)
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
  const loadMonitoringRecords = useCallback(
    (campaignId, classId, query) => {
      if (!campaignId) {
        setMonitoringRecords([]);
        return;
      }

      setLoading(true);
      setTimeout(async () => {
        try {
          const response = await campaignService.getListVaccination(campaignId);
          if (!response.success) {
            throw new Error(response.message || "Không thể tải danh sách tiêm chủng.");
          }

          const now = new Date("2025-06-24T14:12:00+07:00"); // Current time
          const filteredRecords = response.data
            .filter((record) => record.vaccinationStatus === "COMPLETED")
            .filter((record) =>
              classId ? record.className === classId : true
            )
            .filter((record) =>
              record.fullName.toLowerCase().includes(query.toLowerCase())
            )
            .map((record, index) => ({
              stt: index + 1,
              student_id: record.studentId,
              full_name: record.fullName,
              class_name: record.className,
              health_notes: record.allergies || record.chronicConditions || "",
              administration_date: new Date(record.dateOfBirth).toLocaleString("vi-VN"), // Placeholder, replace with actual vaccination date
              status: "Đã tiêm",
              quick_note: "",
              consentId: record.consentId || "", // Assume consentId is in vaccination data
            }));

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
    },
    []
  );

  // Fetch immunization history
  const fetchImmunizationHistory = async (student) => {
    if (openDetailsDialog && student?.consentId) {
      setHistoryLoading(true);
      try {
        const response = await campaignService.getStudentImmunizationHistory(student.student_id);
        if (response.success) {
          const matchedHistory = response.data.find((record) => record.consentId === student.consentId);
          setImmunizationHistory(matchedHistory || null);
        } else {
          throw new Error(response.message || "Không thể tải lịch sử tiêm chủng.");
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

  // Load campaigns
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const response = await campaignService.getCampaignsByStatus("IN_PROGRESS", 1, 100);
        if (response.success) {
          setCampaigns(response.data || []);
          setSelectedCampaign(response.data[0]?._id || "");
          if (response.data[0]?._id) {
            loadMonitoringRecords(response.data[0]?._id, selectedClass, searchQuery);
          }
        } else {
          throw new Error(response.message || "Không thể tải danh sách chiến dịch.");
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
  }, [loadMonitoringRecords]);

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
    setReactionDateTime(new Date("2025-06-24T14:12:00+07:00").toISOString().slice(0, 16));
    setReactionType("");
    setOtherReaction("");
    setSeverity("");
    setDescription("");
    setTreatment("");
    setOutcome("");
    setRecordedBy("");
    setOpenReactionDialog(true);
  };

  // Handle details dialog
  const handleOpenDetailsDialog = (record) => {
    setSelectedStudent(record);
    setOpenDetailsDialog(true);
    fetchImmunizationHistory(record); // Use record directly to fetch history
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
    setImmunizationHistory(null); // Clear history when dialog closes
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
            <Grid item xs={12} md={4}>
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
                  {monitoringRecords
                    .map((r) => r.class_name)
                    .filter((value, index, self) => self.indexOf(value) === index)
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
              />
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
                        sx={{ height: 8, borderRadius: 4 }}
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
        <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
                <TableCell sx={{ fontWeight: "bold" }}>STT</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Thông tin học sinh</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Thời gian tiêm</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Ghi chú</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Hành động</TableCell>
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
                    <TableCell sx={{ width: "50px", textAlign: "center", p: 1 }}>
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell sx={{ minWidth: "250px", p: 1.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
                          {record.full_name.charAt(0)}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            fontWeight="600"
                            sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                          >
                            {record.full_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {record.student_id}
                          </Typography>
                          <Chip
                            label={record.class_name}
                            size="small"
                            variant="outlined"
                            sx={{ height: "18px", fontSize: "0.65rem", mt: 0.25 }}
                          />
                          {record.health_notes && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.75, p: 0.75, bgcolor: "warning.50", borderRadius: 0.75, border: "1px solid", borderColor: "warning.200" }}>
                              <Warning sx={{ fontSize: 14, color: "warning.main" }} />
                              <Typography variant="caption" color="warning.dark" sx={{ fontWeight: "medium", fontSize: "0.7rem" }}>
                                {record.health_notes}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ minWidth: "140px", p: 1.5 }}>
                      <Typography variant="body2" fontWeight="medium">
                        {record.administration_date}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "120px", p: 1 }}>
                      <Chip
                        label={record.status}
                        icon={<CheckCircleOutline sx={{ fontSize: 14 }} />}
                        color="success"
                        variant="outlined"
                        size="small"
                        sx={{ fontWeight: "medium", minWidth: "110px", fontSize: "0.7rem" }}
                      />
                    </TableCell>
                    <TableCell sx={{ minWidth: "200px" }}>
                      <TextField
                        size="small"
                        value={record.quick_note}
                        onChange={(e) => handleQuickNoteChange(record.student_id, e.target.value)}
                        placeholder="Ghi chú tình trạng..."
                        fullWidth
                        variant="outlined"
                        multiline
                        maxRows={3}
                        sx={{ "& .MuiOutlinedInput-root": { fontSize: "0.875rem", backgroundColor: "grey.50", "&:hover": { backgroundColor: "grey.100" }, "&.Mui-focused": { backgroundColor: "white" } } }}
                      />
                    </TableCell>
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
                                onClick={() => handleCompleteMonitoring(record.student_id, record.full_name)}
                                sx={{ minWidth: "105px", fontSize: "0.75rem", textTransform: "none", fontWeight: "medium" }}
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
                              sx={{ minWidth: "105px", fontSize: "0.75rem", textTransform: "none", fontWeight: "medium" }}
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
                            sx={{ fontSize: "0.75rem", textTransform: "none", fontWeight: "medium", justifyContent: "flex-start" }}
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
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                      <LocalHospital sx={{ fontSize: 80, color: "text.disabled", opacity: 0.5 }} />
                      <Typography variant="h6" color="text.secondary" sx={{ fontWeight: "medium" }}>
                        {!selectedCampaign ? "Vui lòng chọn chiến dịch tiêm chủng" : "Không có học sinh nào cần theo dõi"}
                      </Typography>
                      <Typography variant="body2" color="text.disabled" sx={{ maxWidth: 400, textAlign: "center" }}>
                        {!selectedCampaign ? "Chọn một chiến dịch từ danh sách để xem các học sinh cần theo dõi sau tiêm chủng" : "Tất cả học sinh trong chiến dịch này đã hoàn thành thời gian theo dõi"}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
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
          {historyLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : selectedStudent && (
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
                    {immunizationHistory?.administeredAt
                      ? new Date(immunizationHistory.administeredAt).toLocaleString("vi-VN")
                      : selectedStudent.administration_date}
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
                {immunizationHistory && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Người tiêm
                      </Typography>
                      <Typography variant="body1">
                        {immunizationHistory.administeredByStaffId?.fullName || "Không xác định"}
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
                sx={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "grey.100" }}>
                      <TableCell sx={{ fontWeight: "bold" }}>STT</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Ngày/Giờ</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Loại phản ứng</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Mức độ</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Mô tả</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Biện pháp xử lý</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Kết quả</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Người ghi nhận</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Ngày ghi nhận</TableCell>
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
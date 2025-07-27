import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Alert,
  InputAdornment,
  Grid,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Warning, Search } from "@mui/icons-material";
import medicationRequestsService from "~/libs/api/services/medicationRequestsService";
import medicationSchedulesService from "~/libs/api/services/medicationSchedulesService";
import SuccessDialog from "~/libs/components/dialog/SuccessDialog";
import ErrorDialog from "~/libs/components/dialog/ErrorDialog";
import ConfirmDialog from "~/libs/components/dialog/ConfirmDialog";
import DeleteConfirmDialog from "~/libs/components/dialog/DeleteConfirmDialog";
import { AlertTriangle, CheckCircle, HelpCircle, Trash2 } from "lucide-react";

// Enum for slots and frequency
const SlotEnum = {
  Morning: "Morning",
  Afternoon: "Afternoon",
  Evening: "Evening",
};

const FrequencyEnum = {
  Daily: "Daily",
  EveryOtherDay: "EveryOtherDay",
};

const MedicationSchedules = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [scheduleData, setScheduleData] = useState([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const [showReasonDialog, setShowReasonDialog] = useState(false);
  const [reason, setReason] = useState("");
  const [pendingStatusChange, setPendingStatusChange] = useState(null);

  const [viewSchedule, setViewSchedule] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [frequency, setFrequency] = useState(FrequencyEnum.Daily);
  const [intervalDays, setIntervalDays] = useState(1);
  const [selectedSlots, setSelectedSlots] = useState([SlotEnum.Morning]);
  const [scheduleStatus, setScheduleStatus] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const [showErrorDialog, setShowErrorDialog] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await medicationRequestsService.getAllRequests();
      setRequests(res.data || []);
      setFilteredRequests(res.data || []);
    } catch (error) {
      setErrorMessage("Lỗi khi lấy danh sách yêu cầu.");
      setShowErrorDialog(true);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = requests.filter(
      (req) =>
        req.parentId.username.toLowerCase().includes(term) ||
        req.studentId.fullName.toLowerCase().includes(term)
    );
    setFilteredRequests(filtered);
  };

  const handleGenerateSchedule = (request) => {
    setSelectedRequest(request);
    setFrequency(FrequencyEnum.Daily);
    setIntervalDays(1);
    setSelectedSlots([SlotEnum.Morning]);
    const schedules = generateSchedules(request);
    setScheduleData(schedules); // Chỉ set array, không wrap trong object
    setOpenDialog(true);
  };
  const handleConfirmDrink = (date, slot) => {
    setSelectedSchedule({ date: date.toISOString().split("T")[0], slot });
    setConfirmDialogOpen(true);
  };

  const handleConfirm = async () => {
    if (selectedSchedule) {
      await updateScheduleStatus(
        selectedSchedule.date,
        selectedSchedule.slot,
        true
      );
      setConfirmDialogOpen(false);
      setSelectedSchedule(null);
    }
  };

  const updateScheduleStatus = async (date, slot, newStatus, reason = null) => {
    setScheduleStatus((prev) => ({
      ...prev,
      [`${date}_${slot}`]: newStatus,
    }));

    try {
      const schedule = viewSchedule.schedules.find(
        (s) =>
          new Date(s.date).toISOString().split("T")[0] === date &&
          s.sessionSlots === slot
      );

      if (schedule) {
        const updateData = {
          status: newStatus ? "Done" : "Not taken", // Sửa từ "NotTaken" thành "Not taken"
        };

        // Chỉ thêm reason khi status là "Not taken"
        if (!newStatus && reason) {
          updateData.reason = reason;
        }

        await medicationSchedulesService.updateScheduleStatus(
          schedule._id,
          updateData
        );
      }
    } catch (error) {
      setErrorMessage(error.message || "Lỗi khi cập nhật trạng thái lịch uống thuốc.");
      setShowErrorDialog(true);
    }
  };
  const handleReasonSubmit = async () => {
    if (pendingStatusChange && reason.trim()) {
      await updateScheduleStatus(
        pendingStatusChange.date,
        pendingStatusChange.slot,
        false,
        reason.trim()
      );
      setShowReasonDialog(false);
      setReason("");
      setPendingStatusChange(null);
    }
  };

  const generateSchedules = (request) => {
    const schedules = [];
    const startDate = request.startDate
      ? new Date(request.startDate)
      : new Date();
    const endDate = request.endDate ? new Date(request.endDate) : new Date();

    if (isNaN(startDate.getTime())) {
      console.error("Invalid startDate:", request.startDate);
      return schedules;
    }
    if (isNaN(endDate.getTime())) {
      console.error("Invalid endDate:", request.endDate);
      return schedules;
    }

    let currentDate = new Date(startDate);
    const days = Math.min(
      3,
      Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
    );

    while (currentDate <= endDate) {
      if (
        frequency === FrequencyEnum.Daily ||
        (frequency === FrequencyEnum.EveryOtherDay &&
          Math.floor(
            ((currentDate - startDate) / (1000 * 60 * 60 * 24)) %
              (intervalDays * 2)
          ) === 0)
      ) {
        // Tạo object cho mỗi slot trong ngày
        selectedSlots.forEach((slot) => {
          schedules.push({
            medicationRequestId: request._id,
            sessionSlots: slot, // "Morning", "Afternoon", "Evening"
            date: currentDate.toISOString().split("T")[0], // "2024-07-19"
          });
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);

      // Dừng khi đã đủ số ngày
      const uniqueDates = [...new Set(schedules.map((s) => s.date))];
      if (uniqueDates.length >= days) {
        break;
      }
    }
    return schedules;
  };

  const handleFrequencyChange = (e) => {
    const newFrequency = e.target.value;
    setFrequency(newFrequency);
    const newSchedules = generateSchedules(selectedRequest);
    setScheduleData(newSchedules); // Chỉ set array
  };

  const handleIntervalChange = (e) => {
    setIntervalDays(parseInt(e.target.value) || 1);
    const newSchedules = generateSchedules(selectedRequest);
    setScheduleData(newSchedules); // Chỉ set array
  };

  const generateSchedulesWithSlots = (request, slots) => {
    const schedules = [];
    const startDate = request.startDate
      ? new Date(request.startDate)
      : new Date();
    const endDate = request.endDate ? new Date(request.endDate) : new Date();

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return schedules;
    }

    let currentDate = new Date(startDate);
    const days = Math.min(
      3,
      Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
    );

    while (currentDate <= endDate) {
      if (
        frequency === FrequencyEnum.Daily ||
        (frequency === FrequencyEnum.EveryOtherDay &&
          Math.floor(
            ((currentDate - startDate) / (1000 * 60 * 60 * 24)) %
              (intervalDays * 2)
          ) === 0)
      ) {
        // Tạo object cho mỗi slot
        slots.forEach((slot) => {
          schedules.push({
            medicationRequestId: request._id,
            sessionSlots: slot,
            date: currentDate.toISOString().split("T")[0],
          });
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);

      const uniqueDates = [...new Set(schedules.map((s) => s.date))];
      if (uniqueDates.length >= days) {
        break;
      }
    }
    return schedules;
  };
  const handleSlotChange = (slot) => {
    let newSlots = [...selectedSlots];
    if (newSlots.includes(slot)) {
      if (newSlots.length > 1) {
        newSlots = newSlots.filter((s) => s !== slot);
      }
    } else {
      newSlots.push(slot);
    }
    setSelectedSlots(newSlots);

    // Regenerate schedules với slots mới
    if (selectedRequest) {
      const newSchedules = generateSchedulesWithSlots(
        selectedRequest,
        newSlots
      );
      setScheduleData(newSchedules); // Chỉ set array
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await medicationSchedulesService.createManySchedules(scheduleData);
      setOpenDialog(false);
      fetchRequests();
      setScheduleData([]);
      setSelectedRequest(null);
      setFrequency(FrequencyEnum.Daily);
      setIntervalDays(1);
      setSelectedSlots([SlotEnum.Morning]);
      setShowSuccessDialog(true); // Show success dialog on success
    } catch (error) {
      setErrorMessage("Lỗi khi tạo lịch uống thuốc.");
      setShowErrorDialog(true);
    }
  };

  const handleViewSchedule = async (request) => {
    try {
      const res = await medicationSchedulesService.getSchedulesByRequestId(
        request._id
      );
      setViewSchedule({ ...request, schedules: res.data || [] });
      setOpenViewDialog(true);
      const initialStatus = {};
      res.data.forEach((schedule) => {
        initialStatus[
          `${new Date(schedule.date).toISOString().split("T")[0]}_${
            schedule.sessionSlots
          }`
        ] = schedule.status === "Done";
      });
      setScheduleStatus(initialStatus);
    } catch (error) {
      setErrorMessage("Lỗi khi lấy lịch uống thuốc.");
      setShowErrorDialog(true);
    }
  };

  const toggleScheduleStatus = async (date, slot) => {
    const currentStatus = scheduleStatus[`${date}_${slot}`];

    if (!currentStatus) {
      // Chuyển từ chưa uống thành đã uống - hiện confirm dialog
      setSelectedSchedule({ date, slot });
      setConfirmDialogOpen(true);
    } else {
      // Chuyển từ đã uống về chưa uống - hiện reason dialog
      setPendingStatusChange({ date, slot, newStatus: false });
      setShowReasonDialog(true);
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{ py: 4, bgcolor: "#f5f5f5", minHeight: "100vh" }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 2, fontWeight: "bold", color: "#1e3a8a" }}
      >
        Quản lý lịch uống thuốc
      </Typography>

      <Alert severity="info" icon={<Warning />} sx={{ mb: 3 }}>
        Tạo và quản lý lịch uống thuốc cho các yêu cầu từ phụ huynh.
      </Alert>

      {/* Search */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField
          type="text"
          label="Tìm kiếm theo tên phụ huynh/học sinh"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ width: { xs: "100%", sm: 300 } }}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Requests Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Phụ huynh</TableCell>
              <TableCell>Học sinh</TableCell>
              <TableCell>Ngày bắt đầu</TableCell>
              <TableCell>Ngày kết thúc</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRequests.map((request) => (
              <TableRow key={request._id}>
                <TableCell>{request.parentId.username}</TableCell>
                <TableCell>{request.studentId.fullName}</TableCell>
                <TableCell>
                  {new Date(request.startDate).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell>
                  {new Date(request.endDate).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleGenerateSchedule(request)}
                    sx={{
                      backgroundColor: "#2563eb",
                      "&:hover": { backgroundColor: "#1d4ed8" },
                      mr: 1,
                    }}
                    disabled={request.status !== "Pending"}
                  >
                    Tạo lịch
                  </Button>
                  {request.status !== "Pending" && (
                    <Button
                      variant="outlined"
                      onClick={() => handleViewSchedule(request)}
                      sx={{
                        borderColor: "#cbd5e0",
                        color: "#4a5568",
                        "&:hover": {
                          backgroundColor: "#f7fafc",
                          borderColor: "#a0aec0",
                        },
                      }}
                    >
                      Xem
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Generate Schedule Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{ bgcolor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}
        >
          Tạo lịch uống thuốc cho {selectedRequest?.studentId.fullName}
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mb: 3, marginTop: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Tần suất</InputLabel>
              <Select
                value={frequency}
                onChange={handleFrequencyChange}
                label="Tần suất"
              >
                {Object.values(FrequencyEnum).map((freq) => (
                  <MenuItem key={freq} value={freq}>
                    {freq === FrequencyEnum.Daily ? "Hằng ngày" : "Cách ngày"}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {frequency === FrequencyEnum.EveryOtherDay && (
              <TextField
                fullWidth
                label="Cách bao nhiêu ngày"
                type="number"
                value={intervalDays}
                onChange={handleIntervalChange}
                sx={{ mb: 2 }}
                InputProps={{ inputProps: { min: 1 } }}
              />
            )}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 1 }}>
                Chọn slot trong ngày:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Các slot được chọn sẽ áp dụng cho tất cả các ngày trong lịch
              </Typography>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {Object.values(SlotEnum).map((slot) => {
                  const isSelected = selectedSlots.includes(slot);
                  return (
                    <Button
                      key={slot}
                      variant={isSelected ? "contained" : "outlined"}
                      onClick={() => handleSlotChange(slot)}
                      sx={{
                        minWidth: 100,
                        bgcolor: isSelected
                          ? slot === SlotEnum.Morning
                            ? "#fff3cd"
                            : slot === SlotEnum.Afternoon
                            ? "#fff4e6"
                            : "#e8f4fd"
                          : "transparent",
                        color: isSelected
                          ? slot === SlotEnum.Morning
                            ? "#856404"
                            : slot === SlotEnum.Afternoon
                            ? "#b4621b"
                            : "#0984e3"
                          : "inherit",
                        border: isSelected
                          ? slot === SlotEnum.Morning
                            ? "2px solid #ffeaa7"
                            : slot === SlotEnum.Afternoon
                            ? "2px solid #fdcb6e"
                            : "2px solid #74b9ff"
                          : "1px solid #e0e0e0",
                        "&:hover": {
                          bgcolor:
                            slot === SlotEnum.Morning
                              ? "#fff3cd"
                              : slot === SlotEnum.Afternoon
                              ? "#fff4e6"
                              : "#e8f4fd",
                        },
                      }}
                    >
                      {slot === SlotEnum.Morning
                        ? "🌅 Sáng"
                        : slot === SlotEnum.Afternoon
                        ? "☀️ Chiều"
                        : "🌙 Tối"}
                    </Button>
                  );
                })}
              </Box>

              {selectedSlots.length === 0 && (
                <Box sx={{ mt: 2, p: 2, bgcolor: "#fff3cd", borderRadius: 1 }}>
                  <Typography variant="body2" color="#856404">
                    ⚠️ Vui lòng chọn ít nhất một slot trong ngày
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Phần hiển thị lịch được cải tiến */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
              Lịch uống thuốc được tạo:
            </Typography>

            {/* Nhóm theo ngày */}
            {Object.entries(
              scheduleData.reduce((acc, schedule) => {
                const date = schedule.date;
                if (!acc[date]) acc[date] = [];
                acc[date].push(schedule);
                return acc;
              }, {})
            ).map(([date, daySchedules], dateIndex) => (
              <Box
                key={dateIndex}
                sx={{
                  mb: 2,
                  p: 2,
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  bgcolor: "#f9f9f9",
                }}
              >
                <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 1 }}>
                  📅{" "}
                  {new Date(date).toLocaleDateString("vi-VN", {
                    weekday: "long",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </Typography>

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {daySchedules.map((schedule) => {
                    // date ở đây đã là string dạng "2025-07-22"
                    const scheduleKey = `${date}_${schedule.sessionSlots}`;
                    const isCompleted = scheduleStatus[scheduleKey] || false;
                    const isPastOrFuture = (scheduleDate) => {
                      const currentDate = new Date();
                      currentDate.setHours(0, 0, 0, 0); // Chỉ so sánh ngày, không giờ
                      const dateToCheck = new Date(scheduleDate);
                      dateToCheck.setHours(0, 0, 0, 0); // Chỉ so sánh ngày
                      return (
                        dateToCheck < currentDate || dateToCheck > currentDate
                      );
                    };
                    const isDisabled = isPastOrFuture || isCompleted; // Disable if past/future or already completed

                    return (
                      <Box
                        key={schedule._id}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: isCompleted ? "#f0fdf4" : "#fafafa",
                          border: `1px solid ${
                            isCompleted ? "#bbf7d0" : "#e5e7eb"
                          }`,
                          transition: "all 0.2s ease",
                          opacity: isDisabled ? 0.6 : 1,
                          pointerEvents: isDisabled ? "none" : "auto",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                bgcolor:
                                  schedule.sessionSlots === SlotEnum.Morning
                                    ? "#fef3c7"
                                    : schedule.sessionSlots ===
                                      SlotEnum.Afternoon
                                    ? "#fed7aa"
                                    : "#e0e7ff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {schedule.sessionSlots === SlotEnum.Morning
                                ? "🌅"
                                : schedule.sessionSlots === SlotEnum.Afternoon
                                ? "☀️"
                                : "🌙"}
                            </Box>
                            <Typography variant="body2" fontWeight="600">
                              {schedule.sessionSlots === SlotEnum.Morning
                                ? "Sáng"
                                : schedule.sessionSlots === SlotEnum.Afternoon
                                ? "Chiều"
                                : "Tối"}
                            </Typography>
                          </Box>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={isCompleted}
                                onChange={() =>
                                  !isCompleted &&
                                  handleConfirmDrink(
                                    date,
                                    schedule.sessionSlots
                                  )
                                }
                                disabled={isDisabled}
                                sx={{
                                  "& .MuiSwitch-track": {
                                    bgcolor: isDisabled
                                      ? "#d1d5db"
                                      : isCompleted
                                      ? "#10b981"
                                      : "#d1d5db",
                                  },
                                  "& .MuiSwitch-thumb": {
                                    bgcolor: "white",
                                  },
                                }}
                              />
                            }
                            label={
                              <Typography
                                variant="caption"
                                fontWeight="600"
                                color={
                                  isDisabled
                                    ? "#6b7280"
                                    : isCompleted
                                    ? "#166534"
                                    : "#6b7280"
                                }
                              >
                                {isDisabled
                                  ? "🔒 Đã khóa"
                                  : isCompleted
                                  ? "✅ Đã uống"
                                  : "⏳ Chưa uống"}
                              </Typography>
                            }
                            sx={{ m: 0 }}
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            ))}

            {scheduleData.length === 0 && (
              <Box
                sx={{
                  p: 3,
                  textAlign: "center",
                  bgcolor: "#f8f9fa",
                  borderRadius: 2,
                  border: "1px dashed #dee2e6",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Chưa có lịch nào được tạo. Vui lòng chọn slot và tần suất.
                </Typography>
              </Box>
            )}

            {/* Thống kê tổng quan */}
            {scheduleData.length > 0 && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: "#e8f5e8",
                  borderRadius: 2,
                  border: "1px solid #c8e6c9",
                }}
              >
                <Typography variant="body2" color="#2e7d32">
                  📊 Tổng cộng: {scheduleData.length} buổi uống thuốc trong{" "}
                  {
                    Object.keys(
                      scheduleData.reduce((acc, schedule) => {
                        acc[schedule.date] = true;
                        return acc;
                      }, {})
                    ).length
                  }{" "}
                  ngày
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            bgcolor: "#f8fafc",
            borderTop: "1px solid #e2e8f0",
            p: 3,
            gap: 2,
          }}
        >
          <Button
            onClick={() => setOpenDialog(false)}
            variant="outlined"
            sx={{
              borderColor: "#cbd5e0",
              color: "#4a5568",
              "&:hover": { backgroundColor: "#f7fafc", borderColor: "#a0aec0" },
            }}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#2563eb",
              "&:hover": { backgroundColor: "#1d4ed8" },
            }}
          >
            Lưu lịch
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Schedule Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            py: 3,
            px: 4,
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                bgcolor: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(10px)",
              }}
            >
              📅
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="700" color="black">
                Lịch uống thuốc
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ opacity: 0.9, mt: 0.5 }}
                color="black"
              >
                {viewSchedule?.studentId.fullName}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 4, bgcolor: "#f8fafc" }}>
          {/* Prescription Section */}
          <Box sx={{ mb: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: "1px solid #e2e8f0",
                bgcolor: "white",
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: "#e3f2fd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  📋
                </Box>
                <Typography variant="h6" fontWeight="600" color="#1e293b">
                  Thông tin đơn thuốc
                </Typography>
              </Box>

              {viewSchedule?.prescriptionFile ? (
                <Button
                  variant="contained"
                  href={viewSchedule.prescriptionFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    background:
                      "linear-gradient(45deg, #4facfe 0%, #006efeff 100%)",
                    color: "white",
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    boxShadow: "0 4px 15px rgba(79, 172, 254, 0.3)",
                    "&:hover": {
                      boxShadow: "0 6px 20px rgba(79, 172, 254, 0.4)",
                    },
                  }}
                >
                  📄 Xem file đơn thuốc
                </Button>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    p: 2,
                    bgcolor: "#fef2f2",
                    borderRadius: 2,
                    border: "1px solid #fecaca",
                  }}
                >
                  ⚠️ Không có file đơn thuốc
                </Typography>
              )}

              {viewSchedule?.requestItems &&
                viewSchedule.requestItems.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight="600"
                      sx={{ mb: 2 }}
                    >
                      💊 Danh sách thuốc:
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      {viewSchedule.requestItems.map((item, index) => (
                        <Paper
                          key={index}
                          elevation={0}
                          sx={{
                            p: 2,
                            bgcolor: "#f1f5f9",
                            borderRadius: 2,
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          <Typography variant="body2">
                            <strong>{item.medicationName}</strong> -{" "}
                            {item.dosage} - <em>{item.instruction}</em>
                          </Typography>
                        </Paper>
                      ))}
                    </Box>
                  </Box>
                )}
            </Paper>
          </Box>

          {/* Schedule Section */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: "#f0fdf4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ⏰
              </Box>
              <Typography variant="h6" fontWeight="600" color="#1e293b">
                Lịch uống thuốc hàng ngày
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {[
                ...new Set(
                  viewSchedule?.schedules.map(
                    (s) => new Date(s.date).toISOString().split("T")[0]
                  )
                ),
              ]
                .slice(0, 6) // Hiển thị nhiều ngày hơn
                .map((dateStr, index) => {
                  const date = new Date(dateStr);
                  if (isNaN(date.getTime())) {
                    console.error("Invalid date from schedule:", dateStr);
                    return null;
                  }
                  const daySchedules = viewSchedule?.schedules.filter(
                    (s) =>
                      new Date(s.date).toISOString().split("T")[0] ===
                      date.toISOString().split("T")[0]
                  );

                  // Tính toán thống kê cho ngày này
                  const totalSchedules = daySchedules.length;
                  const completedSchedules = daySchedules.filter((schedule) => {
                    const scheduleKey = `${date.toISOString().split("T")[0]}_${
                      schedule.sessionSlots
                    }`;
                    return scheduleStatus[scheduleKey];
                  }).length;
                  const completionRate =
                    totalSchedules > 0
                      ? Math.round((completedSchedules / totalSchedules) * 100)
                      : 0;

                  // Lấy ngày hiện tại để so sánh
                  const currentDate = new Date();
                  currentDate.setHours(0, 0, 0, 0); // Chỉ so sánh ngày, không giờ
                  const scheduleDate = new Date(date);
                  scheduleDate.setHours(0, 0, 0, 0); // Chỉ so sánh ngày
                  const isPastOrFuture =
                    scheduleDate < currentDate || scheduleDate > currentDate;

                  return (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          border: "1px solid #e2e8f0",
                          bgcolor: "white",
                          position: "relative",
                          overflow: "hidden",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
                          },
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "4px",
                            background:
                              completionRate === 100
                                ? "linear-gradient(90deg, #10b981 0%, #34d399 100%)"
                                : completionRate > 0
                                ? "linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)"
                                : "linear-gradient(90deg, #ef4444 0%, #f87171 100%)",
                          },
                        }}
                      >
                        {/* Header ngày */}
                        <Box sx={{ mb: 2 }}>
                          <Typography
                            variant="h6"
                            fontWeight="700"
                            color="#1e293b"
                          >
                            {new Date(date).toLocaleDateString("vi-VN", {
                              weekday: "short",
                              day: "2-digit",
                              month: "2-digit",
                            })}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mt: 1,
                            }}
                          >
                            <Box
                              sx={{
                                px: 2,
                                py: 0.5,
                                borderRadius: 1,
                                bgcolor:
                                  completionRate === 100
                                    ? "#dcfce7"
                                    : completionRate > 0
                                    ? "#fef3c7"
                                    : "#fee2e2",
                                color:
                                  completionRate === 100
                                    ? "#166534"
                                    : completionRate > 0
                                    ? "#92400e"
                                    : "#dc2626",
                              }}
                            >
                              <Typography variant="caption" fontWeight="600">
                                {completionRate}% hoàn thành
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        {/* Schedule items */}
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1.5,
                          }}
                        >
                          {daySchedules.map((schedule) => {
                            const scheduleKey = `${
                              date.toISOString().split("T")[0]
                            }_${schedule.sessionSlots}`;
                            const isCompleted =
                              scheduleStatus[scheduleKey] || false;
                            const isDisabled = isPastOrFuture; // Disable nếu ngày quá khứ hoặc tương lai

                            return (
                              <Box
                                key={schedule._id}
                                sx={{
                                  p: 2,
                                  borderRadius: 2,
                                  bgcolor: isCompleted ? "#f0fdf4" : "#fafafa",
                                  border: `1px solid ${
                                    isCompleted ? "#bbf7d0" : "#e5e7eb"
                                  }`,
                                  transition: "all 0.2s ease",
                                  opacity: isDisabled ? 0.6 : 1,
                                  pointerEvents: isDisabled ? "none" : "auto",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 2,
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: "50%",
                                        bgcolor:
                                          schedule.sessionSlots ===
                                          SlotEnum.Morning
                                            ? "#fef3c7"
                                            : schedule.sessionSlots ===
                                              SlotEnum.Afternoon
                                            ? "#fed7aa"
                                            : "#e0e7ff",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      {schedule.sessionSlots ===
                                      SlotEnum.Morning
                                        ? "🌅"
                                        : schedule.sessionSlots ===
                                          SlotEnum.Afternoon
                                        ? "☀️"
                                        : "🌙"}
                                    </Box>
                                    <Typography
                                      variant="body2"
                                      fontWeight="600"
                                    >
                                      {schedule.sessionSlots ===
                                      SlotEnum.Morning
                                        ? "Sáng"
                                        : schedule.sessionSlots ===
                                          SlotEnum.Afternoon
                                        ? "Chiều"
                                        : "Tối"}
                                    </Typography>
                                  </Box>
                                  <FormControlLabel
                                    control={
                                      <Switch
                                        checked={isCompleted}
                                        onChange={() =>
                                          toggleScheduleStatus(
                                            date.toISOString().split("T")[0],
                                            schedule.sessionSlots
                                          )
                                        }
                                        disabled={isDisabled}
                                        sx={{
                                          "& .MuiSwitch-track": {
                                            bgcolor: isDisabled
                                              ? "#d1d5db"
                                              : isCompleted
                                              ? "#10b981"
                                              : "#d1d5db",
                                          },
                                          "& .MuiSwitch-thumb": {
                                            bgcolor: "white",
                                          },
                                        }}
                                      />
                                    }
                                    label={
                                      <Typography
                                        variant="caption"
                                        fontWeight="600"
                                        color={
                                          isDisabled
                                            ? "#6b7280"
                                            : isCompleted
                                            ? "#166534"
                                            : "#6b7280"
                                        }
                                      >
                                        {isDisabled
                                          ? "🔒 Đã khóa"
                                          : isCompleted
                                          ? "✅ Đã uống"
                                          : "⏳ Chưa uống"}
                                      </Typography>
                                    }
                                    sx={{ m: 0 }}
                                  />
                                </Box>
                              </Box>
                            );
                          })}
                        </Box>
                      </Paper>
                    </Grid>
                  );
                })}
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            bgcolor: "#f8fafc",
            borderTop: "1px solid #e2e8f0",
            p: 4,
            gap: 2,
          }}
        >
          <Button
            onClick={() => setOpenViewDialog(false)}
            variant="outlined"
            sx={{
              borderColor: "#cbd5e0",
              color: "#4a5568",
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#f7fafc",
                borderColor: "#a0aec0",
                transform: "translateY(-1px)",
              },
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>


      <SuccessDialog
  open={showSuccessDialog}
  onClose={() => setShowSuccessDialog(false)}
  title="Thành công"
  message="Tạo lịch uống thuốc thành công!"
  buttonText="Đóng"
  buttonColor="success"
  icon={<CheckCircle size={60} color="#22c55e" />}
/>
<ErrorDialog
  open={showErrorDialog}
  onClose={() => setShowErrorDialog(false)}
  title="Lỗi"
  message={errorMessage}
  buttonText="Đóng"
  buttonColor="error"
  icon={<AlertTriangle size={60} color="#ef4444" />}
/>
<ConfirmDialog
  open={confirmDialogOpen}
  onClose={() => setConfirmDialogOpen(false)}
  onConfirm={handleConfirm}
  title="Xác nhận"
  message={`Bạn chắc chắn đã uống thuốc vào buổi ${
    selectedSchedule?.slot === SlotEnum.Morning
      ? "Sáng"
      : selectedSchedule?.slot === SlotEnum.Afternoon
      ? "Chiều"
      : "Tối"
  } ngày ${new Date(selectedSchedule?.date).toLocaleDateString("vi-VN")}?`}
  confirmButtonText="Xác nhận"
  cancelButtonText="Hủy"
  confirmButtonColor="info"
  icon={<HelpCircle size={20} color="#3b82f6" />}
/>
<DeleteConfirmDialog
  open={showReasonDialog}
  onClose={() => setShowReasonDialog(false)}
  onConfirm={handleReasonSubmit}
  title="Lý do không uống thuốc"
  message={
    <TextField
      fullWidth
      multiline
      rows={3}
      label="Nhập lý do"
      value={reason}
      onChange={(e) => setReason(e.target.value)}
      placeholder="Vui lòng nhập lý do tại sao không uống thuốc..."
      sx={{ mt: 2 }}
    />
  }
  confirmButtonText="Xác nhận"
  cancelButtonText="Hủy"
  confirmButtonColor="error"
  icon={<Trash2 size={20} color="#ef4444" />}
  extraContent={
    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
      Lý do là bắt buộc để xác nhận trạng thái không uống thuốc.
    </Typography>
  }
/>
    </Container>
  );
};

export default MedicationSchedules;

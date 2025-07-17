import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  History,
  Edit2,
  Clock,
  FileText,
  Settings,
  Save,
  X,
  CheckCircle,
} from "lucide-react";
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
  Alert,
  Container,
  Pagination,
  Chip,
  Grid,
} from "@mui/material";
import { Warning } from "@mui/icons-material";
import incidentsService from "~/libs/api/services/incidentsService";

function ViewMedicalRecords() {
  const [historicalRecords, setHistoricalRecords] = useState([]);
  const [searchEventType, setSearchEventType] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [editRecord, setEditRecord] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editForm, setEditForm] = useState({
    note: "",
    status: "",
    severity: "",
    incidentType: "",
    description: "",
    actionsTaken: "",
    incidentTime: "",
  });
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await incidentsService.getAllIncidents();
        setHistoricalRecords(res.data);
        setTotalPages(res.totalPages);
      } catch (error) {
        console.error("Failed to fetch incidents:", error);
      }
    };
    fetchIncidents();
  }, []);

  const classes = [
    ...new Set(historicalRecords.map((record) => record.studentId.class)),
  ];

  const filteredRecords = historicalRecords.filter(
    (record) =>
      record.incidentType
        .toLowerCase()
        .includes(searchEventType.toLowerCase()) &&
      (selectedClass === "" || record.studentId.class === selectedClass)
  );

  const handleEditClick = (record) => {
    console.log("Editing record:", record);
    setEditRecord(record);
    setEditForm({
      note: record.note || "",
      status: record.status || "",
      severity: record.severity || "",
      incidentType: record.incidentType || "",
      description: record.description || "",
      actionsTaken: record.actionsTaken || "",
      incidentTime: record.incidentTime || new Date().toISOString(),
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateTimeChange = (field, value) => {
    setEditForm((prev) => {
      const currentDateTime = prev.incidentTime || new Date().toISOString();
      const [date, time] = currentDateTime.split('T');
      
      if (field === 'date') {
        return {
          ...prev,
          incidentTime: `${value}T${time}`,
        };
      } else if (field === 'time') {
        return {
          ...prev,
          incidentTime: `${date}T${value}:00.000Z`,
        };
      }
      return prev;
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    
    const updateData = {
      studentId: editRecord.studentId,
      note: editForm.note,
      status: editForm.status,
      severity: editForm.severity,
      incidentType: editForm.incidentType,
      description: editForm.description,
      actionsTaken: editForm.actionsTaken,
      incidentTime: editForm.incidentTime,
    };
console.log("Update Data:", updateData);
    try {
      const res = await incidentsService.updateIncident(editRecord._id, updateData);
      if (res.message === "Validation failed") {
        setErrorMessage(res.errors.map(err => `${err.field}: ${err.message}`).join('\n'));
        setShowErrorDialog(true);
        return;
      }
      const updatedRecords = historicalRecords.map((record) =>
        record._id === editRecord._id
          ? { ...record, ...updateData }
          : record
      );
      setHistoricalRecords(updatedRecords);
      setEditRecord(null);
      setEditForm({
        note: "",
        status: "",
        severity: "",
        incidentType: "",
        description: "",
        actionsTaken: "",
        incidentTime: "",
      });
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Failed to update incident:", error);
      setErrorMessage("Cập nhật thất bại. Vui lòng thử lại.");
      setShowErrorDialog(true);
    }
  };

  const handleCancelEdit = () => {
    setEditRecord(null);
    setEditForm({
      note: "",
      status: "",
      severity: "",
      incidentType: "",
      description: "",
      actionsTaken: "",
      incidentTime: "",
    });
  };

  const handleCloseSuccessDialog = () => setShowSuccessDialog(false);
  const handleCloseErrorDialog = () => setShowErrorDialog(false);

  const getCurrentDate = () => {
    return editForm.incidentTime ? editForm.incidentTime.split('T')[0] : '';
  };

  const getCurrentTime = () => {
    return editForm.incidentTime ? editForm.incidentTime.split('T')[1]?.slice(0, 5) : '';
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'cao':
      case 'nặng':
      case 'khẩn cấp':
      case 'high':
        return '#ef4444';
      case 'trung bình':
      case 'medium':
        return '#f59e0b';
      case 'thấp':
      case 'nhẹ':
      case 'low':
        return '#22c55e';
      default:
        return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'đã xử lý':
      case 'hoàn tất':
      case 'resolved':
        return '#22c55e';
      case 'đang xử lý':
      case 'in progress':
        return '#f59e0b';
      case 'chưa xử lý':
      case 'pending':
        return '#ef4444';
      case 'cần theo dõi':
        return '#8b5cf6';
      case 'đã chuyển viện':
        return '#06b6d4';
      default:
        return '#6b7280';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        sx={{ mb: 2, fontWeight: "bold", color: "#1e3a8a" }}
      >
        Lịch sử sự cố
      </Typography>
      
      <Alert
        severity="info"
        icon={<Warning />}
        sx={{ mb: 3 }}
      >
        Xem và quản lý tất cả các hồ sơ y tế đã được ghi nhận của học sinh trong hệ thống.
      </Alert>

      {/* Search Bar */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap" height={"fit-content"}>
        <TextField
          type="text"
          label="Tìm kiếm theo loại sự kiện"
          value={searchEventType}
          onChange={(e) => setSearchEventType(e.target.value)}
          sx={{ width: { xs: "100%", sm: 300 } }}
          variant="outlined"
          size="small"
        />
        <FormControl sx={{ width: { xs: "100%", sm: 200 } }}>
          <InputLabel>Lớp</InputLabel>
          <Select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            label="Lớp"
            size="small"
          >
            <MenuItem value="">Tất cả</MenuItem>
            {classes.map((cls) => (
              <MenuItem key={cls} value={cls}>
                {cls}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Records Display */}
      <Box>
        {filteredRecords.length > 0 ? (
          <Box>
            {filteredRecords.map((record) => (
              <Box
                key={record._id}
                sx={{
                  bgcolor: "white",
                  borderRadius: 2,
                  boxShadow: 1,
                  "&:hover": { boxShadow: 2 },
                  transition: "all 0.2s",
                  border: "1px solid #e5e7eb",
                  mb: 2,
                }}
              >
                <Box sx={{ p: 3 }}>
                  {/* Header */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="h6" fontWeight="600" color="text.primary">
                        {record.studentId.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Lớp: {record.studentId.class}
                      </Typography>
                    </Box>
                    <Button
                      onClick={() => handleEditClick(record)}
                      size="small"
                      startIcon={<Edit2 size={16} />}
                      sx={{
                        color: "#3b82f6",
                        "&:hover": { bgcolor: "#eff6ff" },
                      }}
                    >
                      Chỉnh sửa
                    </Button>
                  </Box>

                  {/* Content Grid */}
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    {/* Left Column */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {/* Event Type */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          p: 2,
                          bgcolor: "#fef2f2",
                          borderRadius: 1,
                          border: "1px solid #fecaca",
                        }}
                      >
                        <AlertTriangle size={20} color="#ef4444" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Loại sự kiện
                          </Typography>
                          <Typography variant="body1" fontWeight="600">
                            {record.incidentType}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Time */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          p: 2,
                          bgcolor: "#eff6ff",
                          borderRadius: 1,
                          border: "1px solid #bfdbfe",
                        }}
                      >
                        <Clock size={20} color="#3b82f6" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Thời gian
                          </Typography>
                          <Typography variant="body1" fontWeight="600">
                            {new Date(record.incidentTime).toLocaleString("vi-VN")}
                          </Typography>
                        </Box>
                        {/* <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.5 }}>
                          {record.description}
                        </Typography> */}
                      </Box>

                      

                      {/* Status & Severity */}
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Chip
                          label={record.severity}
                          size="small"
                          sx={{
                            bgcolor: getSeverityColor(record.severity),
                            color: "white",
                            fontWeight: "500",
                          }}
                        />
                        <Chip
                          label={record.status}
                          size="small"
                          sx={{
                            bgcolor: getStatusColor(record.status),
                            color: "white",
                            fontWeight: "500",
                          }}
                        />
                      </Box>

                      {/* Note */}
                      {record.note && (
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: "#f0f9ff",
                            borderRadius: 1,
                            border: "1px solid #bae6fd",
                            minHeight: 60,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary" fontWeight="500" mb={1}>
                            Ghi chú
                          </Typography>
                          <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.5 }}>
                            {record.note}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Right Column */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {/* Description */}
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: "#f8fafc",
                          borderRadius: 1,
                          border: "1px solid #e2e8f0",
                          minHeight: 80,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                          <FileText size={16} color="#64748b" />
                          <Typography variant="body2" color="text.secondary" fontWeight="500">
                            Mô tả
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.5 }}>
                          {record.description}
                        </Typography>
                      </Box>

                      {/* Actions */}
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: "#fffbeb",
                          borderRadius: 1,
                          border: "1px solid #fde68a",
                          minHeight: 80,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                          <Settings size={16} color="#f59e0b" />
                          <Typography variant="body2" color="text.secondary" fontWeight="500">
                            Hành động xử lý
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.5 }}>
                          {record.actionsTaken}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Timestamp */}
                  <Box sx={{ pt: 2, borderTop: "1px solid #e5e7eb" }}>
                    <Typography variant="caption" color="text.secondary">
                      Ghi nhận lúc: {new Date(record.incidentTime).toLocaleString("vi-VN")}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
            
            {/* Pagination */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(event, value) => setPage(value)}
                color="primary"
                siblingCount={1}
                boundaryCount={1}
              />
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: 2,
              boxShadow: 1,
              p: 4,
              textAlign: "center",
            }}
          >
            <History size={48} color="#9ca3af" style={{ marginBottom: 16 }} />
            <Typography variant="h6" color="text.secondary" mb={1}>
              Không tìm thấy hồ sơ
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Chưa có hồ sơ y tế nào phù hợp với tiêu chí tìm kiếm.
            </Typography>
          </Box>
        )}
      </Box>

      {/* Enhanced Edit Dialog */}
      <Dialog
        open={!!editRecord}
        onClose={handleCancelEdit}
        maxWidth="lg"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 2,
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "#f8fafc",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Edit2 size={20} color="#3b82f6" />
            <Typography variant="h6" fontWeight="600" color="#1e293b">
              Chỉnh sửa Hồ sơ Y tế
            </Typography>
          </Box>
          <Button
            onClick={handleCancelEdit}
            size="small"
            sx={{ minWidth: "auto", p: 1 }}
          >
            <X size={18} />
          </Button>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          {editRecord && (
            <Box component="form" onSubmit={handleSaveEdit} sx={{ mt: 1 }}>
              <Grid container spacing={3}>
                {/* Row 1: Student Info (Read-only) */}
                <Grid item xs={12} sx={{ width: "50%" }}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "#f1f5f9",
                      borderRadius: 1,
                      border: "1px solid #cbd5e1",
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="600" color="text.primary">
                      Học sinh: {editRecord.studentId.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lớp: {editRecord.studentId.class}
                    </Typography>
                  </Box>
                </Grid>

                {/* Row 2: Incident Type, Severity, Status */}
                <Grid item xs={12} md={4} sx={{ width: "20%" }}>
                  <FormControl fullWidth>
                    <InputLabel>Loại sự kiện</InputLabel>
                    <Select
                      name="incidentType"
                      value={editForm.incidentType}
                      onChange={handleFormChange}
                      label="Loại sự kiện"
                    >
                      <MenuItem value="Chấn thương nhẹ">Chấn thương nhẹ</MenuItem>
                      <MenuItem value="Chấn thương nặng">Chấn thương nặng</MenuItem>
                      <MenuItem value="Sốt">Sốt</MenuItem>
                      <MenuItem value="Đau đầu">Đau đầu</MenuItem>
                      <MenuItem value="Dị ứng">Dị ứng</MenuItem>
                      <MenuItem value="Tiêu chảy">Tiêu chảy</MenuItem>
                      <MenuItem value="Khác">Khác</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4} sx={{ width: "20%" }}>
                  <FormControl fullWidth>
                    <InputLabel>Mức độ nghiêm trọng</InputLabel>
                    <Select
                      name="severity"
                      value={editForm.severity}
                      onChange={handleFormChange}
                      label="Mức độ nghiêm trọng"
                    >
                      <MenuItem value="Nhẹ">Nhẹ</MenuItem>
                      <MenuItem value="Trung bình">Trung bình</MenuItem>
                      <MenuItem value="Nặng">Nặng</MenuItem>
                      <MenuItem value="Khẩn cấp">Khẩn cấp</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4} sx={{ width: "24%" }}>
                  <FormControl fullWidth>
                    <InputLabel>Trạng thái xử lý</InputLabel>
                    <Select
                      name="status"
                      value={editForm.status}
                      onChange={handleFormChange}
                      label="Trạng thái xử lý"
                    >
                      <MenuItem value="Đang xử lý">Đang xử lý</MenuItem>
                      <MenuItem value="Đã xử lý">Đã xử lý</MenuItem>
                      <MenuItem value="Cần theo dõi">Cần theo dõi</MenuItem>
                      <MenuItem value="Đã chuyển viện">Đã chuyển viện</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Row 3: Date and Time */}
                <Grid item xs={12} md={6} sx={{ width: "24%" }}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Ngày xảy ra"
                    value={getCurrentDate()}
                    onChange={(e) => handleDateTimeChange('date', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={6} sx={{ width: "20%" }}>
                  <TextField
                    fullWidth
                    type="time"
                    label="Thời gian xảy ra"
                    value={getCurrentTime()}
                    onChange={(e) => handleDateTimeChange('time', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                {/* Row 4: Note */}
                <Grid item xs={12} sx={{ width: "100%" }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    name="note"
                    label="Ghi chú"
                    value={editForm.note}
                    onChange={handleFormChange}
                    placeholder="Ghi chú bổ sung về sự kiện..."
                  />
                </Grid>

                {/* Row 5: Description */}
                <Grid item xs={12} sx={{ width: "50%" }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    name="description"
                    label="Mô tả chi tiết sự kiện"
                    value={editForm.description}
                    onChange={handleFormChange}
                    placeholder="Mô tả cụ thể sự việc, tình trạng ban đầu của học sinh, triệu chứng..."
                  />
                </Grid>

                {/* Row 6: Actions Taken */}
                <Grid item xs={12} sx={{ width: "47.8%" }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    name="actionsTaken"
                    label="Hành động đã xử lý"
                    value={editForm.actionsTaken}
                    onChange={handleFormChange}
                    placeholder="Các bước xử lý đã thực hiện, ví dụ: sơ cứu, gọi phụ huynh, chuyển lên phòng y tế, dùng thuốc gì..."
                  />
                </Grid>
              </Grid>
            </Box>
          )}
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
            onClick={handleCancelEdit}
            variant="outlined"
            sx={{
              borderColor: "#cbd5e0",
              color: "#4a5568",
              "&:hover": {
                backgroundColor: "#f7fafc",
                borderColor: "#a0aec0",
              },
            }}
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            sx={{
              backgroundColor: "#2563eb",
              "&:hover": {
                backgroundColor: "#1d4ed8",
              },
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Save size={18} />
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog
        open={showSuccessDialog}
        onClose={handleCloseSuccessDialog}
        sx={{ "& .MuiDialog-paper": { borderRadius: 2, p: 2, textAlign: "center" } }}
      >
        <DialogContent>
          <CheckCircle size={60} color="#22c55e" sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.primary">
            Cập nhật Thành công!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hồ sơ y tế đã được cập nhật thành công.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={handleCloseSuccessDialog} variant="contained" color="success">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Dialog */}
      <Dialog
        open={showErrorDialog}
        onClose={handleCloseErrorDialog}
        sx={{ "& .MuiDialog-paper": { borderRadius: 2, p: 2, textAlign: "center" } }}
      >
        <DialogContent>
          <AlertTriangle size={60} color="#ef4444" sx={{ mb: 2 }} />
          <Typography variant="h6" color="error">
            Lỗi Cập nhật
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {errorMessage}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={handleCloseErrorDialog} variant="contained" color="error">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ViewMedicalRecords;

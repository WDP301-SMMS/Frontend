import React, { useState, useEffect } from "react";
import { Send, Plus, Eye, AlertTriangle, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Container,
  Alert,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import { Warning } from "@mui/icons-material";
import { classes, vaccinationCampaigns } from "~/mock/mock";



// Dữ liệu chiến dịch tiêm chủng mẫu
// Dữ liệu chiến dịch tiêm chủng mẫu

// Reusable Alert Dialog Component
const AlertDialog = ({ open, onClose, message, type, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        {type === "success"
          ? "Thành công"
          : type === "error"
          ? "Lỗi"
          : "Xác nhận"}
      </DialogTitle>
      <DialogContent>
        <Box display="flex" alignItems="center" gap={2}>
          {type === "success" ? (
            <CheckCircle size={24} className="text-green-500" />
          ) : (
            <AlertTriangle size={24} className="text-red-500" />
          )}
          <Typography>{message}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        {type === "confirm" ? (
          <>
            <Button onClick={onClose} color="inherit">
              Hủy
            </Button>
            <Button onClick={onConfirm} color="primary" variant="contained">
              Xác nhận
            </Button>
          </>
        ) : (
          <Button onClick={onClose} color="primary" variant="contained">
            Đóng
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

function SendVaccinationConsent() {
  const [form, setForm] = useState({
    selectedCampaignId: "", // New: to select an existing campaign
    vaccineName: "", // These will be populated from selected campaign
    vaccineType: "",
    customVaccineType: "",
    ageGroup: "",
    vaccineInfo: "",
    specialRequirements: "",
    targetClasses: [],
    scheduledDate: new Date().toISOString().substring(0, 10),
    scheduledTime: "08:00",
    location: "",
    channels: { email: false, app: false },
  });
  const [notifications, setNotifications] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [alertDialog, setAlertDialog] = useState({
    open: false,
    message: "",
    type: "error", // 'error', 'success', or 'confirm'
    onConfirm: null,
  });
  const itemsPerPage = 10;

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleCampaignSelect = (e) => {
    const campaignId = e.target.value;
    const selectedCampaign = vaccinationCampaigns.find(
      (campaign) => campaign.id === campaignId
    );

    if (selectedCampaign) {
      setForm((prevForm) => ({
        ...prevForm,
        selectedCampaignId: campaignId,
        vaccineName: selectedCampaign.vaccineName,
        vaccineType: selectedCampaign.vaccineType,
        customVaccineType: selectedCampaign.customVaccineType || "",
        ageGroup: selectedCampaign.ageGroup,
        vaccineInfo: selectedCampaign.vaccineInfo,
        specialRequirements: selectedCampaign.specialRequirements,
      }));
    } else {
      // Reset vaccine-related fields if no campaign is selected (e.g., if "Choose campaign" is re-selected)
      setForm((prevForm) => ({
        ...prevForm,
        selectedCampaignId: "",
        vaccineName: "",
        vaccineType: "",
        customVaccineType: "",
        ageGroup: "",
        vaccineInfo: "",
        specialRequirements: "",
      }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      channels: { ...prevForm.channels, [name]: checked },
    }));
  };

  const handleSelectAllClasses = () => {
    setForm((prevForm) => ({
      ...prevForm,
      targetClasses: classes.map((cls) => cls.id),
    }));
  };

  const generateNotificationContent = () => {
    const vaccineTypeDisplay =
      form.vaccineType === "Khác" ? form.customVaccineType : form.vaccineType;
    return `
# THÔNG BÁO TIÊM CHỦNG

Kính gửi quý phụ huynh,

Trường học tổ chức tiêm chủng vaccine **${
      form.vaccineName
    }** (${vaccineTypeDisplay}) cho học sinh thuộc nhóm tuổi **${
      form.ageGroup
    }**.

## Thông tin chi tiết
- **Ngày và giờ tiêm**: ${new Date(form.scheduledDate).toLocaleDateString(
      "vi-VN"
    )} lúc ${form.scheduledTime}
- **Địa điểm**: ${form.location}
- **Thông tin vaccine**: ${form.vaccineInfo}
- **Yêu cầu đặc biệt**: ${form.specialRequirements || "Không có"}

## Lưu ý
- **Chống chỉ định**: Không tiêm nếu trẻ đang sốt, mắc bệnh cấp tính, hoặc dị ứng với thành phần vaccine.
- **Link phản hồi**: [Xác nhận đồng ý/từ chối](https://example.com/confirm)
- **Liên hệ**: Y tá trường - SĐT: 0123 456 789, Email: nurse@school.edu.vn

Vui lòng phản hồi trước ngày **${new Date(
      form.scheduledDate
    ).toLocaleDateString("vi-VN")}**.

Trân trọng,  
**Ban Y tế Trường học**
    `;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.selectedCampaignId) {
      setAlertDialog({
        open: true,
        message: "Vui lòng chọn một chiến dịch tiêm chủng.",
        type: "error",
      });
      return;
    }
    if (form.targetClasses.length === 0) {
      setAlertDialog({
        open: true,
        message: "Vui lòng chọn ít nhất một lớp mục tiêu.",
        type: "error",
      });
      return;
    }
    if (!Object.values(form.channels).some((channel) => channel)) {
      setAlertDialog({
        open: true,
        message: "Vui lòng chọn ít nhất một kênh gửi thông báo.",
        type: "error",
      });
      return;
    }
    if (!form.location) {
      setAlertDialog({
        open: true,
        message: "Vui lòng nhập địa điểm tiêm.",
        type: "error",
      });
      return;
    }

    const newNotification = {
      id: Date.now().toString(),
      campaignName: form.campaignName, // This will be set from the selected campaign
      vaccineName: form.vaccineName,
      vaccineType:
        form.vaccineType === "Khác" ? form.customVaccineType : form.vaccineType,
      sentDate: new Date().toLocaleString("vi-VN"),
      targetClasses: form.targetClasses.map(
        (id) => classes.find((c) => c.id === id)?.name
      ),
      status: {
        agreed: Math.floor(Math.random() * 50),
        declined: Math.floor(Math.random() * 10),
        pending: Math.floor(Math.random() * 40),
      },
      content: generateNotificationContent(),
      channels: form.channels,
    };
    setNotifications((prev) => [...prev, newNotification]);
    setOpenDialog(false);
    setForm({
      selectedCampaignId: "",
      vaccineName: "",
      vaccineType: "",
      customVaccineType: "",
      ageGroup: "",
      vaccineInfo: "",
      specialRequirements: "",
      targetClasses: [],
      scheduledDate: new Date().toISOString().substring(0, 10),
      scheduledTime: "08:00",
      location: "",
      channels: { email: false, app: false },
    });
    setAlertDialog({
      open: true,
      message: "Thông báo đã được gửi thành công!",
      type: "success",
      onConfirm: null,
    });
  };

  const handleResend = (notification) => {
    setAlertDialog({
      open: true,
      message: "Bạn có chắc chắn muốn tái gửi thông báo này?",
      type: "confirm",
      onConfirm: () => {
        const updatedNotification = {
          ...notification,
          sentDate: new Date().toLocaleString("vi-VN"),
        };
        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? updatedNotification : n))
        );
        setAlertDialog({
          open: true,
          message: "Thông báo đã được tái gửi.",
          type: "success",
          onConfirm: null,
        });
      },
    });
  };

  const handleOpenDetailDialog = (notification) => {
    setSelectedNotification(notification);
    setOpenDetailDialog(true);
  };

  // Phân trang
  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Handle closing alert dialog
  const handleCloseAlertDialog = () => {
    setAlertDialog((prev) => ({ ...prev, open: false, onConfirm: null }));
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
                   Gửi Phiếu Thông Báo Đồng Ý Tiêm Chủng
                  </Typography>

      <Alert
              severity="info"
              icon={<Warning />}
              sx={{ mb: 3, fontWeight: "medium" }}
            >
               Tạo và gửi thông báo tiêm chủng đến phụ huynh học sinh.s
            </Alert>
      

      {/* Nút tạo thông báo */}
      <Box display="flex" justifyContent="flex-end" mb={6}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#2563eb",
            "&:hover": { backgroundColor: "#1d4ed8" },
            color: "white",
            fontWeight: "bold",
            borderRadius: "8px",
            padding: "12px 24px",
            textTransform: "none",
          }}
          startIcon={<Plus size={20} />}
          onClick={() => {
            setOpenDialog(true);
            setForm({
              selectedCampaignId: "",
              vaccineName: "",
              vaccineType: "",
              customVaccineType: "",
              ageGroup: "",
              vaccineInfo: "",
              specialRequirements: "",
              targetClasses: [],
              scheduledDate: new Date().toISOString().substring(0, 10),
              scheduledTime: "08:00",
              location: "",
              channels: { email: false, app: false },
            }); // Reset form when opening dialog
          }}
        >
          Tạo thông báo mới
        </Button>
      </Box>

      {/* Bảng danh sách thông báo đã gửi */}
      <TableContainer
        component={Paper}
        sx={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
              <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>
                Tên chiến dịch
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>
                Vaccine
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>
                Ngày gửi
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>
                Lớp mục tiêu
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>
                Phản hồi
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedNotifications.length > 0 ? (
              paginatedNotifications.map((notification) => (
                <TableRow
                  key={notification.id}
                  hover
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{notification.campaignName}</TableCell>
                  <TableCell>{notification.vaccineName}</TableCell>
                  <TableCell>{notification.sentDate}</TableCell>
                  <TableCell>{notification.targetClasses.join(", ")}</TableCell>
                  <TableCell>
                    <span style={{ color: "green" }}>
                      Đồng ý: {notification.status.agreed}
                    </span>{" "}
                    |
                    <span style={{ color: "red" }}>
                      {" "}
                      Từ chối: {notification.status.declined}
                    </span>{" "}
                    |
                    <span style={{ color: "blue" }}>
                      {" "}
                      Chưa phản hồi: {notification.status.pending}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Button
                        onClick={() => handleOpenDetailDialog(notification)}
                        sx={{ padding: "8px", minWidth: "auto" }}
                        aria-label="Xem chi tiết"
                      >
                        <Eye size={20} />
                      </Button>
                      <Button
                        onClick={() => handleResend(notification)}
                        sx={{ padding: "8px", minWidth: "auto" }}
                        aria-label="Tái gửi"
                      >
                        <Send size={20} className="text-blue-600" />
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Box textAlign="center" py={4}>
                    <Typography color="textSecondary">
                      Chưa có thông báo nào được gửi.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phân trang */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            sx={{ "& .MuiPaginationItem-root": { fontSize: "1rem" } }}
          />
        </Box>
      )}

      {/* Dialog Tạo Thông Báo */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Tạo Thông Báo Tiêm Chủng Mới</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Chọn Chiến Dịch Tiêm Chủng</InputLabel>
              <Select
                name="selectedCampaignId"
                value={form.selectedCampaignId}
                onChange={handleCampaignSelect}
                label="Chọn Chiến Dịch Tiêm Chủng"
              >
                <MenuItem value="">
                  <em>-- Chọn một chiến dịch --</em>
                </MenuItem>
                {vaccinationCampaigns.map((campaign) => (
                  <MenuItem key={campaign.id} value={campaign.id}>
                    {campaign.campaignName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Display fields from selected campaign (read-only or conditionally editable if needed) */}
            {form.selectedCampaignId && (
              <>
                <TextField
                  name="vaccineName"
                  label="Tên vaccine"
                  value={form.vaccineName}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  InputProps={{ readOnly: true }} // Make it read-only
                />
                <TextField
                  name="vaccineType"
                  label="Loại vaccine"
                  value={
                    form.vaccineType === "Khác"
                      ? form.customVaccineType
                      : form.vaccineType
                  }
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  InputProps={{ readOnly: true }} // Make it read-only
                />
                <TextField
                  name="ageGroup"
                  label="Nhóm tuổi"
                  value={form.ageGroup}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  InputProps={{ readOnly: true }} // Make it read-only
                />
                <TextField
                  name="vaccineInfo"
                  label="Thông tin vaccine"
                  value={form.vaccineInfo}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  multiline
                  rows={4}
                  InputProps={{ readOnly: true }} // Make it read-only
                />
                <TextField
                  name="specialRequirements"
                  label="Yêu cầu đặc biệt"
                  value={form.specialRequirements}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  multiline
                  rows={2}
                  InputProps={{ readOnly: true }} // Make it read-only
                />
              </>
            )}

            {/* Remaining fields are for the specific notification instance */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Lớp mục tiêu</InputLabel>
              <Select
                name="targetClasses"
                multiple
                value={form.targetClasses}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    targetClasses: e.target.value,
                  }))
                }
                required
                label="Lớp mục tiêu"
                renderValue={(selected) =>
                  selected
                    .map((id) => classes.find((c) => c.id === id)?.name)
                    .join(", ")
                }
              >
                {classes.map((cls) => (
                  <MenuItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleSelectAllClasses}
              sx={{ mt: 1, mb: 2 }}
            >
              Chọn tất cả các lớp
            </Button>
            <Box display="flex" gap={2}>
              <TextField
                name="scheduledDate"
                label="Ngày tiêm dự kiến"
                type="date"
                value={form.scheduledDate}
                onChange={handleFormChange}
                required
                fullWidth
                variant="outlined"
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                name="scheduledTime"
                label="Giờ tiêm"
                type="time"
                value={form.scheduledTime}
                onChange={handleFormChange}
                required
                fullWidth
                variant="outlined"
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <TextField
              name="location"
              label="Địa điểm tiêm"
              value={form.location}
              onChange={handleFormChange}
              required
              fullWidth
              variant="outlined"
              margin="normal"
              placeholder="Ví dụ: Phòng y tế trường"
            />

            <Box mt={2}>
              <Typography variant="subtitle1" gutterBottom>
                Kênh gửi thông báo
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    name="email"
                    checked={form.channels.email}
                    onChange={handleCheckboxChange}
                  />
                }
                label="Email"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="app"
                    checked={form.channels.app}
                    onChange={handleCheckboxChange}
                  />
                }
                label="App"
              />
            </Box>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)} color="inherit">
                Hủy
              </Button>
              <Button
                onClick={() => setOpenPreviewDialog(true)}
                variant="outlined"
                color="primary"
                disabled={!form.selectedCampaignId || !form.location || form.targetClasses.length === 0 || (!form.channels.email && !form.channels.app)}
              >
                Xem trước
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!form.selectedCampaignId || !form.location || form.targetClasses.length === 0 || (!form.channels.email && !form.channels.app)}
              >
                Gửi
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Xem trước Thông Báo */}
      <Dialog
        open={openPreviewDialog}
        onClose={() => setOpenPreviewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Xem trước Thông Báo</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              p: 3,
              bgcolor: "white",
              borderRadius: 2,
              boxShadow: 1,
              "& h1": {
                fontSize: "1.5rem",
                fontWeight: "bold",
                mb: 2,
                color: "#1a202c",
              },
              "& h2": {
                fontSize: "1.25rem",
                fontWeight: "bold",
                mt: 3,
                mb: 1,
                color: "#2d3748",
              },
              "& p": { fontSize: "1rem", lineHeight: 1.6, color: "#4a5568" },
              "& ul": { pl: 4, mb: 2 },
              "& li": { mb: 1 },
              "& strong": { color: "#2d3748" },
              "& a": { color: "#2563eb", textDecoration: "underline" },
            }}
          >
            <ReactMarkdown>{generateNotificationContent()}</ReactMarkdown>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPreviewDialog(false)} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Chi tiết Thông Báo */}
      <Dialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Chi tiết Thông Báo</DialogTitle>
        <DialogContent>
          {selectedNotification && (
            <Box>
              <Typography variant="body1" gutterBottom>
                <strong>Tên chiến dịch:</strong>{" "}
                {selectedNotification.campaignName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Vaccine:</strong> {selectedNotification.vaccineName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Loại vaccine:</strong>{" "}
                {selectedNotification.vaccineType}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Ngày gửi:</strong> {selectedNotification.sentDate}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Lớp mục tiêu:</strong>{" "}
                {selectedNotification.targetClasses.join(", ")}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Phản hồi:</strong> Đồng ý:{" "}
                {selectedNotification.status.agreed} | Từ chối:{" "}
                {selectedNotification.status.declined} | Chưa phản hồi:{" "}
                {selectedNotification.status.pending}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Kênh gửi:</strong>{" "}
                {Object.keys(selectedNotification.channels)
                  .filter((key) => selectedNotification.channels[key])
                  .map((key) =>
                    key === "email" ? "Email" : key === "app" ? "App" : ""
                  )
                  .join(", ")}
              </Typography>
              <Typography variant="body1" mt={2}>
                <strong>Nội dung thông báo:</strong>
              </Typography>
              <Box
                sx={{
                  p: 2,
                  bgcolor: "#f7fafc",
                  borderRadius: 1,
                  mt: 1,
                  "& h1": { fontSize: "1.25rem", fontWeight: "bold" },
                  "& h2": { fontSize: "1rem", fontWeight: "bold" },
                  "& p": { fontSize: "0.875rem", lineHeight: 1.6 },
                  "& ul": { pl: 4 },
                }}
              >
                <ReactMarkdown>{selectedNotification.content}</ReactMarkdown>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailDialog(false)} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Dialog for Errors, Success, and Confirm Messages */}
      <AlertDialog
        open={alertDialog.open}
        onClose={handleCloseAlertDialog}
        message={alertDialog.message}
        type={alertDialog.type}
        onConfirm={alertDialog.onConfirm}
      />
    </Container>
  );
}

export default SendVaccinationConsent;
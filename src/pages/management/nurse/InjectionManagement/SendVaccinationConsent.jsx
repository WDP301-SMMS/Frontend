import React, { useState, useEffect, useCallback } from "react";
import { Send, Plus, Eye, AlertTriangle, CheckCircle, X, RefreshCw } from "lucide-react";
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
  CircularProgress,
  Chip,
} from "@mui/material";
import { Warning } from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import campaignService from "~/libs/api/services/campaignService";
import { userService } from "~/libs/api";

// Reusable Alert Dialog Component
const AlertDialog = ({ open, onClose, message, type, onConfirm }) => {
  const [cancellationReason, setCancellationReason] = useState("");

  const handleConfirm = () => {
    if (type === "confirm" && !cancellationReason.trim()) {
      alert("Vui lòng nhập lý do hủy chiến dịch.");
      return;
    }
    onConfirm(cancellationReason);
    setCancellationReason("");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        {type === "success" ? "Thành công" : type === "error" ? "Lỗi" : "Xác nhận hủy chiến dịch"}
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          <Box display="flex" alignItems="center" gap={2}>
            {type === "success" ? (
              <CheckCircle size={24} className="text-green-500" />
            ) : (
              <AlertTriangle size={24} className="text-red-500" />
            )}
            <Typography>{message}</Typography>
          </Box>
          {type === "confirm" && (
            <TextField
              label="Lý do hủy"
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              fullWidth
              variant="outlined"
              margin="normal"
              required
              placeholder="Nhập lý do hủy chiến dịch"
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        {type === "confirm" ? (
          <>
            <Button onClick={onClose} color="inherit">
              Hủy
            </Button>
            <Button onClick={handleConfirm} color="primary" variant="contained">
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
    selectedCampaignId: "",
    scheduledDate: new Date().toISOString().substring(0, 10),
    location: "",
    channels: { email: false, app: false },
  });

  const [announcedCampaigns, setAnnouncedCampaigns] = useState([]);
  const [draftCampaigns, setDraftCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [campaignsLoading, setCampaignsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nurseID, setNurseID] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [alertDialog, setAlertDialog] = useState({
    open: false,
    message: "",
    type: "error",
    onConfirm: null,
  });

  const itemsPerPage = 10;
  const currentDate = "2025-06-23"; // Current date for logic (YYYY-MM-DD)

  useEffect(() => {
    loadAnnouncedCampaigns();
    loadDraftCampaigns();
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const result = await userService.getProfile();
      if (result.success) {
        const data = result.data.data;
        const nurseID = localStorage.getItem("nurseID");
        if (nurseID != data._id) {
          localStorage.setItem("nurseID", data._id);
          setNurseID(data._id);
        } else {
          setNurseID(data._id);
        }
        console.log(data._id);
        console.log(nurseID);
      } else {
        setError(result.message || "Không thể tải thông tin Nurse");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tải hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  const loadAnnouncedCampaigns = async () => {
    try {
      setCampaignsLoading(true);
      const response = await campaignService.getAllCampaign({
        page: 1,
        limit: 100,
      });
      const nonDraftCampaigns = (response.data || []).filter(
        (campaign) => campaign.status !== "DRAFT"
      );
      const notificationsData = nonDraftCampaigns.map((campaign) => {
        let campaignActualStartDate = "N/A";
        if (campaign.actualStartDate) {
          const dateObj = new Date(campaign.actualStartDate);
          if (!isNaN(dateObj.getTime())) {
            campaignActualStartDate = dateObj.toISOString().substring(0, 10);
          }
        }
        // Set status to IN_PROGRESS if actualStartDate matches current date
        const status =
          campaignActualStartDate === currentDate
            ? "IN_PROGRESS"
            : campaign.status || "sent";
        return {
          id: campaign._id,
          campaignId: campaign._id,
          campaignName: campaign.name || "N/A",
          vaccineName: campaign.vaccineName || "N/A",
          sentDate: campaign.dispatchedAt
            ? new Date(campaign.dispatchedAt).toLocaleString("vi-VN")
            : "N/A",
          targetGradeLevels: campaign.targetGradeLevels || [],
          scheduledDate: campaignActualStartDate,
          location: campaign.destination || "Phòng y tế trường",
          content: generateNotificationContentFromCampaign(campaign),
          channels: { email: true, app: true },
          status,
          summary: campaign.summary || {
            totalConsents: 0,
            approved: 0,
            declined: 0,
          },
          cancellationReason: campaign.cancellationReason || "",
        };
      });
      setAnnouncedCampaigns(nonDraftCampaigns);
      setNotifications(notificationsData);
    } catch (error) {
      console.error("Failed to load campaigns:", error);
      setAlertDialog({
        open: true,
        message: "Không thể tải danh sách chiến dịch. Vui lòng thử lại.",
        type: "error",
      });
    } finally {
      setCampaignsLoading(false);
    }
  };

  const loadDraftCampaigns = async () => {
    try {
      setCampaignsLoading(true);
      const response = await campaignService.getDraftCampaigns(1, 100);
      setDraftCampaigns(response.data || []);
    } catch (error) {
      console.error("Failed to load draft campaigns:", error);
      setAlertDialog({
        open: true,
        message: "Không thể tải danh sách chiến dịch nháp. Vui lòng thử lại.",
        type: "error",
      });
    } finally {
      setCampaignsLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setCampaignsLoading(true);
      await Promise.all([loadAnnouncedCampaigns(), loadDraftCampaigns()]);
      setAlertDialog({
        open: true,
        message: "Dữ liệu đã được làm mới thành công!",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to refresh data:", error);
      setAlertDialog({
        open: true,
        message: "Không thể làm mới dữ liệu. Vui lòng thử lại.",
        type: "error",
      });
    } finally {
      setCampaignsLoading(false);
    }
  };

  const generateNotificationContentFromCampaign = (campaign) => {
    return `
# THÔNG BÁO TIÊM CHỦNG

Kính gửi quý phụ huynh,

Trường học tổ chức tiêm chủng vaccine **${campaign.vaccineName || "N/A"}** cho học sinh khối lớp ${campaign.targetGradeLevels?.join(", ") || "N/A"}.

## Thông tin chi tiết
- **Tên chiến dịch**: ${campaign.name || "N/A"}
- **Mũi tiêm thứ**: ${campaign.doseNumber || "N/A"}
- **Ngày tiêm dự kiến**: ${new Date(campaign.actualStartDate).toLocaleDateString("vi-VN")}
- **Địa điểm**: ${campaign.destination || "Phòng y tế trường"}
- **Thông tin vaccine**: ${campaign.description || "Thông tin chi tiết sẽ được cung cấp"}

## Lưu ý
- **Chống chỉ định**: Không tiêm nếu trẻ đang sốt, mắc bệnh cấp tính, hoặc dị ứng với thành phần vaccine.
- **Liên hệ**: Y tá trường - SĐT: 0123 456 789, Email: nurse@school.edu.vn

Vui lòng phản hồi trước ngày **${new Date(campaign.actualStartDate).toLocaleDateString("vi-VN")}**.

Trân trọng,  
**Ban Y tế Trường học**
    `;
  };

  const generateNotificationContent = () => {
    if (!selectedCampaign) return "";

    return `
# THÔNG BÁO TIÊM CHỦNG

Kính gửi quý phụ huynh,

Trường học tổ chức tiêm chủng vaccine **${selectedCampaign.vaccineName || "N/A"}** cho học sinh khối lớp ${selectedCampaign.targetGradeLevels?.join(", ") || "N/A"}.

## Thông tin chi tiết
- **Tên chiến dịch**: ${selectedCampaign.name || "N/A"}
- **Mũi tiêm thứ**: ${selectedCampaign.doseNumber || "N/A"}
- **Ngày tiêm dự kiến**: ${new Date(form.scheduledDate).toLocaleDateString("vi-VN")}
- **Địa điểm**: ${form.location}
- **Thông tin vaccine**: ${selectedCampaign.description || "Thông tin chi tiết sẽ được cung cấp"}

## Lưu ý
- **Chống chỉ định**: Không tiêm nếu trẻ đang sốt, mắc bệnh cấp tính, hoặc dị ứng với thành phần vaccine.
- **Liên hệ**: Y tá trường - SĐT: 0123 456 789, Email: nurse@school.edu.vn

Vui lòng phản hồi trước ngày **${new Date(form.scheduledDate).toLocaleDateString("vi-VN")}**.

Trân trọng,  
**Ban Y tế Trường học**
    `;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleCampaignSelect = async (e) => {
    const campaignId = e.target.value;
    if (!campaignId) {
      setSelectedCampaign(null);
      setForm((prevForm) => ({
        ...prevForm,
        selectedCampaignId: "",
        scheduledDate: new Date().toISOString().substring(0, 10),
      }));
      return;
    }
    try {
      setLoading(true);
      const campaignData = await campaignService.getCampaign(campaignId);
      setSelectedCampaign(campaignData.data);
      setForm((prevForm) => ({
        ...prevForm,
        selectedCampaignId: campaignId,
        scheduledDate: campaignData.data.actualStartDate
          ? new Date(campaignData.data.actualStartDate).toISOString().substring(0, 10)
          : new Date().toISOString().substring(0, 10),
        location: campaignData.data.destination || "",
      }));
    } catch (error) {
      console.error("Failed to load campaign details:", error);
      setAlertDialog({
        open: true,
        message: "Không thể tải thông tin chiến dịch. Vui lòng thử lại.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      channels: { ...prevForm.channels, [name]: checked },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.selectedCampaignId) {
      setAlertDialog({
        open: true,
        message: "Vui lòng chọn một chiến dịch tiêm chủng.",
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
    const selectedDate = new Date(form.scheduledDate);
    const actualStartDate = new Date(selectedCampaign.actualStartDate);
    const endDate = new Date(selectedCampaign.endDate);
    if (
      selectedDate < actualStartDate.setHours(0, 0, 0, 0) ||
      selectedDate > endDate.setHours(23, 59, 59, 999)
    ) {
      setAlertDialog({
        open: true,
        message: "Ngày tiêm phải nằm trong khoảng từ ngày bắt đầu đến ngày kết thúc.",
        type: "error",
      });
      return;
    }
    if (
      new Date(selectedCampaign.actualStartDate).toISOString().substring(0, 10) <= currentDate &&
      currentDate <= new Date(selectedCampaign.endDate).toISOString().substring(0, 10) &&
      form.scheduledDate === currentDate
    ) {
      setAlertDialog({
        open: true,
        message: "Không thể chọn ngày hiện tại làm ngày tiêm dự kiến.",
        type: "error",
      });
      return;
    }
    try {
      setLoading(true);
      let updatesMade = false;

      // Convert scheduledDate to ISO format for API
      const isoScheduledDate = new Date(form.scheduledDate).toISOString();
      console.log(form.location);
      console.log(selectedCampaign.destination);

      // Check for updates compared to selected campaign
      if (selectedCampaign) {
        // Update actualStartDate if scheduledDate changed
        if (
          isoScheduledDate !== new Date(selectedCampaign.actualStartDate).toISOString()
        ) {
          console.log("a");
          await campaignService.updateCampaign(form.selectedCampaignId, {
            createdBy: nurseID,
            actualStartDate: isoScheduledDate,
          });
          updatesMade = true;
        }
        // Update destination if location changed
        if (form.location !== selectedCampaign.destination) {
          console.log("b");
          await campaignService.updateCampaign(form.selectedCampaignId, {
            createdBy: nurseID,
            destination: form.location,
          });
          updatesMade = true;
        }
      }

      // Activate campaign
      const activationData = {
        targetGradeLevels: selectedCampaign.targetGradeLevels,
        scheduledDate: isoScheduledDate,
        destination: form.location,
        channels: form.channels,
      };
      await campaignService.activeCampaign(form.selectedCampaignId, activationData);

      await loadAnnouncedCampaigns();
      await loadDraftCampaigns();
      setForm({
        selectedCampaignId: "",
        scheduledDate: new Date().toISOString().substring(0, 10),
        location: "",
        channels: { email: false, app: false },
      });
      setSelectedCampaign(null);
      setOpenDialog(false);
      setAlertDialog({
        open: true,
        message: updatesMade
          ? "Chiến dịch đã được cập nhật và kích hoạt thành công!"
          : "Chiến dịch đã được kích hoạt và thông báo đã được gửi thành công!",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to process campaign:", error);
      setAlertDialog({
        open: true,
        message:
          error.response?.data?.message ||
          "Có lỗi xảy ra khi gửi thông báo. Vui lòng thử lại.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCampaign = (notification) => {
    setAlertDialog({
      open: true,
      message: "Bạn có chắc chắn muốn hủy chiến dịch này?",
      type: "confirm",
      onConfirm: async (reason) => {
        try {
          setLoading(true);
          console.log(nurseID);
          await campaignService.updateCampaignStatus(
            notification.campaignId,
            `${nurseID}`,
            "CANCELED",
            reason
          );
          await loadAnnouncedCampaigns();
          await loadDraftCampaigns();
          setAlertDialog({
            open: true,
            message: "Chiến dịch đã được hủy thành công.",
            type: "success",
          });
        } catch (error) {
          console.error("Failed to delete campaign:", error);
          setAlertDialog({
            open: true,
            message: "Có lỗi xảy ra khi xóa chiến dịch. Vui lòng thử lại.",
            type: "error",
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleOpenDetailDialog = (notification) => {
    setSelectedNotification(notification);
    setOpenDetailDialog(true);
  };

  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

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
        Kích hoạt chiến dịch và gửi thông báo tiêm chủng đến phụ huynh học sinh.
      </Alert>
      <Box display="flex" justifyContent="flex-end" gap={2} mb={6}>
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
          startIcon={<RefreshCw size={20} />}
          onClick={handleRefresh}
          disabled={campaignsLoading}
        >
          Làm mới
        </Button>
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
              scheduledDate: new Date().toISOString().substring(0, 10),
              location: "",
              channels: { email: false, app: false },
            });
            setSelectedCampaign(null);
          }}
          disabled={campaignsLoading}
        >
          Tạo thông báo mới
        </Button>
      </Box>
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
                Địa điểm
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>
                Trạng thái
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>
                Thống Kê
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedNotifications.length > 0 ? (
              paginatedNotifications.map((notification) => {
                const isCanceled = notification.status === "CANCELED";
                return (
                  <TableRow
                    key={notification.id}
                    hover
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>{notification.campaignName}</TableCell>
                    <TableCell>{notification.vaccineName}</TableCell>
                    <TableCell>{notification.sentDate}</TableCell>
                    <TableCell>{notification.location}</TableCell>
                    <TableCell>
                      <span
                        style={{
                          color:
                            notification.status === "CANCELED"
                              ? "red"
                              : notification.status === "COMPLETED"
                              ? "green"
                              : notification.status === "IN_PROGRESS"
                              ? "blue"
                              : "orange",
                        }}
                      >
                        {notification.status === "ANNOUNCED" && "Đã công bố"}
                        {notification.status === "IN_PROGRESS" && "Đang thực hiện"}
                        {notification.status === "COMPLETED" && "Hoàn thành"}
                        {notification.status === "CANCELED" && `Đã hủy - ${notification.cancellationReason || ""}`}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Chip
                          label={`Gửi: ${notification.summary.totalConsents}`}
                          size="small"
                          sx={{ bgcolor: "#3b82f6", color: "white" }}
                        />
                        <Chip
                          label={`Đồng ý: ${notification.summary.approved}`}
                          size="small"
                          sx={{ bgcolor: "#10b981", color: "white" }}
                        />
                        <Chip
                          label={`Từ chối: ${notification.summary.declined}`}
                          size="small"
                          sx={{ bgcolor: "#ef4444", color: "white" }}
                        />
                      </Box>
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
                          onClick={() => handleDeleteCampaign(notification)}
                          sx={{ padding: "8px", minWidth: "auto" }}
                          aria-label="Xóa"
                          disabled={loading || isCanceled}
                        >
                          <X
                            size={20}
                            className={isCanceled ? "text-gray-400" : "text-red-600"}
                          />
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
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
              <InputLabel>Chiến Dịch Tiêm Chủng</InputLabel>
              <Select
                name="selectedCampaignId"
                value={form.selectedCampaignId}
                onChange={handleCampaignSelect}
                label="Chiến Dịch Tiêm Chủng"
                disabled={campaignsLoading}
              >
                <MenuItem value="">
                  <em>-- Chọn một chiến dịch --</em>
                </MenuItem>
                {draftCampaigns.map((campaign) => (
                  <MenuItem key={campaign._id} value={campaign._id}>
                    {`${campaign.name} (${campaign.vaccineName})`}
                  </MenuItem>
                ))}
              </Select>
              {campaignsLoading && (
                <Box display="flex" justifyContent="center" mt={1}>
                  <CircularProgress size={20} />
                </Box>
              )}
            </FormControl>
            {selectedCampaign && (
              <Box sx={{ mt: 2, p: 2, bgcolor: "#f9f9f9", borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  <strong>Thông tin chiến dịch:</strong>
                </Typography>
                <Typography variant="body2">
                  <strong>Tên chiến dịch:</strong> {selectedCampaign.name || "N/A"}
                </Typography>
                <Typography variant="body2">
                  <strong>Vaccine:</strong> {selectedCampaign.vaccineName || "N/A"}
                </Typography>
                <Typography variant="body2">
                  <strong>Mũi tiêm thứ:</strong> {selectedCampaign.doseNumber || "N/A"}
                </Typography>
                <Typography variant="body2">
                  <strong>Mô tả:</strong> {selectedCampaign.description || "N/A"}
                </Typography>
                <Typography variant="body2">
                  <strong>Khối lớp mục tiêu:</strong>{" "}
                  {selectedCampaign.targetGradeLevels?.join(", ") || "N/A"}
                </Typography>
                <Typography variant="body2">
                  <strong>Ngày bắt đầu:</strong>{" "}
                  {new Date(selectedCampaign.actualStartDate).toLocaleDateString("vi-VN") || "N/A"}
                </Typography>
                <Typography variant="body2">
                  <strong>Ngày kết thúc:</strong>{" "}
                  {new Date(selectedCampaign.endDate).toLocaleDateString("vi-VN") || "N/A"}
                </Typography>
                <Typography variant="body2">
                  <strong>Đơn vị hợp tác:</strong>{" "}
                  {selectedCampaign.partnerId?.name || "N/A"}
                </Typography>
              </Box>
            )}
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
              inputProps={{
                min: selectedCampaign
                  ? new Date(selectedCampaign.actualStartDate).toISOString().substring(0, 10)
                  : undefined,
                max: selectedCampaign
                  ? new Date(selectedCampaign.endDate).toISOString().substring(0, 10)
                  : undefined,
              }}
            />
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
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            color="inherit"
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            onClick={() => setOpenPreviewDialog(true)}
            variant="outlined"
            color="primary"
            disabled={
              loading ||
              !form.selectedCampaignId ||
              !form.location ||
              (!form.channels.email && !form.channels.app)
            }
          >
            Xem trước
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={
              loading ||
              !form.selectedCampaignId ||
              !form.location ||
              (!form.channels.email && !form.channels.app)
            }
          >
            {loading ? <CircularProgress size={20} /> : "Gửi"}
          </Button>
        </DialogActions>
      </Dialog>
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
                <strong>Tên chiến dịch:</strong> {selectedNotification.campaignName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Vaccine:</strong> {selectedNotification.vaccineName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Ngày gửi:</strong> {selectedNotification.sentDate}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Địa điểm:</strong> {selectedNotification.location}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Khối lớp mục tiêu:</strong>{" "}
                {selectedNotification.targetGradeLevels?.join(", ") || "N/A"}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Kênh gửi:</strong>{" "}
                {Object.keys(selectedNotification.channels)
                  .filter((key) => selectedNotification.channels[key])
                  .map((key) => (key === "email" ? "Email" : "App"))
                  .join(", ")}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Thống kê:</strong>
                <Box display="flex" gap={1} mt={1}>
                  <Typography sx={{ color: "#3b82f6" }}>
                    Gửi: {selectedNotification.summary.totalConsents}
                  </Typography>
                  <Typography sx={{ color: "#10b981" }}>
                    Đồng ý: {selectedNotification.summary.approved}
                  </Typography>
                  <Typography sx={{ color: "#ef4444" }}>
                    Từ chối: {selectedNotification.summary.declined}
                  </Typography>
                </Box>
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
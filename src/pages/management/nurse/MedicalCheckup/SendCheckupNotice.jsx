import React, { useState, useEffect } from "react";
import { Eye, AlertTriangle, CheckCircle, X, RefreshCw, Search } from "lucide-react";
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
  InputAdornment,
} from "@mui/material";
import { Warning } from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import healthCheckCampaignService from "~/libs/api/services/healthCheckCampainService";
import healthCheckConsentService from "~/libs/api/services/healthCheckConsentService";

// Reusable Alert Dialog Component
const AlertDialog = ({ open, onClose, message, type, onConfirm }) => {
  const [cancellationReason, setCancellationReason] = useState("");

  const handleConfirm = () => {
    if (type === "confirm" && !cancellationReason.trim() && message.includes("hủy")) {
      alert("Vui lòng nhập lý do hủy chiến dịch.");
      return;
    }
    onConfirm(cancellationReason);
    setCancellationReason("");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        {type === "success" ? "Thành công" : type === "error" ? "Lỗi" : "Xác nhận"}
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
          {type === "confirm" && message.includes("hủy") && (
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

function SendCheckupNotice() {
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [campaignsLoading, setCampaignsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nurseID, setNurseID] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
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
  const currentDate = new Date().toISOString().substring(0, 10);

  useEffect(() => {
    loadAllCampaigns();
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const result = await userService.getProfile();
      if (result.success) {
        const data = result.data.data;
        const nurseID = localStorage.getItem("nurseID");
        if (nurseID !== data._id) {
          localStorage.setItem("nurseID", data._id);
          setNurseID(data._id);
        } else {
          setNurseID(data._id);
        }
      } else {
        setError(result.message || "Không thể tải thông tin Nurse");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tải hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  const loadAllCampaigns = async () => {
    try {
      setCampaignsLoading(true);
      const response = await healthCheckCampaignService.getListHealthCheckCampaigns({ page: 1, limit: 100 });
      const campaigns = response.data.campaigns || [];
      setAllCampaigns(campaigns);
      setFilteredCampaigns(campaigns);
      
      const notificationsData = campaigns.map((campaign) => {
        let campaignActualStartDate = campaign.startDate
          ? new Date(campaign.startDate).toISOString().substring(0, 10)
          : "N/A";
        const status = campaignActualStartDate === currentDate
          ? "IN_PROGRESS"
          : campaign.status || "DRAFT";
        return {
          id: campaign._id,
          campaignId: campaign._id,
          campaignName: campaign.name || "N/A",
          scheduledDate: campaignActualStartDate,
          location: campaign.location || "Phòng y tế trường",
          content: generateNotificationContentFromCampaign(campaign),
          status,
          cancellationReason: campaign.cancellationReason || "",
        };
      });
      setNotifications(notificationsData);
    } catch (error) {
      setAlertDialog({
        open: true,
        message: "Không thể tải danh sách chiến dịch. Vui lòng thử lại.",
        type: "error",
      });
    } finally {
      setCampaignsLoading(false);
    }
  };

  const handleSearch = () => {
    const filtered = allCampaigns.filter((campaign) => {
      const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter ? campaign.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
    setFilteredCampaigns(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm, statusFilter, allCampaigns]);

  const handleRefresh = async () => {
    try {
      setCampaignsLoading(true);
      await loadAllCampaigns();
      setAlertDialog({
        open: true,
        message: "Dữ liệu đã được làm mới thành công!",
        type: "success",
      });
    } catch (error) {
      setAlertDialog({
        open: true,
        message: "Không thể làm mới dữ liệu. Vui lòng thử lại.",
        type: "error",
      });
    } finally {
      setCampaignsLoading(false);
    }
  };

  const getUniqueClassNames = (assignments) => {
    if (!assignments || !Array.isArray(assignments)) return "N/A";
    const uniqueClasses = [...new Set(assignments.map(a => a.classId?.className).filter(name => name))];
    return uniqueClasses.length > 0 ? uniqueClasses.join(", ") : "N/A";
  };

  const generateNotificationContentFromCampaign = (campaign) => {
    return `
# THÔNG BÁO KHÁM SỨC KHỎE

Kính gửi quý phụ huynh,

Trường học tổ chức khám sức khỏe định kỳ cho học sinh.

## Thông tin chi tiết
- **Tên chiến dịch**: ${campaign.name || "N/A"}
- **Ngày khám dự kiến**: ${new Date(campaign.startDate).toLocaleDateString("vi-VN")}
- **Địa điểm**: ${campaign.location || "Phòng y tế trường"}
- **Đối tượng**: ${getUniqueClassNames(campaign.assignments)}

## Lưu ý
- Đảm bảo học sinh ăn nhẹ trước khi khám.
- Liên hệ: Y tá trường - SĐT: 0123 456 789, Email: nurse@school.edu.vn

Vui lòng phản hồi trước ngày **${new Date(campaign.startDate).toLocaleDateString("vi-VN")}**.

Trân trọng,  
**Ban Y tế Trường học**
    `;
  };

  const handleSubmit = async (campaignId, scheduledDate, location) => {
    if (!campaignId) {
      setAlertDialog({
        open: true,
        message: "Vui lòng chọn một chiến dịch khám sức khỏe.",
        type: "error",
      });
      return;
    }
    if (!location) {
      setAlertDialog({
        open: true,
        message: "Vui lòng nhập địa điểm khám.",
        type: "error",
      });
      return;
    }
    const selectedDate = new Date(scheduledDate);
    const campaign = allCampaigns.find(c => c._id === campaignId);
    if (!campaign) {
      setAlertDialog({
        open: true,
        message: "Chiến dịch không tồn tại.",
        type: "error",
      });
      return;
    }
    const actualStartDate = new Date(campaign.startDate);
    const endDate = new Date(campaign.endDate);
    if (
      selectedDate < actualStartDate.setHours(0, 0, 0, 0) ||
      selectedDate > endDate.setHours(23, 59, 59, 999)
    ) {
      setAlertDialog({
        open: true,
        message: "Ngày khám phải nằm trong khoảng từ ngày bắt đầu đến ngày kết thúc.",
        type: "error",
      });
      return;
    }
    try {
      setLoading(true);
      await healthCheckConsentService.addStudentsToConsent(campaignId);
      await healthCheckCampaignService.updateCampaignStatus(campaignId, {
        status: "ANNOUNCED",
        createdBy: nurseID,
      });

      await loadAllCampaigns();
      setSelectedCampaign(null);
      setOpenDetailDialog(false);
      setAlertDialog({
        open: true,
        message: "Thông báo đã được gửi thành công!",
        type: "success",
      });
    } catch (error) {
      console.error("Error sending notification:", error);
      setAlertDialog({
        open: true,
        message: error.message || "Có lỗi xảy ra khi gửi thông báo. Vui lòng thử lại.",
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
          await healthCheckCampaignService.updateCampaignStatus(
            notification.campaignId,
            { status: "CANCELED", cancellationReason: reason, createdBy: nurseID }
          );
          await loadAllCampaigns();
          setAlertDialog({
            open: true,
            message: "Chiến dịch đã được hủy thành công.",
            type: "success",
          });
        } catch (error) {
          setAlertDialog({
            open: true,
            message: "Có lỗi xảy ra khi hủy chiến dịch. Vui lòng thử lại.",
            type: "error",
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleOpenDetailDialog = async (notification) => {
    try {
      setLoading(true);
      const campaignData = await healthCheckCampaignService.getCampaignDetails(notification.campaignId);
      setSelectedCampaign(campaignData.data);
      setSelectedNotification(notification);
      setOpenDetailDialog(true);
    } catch (error) {
      setAlertDialog({
        open: true,
        message: "Không thể tải thông tin chiến dịch. Vui lòng thử lại.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleActivateCampaign = async (notification) => {
    try {
      setLoading(true);
      const campaignData = await healthCheckCampaignService.getCampaignDetails(notification.campaignId);
      const campaign = campaignData.data;
      
      setSelectedCampaign(campaign);
      setAlertDialog({
        open: true,
        message: `Bạn có chắc chắn muốn gửi thông báo cho chiến dịch "${campaign.name}"?`,
        type: "confirm",
        onConfirm: () => handleSubmit(
          campaign._id,
          campaign.startDate ? new Date(campaign.startDate).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10),
          campaign.location || "Phòng y tế trường"
        ),
      });
    } catch (error) {
      setAlertDialog({
        open: true,
        message: "Không thể tải thông tin chiến dịch để gửi thông báo. Vui lòng thử lại.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const paginatedCampaigns = filteredCampaigns.slice(
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
        Quản Lý Thông Báo Khám Sức Khỏe
      </Typography>
      <Alert
        severity="info"
        icon={<Warning />}
        sx={{ mb: 3, fontWeight: "medium" }}
      >
        Xem và quản lý các thông báo khám sức khỏe đã gửi đến phụ huynh học sinh.
      </Alert>
      <Box display="flex" gap={2} mb={4}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm chiến dịch..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Trạng thái"
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="DRAFT">Nháp</MenuItem>
            <MenuItem value="ANNOUNCED">Đã công bố</MenuItem>
            <MenuItem value="IN_PROGRESS">Đang thực hiện</MenuItem>
            <MenuItem value="COMPLETED">Hoàn thành</MenuItem>
            <MenuItem value="CANCELED">Đã hủy</MenuItem>
          </Select>
        </FormControl>
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
                Ngày khám
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>
                Địa điểm
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>
                Trạng thái
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCampaigns.length > 0 ? (
              paginatedCampaigns.map((campaign) => {
                const notification = notifications.find(n => n.campaignId === campaign._id) || {};
                const isCanceled = campaign.status === "CANCELED";
                const campaignActualStartDate = campaign.startDate
                  ? new Date(campaign.startDate).toISOString().substring(0, 10)
                  : "N/A";
                return (
                  <TableRow
                    key={campaign._id}
                    hover
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>{campaign.name || "N/A"}</TableCell>
                    <TableCell>{campaignActualStartDate}</TableCell>
                    <TableCell>{campaign.location || "Phòng y tế trường"}</TableCell>
                    <TableCell>
                      <span
                        style={{
                          color:
                            campaign.status === "CANCELED"
                              ? "red"
                              : campaign.status === "COMPLETED"
                              ? "green"
                              : campaign.status === "IN_PROGRESS"
                              ? "blue"
                              : campaign.status === "ANNOUNCED"
                              ? "orange"
                              : "gray",
                        }}
                      >
                        {campaign.status === "DRAFT" && "Nháp"}
                        {campaign.status === "ANNOUNCED" && "Đã công bố"}
                        {campaign.status === "IN_PROGRESS" && "Đang thực hiện"}
                        {campaign.status === "COMPLETED" && "Hoàn thành"}
                        {campaign.status === "CANCELED" && `Đã hủy - ${notification.cancellationReason || ""}`}
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
                          onClick={() => handleDeleteCampaign(notification)}
                          sx={{ padding: "8px", minWidth: "auto" }}
                          aria-label="Hủy"
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
                <TableCell colSpan={5} align="center">
                  <Box textAlign="center" py={4}>
                    <Typography color="textSecondary">
                      Chưa có chiến dịch nào.
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
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Chi tiết Chiến Dịch</DialogTitle>
        <DialogContent>
          {selectedNotification && selectedCampaign && (
            <Box>
              <Typography variant="body1" gutterBottom>
                <strong>Tên chiến dịch:</strong> {selectedNotification.campaignName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Ngày khám:</strong> {selectedNotification.scheduledDate}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Địa điểm:</strong> {selectedNotification.location}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Lớp học:</strong>{" "}
                {getUniqueClassNames(selectedCampaign.assignments)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Y tá phụ trách:</strong>{" "}
                {selectedCampaign.participatingStaffs?.map(s => s.username).join(", ") || "N/A"}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Trạng thái:</strong>{" "}
                {selectedCampaign.status === "DRAFT" && "Nháp"}
                {selectedCampaign.status === "ANNOUNCED" && "Đã công bố"}
                {selectedCampaign.status === "IN_PROGRESS" && "Đang thực hiện"}
                {selectedCampaign.status === "COMPLETED" && "Hoàn thành"}
                {selectedCampaign.status === "CANCELED" && `Đã hủy - ${selectedNotification.cancellationReason || ""}`}
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
          {selectedCampaign?.status === "DRAFT" && (
            <Button
              onClick={() => handleActivateCampaign(selectedNotification)}
              variant="contained"
              color="primary"
              disabled={loading}
            >
              Gửi thông báo
            </Button>
          )}
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

export default SendCheckupNotice;
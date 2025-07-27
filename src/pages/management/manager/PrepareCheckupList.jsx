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
  CircularProgress,
  Pagination,
  Container,
  Alert,
  Fade,
  TextField,
  Chip,
} from "@mui/material";
import { Download, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { utils, writeFile } from "xlsx";
import healthCheckConsentService from "~/libs/api/services/healthCheckConsentService";
import { Warning } from "@mui/icons-material";
import healthCheckCampaignService from "~/libs/api/services/healthCheckCampainService";

// Reusable Alert Dialog Component
const AlertDialog = ({ open, onClose, message, type }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{type === "success" ? "Thành công" : "Lỗi"}</DialogTitle>
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
        <Button onClick={onClose} color="primary" variant="contained">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Student Details Dialog Component
const StudentDetailsDialog = ({ open, onClose, student }) => {
  if (!student) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold" }}>Chi tiết học sinh</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Thông tin cơ bản
          </Typography>
          <Box display="grid" gap={2} gridTemplateColumns="1fr 1fr" mb={3}>
            <Box>
              <Typography variant="body2" color="textSecondary">
                Họ và tên:
              </Typography>
              <Typography>{student.studentName}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary">
                Lớp:
              </Typography>
              <Typography>{student.className}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary">
                Ngày sinh:
              </Typography>
              <Typography>{student.dateOfBirth}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary">
                Phụ huynh:
              </Typography>
              <Typography>{student.parentName}</Typography>
            </Box>
          </Box>

          <Typography variant="h6" gutterBottom>
            Thông tin chiến dịch
          </Typography>
          <Box display="grid" gap={2} gridTemplateColumns="1fr 1fr" mb={3}>
            <Box>
              <Typography variant="body2" color="textSecondary">
                Y tá:
              </Typography>
              <Typography>{student.nurseName}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary">
                Trạng thái:
              </Typography>
              <Typography>{student.status}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary">
                Lý do từ chối:
              </Typography>
              <Typography>{student.reasonForDeclining}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary">
                Ngày xác nhận:
              </Typography>
              <Typography>{student.confirmedAt}</Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

function PrepareHealthCheckList() {
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [consentsList, setConsentsList] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [classes, setClasses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openExportDialog, setOpenExportDialog] = useState(false);
  const [openProceedDialog, setOpenProceedDialog] = useState(false);
  const [openConsentCheckDialog, setOpenConsentCheckDialog] = useState(false);
  const [consentStatus, setConsentStatus] = useState(null);
  const [alertDialog, setAlertDialog] = useState({
    open: false,
    message: "",
    type: "error",
  });
  const [openStudentDetails, setOpenStudentDetails] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [campaignDetails, setCampaignDetails] = useState(null);
  const itemsPerPage = 10;

  // Load consents on mount
  useEffect(() => {
    loadConsents();
  }, []);

  // Load all consents and extract campaigns
  const loadConsents = async () => {
    try {
      setLoading(true);
      const response = await healthCheckConsentService.getAllConsents();
      if (response.success) {
        const consents = response.data || [];
        // Get campaigns with status "ANNOUNCED"
        const campaignResponse =
          await healthCheckCampaignService.getCampaignsByStatus("ANNOUNCED");
        if (campaignResponse.success) {
          const announcedCampaigns = campaignResponse.data.campaigns
            .map((campaign) => ({
              _id: campaign._id,
              name: campaign.name,
              schoolYear: campaign.schoolYear,
              startDate: campaign.startDate,
              endDate: campaign.endDate,
            }))
            .sort((a, b) => a.name.localeCompare(b.name, "vi"));
          setCampaigns(announcedCampaigns);
          // Filter consents to only include those from ANNOUNCED campaigns
          setConsentsList(
            consents.filter((consent) =>
              announcedCampaigns.some((c) => c._id === consent.campaignId._id)
            )
          );
        } else {
          throw new Error(
            campaignResponse.message || "Không thể tải danh sách chiến dịch."
          );
        }
      } else {
        throw new Error(response.message || "Không thể tải danh sách đồng ý.");
      }
    } catch (error) {
      console.error("Failed to load consents:", error);
      setAlertDialog({
        open: true,
        message: "Không thể tải danh sách đồng ý. Vui lòng thử lại.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle campaign selection
  const handleCampaignChange = async (e) => {
    const campaignId = e.target.value;
    setSelectedCampaign(campaignId);
    setSelectedClass("");
    setSearchTerm("");
    setCurrentPage(1);
    setClasses([]);
    setCampaignDetails(null);
    if (campaignId) {
      await fetchCampaignDetails(campaignId);
      await fetchConsentsList(campaignId, "", "");
    } else {
      setConsentsList([]);
    }
  };

  // Handle class selection
  const handleClassChange = async (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    setCurrentPage(1);
    await fetchConsentsList(selectedCampaign, classId, searchTerm);
  };

  // Handle search input
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setCurrentPage(1);
    fetchConsentsList(selectedCampaign, selectedClass, term);
  };

  // Fetch campaign details
  const fetchCampaignDetails = async (campaignId) => {
    try {
      setLoading(true);
      const response = await healthCheckCampaignService.getCampaignDetails(
        campaignId
      );
      if (response.success) {
        setCampaignDetails(response.data);
      } else {
        throw new Error(
          response.message || "Không thể tải thông tin chiến dịch."
        );
      }
    } catch (error) {
      console.error("Failed to fetch campaign details:", error);
      setAlertDialog({
        open: true,
        message: "Không thể tải thông tin chiến dịch. Vui lòng thử lại.",
        type: "error",
      });
      setCampaignDetails(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch consents list from API
  const fetchConsentsList = async (campaignId, classId, search) => {
    if (!campaignId) {
      setConsentsList([]);
      return;
    }
    try {
      setLoading(true);
      const response = await healthCheckConsentService.getConsentsByCampaignId(
        campaignId
      );
      if (!response.success) {
        throw new Error(response.message || "Không thể tải danh sách đồng ý.");
      }

      // Extract unique classes for class filter
      const uniqueClasses = [
        ...new Map(
          response.data.map((item) => [
            item.classId._id,
            {
              _id: item.classId._id,
              className: item.classId.className,
            },
          ])
        ).values(),
      ].sort((a, b) => a.className.localeCompare(b.className, "vi"));
      setClasses(uniqueClasses);

      let filteredConsents = response.data.filter((consent) => {
        const matchesClass = classId ? consent.classId._id === classId : true;
        const matchesSearch = search
          ? consent.studentId.fullName
              .toLowerCase()
              .includes(search.toLowerCase())
          : true;
        return matchesClass && matchesSearch;
      });

      const mappedConsents = filteredConsents
        .map((consent, index) => ({
          _id: consent._id,
          stt: index + 1,
          studentName: consent.studentId.fullName,
          className: consent.classId.className,
          dateOfBirth: new Date(
            consent.studentId.dateOfBirth
          ).toLocaleDateString("vi-VN"),
          parentName: consent.parentId?.username,
          nurseName: consent.nurseId.username,
          status: consent.status,
          reasonForDeclining: consent.reasonForDeclining || "-",
          confirmedAt: consent.confirmedAt
            ? new Date(consent.confirmedAt).toLocaleDateString("vi-VN")
            : "-",
        }))
        .sort((a, b) => {
          const classCompare = a.className.localeCompare(b.className, "vi");
          if (classCompare !== 0) return classCompare;
          return a.studentName.localeCompare(b.studentName, "vi");
        });

      setConsentsList(mappedConsents);
    } catch (error) {
      console.error("Failed to fetch consents:", error);
      setAlertDialog({
        open: true,
        message: "Không thể tải danh sách đồng ý. Vui lòng thử lại.",
        type: "error",
      });
      setConsentsList([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    if (!selectedCampaign) {
      setAlertDialog({
        open: true,
        message: "Vui lòng chọn chiến dịch trước khi làm mới danh sách.",
        type: "error",
      });
      return;
    }
    try {
      setLoading(true);
      await fetchCampaignDetails(selectedCampaign);
      await fetchConsentsList(selectedCampaign, selectedClass, searchTerm);
      setAlertDialog({
        open: true,
        message: "Danh sách đã được làm mới thành công!",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to refresh consents list:", error);
      setAlertDialog({
        open: true,
        message: "Không thể làm mới danh sách đồng ý. Vui lòng thử lại.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Check consent status
  const checkConsentStatus = () => {
    if (!selectedCampaign) {
      setAlertDialog({
        open: true,
        message: "Vui lòng chọn chiến dịch để kiểm tra trạng thái.",
        type: "error",
      });
      return;
    }

    const allApproved = consentsList.every(
      (consent) => consent.status === "APPROVED"
    );
    setConsentStatus(allApproved);
    setOpenConsentCheckDialog(true);
  };

  // Handle Excel export
  const handleExportExcel = async () => {
    setLoading(true);
    try {
      const classGroups = {};
      consentsList.forEach((consent) => {
        const className = consent.className;
        if (!classGroups[className]) {
          classGroups[className] = [];
        }
        classGroups[className].push(consent);
      });

      const workbook = utils.book_new();
      Object.keys(classGroups).forEach((className, index) => {
        const classData = classGroups[className];
        const worksheet = utils.json_to_sheet(classData, {
          header: [
            "stt",
            "studentName",
            "className",
            "dateOfBirth",
            "parentName",
            "nurseName",
            "status",
            "reasonForDeclining",
            "confirmedAt",
          ],
          skipHeader: false,
        });

        worksheet["!cols"] = [
          { wch: 5 },
          { wch: 20 },
          { wch: 10 },
          { wch: 15 },
          { wch: 20 },
          { wch: 20 },
          { wch: 15 },
          { wch: 30 },
          { wch: 15 },
        ];
        worksheet["A1"].v = "STT";
        worksheet["B1"].v = "Họ và Tên Học Sinh";
        worksheet["C1"].v = "Lớp";
        worksheet["D1"].v = "Ngày Sinh";
        worksheet["E1"].v = "Tên Phụ Huynh";
        worksheet["F1"].v = "Tên Y Tá";
        worksheet["G1"].v = "Trạng Thái";
        worksheet["H1"].v = "Lý Do Từ Chối";
        worksheet["I1"].v = "Ngày Xác Nhận";

        const safeClassName = className
          .replace(/[\\\/:*?"<>|]/g, "_")
          .substring(0, 31);
        utils.book_append_sheet(
          workbook,
          worksheet,
          safeClassName || `Lớp ${index + 1}`
        );
      });
      const fileName = `Danh_sach_dong_y_kham_suc_khoe_${selectedCampaign}.xlsx`;
      writeFile(workbook, fileName);

      setAlertDialog({
        open: true,
        message: "Danh sách đã được xuất thành công!",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to export Excel:", error);
      setAlertDialog({
        open: true,
        message: "Không thể xuất danh sách. Vui lòng thử lại.",
        type: "error",
      });
    } finally {
      setLoading(false);
      setOpenExportDialog(false);
    }
  };

  // Handle proceed health check (status update)
  const handleProceedHealthCheck = async () => {
    setLoading(true);
    try {
      const statusData = { status: "IN_PROGRESS" };
      await healthCheckCampaignService.updateCampaignStatus(
        selectedCampaign,
        statusData
      );
      setAlertDialog({
        open: true,
        message: "Chiến dịch đã chuyển sang trạng thái 'Đang thực hiện'.",
        type: "success",
      });
      await loadConsents();
      setSelectedCampaign("");
      setSelectedClass("");
      setSearchTerm("");
      setConsentsList([]);
      setClasses([]);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to update campaign status:", error);
      setAlertDialog({
        open: true,
        message: "Không thể cập nhật trạng thái chiến dịch. Vui lòng thử lại.",
        type: "error",
      });
    } finally {
      setLoading(false);
      setOpenProceedDialog(false);
    }
  };

  // Handle pagination
  // Lọc consentsList: chỉ lấy học sinh có parentName (tức là có parentId) và status là PENDING
  const filteredConsentsList = consentsList.filter(
    (consent) => consent.parentName
  );
  const totalPages = Math.ceil(filteredConsentsList.length / itemsPerPage);
  const paginatedList = filteredConsentsList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Handle closing dialogs
  const handleCloseExportDialog = () => {
    setOpenExportDialog(false);
  };

  const handleCloseProceedDialog = () => {
    setOpenProceedDialog(false);
  };

  const handleCloseConsentCheckDialog = () => {
    setOpenConsentCheckDialog(false);
  };

  const handleCloseAlertDialog = () => {
    setAlertDialog((prev) => ({ ...prev, open: false }));
  };

  const handleCloseStudentDetails = () => {
    setOpenStudentDetails(false);
    setSelectedStudent(null);
  };

  // Get selected campaign details
  const selectedCampaignDetails = campaignDetails;

  // Handle row click to show student details
  const handleRowClick = (student) => {
    setSelectedStudent(student);
    setOpenStudentDetails(true);
  };
  const getStatusChip = (status) => {
    let color, label;

    switch (status) {
      case "PENDING":
        color = "info";
        label = "Chờ xử lý";
        break;
      case "APPROVED":
        color = "success";
        label = "Đã chấp thuận";
        break;
      case "DECLINED":
        color = "error";
        label = "Đã từ chối";
        break;
      case "COMPLETED":
        color = "success";
        label = "Hoàn thành";
        break;
      case "REVOKED":
        color = "default";
        label = "Đã thu hồi";
        break;
      case "UNDER_OBSERVATION":
        color = "warning";
        label = "Đang theo dõi";
        break;
      case "ADVERSE_REACTION":
        color = "error";
        label = "Phản ứng bất lợi";
        break;
      default:
        color = "default";
        label = status;
    }
    return (
      <Chip
        label={label}
        color={color}
        size="small"
        sx={{
          fontWeight: "medium",
          minWidth: "100px",
          "& .MuiChip-label": {
            color: color === "default" ? "text.secondary" : "white",
          },
        }}
      />
    );
  };

  return (
    <Container
      maxWidth="xl"
      sx={{ py: 4, bgcolor: "#f5f5f5", minHeight: "100vh" }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: "bold",
          color: "#1e3a8a",
          fontSize: { xs: "1.8rem", md: "2.2rem" },
        }}
      >
        Chuẩn Bị Danh Sách Khám Sức Khỏe
      </Typography>
      <Alert
        severity="info"
        icon={<Warning />}
        sx={{ mb: 4, fontWeight: "medium", borderRadius: 2 }}
      >
        Vui lòng chọn chiến dịch để hiển thị danh sách.
      </Alert>

      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        gap={2}
        mb={4}
        sx={{ alignItems: { xs: "stretch", sm: "center" } }}
      >
        <FormControl fullWidth sx={{ minWidth: { sm: 200 } }}>
          <InputLabel>Chọn chiến dịch</InputLabel>
          <Select
            value={selectedCampaign}
            onChange={handleCampaignChange}
            label="Chọn chiến dịch"
            disabled={loading}
            sx={{ borderRadius: 1 }}
          >
            <MenuItem value="">Chọn chiến dịch</MenuItem>
            {campaigns.map((campaign) => (
              <MenuItem key={campaign._id} value={campaign._id}>
                {campaign.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          fullWidth
          sx={{ minWidth: { sm: 200 } }}
          disabled={!selectedCampaign || loading}
        >
          <InputLabel>Chọn lớp</InputLabel>
          <Select
            value={selectedClass}
            onChange={handleClassChange}
            label="Chọn lớp"
            sx={{ borderRadius: 1 }}
          >
            <MenuItem value="">Tất cả các lớp</MenuItem>
            {classes.map((cls) => (
              <MenuItem key={cls._id} value={cls._id}>
                {cls.className}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Tìm kiếm học sinh"
          value={searchTerm}
          onChange={handleSearchChange}
          disabled={!selectedCampaign || loading}
          sx={{ minWidth: { sm: 200 }, borderRadius: 1 }}
        />
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#2563eb",
            "&:hover": { backgroundColor: "#1d4ed8" },
            color: "white",
            fontWeight: "bold",
            borderRadius: 1,
            px: 3,
            py: 1.5,
            textTransform: "none",
            minWidth: { xs: "auto", sm: 120 },
          }}
          startIcon={<RefreshCw size={20} />}
          onClick={handleRefresh}
          disabled={loading}
        >
          Làm mới
        </Button>
      </Box>

      {/* Campaign Details Section */}
      <Fade in={!!selectedCampaign} timeout={500}>
        <Box>
          {selectedCampaignDetails && (
            <Paper
              elevation={2}
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 2,
                bgcolor: "#f9fafb",
                border: "1px solid #e5e7eb",
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: "bold", color: "#1e3a8a" }}
              >
                Thông tin chiến dịch
              </Typography>
              <Box
                display="grid"
                gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
                gap={2}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "medium", color: "#4b5563" }}
                  >
                    Tên chiến dịch:
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#111827" }}>
                    {selectedCampaignDetails.name || "Chưa xác định"}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "medium", color: "#4b5563" }}
                  >
                    Năm học:
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#111827" }}>
                    {selectedCampaignDetails.schoolYear || "Chưa xác định"}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "medium", color: "#4b5563" }}
                  >
                    Ngày bắt đầu:
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#111827" }}>
                    {selectedCampaignDetails.startDate
                      ? new Date(
                          selectedCampaignDetails.startDate
                        ).toLocaleDateString("vi-VN")
                      : "Chưa xác định"}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "medium", color: "#4b5563" }}
                  >
                    Ngày kết thúc:
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#111827" }}>
                    {selectedCampaignDetails.endDate
                      ? new Date(
                          selectedCampaignDetails.endDate
                        ).toLocaleDateString("vi-VN")
                      : "Chưa xác định"}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          )}
        </Box>
      </Fade>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Fade in={!!selectedCampaign} timeout={500}>
          <Box>
            {!selectedCampaign && (
              <Alert
                severity="info"
                icon={<Warning />}
                sx={{ mb: 4, fontWeight: "medium", borderRadius: 2 }}
              >
                Vui lòng chọn chiến dịch để hiển thị danh sách.
              </Alert>
            )}
            {consentsList.length > 0 && (
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: "bold",
                  color: "#1a202c",
                  fontSize: "1.1rem",
                }}
              >
                Tổng số học sinh: {consentsList.length}
              </Typography>
            )}

            <TableContainer
              component={Paper}
              sx={{
                boxShadow: "0 4px 6px -2px rgba(0, 0, 0, 0.1)",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
                    <TableCell
                      sx={{ fontWeight: "bold", color: "#1a202c", py: 2 }}
                    >
                      STT
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", color: "#1a202c", py: 2 }}
                    >
                      Họ và Tên
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", color: "#1a202c", py: 2 }}
                    >
                      Lớp
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", color: "#1a202c", py: 2 }}
                    >
                      Ngày Sinh
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", color: "#1a202c", py: 2 }}
                    >
                      Phụ Huynh
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", color: "#1a202c", py: 2 }}
                    >
                      Y Tá
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", color: "#1a202c", py: 2 }}
                    >
                      Trạng Thái
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", color: "#1a202c", py: 2 }}
                    >
                      Lý Do Từ Chối
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", color: "#1a202c", py: 2 }}
                    >
                      Ngày Xác Nhận
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedList.length > 0 ? (
                    paginatedList.map((consent, index) => (
                      <TableRow
                        key={consent._id}
                        sx={{
                          backgroundColor:
                            index % 2 === 0 ? "#ffffff" : "#f9fafb",
                          "&:hover": {
                            backgroundColor: "#f1f5f9",
                            cursor: "pointer",
                          },
                        }}
                        onClick={() => handleRowClick(consent)}
                      >
                        <TableCell>{consent.stt}</TableCell>
                        <TableCell>{consent.studentName}</TableCell>
                        <TableCell>{consent.className}</TableCell>
                        <TableCell>{consent.dateOfBirth}</TableCell>
                        <TableCell>{consent.parentName}</TableCell>
                        <TableCell>{consent.nurseName}</TableCell>
                        <TableCell>{getStatusChip(consent.status)}</TableCell>
                        <TableCell>{consent.reasonForDeclining}</TableCell>
                        <TableCell>{consent.confirmedAt}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <Typography color="textSecondary" py={4}>
                          Chưa có danh sách đồng ý hoặc chưa chọn chiến dịch.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {consentsList.length > 0 && (
              <>
                <Box display="flex" justifyContent="center" mt={4}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    sx={{
                      "& .MuiPaginationItem-root": {
                        fontSize: "1rem",
                        fontWeight: "medium",
                      },
                    }}
                  />
                </Box>
                <Box mt={3}>
                  <Alert
                    severity="warning"
                    icon={<Warning />}
                    sx={{ mb: 2, fontWeight: "medium", borderRadius: 2 }}
                  >
                    Hành động "Tiến hành khám sức khỏe" sẽ chuyển chiến dịch
                    sang trạng thái 'Đang thực hiện'.
                  </Alert>
                  <Box display="flex" justifyContent="flex-end" gap={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<CheckCircle size={20} />}
                      onClick={checkConsentStatus}
                      disabled={loading}
                      sx={{
                        backgroundColor: "#d97706",
                        "&:hover": { backgroundColor: "#b45309" },
                        color: "white",
                        fontWeight: "bold",
                        borderRadius: 1,
                        px: 4,
                        py: 1.5,
                        textTransform: "none",
                      }}
                    >
                      Kiểm tra đồng ý
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Download size={20} />}
                      onClick={() => setOpenExportDialog(true)}
                      disabled={loading}
                      sx={{
                        backgroundColor: "#2563eb",
                        "&:hover": { backgroundColor: "#1d4ed8" },
                        color: "white",
                        fontWeight: "bold",
                        borderRadius: 1,
                        px: 4,
                        py: 1.5,
                        textTransform: "none",
                      }}
                    >
                      Xuất Excel
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<CheckCircle size={20} />}
                      onClick={() => setOpenProceedDialog(true)}
                      disabled={loading}
                      sx={{
                        backgroundColor: "#16a34a",
                        "&:hover": { backgroundColor: "#15803d" },
                        color: "white",
                        fontWeight: "bold",
                        borderRadius: 1,
                        px: 4,
                        py: 1.5,
                        textTransform: "none",
                      }}
                    >
                      Tiến hành khám sức khỏe
                    </Button>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </Fade>
      )}

      {/* Export Confirmation Dialog */}
      <Dialog
        open={openExportDialog}
        onClose={handleCloseExportDialog}
        maxWidth="xs"
        fullWidth
        sx={{ "& .MuiDialog-paper": { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Xác nhận xuất danh sách
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có muốn xuất danh sách đồng ý khám sức khỏe ra file Excel?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseExportDialog}
            color="inherit"
            sx={{ textTransform: "none" }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleExportExcel}
            color="primary"
            variant="contained"
            sx={{ textTransform: "none", borderRadius: 1 }}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Proceed Health Check Confirmation Dialog */}
      <Dialog
        open={openProceedDialog}
        onClose={handleCloseProceedDialog}
        maxWidth="xs"
        fullWidth
        sx={{ "& .MuiDialog-paper": { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Xác nhận tiến hành khám sức khỏe
        </DialogTitle>
        <DialogContent>
          <Typography>
            Hành động này sẽ chuyển chiến dịch sang trạng thái 'Đang thực hiện'.
            Bạn có muốn tiếp tục?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseProceedDialog}
            color="inherit"
            sx={{ textTransform: "none" }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleProceedHealthCheck}
            color="primary"
            variant="contained"
            sx={{ textTransform: "none", borderRadius: 1 }}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Consent Status Check Dialog */}
      <Dialog
        open={openConsentCheckDialog}
        onClose={handleCloseConsentCheckDialog}
        maxWidth="xs"
        fullWidth
        sx={{ "& .MuiDialog-paper": { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Kết quả kiểm tra đồng ý
        </DialogTitle>
        <DialogContent>
          <Box display="flex" alignItems="center" gap={2}>
            {consentStatus ? (
              <CheckCircle size={24} className="text-green-500" />
            ) : (
              <AlertTriangle size={24} className="text-red-500" />
            )}
            <Typography>
              {consentStatus
                ? "Tất cả học sinh trong danh sách đã được phụ huynh đồng ý."
                : "Một số học sinh chưa được phụ huynh đồng ý."}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseConsentCheckDialog}
            color="primary"
            variant="contained"
            sx={{ textTransform: "none", borderRadius: 1 }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Student Details Dialog */}
      <StudentDetailsDialog
        open={openStudentDetails}
        onClose={handleCloseStudentDetails}
        student={selectedStudent}
      />

      {/* Alert Dialog */}
      <AlertDialog
        open={alertDialog.open}
        onClose={handleCloseAlertDialog}
        message={alertDialog.message}
        type={alertDialog.type}
      />
    </Container>
  );
}

export default PrepareHealthCheckList;

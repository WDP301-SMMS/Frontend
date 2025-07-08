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
} from "@mui/material";
import { Download, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { utils, writeFile } from "xlsx";
import campaignService from "~/libs/api/services/campaignService";
import { Warning } from "@mui/icons-material";
import { userService } from "~/libs/api";

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

function PrepareVaccinationList() {
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [vaccinationList, setVaccinationList] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [classes, setClasses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openExportDialog, setOpenExportDialog] = useState(false);
  const [openProceedDialog, setOpenProceedDialog] = useState(false);
  const [nurseID, setNurseID] = useState([]);
  const [error, setError] = useState(null);
  const [alertDialog, setAlertDialog] = useState({
    open: false,
    message: "",
    type: "error",
  });
  const itemsPerPage = 10;

  // Load campaigns on mount
  useEffect(() => {
    loadCampaigns();
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
      } else {
        setError(result.message || "Không thể tải thông tin Nurse");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tải hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  // Load announced campaigns
  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const response = await campaignService.getAnnouncedCampaigns(1, 100);
      if (response.success) {
        setCampaigns(response.data || []);
      } else {
        throw new Error(
          response.message || "Không thể tải danh sách chiến dịch."
        );
      }
    } catch (error) {
      console.error("Failed to load campaigns:", error);
      setAlertDialog({
        open: true,
        message: "Không thể tải danh sách chiến dịch. Vui lòng thử lại.",
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
    setSelectedClass(""); // Reset class filter
    setCurrentPage(1); // Reset to first page
    setClasses([]); // Reset classes
    if (campaignId) {
      await fetchVaccinationList(campaignId, "");
    } else {
      setVaccinationList([]);
    }
  };

  // Handle class selection
  const handleClassChange = async (e) => {
    const className = e.target.value;
    setSelectedClass(className);
    setCurrentPage(1); // Reset to first page
    await fetchVaccinationList(selectedCampaign, className);
  };

  // Fetch vaccination list from API
  const fetchVaccinationList = async (campaignId, className) => {
    if (!campaignId) {
      setVaccinationList([]);
      return;
    }
    try {
      setLoading(true);
      const campaign = campaigns.find((c) => c._id === campaignId);
      if (!campaign) {
        setVaccinationList([]);
        setAlertDialog({
          open: true,
          message: "Không tìm thấy chiến dịch.",
          type: "error",
        });
        return;
      }

      const response = await campaignService.getListRegistrants(campaignId);
      if (!response.success) {
        throw new Error(response.message || "Không thể tải danh sách đăng ký.");
      }

      // Extract unique class names for class filter
      const uniqueClasses = [
        ...new Set(response.data.map((r) => r.className)),
      ].sort();
      setClasses(uniqueClasses);

      let filteredRegistrants = response.data.filter((registrant) => {
        return className ? registrant.className === className : true;
      });

      const mappedStudents = filteredRegistrants
        .map((registrant, index) => {
          const doseNumber = 1; // Adjust if API provides doseNumber
          return {
            stt: index + 1,
            full_name: registrant.fullName,
            class_name: registrant.className,
            date_of_birth: registrant.dateOfBirth,
            vaccine_name: campaign.vaccineName,
            dose_number: doseNumber,
          };
        })
        .sort((a, b) => {
          const classCompare = a.class_name.localeCompare(b.class_name, "vi");
          if (classCompare !== 0) return classCompare;
          return a.full_name.localeCompare(b.full_name, "vi");
        });

      setVaccinationList(mappedStudents);
    } catch (error) {
      console.error("Failed to fetch registrants:", error);
      setAlertDialog({
        open: true,
        message: "Không thể tải danh sách học sinh. Vui lòng thử lại.",
        type: "error",
      });
      setVaccinationList([]);
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
      await fetchVaccinationList(selectedCampaign, selectedClass);
      setAlertDialog({
        open: true,
        message: "Danh sách đã được làm mới thành công!",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to refresh vaccination list:", error);
      setAlertDialog({
        open: true,
        message: "Không thể làm mới danh sách học sinh. Vui lòng thử lại.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Excel export
  const handleExportExcel = async () => {
    setLoading(true);
    try {
      // Group students by class for separate sheets
      const classGroups = {};
      vaccinationList.forEach((student) => {
        const className = student.class_name;
        if (!classGroups[className]) {
          classGroups[className] = [];
        }
        const formattedStudent = {
          ...student,
          date_of_birth: new Date(student.date_of_birth).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
        };
        classGroups[className].push(formattedStudent);
      });

      const workbook = utils.book_new();
      Object.keys(classGroups).forEach((className, index) => {
        const classData = classGroups[className];
        const worksheet = utils.json_to_sheet(classData, {
          header: [
            "stt",
            "full_name",
            "class_name",
            "date_of_birth",
            "vaccine_name",
            "dose_number",
          ],
          skipHeader: false,
        });

        // Set column headers
        worksheet["!cols"] = [
          { wch: 5 }, // STT
          { wch: 20 }, // Full Name
          { wch: 10 }, // Class
          { wch: 15 }, // Date of Birth
          { wch: 15 }, // Vaccine Name
          { wch: 10 }, // Dose Number
        ];
        worksheet["A1"].v = "STT";
        worksheet["B1"].v = "Họ và Tên";
        worksheet["C1"].v = "Lớp";
        worksheet["D1"].v = "Ngày Sinh";
        worksheet["E1"].v = "Tên Vaccine";
        worksheet["F1"].v = "Mũi Số";

        const safeClassName = className
          .replace(/[\\\/:*?"<>|]/g, "_")
          .substring(0, 31);
        utils.book_append_sheet(
          workbook,
          worksheet,
          safeClassName || `Lớp ${index + 1}`
        );
      });
      const fileName = `Danh_sach_tiem_chung_${selectedCampaign}.xlsx`;
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

  // Handle proceed vaccination (status update)
  const handleProceedVaccination = async () => {
    setLoading(true);
    try {
      const statusResponse = await campaignService.updateCampaignStatus(
        selectedCampaign,
        `${nurseID}`,
        "IN_PROGRESS"
      );
      if (!statusResponse.success) {
        throw new Error(
          statusResponse.message || "Không thể cập nhật trạng thái chiến dịch."
        );
      }

      await loadCampaigns();
      setSelectedCampaign("");
      setSelectedClass("");
      setVaccinationList([]);
      setClasses([]);
      setCurrentPage(1);

      setAlertDialog({
        open: true,
        message: "Chiến dịch đã chuyển sang trạng thái 'Đang thực hiện'.",
        type: "success",
      });
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
  const totalPages = Math.ceil(vaccinationList.length / itemsPerPage);
  const paginatedList = vaccinationList.slice(
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

  const handleCloseAlertDialog = () => {
    setAlertDialog((prev) => ({ ...prev, open: false }));
  };

  // Get selected campaign details
  const selectedCampaignDetails = campaigns.find(
    (c) => c._id === selectedCampaign
  );

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
        Chuẩn Bị Danh Sách Tiêm Chủng
      </Typography>
      <Alert
        severity="info"
        icon={<Warning />}
        sx={{ mb: 4, fontWeight: "medium", borderRadius: 2 }}
      >
        Chuẩn bị danh sách tiêm chủng cho chiến dịch tiêm vaccine. Vui lòng chọn
        chiến dịch và lớp học để xem danh sách học sinh.
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
              <MenuItem key={cls} value={cls}>
                {cls}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
                    Tên vaccine:
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#111827" }}>
                    {selectedCampaignDetails.vaccineName || "Chưa xác định"}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "medium", color: "#4b5563" }}
                  >
                    Ngày tiêm:
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#111827" }}>
                    {selectedCampaignDetails.actualStartDate
                      ? new Date(
                          selectedCampaignDetails.actualStartDate
                        ).toLocaleDateString("vi-VN")
                      : "Chưa xác định"}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "medium", color: "#4b5563" }}
                  >
                    Địa điểm:
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#111827" }}>
                    {selectedCampaignDetails.destination || "Chưa xác định"}
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
        <Fade in timeout={500}>
          <Box>
            {vaccinationList.length > 0 && (
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: "bold",
                  color: "#1a202c",
                  fontSize: "1.1rem",
                }}
              >
                Tổng số học sinh: {vaccinationList.length}
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
                      Tên Vaccine
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", color: "#1a202c", py: 2 }}
                    >
                      Mũi Số
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedList.length > 0 ? (
                    paginatedList.map((student, index) => (
                      <TableRow
                        key={student.stt}
                        sx={{
                          backgroundColor:
                            index % 2 === 0 ? "#ffffff" : "#f9fafb",
                          "&:hover": { backgroundColor: "#f1f5f9" },
                        }}
                      >
                        <TableCell>{student.stt}</TableCell>
                        <TableCell>{student.full_name}</TableCell>
                        <TableCell>{student.class_name}</TableCell>
                        <TableCell>
                          {new Date(student.date_of_birth).toLocaleDateString(
                            "vi-VN"
                          )}
                        </TableCell>
                        <TableCell>{student.vaccine_name}</TableCell>
                        <TableCell>{student.dose_number}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography color="textSecondary" py={4}>
                          Chưa có danh sách học sinh hoặc chưa chọn chiến dịch.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {vaccinationList.length > 0 && (
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
                    Hành động "Tiến hành tiêm chủng" sẽ chuyển chiến dịch sang trạng thái 'Đang thực hiện'.
                  </Alert>
                  <Box display="flex" justifyContent="flex-end" gap={2}>
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
                      Tiến hành tiêm chủng
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
            Bạn có muốn xuất danh sách tiêm chủng ra file Excel?
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

      {/* Proceed Vaccination Confirmation Dialog */}
      <Dialog
        open={openProceedDialog}
        onClose={handleCloseProceedDialog}
        maxWidth="xs"
        fullWidth
        sx={{ "& .MuiDialog-paper": { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Xác nhận tiến hành tiêm chủng
        </DialogTitle>
        <DialogContent>
          <Typography>
            Hành động này sẽ chuyển chiến dịch sang trạng thái 'Đang thực hiện'. Bạn có muốn tiếp tục?
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
            onClick={handleProceedVaccination}
            color="primary"
            variant="contained"
            sx={{ textTransform: "none", borderRadius: 1 }}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

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

export default PrepareVaccinationList;
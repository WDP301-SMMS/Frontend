import React, { useState } from "react";
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
} from "@mui/material";
import { Download, CheckCircle } from "lucide-react";
import { utils, writeFile } from "xlsx";
import { classes, notifications, students } from "~/mock/mock";

function PrepareVaccinationList() {
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [vaccinationList, setVaccinationList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openExportDialog, setOpenExportDialog] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const itemsPerPage = 10;

  // Handle campaign selection
  const handleCampaignChange = (e) => {
    const campaignId = e.target.value;
    setSelectedCampaign(campaignId);
    setSelectedClass(""); // Reset class filter when campaign changes
    setCurrentPage(1); // Reset to first page
    filterStudents(campaignId, "");
  };

  // Handle class selection
  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    setCurrentPage(1); // Reset to first page
    filterStudents(selectedCampaign, classId);
  };

  // Filter students based on campaign and class
  const filterStudents = (campaignId, classId) => {
    setLoading(true);
    setTimeout(() => {
      const campaign = notifications.find((n) => n.campaign_id === campaignId);
      if (!campaign) {
        setVaccinationList([]);
        setLoading(false);
        return;
      }

      let filteredStudents = students
        .filter((student) => {
          // Check if student is in target classes and has parental consent
          return (
            campaign.targetClasses.includes(student.class_id) &&
            campaign.status.agreed.includes(student.student_id)
          );
        })
        .filter((student) => {
          // Mock contraindication check (exclude if health_notes indicate issues)
          return !student.health_notes.includes("Sốt cao");
        })
        .filter((student) => {
          // Mock age check (assuming all students are in age group)
          return true;
        });

      // Apply class filter if selected
      if (classId) {
        filteredStudents = filteredStudents.filter(
          (student) => student.class_id === classId
        );
      }

      const mappedStudents = filteredStudents
        .map((student, index) => {
          // Determine dose number based on vaccination history
          const doseNumber =
            student.vaccination_history.find(
              (v) => v.vaccine_id === campaign.vaccine_id
            )?.dose + 1 || 1;

          return {
            stt: index + 1,
            full_name: student.full_name,
            class_name: classes.find((c) => c.id === student.class_id)?.name || "",
            date_of_birth: student.date_of_birth,
            vaccine_name: campaign.vaccineName,
            dose_number: doseNumber,
            health_notes: student.health_notes || "Không có",
          };
        })
        // Sort by class and then by name
        .sort((a, b) => {
          const classCompare = a.class_name.localeCompare(b.class_name, "vi");
          if (classCompare !== 0) return classCompare;
          return a.full_name.localeCompare(b.full_name, "vi");
        });

      setVaccinationList(mappedStudents);
      setLoading(false);
    }, 500); // Simulate API delay
  };

  // Handle Excel export
  const handleExportExcel = (exportType) => {
    setLoading(true);
    let exportData = vaccinationList;

    // Filter by selected class if exportType is "class"
    if (exportType === "class" && selectedClass) {
      exportData = vaccinationList.filter(
        (student) =>
          student.class_name ===
          classes.find((c) => c.id === selectedClass)?.name
      );
    }

    const worksheet = utils.json_to_sheet(exportData, {
      header: [
        "stt",
        "full_name",
        "class_name",
        "date_of_birth",
        "vaccine_name",
        "dose_number",
        "health_notes",
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
      { wch: 30 }, // Health Notes
    ];
    worksheet["A1"].v = "STT";
    worksheet["B1"].v = "Họ và Tên";
    worksheet["C1"].v = "Lớp";
    worksheet["D1"].v = "Ngày Sinh";
    worksheet["E1"].v = "Tên Vaccine";
    worksheet["F1"].v = "Mũi Số";
    worksheet["G1"].v = "Ghi Chú Sức Khỏe";

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Vaccination List");
    const fileName =
      exportType === "class" && selectedClass
        ? `Danh_sach_tiem_chung_${selectedCampaign}_${selectedClass}.xlsx`
        : `Danh_sach_tiem_chung_${selectedCampaign}.xlsx`;
    writeFile(workbook, fileName);
    setLoading(false);
    setOpenExportDialog(false);
    setOpenSuccessDialog(true);
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

  const handleCloseSuccessDialog = () => {
    setOpenSuccessDialog(false);
  };

  return (
    <div className="min-h-[90vh] p-6 bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-300">
      <Typography variant="h4" fontWeight="bold" color="#1a202c" mb={3}>
        Chuẩn Bị Danh Sách Tiêm Chủng
      </Typography>

      <Box display="flex" gap={2} mb={4}>
        <FormControl fullWidth>
          <InputLabel>Chọn chiến dịch</InputLabel>
          <Select
            value={selectedCampaign}
            onChange={handleCampaignChange}
            label="Chọn chiến dịch"
          >
            <MenuItem value="">Chọn chiến dịch</MenuItem>
            {notifications.map((campaign) => (
              <MenuItem key={campaign.campaign_id} value={campaign.campaign_id}>
                {campaign.campaignName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth disabled={!selectedCampaign}>
          <InputLabel>Chọn lớp</InputLabel>
          <Select
            value={selectedClass}
            onChange={handleClassChange}
            label="Chọn lớp"
          >
            <MenuItem value="">Tất cả các lớp</MenuItem>
            {classes
              .filter(
                (cls) =>
                  selectedCampaign &&
                  notifications
                    .find((n) => n.campaign_id === selectedCampaign)
                    ?.targetClasses.includes(cls.id)
              )
              .map((cls) => (
                <MenuItem key={cls.id} value={cls.id}>
                  {cls.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
                  <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>STT</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>Họ và Tên</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>Lớp</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>Ngày Sinh</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>Tên Vaccine</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>Mũi Số</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>Ghi Chú Sức Khỏe</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedList.length > 0 ? (
                  paginatedList.map((student) => (
                    <TableRow key={student.stt}>
                      <TableCell>{student.stt}</TableCell>
                      <TableCell>{student.full_name}</TableCell>
                      <TableCell>{student.class_name}</TableCell>
                      <TableCell>{new Date(student.date_of_birth).toLocaleDateString("vi-VN")}</TableCell>
                      <TableCell>{student.vaccine_name}</TableCell>
                      <TableCell>{student.dose_number}</TableCell>
                      <TableCell sx={{ color: student.health_notes !== "Không có" ? "red" : "inherit" }}>
                        {student.health_notes}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
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
                  sx={{ "& .MuiPaginationItem-root": { fontSize: "1rem" } }}
                />
              </Box>
              <Box display="flex" justifyContent="flex-end" mt={2}>
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
                    borderRadius: "8px",
                    padding: "12px 24px",
                    textTransform: "none",
                  }}
                >
                  Xuất Excel
                </Button>
              </Box>
            </>
          )}
        </>
      )}

      {/* Export Options Dialog */}
      <Dialog open={openExportDialog} onClose={handleCloseExportDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Chọn tùy chọn xuất Excel</DialogTitle>
        <DialogContent>
          <Typography>Chọn phạm vi xuất danh sách:</Typography>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleExportExcel("all")}
              sx={{ textTransform: "none" }}
            >
              Tất cả học sinh
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleExportExcel("class")}
              disabled={!selectedClass}
              sx={{ textTransform: "none" }}
            >
              Theo lớp đã chọn ({classes.find((c) => c.id === selectedClass)?.name || "Chưa chọn"})
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseExportDialog} color="inherit">
            Hủy
          </Button>
        </DialogActions>
      </Dialog>

      {/* Export Success Dialog */}
      <Dialog open={openSuccessDialog} onClose={handleCloseSuccessDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Xuất Excel Thành Công</DialogTitle>
        <DialogContent>
          <Box display="flex" alignItems="center" gap={2}>
            <CheckCircle size={24} className="text-green-500" />
            <Typography>File danh sách tiêm chủng đã được tải xuống.</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccessDialog} color="primary" variant="contained">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PrepareVaccinationList;
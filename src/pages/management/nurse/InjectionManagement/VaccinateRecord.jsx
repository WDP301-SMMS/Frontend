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
  TextField,
  InputAdornment,
  Chip,
  Container,
  Avatar,
  Alert,
} from "@mui/material";
import { Download, CheckCircle, Save, Search } from "lucide-react";
import { utils, writeFile } from "xlsx";
import campaignService from "~/libs/api/services/campaignService";
import { Visibility, Warning } from "@mui/icons-material";

// Reusable constants (for mock consistency, adjust as needed)
const classes = []; // Will be populated from API if needed

function VaccinateRecord() {
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [vaccinationStatusFilter, setVaccinationStatusFilter] = useState("");
  const [vaccinationRecords, setVaccinationRecords] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openVaccinationDialog, setOpenVaccinationDialog] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [thirdPartyProvider, setThirdPartyProvider] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [dosage, setDosage] = useState("0.5ml");
  const [injectionSite, setInjectionSite] = useState("Cánh tay trái");
  const [administrationDateTime, setAdministrationDateTime] = useState(() => {
    const now = new Date("2025-06-24T13:47:00+07:00"); // Updated to 01:47 PM +07, June 24, 2025
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  });
  const [administeredBy, setAdministeredBy] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [healthCheckNote, setHealthCheckNote] = useState("");
  const [observationPeriod, setObservationPeriod] = useState("15 phút");
  const [immediateReactions, setImmediateReactions] = useState("");
  const [staffMembers, setStaffMembers] = useState([]);
  const [immunizationHistory, setImmunizationHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const itemsPerPage = 10;

  // Load campaigns on mount
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
          console.log(response.data);
          setCampaigns(response.data || []);
        } else {
          throw new Error(
            response.message || "Không thể tải danh sách chiến dịch."
          );
        }
      } catch (error) {
        console.error("Failed to load campaigns:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  // Load vaccination records
  const loadVaccinationRecords = async (
    campaignId,
    classId,
    query,
    statusFilter
  ) => {
    if (!campaignId) {
      setVaccinationRecords([]);
      return;
    }
    setLoading(true);
    try {
      const response = await campaignService.getListVaccination(campaignId);
      if (!response.success) {
        throw new Error(
          response.message || "Không thể tải danh sách tiêm chủng."
        );
      }

      let filteredRecords = response.data.filter((record) =>
        record.fullName.toLowerCase().includes(query.toLowerCase())
      );

      if (classId) {
        filteredRecords = filteredRecords.filter(
          (record) => record.className === classId
        );
      }

      if (statusFilter) {
        filteredRecords = filteredRecords.filter((record) => {
          const statusMap = {
            "Chưa tiêm": "PENDING_VACCINATION",
            "Đã tiêm": ["COMPLETED", "IN_PROCESS"], // Adjust based on API if "Đã tiêm" is defined
          };
          return statusMap[statusFilter]
            ? Array.isArray(statusMap[statusFilter])
              ? statusMap[statusFilter].includes(record.vaccinationStatus)
              : record.vaccinationStatus === statusMap[statusFilter]
            : true;
        });
      }

      const mappedRecords = filteredRecords
        .map((record, index) => ({
          stt: index + 1,
          student_id: record.studentId,
          consentId: record.consentId, // Use consentId from API response
          fullName: record.fullName,
          className: record.className,
          dateOfBirth: record.dateOfBirth,
          allergies: record.allergies,
          chronicConditions: record.chronicConditions,
          vaccinationStatus:
            record.vaccinationStatus === "PENDING_VACCINATION"
              ? "Chưa tiêm"
              : "Đã tiêm",
        }))
        .sort((a, b) => {
          const classCompare = a.className.localeCompare(b.className, "vi");
          if (classCompare !== 0) return classCompare;
          return a.fullName.localeCompare(b.fullName, "vi");
        });
      console.log(mappedRecords);
      setVaccinationRecords(mappedRecords);
    } catch (error) {
      console.error("Failed to load vaccination records:", error);
      setVaccinationRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // Load partner data by ID
  const loadPartnerByID = async (partnerId) => {
    if (!partnerId) {
      return;
    }
    setLoading(true);
    try {
      const response = await campaignService.getPartnerByID(partnerId);
      if (!response) {
        throw new Error(
          response.message || "Không thể tải thông tin bên thứ ba."
        );
      }
      const partnerData = response.data;
      setThirdPartyProvider(partnerData.name || "");
      setStaffMembers(partnerData.staffMembers || []);
    } catch (error) {
      console.error("Failed to load partner data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load immunization history when opening detail dialog
  useEffect(() => {
    const fetchImmunizationHistory = async () => {
      if (openDetailDialog && selectedStudent?.consentId) {
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
  }, [openDetailDialog, selectedStudent]);

  // Handle campaign selection
  const handleCampaignChange = (e) => {
    const campaignId = e.target.value;
    setSelectedCampaign(campaignId);
    setSelectedClass("");
    setVaccinationStatusFilter("");
    setCurrentPage(1);
    setSearchQuery("");
    setStaffMembers([]);
    loadVaccinationRecords(campaignId, "", "", "");
    const campaign = campaigns.find((c) => c._id === campaignId);
    if (campaign?.partnerId?._id) {
      loadPartnerByID(campaign.partnerId._id);
    }
  };

  // Handle class selection
  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    setCurrentPage(1);
    loadVaccinationRecords(
      selectedCampaign,
      classId,
      searchQuery,
      vaccinationStatusFilter
    );
  };

  // Handle search
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(1);
    loadVaccinationRecords(
      selectedCampaign,
      selectedClass,
      query,
      vaccinationStatusFilter
    );
  };

  // Handle vaccination status filter
  const handleStatusFilterChange = (e) => {
    const status = e.target.value;
    setVaccinationStatusFilter(status);
    setCurrentPage(1);
    loadVaccinationRecords(
      selectedCampaign,
      selectedClass,
      searchQuery,
      status
    );
  };

  // Open vaccination dialog
  const handleOpenVaccinationDialog = (student) => {
    const campaign = campaigns.find((c) => c._id === selectedCampaign);
    setSelectedStudent(student);
    setThirdPartyProvider(campaign?.partnerId?.name || "");
    setExpiryDate(campaign?.expiryDate || "");
    setDosage("0.5ml");
    setInjectionSite("Cánh tay trái");
    setAdministeredBy("");
    setManufacturer(campaign?.manufacturer || "");
    setHealthCheckNote("");
    setObservationPeriod("15 phút");
    setImmediateReactions("");
    setOpenVaccinationDialog(true);
  };

  // Open detail dialog
  const handleOpenDetailDialog = (student) => {
    setSelectedStudent(student);
    setOpenDetailDialog(true);
  };

  // Save vaccination record
  const handleSaveVaccination = async () => {
    if (!selectedStudent || !administeredBy) {
      return; // Already handled by disabled button
    }

    setLoading(true);
    try {
      const staffMember = staffMembers.find(
        (staff) => staff.fullName === administeredBy
      );
      if (!staffMember) {
        throw new Error("Không tìm thấy thông tin nhân viên.");
      }
      console.log(selectedStudent);
      await campaignService.injectionRecord(
        selectedStudent.consentId,
        staffMember._id
      );

      setVaccinationRecords((prev) =>
        prev.map((record) =>
          record.student_id === selectedStudent.student_id
            ? {
                ...record,
                vaccinationStatus: "Đã tiêm",
                batch_number: batchNumber,
                expiry_date: expiryDate,
                administration_date: administrationDateTime,
                adverse_reactions: immediateReactions,
                third_party_provider: thirdPartyProvider,
                manufacturer: manufacturer,
                health_check_note: healthCheckNote,
                observation_period: observationPeriod,
                administered_by: administeredBy,
                dosage: dosage,
                injection_site: injectionSite,
              }
            : record
        )
      );
      setOpenVaccinationDialog(false);
      setOpenSuccessDialog(true);
    } catch (error) {
      console.error("Failed to save vaccination record:", error);
      // Add UI feedback (e.g., Snackbar) if needed
    } finally {
      setLoading(false);
    }
  };

  // Export to Excel
  const handleExportExcel = () => {
    setLoading(true);
    const exportData = vaccinationRecords.map((record) => ({
      stt: record.stt,
      full_name: record.fullName,
      class_name: record.className,
      date_of_birth: new Date(record.dateOfBirth).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      allergies: record.allergies,
      chronic_conditions: record.chronicConditions,
      vaccination_status: record.vaccinationStatus,
    }));

    const worksheet = utils.json_to_sheet(exportData, {
      header: [
        "stt",
        "full_name",
        "class_name",
        "date_of_birth",
        "allergies",
        "chronic_conditions",
        "vaccination_status",
      ],
      skipHeader: false,
    });

    worksheet["!cols"] = [
      { wch: 5 },
      { wch: 20 },
      { wch: 10 },
      { wch: 15 },
      { wch: 30 },
      { wch: 30 },
      { wch: 15 },
    ];
    worksheet["A1"].v = "STT";
    worksheet["B1"].v = "Họ và Tên";
    worksheet["C1"].v = "Lớp";
    worksheet["D1"].v = "Ngày Sinh";
    worksheet["E1"].v = "Dị Ứng";
    worksheet["F1"].v = "Bệnh Mãn Tính";
    worksheet["G1"].v = "Trạng Thái Tiêm";

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "VaccinationResults");
    const fileName = `Ket_qua_tiem_chung_${selectedCampaign}.xlsx`;
    writeFile(workbook, fileName);
    setLoading(false);
    setOpenSuccessDialog(true);
  };

  // Pagination
  const totalPages = Math.ceil(vaccinationRecords.length / itemsPerPage);
  const paginatedList = vaccinationRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Dialog handlers
  const handleCloseVaccinationDialog = () => {
    setOpenVaccinationDialog(false);
    setSelectedStudent(null);
  };

  const handleCloseSuccessDialog = () => {
    setOpenSuccessDialog(false);
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
    setSelectedStudent(null);
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
        Tiêm Chủng và Ghi Nhận Kết Quả
      </Typography>

      <Alert
        severity="info"
        icon={<Warning />}
        sx={{ mb: 3, fontWeight: "medium" }}
      >
        Tiến hành ghi nhận kết quả tiêm chủng cho học sinh theo chiến dịch đã
        chọn. Vui lòng đảm bảo thông tin đầy đủ và chính xác trước khi lưu.
      </Alert>
      <Box display="flex" gap={2} mb={4}>
        <FormControl fullWidth>
          <InputLabel>Chọn chiến dịch</InputLabel>
          <Select
            value={selectedCampaign}
            onChange={handleCampaignChange}
            label="Chọn chiến dịch"
            disabled={loading}
          >
            <MenuItem value="">Chọn chiến dịch</MenuItem>
            {campaigns.map((campaign) => (
              <MenuItem key={campaign._id} value={campaign._id}>
                {campaign.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth disabled={!selectedCampaign || loading}>
          <InputLabel>Chọn lớp</InputLabel>
          <Select
            value={selectedClass}
            onChange={handleClassChange}
            label="Chọn lớp"
          >
            <MenuItem value="">Tất cả các lớp</MenuItem>
            {selectedCampaign &&
              [...new Set(vaccinationRecords.map((r) => r.className))]
                .sort()
                .map((className) => (
                  <MenuItem key={className} value={className}>
                    {className}
                  </MenuItem>
                ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Trạng thái tiêm</InputLabel>
          <Select
            value={vaccinationStatusFilter}
            onChange={handleStatusFilterChange}
            label="Trạng thái tiêm"
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="Chưa tiêm">Chưa tiêm</MenuItem>
            <MenuItem value="Đã tiêm">Đã tiêm</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Tìm kiếm học sinh"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            ),
          }}
          fullWidth
          disabled={loading}
        />
      </Box>

      <Typography mb={2}>
        Tổng số học sinh: {vaccinationRecords.length}
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer
            component={Paper}
            sx={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
                  <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>
                    STT
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>
                    Họ và Tên
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>
                    Lớp
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>
                    Ngày Sinh
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>
                    Dị Ứng
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>
                    Bệnh Mãn Tính
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>
                    Trạng Thái Tiêm
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>
                    Hành Động
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedList.length > 0 ? (
                  paginatedList.map((record) => (
                    <TableRow key={record.stt}>
                      <TableCell>{record.stt}</TableCell>
                      <TableCell>{record.fullName}</TableCell>
                      <TableCell>{record.className}</TableCell>
                      <TableCell>
                        {new Date(record.dateOfBirth).toLocaleDateString(
                          "vi-VN",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </TableCell>
                      <TableCell
                        sx={{
                          color:
                            record.allergies !== "Không có" ? "red" : "inherit",
                        }}
                      >
                        {record.allergies}
                      </TableCell>
                      <TableCell
                        sx={{
                          color:
                            record.chronicConditions?.length > 0 &&
                            record.chronicConditions[0]?.conditionName !==
                              "Chưa có thông tin"
                              ? "red"
                              : "inherit",
                        }}
                      >
                        {record.chronicConditions?.length > 0
                          ? record.chronicConditions
                              .map((condition) => condition.conditionName)
                              .join(", ")
                          : "Chưa có thông tin"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={record.vaccinationStatus}
                          color={
                            record.vaccinationStatus === "Đã tiêm"
                              ? "success"
                              : "warning"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {record.vaccinationStatus === "Chưa tiêm" ? (
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Save size={16} />}
                            onClick={() => handleOpenVaccinationDialog(record)}
                            sx={{ textTransform: "none" }}
                          >
                            Tiêm chủng
                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<Visibility size={16} />}
                            onClick={() => handleOpenDetailDialog(record)}
                            sx={{ textTransform: "none" }}
                          >
                            Xem chi tiết
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography color="textSecondary" py={4}>
                        Chưa có danh sách học sinh hoặc chưa chọn chiến dịch.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {vaccinationRecords.length > 0 && (
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
                  onClick={handleExportExcel}
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

      {/* Vaccination Dialog */}
      <Dialog
        open={openVaccinationDialog}
        onClose={handleCloseVaccinationDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Tiêm Chủng và Ghi Nhận</DialogTitle>
        <DialogContent>
          {selectedStudent && (
            <Box display="flex" flexDirection="column" gap={3}>
              <Box display="flex" gap={2}>
                <Avatar sx={{ width: 60, height: 60 }}>
                  {selectedStudent.fullName.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {selectedStudent.fullName}
                  </Typography>
                  <Typography>Mã HS: {selectedStudent.student_id}</Typography>
                  <Typography>Lớp: {selectedStudent.className}</Typography>
                  <Typography>
                    Ngày sinh:{" "}
                    {new Date(selectedStudent.dateOfBirth).toLocaleDateString(
                      "vi-VN",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                  Tiền sử dị ứng
                </Typography>
                <Typography
                  color={
                    selectedStudent.allergies !== "Không có" ? "red" : "inherit"
                  }
                >
                  {selectedStudent.allergies}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                  Bệnh mãn tính
                </Typography>
                <Typography
                  color={
                    selectedStudent.chronicConditions &&
                    selectedStudent.chronicConditions !== "Chưa có thông tin"
                      ? "red"
                      : "inherit"
                  }
                >
                  {selectedStudent.chronicConditions &&
                  typeof selectedStudent.chronicConditions === "object"
                    ? Array.isArray(selectedStudent.chronicConditions)
                      ? selectedStudent.chronicConditions
                          .map(
                            (condition) =>
                              condition.conditionName || "Không xác định"
                          )
                          .join(", ")
                      : selectedStudent.chronicConditions.conditionName ||
                        "Chưa có thông tin"
                    : selectedStudent.chronicConditions || "Chưa có thông tin"}
                </Typography>
              </Box>

              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  label="Tên chiến dịch"
                  value={
                    campaigns.find((c) => c._id === selectedCampaign)?.name ||
                    ""
                  }
                  disabled
                  fullWidth
                />
                <TextField
                  label="Tên vắc-xin"
                  value={
                    campaigns.find((c) => c._id === selectedCampaign)
                      ?.vaccineName || ""
                  }
                  disabled
                  fullWidth
                />
                <TextField
                  label="Số mũi"
                  value={
                    campaigns.find((c) => c._id === selectedCampaign)
                      ?.doseNumber || ""
                  }
                  disabled
                  fullWidth
                />
                <TextField
                  label="Bên thứ ba"
                  value={thirdPartyProvider}
                  disabled
                  fullWidth
                />
                <TextField
                  label="Ngày bắt đầu"
                  value={
                    campaigns.find((c) => c._id === selectedCampaign)?.startDate
                      ? new Date(
                          campaigns.find(
                            (c) => c._id === selectedCampaign
                          )?.startDate
                        ).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : ""
                  }
                  disabled
                  fullWidth
                />
                <TextField
                  label="Ngày kết thúc"
                  value={
                    campaigns.find((c) => c._id === selectedCampaign)?.endDate
                      ? new Date(
                          campaigns.find(
                            (c) => c._id === selectedCampaign
                          )?.endDate
                        ).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : ""
                  }
                  disabled
                  fullWidth
                />
                <TextField
                  label="Ngày bắt đầu thực tế"
                  value={
                    campaigns.find((c) => c._id === selectedCampaign)
                      ?.actualStartDate
                      ? new Date(
                          campaigns.find(
                            (c) => c._id === selectedCampaign
                          )?.actualStartDate
                        ).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : ""
                  }
                  disabled
                  fullWidth
                />
                <TextField
                  label="Mô tả"
                  value={
                    campaigns.find((c) => c._id === selectedCampaign)
                      ?.description || ""
                  }
                  disabled
                  fullWidth
                  multiline
                  rows={2}
                />
                <TextField
                  label="Địa điểm"
                  value={
                    campaigns.find((c) => c._id === selectedCampaign)
                      ?.destination || ""
                  }
                  disabled
                  fullWidth
                />
                <TextField
                  label="Người tạo"
                  value={
                    campaigns.find((c) => c._id === selectedCampaign)?.createdBy
                      ?.username || ""
                  }
                  disabled
                  fullWidth
                />
                <FormControl fullWidth required>
                  <InputLabel>Người thực hiện</InputLabel>
                  <Select
                    value={administeredBy}
                    onChange={(e) => setAdministeredBy(e.target.value)}
                    label="Người thực hiện"
                  >
                    {staffMembers.map((staff) => (
                      <MenuItem key={staff._id} value={staff.fullName}>
                        {staff.fullName} ({staff.position})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseVaccinationDialog} color="inherit">
            Hủy
          </Button>
          <Button
            onClick={handleSaveVaccination}
            color="primary"
            variant="contained"
            disabled={!administeredBy || loading}
          >
            {loading ? "Đang lưu..." : "Lưu và Hoàn thành"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog
        open={openDetailDialog}
        onClose={handleCloseDetailDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Chi Tiết Tiêm Chủng</DialogTitle>
        <DialogContent>
          {historyLoading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : selectedStudent?.consentId && immunizationHistory ? (
            <Box display="flex" flexDirection="column" gap={3}>
              <Box display="flex" gap={2}>
                <Avatar sx={{ width: 60, height: 60 }}>
                  {selectedStudent.fullName.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {selectedStudent.fullName}
                  </Typography>
                  <Typography>Mã HS: {selectedStudent.student_id}</Typography>
                  <Typography>Lớp: {selectedStudent.className}</Typography>
                  <Typography>
                    Ngày sinh:{" "}
                    {new Date(selectedStudent.dateOfBirth).toLocaleDateString(
                      "vi-VN",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                  Tiền sử dị ứng
                </Typography>
                <Typography
                  color={
                    selectedStudent.allergies !== "Không có" ? "red" : "inherit"
                  }
                >
                  {selectedStudent.allergies}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                  Bệnh mãn tính
                </Typography>
                <Typography
                  color={
                    selectedStudent.chronicConditions?.length > 0 &&
                    selectedStudent.chronicConditions[0]?.conditionName !==
                      "Chưa có thông tin"
                      ? "red"
                      : "inherit"
                  }
                >
                  {selectedStudent.chronicConditions?.length > 0
                    ? selectedStudent.chronicConditions
                        .map((condition) => condition.conditionName)
                        .join(", ")
                    : "Chưa có thông tin"}
                </Typography>
              </Box>

              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  label="Bên thứ ba"
                  value={immunizationHistory.partnerId?.name || ""}
                  disabled
                  fullWidth
                />
                <TextField
                  label="Người thực hiện"
                  value={
                    immunizationHistory.administeredByStaffId?.fullName || ""
                  }
                  disabled
                  fullWidth
                />
                <TextField
                  label="Mã học sinh"
                  value={immunizationHistory.studentId || ""}
                  disabled
                  fullWidth
                />
                <TextField
                  label="Thời gian tiêm"
                  value={
                    immunizationHistory.administeredAt
                      ? new Date(
                          immunizationHistory.administeredAt
                        ).toLocaleString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZone: "Asia/Ho_Chi_Minh",
                        })
                      : ""
                  }
                  disabled
                  fullWidth
                />
                <TextField
                  label="Tên vắc-xin"
                  value={immunizationHistory.vaccineName || ""}
                  disabled
                  fullWidth
                />
                <TextField
                  label="Số mũi"
                  value={immunizationHistory.doseNumber || ""}
                  disabled
                  fullWidth
                />
                <TextField
                  label="Kiểm tra sau tiêm"
                  value={
                    immunizationHistory.postVaccinationChecks.length > 0
                      ? immunizationHistory.postVaccinationChecks.join(", ")
                      : "Không có"
                  }
                  disabled
                  fullWidth
                />
                <TextField
                  label="Thời gian tạo"
                  value={
                    immunizationHistory.createdAt
                      ? new Date(immunizationHistory.createdAt).toLocaleString(
                          "vi-VN",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            timeZone: "Asia/Ho_Chi_Minh",
                          }
                        )
                      : ""
                  }
                  disabled
                  fullWidth
                />
                <TextField
                  label="Thời gian cập nhật"
                  value={
                    immunizationHistory.updatedAt
                      ? new Date(immunizationHistory.updatedAt).toLocaleString(
                          "vi-VN",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            timeZone: "Asia/Ho_Chi_Minh",
                          }
                        )
                      : ""
                  }
                  disabled
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Box>
            </Box>
          ) : (
            <Typography color="textSecondary" align="center" py={4}>
              Không có thông tin tiêm chủng để hiển thị.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDetailDialog}
            color="primary"
            variant="contained"
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog
        open={openSuccessDialog}
        onClose={handleCloseSuccessDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Thành Công</DialogTitle>
        <DialogContent>
          <Box display="flex" alignItems="center" gap={2}>
            <CheckCircle size={24} className="text-green-500" />
            <Typography>
              {selectedStudent
                ? `Đã ghi nhận tiêm chủng cho ${selectedStudent.fullName}.`
                : "File kết quả đã được tải xuống."}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseSuccessDialog}
            color="primary"
            variant="contained"
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default VaccinateRecord;

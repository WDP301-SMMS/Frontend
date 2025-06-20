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
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  Container,
  Alert,
} from "@mui/material";
import { Download, CheckCircle, Save, Search } from "lucide-react";
import { utils, writeFile } from "xlsx";
import { students } from "~/mock/mock";
import { vaccinationCampaigns, classes } from "~/mock/mock";
import { Visibility, Warning } from "@mui/icons-material";

function VaccinateRecord() {
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [vaccinationStatusFilter, setVaccinationStatusFilter] = useState("");
  const [vaccinationRecords, setVaccinationRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openVaccinationDialog, setOpenVaccinationDialog] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false); // New state for detail dialog
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [thirdPartyProvider, setThirdPartyProvider] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [dosage, setDosage] = useState("0.5ml");
  const [injectionSite, setInjectionSite] = useState("Cánh tay trái");
  const [administrationDateTime, setAdministrationDateTime] = useState(() => {
    const now = new Date();
    const vietnamTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
    );
    const year = vietnamTime.getFullYear();
    const month = String(vietnamTime.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(vietnamTime.getDate()).padStart(2, "0");
    const hours = String(vietnamTime.getHours()).padStart(2, "0");
    const minutes = String(vietnamTime.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  });
  const [administeredBy, setAdministeredBy] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [healthCheckNote, setHealthCheckNote] = useState("");
  const [observationPeriod, setObservationPeriod] = useState("15 phút");
  const [immediateReactions, setImmediateReactions] = useState("");
  const itemsPerPage = 10;

  // Load eligible students for vaccination
  const loadVaccinationRecords = (campaignId, classId, query, statusFilter) => {
    setLoading(true);
    setTimeout(() => {
      const campaign = vaccinationCampaigns.find((c) => c.id === campaignId);
      if (!campaign) {
        setVaccinationRecords([]);
        setLoading(false);
        return;
      }

      let filteredStudents = students
        .filter(
          (student) =>
            campaign.targetClasses.includes(student.class_id) &&
            !student.health_notes.includes("Sốt cao") &&
            Math.random() > 0.2 // Simulate 80% consent rate
        )
        .filter((student) =>
          student.full_name.toLowerCase().includes(query.toLowerCase())
        );

      if (classId) {
        filteredStudents = filteredStudents.filter(
          (student) => student.class_id === classId
        );
      }

      const mappedRecords = filteredStudents
        .map((student, index) => {
          const doseNumber =
            student.vaccination_history.find(
              (v) => v.vaccine_id === campaign.id
            )?.dose + 1 || 1;

          const existingRecord = student.vaccination_history.find(
            (v) => v.vaccine_id === campaign.id && v.dose === doseNumber
          );

          return {
            stt: index + 1,
            student_id: student.student_id,
            full_name: student.full_name,
            class_name:
              classes.find((c) => c.id === student.class_id)?.name || "",
            date_of_birth: student.date_of_birth,
            health_notes: student.health_notes || "Không có",
            consent_status:
              !student.health_notes.includes("Sốt cao") && Math.random() > 0.2
                ? "Đã đồng ý"
                : "Chưa đồng ý",
            vaccination_status: existingRecord ? "Đã tiêm" : "Chưa tiêm",
            dose_number: doseNumber,
            vaccine_name: campaign.vaccineName,
            batch_number: existingRecord?.batch_number || "",
            expiry_date: existingRecord?.expiry_date || "",
            administration_date: existingRecord?.administration_date || "",
            adverse_reactions: existingRecord?.adverse_reactions || "",
            third_party_provider: campaign.thirdPartyProvider.name,
            manufacturer: campaign.manufacturer,
            health_check_note: existingRecord?.health_check_note || "",
            observation_period: existingRecord?.observation_period || "",
            administered_by: existingRecord?.administered_by || "",
            dosage: existingRecord?.dosage || "",
            injection_site: existingRecord?.injection_site || "",
          };
        })
        .filter((record) =>
          statusFilter ? record.vaccination_status === statusFilter : true
        )
        .sort((a, b) => {
          const classCompare = a.class_name.localeCompare(b.class_name, "vi");
          if (classCompare !== 0) return classCompare;
          return a.full_name.localeCompare(b.full_name, "vi");
        });

      setVaccinationRecords(mappedRecords);
      setLoading(false);
    }, 500);
  };

  // Handle campaign selection
  const handleCampaignChange = (e) => {
    const campaignId = e.target.value;
    setSelectedCampaign(campaignId);
    setSelectedClass("");
    setVaccinationStatusFilter("");
    setCurrentPage(1);
    setSearchQuery("");
    loadVaccinationRecords(campaignId, "", "", "");
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
    const campaign = vaccinationCampaigns.find(
      (c) => c.id === selectedCampaign
    );
    setSelectedStudent(student);
    setThirdPartyProvider(campaign?.thirdPartyProvider.name || "");
    setBatchNumber(campaign?.batchNumber || "");
    setExpiryDate(campaign?.expiryDate || "");
    setDosage("0.5ml");
    setInjectionSite("Cánh tay trái");
    setAdministrationDateTime(() => {
    const now = new Date();
    const vietnamTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
    );
    const year = vietnamTime.getFullYear();
    const month = String(vietnamTime.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(vietnamTime.getDate()).padStart(2, "0");
    const hours = String(vietnamTime.getHours()).padStart(2, "0");
    const minutes = String(vietnamTime.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  });
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
  const handleSaveVaccination = () => {
    setLoading(true);
    setTimeout(() => {
      setVaccinationRecords((prev) =>
        prev.map((record) =>
          record.student_id === selectedStudent.student_id
            ? {
                ...record,
                vaccination_status: "Đã tiêm",
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
      setLoading(false);
    }, 500);
  };

  // Export to Excel
  const handleExportExcel = () => {
    setLoading(true);
    const exportData = vaccinationRecords.map((record) => ({
      stt: record.stt,
      full_name: record.full_name,
      class_name: record.class_name,
      date_of_birth: new Date(record.date_of_birth).toLocaleDateString("vi-VN"),
      health_notes: record.health_notes,
      consent_status: record.consent_status,
      vaccine_name: record.vaccine_name,
      dose_number: record.dose_number,
      batch_number: record.batch_number || "Chưa ghi nhận",
      expiry_date: record.expiry_date || "Chưa ghi nhận",
      administration_date: record.administration_date
        ? new Date(record.administration_date).toLocaleDateString("vi-VN")
        : "Chưa ghi nhận",
      adverse_reactions: record.adverse_reactions || "Không có",
      vaccination_status: record.vaccination_status,
      third_party_provider: record.third_party_provider,
      manufacturer: record.manufacturer,
      health_check_note: record.health_check_note || "Không có",
      observation_period: record.observation_period || "Không có",
      administered_by: record.administered_by || "Chưa ghi nhận",
      dosage: record.dosage || "Chưa ghi nhận",
      injection_site: record.injection_site || "Chưa ghi nhận",
    }));

    const worksheet = utils.json_to_sheet(exportData, {
      header: [
        "stt",
        "full_name",
        "class_name",
        "date_of_birth",
        "health_notes",
        "consent_status",
        "vaccine_name",
        "dose_number",
        "batch_number",
        "expiry_date",
        "administration_date",
        "adverse_reactions",
        "vaccination_status",
        "third_party_provider",
        "manufacturer",
        "health_check_note",
        "observation_period",
        "administered_by",
        "dosage",
        "injection_site",
      ],
      skipHeader: false,
    });

    worksheet["!cols"] = [
      { wch: 5 },
      { wch: 20 },
      { wch: 10 },
      { wch: 15 },
      { wch: 30 },
      { wch: 15 },
      { wch: 15 },
      { wch: 10 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 30 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 30 },
      { wch: 15 },
      { wch: 20 },
      { wch: 10 },
      { wch: 15 },
    ];
    worksheet["A1"].v = "STT";
    worksheet["B1"].v = "Họ và Tên";
    worksheet["C1"].v = "Lớp";
    worksheet["D1"].v = "Ngày Sinh";
    worksheet["E1"].v = "Ghi Chú Sức Khỏe";
    worksheet["F1"].v = "Trạng Thái Đồng Ý";
    worksheet["G1"].v = "Tên Vắc-xin";
    worksheet["H1"].v = "Mũi Số";
    worksheet["I1"].v = "Số Lô Vắc-xin";
    worksheet["J1"].v = "Hạn Sử Dụng";
    worksheet["K1"].v = "Ngày Tiêm";
    worksheet["L1"].v = "Phản Ứng Phụ";
    worksheet["M1"].v = "Trạng Thái Tiêm";
    worksheet["N1"].v = "Bên Thứ Ba";
    worksheet["O1"].v = "Nhà Sản Xuất";
    worksheet["P1"].v = "Kiểm Tra Sức Khỏe";
    worksheet["Q1"].v = "Thời Gian Quan Sát";
    worksheet["R1"].v = "Người Thực Hiện";
    worksheet["S1"].v = "Liều Lượng";
    worksheet["T1"].v = "Vị Trí Tiêm";

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
        Tiến hành ghi nhận kết quả tiêm chủng cho học sinh theo chiến dịch đã chọn. Vui lòng đảm bảo thông tin đầy đủ và chính xác trước khi lưu.
      </Alert>
      <Box display="flex" gap={2} mb={4}>
        <FormControl fullWidth>
          <InputLabel>Chọn chiến dịch</InputLabel>
          <Select
            value={selectedCampaign}
            onChange={handleCampaignChange}
            label="Chọn chiến dịch"
          >
            <MenuItem value="">Chọn chiến dịch</MenuItem>
            {vaccinationCampaigns.map((campaign) => (
              <MenuItem key={campaign.id} value={campaign.id}>
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
                  vaccinationCampaigns
                    .find((c) => c.id === selectedCampaign)
                    ?.targetClasses.includes(cls.id)
              )
              .map((cls) => (
                <MenuItem key={cls.id} value={cls.id}>
                  {cls.name}
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
                    Tình Trạng Sức Khỏe
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>
                    Đồng Ý Tiêm
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
                      <TableCell>{record.full_name}</TableCell>
                      <TableCell>{record.class_name}</TableCell>
                      <TableCell>
                        {new Date(record.date_of_birth).toLocaleDateString(
                          "vi-VN"
                        )}
                      </TableCell>
                      <TableCell
                        sx={{
                          color:
                            record.health_notes !== "Không có"
                              ? "red"
                              : "inherit",
                        }}
                      >
                        {record.health_notes}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={record.consent_status}
                          color={
                            record.consent_status === "Đã đồng ý"
                              ? "success"
                              : "error"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={record.vaccination_status}
                          color={
                            record.vaccination_status === "Đã tiêm"
                              ? "success"
                              : "warning"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {record.vaccination_status === "Đã tiêm" ? (
                          <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<Visibility size={16} />}
                            onClick={() => handleOpenDetailDialog(record)}
                            sx={{ textTransform: "none" }}
                          >
                            Xem chi tiết
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Save size={16} />}
                            onClick={() => handleOpenVaccinationDialog(record)}
                            disabled={record.consent_status !== "Đã đồng ý"}
                            sx={{ textTransform: "none" }}
                          >
                            Tiêm chủng
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
                  {selectedStudent.full_name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {selectedStudent.full_name}
                  </Typography>
                  <Typography>Mã HS: {selectedStudent.student_id}</Typography>
                  <Typography>Lớp: {selectedStudent.class_name}</Typography>
                  <Typography>
                    Ngày sinh:{" "}
                    {new Date(selectedStudent.date_of_birth).toLocaleDateString(
                      "vi-VN"
                    )}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                  Tiền sử sức khỏe
                </Typography>
                <Typography
                  color={
                    selectedStudent.health_notes !== "Không có"
                      ? "red"
                      : "inherit"
                  }
                >
                  {selectedStudent.health_notes}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                  Lịch sử tiêm chủng
                </Typography>
                <Typography>
                  Mũi {selectedStudent.dose_number} -{" "}
                  {selectedStudent.vaccine_name}
                </Typography>
              </Box>

              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  label="Tên vắc-xin"
                  value={selectedStudent.vaccine_name}
                  disabled
                  fullWidth
                />
                <TextField
                  label="Loại vắc-xin"
                  value={
                    vaccinationCampaigns.find((c) => c.id === selectedCampaign)
                      ?.vaccineType ||
                    vaccinationCampaigns.find((c) => c.id === selectedCampaign)
                      ?.customVaccineType ||
                    ""
                  }
                  disabled
                  fullWidth
                />
                <TextField
                  label="Nhà sản xuất"
                  value={manufacturer}
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
                  label="Số lô vắc-xin"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  fullWidth
                  required
                  disabled
                />
                <TextField
                  label="Hạn sử dụng"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  required
                  disabled
                />

                <FormControl fullWidth>
                  <InputLabel>Vị trí tiêm</InputLabel>
                  <Select
                    value={injectionSite}
                    onChange={(e) => setInjectionSite(e.target.value)}
                    label="Vị trí tiêm"
                  >
                    <MenuItem value="Cánh tay trái">Cánh tay trái</MenuItem>
                    <MenuItem value="Cánh tay phải">Cánh tay phải</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Ngày giờ tiêm"
                  type="datetime-local"
                  value={administrationDateTime}
                  onChange={(e) => setAdministrationDateTime(e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  required
                />
                <TextField
                  label="Người thực hiện"
                  value={administeredBy}
                  onChange={(e) => setAdministeredBy(e.target.value)}
                  fullWidth
                  required
                />
                <TextField
                  label="Kiểm tra sức khỏe trước tiêm"
                  value={healthCheckNote}
                  onChange={(e) => setHealthCheckNote(e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Nhập ghi chú (ví dụ: Nhiệt độ 36.5°C, không sốt)"
                />
                <FormControl fullWidth>
                  <InputLabel>Thời gian quan sát sau tiêm</InputLabel>
                  <Select
                    value={observationPeriod}
                    onChange={(e) => setObservationPeriod(e.target.value)}
                    label="Thời gian quan sát sau tiêm"
                  >
                    <MenuItem value="15 phút">15 phút</MenuItem>
                    <MenuItem value="30 phút">30 phút</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Phản ứng tức thì"
                  value={immediateReactions}
                  onChange={(e) => setImmediateReactions(e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Nhập phản ứng nếu có (ví dụ: Không có dấu hiệu bất thường)"
                />
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
            disabled={
              !batchNumber ||
              !expiryDate ||
              !administrationDateTime ||
              !administeredBy
            }
          >
            Lưu và Hoàn thành
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
          {selectedStudent && (
            <Box display="flex" flexDirection="column" gap={3}>
              <Box display="flex" gap={2}>
                <Avatar sx={{ width: 60, height: 60 }}>
                  {selectedStudent.full_name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {selectedStudent.full_name}
                  </Typography>
                  <Typography>Mã HS: {selectedStudent.student_id}</Typography>
                  <Typography>Lớp: {selectedStudent.class_name}</Typography>
                  <Typography>
                    Ngày sinh:{" "}
                    {new Date(selectedStudent.date_of_birth).toLocaleDateString(
                      "vi-VN"
                    )}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                  Tiền sử sức khỏe
                </Typography>
                <Typography
                  color={
                    selectedStudent.health_notes !== "Không có"
                      ? "red"
                      : "inherit"
                  }
                >
                  {selectedStudent.health_notes}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                  Lịch sử tiêm chủng
                </Typography>
                <Typography>
                  Mũi {selectedStudent.dose_number} -{" "}
                  {selectedStudent.vaccine_name}
                </Typography>
              </Box>

              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  label="Tên vắc-xin"
                  value={selectedStudent.vaccine_name}
                  disabled
                  fullWidth
                />
                <TextField
                  label="Loại vắc-xin"
                  value={
                    vaccinationCampaigns.find((c) => c.id === selectedCampaign)
                      ?.vaccineType ||
                    vaccinationCampaigns.find((c) => c.id === selectedCampaign)
                      ?.customVaccineType ||
                    ""
                  }
                  disabled
                  fullWidth
                />
                <TextField
                  label="Nhà sản xuất"
                  value={selectedStudent.manufacturer}
                  disabled
                  fullWidth
                />
                <TextField
                  label="Bên thứ ba"
                  value={selectedStudent.third_party_provider}
                  disabled
                  fullWidth
                />
                <TextField
                  label="Số lô vắc-xin"
                  value={batchNumber}
                  disabled
                  fullWidth
                />
                <TextField
                  label="Hạn sử dụng"
                  type="date"
                  value={expiryDate}
                  disabled
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Ngày giờ tiêm"
                  type="datetime-local"
                  value={administrationDateTime}
                  onChange={(e) => setAdministrationDateTime(e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  required
                />
                <TextField
                  label="Người thực hiện"
                  value={selectedStudent.administered_by}
                  disabled
                  fullWidth
                />
                <TextField
                  label="Kiểm tra sức khỏe trước tiêm"
                  value={selectedStudent.health_check_note}
                  disabled
                  fullWidth
                  multiline
                  rows={2}
                />
                <TextField
                  label="Thời gian quan sát sau tiêm"
                  value={selectedStudent.observation_period}
                  disabled
                  fullWidth
                />
                <TextField
                  label="Phản ứng tức thì"
                  value={selectedStudent.adverse_reactions}
                  disabled
                  fullWidth
                  multiline
                  rows={4}
                />
              </Box>
            </Box>
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
                ? `Đã ghi nhận tiêm chủng cho ${selectedStudent.full_name}.`
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

import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Search,
  Plus,
  Edit2,
  X,
  Save,
  File,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  Autocomplete,
  InputAdornment,
} from "@mui/material";
import { Warning } from "@mui/icons-material";
import medicationRequestsService from "~/libs/api/services/medicationRequestsService";
import userStudentServiceInstance from "~/libs/api/services/userStudentService";
import SuccessDialog from "~/libs/components/dialog/SuccessDialog";
import ErrorDialog from "~/libs/components/dialog/ErrorDialog";

const MedicationRequests = () => {
  const [form, setForm] = useState({
    _id: "",
    parentId: "",
    studentId: "",
    startDate: "",
    endDate: "",
    items: [{ _id: "", medicationName: "", dosage: "", instruction: "" }],
    prescriptionFile: null,
  });
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch all requests, parents, and students on component mount
  useEffect(() => {
    fetchRequests();
    fetchParents();
    fetchStudents();
  }, [page]);

  const fetchRequests = async () => {
    try {
      const res = await medicationRequestsService.getAllRequests(page);
      setRequests(res.data);
      setFilteredRequests(res.data);
      setTotalPages(res.totalPages || 1);
    } catch (error) {
      console.error(error);
      setErrorMessage("Lỗi khi lấy danh sách yêu cầu");
      setShowErrorDialog(true);
    }
  };

  const fetchParents = async () => {
    try {
      const res = await userStudentServiceInstance.getAllUsers({
        role: "Parent",
      });
      setParents(res.data.users || []);
    } catch (error) {
      console.error(error);
      setErrorMessage("Lỗi khi lấy danh sách phụ huynh");
      setShowErrorDialog(true);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await userStudentServiceInstance.getAllStudents({
        page: 1,
        limit: 100,
      });
      setStudents(res.data.students || []);
    } catch (error) {
      console.error(error);
      setErrorMessage("Lỗi khi lấy danh sách học sinh");
      setShowErrorDialog(true);
    }
  };

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...form.items];
    updatedItems[index][field] = value;
    setForm({ ...form, items: updatedItems });
  };

  const handleAddItem = () => {
    setForm({
      ...form,
      items: [
        ...form.items,
        { _id: "", medicationName: "", dosage: "", instruction: "" },
      ],
    });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, prescriptionFile: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.parentId) {
      setErrorMessage("Vui lòng chọn phụ huynh.");
      setShowErrorDialog(true);
      return;
    }
    if (!form.studentId) {
      setErrorMessage("Vui lòng chọn học sinh.");
      setShowErrorDialog(true);
      return;
    }
    if (!form.startDate) {
      setErrorMessage("Vui lòng chọn ngày bắt đầu.");
      setShowErrorDialog(true);
      return;
    }
    if (!form.endDate) {
      setErrorMessage("Vui lòng chọn ngày kết thúc.");
      setShowErrorDialog(true);
      return;
    }
    // Validate startDate is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare only dates
    const startDate = new Date(form.startDate);
    if (startDate < today) {
      setErrorMessage("Ngày bắt đầu không được là ngày trong quá khứ.");
      setShowErrorDialog(true);
      return;
    }
    // Validate endDate is after startDate
    const endDate = new Date(form.endDate);
    if (endDate <= startDate) {
      setErrorMessage("Ngày kết thúc phải sau ngày bắt đầu.");
      setShowErrorDialog(true);
      return;
    }
    // Validate items
    for (const item of form.items) {
      if (!item.medicationName.trim()) {
        setErrorMessage("Vui lòng điền tên thuốc cho tất cả các mục.");
        setShowErrorDialog(true);
        return;
      }
      if (!item.dosage.trim()) {
        setErrorMessage("Vui lòng điền liều dùng cho tất cả các mục.");
        setShowErrorDialog(true);
        return;
      }
      if (!item.instruction.trim()) {
        setErrorMessage("Vui lòng điền hướng dẫn cho tất cả các mục.");
        setShowErrorDialog(true);
        return;
      }
    }
    if (!form.prescriptionFile) {
      setErrorMessage(
        "File đơn thuốc phải là hình ảnh (jpg, jpeg, png) hoặc PDF."
      );
      setShowErrorDialog(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("parentId", form.parentId);
      formData.append("studentId", form.studentId);
      formData.append("startDate", form.startDate);
      formData.append("endDate", form.endDate);
      if (form.prescriptionFile) {
        formData.append("prescriptionFile", form.prescriptionFile);
      }
      // Phân loại items thành hai danh sách: cập nhật (có _id) và thêm mới (không có _id)
      const itemsToUpdate = form.items.filter((item) => item._id);
      const itemsToAdd = form.items
        .filter((item) => !item._id)
        .map(({ _id, ...rest }) => rest);
      

      if (editMode && form._id) {
        // Cập nhật thông tin yêu cầu (parentId, studentId, dates, prescriptionFile)
        await medicationRequestsService.updateRequestInfo(form._id, formData);
        // Cập nhật các mục thuốc hiện có (itemsToUpdate)
        if (itemsToUpdate.length > 0) {
          await medicationRequestsService.updateItems(form._id, itemsToUpdate);
        }
        // Thêm các mục thuốc mới (itemsToAdd)
        if (itemsToAdd.length > 0) {
          await medicationRequestsService.updateItems(form._id, itemsToAdd); // Giả định API addItems tồn tại
        }
      } else {
        // Tạo mới yêu cầu với toàn bộ items (loại bỏ _id)
        formData.append(
          "items",
          JSON.stringify(form.items.map(({ _id, ...rest }) => rest))
        );
        await medicationRequestsService.createRequest(formData);
      }

      setOpenDialog(false);
      setForm({
        _id: "",
        parentId: "",
        studentId: "", // Sửa từ StudentId thành studentId
        startDate: "",
        endDate: "",
        items: [{ _id: "", medicationName: "", dosage: "", instruction: "" }],
        prescriptionFile: null,
      });
      setEditMode(false);
      setViewMode(false);
      setShowSuccessDialog(true);
      await fetchRequests();
    } catch (error) {
      console.error(error);
      setErrorMessage("Có lỗi xảy ra khi gửi/cập nhật yêu cầu.");
      setShowErrorDialog(true);
    }
  };

  const handleViewOrEditRequest = (request, mode = "view") => {
    setForm({
      _id: request._id,
      parentId: request.parentId._id,
      studentId: request.studentId._id,
      startDate: request.startDate.split("T")[0],
      endDate: request.endDate.split("T")[0],
      items: request.requestItems.map((item) => ({
        _id: item._id || "", // Đảm bảo _id được ánh xạ, mặc định là "" nếu không có
        medicationName: item.medicationName,
        dosage: item.dosage,
        instruction: item.instruction,
      })),
      prescriptionFile: request.prescriptionFile || null,
    });
    setEditMode(mode === "edit");
    setViewMode(mode === "view");
    setOpenDialog(true);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterRequests(term, filterStatus);
  };

  const handleFilterStatus = (status) => {
    setFilterStatus(status);
    filterRequests(searchTerm, status);
  };

  const filterRequests = (term, status) => {
    let filtered = requests;
    if (term) {
      filtered = filtered.filter(
        (req) =>
          req.studentId.fullName.toLowerCase().includes(term) ||
          req.parentId.username.toLowerCase().includes(term)
      );
    }
    if (status) {
      filtered = filtered.filter((req) => req.status === status);
    }
    setFilteredRequests(filtered);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "#f59e0b"; // Orange
      case "scheduled":
        return "#3b82f6"; // Blue
      case "in progress":
        return "#facc15"; // Yellow
      case "completed":
        return "#22c55e"; // Green
      case "cancelled":
        return "#ef4444"; // Red
      default:
        return "#6b7280"; // Gray
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "Chờ xử lý";
      case "scheduled":
        return "Đã lên lịch";
      case "in progress":
        return "Đang tiến hành";
      case "completed":
        return "Hoàn tất";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
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
        Quản lý yêu cầu uống thuốc
      </Typography>

      <Alert severity="info" icon={<Warning />} sx={{ mb: 3 }}>
        Xem và quản lý tất cả các yêu cầu uống thuốc của học sinh trong hệ
        thống.
      </Alert>

      {/* Search and Filter */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField
          type="text"
          label="Tìm kiếm theo tên học sinh/phụ huynh"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ width: { xs: "100%", sm: 300 } }}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ width: { xs: "100%", sm: 200 } }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => handleFilterStatus(e.target.value)}
            label="Trạng thái"
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="Pending">Chờ xử lý</MenuItem>
            <MenuItem value="Scheduled">Đã lên lịch</MenuItem>
            <MenuItem value="In_progress">Đang tiến hành</MenuItem>
            <MenuItem value="Completed">Hoàn tất</MenuItem>
            <MenuItem value="Cancelled">Đã hủy</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => {
            setForm({
              _id: "",
              parentId: "",
              studentId: "",
              startDate: "",
              endDate: "",
              items: [{ medicationName: "", dosage: "", instruction: "" }],
              prescriptionFile: null,
            });
            setEditMode(false);
            setViewMode(false);
            setOpenDialog(true);
          }}
          sx={{
            backgroundColor: "#2563eb",
            "&:hover": { backgroundColor: "#1d4ed8" },
          }}
        >
          Thêm yêu cầu
        </Button>
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
              <TableCell>Trạng thái</TableCell>
              <TableCell>File đơn thuốc</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRequests.map((request) => (
              <TableRow
                key={request._id}
                sx={{
                  "&:hover": { backgroundColor: "#eff6ff" },
                  transition: "all 0.2s",
                }}
              >
                <TableCell>{request.parentId.username}</TableCell>
                <TableCell>{request.studentId.fullName}</TableCell>
                <TableCell>
                  {new Date(request.startDate).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell>
                  {new Date(request.endDate).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(request.status)}
                    size="small"
                    sx={{
                      bgcolor: getStatusColor(request.status),
                      color: "white",
                      fontWeight: "500",
                    }}
                  />
                </TableCell>
                <TableCell>
                  {request.prescriptionFile ? (
                    <a
                      href={request.prescriptionFile}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={request.prescriptionFile}
                        alt="Prescription"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                    </a>
                  ) : (
                    "Không có file"
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      onClick={() => handleViewOrEditRequest(request, "view")}
                      size="small"
                      sx={{
                        color: "#3b82f6",
                        "&:hover": { bgcolor: "#eff6ff" },
                      }}
                    >
                      Xem
                    </Button>
                    <IconButton
                      onClick={() => handleViewOrEditRequest(request, "edit")}
                      color="primary"
                      sx={{ "&:hover": { bgcolor: "#eff6ff" } }}
                    >
                      <Edit2 size={16} />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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

      {/* Add/Edit/View Request Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="lg"
        fullWidth
        sx={{ "& .MuiDialog-paper": { borderRadius: 2, maxHeight: "90vh" } }}
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
            {viewMode ? (
              <Typography variant="h6" fontWeight="600" color="#1e293b">
                Chi tiết yêu cầu
              </Typography>
            ) : (
              <>
                <Edit2 size={20} color="#3b82f6" />
                <Typography variant="h6" fontWeight="600" color="#1e293b">
                  {editMode ? "Chỉnh sửa yêu cầu" : "Thêm yêu cầu uống thuốc"}
                </Typography>
              </>
            )}
          </Box>
          <Button
            onClick={() => setOpenDialog(false)}
            size="small"
            sx={{ minWidth: "auto", p: 1 }}
          >
            <X size={18} />
          </Button>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} sx={{ width: "50%" }}>
                <Autocomplete
                  disabled={viewMode}
                  options={parents}
                  getOptionLabel={(option) => option.username || ""}
                  value={
                    parents.find((parent) => parent._id === form.parentId) ||
                    null
                  }
                  onChange={(event, newValue) => {
                    handleInputChange("parentId", newValue?._id || "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Phụ huynh"
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search size={20} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  fontWeight="600"
                  color="text.primary"
                >
                  File đơn thuốc:
                </Typography>
                {viewMode ? (
                  form.prescriptionFile ? (
                    <a
                      href={form.prescriptionFile}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <File size={50} color="#3b82f6" />
                    </a>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Không có file
                    </Typography>
                  )
                ) : (
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={handleFileChange}
                  />
                )}
              </Grid>
              <Grid item xs={12} md={6} sx={{ width: "50%" }}>
                <Autocomplete
                  disabled={viewMode}
                  options={students}
                  getOptionLabel={(option) =>
                    `${option.fullName} - ${
                      option.class?.className || "Không có lớp"
                    }` || ""
                  }
                  value={
                    students.find(
                      (student) => student._id === form.studentId
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    handleInputChange("studentId", newValue?._id || "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Học sinh"
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search size={20} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ngày bắt đầu"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={form.startDate}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
                  disabled={viewMode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ngày kết thúc"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={form.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  disabled={viewMode}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  fontWeight="600"
                  color="text.primary"
                >
                  Danh sách thuốc:
                </Typography>
                <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 1 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tên thuốc</TableCell>
                        <TableCell>Liều dùng</TableCell>
                        <TableCell>Hướng dẫn</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {form.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {viewMode ? (
                              item.medicationName
                            ) : (
                              <TextField
                                fullWidth
                                value={item.medicationName}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "medicationName",
                                    e.target.value
                                  )
                                }
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            {viewMode ? (
                              item.dosage
                            ) : (
                              <TextField
                                fullWidth
                                value={item.dosage}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "dosage",
                                    e.target.value
                                  )
                                }
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            {viewMode ? (
                              item.instruction
                            ) : (
                              <TextField
                                fullWidth
                                value={item.instruction}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "instruction",
                                    e.target.value
                                  )
                                }
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {!viewMode && (
                  <Button
                    variant="outlined"
                    onClick={handleAddItem}
                    sx={{ mt: 2 }}
                  >
                    + Thêm thuốc
                  </Button>
                )}
              </Grid>
            </Grid>
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
          {!viewMode && (
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{
                backgroundColor: "#2563eb",
                "&:hover": { backgroundColor: "#1d4ed8" },
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Save size={18} />
              {editMode ? "Cập nhật" : "Gửi yêu cầu"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <SuccessDialog
        open={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        title={editMode ? "Cập nhật thành công!" : "Gửi yêu cầu thành công!"}
        message="Yêu cầu uống thuốc đã được xử lý thành công."
      />
      <ErrorDialog
        open={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        title="Lỗi"
        message={errorMessage}
      />
    </Container>
  );
};

export default MedicationRequests;

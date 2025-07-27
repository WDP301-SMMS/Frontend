import React, { useState, useEffect } from "react";
import {
  Search,
  User,
  Clipboard,
  Save,
  Trash2,
  ShieldCheck,
  HeartPulse,
  Stethoscope,
  Pill,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
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
  Alert,
  Container,
  Grid,
  FormHelperText,
} from "@mui/material";
import { useNavigate } from "react-router";
import { Warning } from "@mui/icons-material";
import incidentsService from "~/libs/api/services/incidentsService";
import userStudentServiceInstance from "~/libs/api/services/userStudentService";

function RecordIncidents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [eventForm, setEventForm] = useState({
    incidentType: "",
    description: "",
    severity: "",
    status: "",
    actionsTaken: "",
    incidentTime: "",
  });
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [lastSavedRecord, setLastSavedRecord] = useState(null);
  const navigate = useNavigate();

  // Fetch all students on component mount and when searchTerm or selectedClass changes
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await userStudentServiceInstance.getAllStudents({
          page: 1,
          limit: 10,
          classId: selectedClass,
          search: searchTerm,
        });
        if (res.data && res.data.students) {
          setStudents(res.data.students);
        } else {
          setStudents([]);
          console.warn("Unexpected response structure:", res);
        }
      } catch (error) {
        console.error("Failed to fetch students:", error);
        setStudents([]);
      }
    };
    fetchStudents();
  }, [searchTerm, selectedClass]);

  const uniqueClasses = [
    ...new Set(students.map((student) => student.class.className)),
  ].sort();

  const handleSearchAndFilter = (term, classFilter) => {
    if (term.length > 0 || classFilter.length > 0) {
      const filteredStudents = students.filter((student) => {
        const matchesSearchTerm =
          term.length === 0 ||
          student.fullName.toLowerCase().includes(term.toLowerCase()) ||
          student._id.toLowerCase().includes(term.toLowerCase());
        const matchesClass =
          classFilter.length === 0 || student.class.className === classFilter;
        return matchesSearchTerm && matchesClass;
      });
      setSearchResults(filteredStudents);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchTermChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    handleSearchAndFilter(newSearchTerm, selectedClass);
  };

  const handleClassFilterChange = (e) => {
    const newClass = e.target.value;
    setSelectedClass(newClass);
    handleSearchAndFilter(searchTerm, newClass);
  };

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setSearchResults([]);
    setSearchTerm("");
    setSelectedClass("");
    
    // Set default values with current date and time
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);
    
    setEventForm({
      incidentType: "",
      description: "",
      severity: "",
      status: "",
      actionsTaken: "",
      incidentTime: `${currentDate}T${currentTime}:00Z`,
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEventForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleDateTimeChange = (field, value) => {
    setEventForm((prevForm) => {
      const currentDateTime = prevForm.incidentTime || new Date().toISOString();
      const [date, time] = currentDateTime.split('T');
      
      if (field === 'date') {
        return {
          ...prevForm,
          incidentTime: `${value}T${time}`,
        };
      } else if (field === 'time') {
        return {
          ...prevForm,
          incidentTime: `${date}T${value}:00Z`,
        };
      }
      return prevForm;
    });
  };

  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    if (!selectedStudent) {
      alert("Vui lòng chọn học sinh trước khi ghi nhận sự kiện.");
      return;
    }

    // Build incident data object, only include fields that have values
    const incidentData = {
      studentId: selectedStudent._id,
    };

    // Add fields only if they have values
    if (eventForm.incidentType.trim()) {
      incidentData.incidentType = eventForm.incidentType;
    }
    if (eventForm.description.trim()) {
      incidentData.description = eventForm.description;
    }
    if (eventForm.severity.trim()) {
      incidentData.severity = eventForm.severity;
    }
    if (eventForm.status.trim()) {
      incidentData.status = eventForm.status;
    }
    if (eventForm.actionsTaken.trim()) {
      incidentData.actionsTaken = eventForm.actionsTaken;
    }
    if (eventForm.incidentTime.trim()) {
      incidentData.incidentTime = eventForm.incidentTime;
    }

    try {
      const res = await incidentsService.createIncident(incidentData);
      const newMedicalRecord = {
        id: res.data._id,
        student: {
          _id: selectedStudent._id,
          fullName: selectedStudent.fullName,
          class: selectedStudent.class.className,
        },
        event: { ...eventForm },
        timestamp: new Date().toLocaleString("vi-VN"),
      };
      setMedicalRecords((prevRecords) => [...prevRecords, newMedicalRecord]);
      setLastSavedRecord(newMedicalRecord);
      setShowConfirmationDialog(true);
    } catch (error) {
      console.error("Failed to create incident:", error);
      alert("Ghi nhận sự kiện thất bại. Vui lòng thử lại.");
    }
  };

  const handleClearSelectedStudent = () => {
    setSelectedStudent(null);
    setEventForm({
      incidentType: "",
      description: "",
      severity: "",
      status: "",
      actionsTaken: "",
      incidentTime: "",
    });
  };

  const handleDeleteRecord = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hồ sơ này không?")) {
      setMedicalRecords((prevRecords) =>
        prevRecords.filter((record) => record.id !== id)
      );
      alert("Hồ sơ đã được xóa.");
    }
  };

  const handleViewRecord = () => {
    setShowConfirmationDialog(false);
    setSelectedStudent(null);
    setEventForm({
      incidentType: "",
      description: "",
      severity: "",
      status: "",
      actionsTaken: "",
      incidentTime: "",
    });
    navigate("/management/nurse/view-medical-records", {
      state: { medicalRecords: [...medicalRecords, lastSavedRecord] },
    });
  };

  const handleContinueRecording = () => {
    setShowConfirmationDialog(false);
    setSelectedStudent(null);
    
    // Reset form with current date and time
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);
    
    setEventForm({
      incidentType: "",
      description: "",
      severity: "",
      status: "",
      actionsTaken: "",
      incidentTime: `${currentDate}T${currentTime}:00Z`,
    });
  };

  const showSearchResults = searchTerm.length > 0 || selectedClass.length > 0;

  const eventIconMap = {
    "Chấn thương nhẹ": <AlertTriangle size={16} className="text-orange-500 mr-1.5" />,
    "Chấn thương nặng": <AlertTriangle size={16} className="text-red-500 mr-1.5" />,
    "Sốt": <HeartPulse size={16} className="text-red-500 mr-1.5" />,
    "Đau đầu": <Stethoscope size={16} className="text-yellow-600 mr-1.5" />,
    "Dị ứng": <Pill size={16} className="text-purple-500 mr-1.5" />,
    "Tiêu chảy": <ShieldCheck size={16} className="text-green-500 mr-1.5" />,
    "Khác": <Clipboard size={16} className="text-gray-500 mr-1.5" />,
  };

  // Get current date and time for form fields
  const getCurrentDate = () => {
    return eventForm.incidentTime ? eventForm.incidentTime.split('T')[0] : '';
  };

  const getCurrentTime = () => {
    return eventForm.incidentTime ? eventForm.incidentTime.split('T')[1]?.slice(0, 5) : '';
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
        Ghi nhận sự cố y tế
      </Typography>
      <Alert
        severity="info"
        icon={<Warning />}
        sx={{ mb: 3, fontWeight: "medium" }}
      >
        Để đăng tìm kiếm học sinh và ghi lại sự kiện y tế quan trọng như chấn thương, 
        sốt, đau đầu, dị ứng hoặc các sự kiện khác một cách nhanh chóng và chính xác.
      </Alert>

      {/* Phần Tìm kiếm & Lọc Học sinh */}
      <div className="mb-10 p-6 bg-white rounded-xl border border-blue-100 shadow-md transition-all duration-300 hover:shadow-lg">
        <h2 className="text-xl font-bold mb-5 text-blue-700 flex items-center">
          <Search size={22} className="mr-3 text-blue-600" />
          Tìm kiếm và Lọc Học sinh
        </h2>
        <Box display="flex" gap={2} mb={3} flexWrap="wrap">
          <TextField
            type="text"
            label="Tìm kiếm theo tên hoặc mã HS"
            value={searchTerm}
            onChange={handleSearchTermChange}
            sx={{ width: { xs: "100%", sm: 300 } }}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <Search size={18} className="text-gray-400 mr-2" />
              ),
            }}
          />
          <FormControl sx={{ width: { xs: "100%", sm: 200 } }}>
            <InputLabel>Lớp</InputLabel>
            <Select
              value={selectedClass}
              onChange={handleClassFilterChange}
              label="Lớp"
            >
              <MenuItem value="">Tất cả các lớp</MenuItem>
              {uniqueClasses.map((cls) => (
                <MenuItem key={cls} value={cls}>{cls}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Kết quả tìm kiếm hoặc thông báo không có học sinh */}
        {showSearchResults && selectedStudent === null && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg shadow-inner max-h-60 overflow-y-auto mt-3 transition-all duration-300 ease-in-out scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-50">
            {searchResults.length > 0 ? (
              searchResults.map((student) => (
                <button
                  key={student._id}
                  onClick={() => handleSelectStudent(student)}
                  className="w-full text-left p-3 hover:bg-blue-100 border-b border-blue-200 last:border-b-0 transition-colors duration-200 flex items-center space-x-3 group"
                >
                  <User
                    size={16}
                    className="text-blue-600 group-hover:text-blue-700"
                  />
                  <div>
                    <p className="font-semibold text-sm text-gray-800 group-hover:text-blue-800">
                      {student.fullName}
                    </p>
                    <p className="text-xs text-gray-500 group-hover:text-blue-600">
                      Lớp: {student.class.className} | Mã HS: {student._id}
                    </p>
                    <p className="text-xs text-gray-400 group-hover:text-blue-500">
                      Ngày sinh: {new Date(student.dateOfBirth).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <span className="ml-auto text-blue-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Chọn
                  </span>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 italic flex items-center justify-center space-x-2 text-sm">
                <AlertTriangle size={18} className="text-orange-400" />
                <span>Không tìm thấy học sinh nào phù hợp.</span>
              </div>
            )}
          </div>
        )}

        {/* Thông tin học sinh đã chọn */}
        {selectedStudent && (
          <div className="mt-6 p-4 bg-blue-100 rounded-lg flex items-center justify-between shadow-md border border-blue-200 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center space-x-3">
              <User size={22} className="text-blue-700 flex-shrink-0" />
              <div>
                <p className="font-bold text-blue-800 text-base">
                  {selectedStudent.fullName}
                </p>
                <p className="text-xs text-blue-600">
                  Lớp:{" "}
                  <span className="font-semibold">{selectedStudent.class.className}</span>{" "}
                  | Mã HS:{" "}
                  <span className="font-semibold">{selectedStudent._id}</span> |
                  Ngày sinh:{" "}
                  <span className="font-semibold">{new Date(selectedStudent.dateOfBirth).toLocaleDateString("vi-VN")}</span>
                </p>
              </div>
            </div>
            <button
              onClick={handleClearSelectedStudent}
              className="text-gray-500 hover:text-red-600 transition-colors duration-200 p-1.5 rounded-full hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300"
              aria-label="Xóa học sinh đã chọn"
              title="Xóa học sinh đã chọn"
            >
              <XCircle size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Phần Ghi nhận Sự kiện Y tế (chỉ hiển thị khi đã chọn học sinh) */}
      {selectedStudent && (
        <Box
          component="form"
          onSubmit={handleSubmitEvent}
          sx={{
            mt: 4,
            p: 3,
            bgcolor: "#f0f4f8",
            borderRadius: 2,
            border: "1px solid #c3d8e8",
            boxShadow: 1,
            animation: "fade-in 0.5s",
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 3, fontWeight: "bold", color: "#2e7d32", display: "flex", alignItems: "center" }}
          >
            <Clipboard sx={{ mr: 1, color: "#2e7d32" }} />
            Ghi nhận Sự kiện Y tế cho{" "}
            <span style={{ color: "#1a5d1a", marginLeft: "0.5rem" }}>
              {selectedStudent.fullName}
            </span>
          </Typography>

          <Grid container spacing={3}>
            {/* Row 1: Incident Type, Severity, Status */}
            <Grid item xs={12} sm={6} md={4} sx={{width: "24%"}}>
              <FormControl fullWidth>
                <InputLabel>Loại sự kiện</InputLabel>
                <Select
                  name="incidentType"
                  value={eventForm.incidentType}
                  onChange={handleFormChange}
                  label="Loại sự kiện"
                >
                  <MenuItem value="">-- Chọn loại sự kiện --</MenuItem>
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

            <Grid item xs={12} sm={6} md={4} sx={{width: "24%"}}>
              <FormControl fullWidth>
                <InputLabel>Mức độ nghiêm trọng</InputLabel>
                <Select
                  name="severity"
                  value={eventForm.severity}
                  onChange={handleFormChange}
                  label="Mức độ nghiêm trọng"
                >
                  <MenuItem value="">-- Chọn mức độ --</MenuItem>
                  <MenuItem value="Mild">Nhẹ</MenuItem>
                  <MenuItem value="Moderate">Trung bình</MenuItem>
                  <MenuItem value="Severe">Nặng</MenuItem>
                  <MenuItem value="Critical">Khẩn cấp</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* <Grid item xs={12} sm={6} md={4} sx={{width: "30%"}}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái xử lý</InputLabel>
                <Select
                  name="status"
                  value={eventForm.status}
                  onChange={handleFormChange}
                  label="Trạng thái xử lý"
                >
                  <MenuItem value="">-- Chọn trạng thái --</MenuItem>
                  <MenuItem value="Đang xử lý">Đang xử lý</MenuItem>
                  <MenuItem value="Đã xử lý">Đã xử lý</MenuItem>
                  <MenuItem value="Cần theo dõi">Cần theo dõi</MenuItem>
                  <MenuItem value="Đã chuyển viện">Đã chuyển viện</MenuItem>
                </Select>
              </FormControl>
            </Grid> */}

            {/* Row 2: Date and Time */}
            <Grid item xs={12} sm={6} md={4} sx={{width: "23.5%"}}>
              <TextField
                fullWidth
                type="date"
                label="Ngày xảy ra"
                value={getCurrentDate()}
                onChange={(e) => handleDateTimeChange('date', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} sx={{width: "23.4%"}}>
              <TextField
                fullWidth
                type="time"
                label="Thời gian xảy ra"
                value={getCurrentTime()}
                onChange={(e) => handleDateTimeChange('time', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Row 3: Description */}
            <Grid item xs={12} sx={{width: "100%"}}>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="description"
                label="Mô tả chi tiết sự kiện"
                value={eventForm.description}
                onChange={handleFormChange}
                placeholder="Mô tả cụ thể sự việc, tình trạng ban đầu của học sinh, triệu chứng..."
              />
            </Grid>

            {/* Row 4: Actions Taken */}
            <Grid item xs={12} sx={{width: "100%"}}>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="actionsTaken"
                label="Hành động đã xử lý"
                value={eventForm.actionsTaken}
                onChange={handleFormChange}
                placeholder="Các bước xử lý đã thực hiện, ví dụ: sơ cứu, gọi phụ huynh, chuyển lên phòng y tế, dùng thuốc gì..."
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                px: 4,
                py: 1.5,
                bgcolor: "#2563eb",
                "&:hover": { bgcolor: "#1d4ed8" },
                color: "white",
                fontWeight: "bold",
                borderRadius: 1,
                boxShadow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.02)" },
              }}
            >
              <Save size={18} />
              <span>Lưu Hồ sơ Sự kiện</span>
            </Button>
          </Box>
        </Box>
      )}

      {/* MUI Dialog */}
      <Dialog
        open={showConfirmationDialog}
        onClose={handleContinueRecording}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "12px",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            maxWidth: "400px",
            padding: "24px",
            textAlign: "center",
          },
          "& .MuiDialog-container": {
            backgroundColor: "rgba(0, 0, 0, 0.25)",
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          component="div"
          sx={{ paddingBottom: '0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <Box sx={{ mb: 2 }}>
            <CheckCircle size={60} className="text-green-500" />
          </Box>
          <Typography
            variant="h5"
            component="h3"
            sx={{ fontWeight: "bold", color: "#1a202c" }}
          >
            Ghi nhận Thành công!
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ paddingTop: "8px !important" }}>
          <Typography variant="body1" sx={{ color: "#4a5568" }}>
            Hồ sơ sự kiện y tế cho học sinh{" "}
            <Typography component="span" sx={{ fontWeight: "700" }}>
              {lastSavedRecord?.student.fullName}
            </Typography>{" "}
            đã được ghi nhận thành công.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{ justifyContent: "center", gap: "16px", paddingTop: "24px" }}
        >
          <Button
            onClick={handleViewRecord}
            variant="contained"
            sx={{
              backgroundColor: "#2563eb",
              "&:hover": {
                backgroundColor: "#1d4ed8",
              },
              color: "white",
              fontWeight: "bold",
              borderRadius: "8px",
              padding: "12px 24px",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              textTransform: "none",
            }}
          >
            Xem Hồ sơ
          </Button>
          <Button
            onClick={handleContinueRecording}
            variant="outlined"
            sx={{
              borderColor: "#cbd5e0",
              color: "#4a5568",
              fontWeight: "bold",
              borderRadius: "8px",
              padding: "12px 24px",
              "&:hover": {
                backgroundColor: "#f7fafc",
                borderColor: "#a0aec0",
              },
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              textTransform: "none",
            }}
          >
            Ghi nhận tiếp
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default RecordIncidents;
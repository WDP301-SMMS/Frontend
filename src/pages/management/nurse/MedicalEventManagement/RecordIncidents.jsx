import React, { useState } from "react";
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
import { mockStudents } from "~/mock/mock";
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
} from "@mui/material";
import { useNavigate } from "react-router";
import { Warning } from "@mui/icons-material";

function RecordIncidents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [eventForm, setEventForm] = useState({
    eventType: "",
    date: "",
    time: "",
    description: "",
    actionsTaken: "",
    notes: "",
  });
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [lastSavedRecord, setLastSavedRecord] = useState(null);
  const navigate = useNavigate();

  const uniqueClasses = [
    ...new Set(mockStudents.map((student) => student.class)),
  ].sort();

  const handleSearchAndFilter = (term, classFilter) => {
    if (term.length > 0 || classFilter.length > 0) {
      const filteredStudents = mockStudents.filter((student) => {
        const matchesSearchTerm =
          term.length === 0 ||
          student.name.toLowerCase().includes(term.toLowerCase()) ||
          student.id.toLowerCase().includes(term.toLowerCase());
        const matchesClass =
          classFilter.length === 0 || student.class === classFilter;
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
    setEventForm({
      eventType: "",
      date: new Date().toISOString().substring(0, 10),
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      description: "",
      actionsTaken: "",
      notes: "",
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEventForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmitEvent = (e) => {
    e.preventDefault();
    if (selectedStudent) {
      const newMedicalRecord = {
        id: Date.now().toString(),
        student: selectedStudent,
        event: { ...eventForm },
        timestamp: new Date().toLocaleString("vi-VN"),
      };
      setMedicalRecords((prevRecords) => [...prevRecords, newMedicalRecord]);
      setLastSavedRecord(newMedicalRecord);
      setShowConfirmationDialog(true);
    } else {
      alert("Vui lòng chọn học sinh trước khi ghi nhận sự kiện.");
    }
  };

  const handleClearSelectedStudent = () => {
    setSelectedStudent(null);
    setEventForm({
      eventType: "",
      date: "",
      time: "",
      description: "",
      actionsTaken: "",
      notes: "",
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
      eventType: "",
      date: "",
      time: "",
      description: "",
      actionsTaken: "",
    });
    navigate("/management/nurse/view-medical-records", {
      state: { medicalRecords: [...medicalRecords, lastSavedRecord] },
    });
  };

  const handleContinueRecording = () => {
    setShowConfirmationDialog(false);
    setSelectedStudent(null);
    setEventForm({
      eventType: "",
      date: new Date().toISOString().substring(0, 10),
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      description: "",
      actionsTaken: "",
      notes: "",
    });
  };

  const showSearchResults = searchTerm.length > 0 || selectedClass.length > 0;

  const eventIconMap = {
    "Tai nạn": <AlertTriangle size={16} className="text-orange-500 mr-1.5" />,
    Sốt: <HeartPulse size={16} className="text-red-500 mr-1.5" />,
    "Té ngã": <Stethoscope size={16} className="text-yellow-600 mr-1.5" />,
    "Dị ứng": <Pill size={16} className="text-purple-500 mr-1.5" />,
    "Dịch bệnh": <ShieldCheck size={16} className="text-green-500 mr-1.5" />,
    Khác: <Clipboard size={16} className="text-gray-500 mr-1.5" />,
  };

  return (
    <Container
      maxWidth="xl"
      sx={{ py: 4, bgcolor: "#f5f5f5", minHeight: "100vh" }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: "bold", color: "#1e3a8a" }}
      >  Ghi nhận Sự kiện Y tế
      </Typography>
            <Alert
              severity="info"
              icon={<Warning />}
              sx={{ mb: 3, fontWeight: "medium" }}
            >
             Để đăng tìm kiếm học sinh và ghi lại sự kiện y tế quan trọng như tai
          nạn, sốt, té ngã, hoặc dịch bệnh một cách nhanh chóng và chính xác.
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
                  key={student.id}
                  onClick={() => handleSelectStudent(student)}
                  className="w-full text-left p-3 hover:bg-blue-100 border-b border-blue-200 last:border-b-0 transition-colors duration-200 flex items-center space-x-3 group"
                >
                  <User
                    size={16}
                    className="text-blue-600 group-hover:text-blue-700"
                  />
                  <div>
                    <p className="font-semibold text-sm text-gray-800 group-hover:text-blue-800">
                      {student.name}
                    </p>
                    <p className="text-xs text-gray-500 group-hover:text-blue-600">
                      Lớp: {student.class} | Mã HS: {student.id}
                    </p>
                    <p className="text-xs text-gray-400 group-hover:text-blue-500">
                      Ngày sinh: {student.dob}
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
                  {selectedStudent.name}
                </p>
                <p className="text-xs text-blue-600">
                  Lớp:{" "}
                  <span className="font-semibold">{selectedStudent.class}</span>{" "}
                  | Mã HS:{" "}
                  <span className="font-semibold">{selectedStudent.id}</span> |
                  Ngày sinh:{" "}
                  <span className="font-semibold">{selectedStudent.dob}</span>
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
        <form
          onSubmit={handleSubmitEvent}
          className="mt-10 p-6 bg-green-50 rounded-xl border border-green-200 shadow-md animate-in fade-in duration-500"
        >
          <h2 className="text-2xl font-bold mb-5 text-green-700 flex items-center">
            <Clipboard size={24} className="mr-3 text-green-600" />
            Ghi nhận Sự kiện Y tế cho{" "}
            <span className="text-green-800 ml-1.5">
              {selectedStudent.name}
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
            <div>
              <label
                htmlFor="eventType"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Loại sự kiện <span className="text-red-500">*</span>
              </label>
              <select
                id="eventType"
                name="eventType"
                value={eventForm.eventType}
                onChange={handleFormChange}
                required
                className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-800 bg-white cursor-pointer"
              >
                <option value="">-- Chọn loại sự kiện --</option>
                <option value="Tai nạn">Tai nạn</option>
                <option value="Sốt">Sốt</option>
                <option value="Té ngã">Té ngã</option>
                <option value="Dị ứng">Dị ứng</option>
                <option value="Dịch bệnh">Dịch bệnh</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Ngày xảy ra <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={eventForm.date}
                onChange={handleFormChange}
                required
                className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-800"
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="time"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Thời gian xảy ra <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={eventForm.time}
                onChange={handleFormChange}
                required
                className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-800"
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Mô tả chi tiết sự kiện <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={eventForm.description}
              onChange={handleFormChange}
              required
              className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-800 placeholder:text-gray-400"
              placeholder="Mô tả cụ thể sự việc, tình trạng ban đầu của học sinh, triệu chứng..."
            ></textarea>
          </div>

          <div className="mb-4">
            <label
              htmlFor="actionsTaken"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Hành động đã xử lý <span className="text-red-500">*</span>
            </label>
            <textarea
              id="actionsTaken"
              name="actionsTaken"
              rows="2"
              value={eventForm.actionsTaken}
              onChange={handleFormChange}
              required
              className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-800 placeholder:text-gray-400"
              placeholder="Các bước xử lý đã thực hiện, ví dụ: sơ cứu, gọi phụ huynh, chuyển lên phòng y tế, dùng thuốc gì..."
            ></textarea>
          </div>

          <div className="mb-6">
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Ghi chú thêm (Nếu có)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows="1"
              value={eventForm.notes}
              onChange={handleFormChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-800 placeholder:text-gray-400"
              placeholder="Các thông tin bổ sung, quan sát sau khi xử lý, kế hoạch theo dõi..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-[1.02] text-base"
          >
            <Save size={20} />
            <span>Lưu Hồ sơ Sự kiện</span>
          </button>
        </form>
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
            Hồ sơ sự kiện y tế cho học sinh <Typography variant="body1" sx={{fontWeight:"700"}}>{lastSavedRecord?.student.name}</Typography> đã được ghi nhận.
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
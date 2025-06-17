import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle,
  X,
} from "lucide-react";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  CardActions,
  Divider,
  Chip,
} from "@mui/material";
import { eventRecords, medication } from "~/mock/mock";

function InventoryMedications() {
  // State for tabs
  const [tabValue, setTabValue] = useState(0);

  // Inventory tab states
  const [medicationForm, setMedicationForm] = useState({
    medicationName: "",
    quantity: "",
    type: "",
    entryDate: new Date().toISOString().substring(0, 10),
    notes: "",
  });
  const [medicationRecords, setMedicationRecords] = useState(medication || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [lastSavedRecord, setLastSavedRecord] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dispense Medication tab states
  const [dispenseForm, setDispenseForm] = useState({
    eventId: "",
    medications: [{ medicationId: "", quantity: "", notes: "" }],
  });
  const [dispenseRecords, setDispenseRecords] = useState([]);
  const [eventSearchTerm, setEventSearchTerm] = useState("");
  const [openDispenseDialog, setOpenDispenseDialog] = useState(false);
  const [showDispenseConfirmation, setShowDispenseConfirmation] = useState(false);
  const [lastDispensedRecords, setLastDispensedRecords] = useState([]);
  const [dispensePage, setDispensePage] = useState(1);

  // Medication Log tab states
  const [logSearchTerm, setLogSearchTerm] = useState("");
  const [logDateFilter, setLogDateFilter] = useState("");
  const [logTypeFilter, setLogTypeFilter] = useState("");
  const [logPage, setLogPage] = useState(1);

  const medicationTypes = ["viên", "lọ", "ml", "gói", "ống"];

  // Inventory tab handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setMedicationForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitMedication = (e) => {
    e.preventDefault();
    const newRecord = {
      id: Date.now().toString(),
      ...medicationForm,
      quantity: parseInt(medicationForm.quantity),
      timestamp: new Date().toLocaleString("vi-VN"),
    };
    setMedicationRecords((prev) => [...prev, newRecord]);
    setLastSavedRecord(newRecord);
    setShowConfirmationDialog(true);
    setOpenAddDialog(false);
    setMedicationForm({
      medicationName: "",
      quantity: "",
      type: "",
      entryDate: new Date().toISOString().substring(0, 10),
      notes: "",
    });
    setCurrentPage(Math.ceil((medicationRecords.length + 1) / itemsPerPage));
  };

  const handleEditMedication = (e) => {
    e.preventDefault();
    const updatedRecords = medicationRecords.map((record) =>
      record.id === selectedRecord.id
        ? {
            ...record,
            ...medicationForm,
            quantity: parseInt(medicationForm.quantity),
            timestamp: new Date().toLocaleString("vi-VN"),
          }
        : record
    );
    setMedicationRecords(updatedRecords);
    setOpenEditDialog(false);
    setMedicationForm({
      medicationName: "",
      quantity: "",
      type: "",
      entryDate: new Date().toISOString().substring(0, 10),
      notes: "",
    });
    setSelectedRecord(null);
  };

  const handleDeleteRecord = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thuốc này khỏi kho không?")) {
      setMedicationRecords((prev) => prev.filter((record) => record.id !== id));
      if (
        currentPage > 1 &&
        Math.ceil((medicationRecords.length - 1) / itemsPerPage) < currentPage
      ) {
        setCurrentPage(currentPage - 1);
      }
      alert("Thuốc đã được xóa khỏi kho.");
    }
  };

  const handleOpenDetailDialog = (record) => {
    setSelectedRecord(record);
    setOpenDetailDialog(true);
  };

  const handleOpenEditDialog = (record) => {
    setSelectedRecord(record);
    setMedicationForm({
      medicationName: record.medicationName,
      quantity: record.quantity.toString(),
      type: record.type,
      entryDate: record.entryDate,
      notes: record.notes,
    });
    setOpenEditDialog(true);
  };

  const filteredRecords = medicationRecords.filter((record) =>
    record.medicationName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Dispense Medication tab handlers
  const handleDispenseFormChange = (e, index) => {
    const { name, value } = e.target;
    if (name.startsWith("medication")) {
      const field = name.split("-")[1];
      setDispenseForm((prev) => ({
        ...prev,
        medications: prev.medications.map((med, i) =>
          i === index ? { ...med, [field]: value } : med
        ),
      }));
    } else {
      setDispenseForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addMedicationField = () => {
    setDispenseForm((prev) => ({
      ...prev,
      medications: [...prev.medications, { medicationId: "", quantity: "", notes: "" }],
    }));
  };

  const removeMedicationField = (index) => {
    setDispenseForm((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
  };

  const handleDispenseSubmit = (e) => {
    e.preventDefault();
    const selectedEvent = eventRecords.find(
      (event) => event.id === dispenseForm.eventId
    );
    if (!selectedEvent) {
      alert("Vui lòng chọn sự kiện hợp lệ.");
      return;
    }
    const newRecords = [];
    let valid = true;
    dispenseForm.medications.forEach((med) => {
      const selectedMedication = medicationRecords.find(
        (m) => m.id === med.medicationId
      );
      const quantity = parseInt(med.quantity);
      if (!selectedMedication) {
        alert("Vui lòng chọn thuốc hợp lệ.");
        valid = false;
        return;
      }
      if (quantity <= 0) {
        alert("Số lượng phải lớn hơn 0.");
        valid = false;
        return;
      }
      if (quantity > selectedMedication.quantity) {
        alert(`Số lượng ${selectedMedication.medicationName} vượt quá số lượng trong kho.`);
        valid = false;
        return;
      }
      newRecords.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        eventId: dispenseForm.eventId,
        eventName: `${selectedEvent.student.name} - ${selectedEvent.event.eventType}`,
        medicationName: selectedMedication.medicationName,
        quantity,
        type: selectedMedication.type,
        timestamp: new Date().toLocaleString("vi-VN"),
        notes: med.notes,
        studentId: selectedEvent.student.id,
        eventDescription: selectedEvent.event.description,
      });
    });
    if (!valid) return;
    setDispenseRecords((prev) => [...prev, ...newRecords]);
    setMedicationRecords((prev) =>
      prev.map((med) => {
        const dispensed = newRecords.find((r) => r.medicationName === med.medicationName);
        return dispensed
          ? { ...med, quantity: med.quantity - dispensed.quantity }
          : med;
      })
    );
    setLastDispensedRecords(newRecords);
    setShowDispenseConfirmation(true);
    setOpenDispenseDialog(false);
    setDispenseForm({
      eventId: "",
      medications: [{ medicationId: "", quantity: "", notes: "" }],
    });
  };

  const filteredEvents = eventRecords.filter(
    (event) =>
      event.student.name.toLowerCase().includes(eventSearchTerm.toLowerCase()) ||
      event.event.eventType.toLowerCase().includes(eventSearchTerm.toLowerCase())
  );

  const filteredDispenseRecords = dispenseRecords
    .filter(
      (record) =>
        record.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.eventName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice((dispensePage - 1) * itemsPerPage, dispensePage * itemsPerPage);

  const dispenseTotalPages = Math.ceil(dispenseRecords.length / itemsPerPage);

  const handleDispensePageChange = (event, value) => {
    setDispensePage(value);
  };

  // Medication Log tab handlers
  const filteredLogRecords = dispenseRecords.filter(
    (record) =>
      record.medicationName.toLowerCase().includes(logSearchTerm.toLowerCase()) &&
      (!logDateFilter || record.timestamp.includes(logDateFilter)) &&
      (!logTypeFilter || record.type === logTypeFilter)
  );

  const groupedLogRecords = filteredLogRecords.reduce((acc, record) => {
    const eventId = record.eventId;
    if (!acc[eventId]) {
      const event = eventRecords.find((e) => e.id === eventId);
      acc[eventId] = {
        event,
        medications: [],
      };
    }
    acc[eventId].medications.push(record);
    return acc;
  }, {});

  const logRecordsArray = Object.values(groupedLogRecords).slice(
    (logPage - 1) * itemsPerPage,
    logPage * itemsPerPage
  );

  const logTotalPages = Math.ceil(Object.values(groupedLogRecords).length / itemsPerPage);

  const handleLogPageChange = (event, value) => {
    setLogPage(value);
  };

  return (
    <Box sx={{ p: 3, bgcolor: "#f0f7ff", minHeight: "90vh", borderRadius: 2 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", color: "#1e3a8a" }}>
        Quản lý Thuốc
      </Typography>

      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={(e, newValue) => setTabValue(newValue)}
        sx={{ mb: 3, bgcolor: "white", borderRadius: 1, boxShadow: 1 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Kho Thuốc" />
        <Tab label="Cấp Phát Thuốc" />
        <Tab label="Nhật Ký Thuốc" />
      </Tabs>

      {/* Inventory Tab */}
      {tabValue === 0 && (
        <Box>
          <Box sx={{ bgcolor: "#dbeafe", p: 2, borderRadius: 1, mb: 3, display: "flex", alignItems: "center" }}>
            <AlertTriangle size={18} color="#f59e0b" />
            <Typography sx={{ ml: 1, color: "#1e40af" }}>
              Quản lý và theo dõi thuốc trong kho y tế của trường học.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 2 }}>
            <TextField
              label="Tìm kiếm theo tên thuốc"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: { xs: "100%", sm: 300 } }}
              InputProps={{ startAdornment: <Search size={18} sx={{ mr: 1, color: "#6b7280" }} /> }}
            />
            <Button
              variant="contained"
              startIcon={<Plus size={20} />}
              onClick={() => setOpenAddDialog(true)}
              sx={{ bgcolor: "#2563eb", "&:hover": { bgcolor: "#1d4ed8" }, textTransform: "none" }}
            >
              Thêm mới
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f3f4f6" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Tên thuốc</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Số lượng</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Kiểu</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Ngày nhập</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Ghi chú</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRecords.length > 0 ? (
                  paginatedRecords.map((record) => (
                    <TableRow key={record.id} hover onClick={() => handleOpenDetailDialog(record)}>
                      <TableCell>{record.medicationName}</TableCell>
                      <TableCell>{record.quantity}</TableCell>
                      <TableCell>{record.type}</TableCell>
                      <TableCell>{record.entryDate}</TableCell>
                      <TableCell>{record.notes || "Không có"}</TableCell>
                      <TableCell>
                        <Button onClick={(e) => { e.stopPropagation(); handleOpenEditDialog(record); }}>
                          <Edit2 size={20} />
                        </Button>
                        <Button onClick={(e) => { e.stopPropagation(); handleDeleteRecord(record.id); }}>
                          <Trash2 size={20} color="#dc2626" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Chưa có thuốc nào trong kho.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" />
            </Box>
          )}

          {/* Add Medication Dialog */}
          <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
            <DialogTitle>Thêm Thuốc vào kho</DialogTitle>
            <DialogContent>
              <form onSubmit={handleSubmitMedication}>
                <TextField
                  name="medicationName"
                  label="Tên thuốc"
                  value={medicationForm.medicationName}
                  onChange={handleFormChange}
                  required
                  fullWidth
                  margin="normal"
                />
                <TextField
                  name="quantity"
                  label="Số lượng"
                  type="number"
                  value={medicationForm.quantity}
                  onChange={handleFormChange}
                  required
                  fullWidth
                  margin="normal"
                  inputProps={{ min: 1 }}
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Kiểu</InputLabel>
                  <Select
                    name="type"
                    value={medicationForm.type}
                    onChange={handleFormChange}
                    required
                  >
                    <MenuItem value="">Chọn kiểu</MenuItem>
                    {medicationTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  name="entryDate"
                  label="Ngày nhập kho"
                  type="date"
                  value={medicationForm.entryDate}
                  onChange={handleFormChange}
                  required
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  name="notes"
                  label="Ghi chú"
                  value={medicationForm.notes}
                  onChange={handleFormChange}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={2}
                />
                <DialogActions>
                  <Button onClick={() => setOpenAddDialog(false)}>Hủy</Button>
                  <Button type="submit" variant="contained" color="primary">
                    Lưu
                  </Button>
                </DialogActions>
              </form>
            </DialogContent>
          </Dialog>

          {/* Detail Dialog */}
          <Dialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)}>
            <DialogTitle>Chi tiết Thuốc</DialogTitle>
            <DialogContent>
              {selectedRecord && (
                <Box>
                  <Typography><strong>Tên thuốc:</strong> {selectedRecord.medicationName}</Typography>
                  <Typography><strong>Số lượng:</strong> {selectedRecord.quantity}</Typography>
                  <Typography><strong>Kiểu:</strong> {selectedRecord.type}</Typography>
                  <Typography><strong>Ngày nhập:</strong> {selectedRecord.entryDate}</Typography>
                  <Typography><strong>Ghi chú:</strong> {selectedRecord.notes || "Không có"}</Typography>
                  <Typography><strong>Ghi nhận lúc:</strong> {selectedRecord.timestamp}</Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDetailDialog(false)} color="primary">
                Đóng
              </Button>
            </DialogActions>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
            <DialogTitle>Chỉnh sửa Thuốc</DialogTitle>
            <DialogContent>
              <form onSubmit={handleEditMedication}>
                <TextField
                  name="medicationName"
                  label="Tên thuốc"
                  value={medicationForm.medicationName}
                  onChange={handleFormChange}
                  required
                  fullWidth
                  margin="normal"
                />
                <TextField
                  name="quantity"
                  label="Số lượng"
                  type="number"
                  value={medicationForm.quantity}
                  onChange={handleFormChange}
                  required
                  fullWidth
                  margin="normal"
                  inputProps={{ min: 1 }}
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Kiểu</InputLabel>
                  <Select
                    name="type"
                    value={medicationForm.type}
                    onChange={handleFormChange}
                    required
                  >
                    <MenuItem value="">Chọn kiểu</MenuItem>
                    {medicationTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  name="entryDate"
                  label="Ngày nhập kho"
                  type="date"
                  value={medicationForm.entryDate}
                  onChange={handleFormChange}
                  required
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  name="notes"
                  label="Ghi chú"
                  value={medicationForm.notes}
                  onChange={handleFormChange}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={2}
                />
                <DialogActions>
                  <Button onClick={() => setOpenEditDialog(false)}>Hủy</Button>
                  <Button type="submit" variant="contained" color="primary">
                    Lưu
                  </Button>
                </DialogActions>
              </form>
            </DialogContent>
          </Dialog>

          {/* Confirmation Dialog */}
          <Dialog open={showConfirmationDialog} onClose={() => setShowConfirmationDialog(false)}>
            <DialogTitle sx={{ textAlign: "center" }}>
              <CheckCircle size={60} color="#22c55e" />
              <Typography variant="h5">Ghi nhận Thành công!</Typography>
            </DialogTitle>
            <DialogContent>
              <Typography>
                Thuốc <strong>{lastSavedRecord?.medicationName}</strong> đã được thêm vào kho.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center" }}>
              <Button
                onClick={() => setShowConfirmationDialog(false)}
                variant="outlined"
                sx={{ textTransform: "none" }}
              >
                Đóng
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}

      {/* Dispense Medication Tab */}
      {tabValue === 1 && (
        <Box>
          <Box sx={{ bgcolor: "#dbeafe", p: 2, borderRadius: 1, mb: 3, display: "flex", alignItems: "center" }}>
            <AlertTriangle size={18} color="#f59e0b" />
            <Typography sx={{ ml: 1, color: "#1e40af" }}>
              Cấp phát thuốc cho các sự kiện y tế.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 2 }}>
            <TextField
              label="Tìm kiếm sự kiện"
              value={eventSearchTerm}
              onChange={(e) => setEventSearchTerm(e.target.value)}
              sx={{ width: { xs: "100%", sm: 300 } }}
              InputProps={{ startAdornment: <Search size={18} sx={{ mr: 1, color: "#6b7280" }} /> }}
            />
            <Button
              variant="contained"
              startIcon={<Plus size={20} />}
              onClick={() => setOpenDispenseDialog(true)}
              sx={{ bgcolor: "#2563eb", "&:hover": { bgcolor: "#1d4ed8" }, textTransform: "none" }}
            >
              Cấp phát
            </Button>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {filteredDispenseRecords.length > 0 ? (
              filteredDispenseRecords.map((record) => (
                <Card key={record.id} sx={{ boxShadow: 1, borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" color="#1e40af">
                      {record.eventName}
                    </Typography>
                    <Typography color="textSecondary">
                      <strong>Học sinh:</strong> {record.studentId}
                    </Typography>
                    <Typography color="textSecondary">
                      <strong>Thuốc:</strong> {record.medicationName} ({record.quantity} {record.type})
                    </Typography>
                    <Typography color="textSecondary">
                      <strong>Thời gian:</strong> {record.timestamp}
                    </Typography>
                    <Typography color="textSecondary">
                      <strong>Ghi chú:</strong> {record.notes || record.eventDescription || "Không có"}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography color="textSecondary" align="center">
                Chưa có bản ghi cấp phát nào.
              </Typography>
            )}
          </Box>

          {dispenseTotalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                count={dispenseTotalPages}
                page={dispensePage}
                onChange={handleDispensePageChange}
                color="primary"
              />
            </Box>
          )}

          {/* Dispense Dialog */}
          <Dialog open={openDispenseDialog} onClose={() => setOpenDispenseDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Cấp phát Thuốc</DialogTitle>
            <DialogContent>
              <form onSubmit={handleDispenseSubmit}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Sự kiện</InputLabel>
                  <Select
                    name="eventId"
                    value={dispenseForm.eventId}
                    onChange={(e) => handleDispenseFormChange(e)}
                    required
                  >
                    <MenuItem value="">Chọn sự kiện</MenuItem>
                    {filteredEvents.map((event) => (
                      <MenuItem key={event.id} value={event.id}>
                        {event.student.name} - {event.event.eventType} ({event.event.date})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                  Thuốc cấp phát
                </Typography>
                {dispenseForm.medications.map((med, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, border: 1, borderColor: "grey.300", borderRadius: 1, position: "relative" }}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Thuốc</InputLabel>
                      <Select
                        name={`medicationId-${index}`}
                        value={med.medicationId}
                        onChange={(e) => handleDispenseFormChange(e, index)}
                        required
                      >
                        <MenuItem value="">Chọn thuốc</MenuItem>
                        {medicationRecords.map((m) => (
                          <MenuItem key={m.id} value={m.id}>
                            {m.medicationName} ({m.quantity} {m.type})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      name={`quantity-${index}`}
                      label="Số lượng"
                      type="number"
                      value={med.quantity}
                      onChange={(e) => handleDispenseFormChange(e, index)}
                      required
                      fullWidth
                      margin="normal"
                      inputProps={{ min: 1 }}
                    />
                    <TextField
                      name={`notes-${index}`}
                      label="Ghi chú"
                      value={med.notes}
                      onChange={(e) => handleDispenseFormChange(e, index)}
                      fullWidth
                      margin="normal"
                      multiline
                      rows={2}
                    />
                    {dispenseForm.medications.length > 1 && (
                      <Button
                        onClick={() => removeMedicationField(index)}
                        sx={{ position: "absolute", top: 8, right: 8 }}
                        color="error"
                      >
                        <X size={20} />
                      </Button>
                    )}
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  startIcon={<Plus size={20} />}
                  onClick={addMedicationField}
                  sx={{ mt: 1, mb: 2 }}
                >
                  Thêm thuốc
                </Button>
                <DialogActions>
                  <Button onClick={() => setOpenDispenseDialog(false)}>Hủy</Button>
                  <Button type="submit" variant="contained" color="primary">
                    Cấp phát
                  </Button>
                </DialogActions>
              </form>
            </DialogContent>
          </Dialog>

          {/* Dispense Confirmation Dialog */}
          <Dialog open={showDispenseConfirmation} onClose={() => setShowDispenseConfirmation(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ textAlign: "center" }}>
              <CheckCircle size={60} color="#22c55e" />
              <Typography variant="h5">Cấp phát Thành công!</Typography>
            </DialogTitle>
            <DialogContent>
              <Typography>
                Đã cấp phát thuốc cho <strong>{lastDispensedRecords[0]?.eventName}</strong>:
              </Typography>
              <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                {lastDispensedRecords.map((record, index) => (
                  <li key={index}>
                    <Typography>
                      <strong>{record.medicationName}</strong>: {record.quantity} {record.type}{" "}
                      {record.notes && `(${record.notes})`}
                    </Typography>
                  </li>
                ))}
              </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center" }}>
              <Button
                onClick={() => setShowDispenseConfirmation(false)}
                variant="outlined"
                sx={{ textTransform: "none" }}
              >
                Đóng
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}

      {/* Medication Log Tab */}
      {tabValue === 2 && (
        <Box>
          <Box sx={{ bgcolor: "#dbeafe", p: 2, borderRadius: 1, mb: 3, display: "flex", alignItems: "center" }}>
            <AlertTriangle size={18} color="#f59e0b" />
            <Typography sx={{ ml: 1, color: "#1e40af" }}>
              Nhật ký ghi nhận lịch sử sự kiện và thuốc được cấp phát.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <TextField
              label="Tìm kiếm theo tên thuốc"
              value={logSearchTerm}
              onChange={(e) => setLogSearchTerm(e.target.value)}
              sx={{ width: { xs: "100%", sm: 300 } }}
              InputProps={{ startAdornment: <Search size={18} sx={{ mr: 1, color: "#6b7280" }} /> }}
            />
            <TextField
              label="Lọc theo ngày"
              type="date"
              value={logDateFilter}
              onChange={(e) => setLogDateFilter(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ width: { xs: "100%", sm: 200 } }}
            />
            <FormControl sx={{ width: { xs: "100%", sm: 200 } }}>
              <InputLabel>Lọc theo kiểu</InputLabel>
              <Select
                value={logTypeFilter}
                onChange={(e) => setLogTypeFilter(e.target.value)}
              >
                <MenuItem value="">Tất cả</MenuItem>
                {medicationTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {logRecordsArray.length > 0 ? (
              logRecordsArray.map(({ event, medications }) => (
                <Card key={event.id} sx={{ boxShadow: 1, borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" color="#1e40af">
                      {event.student.name} - {event.event.eventType}
                    </Typography>
                    <Typography color="textSecondary">
                      <strong>Mã học sinh:</strong> {event.student.id}
                    </Typography>
                    <Typography color="textSecondary">
                      <strong>Lớp:</strong> {event.student.class}
                    </Typography>
                    <Typography color="textSecondary">
                      <strong>Ngày:</strong> {event.event.date} {event.event.time}
                    </Typography>
                    <Typography color="textSecondary">
                      <strong>Mô tả:</strong> {event.event.description}
                    </Typography>
                    <Typography color="textSecondary">
                      <strong>Hành động đã thực hiện:</strong> {event.event.actionsTaken}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1">Thuốc cấp phát:</Typography>
                    <Box component="ul" sx={{ pl: 2 }}>
                      {medications.map((med) => (
                        <li key={med.id}>
                          <Typography>
                            <strong>{med.medicationName}</strong>: {med.quantity} {med.type}{" "}
                            {med.notes && `(${med.notes})`} - {med.timestamp}
                          </Typography>
                        </li>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography color="textSecondary" align="center">
                Chưa có bản ghi nào.
              </Typography>
            )}
          </Box>

          {logTotalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination count={logTotalPages} page={logPage} onChange={handleLogPageChange} color="primary" />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

export default InventoryMedications;
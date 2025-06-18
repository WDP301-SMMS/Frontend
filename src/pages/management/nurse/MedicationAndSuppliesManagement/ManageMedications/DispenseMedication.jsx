import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  Paper,
  Alert,
  Autocomplete,
  Container,
} from "@mui/material";
import {
  Search,
  Plus,
  X,
  Clock,
  User,
  Calendar,
  Package,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import { eventsLog, Medication } from "~/mock/mock";
import { AccessTime, CalendarMonth, LockClockOutlined, Person3Sharp, Warning } from "@mui/icons-material";

const MedicineDispensePage = () => {
  // Mock data (unchanged)
  const [events] = useState(eventsLog);

  const [medications] = useState(Medication);

  // States
  const [eventSearchTerm, setEventSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dispenseForm, setDispenseForm] = useState({
    medications: [
      { medication: null, quantity: 1, notes: "", customUsage: "" },
    ],
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [dispensedData, setDispensedData] = useState(null);
  const [errors, setErrors] = useState({});

  // Get unique classes
  const classes = [...new Set(events.map((event) => event.class))].sort();

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.studentName
          .toLowerCase()
          .includes(eventSearchTerm.toLowerCase()) ||
        event.eventType.toLowerCase().includes(eventSearchTerm.toLowerCase()) ||
        event.studentId.toLowerCase().includes(eventSearchTerm.toLowerCase());
      const matchesClass =
        selectedClass === "" || event.class === selectedClass;
      return matchesSearch && matchesClass;
    });
  }, [events, eventSearchTerm, selectedClass]);

  // Selected medications for preview
  const selectedMedications = useMemo(() => {
    return dispenseForm.medications
      .filter((med) => med.medication)
      .map((med) => ({
        ...med.medication,
        quantity: med.quantity,
        notes: med.notes,
        usage: med.customUsage || med.medication.usage,
      }));
  }, [dispenseForm.medications]);

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setDispenseForm({
      medications: [
        { medication: null, quantity: 1, notes: "", customUsage: "" },
      ],
    });
    setErrors({});
  };

  const handleMedicationChange = (index, field, value) => {
    const newMedications = [...dispenseForm.medications];
    newMedications[index] = { ...newMedications[index], [field]: value };
    setDispenseForm({ medications: newMedications });

    if (field === "quantity") {
      const medication = newMedications[index].medication;
      if (medication && value > medication.stockQuantity) {
        setErrors((prev) => ({
          ...prev,
          [`quantity-${index}`]: `Số lượng vượt quá tồn kho (${medication.stockQuantity} ${medication.type})`,
        }));
      } else {
        setErrors((prev) => ({ ...prev, [`quantity-${index}`]: "" }));
      }
    }
  };

  const addMedicationField = () => {
    setDispenseForm({
      medications: [
        ...dispenseForm.medications,
        { medication: null, quantity: 1, notes: "", customUsage: "" },
      ],
    });
  };

  const removeMedicationField = (index) => {
    if (dispenseForm.medications.length > 1) {
      const newMedications = dispenseForm.medications.filter(
        (_, i) => i !== index
      );
      setDispenseForm({ medications: newMedications });
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`quantity-${index}`];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !selectedEvent ||
      !dispenseForm.medications.some((med) => med.medication)
    ) {
      setErrors((prev) => ({
        ...prev,
        form: "Vui lòng chọn ít nhất một loại thuốc",
      }));
      return;
    }

    const hasQuantityError = Object.values(errors).some((error) => error);
    if (hasQuantityError) return;

    const dispensedMedications = selectedMedications.map((med) => ({
      ...med,
      dispensedAt: new Date().toLocaleString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
      }),
    }));

    setDispensedData({
      event: selectedEvent,
      medications: dispensedMedications,
    });
    setShowConfirmation(true);
    setSelectedEvent(null);
    setDispenseForm({
      medications: [
        { medication: null, quantity: 1, notes: "", customUsage: "" },
      ],
    });
    setErrors({});
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#22c55e";
      default:
        return "#6b7280";
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{ py: 4, bgcolor: "#f5f5f5", minHeight: "100vh" }}
    >
      <Alert
        severity="info"
        icon={<Warning />}
        sx={{ mb: 3, fontWeight: "medium" }}
      >
        Quản lý và theo dõi thuốc trong kho y tế của trường học
      </Alert>

      <Box sx={{ mb: 3, display: "flex", flexWrap: "wrap", gap: 2 }}>
        <TextField
          label="Tìm kiếm sự kiện, học sinh..."
          value={eventSearchTerm}
          onChange={(e) => setEventSearchTerm(e.target.value)}
          sx={{ width: { xs: "100%", sm: 400 } }}
          InputProps={{
            startAdornment: (
              <Search size={18} sx={{ mr: 1, color: "#6b7280" }} />
            ),
          }}
        />
        <FormControl sx={{ width: { xs: "100%", sm: 200 } }}>
          <InputLabel>Lớp</InputLabel>
          <Select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <MenuItem value="">Tất cả lớp</MenuItem>
            {classes.map((cls) => (
              <MenuItem key={cls} value={cls}>
                {cls}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={2} sx={{ maxHeight: "60vh", overflowY: "auto" }}>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Grid item xs={12} sm={6} key={event.id}>
              <Card
                sx={{
                  boxShadow: 2,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "grey.200",
                  cursor: "pointer",
                  "&:hover": { boxShadow: 4 },
                  height: 150, // Default height
                  width: "250px", // Default width to fill grid item
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                onClick={() => handleEventSelect(event)}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                  }}
                >
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          bgcolor: getSeverityColor(event.severity),
                          mr: 1,
                        }}
                      />
                      <Typography
                        variant="subtitle1"
                        fontWeight="medium"
                        color="text.primary"
                      >
                        {event.eventType}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
                    >
                      <Person3Sharp size={14} sx={{ mr: 0.5 }} /> {event.studentName} (
                      {event.studentId}) - {event.class}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <AccessTime size={14} sx={{ mr: 0.5 }} /> {event.date}{" "}
                      {event.time}
                    </Typography>
                  </Box>
                  <ChevronRight size={16} color="#6b7280" />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography color="text.secondary" align="center">
              Không tìm thấy sự kiện nào
            </Typography>
          </Grid>
        )}
      </Grid>

      {/* Dispense Dialog */}
      <Dialog
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "#2563eb", color: "white", py: 2 }}>
          Cấp phát thuốc
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            {/* Dispense Form */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  mb: 3,
                  bgcolor: "#f8fafc",
                  boxShadow: 2,
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      bgcolor: "#dbeafe",
                      p: 1,
                      borderRadius: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        bgcolor: getSeverityColor(selectedEvent?.severity),
                        mr: 1.5,
                      }}
                    />
                    <Typography variant="h6" color="#1e40af" fontWeight="bold">
                      {selectedEvent?.eventType}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
                    <Typography
                      variant="body1"
                      fontWeight="medium"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Person3Sharp size={16} sx={{ mr: 1, color: "#4b5563" }} />{" "}
                      {selectedEvent?.studentName} ({selectedEvent?.studentId})
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <CalendarMonth size={16} sx={{ mr: 1, color: "#4b5563" }} />{" "}
                      {selectedEvent?.class}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1, lineHeight: 1.6 }}
                  >
                    {selectedEvent?.description}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "flex", alignItems: "center", mt: 1 }}
                  >
                    <AccessTime size={14} sx={{ mr: 1 }} /> {selectedEvent?.date}{" "}
                    {selectedEvent?.time}
                  </Typography>
                </CardContent>
              </Card>
              <form onSubmit={handleSubmit}>
                {dispenseForm.medications.map((med, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 3,
                      mb: 2,
                      border: 1,
                      borderColor: "grey.300",
                      borderRadius: 2,
                      position: "relative",
                      boxShadow: 1,
                    }}
                  >
                    <Autocomplete
                      options={medications}
                      getOptionLabel={(option) =>
                        `${option.name} (Còn: ${option.stockQuantity} ${option.type})`
                      }
                      value={med.medication}
                      onChange={(event, newValue) =>
                        handleMedicationChange(index, "medication", newValue)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Thuốc"
                          placeholder="Nhập để tìm kiếm thuốc..."
                          sx={{ mb: 2 }}
                        />
                      )}
                      filterOptions={(options, { inputValue }) =>
                        options.filter(
                          (option) =>
                            option.name
                              .toLowerCase()
                              .includes(inputValue.toLowerCase()) ||
                            option.indication
                              .toLowerCase()
                              .includes(inputValue.toLowerCase())
                        )
                      }
                    />
                    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                      <TextField
                        label="Số lượng"
                        type="number"
                        value={med.quantity}
                        onChange={(e) =>
                          handleMedicationChange(
                            index,
                            "quantity",
                            parseInt(e.target.value)
                          )
                        }
                        inputProps={{ min: 1 }}
                        fullWidth
                        error={!!errors[`quantity-${index}`]}
                        helperText={errors[`quantity-${index}`]}
                      />
                      <TextField
                        label="Ghi chú"
                        value={med.notes}
                        onChange={(e) =>
                          handleMedicationChange(index, "notes", e.target.value)
                        }
                        fullWidth
                        multiline
                        rows={2}
                      />
                    </Box>
                    <TextField
                      label="Cách sử dụng"
                      value={med.customUsage}
                      onChange={(e) =>
                        handleMedicationChange(
                          index,
                          "customUsage",
                          e.target.value
                        )
                      }
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="Nhập hướng dẫn sử dụng cụ thể (nếu có)"
                      sx={{ mb: 2 }}
                    />
                    {dispenseForm.medications.length > 1 && (
                      <IconButton
                        onClick={() => removeMedicationField(index)}
                        sx={{ position: "absolute", top: 8, right: 8 }}
                        color="error"
                      >
                        <X size={16} />
                      </IconButton>
                    )}
                  </Paper>
                ))}
                <Button
                  startIcon={<Plus size={16} />}
                  onClick={addMedicationField}
                  sx={{ mb: 2, textTransform: "none", color: "#2563eb" }}
                >
                  Thêm thuốc
                </Button>
                {errors.form && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {errors.form}
                  </Alert>
                )}
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    onClick={() => setSelectedEvent(null)}
                    fullWidth
                    variant="outlined"
                    sx={{
                      textTransform: "none",
                      borderColor: "#d1d5db",
                      color: "#374151",
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      textTransform: "none",
                      bgcolor: "#2563eb",
                      "&:hover": { bgcolor: "#1d4ed8" },
                    }}
                  >
                    Cấp phát
                  </Button>
                </Box>
              </form>
            </Grid>

            {/* Preview Panel */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: "medium", color: "#1e40af" }}
              >
                Xem trước cấp phát
              </Typography>
              {selectedMedications.length > 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Card
                    sx={{ bgcolor: "#dbeafe", boxShadow: 2, borderRadius: 2 }}
                  >
                    <CardContent>
                      <Typography
                        variant="subtitle2"
                        color="#1e40af"
                        fontWeight="medium"
                        sx={{ mb: 1.5 }}
                      >
                        Thông tin sự kiện
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <User size={14} sx={{ mr: 1, color: "#4b5563" }} />
                        {selectedEvent?.studentName} ({selectedEvent?.studentId}
                        )
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Calendar size={14} sx={{ mr: 1, color: "#4b5563" }} />
                        {selectedEvent?.eventType} - {selectedEvent?.date}{" "}
                        {selectedEvent?.time}
                      </Typography>
                    </CardContent>
                  </Card>
                  <Typography
                    variant="subtitle2"
                    color="text.primary"
                    fontWeight="medium"
                  >
                    Thuốc sẽ cấp phát:
                  </Typography>
                  {selectedMedications.map((med, index) => (
                    <Card
                      key={index}
                      sx={{
                        border: 1,
                        borderColor: "grey.200",
                        borderRadius: 2,
                        boxShadow: 1,
                      }}
                    >
                      <CardContent sx={{ display: "flex", gap: 2 }}>
                        <Box
                          sx={{ bgcolor: "#d1fae5", p: 1.5, borderRadius: 1 }}
                        >
                          <Package size={16} color="#059669" />
                        </Box>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.primary"
                            fontWeight="medium"
                          >
                            {med.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 0.5,
                            }}
                          >
                            <Package size={14} sx={{ mr: 1 }} /> Số lượng:{" "}
                            {med.quantity} {med.type}
                          </Typography>
                          <Paper
                            sx={{
                              p: 1,
                              mt: 1,
                              bgcolor: "#fef3c7",
                              borderRadius: 1,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="#b45309"
                              fontWeight="medium"
                            >
                              Cách sử dụng:
                            </Typography>
                            <Typography variant="caption" color="#b45309">
                              {med.usage}
                            </Typography>
                          </Paper>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", mt: 1 }}
                          >
                            Công dụng: {med.indication}
                            <br />
                            HSD: {med.expiry}
                            <br />
                            {med.notes && `Ghi chú: ${med.notes}`}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                  <Card
                    sx={{ bgcolor: "#d1fae5", borderRadius: 2, boxShadow: 1 }}
                  >
                    <CardContent>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Clock size={14} sx={{ mr: 1 }} />
                        {"  "}Thời gian cấp phát:{" "}
                        {new Date().toLocaleString("vi-VN", {
                          timeZone: "Asia/Ho_Chi_Minh",
                        })}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ) : (
                <Box
                  sx={{ textAlign: "center", py: 4, color: "text.secondary" }}
                >
                  <Package size={48} sx={{ mb: 2, color: "grey.300" }} />
                  <Typography>Chưa chọn thuốc nào</Typography>
                  <Typography variant="caption">
                    Vui lòng chọn thuốc để xem trước
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setSelectedEvent(null)}
            sx={{ textTransform: "none", color: "#374151" }}
          >
            Hủy
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: "center", bgcolor: "#f3f4f6", py: 3 }}>
          <CheckCircle size={60} color="#22c55e" />
          <Typography variant="h5" fontWeight="medium">
            Cấp phát thành công!
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography sx={{ mb: 2 }}>
            Đã cấp phát thuốc cho{" "}
            <strong>{dispensedData?.event.studentName}</strong>:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 1 }}>
            {dispensedData?.medications.map((med, index) => (
              <li key={index}>
                <Typography variant="body2">
                  <strong>{med.name}</strong>: {med.quantity} {med.type}
                  {med.notes && ` (${med.notes})`}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Cách sử dụng: {med.usage}
                </Typography>
              </li>
            ))}
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 2, display: "block" }}
          >
            Thời gian: {dispensedData?.medications[0]?.dispensedAt}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            onClick={() => setShowConfirmation(false)}
            variant="outlined"
            sx={{
              textTransform: "none",
              borderColor: "#d1d5db",
              color: "#374151",
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MedicineDispensePage;

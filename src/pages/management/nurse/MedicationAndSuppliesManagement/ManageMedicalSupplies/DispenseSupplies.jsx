import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
import { AccessTime, CalendarMonth, Person3Sharp, Warning } from "@mui/icons-material";
import { eventsLog } from "~/mock/mock";

const DispenseSupplies = ({ supplyRecords, setSupplyRecords, setDispenseLogs, events }) => {
  const [eventSearchTerm, setEventSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDispenseDialog, setOpenDispenseDialog] = useState(false);
  const [dispenseForm, setDispenseForm] = useState({
    supplies: [{ supplyId: "", quantity: 1, notes: "" }],
    eventName: "",
    studentName: "",
    dispenseDate: new Date().toISOString().substring(0, 10),
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [dispensedData, setDispensedData] = useState(null);
  const [errors, setErrors] = useState({});

  // Get unique classes
  const classes = [...new Set(eventsLog.map((event) => event.class))].sort();

  // Filtered events
  const filteredEvents = useMemo(() => {
    return eventsLog.filter((event) => {
      const matchesSearch =
        event.studentName
          .toLowerCase()
          .includes(eventSearchTerm.toLowerCase()) ||
        event.eventType.toLowerCase().includes(eventSearchTerm.toLowerCase()) ||
        event.studentId.toLowerCase().includes(eventSearchTerm.toLowerCase());
      const matchesClass = selectedClass === "" || event.class === selectedClass;
      return matchesSearch && matchesClass;
    });
  }, [events, eventSearchTerm, selectedClass]);

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setDispenseForm({
      supplies: [{ supplyId: "", quantity: 1, notes: "" }],
      eventName: event.eventType,
      studentName: event.studentName,
      dispenseDate: new Date().toISOString().substring(0, 10),
    });
    setOpenDispenseDialog(true);
    setErrors({});
  };

  const handleDispenseFormChange = (index, field, value) => {
    const newSupplies = [...dispenseForm.supplies];
    newSupplies[index] = { ...newSupplies[index], [field]: value };
    setDispenseForm((prev) => ({ ...prev, supplies: newSupplies }));

    if (field === "quantity") {
      const supply = supplyRecords.find((s) => s.id === newSupplies[index].supplyId);
      if (supply && value > supply.quantity) {
        setErrors((prev) => ({
          ...prev,
          [`quantity-${index}`]: `Số lượng vượt quá tồn kho (${supply.quantity} ${supply.type})`,
        }));
      } else {
        setErrors((prev) => ({ ...prev, [`quantity-${index}`]: "" }));
      }
    }
  };

  const handleEventFormChange = (e) => {
    const { name, value } = e.target;
    setDispenseForm((prev) => ({ ...prev, [name]: value }));
  };

  const addSupplyField = () => {
    setDispenseForm((prev) => ({
      ...prev,
      supplies: [...prev.supplies, { supplyId: "", quantity: 1, notes: "" }],
    }));
  };

  const removeSupplyField = (index) => {
    if (dispenseForm.supplies.length > 1) {
      const newSupplies = dispenseForm.supplies.filter((_, i) => i !== index);
      setDispenseForm((prev) => ({ ...prev, supplies: newSupplies }));
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`quantity-${index}`];
        return newErrors;
      });
    }
  };

  const handleDispenseSupply = (e) => {
    e.preventDefault();
    if (!dispenseForm.eventName || !dispenseForm.studentName || !dispenseForm.supplies.some((s) => s.supplyId)) {
      setErrors((prev) => ({
        ...prev,
        form: "Vui lòng điền đầy đủ thông tin sự kiện và ít nhất một vật tư",
      }));
      return;
    }

    const hasQuantityError = Object.values(errors).some((error) => error);
    if (hasQuantityError) return;

    const dispensedSupplies = dispenseForm.supplies
      .filter((s) => s.supplyId)
      .map((s) => {
        const supply = supplyRecords.find((r) => r.id === s.supplyId);
        return {
          supplyName: supply.supplyName,
          quantity: parseInt(s.quantity),
          notes: s.notes,
          type: supply.type,
        };
      });

    const newDispenseLog = {
      id: Date.now().toString(),
      eventName: dispenseForm.eventName,
      studentName: dispenseForm.studentName,
      supplies: dispensedSupplies,
      dispenseDate: dispenseForm.dispenseDate,
      timestamp: new Date().toLocaleString("vi-VN", { hour12: false, timeZone: "Asia/Ho_Chi_Minh" }),
    };

    setDispenseLogs((prevLogs) => [...prevLogs, newDispenseLog]);
    setSupplyRecords((prevSupplies) =>
      prevSupplies.map((s) => {
        const dispensedQty = dispenseForm.supplies
          .filter((d) => d.supplyId === s.id)
          .reduce((sum, d) => sum + parseInt(d.quantity), 0);
        return dispensedQty > 0 ? { ...s, quantity: s.quantity - dispensedQty } : s;
      })
    );
    setDispensedData(newDispenseLog);
    setShowConfirmation(true);
    setOpenDispenseDialog(false);
    setSelectedEvent(null);
    setDispenseForm({
      supplies: [{ supplyId: "", quantity: 1, notes: "" }],
      eventName: "",
      studentName: "",
      dispenseDate: new Date().toISOString().substring(0, 10),
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
    <Container maxWidth="xl" sx={{ py: 4, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Alert severity="info" icon={<Warning />} sx={{ mb: 3, fontWeight: "medium" }}>
        Quản lý và theo dõi cấp phát vật tư trong kho y tế của trường học
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
                  height: 150,
                  width: "250px",
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

      <Dialog open={openDispenseDialog} onClose={() => setOpenDispenseDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ bgcolor: "#2563eb", color: "white", py: 2 }}>
          Cấp phát Vật tư cho Sự kiện
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            {/* Dispense Form */}
            <Grid item xs={12} md={6}>
              <Card sx={{ mb: 3, bgcolor: "#f8fafc", boxShadow: 2, borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2, bgcolor: "#dbeafe", p: 1, borderRadius: 1 }}>
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
                      {selectedEvent?.eventType || dispenseForm.eventName}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
                    <Typography
                      variant="body1"
                      fontWeight="medium"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Person3Sharp size={16} sx={{ mr: 1, color: "#4b5563" }} /> {selectedEvent?.studentName || dispenseForm.studentName}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <CalendarMonth size={16} sx={{ mr: 1, color: "#4b5563" }} /> {selectedEvent?.class || ""}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1, lineHeight: 1.6 }}
                  >
                    {selectedEvent?.description || ""}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "flex", alignItems: "center", mt: 1 }}
                  >
                    <AccessTime size={14} sx={{ mr: 1 }} /> {selectedEvent?.date} {selectedEvent?.time}
                  </Typography>
                </CardContent>
              </Card>
              <form onSubmit={handleDispenseSupply}>
                {dispenseForm.supplies.map((supply, index) => (
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
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Vật tư</InputLabel>
                      <Select
                        name="supplyId"
                        value={supply.supplyId}
                        onChange={(e) => handleDispenseFormChange(index, "supplyId", e.target.value)}
                        required
                        label="Vật tư"
                      >
                        <MenuItem value="">Chọn vật tư</MenuItem>
                        {supplyRecords.map((s) => (
                          <MenuItem key={s.id} value={s.id}>
                            {s.supplyName} (Còn: {s.quantity} {s.type})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                      <TextField
                        label="Số lượng"
                        type="number"
                        value={supply.quantity}
                        onChange={(e) => handleDispenseFormChange(index, "quantity", parseInt(e.target.value) || 1)}
                        inputProps={{ min: 1 }}
                        fullWidth
                        error={!!errors[`quantity-${index}`]}
                        helperText={errors[`quantity-${index}`]}
                      />
                      <TextField
                        label="Ghi chú"
                        value={supply.notes}
                        onChange={(e) => handleDispenseFormChange(index, "notes", e.target.value)}
                        fullWidth
                        multiline
                        rows={2}
                      />
                    </Box>
                    {dispenseForm.supplies.length > 1 && (
                      <IconButton
                        onClick={() => removeSupplyField(index)}
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
                  onClick={addSupplyField}
                  sx={{ mb: 2, textTransform: "none", color: "#2563eb" }}
                >
                  Thêm vật tư
                </Button>
                {errors.form && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {errors.form}
                  </Alert>
                )}
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    onClick={() => setOpenDispenseDialog(false)}
                    fullWidth
                    variant="outlined"
                    sx={{ textTransform: "none", borderColor: "#d1d5db", color: "#374151" }}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ textTransform: "none", bgcolor: "#2563eb", "&:hover": { bgcolor: "#1d4ed8" } }}
                  >
                    Cấp phát
                  </Button>
                </Box>
              </form>
            </Grid>

            {/* Preview Panel */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "medium", color: "#1e40af" }}>
                Xem trước cấp phát
              </Typography>
              {dispenseForm.supplies.some((s) => s.supplyId) ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Card sx={{ bgcolor: "#dbeafe", boxShadow: 2, borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="#1e40af" fontWeight="medium" sx={{ mb: 1.5 }}>
                        Thông tin sự kiện
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <User size={14} sx={{ mr: 1, color: "#4b5563" }} /> {selectedEvent?.studentName || dispenseForm.studentName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <Calendar size={14} sx={{ mr: 1, color: "#4b5563" }} /> {selectedEvent?.eventType || dispenseForm.eventName} - {selectedEvent?.date || dispenseForm.dispenseDate}
                      </Typography>
                    </CardContent>
                  </Card>
                  <Typography variant="subtitle2" color="text.primary" fontWeight="medium">
                    Vật tư sẽ cấp phát:
                  </Typography>
                  {dispenseForm.supplies
                    .filter((s) => s.supplyId)
                    .map((s, index) => {
                      const supply = supplyRecords.find((r) => r.id === s.supplyId);
                      return (
                        <Card key={index} sx={{ border: 1, borderColor: "grey.200", borderRadius: 2, boxShadow: 1 }}>
                          <CardContent sx={{ display: "flex", gap: 2 }}>
                            <Box sx={{ bgcolor: "#d1fae5", p: 1.5, borderRadius: 1 }}>
                              <Package size={16} color="#059669" />
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" color="text.primary" fontWeight="medium">
                                {supply.supplyName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                                <Package size={14} sx={{ mr: 1 }} /> Số lượng: {s.quantity} {supply.type}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                                {s.notes && `Ghi chú: ${s.notes}`}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      );
                    })}
                  <Card sx={{ bgcolor: "#d1fae5", borderRadius: 2, boxShadow: 1 }}>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                        <Clock size={14} sx={{ mr: 1 }} /> Thời gian cấp phát: {new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ) : (
                <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
                  <Package size={48} sx={{ mb: 2, color: "grey.300" }} />
                  <Typography>Chưa chọn vật tư nào</Typography>
                  <Typography variant="caption">Vui lòng chọn vật tư để xem trước</Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpenDispenseDialog(false)}
            sx={{ textTransform: "none", color: "#374151" }}
          >
            Hủy
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onClose={() => setShowConfirmation(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: "center", bgcolor: "#f3f4f6", py: 3 }}>
          <CheckCircle size={60} color="#22c55e" />
          <Typography variant="h5" fontWeight="medium">Cấp phát thành công!</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography sx={{ mb: 2 }}>
            Đã cấp phát vật tư cho <strong>{dispensedData?.studentName}</strong> tại sự kiện{" "}
            <strong>{dispensedData?.eventName}</strong>:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 1 }}>
            {dispensedData?.supplies.map((supply, index) => (
              <li key={index}>
                <Typography variant="body2">
                  <strong>{supply.supplyName}</strong>: {supply.quantity} {supply.type}
                  {supply.notes && ` (${supply.notes})`}
                </Typography>
              </li>
            ))}
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
            Thời gian: {dispensedData?.timestamp}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            onClick={() => setShowConfirmation(false)}
            variant="outlined"
            sx={{ textTransform: "none", borderColor: "#d1d5db", color: "#374151" }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DispenseSupplies;
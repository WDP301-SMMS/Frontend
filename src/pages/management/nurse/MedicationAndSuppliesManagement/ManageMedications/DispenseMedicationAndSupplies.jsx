import React, { useState, useEffect, useMemo } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Autocomplete,
  Container,
  CircularProgress,
  IconButton,
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
  Eye,
} from "lucide-react";
import {
  AccessTime,
  CalendarMonth,
  InfoOutlined,
  Person3Sharp,
  Warning,
} from "@mui/icons-material";
import incidentsService from "~/libs/api/services/incidentsService";
import inventoryService from "~/libs/api/services/inventory";

const DispenseMedicationAndSupplies = () => {
  const [incidents, setIncidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [dispenseForm, setDispenseForm] = useState({
    medications: [
      { itemId: null, quantityToWithdraw: 1, usageInstructions: "" },
    ],
    supplies: [{ itemId: null, quantityToWithdraw: 1, usageInstructions: "" }],
  });
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showDispenseDialog, setShowDispenseDialog] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [dispensedData, setDispensedData] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [medicineOptions, setMedicineOptions] = useState([]);
  const [supplyOptions, setSupplyOptions] = useState([]);

  // Get unique classes based on student full name's first part
  const classes = useMemo(
    () =>
      [
        ...new Set(
          incidents.map(
            (incident) => incident.studentId?.fullName.split(" ")[0]
          )
        ),
      ].sort(),
    [incidents]
  );

  // Filtered incidents
  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      const matchesSearch =
        incident.studentId?.fullName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        incident.incidentType
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        incident.studentId?._id
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesClass =
        selectedClass === "" ||
        incident.studentId?.fullName.split(" ")[0] === selectedClass;
      return matchesSearch && matchesClass;
    });
  }, [incidents, searchTerm, selectedClass]);

  useEffect(() => {
    const fetchIncidents = async () => {
      setLoading(true);
      try {
        const response = await incidentsService.getAllIncidentsToDispense();
        setIncidents(response.data || []);
      } catch (error) {
        console.error("Failed to fetch incidents:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIncidents();

    const fetchInventoryItems = async () => {
      try {
        const medicineResponse = await inventoryService.getInventoryItems({
          type: "MEDICINE",
          status: "IN_STOCK",
        });
        setMedicineOptions(
          medicineResponse.data.map((item) => ({
            itemId: item._id,
            name: item.itemName,
            totalQuantity: item.totalQuantity,
          }))
        );
        const supplyResponse = await inventoryService.getInventoryItems({
          type: "MEDICAL_SUPPLIES",
          status: "IN_STOCK",
        });
        setSupplyOptions(
          supplyResponse.data.map((item) => ({
            itemId: item._id,
            name: item.itemName,
            totalQuantity: item.totalQuantity,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch inventory items:", error);
      }
    };
    fetchInventoryItems();
  }, []);

  const handleIncidentSelect = (incident) => {
    setSelectedIncident(incident);
    setShowDetailDialog(true);
  };

  const handleProceedToDispense = () => {
    if (selectedIncident?.status === "COMPLETED") {
      setErrors((prev) => ({
        ...prev,
        form: "Không thể cấp phát cho sự kiện đã hoàn thành",
      }));
      return;
    }
    setShowDetailDialog(false);
    setDispenseForm({
      medications: [
        { itemId: null, quantityToWithdraw: 1, usageInstructions: "" },
      ],
      supplies: [
        { itemId: null, quantityToWithdraw: 1, usageInstructions: "" },
      ],
    });
    setErrors({});
    setShowDispenseDialog(true);
  };

  const handleItemChange = (type, index, field, value) => {
    const newItems = [...dispenseForm[type]];
    if (field === "itemId" && value) {
      const selectedItem = (
        type === "medications" ? medicineOptions : supplyOptions
      ).find((item) => item.itemId === value);
      newItems[index] = {
        ...newItems[index],
        [field]: value,
        maxQuantity: selectedItem?.totalQuantity || 1,
      };
      if (
        newItems[index].quantityToWithdraw > (selectedItem?.totalQuantity || 1)
      ) {
        newItems[index].quantityToWithdraw = Math.min(
          newItems[index].quantityToWithdraw,
          selectedItem?.totalQuantity || 1
        );
      }
    } else if (field === "quantityToWithdraw") {
      const maxQuantity = newItems[index].maxQuantity || 1;
      value = Math.min(Math.max(parseInt(value) || 1, 1), maxQuantity);
      newItems[index] = { ...newItems[index], [field]: value };
    } else if (field === "usageInstructions") {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setDispenseForm((prev) => ({ ...prev, [type]: newItems }));
  };

  const addItemField = (type) => {
    setDispenseForm((prev) => ({
      ...prev,
      [type]: [
        ...prev[type],
        {
          itemId: null,
          quantityToWithdraw: 1,
          usageInstructions: "",
          maxQuantity: 1,
        },
      ],
    }));
  };

  const removeItemField = (type, index) => {
    if (dispenseForm[type].length > 1) {
      const newItems = dispenseForm[type].filter((_, i) => i !== index);
      setDispenseForm((prev) => ({ ...prev, [type]: newItems }));
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`${type}-${index}`];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedIncident) {
      setErrors((prev) => ({
        ...prev,
        form: "Vui lòng chọn một sự kiện trước khi cấp phát",
      }));
      return;
    }

    const allItems = [...dispenseForm.medications, ...dispenseForm.supplies];
    if (!allItems.some((item) => item.itemId)) {
      setErrors((prev) => ({
        ...prev,
        form: "Vui lòng chọn ít nhất một loại thuốc hoặc vật tư",
      }));
      return;
    }

    const hasErrors = allItems.some((item, index) => {
      if (!item.itemId) {
        setErrors((prev) => ({
          ...prev,
          [`${
            index < dispenseForm.medications.length ? "medication" : "supply"
          }-${index % dispenseForm.medications.length}`]:
            "Vui lòng chọn một item",
        }));
        return true;
      }
      if (
        item.quantityToWithdraw <= 0 ||
        item.quantityToWithdraw > (item.maxQuantity || 1)
      ) {
        setErrors((prev) => ({
          ...prev,
          [`${
            index < dispenseForm.medications.length ? "medication" : "supply"
          }-${
            index % dispenseForm.medications.length
          }`]: `Số lượng phải từ 1 đến ${item.maxQuantity || 1}`,
        }));
        return true;
      }
      return false;
    });
    if (hasErrors) return;

    setLoading(true);
    try {
      const dispensedItems = allItems
        .filter((item) => item.itemId)
        .map((item) => ({
          itemId: item.itemId,
          quantityToWithdraw: item.quantityToWithdraw,
          usageInstructions: item.usageInstructions || "",
        }));
      if (!Array.isArray(dispensedItems) || dispensedItems.length === 0) {
        throw new Error("No valid items to dispense");
      }
      const response = await incidentsService.dispenseMedicationForIncident(
        selectedIncident._id,
        dispensedItems
      );
      console.log("Dispense response:", response);
      if (response.message !== "dispenseSuccess") {
        setErrors((prev) => ({
          ...prev,
          form:
            response.errors?.map((err) => err.message).join(", ") ||
            "Cấp phát thất bại",
        }));
        return;
      }
      setDispensedData({
        incident: selectedIncident,
        medications: dispenseForm.medications.filter((m) => m.itemId),
        supplies: dispenseForm.supplies.filter((s) => s.itemId),
      });
      setShowDispenseDialog(false);
      setShowConfirmation(true);
      setSelectedIncident(null);
      setDispenseForm({
        medications: [
          { itemId: null, quantityToWithdraw: 1, usageInstructions: "" },
        ],
        supplies: [
          { itemId: null, quantityToWithdraw: 1, usageInstructions: "" },
        ],
      });
      setErrors({});
      // Reload incidents after successful dispense
      const fetchIncidents = async () => {
        setLoading(true);
        try {
          const response = await incidentsService.getAllIncidentsToDispense();
          setIncidents(response.data || []);
        } catch (error) {
          console.error("Failed to reload incidents:", error);
        } finally {
          setLoading(false);
        }
      };
      await fetchIncidents();
    } catch (error) {
      console.error("Dispense error:", error);
      setErrors((prev) => ({
        ...prev,
        form:
          error.response?.data?.message ||
          "Cấp phát thất bại, vui lòng thử lại",
      }));
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Nhẹ":
        return "#22c55e";
      case "Trung bình":
        return "#f59e0b";
      case "Nặng":
        return "#ef4444";
      default:
        return "#6b7280";
    }
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
        Cấp phát thuốc & vật tư
      </Typography>
      <Alert
        severity="info"
        icon={<Warning />}
        sx={{ mb: 3, fontWeight: "medium" }}
      >
        Quản lý và cấp phát thuốc & vật tư cho các sự kiện ghi nhận
      </Alert>

      <Box sx={{ mb: 3, display: "flex", flexWrap: "wrap", gap: 2 }}>
        <TextField
          label="Tìm kiếm sự kiện, học sinh..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="300px"
        >
          <CircularProgress size={60} />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 2, mb: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f3f4f6" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Học sinh</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Loại sự cố</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Mức độ</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Thời gian</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredIncidents.length > 0 ? (
                filteredIncidents.map((incident) => (
                  <TableRow
                    key={incident._id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => handleIncidentSelect(incident)}
                  >
                    <TableCell>
                      {incident.studentId?.fullName} ({incident.studentId?._id})
                    </TableCell>
                    <TableCell>{incident.incidentType}</TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            bgcolor: getSeverityColor(incident.severity),
                          }}
                        />
                        {incident.severity}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {new Date(incident.incidentTime).toLocaleString("vi-VN")}
                    </TableCell>
                    <TableCell>{incident.status}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleIncidentSelect(incident)}
                      >
                        {incident.status === "COMPLETED"
                          ? "Xem chi tiết"
                          : "Cấp phát"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      Không tìm thấy sự kiện nào
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Detail Dialog */}
      <Dialog
        open={showDetailDialog}
        onClose={() => setShowDetailDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            overflow: "hidden",
            border: "1px solid #e2e8f0",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            color: "white",
            py: 2.5,
            position: "relative",
          }}
        >
          <Typography
            variant="h6"
            fontWeight="600"
            sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
          >
            <Person3Sharp sx={{ fontSize: 24 }} />
            Thông tin chi tiết sự kiện
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Student Info */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2.5,
                bgcolor: "#f8fafc",
                borderRadius: 2,
                border: "1px solid #e2e8f0",
              }}
            >
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: "#dbeafe",
                  borderRadius: 1.5,
                  mr: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Person3Sharp sx={{ color: "#3b82f6", fontSize: 20 }} />
              </Box>
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight="600"
                  color="#1e293b"
                >
                  {selectedIncident?.studentId?.fullName}
                </Typography>
                <Typography variant="body2" color="#64748b">
                  ID: {selectedIncident?.studentId?._id}
                </Typography>
              </Box>
            </Box>

            {/* Incident Type */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2.5,
                bgcolor: "#f0fdf4",
                borderRadius: 2,
                border: "1px solid #bbf7d0",
              }}
            >
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: "#dcfce7",
                  borderRadius: 1.5,
                  mr: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CalendarMonth sx={{ color: "#16a34a", fontSize: 20 }} />
              </Box>
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight="600"
                  color="#15803d"
                >
                  {selectedIncident?.incidentType}
                </Typography>
                <Typography variant="body2" color="#16a34a">
                  Loại sự kiện
                </Typography>
              </Box>
            </Box>

            {/* Description */}
            <Box
              sx={{
                p: 2.5,
                bgcolor: "#fffbeb",
                borderRadius: 2,
                border: "1px solid #fde68a",
              }}
            >
              <Typography
                variant="subtitle2"
                fontWeight="600"
                color="#d97706"
                sx={{ mb: 1 }}
              >
                Mô tả chi tiết
              </Typography>
              <Typography
                variant="body2"
                color="#92400e"
                sx={{ lineHeight: 1.6 }}
              >
                {selectedIncident?.description || "Không có mô tả"}
              </Typography>
            </Box>

            {/* Time and Actions */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  p: 2.5,
                  bgcolor: "#faf5ff",
                  borderRadius: 2,
                  border: "1px solid #e9d5ff",
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    bgcolor: "#f3e8ff",
                    borderRadius: 1.5,
                    mr: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AccessTime sx={{ color: "#8b5cf6", fontSize: 18 }} />
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight="600" color="#7c3aed">
                    Thời gian
                  </Typography>
                  <Typography variant="body2" color="#6b21a8">
                    {new Date(selectedIncident?.incidentTime).toLocaleString(
                      "vi-VN"
                    )}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  p: 2.5,
                  bgcolor: "#fef2f2",
                  borderRadius: 2,
                  border: "1px solid #fecaca",
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    bgcolor: "#fee2e2",
                    borderRadius: 1.5,
                    mr: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AlertTriangle sx={{ color: "#ef4444", fontSize: 18 }} />
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight="600" color="#dc2626">
                    Hành động
                  </Typography>
                  <Typography variant="body2" color="#991b1b">
                    {selectedIncident?.actionsTaken || "Chưa có"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            bgcolor: "#f8fafc",
            borderTop: "1px solid #e2e8f0",
            gap: 2,
          }}
        >
          <Button
            onClick={() => setShowDetailDialog(false)}
            sx={{
              textTransform: "none",
              color: "#64748b",
              fontWeight: 500,
              px: 3,
              py: 1,
              borderRadius: 1.5,
              "&:hover": {
                bgcolor: "#f1f5f9",
              },
            }}
          >
            Đóng
          </Button>
          {selectedIncident?.status !== "COMPLETED" && (
            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                fontWeight: 600,
                px: 4,
                py: 1,
                borderRadius: 1.5,
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.25)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
                  boxShadow: "0 6px 16px rgba(59, 130, 246, 0.3)",
                },
              }}
              onClick={handleProceedToDispense}
            >
              Tiếp tục cấp phát
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Dispense Dialog */}
      <Dialog
        open={showDispenseDialog}
        onClose={() => setShowDispenseDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            color: "white",
            py: 2.5,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Package sx={{ fontSize: 24 }} />
          <Typography variant="h6" fontWeight="600">
            Cấp phát thuốc & vật tư
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            {/* Thông tin sự kiện */}
            <Grid item xs={12} sx={{ width: "100%" }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: "600",
                  color: "#1e293b",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box sx={{ p: 1, bgcolor: "#f0f9ff", borderRadius: 1 }}>
                  <InfoOutlined sx={{ fontSize: 20, color: "#0369a1" }} />
                </Box>
                Thông tin sự kiện
              </Typography>

              <Card
                sx={{
                  bgcolor: "#f0f9ff",
                  border: "1px solid #bae6fd",
                  borderRadius: 2,
                  mb: 3,
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "#374151",
                      }}
                    >
                      <Person3Sharp
                        sx={{ fontSize: 16, mr: 1, color: "#64748b" }}
                      />
                      {selectedIncident?.studentId?.fullName} (
                      {selectedIncident?.studentId?._id})
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "#374151",
                      }}
                    >
                      <CalendarMonth
                        sx={{ fontSize: 16, mr: 1, color: "#64748b" }}
                      />
                      {selectedIncident?.incidentType}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "#374151",
                      }}
                    >
                      <AccessTime
                        sx={{ fontSize: 16, mr: 1, color: "#64748b" }}
                      />
                      {new Date(selectedIncident?.incidentTime).toLocaleString(
                        "vi-VN"
                      )}
                    </Typography>
                  </Box>
                  {selectedIncident?.description && (
                    <Typography
                      variant="body2"
                      color="#64748b"
                      sx={{ mt: 1.5, fontStyle: "italic" }}
                    >
                      "{selectedIncident.description}"
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Thuốc (Bên trái) */}
            <Grid item xs={12} md={6} sx={{ width: "48%" }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: "600",
                  color: "#1e293b",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box sx={{ p: 1, bgcolor: "#dbeafe", borderRadius: 1 }}>
                  <Package sx={{ fontSize: 20, color: "#3b82f6" }} />
                </Box>
                Thuốc
              </Typography>

              {dispenseForm.medications.map((med, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 2.5,
                    mb: 2,
                    borderRadius: 2,
                    position: "relative",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Autocomplete
                    options={medicineOptions}
                    getOptionLabel={(option) =>
                      `${option.name} (Tồn: ${option.totalQuantity})`
                    }
                    value={
                      med.itemId
                        ? medicineOptions.find(
                            (item) => item.itemId === med.itemId
                          )
                        : null
                    }
                    onChange={(event, newValue) =>
                      handleItemChange(
                        "medications",
                        index,
                        "itemId",
                        newValue?.itemId || null
                      )
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Chọn thuốc"
                        placeholder="Tìm thuốc..."
                        sx={{ mb: 2 }}
                        size="small"
                      />
                    )}
                  />
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <TextField
                      label="Số lượng"
                      type="number"
                      value={med.quantityToWithdraw}
                      onChange={(e) =>
                        handleItemChange(
                          "medications",
                          index,
                          "quantityToWithdraw",
                          parseInt(e.target.value) || 1
                        )
                      }
                      inputProps={{ min: 1, max: med.maxQuantity }}
                      size="small"
                      sx={{ width: "120px" }}
                      error={!!errors[`medication-${index}`]}
                      helperText={errors[`medication-${index}`]}
                    />
                    <TextField
                      label="Hướng dẫn sử dụng"
                      value={med.usageInstructions}
                      onChange={(e) =>
                        handleItemChange(
                          "medications",
                          index,
                          "usageInstructions",
                          e.target.value
                        )
                      }
                      fullWidth
                      size="small"
                      multiline
                      rows={2}
                    />
                  </Box>
                  {dispenseForm.medications.length > 1 && (
                    <IconButton
                      onClick={() => removeItemField("medications", index)}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "#ef4444",
                      }}
                      size="small"
                    >
                      <X size={16} />
                    </IconButton>
                  )}
                </Paper>
              ))}

              <Button
                startIcon={<Plus size={16} />}
                onClick={() => addItemField("medications")}
                sx={{
                  mb: 3,
                  textTransform: "none",
                  color: "#3b82f6",
                  fontWeight: 500,
                }}
              >
                Thêm thuốc
              </Button>
            </Grid>

            {/* Vật tư (Bên phải) */}
            <Grid item xs={12} md={6} sx={{ width: "48%" }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: "600",
                  color: "#1e293b",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box sx={{ p: 1, bgcolor: "#dcfce7", borderRadius: 1 }}>
                  <Package sx={{ fontSize: 20, color: "#16a34a" }} />
                </Box>
                Vật tư
              </Typography>

              {dispenseForm.supplies.map((supply, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 2.5,
                    mb: 2,
                    borderRadius: 2,
                    position: "relative",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Autocomplete
                    options={supplyOptions}
                    getOptionLabel={(option) =>
                      `${option.name} (Tồn: ${option.totalQuantity})`
                    }
                    value={
                      supply.itemId
                        ? supplyOptions.find(
                            (item) => item.itemId === supply.itemId
                          )
                        : null
                    }
                    onChange={(event, newValue) =>
                      handleItemChange(
                        "supplies",
                        index,
                        "itemId",
                        newValue?.itemId || null
                      )
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Chọn vật tư"
                        placeholder="Tìm vật tư..."
                        sx={{ mb: 2 }}
                        size="small"
                      />
                    )}
                  />
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <TextField
                      label="Số lượng"
                      type="number"
                      value={supply.quantityToWithdraw}
                      onChange={(e) =>
                        handleItemChange(
                          "supplies",
                          index,
                          "quantityToWithdraw",
                          parseInt(e.target.value) || 1
                        )
                      }
                      inputProps={{ min: 1, max: supply.maxQuantity }}
                      size="small"
                      sx={{ width: "120px" }}
                      error={!!errors[`supply-${index}`]}
                      helperText={errors[`supply-${index}`]}
                    />
                    <TextField
                      label="Hướng dẫn sử dụng"
                      value={supply.usageInstructions}
                      onChange={(e) =>
                        handleItemChange(
                          "supplies",
                          index,
                          "usageInstructions",
                          e.target.value
                        )
                      }
                      fullWidth
                      size="small"
                      multiline
                      rows={2}
                    />
                  </Box>
                  {dispenseForm.supplies.length > 1 && (
                    <IconButton
                      onClick={() => removeItemField("supplies", index)}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "#ef4444",
                      }}
                      size="small"
                    >
                      <X size={16} />
                    </IconButton>
                  )}
                </Paper>
              ))}

              <Button
                startIcon={<Plus size={16} />}
                onClick={() => addItemField("supplies")}
                sx={{
                  mb: 2,
                  textTransform: "none",
                  color: "#16a34a",
                  fontWeight: 500,
                }}
              >
                Thêm vật tư
              </Button>
            </Grid>

            {/* Xem trước */}
            <Grid item xs={12} sx={{ width: "100%" }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: "600",
                  color: "#1e293b",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box sx={{ p: 1, bgcolor: "#f3e8ff", borderRadius: 1 }}>
                  <Eye sx={{ fontSize: 20, color: "#8b5cf6" }} />
                </Box>
                Xem trước
              </Typography>

              {selectedIncident &&
              (dispenseForm.medications.some((m) => m.itemId) ||
                dispenseForm.supplies.some((s) => s.itemId)) ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {/* Selected Medications */}
                  {dispenseForm.medications.filter((m) => m.itemId).length >
                    0 && (
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="#374151"
                        fontWeight="600"
                        sx={{ mb: 1 }}
                      >
                        Thuốc đã chọn:
                      </Typography>
                      {dispenseForm.medications
                        .filter((m) => m.itemId)
                        .map((med, index) => {
                          const selectedMed = medicineOptions.find(
                            (item) => item.itemId === med.itemId
                          );
                          return (
                            <Card
                              key={index}
                              sx={{
                                mb: 1.5,
                                border: "1px solid #e2e8f0",
                                borderRadius: 1.5,
                              }}
                            >
                              <CardContent
                                sx={{
                                  p: 2,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                }}
                              >
                                <Box
                                  sx={{
                                    p: 1,
                                    bgcolor: "#dbeafe",
                                    borderRadius: 1,
                                  }}
                                >
                                  <Package
                                    size={16}
                                    sx={{ color: "#3b82f6" }}
                                  />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                  <Typography
                                    variant="body2"
                                    fontWeight="600"
                                    color="#1e293b"
                                  >
                                    {selectedMed?.name || "Unknown"}
                                  </Typography>
                                  <Typography variant="caption" color="#64748b">
                                    Số lượng: {med.quantityToWithdraw} / Tồn:{" "}
                                    {selectedMed?.totalQuantity}
                                  </Typography>
                                  {med.usageInstructions && (
                                    <Typography
                                      variant="caption"
                                      color="#64748b"
                                      sx={{ display: "block", mt: 0.5 }}
                                    >
                                      Hướng dẫn: {med.usageInstructions}
                                    </Typography>
                                  )}
                                </Box>
                              </CardContent>
                            </Card>
                          );
                        })}
                    </Box>
                  )}

                  {/* Selected Supplies */}
                  {dispenseForm.supplies.filter((s) => s.itemId).length > 0 && (
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="#374151"
                        fontWeight="600"
                        sx={{ mb: 1 }}
                      >
                        Vật tư đã chọn:
                      </Typography>
                      {dispenseForm.supplies
                        .filter((s) => s.itemId)
                        .map((supply, index) => {
                          const selectedSupply = supplyOptions.find(
                            (item) => item.itemId === supply.itemId
                          );
                          return (
                            <Card
                              key={index}
                              sx={{
                                mb: 1.5,
                                border: "1px solid #e2e8f0",
                                borderRadius: 1.5,
                              }}
                            >
                              <CardContent
                                sx={{
                                  p: 2,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                }}
                              >
                                <Box
                                  sx={{
                                    p: 1,
                                    bgcolor: "#dcfce7",
                                    borderRadius: 1,
                                  }}
                                >
                                  <Package
                                    size={16}
                                    sx={{ color: "#16a34a" }}
                                  />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                  <Typography
                                    variant="body2"
                                    fontWeight="600"
                                    color="#1e293b"
                                  >
                                    {selectedSupply?.name || "Unknown"}
                                  </Typography>
                                  <Typography variant="caption" color="#64748b">
                                    Số lượng: {supply.quantityToWithdraw} / Tồn:{" "}
                                    {selectedSupply?.totalQuantity}
                                  </Typography>
                                  {supply.usageInstructions && (
                                    <Typography
                                      variant="caption"
                                      color="#64748b"
                                      sx={{ display: "block", mt: 0.5 }}
                                    >
                                      Hướng dẫn: {supply.usageInstructions}
                                    </Typography>
                                  )}
                                </Box>
                              </CardContent>
                            </Card>
                          );
                        })}
                    </Box>
                  )}

                  {/* Timestamp */}
                  <Card
                    sx={{
                      bgcolor: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                      borderRadius: 1.5,
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Typography
                        variant="body2"
                        color="#15803d"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Clock size={16} />
                        Thời gian cấp phát:{" "}
                        {new Date().toLocaleString("vi-VN", {
                          timeZone: "Asia/Ho_Chi_Minh",
                        })}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ) : (
                <Box sx={{ textAlign: "center", py: 6, color: "#94a3b8" }}>
                  <Package size={48} sx={{ mb: 2, color: "#cbd5e1" }} />
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Chưa chọn thuốc hoặc vật tư
                  </Typography>
                  <Typography variant="body2">
                    Vui lòng chọn items để xem trước
                  </Typography>
                </Box>
              )}
            </Grid>

            {/* Error và Action buttons */}
            <Grid item xs={12} sx={{ width: "100%" }}>
              {errors.form && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errors.form}
                </Alert>
              )}

              <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                <Button
                  onClick={() => setShowDispenseDialog(false)}
                  fullWidth
                  variant="outlined"
                  sx={{
                    textTransform: "none",
                    borderColor: "#d1d5db",
                    color: "#374151",
                    py: 1.5,
                    borderRadius: 1.5,
                  }}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleSubmit}
                  fullWidth
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                    py: 1.5,
                    borderRadius: 1.5,
                    fontWeight: 600,
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
                    },
                  }}
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : "Cấp phát"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

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
            Đã cấp phát cho{" "}
            <strong>{dispensedData?.incident.studentId?.fullName}</strong>:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 1 }}>
            {(dispensedData?.medications || []).map((med, index) => {
              const selectedMed = medicineOptions.find(
                (item) => item.itemId === med.itemId
              );
              return (
                <li key={index}>
                  <Typography variant="body2">
                    <strong>{selectedMed?.name || "Unknown"}</strong>:{" "}
                    {med.quantityToWithdraw}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Hướng dẫn: {med.usageInstructions}
                  </Typography>
                </li>
              );
            })}
            {(dispensedData?.supplies || []).map((supply, index) => {
              const selectedSupply = supplyOptions.find(
                (item) => item.itemId === supply.itemId
              );
              return (
                <li key={index}>
                  <Typography variant="body2">
                    <strong>{selectedSupply?.name || "Unknown"}</strong>:{" "}
                    {supply.quantityToWithdraw}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Hướng dẫn: {supply.usageInstructions}
                  </Typography>
                </li>
              );
            })}
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 2, display: "block" }}
          >
            Thời gian:{" "}
            {new Date().toLocaleString("vi-VN", {
              timeZone: "Asia/Ho_Chi_Minh",
            })}
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

export default DispenseMedicationAndSupplies;

import React, { useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Alert,
  IconButton,
  Grid,
  Card,
  CardContent,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  Stack,
  Tooltip,
  Divider,
  Container,
} from "@mui/material";
import {
  Search,
  Add,
  Edit,
  Delete,
  Visibility,
  Warning,
  LocalPharmacy,
  CalendarToday,
  Notes,
  Schedule,
  Inventory,
  Close,
  Assignment,
} from "@mui/icons-material";
import EnhancedTabs from "~/libs/components/management/EnhancedTabs";
import DispenseMedication from "./DispenseMedication";
import MedicineLogPage from "./MedicineLogPage";
import { medication } from "~/mock/mock";
import { CheckCircle } from "lucide-react";

const medicationTypes = ["viên", "lọ", "ml", "gói", "ống"];

const InventoryMedications = ({
  supplyRecords: initialMedicationRecords = medication || [],
  setSupplyRecords: setInitialMedicationRecords,
  setLastSavedRecord,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [medicationForm, setMedicationForm] = useState({
    medicationName: "",
    quantity: "",
    type: "",
    entryDate: new Date().toISOString().substring(0, 10),
    notes: "",
  });
  const [medicationRecords, setMedicationRecords] = useState(
    initialMedicationRecords
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [lastSavedRecord, setLastSavedRecordState] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setMedicationForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitMedication = (e) => {
    e.preventDefault();
    if (medicationForm.quantity < 0) {
      alert("Số lượng không thể âm!");
      return;
    }
    const newRecord = {
      id: Date.now().toString(),
      ...medicationForm,
      quantity: parseInt(medicationForm.quantity),
      timestamp: new Date().toLocaleString("vi-VN", { hour12: false }),
    };
    setMedicationRecords((prev) => [...prev, newRecord]);
    setLastSavedRecordState(newRecord);
    if (setLastSavedRecord) setLastSavedRecord(newRecord);
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
    if (medicationForm.quantity < 0) {
      alert("Số lượng không thể âm!");
      return;
    }
    const updatedRecords = medicationRecords.map((record) =>
      record.id === selectedRecord.id
        ? {
            ...record,
            ...medicationForm,
            quantity: parseInt(medicationForm.quantity),
            timestamp: new Date().toLocaleString("vi-VN", { hour12: false }),
          }
        : record
    );
    setMedicationRecords(updatedRecords);
    if (setInitialMedicationRecords)
      setInitialMedicationRecords(updatedRecords);
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
      const updatedRecords = medicationRecords.filter(
        (record) => record.id !== id
      );
      setMedicationRecords(updatedRecords);
      if (setInitialMedicationRecords)
        setInitialMedicationRecords(updatedRecords);
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

  return (
    <Container
      maxWidth="xl"
      sx={{ py: 4, bgcolor: "#f5f5f5", minHeight: "100vh" }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: "bold", color: "#1e3a8a" }}
      >
        Quản lý Thuốc
      </Typography>

      <EnhancedTabs
        tabs={[
          {
            label: "Kho Thuốc",
            icon: <LocalPharmacy />,
            content: "Quản lý kho thuốc và dược phẩm",
          },
          { label: "Cấp Phát", icon: <Assignment /> },
          {
            label: "Nhật Ký",
            icon: <Notes />,
            content: "Theo dõi lịch sử cấp phát thuốc",
          },
        ]}
        value={tabValue}
        onChange={(e, newValue) => setTabValue(newValue)}
        variant="medical"
        size="medium"
        fullWidth={false}
      />

      {tabValue === 0 && (
        <Container
          maxWidth="xl"
          sx={{ py: 4, bgcolor: "#f5f5f5", minHeight: "100vh" }}
        >
          <Alert
            severity="info"
            icon={<Warning />}
            sx={{ mb: 3, fontWeight: "medium" }}
          >
            Nhật ký ghi nhận lịch sử cấp phát vật tư
          </Alert>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              gap: 2,
              flexWrap: { xs: "wrap", sm: "nowrap" },
            }}
          >
            <TextField
              placeholder="Tìm kiếm theo tên thuốc"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Search sx={{ color: "action.active", mr: 1 }} />
                ),
              }}
              sx={{ width: { xs: "100%", sm: 400 } }}
              variant="outlined"
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenAddDialog(true)}
              sx={{ whiteSpace: "nowrap" }}
            >
              Thêm mới
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table stickyHeader>
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
                    <TableRow
                      key={record.id}
                      hover
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleOpenDetailDialog(record)}
                    >
                      <TableCell sx={{ fontWeight: "medium" }}>
                        {record.medicationName}
                      </TableCell>
                      <TableCell>{record.quantity}</TableCell>
                      <TableCell>
                        <Chip
                          label={record.type}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{record.entryDate}</TableCell>
                      <TableCell>{record.notes || "Không có"}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Xem chi tiết">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDetailDialog(record);
                              }}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Chỉnh sửa">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEditDialog(record);
                              }}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteRecord(record.id);
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <Typography variant="body1" color="text.secondary">
                        Chưa có thuốc nào trong kho.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </Container>
      )}

      {tabValue === 1 && <DispenseMedication />}
      {tabValue === 2 && <MedicineLogPage />}

      {/* Add Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Thêm Thuốc vào kho</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              name="medicationName"
              label="Tên thuốc"
              value={medicationForm.medicationName}
              onChange={handleFormChange}
              required
              fullWidth
            />
            <TextField
              name="quantity"
              label="Số lượng"
              type="number"
              value={medicationForm.quantity}
              onChange={handleFormChange}
              required
              fullWidth
            />
            <FormControl fullWidth required>
              <InputLabel>Chọn kiểu</InputLabel>
              <Select
                name="type"
                value={medicationForm.type}
                onChange={handleFormChange}
                label="Chọn kiểu"
              >
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
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="notes"
              label="Ghi chú"
              value={medicationForm.notes}
              onChange={handleFormChange}
              multiline
              rows={3}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Hủy</Button>
          <Button onClick={handleSubmitMedication} variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chỉnh sửa Thuốc</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              name="medicationName"
              label="Tên thuốc"
              value={medicationForm.medicationName}
              onChange={handleFormChange}
              required
              fullWidth
            />
            <TextField
              name="quantity"
              label="Số lượng"
              type="number"
              value={medicationForm.quantity}
              onChange={handleFormChange}
              required
              fullWidth
            />
            <FormControl fullWidth required>
              <InputLabel>Chọn kiểu</InputLabel>
              <Select
                name="type"
                value={medicationForm.type}
                onChange={handleFormChange}
                label="Chọn kiểu"
              >
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
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="notes"
              label="Ghi chú"
              value={medicationForm.notes}
              onChange={handleFormChange}
              multiline
              rows={3}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Hủy</Button>
          <Button onClick={handleEditMedication} variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog
  open={openDetailDialog}
  onClose={() => setOpenDetailDialog(false)}
  maxWidth="md"
  fullWidth
  sx={{
    '& .MuiDialog-paper': {
      borderRadius: 3,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      overflow: 'hidden'
    }
  }}
>
  <DialogTitle
    sx={{
      background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
      color: "white",
      p: 3,
      position: 'relative'
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ 
          bgcolor: 'rgba(255,255,255,0.2)', 
          borderRadius: '50%', 
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <LocalPharmacy sx={{ fontSize: 32 }} />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight="600" sx={{ mb: 0.5 }}>
            Chi tiết Thuốc
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              opacity: 0.9,
              fontWeight: 400
            }}
          >
            Thông tin chi tiết về sản phẩm
          </Typography>
        </Box>
      </Box>
      <IconButton
        onClick={() => setOpenDetailDialog(false)}
        sx={{ 
          color: "white",
          bgcolor: 'rgba(255,255,255,0.1)',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
        }}
      >
        <Close />
      </IconButton>
    </Box>
  </DialogTitle>

  <DialogContent sx={{ p: 0 }}>
    {selectedRecord && (
      <Box sx={{ p: 3 }}>
        {/* Header Info Card */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          borderRadius: 2,
          p: 3,
          mb: 3,
          border: '1px solid #e2e8f0'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{ 
              bgcolor: '#dbeafe', 
              borderRadius: '50%', 
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Inventory sx={{ color: '#1976d2', fontSize: 24 }} />
            </Box>
            <Typography variant="h4" fontWeight="700" sx={{ color: '#1e293b' }}>
              {selectedRecord.medicationName}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ 
              bgcolor: '#dcfce7', 
              color: '#166534', 
              px: 3, 
              py: 1, 
              borderRadius: 3,
              fontWeight: 600,
              fontSize: '0.95rem'
            }}>
              {selectedRecord.quantity} {selectedRecord.type}
            </Box>
            <Box sx={{ 
              bgcolor: '#fef3c7', 
              color: '#92400e', 
              px: 3, 
              py: 1, 
              borderRadius: 3,
              fontWeight: 600,
              fontSize: '0.95rem'
            }}>
              Kho: {selectedRecord.quantity > 50 ? 'Đủ hàng' : 'Sắp hết'}
            </Box>
          </Box>
        </Box>

        {/* Details Grid */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{ 
                height: '100%',
                borderRadius: 2,
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box sx={{ 
                    bgcolor: '#dcfce7', 
                    borderRadius: '50%', 
                    p: 1,
                    mr: 2
                  }}>
                    <Inventory sx={{ color: '#16a34a', fontSize: 20 }} />
                  </Box>
                  <Typography variant="subtitle1" fontWeight="600" color="#374151">
                    Số lượng & Loại
                  </Typography>
                </Box>
                <Typography variant="h5" fontWeight="700" sx={{ color: '#1f2937' }}>
                  {selectedRecord.quantity} {selectedRecord.type}
                </Typography>
                <Box sx={{ 
                  mt: 2,
                  height: 4,
                  bgcolor: '#e5e7eb',
                  borderRadius: 2,
                  overflow: 'hidden'
                }}>
                  <Box sx={{ 
                    width: `${Math.min((selectedRecord.quantity / 100) * 100, 100)}%`,
                    height: '100%',
                    bgcolor: selectedRecord.quantity > 50 ? '#10b981' : '#f59e0b',
                    transition: 'width 0.5s ease'
                  }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{ 
                height: '100%',
                borderRadius: 2,
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box sx={{ 
                    bgcolor: '#fef3c7', 
                    borderRadius: '50%', 
                    p: 1,
                    mr: 2
                  }}>
                    <CalendarToday sx={{ color: '#d97706', fontSize: 20 }} />
                  </Box>
                  <Typography variant="subtitle1" fontWeight="600" color="#374151">
                    Ngày nhập kho
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight="600" sx={{ color: '#1f2937', mb: 1 }}>
                  {new Date(selectedRecord.entryDate).toLocaleDateString("vi-VN")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {Math.floor((new Date() - new Date(selectedRecord.entryDate)) / (1000 * 60 * 60 * 24))} ngày trước
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{ 
                height: '100%',
                borderRadius: 2,
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box sx={{ 
                    bgcolor: '#fce7f3', 
                    borderRadius: '50%', 
                    p: 1,
                    mr: 2
                  }}>
                    <Schedule sx={{ color: '#be185d', fontSize: 20 }} />
                  </Box>
                  <Typography variant="subtitle1" fontWeight="600" color="#374151">
                    Cập nhật lần cuối
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight="600" sx={{ color: '#1f2937' }}>
                  {selectedRecord.timestamp}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{ 
                height: '100%',
                borderRadius: 2,
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box sx={{ 
                    bgcolor: '#dbeafe', 
                    borderRadius: '50%', 
                    p: 1,
                    mr: 2
                  }}>
                    <Notes sx={{ color: '#2563eb', fontSize: 20 }} />
                  </Box>
                  <Typography variant="subtitle1" fontWeight="600" color="#374151">
                    Trạng thái
                  </Typography>
                </Box>
                <Box sx={{ 
                  bgcolor: selectedRecord.quantity > 50 ? '#dcfce7' : '#fef3c7',
                  color: selectedRecord.quantity > 50 ? '#166534' : '#92400e',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  display: 'inline-block',
                  fontWeight: 600
                }}>
                  {selectedRecord.quantity > 50 ? 'Còn đủ hàng' : 'Sắp hết hàng'}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card
              sx={{ 
                borderRadius: 2,
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box sx={{ 
                    bgcolor: '#e0f2fe', 
                    borderRadius: '50%', 
                    p: 1,
                    mr: 2
                  }}>
                    <Notes sx={{ color: '#0277bd', fontSize: 20 }} />
                  </Box>
                  <Typography variant="subtitle1" fontWeight="600" color="#374151">
                    Ghi chú
                  </Typography>
                </Box>
                <Box sx={{ 
                  bgcolor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 2,
                  p: 2.5,
                  borderLeft: '4px solid #3b82f6'
                }}>
                  <Typography variant="body1" sx={{ 
                    color: selectedRecord.notes ? '#374151' : '#9ca3af',
                    fontStyle: selectedRecord.notes ? 'normal' : 'italic',
                    lineHeight: 1.6
                  }}>
                    {selectedRecord.notes || "Không có ghi chú"}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    )}
  </DialogContent>

  <Box sx={{ 
    bgcolor: '#f9fafb', 
    borderTop: '1px solid #e5e7eb',
    p: 3
  }}>
    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
      <Button
        onClick={() => {
          setOpenDetailDialog(false);
          handleOpenEditDialog(selectedRecord);
        }}
        variant="contained"
        startIcon={<Edit />}
        sx={{
          borderRadius: 2,
          px: 3,
          py: 1.5,
          fontWeight: 600,
          textTransform: 'none',
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
          },
          transition: 'all 0.2s ease'
        }}
      >
        Chỉnh sửa
      </Button>
      <Button 
        onClick={() => setOpenDetailDialog(false)} 
        variant="outlined"
        sx={{
          borderRadius: 2,
          px: 3,
          py: 1.5,
          fontWeight: 600,
          textTransform: 'none',
          borderColor: '#d1d5db',
          color: '#374151',
          '&:hover': {
            borderColor: '#9ca3af',
            bgcolor: '#f9fafb',
            transform: 'translateY(-1px)'
          },
          transition: 'all 0.2s ease'
        }}
      >
        Đóng
      </Button>
    </Box>
  </Box>
</Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmationDialog}
        onClose={() => setShowConfirmationDialog(false)}
      >
        <DialogTitle sx={{ textAlign: "center" }}>
          <CheckCircle sx={{ fontSize: 60, color: "#22c55e" }} />
          <Typography variant="h5">Ghi nhận Thành công!</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Thuốc <strong>{lastSavedRecord?.medicationName}</strong> đã được
            thêm vào kho.
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
    </Container>
  );
};

export default InventoryMedications;

import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Button,
  Typography,
  IconButton,
  Snackbar,
  Grid,
  Card,
  CardContent,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  Stack,
  Tooltip,
  Container,
  CircularProgress,
  TableHead,
} from "@mui/material";
import {
  Search,
  Add,
  Edit,
  Delete,
  Visibility,
  LocalPharmacy,
  CalendarToday,
  Notes,
  Schedule,
  Inventory,
  Close,
  Warning,
} from "@mui/icons-material";
import { CheckCircle, Pill } from "lucide-react";
import inventoryService from "~/libs/api/services/inventory";

const medicationTypes = ["Vỉ", "Lọ", "ml", "Gói", "Ống"];

const MedicineCRUD = ({ setLastSavedRecord }) => {
  const [medicineRecords, setMedicationRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddNewDialog, setOpenAddNewDialog] = useState(false);
  const [openAddBatchDialog, setOpenAddBatchDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openEditBatchDialog, setOpenEditBatchDialog] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [lastSavedRecord, setLastSavedRecordState] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [errorSnackBar, setErrorSnackBar] = useState({
    open: false,
    message: "",
  });
  const itemsPerPage = 10;
  const initialFormState = {
    itemName: "",
    description: "",
    unit: "",
    lowStockThreshold: "",
    quantity: "",
    expirationDate: new Date().toISOString().substring(0, 10),
    status: "",
  };
  const [medicineForm, setMedicineForm] = useState(initialFormState);

  const resetForm = () => {
    setMedicineForm(initialFormState);
  };
  // Fetch inventory items
  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        const response = await inventoryService.getInventoryItems({
          type: "MEDICINE",
        });
        setMedicationRecords(response.data || []);
        setCurrentPage(1); // Reset to first page on initial load
      } catch (err) {
        setErrorSnackBar({
          open: true,
          message:
            err.response?.data?.message || "Không thể tải danh sách thuốc",
        });
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setMedicineForm((prev) => ({ ...prev, [name]: value }));
  };

  const statusOptions = [
    { value: "IN_STOCK", label: "Còn hàng" },
    { value: "LOW_STOCK", label: "Tồn kho thấp" },
    { value: "OUT_OF_STOCK", label: "Hết hàng" },
    { value: "DISCONTINUED", label: "Ngừng sử dụng" },
  ];

  const validateForm = (isEdit = false) => {
    if (!medicineForm.itemName.trim()) return "Tên thuốc là bắt buộc";
    if (!medicineForm.unit) return "Đơn vị là bắt buộc";
    if (!isEdit) {
      if (!medicineForm.quantity || parseInt(medicineForm.quantity) < 0)
        return "Số lượng phải là số không âm";
      if (!medicineForm.expirationDate) return "Ngày hết hạn là bắt buộc";
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const selectedDate = new Date(medicineForm.expirationDate).setHours(
        0,
        0,
        0,
        0
      );
      if (selectedDate < tomorrow)
        return "Ngày hết hạn phải từ ngày mai trở đi";
    }
    if (
      !medicineForm.lowStockThreshold ||
      parseInt(medicineForm.lowStockThreshold) < 0
    )
      return "Ngưỡng tồn kho thấp phải là số không âm";
    if (isEdit && !medicineForm.status) return "Trạng thái là bắt buộc";
    return null;
  };

  const handleSubmitNewMedicine = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setErrorSnackBar({ open: true, message: validationError });
      return;
    }
    try {
      setLoading(true);
      const payload = {
        itemName: medicineForm.itemName,
        description: medicineForm.description,
        unit: medicineForm.unit,
        type: "MEDICINE",
        lowStockThreshold: parseInt(medicineForm.lowStockThreshold),
        quantity: parseInt(medicineForm.quantity),
        expirationDate: medicineForm.expirationDate + "T00:00:00.000Z",
      };
      const response = await inventoryService.stockIn(payload);
      setMedicationRecords((prev) => [...prev, response.data]);
      setLastSavedRecordState(response.data);
      if (typeof setLastSavedRecord === "function")
        setLastSavedRecord(response.data);
      setShowConfirmationDialog(true);
      setOpenAddNewDialog(false);
      setMedicineForm({
        itemName: "",
        description: "",
        unit: "",
        lowStockThreshold: "",
        quantity: "",
        expirationDate: new Date().toISOString().substring(0, 10),
      });
      const newTotalPages = Math.ceil(
        (medicineRecords.length + 1) / itemsPerPage
      );
      if (filteredRecords.length % itemsPerPage === 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (err) {
      setErrorSnackBar({
        open: true,
        message: err.response?.data?.message || "Không thể thêm thuốc mới",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBatch = async (e) => {
    e.preventDefault();
    if (!selectedItemId) {
      setErrorSnackBar({ open: true, message: "Vui lòng chọn sản phẩm" });
      return;
    }
    if (!medicineForm.quantity || parseInt(medicineForm.quantity) < 0) {
      setErrorSnackBar({ open: true, message: "Số lượng phải là số không âm" });
      return;
    }
    if (!medicineForm.expirationDate) {
      setErrorSnackBar({ open: true, message: "Ngày hết hạn là bắt buộc" });
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const selectedDate = new Date(medicineForm.expirationDate).setHours(
      0,
      0,
      0,
      0
    );
    if (selectedDate < tomorrow) {
      setErrorSnackBar({
        open: true,
        message: "Ngày hết hạn phải từ ngày mai trở đi",
      });
      return;
    }
    try {
      setLoading(true);
      const payload = {
        quantity: parseInt(medicineForm.quantity),
        expirationDate: medicineForm.expirationDate + "T00:00:00.000Z",
      };
      await inventoryService.addBatch(selectedItemId, payload);
      const response = await inventoryService.getInventoryItems({
        type: "MEDICINE",
        search: searchTerm,
      });
      setMedicationRecords(response.data || []);
      setShowConfirmationDialog(true);
      setOpenAddBatchDialog(false);
      setMedicineForm({
        itemName: "",
        description: "",
        unit: "",
        lowStockThreshold: "",
        quantity: "",
        expirationDate: new Date().toISOString().substring(0, 10),
      });
      setSelectedItemId("");
    } catch (err) {
      setErrorSnackBar({
        open: true,
        message: err.response?.data?.message || "Không thể thêm lô mới",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditMedicine = async (e) => {
    e.preventDefault();
    const validationError = validateForm(true);
    if (validationError) {
      setErrorSnackBar({ open: true, message: validationError });
      return;
    }
    try {
      setLoading(true);
      const payload = {
        itemName: medicineForm.itemName,
        description: medicineForm.description,
        unit: medicineForm.unit,
        lowStockThreshold: parseInt(medicineForm.lowStockThreshold),
        type: "MEDICINE",
        status: medicineForm.status,
      };
      await inventoryService.updateItem(selectedRecord._id, payload);
      const response = await inventoryService.getInventoryItems({
        type: "MEDICINE",
        search: searchTerm,
      });
      setMedicationRecords(response.data || []);
      setOpenEditDialog(false);
      setMedicineForm({
        itemName: "",
        description: "",
        unit: "",
        lowStockThreshold: "",
        quantity: "",
        expirationDate: new Date().toISOString().substring(0, 10),
        status: "",
      });
      setSelectedRecord(null);
    } catch (err) {
      setErrorSnackBar({
        open: true,
        message: err.response?.data?.message || "Không thể cập nhật thuốc",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditBatch = async (e) => {
    e.preventDefault();
    if (!medicineForm.quantity || parseInt(medicineForm.quantity) < 0) {
      setErrorSnackBar({ open: true, message: "Số lượng phải là số không âm" });
      return;
    }
    if (!medicineForm.expirationDate) {
      setErrorSnackBar({ open: true, message: "Ngày hết hạn là bắt buộc" });
      return;
    }
    try {
      setLoading(true);
      const payload = {
        itemId: selectedRecord._id,
        batchId: selectedBatch._id,
        newQuantity: parseInt(medicineForm.quantity),
        reason: `Cập nhật lô, ngày hết hạn: ${new Date(
          medicineForm.expirationDate
        ).toLocaleDateString("vi-VN")}`,
        type: "DISPOSE_EXPIRED",
      };
      await inventoryService.updateStockBatch(payload);
      const response = await inventoryService.getInventoryItems({
        type: "MEDICINE",
        search: searchTerm,
      });
      setMedicationRecords(response.data || []);
      setOpenEditBatchDialog(false);
      setMedicineForm({
        itemName: "",
        description: "",
        unit: "",
        lowStockThreshold: "",
        quantity: "",
        expirationDate: new Date().toISOString().substring(0, 10),
      });
      setSelectedBatch(null);
    } catch (err) {
      setErrorSnackBar({
        open: true,
        message: err.response?.data?.message || "Không thể cập nhật lô",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecord = async (id) => {
    setRecordToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;
    try {
      setLoading(true);
      const payload = {
        status: "DISCONTINUED",
      };
      await inventoryService.updateItem(recordToDelete, payload);
      const response = await inventoryService.getInventoryItems({
        type: "MEDICINE",
        search: searchTerm,
      });
      setMedicationRecords(response.data || []);
      if (
        currentPage > 1 &&
        Math.ceil(response.data.length / itemsPerPage) < currentPage
      ) {
        setCurrentPage(currentPage - 1);
      }
      setOpenDeleteDialog(false);
      setRecordToDelete(null);
    } catch (err) {
      setErrorSnackBar({
        open: true,
        message: err.response?.data?.message || "Không thể ngừng sử dụng thuốc",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetailDialog = (record) => {
    setSelectedRecord(record);
    setOpenDetailDialog(true);
  };

  const handleOpenEditDialog = (record) => {
    setSelectedRecord(record);
    setMedicineForm({
      itemName: record.itemName,
      description: record.description,
      unit: record.unit,
      lowStockThreshold: record.lowStockThreshold.toString(),
      quantity: record.totalQuantity.toString(),
      expirationDate: record.batches[0]?.expirationDate
        ? new Date(record.batches[0].expirationDate)
            .toISOString()
            .substring(0, 10)
        : new Date().toISOString().substring(0, 10),
      status: record.status,
    });
    setOpenEditDialog(true);
  };

  const handleOpenEditBatchDialog = (batch) => {
    setSelectedBatch(batch);
    setMedicineForm({
      ...medicineForm,
      quantity: batch.quantity.toString(),
      expirationDate: new Date(batch.expirationDate)
        .toISOString()
        .substring(0, 10),
    });
    setOpenEditBatchDialog(true);
  };

  const filteredRecords = medicineRecords.filter((record) =>
    record.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleCloseSnackbar = () => {
    setErrorSnackBar({ open: false, message: "" });
  };

  return (
    <Container
      maxWidth="xl"
      sx={{ py: 4, bgcolor: "#f5f5f5", minHeight: "100vh" }}
    >
      <div className="mx-auto">
        <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl border border-blue-100 mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-400/20 to-blue-500/20 rounded-full transform -translate-x-12 translate-y-12"></div>
          <div className="relative p-8">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Pill className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-3 leading-tight">
                  Quản lý Kho Thuốc
                </h1>
                <p className="text-lg text-gray-600 font-medium leading-relaxed">
                  Quản lý tất cả thuốc và dược phẩm có trong kho.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
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
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search change
          }}
          InputProps={{
            startAdornment: <Search sx={{ color: "action.active", mr: 1 }} />,
          }}
          sx={{ width: { xs: "100%", sm: 400 } }}
          variant="outlined"
        />
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenAddNewDialog(true)}
            sx={{ whiteSpace: "nowrap" }}
          >
            Thêm mới
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f3f4f6" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Tên thuốc</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Số lượng</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Đơn vị</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Ngày hết hạn
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Trạng thái</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Quản lý</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Lô hàng</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRecords.length > 0 ? (
                  paginatedRecords.map((record) => (
                    <TableRow
                      key={record._id}
                      hover
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleOpenDetailDialog(record)}
                    >
                      <TableCell sx={{ fontWeight: "medium" }}>
                        {record.itemName}
                      </TableCell>
                      <TableCell>{record.totalQuantity}</TableCell>
                      <TableCell>
                        <Chip
                          label={record.unit}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(
                          record.batches[0]?.expirationDate
                        ).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            record.status === "LOW_STOCK"
                              ? "Sắp hết"
                              : record.status === "OUT_OF_STOCK"
                              ? "Hết hàng"
                              : record.status === "DISCONTINUED"
                              ? "Ngừng sử dụng"
                              : "Còn hàng"
                          }
                          color={
                            record.status === "LOW_STOCK"
                              ? "warning"
                              : record.status === "OUT_OF_STOCK"
                              ? "error"
                              : record.status === "DISCONTINUED"
                              ? "default"
                              : "success"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
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
                          <Tooltip title="Ngừng sử dụng">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteRecord(record._id);
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Thêm lô mới">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItemId(record._id);
                              setOpenAddBatchDialog(true);
                            }}
                          >
                            <Add />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
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
        </>
      )}

      {/* Add New Dialog */}
      <Dialog
        open={openAddNewDialog}
        onClose={() => {
          setOpenAddNewDialog(false);
          resetForm();
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Thêm Thuốc Mới vào Kho</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              name="itemName"
              label="Tên thuốc"
              value={medicineForm.itemName}
              onChange={handleFormChange}
              required
              fullWidth
            />
            <TextField
              name="description"
              label="Mô tả"
              value={medicineForm.description}
              onChange={handleFormChange}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              name="quantity"
              label="Số lượng"
              type="number"
              value={medicineForm.quantity}
              onChange={handleFormChange}
              required
              fullWidth
            />
            <FormControl fullWidth required>
              <InputLabel>Đơn vị</InputLabel>
              <Select
                name="unit"
                value={medicineForm.unit}
                onChange={handleFormChange}
                label="Đơn vị"
              >
                {medicationTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              name="lowStockThreshold"
              label="Ngưỡng tồn kho thấp"
              type="number"
              value={medicineForm.lowStockThreshold}
              onChange={handleFormChange}
              required
              fullWidth
            />
            <TextField
              name="expirationDate"
              label="Ngày hết hạn"
              type="date"
              value={medicineForm.expirationDate}
              onChange={handleFormChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: new Date().toISOString().substring(0, 10),
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddNewDialog(false)}>Hủy</Button>
          <Button
            onClick={handleSubmitNewMedicine}
            variant="contained"
            disabled={loading}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Batch Dialog */}
      <Dialog
        open={openAddBatchDialog}
        onClose={() => {
          setOpenAddBatchDialog(false);
          resetForm();
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Thêm Lô Mới vào Sản Phẩm Hiện Có</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth required>
              <InputLabel>Sản phẩm</InputLabel>
              <Select
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                label="Sản phẩm"
                disabled
              >
                {medicineRecords.map((record) => (
                  <MenuItem key={record._id} value={record._id}>
                    {record.itemName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              name="quantity"
              label="Số lượng"
              type="number"
              value={medicineForm.quantity}
              onChange={handleFormChange}
              required
              fullWidth
            />
            <TextField
              name="expirationDate"
              label="Ngày hết hạn"
              type="date"
              value={medicineForm.expirationDate}
              onChange={handleFormChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: new Date().toISOString().substring(0, 10),
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenAddBatchDialog(false);
              resetForm();
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleAddBatch}
            variant="contained"
            disabled={loading}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => {
          setOpenEditDialog(false);
          resetForm();
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chỉnh sửa Thuốc</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              name="itemName"
              label="Tên thuốc"
              value={medicineForm.itemName}
              onChange={handleFormChange}
              required
              fullWidth
            />
            <TextField
              name="description"
              label="Mô tả"
              value={medicineForm.description}
              onChange={handleFormChange}
              multiline
              rows={3}
              fullWidth
            />
            <FormControl fullWidth required>
              <InputLabel>Đơn vị</InputLabel>
              <Select
                name="unit"
                value={medicineForm.unit}
                onChange={handleFormChange}
                label="Đơn vị"
              >
                {medicationTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              name="lowStockThreshold"
              label="Ngưỡng tồn kho thấp"
              type="number"
              value={medicineForm.lowStockThreshold}
              onChange={handleFormChange}
              required
              fullWidth
            />
            <FormControl fullWidth required>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                name="status"
                value={medicineForm.status}
                onChange={handleFormChange}
                label="Trạng thái"
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenEditDialog(false);
              resetForm();
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleEditMedicine}
            variant="contained"
            disabled={loading}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Batch Dialog */}
      <Dialog
        open={openEditBatchDialog}
        onClose={() => {
          setOpenEditBatchDialog(false);
          resetForm();
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chỉnh sửa Lô</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              name="quantity"
              label="Số lượng"
              type="number"
              value={medicineForm.quantity}
              onChange={handleFormChange}
              required
              fullWidth
            />
            <TextField
              name="expirationDate"
              label="Ngày hết hạn"
              type="date"
              value={medicineForm.expirationDate}
              onChange={handleFormChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: new Date().toISOString().substring(0, 10),
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenEditBatchDialog(false);
              resetForm();
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleEditBatch}
            variant="contained"
            disabled={loading}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        maxWidth="lg"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 4,
            boxShadow: "0 32px 64px -12px rgba(0, 0, 0, 0.25)",
            overflow: "hidden",
            maxHeight: "90vh",
          },
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            p: 4,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "300px",
              height: "300px",
              opacity: 0.1,
              background:
                "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Box
                sx={{
                  bgcolor: "rgba(255,255,255,0.15)",
                  borderRadius: 3,
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <LocalPharmacy sx={{ fontSize: 36 }} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight="700" sx={{ mb: 1 }}>
                  Chi tiết Thuốc
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Xem thông tin chi tiết và quản lý tồn kho
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={() => setOpenDetailDialog(false)}
              sx={{
                color: "white",
                bgcolor: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.2)",
                  transform: "rotate(90deg)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </Box>

        <DialogContent sx={{ p: 0 }}>
          {selectedRecord && (
            <Box sx={{ p: 4 }}>
              <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
                <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                  <Box
                    sx={{
                      background:
                        "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                      borderRadius: 3,
                      p: 4,
                      mb: 4,
                      border: "1px solid #e2e8f0",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: -50,
                        right: -50,
                        width: 100,
                        height: 100,
                        bgcolor: "rgba(59, 130, 246, 0.05)",
                        borderRadius: "40%",
                      }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        mb: 3,
                        position: "relative",
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: "#dbeafe",
                          borderRadius: 2,
                          p: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)",
                        }}
                      >
                        <Inventory sx={{ color: "#1976d2", fontSize: 28 }} />
                      </Box>
                      <Box>
                        <Typography
                          variant="h3"
                          fontWeight="800"
                          sx={{ color: "#1e293b", mb: 1 }}
                        >
                          {selectedRecord.itemName}
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#64748b" }}>
                          Mã sản phẩm: #
                          {selectedRecord._id?.slice(-6).toUpperCase()}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                      <Chip
                        icon={<Inventory />}
                        label={`${selectedRecord.totalQuantity} ${selectedRecord.unit}`}
                        sx={{
                          bgcolor: "#dcfce7",
                          color: "#166534",
                          fontWeight: 600,
                          fontSize: "1rem",
                          py: 2,
                          px: 1,
                          height: "auto",
                          "& .MuiChip-label": { px: 2 },
                          "& .MuiChip-icon": { color: "#166534" },
                        }}
                      />
                      <Chip
                        icon={
                          selectedRecord.status === "LOW_STOCK" ||
                          selectedRecord.status === "OUT_OF_STOCK" ? (
                            <Warning />
                          ) : (
                            <CheckCircle />
                          )
                        }
                        label={
                          selectedRecord.status === "LOW_STOCK"
                            ? "Sắp hết hàng"
                            : selectedRecord.status === "OUT_OF_STOCK"
                            ? "Hết hàng"
                            : selectedRecord.status === "DISCONTINUED"
                            ? "Ngừng sử dụng"
                            : "Còn đủ hàng"
                        }
                        sx={{
                          bgcolor:
                            selectedRecord.status === "LOW_STOCK"
                              ? "#fef3c7"
                              : selectedRecord.status === "OUT_OF_STOCK"
                              ? "#fee2e2"
                              : selectedRecord.status === "DISCONTINUED"
                              ? "#f3f4f6"
                              : "#dcfce7",
                          color:
                            selectedRecord.status === "LOW_STOCK"
                              ? "#92400e"
                              : selectedRecord.status === "OUT_OF_STOCK"
                              ? "#991b1b"
                              : selectedRecord.status === "DISCONTINUED"
                              ? "#374151"
                              : "#166534",
                          fontWeight: 600,
                          fontSize: "1rem",
                          py: 2,
                          px: 1,
                          height: "auto",
                          "& .MuiChip-label": { px: 2 },
                          "& .MuiChip-icon": {
                            color:
                              selectedRecord.status === "LOW_STOCK"
                                ? "#92400e"
                                : selectedRecord.status === "OUT_OF_STOCK"
                                ? "#991b1b"
                                : selectedRecord.status === "DISCONTINUED"
                                ? "#374151"
                                : "#166534",
                          },
                        }}
                      />
                    </Box>
                  </Box>
                  <Card
                    sx={{
                      borderRadius: 3,
                      border: "1px solid #e5e7eb",
                      mb: 4,
                      background:
                        "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 3 }}
                      >
                        <Box
                          sx={{
                            bgcolor: "#e0f2fe",
                            borderRadius: 2,
                            p: 2,
                            mr: 3,
                          }}
                        >
                          <Notes sx={{ color: "#0277bd", fontSize: 24 }} />
                        </Box>
                        <Typography
                          variant="h6"
                          fontWeight="700"
                          color="#374151"
                        >
                          Mô tả sản phẩm
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          bgcolor: "white",
                          border: "2px solid #e2e8f0",
                          borderRadius: 2,
                          p: 3,
                          borderLeft: "6px solid #3b82f6",
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            color: selectedRecord.description
                              ? "#374151"
                              : "#9ca3af",
                            fontStyle: selectedRecord.description
                              ? "normal"
                              : "italic",
                            lineHeight: 1.8,
                            fontSize: "1.1rem",
                          }}
                        >
                          {selectedRecord.description ||
                            "Chưa có mô tả cho sản phẩm này"}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={3} sx={{ width: "40%" }}>
                    <Card
                      sx={{
                        height: "100%",
                        borderRadius: 3,
                        border: "1px solid #e5e7eb",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                        },
                        background:
                          "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                      }}
                    >
                      <CardContent sx={{ p: 3, textAlign: "center" }}>
                        <Box
                          sx={{
                            bgcolor: "#0ea5e9",
                            borderRadius: "40%",
                            p: 2,
                            mx: "auto",
                            mb: 2,
                            width: 60,
                            height: 60,
                          }}
                        >
                          <Inventory sx={{ color: "white", fontSize: 28 }} />
                        </Box>
                        <Typography
                          variant="h4"
                          fontWeight="700"
                          sx={{ color: "#0c4a6e", mb: 1 }}
                        >
                          {selectedRecord.totalQuantity}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight="500"
                        >
                          {selectedRecord.unit}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3} sx={{ width: "40%" }}>
                    <Card
                      sx={{
                        height: "100%",
                        borderRadius: 3,
                        border: "1px solid #e5e7eb",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                        },
                        background:
                          "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                      }}
                    >
                      <CardContent sx={{ p: 3, textAlign: "center" }}>
                        <Box
                          sx={{
                            bgcolor: "#f59e0b",
                            borderRadius: "40%",
                            p: 2,
                            mx: "auto",
                            mb: 2,
                            width: 60,
                            height: 60,
                          }}
                        >
                          <CalendarToday
                            sx={{ color: "white", fontSize: 28 }}
                          />
                        </Box>
                        <Typography
                          variant="h6"
                          fontWeight="700"
                          sx={{ color: "#92400e", mb: 1 }}
                        >
                          {new Date(
                            selectedRecord.batches[0]?.expirationDate
                          ).toLocaleDateString("vi-VN")}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight="500"
                        >
                          {Math.floor(
                            (new Date(
                              selectedRecord.batches[0]?.expirationDate
                            ) -
                              new Date()) /
                              (1000 * 60 * 60 * 24)
                          )}{" "}
                          ngày còn lại
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3} sx={{ width: "40%" }}>
                    <Card
                      sx={{
                        height: "100%",
                        borderRadius: 3,
                        border: "1px solid #e5e7eb",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                        },
                        background:
                          "linear-gradient(135deg, #fce7f3 0%, #f9a8d4 100%)",
                      }}
                    >
                      <CardContent sx={{ p: 3, textAlign: "center" }}>
                        <Box
                          sx={{
                            bgcolor: "#ec4899",
                            borderRadius: "40%",
                            p: 2,
                            mx: "auto",
                            mb: 2,
                            width: 60,
                            height: 60,
                          }}
                        >
                          <Schedule sx={{ color: "white", fontSize: 28 }} />
                        </Box>
                        <Typography
                          variant="body1"
                          fontWeight="700"
                          sx={{ color: "#831843", mb: 1 }}
                        >
                          {new Date(
                            selectedRecord.updatedAt
                          ).toLocaleDateString("vi-VN")}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight="500"
                        >
                          Cập nhật lần cuối
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3} sx={{ width: "40%" }}>
                    <Card
                      sx={{
                        height: "100%",
                        borderRadius: 3,
                        border: "1px solid #e5e7eb",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                        },
                        background:
                          "linear-gradient(135deg, #fee2e2 0%, #fca5a5 100%)",
                      }}
                    >
                      <CardContent sx={{ p: 3, textAlign: "center" }}>
                        <Box
                          sx={{
                            bgcolor: "#ef4444",
                            borderRadius: "40%",
                            p: 2,
                            mx: "auto",
                            mb: 2,
                            width: 60,
                            height: 60,
                          }}
                        >
                          <Warning sx={{ color: "white", fontSize: 28 }} />
                        </Box>
                        <Typography
                          variant="h6"
                          fontWeight="700"
                          sx={{ color: "#991b1b", mb: 1 }}
                        >
                          {selectedRecord.lowStockThreshold}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight="500"
                        >
                          Ngưỡng tồn kho thấp
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>

              <Card
                sx={{
                  borderRadius: 3,
                  border: "1px solid #e5e7eb",
                  background: "white",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Box
                      sx={{ bgcolor: "#e0f2fe", borderRadius: 2, p: 2, mr: 3 }}
                    >
                      <Inventory sx={{ color: "#0277bd", fontSize: 24 }} />
                    </Box>
                    <Typography variant="h6" fontWeight="700" color="#374151">
                      Danh sách Lô hàng ({selectedRecord.batches.length} lô)
                    </Typography>
                  </Box>
                  <TableContainer
                    sx={{ borderRadius: 2, border: "1px solid #e5e7eb" }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#f8fafc" }}>
                          <TableCell sx={{ fontWeight: 600, color: "#374151" }}>
                            Số lượng
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600, color: "#374151" }}>
                            Ngày hết hạn
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600, color: "#374151" }}>
                            Ngày thêm
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600, color: "#374151" }}>
                            Trạng thái
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600, color: "#374151" }}>
                            Hành động
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedRecord.batches.map((batch, index) => {
                          const daysUntilExpiry = Math.floor(
                            (new Date(batch.expirationDate) - new Date()) /
                              (1000 * 60 * 60 * 24)
                          );
                          const isNearExpiry = daysUntilExpiry <= 30;

                          return (
                            <TableRow
                              key={batch._id}
                              sx={{
                                "&:hover": { bgcolor: "#f8fafc" },
                                borderBottom:
                                  index === selectedRecord.batches.length - 1
                                    ? "none"
                                    : "1px solid #e5e7eb",
                              }}
                            >
                              <TableCell sx={{ fontWeight: 500 }}>
                                {batch.quantity} {selectedRecord.unit}
                              </TableCell>
                              <TableCell>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Typography variant="body2" fontWeight="500">
                                    {new Date(
                                      batch.expirationDate
                                    ).toLocaleDateString("vi-VN")}
                                  </Typography>
                                  {isNearExpiry && (
                                    <Chip
                                      size="small"
                                      label="Sắp hết hạn"
                                      color="warning"
                                      sx={{ fontSize: "0.75rem" }}
                                    />
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell>
                                {new Date(batch.addedAt).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  size="small"
                                  label={
                                    daysUntilExpiry > 0
                                      ? `${daysUntilExpiry} ngày`
                                      : "Hết hạn"
                                  }
                                  color={
                                    daysUntilExpiry > 30
                                      ? "success"
                                      : daysUntilExpiry > 0
                                      ? "warning"
                                      : "error"
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <Tooltip title="Chỉnh sửa lô">
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleOpenEditBatchDialog(batch)
                                    }
                                    sx={{
                                      color: "#3b82f6",
                                      "&:hover": {
                                        bgcolor: "#dbeafe",
                                        transform: "scale(1.1)",
                                      },
                                      transition: "all 0.2s ease",
                                    }}
                                  >
                                    <Edit />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Box>
          )}
        </DialogContent>

        <Box sx={{ bgcolor: "#f8fafc", borderTop: "1px solid #e5e7eb", p: 4 }}>
          <Box sx={{ display: "flex", gap: 3, justifyContent: "flex-end" }}>
            <Button
              onClick={() => {
                setOpenDetailDialog(false);
                handleOpenEditDialog(selectedRecord);
              }}
              variant="contained"
              startIcon={<Edit />}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "1rem",
                background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Chỉnh sửa thông tin
            </Button>
            <Button
              onClick={() => setOpenDetailDialog(false)}
              variant="outlined"
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "1rem",
                borderColor: "#d1d5db",
                color: "#374151",
                "&:hover": {
                  borderColor: "#9ca3af",
                  bgcolor: "#f3f4f6",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Đóng
            </Button>
          </Box>
        </Box>
      </Dialog>

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
            Thuốc <strong>{lastSavedRecord?.itemName}</strong> đã được thêm vào
            kho.
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
      <Dialog
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
          setRecordToDelete(null);
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: "center" }}>
          <Warning sx={{ fontSize: 40, color: "#ef4444", mb: 1 }} />
          <Typography variant="h6">Xác nhận ngừng sử dụng</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn ngừng sử dụng thuốc này không?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 3 }}>
          <Button
            onClick={() => {
              setOpenDeleteDialog(false);
              setRecordToDelete(null);
            }}
            variant="outlined"
            sx={{ textTransform: "none" }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            sx={{ textTransform: "none" }}
            disabled={loading}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={errorSnackBar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={errorSnackBar.message}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ bgcolor: "#ef4444", color: "white" }}
      />
    </Container>
  );
};

export default MedicineCRUD;

import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
} from "@mui/material";
import { medicalSupplies } from "~/mock/mock";

function InventoryMedicalSupplies() {
  const [supplyForm, setSupplyForm] = useState({
    supplyName: "",
    quantity: "",
    type: "",
    entryDate: new Date().toISOString().substring(0, 10),
    notes: "",
  });
  const [supplyRecords, setSupplyRecords] = useState(medicalSupplies || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [lastSavedRecord, setLastSavedRecord] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const supplyTypes = ["cái", "chai", "gói", "hộp", "túi", "cuộn", "bộ", "bình"];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setSupplyForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmitSupply = (e) => {
    e.preventDefault();
    const newSupplyRecord = {
      id: Date.now().toString(),
      ...supplyForm,
      quantity: parseInt(supplyForm.quantity),
      timestamp: new Date().toLocaleString("vi-VN"),
    };
    setSupplyRecords((prevRecords) => [...prevRecords, newSupplyRecord]);
    setLastSavedRecord(newSupplyRecord);
    setShowConfirmationDialog(true);
    setOpenAddDialog(false);
    setSupplyForm({
      supplyName: "",
      quantity: "",
      type: "",
      entryDate: new Date().toISOString().substring(0, 10),
      notes: "",
    });
    setCurrentPage(Math.ceil((supplyRecords.length + 1) / itemsPerPage)); // Chuyển đến trang cuối
  };

  const handleEditSupply = (e) => {
    e.preventDefault();
    const updatedRecords = supplyRecords.map((record) =>
      record.id === selectedRecord.id
        ? {
            ...record,
            ...supplyForm,
            quantity: parseInt(supplyForm.quantity),
            timestamp: new Date().toLocaleString("vi-VN"),
          }
        : record
    );
    setSupplyRecords(updatedRecords);
    setOpenEditDialog(false);
    setSupplyForm({
      supplyName: "",
      quantity: "",
      type: "",
      entryDate: new Date().toISOString().substring(0, 10),
      notes: "",
    });
    setSelectedRecord(null);
  };

  const handleDeleteRecord = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa vật tư này khỏi kho không?")) {
      const updatedRecords = supplyRecords.filter((record) => record.id !== id);
      setSupplyRecords(updatedRecords);
      // Điều chỉnh trang hiện tại nếu trang hiện tại trống
      if (
        currentPage > 1 &&
        Math.ceil(updatedRecords.length / itemsPerPage) < currentPage
      ) {
        setCurrentPage(currentPage - 1);
      }
      alert("Vật tư đã được xóa khỏi kho.");
    }
  };

  const handleOpenDetailDialog = (record) => {
    setSelectedRecord(record);
    setOpenDetailDialog(true);
  };

  const handleOpenEditDialog = (record) => {
    setSelectedRecord(record);
    setSupplyForm({
      supplyName: record.supplyName,
      quantity: record.quantity.toString(),
      type: record.type,
      entryDate: record.entryDate,
      notes: record.notes,
    });
    setOpenEditDialog(true);
  };

  const filteredRecords = supplyRecords.filter((record) =>
    record.supplyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Phân trang
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="min-h-[90vh] p-6 bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-300">
      <h1 className="text-3xl font-extrabold mb-3 text-blue-800 tracking-tight">
        Quản lý Vật tư Y tế trong kho
      </h1>

      <div className="bg-blue-100 w-fit text-left p-4 rounded-lg border border-blue-200 shadow-md mb-6">
        <AlertTriangle size={18} className="text-yellow-500 inline-block mr-2" />
        <p className="text-sm text-blue-600 inline-block">
          Quản lý và theo dõi vật tư y tế trong kho của trường học.
        </p>
      </div>

      {/* Thanh tìm kiếm và nút thêm */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
        <TextField
          type="text"
          label="Tìm kiếm theo tên vật tư"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: { xs: "100%", sm: 300 } }}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <Search size={18} className="text-gray-400 mr-2" />
            ),
          }}
        />
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#2563eb",
            "&:hover": { backgroundColor: "#1d4ed8" },
            color: "white",
            fontWeight: "bold",
            borderRadius: "8px",
            padding: "12px 24px",
            textTransform: "none",
          }}
          startIcon={<Plus size={20} />}
          onClick={() => setOpenAddDialog(true)}
        >
          Thêm mới
        </Button>
      </Box>

      {/* Bảng danh sách vật tư */}
      <TableContainer component={Paper} sx={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
              <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>Tên vật tư</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>Số lượng</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>Kiểu</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>Ngày nhập</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>Ghi chú</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#1a202c" }}>Hành động</TableCell>
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
                  <TableCell>{record.supplyName}</TableCell>
                  <TableCell>{record.quantity}</TableCell>
                  <TableCell>{record.type}</TableCell>
                  <TableCell>{record.entryDate}</TableCell>
                  <TableCell>{record.notes || "Không có"}</TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditDialog(record);
                        }}
                        sx={{ padding: "8px", minWidth: "auto" }}
                        aria-label="Chỉnh sửa vật tư"
                      >
                        <Edit2 size={20} />
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRecord(record.id);
                        }}
                        sx={{ padding: "8px", minWidth: "auto" }}
                        aria-label="Xóa vật tư"
                      >
                        <Trash2 size={20} className="text-red-600" />
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Box textAlign="center" py={4}>
                    <Typography color="textSecondary">
                      Chưa có vật tư nào trong kho.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phân trang */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            sx={{ "& .MuiPaginationItem-root": { fontSize: "1rem" } }}
          />
        </Box>
      )}

      {/* Dialog Thêm Vật tư */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Thêm Vật tư vào kho</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmitSupply}>
            <TextField
              name="supplyName"
              label="Tên vật tư"
              value={supplyForm.supplyName}
              onChange={handleFormChange}
              required
              fullWidth
              variant="outlined"
              margin="normal"
              placeholder="Ví dụ: Băng gạc, cồn sát trùng..."
            />
            <TextField
              name="quantity"
              label="Số lượng"
              type="number"
              value={supplyForm.quantity}
              onChange={handleFormChange}
              required
              fullWidth
              variant="outlined"
              margin="normal"
              placeholder="Ví dụ: 50, 20..."
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Kiểu</InputLabel>
              <Select
                name="type"
                value={supplyForm.type}
                onChange={handleFormChange}
                required
                label="Kiểu"
              >
                <MenuItem value="">Chọn kiểu</MenuItem>
                {supplyTypes.map((type) => (
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
              value={supplyForm.entryDate}
              onChange={handleFormChange}
              required
              fullWidth
              variant="outlined"
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="notes"
              label="Ghi chú"
              value={supplyForm.notes}
              onChange={handleFormChange}
              fullWidth
              variant="outlined"
              margin="normal"
              multiline
              rows={2}
              placeholder="Ví dụ: Gói 10cm x 10cm, chai 500ml..."
            />
            <DialogActions>
              <Button onClick={() => setOpenAddDialog(false)} color="inherit">
                Hủy
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Lưu
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Chi tiết Vật tư */}
      <Dialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)}>
        <DialogTitle>Chi tiết Vật tư</DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <Box>
              <Typography variant="body1" gutterBottom>
                <strong>Tên vật tư:</strong> {selectedRecord.supplyName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Số lượng:</strong> {selectedRecord.quantity}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Kiểu:</strong> {selectedRecord.type}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Ngày nhập:</strong> {selectedRecord.entryDate}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Ghi chú:</strong> {selectedRecord.notes || "Không có"}
              </Typography>
              <Typography variant="body2" color="textSecondary" mt={2}>
                <strong>Ghi nhận lúc:</strong> {selectedRecord.timestamp}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailDialog(false)} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Chỉnh sửa Vật tư */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Chỉnh sửa Vật tư trong kho</DialogTitle>
        <DialogContent>
          <form onSubmit={handleEditSupply}>
            <TextField
              name="supplyName"
              label="Tên vật tư"
              value={supplyForm.supplyName}
              onChange={handleFormChange}
              required
              fullWidth
              variant="outlined"
              margin="normal"
            />
            <TextField
              name="quantity"
              label="Số lượng"
              type="number"
              value={supplyForm.quantity}
              onChange={handleFormChange}
              required
              fullWidth
              variant="outlined"
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Kiểu</InputLabel>
              <Select
                name="type"
                value={supplyForm.type}
                onChange={handleFormChange}
                required
                label="Kiểu"
              >
                <MenuItem value="">Chọn kiểu</MenuItem>
                {supplyTypes.map((type) => (
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
              value={supplyForm.entryDate}
              onChange={handleFormChange}
              required
              fullWidth
              variant="outlined"
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="notes"
              label="Ghi chú"
              value={supplyForm.notes}
              onChange={handleFormChange}
              fullWidth
              variant="outlined"
              margin="normal"
              multiline
              rows={2}
            />
            <DialogActions>
              <Button onClick={() => setOpenEditDialog(false)} color="inherit">
                Hủy
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Lưu
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Xác nhận Lưu */}
      <Dialog
        open={showConfirmationDialog}
        onClose={() => setShowConfirmationDialog(false)}
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
          component="div"
          sx={{ paddingBottom: "0", display: "flex", flexDirection: "column", alignItems: "center" }}
        >
          <Box sx={{ mb: 2 }}>
            <CheckCircle size={60} className="text-green-500" />
          </Box>
          <Typography variant="h5" component="h3" sx={{ fontWeight: "bold", color: "#1a202c" }}>
            Ghi nhận Thành công!
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ paddingTop: "8px !important" }}>
          <Typography variant="body1" sx={{ color: "#4a5568" }}>
            Vật tư <Typography variant="body1" sx={{ fontWeight: "700" }}>{lastSavedRecord?.supplyName}</Typography> đã được thêm vào kho.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: "16px", paddingTop: "24px" }}>
          <Button
            onClick={() => setShowConfirmationDialog(false)}
            variant="outlined"
            sx={{
              borderColor: "#cbd5e0",
              color: "#4a5568",
              fontWeight: "bold",
              borderRadius: "8px",
              padding: "12px 24px",
              "&:hover": { backgroundColor: "#f7fafc", borderColor: "#a0aec0" },
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              textTransform: "none",
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default InventoryMedicalSupplies;
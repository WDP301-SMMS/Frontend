import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import { Search as SearchIcon, Add as AddIcon, Edit as EditIcon } from "@mui/icons-material";
import medicationRequestsService from "~/libs/api/services/medicationRequestsService";
import userStudentServiceInstance from "~/libs/api/services/userStudentService";

const MedicationRequests = () => {
  const [form, setForm] = useState({
    _id: "",
    parentId: "",
    studentId: "",
    startDate: "",
    endDate: "",
    items: [{ medicationName: "", dosage: "", instruction: "" }],
    prescriptionFile: null,
  });
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [parents, setParents] = useState([]);
  const [editMode, setEditMode] = useState(false);

  // Fetch all requests and parents on component mount
  useEffect(() => {
    fetchRequests();
    fetchParents();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await medicationRequestsService.getAllRequests();
      setRequests(res.data);
      setFilteredRequests(res.data);
    } catch (error) {
      console.error(error);
      alert("Lỗi khi lấy danh sách yêu cầu");
    }
  };

  const fetchParents = async () => {
    try {
      const res = await userStudentServiceInstance.getAllUsers({ role: "Parent" });
      console.log("Fetched parents:", res);
      setParents(res.data.users);
    } catch (error) {
      console.error(error);
      alert("Lỗi khi lấy danh sách phụ huynh");
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
      items: [...form.items, { medicationName: "", dosage: "", instruction: "" }],
    });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, prescriptionFile: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("parentId", form.parentId);
      formData.append("studentId", form.studentId);
      formData.append("startDate", form.startDate);
      formData.append("endDate", form.endDate);
      formData.append("prescriptionFile", form.prescriptionFile);
      formData.append("items", JSON.stringify(form.items));

      if (editMode && form._id) {
        await medicationRequestsService.updateRequestInfo(form._id, formData);
        alert("Cập nhật yêu cầu thành công!");
      } else {
        await medicationRequestsService.createRequest(formData);
        alert("Gửi yêu cầu uống thuốc thành công!");
      }
      setOpenDialog(false);
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
      fetchRequests();
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi gửi/cập nhật yêu cầu.");
    }
  };

  const handleEditRequest = (request) => {
    setForm({
      _id: request._id,
      parentId: request.parentId._id,
      studentId: request.studentId._id,
      startDate: request.startDate.split("T")[0],
      endDate: request.endDate.split("T")[0],
      items: request.requestItems.map(item => ({
        medicationName: item.medicationName,
        dosage: item.dosage,
        instruction: item.instruction
      })),
      prescriptionFile: null,
    });
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleUpdateItems = async () => {
    try {
      await medicationRequestsService.updateItems(selectedRequest._id, form.items);
      alert("Cập nhật danh sách thuốc thành công!");
      setSelectedRequest({ ...selectedRequest, requestItems: form.items });
      setForm({ ...form, items: [{ medicationName: "", dosage: "", instruction: "" }] });
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi cập nhật danh sách thuốc.");
    }
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

  const handleRowClick = async (requestId) => {
    try {
      const request = await medicationRequestsService.getRequestById(requestId);
      setSelectedRequest(request.data);
    } catch (error) {
      console.error(error);
      alert("Lỗi khi lấy chi tiết yêu cầu");
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1200, margin: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Quản lý yêu cầu uống thuốc
      </Typography>

      {/* Search and Filter */}
      <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
        <TextField
          label="Tìm kiếm theo tên học sinh/phụ huynh"
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
        <TextField
          select
          label="Lọc theo trạng thái"
          value={filterStatus}
          onChange={(e) => handleFilterStatus(e.target.value)}
          SelectProps={{ native: true }}
          sx={{ width: 200 }}
        >
          <option value="">Tất cả</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </TextField>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
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
            setOpenDialog(true);
          }}
        >
          Thêm yêu cầu
        </Button>
      </Box>

      {/* Requests Table */}
      <TableContainer component={Paper}>
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
                onClick={() => handleRowClick(request._id)}
                sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#f5f5f5" } }}
              >
                <TableCell>{request.parentId.username}</TableCell>
                <TableCell>{request.studentId.fullName}</TableCell>
                <TableCell>{new Date(request.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(request.endDate).toLocaleDateString()}</TableCell>
                <TableCell>{request.status}</TableCell>
                <TableCell>{request.prescriptionFile}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditRequest(request)} color="primary">
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Request Details Dialog */}
      <Dialog open={!!selectedRequest} onClose={() => setSelectedRequest(null)}>
        <DialogTitle>Chi tiết yêu cầu</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box>
              <Typography>
                <strong>Phụ huynh:</strong> {selectedRequest.parentId.username}
              </Typography>
              <Typography>
                <strong>Học sinh:</strong> {selectedRequest.studentId.fullName}
              </Typography>
              <Typography>
                <strong>Ngày bắt đầu:</strong>{" "}
                {new Date(selectedRequest.startDate).toLocaleDateString()}
              </Typography>
              <Typography>
                <strong>Ngày kết thúc:</strong>{" "}
                {new Date(selectedRequest.endDate).toLocaleDateString()}
              </Typography>
              <Typography>
                <strong>Trạng thái:</strong> {selectedRequest.status}
              </Typography>
              <Typography>
                <strong>File đơn thuốc:</strong> {selectedRequest.prescriptionFile}
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Danh sách thuốc:
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tên thuốc</TableCell>
                    <TableCell>Liều dùng</TableCell>
                    <TableCell>Hướng dẫn</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedRequest.requestItems.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item.medicationName}</TableCell>
                      <TableCell>{item.dosage}</TableCell>
                      <TableCell>{item.instruction}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => setForm({ ...form, items: selectedRequest.requestItems })}
                >
                  Chỉnh sửa danh sách thuốc
                </Button>
                <Button
                  variant="contained"
                  onClick={handleUpdateItems}
                  sx={{ ml: 2 }}
                  disabled={!form.items.length}
                >
                  Cập nhật danh sách
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedRequest(null)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Request Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editMode ? "Chỉnh sửa yêu cầu" : "Thêm yêu cầu uống thuốc"}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  label="Phụ huynh"
                  value={form.parentId}
                  onChange={(e) => handleInputChange("parentId", e.target.value)}
                >
                  {parents.map((parent) => (
                    <MenuItem key={parent._id} value={parent._id}>
                      {parent.username}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Student ID"
                  value={form.studentId}
                  onChange={(e) => handleInputChange("studentId", e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={form.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={form.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Tải file đơn thuốc (PDF):</Typography>
                <input type="file" accept="application/pdf" onChange={handleFileChange} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Thuốc được yêu cầu:</Typography>
              </Grid>
              {form.items.map((item, index) => (
                <React.Fragment key={index}>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Tên thuốc"
                      value={item.medicationName}
                      onChange={(e) => handleItemChange(index, "medicationName", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Liều dùng"
                      value={item.dosage}
                      onChange={(e) => handleItemChange(index, "dosage", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Hướng dẫn"
                      value={item.instruction}
                      onChange={(e) => handleItemChange(index, "instruction", e.target.value)}
                    />
                  </Grid>
                </React.Fragment>
              ))}
              <Grid item xs={12}>
                <Button variant="outlined" onClick={handleAddItem}>
                  + Thêm thuốc
                </Button>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editMode ? "Cập nhật" : "Gửi yêu cầu"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedicationRequests;
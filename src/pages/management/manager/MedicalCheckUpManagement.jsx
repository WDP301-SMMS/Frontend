import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2'; // Vẫn giữ Swal cho các confirm dialog (ví dụ: xóa)
import healthCheckTemplateService from '~/libs/api/services/healthCheckTemplateService';

// MUI Imports
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControlLabel,
  Checkbox,
  Grid,
  MenuItem,
  TableContainer,
  TablePagination,
  Stack,
  Divider,
  Tooltip,
  Snackbar, // Thêm Snackbar
  Alert // Thêm Alert (dùng bên trong Snackbar)
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  Healing as HealingIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Plus, Search } from 'lucide-react';

// Styled Paper cho phần form và detail
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[5],
}));

// Styled TableContainer
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
}));

// Component cho Form (không thay đổi nhiều logic, chỉ chỉnh sửa UI và thêm xử lý thông báo)
const HealthCheckTemplateForm = ({ initialData, onSubmit, onCancel, isEditing }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [checkupItems, setCheckupItems] = useState(initialData?.checkupItems || [{ itemId: '', itemName: '', unit: '', dataType: '', guideline: '' }]);
  const [isDefault, setIsDefault] = useState(initialData?.isDefault || false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setCheckupItems(initialData.checkupItems && initialData.checkupItems.length > 0
        ? initialData.checkupItems
        : [{ itemId: '', itemName: '', unit: '', dataType: '', guideline: '' }]
      );
      setIsDefault(initialData.isDefault);
    } else {
      setName('');
      setDescription('');
      setCheckupItems([{ itemId: '', itemName: '', unit: '', dataType: '', guideline: '' }]);
      setIsDefault(false);
    }
  }, [initialData]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...checkupItems];
    newItems[index][field] = value;
    setCheckupItems(newItems);
  };

  const handleAddItem = () => {
    setCheckupItems([...checkupItems, { itemId: '', itemName: '', unit: '', dataType: '', guideline: '' }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = checkupItems.filter((_, i) => i !== index);
    setCheckupItems(newItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, description, checkupItems, isDefault });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
        {isEditing ? 'Chỉnh sửa Mẫu Khám' : 'Thêm Mới Mẫu Khám'}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <TextField
        label="Tên Mẫu Khám"
        variant="outlined"
        fullWidth
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Mô tả"
        variant="outlined"
        fullWidth
        margin="normal"
        multiline
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Typography variant="h6" sx={{ mt: 3, mb: 2, color: 'text.secondary' }}>Các Mục Kiểm Tra:</Typography>
      {checkupItems.map((item, index) => (
        <Paper key={index} elevation={2} sx={{ p: 2, mb: 2, position: 'relative', borderLeft: '4px solid', borderColor: 'info.main' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Item ID"
                variant="outlined"
                fullWidth
                size="small"
                value={item.itemId}
                onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tên Mục"
                variant="outlined"
                fullWidth
                size="small"
                value={item.itemName}
                onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Đơn vị"
                variant="outlined"
                fullWidth
                size="small"
                value={item.unit}
                onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Kiểu Dữ Liệu"
                variant="outlined"
                fullWidth
                size="small"
                select
                value={item.dataType}
                onChange={(e) => handleItemChange(index, 'dataType', e.target.value)}
                required
              >
                <MenuItem value="">Chọn kiểu</MenuItem>
                <MenuItem value="NUMBER">NUMBER</MenuItem>
                <MenuItem value="STRING">STRING</MenuItem>
                <MenuItem value="BOOLEAN">BOOLEAN</MenuItem>
                <MenuItem value="TEXT">TEXT</MenuItem>
                <MenuItem value="SELECT">SELECT</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Hướng dẫn"
                variant="outlined"
                fullWidth
                size="small"
                value={item.guideline}
                onChange={(e) => handleItemChange(index, 'guideline', e.target.value)}
              />
            </Grid>
          </Grid>
          <Tooltip title="Xóa mục kiểm tra">
            <IconButton
              size="small"
              onClick={() => handleRemoveItem(index)}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: 'error.main',
                '&:hover': { backgroundColor: 'error.light', color: 'white' }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Paper>
      ))}
      <Button
        variant="contained"
        color="secondary"
        startIcon={<AddIcon />}
        onClick={handleAddItem}
        sx={{ mt: 1, mb: 3 }}
      >
        Thêm Mục Kiểm Tra
      </Button>

      <FormControlLabel
        control={
          <Checkbox
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            name="isDefault"
            color="primary"
            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
          />
        }
        label={<Typography variant="body1" sx={{ fontWeight: 'medium' }}>Đặt làm Mặc Định</Typography>}
        sx={{ mt: 2, mb: 3 }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          size="large"
          sx={{ minWidth: 120 }}
        >
          {isEditing ? 'Cập nhật' : 'Thêm'}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onCancel}
          size="large"
          sx={{ minWidth: 120 }}
        >
          Hủy
        </Button>
      </Box>
    </Box>
  );
};


// Component để hiển thị chi tiết mẫu khám
const HealthCheckTemplateDetail = ({ template, onClose }) => {
  if (!template) return null;
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
        Chi tiết Mẫu Khám: {template.name}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Typography variant="subtitle1" color="text.secondary">Mô tả:</Typography>
          <Typography variant="body1">{template.description || 'N/A'}</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="subtitle1" color="text.secondary">Là Mặc Định:</Typography>
          <Typography variant="body1">{template.isDefault ? 'Có' : 'Không'}</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="subtitle1" color="text.secondary">ID:</Typography>
          <Typography variant="body1">{template._id}</Typography>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mt: 3, mb: 2, color: 'text.secondary' }}>Các Mục Kiểm Tra:</Typography>
      {template.checkupItems && template.checkupItems.length > 0 ? (
        <StyledTableContainer component={Paper} elevation={1}>
          <Table size="medium">
            <TableHead sx={{ backgroundColor: 'primary.light' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Item ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Tên Mục</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Đơn vị</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Kiểu Dữ Liệu</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Hướng dẫn</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {template.checkupItems.map((item, index) => (
                <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
                  <TableCell>{item.itemId}</TableCell>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell>{item.unit || 'N/A'}</TableCell>
                  <TableCell>{item.dataType}</TableCell>
                  <TableCell>{item.guideline || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', mt: 3 }}>
          Không có mục kiểm tra nào được định nghĩa.
        </Typography>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button variant="contained" color="secondary" onClick={onClose} size="large">Đóng</Button>
      </Box>
    </Box>
  );
};


// Component chính
const MedicalCheckupManagement = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [totalTemplates, setTotalTemplates] = useState(0);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [viewingTemplate, setViewingTemplate] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // State cho Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // can be 'success', 'error', 'info', 'warning'

  // Helper function to show Snackbar
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await healthCheckTemplateService.getListHealthCheckTemplates({ page: page + 1, limit, search });
      setTemplates(response.data.templates || []);
      setTotalTemplates(response.data.total || 0);
    } catch (err) {
      setError('Không thể tải danh sách mẫu khám. Vui lòng thử lại.');
      console.error(err);
      showSnackbar('Không thể tải danh sách mẫu khám. Vui lòng thử lại.', 'error'); // Sử dụng Snackbar
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleAddClick = () => {
    setEditingTemplate(null);
    setShowFormModal(true);
  };

  const handleEditClick = async (templateId) => {
    try {
      const response = await healthCheckTemplateService.getHealthCheckTemplateById(templateId);
      setEditingTemplate(response.data);
      setShowFormModal(true);
    } catch (err) {
      console.error('Failed to fetch template for editing:', err);
      showSnackbar('Không thể tải chi tiết mẫu khám để chỉnh sửa.', 'error'); // Sử dụng Snackbar
    }
  };

  const handleViewDetailClick = async (templateId) => {
    try {
      const response = await healthCheckTemplateService.getHealthCheckTemplateById(templateId);
      setViewingTemplate(response.data);
      setShowDetailModal(true);
    } catch (err) {
      console.error('Failed to fetch template for viewing:', err);
      showSnackbar('Không thể tải chi tiết mẫu khám.', 'error'); // Sử dụng Snackbar
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingTemplate) {
        await healthCheckTemplateService.updateHealthCheckTemplate(editingTemplate._id, formData);
        showSnackbar('Cập nhật mẫu khám thành công.', 'success'); // Sử dụng Snackbar
      } else {
        await healthCheckTemplateService.createHealthCheckTemplate(formData);
        showSnackbar('Thêm mẫu khám mới thành công.', 'success'); // Sử dụng Snackbar
      }
      setShowFormModal(false);
      setEditingTemplate(null);
      fetchTemplates();
    } catch (err) {
      console.error('Failed to save template:', err);
      showSnackbar('Lưu mẫu khám thất bại. Vui lòng kiểm tra dữ liệu.', 'error'); // Sử dụng Snackbar
    }
  };

  const handleDeleteClick = async (templateId, templateName) => {
    // Vẫn giữ Swal cho confirm dialog vì nó có tính tương tác cao hơn
    Swal.fire({
      title: `Bạn có chắc chắn muốn xóa mẫu khám "${templateName}" không?`,
      text: "Bạn sẽ không thể hoàn tác hành động này!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Có, xóa nó!',
      cancelButtonText: 'Hủy'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await healthCheckTemplateService.deleteHealthCheckTemplate(templateId);
          showSnackbar('Mẫu khám đã được xóa.', 'success'); // Sử dụng Snackbar
          fetchTemplates();
        } catch (err) {
          console.error('Failed to delete template:', err);
          showSnackbar('Xóa mẫu khám thất bại. Mẫu khám có thể đang được sử dụng.', 'error'); // Sử dụng Snackbar
        }
      }
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{
        padding: 3,
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        width: "100%",
      }}>
      <div className="mx-auto">
        <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl border border-blue-100 mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-400/20 to-blue-500/20 rounded-full transform -translate-x-12 translate-y-12"></div>
          <div className="relative p-8">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <HealingIcon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-3 leading-tight">
                   Quản Lý Mẫu Khám Sức Khỏe
                </h1>
                <p className="text-lg text-gray-600 font-medium leading-relaxed">
                  Tạo và quản lý các chiến dịch tiêm chủng cho học sinh
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-10">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên mẫu..."
                  value={search}
                  onChange={(e) => handleSearchChange(e)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 bg-gray-50 hover:bg-white focus:bg-white"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <button
                onClick={() => handleAddClick()}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                <span>Thêm Mẫu Khám Mới</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column', gap: 2 }}>
          <CircularProgress size={50} />
          <Typography variant="h6" color="text.secondary">Đang tải danh sách mẫu khám...</Typography>
        </Box>
      ) : error ? (
        <Typography color="error" align="center" variant="h6" sx={{ mt: 5 }}>{error}</Typography>
      ) : (
        <StyledPaper elevation={8}>
          <StyledTableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: 'primary.dark' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tên Mẫu</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Mô tả</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Mặc Định</TableCell>
                  <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Hành Động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {templates.length > 0 ? (
                  templates.map((template) => (
                    <TableRow
                      key={template._id}
                      sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}
                    >
                      <TableCell sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {template._id}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'medium' }}>{template.name}</TableCell>
                      <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {template.description}
                      </TableCell>
                      <TableCell>
                        <Checkbox checked={template.isDefault} disabled sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }} />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Xem chi tiết">
                            <IconButton
                              color="info"
                              onClick={() => handleViewDetailClick(template._id)}
                              aria-label="Xem chi tiết"
                              sx={{ '&:hover': { color: 'white', backgroundColor: 'info.main' } }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Sửa">
                            <IconButton
                              color="primary"
                              onClick={() => handleEditClick(template._id)}
                              aria-label="Sửa"
                              sx={{ '&:hover': { color: 'white', backgroundColor: 'primary.main' } }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa">
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteClick(template._id, template.name)}
                              aria-label="Xóa"
                              sx={{ '&:hover': { color: 'white', backgroundColor: 'error.main' } }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3, fontStyle: 'italic', color: 'text.secondary' }}>
                      Không có mẫu khám nào để hiển thị.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </StyledTableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalTemplates}
            rowsPerPage={limit}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số hàng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) =>
              `Hiển thị ${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
            }
            sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 1 }}
          />
        </StyledPaper>
      )}

      {/* Dialog cho Form Thêm/Sửa */}
      <Dialog
        open={showFormModal}
        onClose={() => setShowFormModal(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
      >
        <DialogTitle sx={{ backgroundColor: 'primary.dark', color: 'white', pb: 2 }}>
          {editingTemplate ? 'Chỉnh sửa Mẫu Khám' : 'Thêm Mới Mẫu Khám'}
          <IconButton
            aria-label="close"
            onClick={() => setShowFormModal(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ backgroundColor: 'background.paper' }}>
          <HealthCheckTemplateForm
            initialData={editingTemplate}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowFormModal(false)}
            isEditing={!!editingTemplate}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog cho Xem Chi Tiết */}
      <Dialog
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
      >
        <DialogTitle sx={{ backgroundColor: 'secondary.dark', color: 'white', pb: 2 }}>
          Chi tiết Mẫu Khám Sức Khỏe
          <IconButton
            aria-label="close"
            onClick={() => setShowDetailModal(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ backgroundColor: 'background.paper' }}>
          <HealthCheckTemplateDetail
            template={viewingTemplate}
            onClose={() => setShowDetailModal(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Snackbar để hiển thị thông báo thành công/thất bại */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} // Tự động đóng sau 6 giây
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Hiển thị ở giữa phía trên
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled" // Dùng variant filled để nổi bật hơn
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MedicalCheckupManagement;
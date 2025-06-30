import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  InputAdornment,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Send as SendIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  Preview as PreviewIcon
} from '@mui/icons-material';

const SendCheckupNotice = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [notices, setNotices] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newNotice, setNewNotice] = useState({
    title: '',
    targetType: 'all',
    grade: '',
    class: '',
    content: {
      purpose: '',
      checkupItems: [],
      datetime: '',
      location: '',
      notes: ''
    },
    sendDate: new Date().toISOString().split('T')[0],
    deadline: ''
  });

  // Mock data cho các lớp học
  const grades = ['Khối 1', 'Khối 2', 'Khối 3', 'Khối 4', 'Khối 5', 'Khối 6', 'Khối 7', 'Khối 8', 'Khối 9'];
  const classes = {
    'Khối 1': ['1A', '1B', '1C'],
    'Khối 2': ['2A', '2B', '2C'],
    'Khối 3': ['3A', '3B', '3C'],
    'Khối 4': ['4A', '4B', '4C'],
    'Khối 5': ['5A', '5B', '5C'],
    'Khối 6': ['6A', '6B', '6C'],
    'Khối 7': ['7A', '7B', '7C'],
    'Khối 8': ['8A', '8B', '8C'],
    'Khối 9': ['9A', '9B', '9C']
  };

  const checkupItemsList = [
    'Cân nặng',
    'Chiều cao',
    'Thị lực',
    'Răng miệng',
    'Khám tổng quát',
    'Kiểm tra tim mạch',
    'Kiểm tra hô hấp',
    'Tầm soát dinh dưỡng'
  ];

  // Mock data cho thông báo đã gửi
  useEffect(() => {
    setNotices([
      {
        id: 1,
        title: 'Thông báo kiểm tra sức khỏe định kỳ năm học 2024-2025',
        targetType: 'all',
        sendDate: '2024-12-15',
        deadline: '2024-12-25',
        status: 'sent',
        totalRecipients: 450,
        confirmed: 320,
        pending: 130
      },
      {
        id: 2,
        title: 'Kiểm tra sức khỏe Khối 6',
        targetType: 'grade',
        grade: 'Khối 6',
        sendDate: '2024-12-10',
        deadline: '2024-12-20',
        status: 'sent',
        totalRecipients: 90,
        confirmed: 75,
        pending: 15
      }
    ]);
  }, []);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setNewNotice(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setNewNotice(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleCheckupItemChange = (item, checked) => {
    setNewNotice(prev => ({
      ...prev,
      content: {
        ...prev.content,
        checkupItems: checked 
          ? [...prev.content.checkupItems, item]
          : prev.content.checkupItems.filter(i => i !== item)
      }
    }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const sendNotice = () => {
    if (!newNotice.title || !newNotice.content.purpose) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    const notice = {
      ...newNotice,
      id: notices.length + 1,
      status: 'sent',
      totalRecipients: newNotice.targetType === 'all' ? 450 : 
                      newNotice.targetType === 'grade' ? 90 : 30,
      confirmed: 0,
      pending: newNotice.targetType === 'all' ? 450 : 
               newNotice.targetType === 'grade' ? 90 : 30
    };

    setNotices(prev => [...prev, notice]);
    setNewNotice({
      title: '',
      targetType: 'all',
      grade: '',
      class: '',
      content: {
        purpose: '',
        checkupItems: [],
        datetime: '',
        location: '',
        notes: ''
      },
      sendDate: new Date().toISOString().split('T')[0],
      deadline: ''
    });

    alert('Đã gửi thông báo thành công!');
    setActiveTab(1);
  };

  const deleteNotice = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thông báo này?')) {
      setNotices(prev => prev.filter(notice => notice.id !== id));
    }
  };

  const resetForm = () => {
    setNewNotice({
      title: '',
      targetType: 'all',
      grade: '',
      class: '',
      content: {
        purpose: '',
        checkupItems: [],
        datetime: '',
        location: '',
        notes: ''
      },
      sendDate: new Date().toISOString().split('T')[0],
      deadline: ''
    });
  };

  const filteredNotices = notices.filter(notice =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTargetDisplay = (notice) => {
    if (notice.targetType === 'all') return 'Tất cả';
    if (notice.targetType === 'grade') return notice.grade;
    return `${notice.grade} - ${notice.class}`;
  };

  const PreviewDialog = () => (
    <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle>
        Xem trước thông báo
      </DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, bgcolor: 'background.paper' }}>
          <Typography variant="h5" gutterBottom align="center" color="primary">
            {newNotice.title || '[Tiêu đề thông báo]'}
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Kính gửi: Quý phụ huynh
          </Typography>
          
          <Typography variant="body1" paragraph>
            <strong>Đối tượng:</strong> {
              newNotice.targetType === 'all' ? 'Tất cả học sinh' :
              newNotice.targetType === 'grade' ? newNotice.grade :
              `${newNotice.grade} - ${newNotice.class}`
            }
          </Typography>

          <Typography variant="body1" paragraph>
            <strong>Mục đích kiểm tra:</strong><br />
            {newNotice.content.purpose || '[Chưa nhập mục đích kiểm tra]'}
          </Typography>

          {newNotice.content.checkupItems.length > 0 && (
            <Typography variant="body1" paragraph>
              <strong>Các hạng mục kiểm tra:</strong><br />
              {newNotice.content.checkupItems.map((item, index) => (
                <span key={item}>
                  • {item}
                  {index < newNotice.content.checkupItems.length - 1 && <br />}
                </span>
              ))}
            </Typography>
          )}

          {newNotice.content.datetime && (
            <Typography variant="body1" paragraph>
              <strong>Thời gian kiểm tra:</strong> {new Date(newNotice.content.datetime).toLocaleString('vi-VN')}
            </Typography>
          )}

          {newNotice.content.location && (
            <Typography variant="body1" paragraph>
              <strong>Địa điểm:</strong> {newNotice.content.location}
            </Typography>
          )}

          {newNotice.content.notes && (
            <Typography variant="body1" paragraph>
              <strong>Lưu ý:</strong><br />
              {newNotice.content.notes}
            </Typography>
          )}

          {newNotice.deadline && (
            <Typography variant="body1" paragraph color="error">
              <strong>Hạn chót xác nhận:</strong> {new Date(newNotice.deadline).toLocaleDateString('vi-VN')}
            </Typography>
          )}

          <Typography variant="body2" sx={{ mt: 3, fontStyle: 'italic' }}>
            Trân trọng,<br />
            Ban Giám hiệu nhà trường
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setPreviewOpen(false)}>Đóng</Button>
        <Button variant="contained" onClick={() => {
          setPreviewOpen(false);
          sendNotice();
        }} startIcon={<SendIcon />}>
          Gửi thông báo
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Gửi thông báo kiểm tra y tế
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Quản lý và gửi thông báo kiểm tra sức khỏe định kỳ cho phụ huynh
          </Typography>

          <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}>
            <Tab icon={<AddIcon />} label="Tạo thông báo" />
            <Tab icon={<PeopleIcon />} label="Quản lý thông báo" />
          </Tabs>

          {activeTab === 0 && (
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={3}>
                {/* Thông tin cơ bản */}
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Thông tin cơ bản
                      </Typography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Tiêu đề thông báo *"
                            value={newNotice.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            placeholder="Ví dụ: Thông báo kiểm tra sức khỏe định kỳ năm học 2024-2025"
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            <InputLabel>Đối tượng gửi *</InputLabel>
                            <Select
                              value={newNotice.targetType}
                              label="Đối tượng gửi *"
                              onChange={(e) => handleInputChange('targetType', e.target.value)}
                            >
                              <MenuItem value="all">Tất cả học sinh</MenuItem>
                              <MenuItem value="grade">Theo khối lớp</MenuItem>
                              <MenuItem value="class">Theo lớp cụ thể</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        {newNotice.targetType === 'grade' && (
                          <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                              <InputLabel>Chọn khối</InputLabel>
                              <Select
                                value={newNotice.grade}
                                label="Chọn khối"
                                onChange={(e) => handleInputChange('grade', e.target.value)}
                              >
                                {grades.map(grade => (
                                  <MenuItem key={grade} value={grade}>{grade}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                        )}

                        {newNotice.targetType === 'class' && (
                          <>
                            <Grid item xs={12} md={6}>
                              <FormControl fullWidth>
                                <InputLabel>Chọn khối</InputLabel>
                                <Select
                                  value={newNotice.grade}
                                  label="Chọn khối"
                                  onChange={(e) => handleInputChange('grade', e.target.value)}
                                >
                                  {grades.map(grade => (
                                    <MenuItem key={grade} value={grade}>{grade}</MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <FormControl fullWidth disabled={!newNotice.grade}>
                                <InputLabel>Chọn lớp</InputLabel>
                                <Select
                                  value={newNotice.class}
                                  label="Chọn lớp"
                                  onChange={(e) => handleInputChange('class', e.target.value)}
                                >
                                  {newNotice.grade && classes[newNotice.grade]?.map(cls => (
                                    <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                          </>
                        )}

                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            type="date"
                            label="Ngày gửi"
                            value={newNotice.sendDate}
                            onChange={(e) => handleInputChange('sendDate', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            type="date"
                            label="Hạn chót xác nhận *"
                            value={newNotice.deadline}
                            onChange={(e) => handleInputChange('deadline', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Nội dung thông báo */}
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Nội dung thông báo
                      </Typography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Mục đích kiểm tra *"
                            value={newNotice.content.purpose}
                            onChange={(e) => handleInputChange('content.purpose', e.target.value)}
                            placeholder="Ví dụ: Theo kế hoạch kiểm tra sức khỏe định kỳ của trường..."
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Typography variant="subtitle2" gutterBottom>
                            Các hạng mục kiểm tra
                          </Typography>
                          <FormGroup row>
                            {checkupItemsList.map(item => (
                              <FormControlLabel
                                key={item}
                                control={
                                  <Checkbox
                                    checked={newNotice.content.checkupItems.includes(item)}
                                    onChange={(e) => handleCheckupItemChange(item, e.target.checked)}
                                  />
                                }
                                label={item}
                              />
                            ))}
                          </FormGroup>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            type="datetime-local"
                            label="Thời gian kiểm tra"
                            value={newNotice.content.datetime}
                            onChange={(e) => handleInputChange('content.datetime', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Địa điểm kiểm tra"
                            value={newNotice.content.location}
                            onChange={(e) => handleInputChange('content.location', e.target.value)}
                            placeholder="Ví dụ: Phòng y tế trường"
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Lưu ý dành cho phụ huynh"
                            value={newNotice.content.notes}
                            onChange={(e) => handleInputChange('content.notes', e.target.value)}
                            placeholder="Ví dụ: Học sinh không ăn sáng trước khi kiểm tra, mang theo sổ tiêm chủng..."
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Actions */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Button
                      variant="outlined"
                      onClick={resetForm}
                    >
                      Hủy
                    </Button>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="outlined"
                        startIcon={<PreviewIcon />}
                        onClick={() => setPreviewOpen(true)}
                      >
                        Xem trước
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<SendIcon />}
                        onClick={sendNotice}
                      >
                        Gửi thông báo
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {activeTab === 1 && (
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Quản lý thông báo đã gửi
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    size="small"
                    placeholder="Tìm kiếm thông báo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<FilterListIcon />}
                  >
                    Lọc
                  </Button>
                </Box>
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Thông báo</TableCell>
                      <TableCell>Đối tượng</TableCell>
                      <TableCell>Ngày gửi</TableCell>
                      <TableCell>Trạng thái</TableCell>
                      <TableCell>Xác nhận</TableCell>
                      <TableCell align="right">Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredNotices.map((notice) => (
                      <TableRow key={notice.id} hover>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2">
                              {notice.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Hạn: {new Date(notice.deadline).toLocaleDateString('vi-VN')}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PeopleIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            {getTargetDisplay(notice)}
                          </Box>
                        </TableCell>
                        <TableCell>
                          {new Date(notice.sendDate).toLocaleDateString('vi-VN')}
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={<CheckCircleIcon />}
                            label="Đã gửi"
                            color="success"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              {notice.confirmed}/{notice.totalRecipients}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={(notice.confirmed / notice.totalRecipients) * 100}
                              sx={{ mt: 1 }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton color="primary">
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton color="warning">
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => deleteNotice(notice.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {filteredNotices.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    Không có thông báo nào
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      <PreviewDialog />
    </Box>
  );
};

export default SendCheckupNotice;
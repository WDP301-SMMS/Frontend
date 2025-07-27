import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
  Chip,
  InputAdornment,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Fade,
  TablePagination,
  Tooltip,
  Alert,
  AlertTitle,
} from "@mui/material";
import incidentsService from "~/libs/api/services/incidentsService";
import { Close, Visibility, Warning } from "@mui/icons-material";
import { FileText, Search } from "lucide-react";
import dayjs from "dayjs";

function InventoryMedicalSupplies() {
  const [dispenseLogs, setDispenseLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedIncidentType, setSelectedIncidentType] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [lastSavedRecord, setLastSavedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Lấy danh sách lớp học và loại sự cố duy nhất
  const uniqueClasses = [...new Set(dispenseLogs.map(log => log.studentClassName))].sort();
  const uniqueIncidentTypes = [...new Set(dispenseLogs.map(log => log.incidentType))].sort();

  useEffect(() => {
    const fetchDispenseHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await incidentsService.getDispenseHistory();
        setDispenseLogs(data.data || []);
        setFilteredLogs(data.data || []);
      } catch (error) {
        setError(error.message || "Không thể tải lịch sử cấp phát.");
        setDispenseLogs([]);
        setFilteredLogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDispenseHistory();
  }, []);

  // Lọc dữ liệu
  useEffect(() => {
    let filtered = dispenseLogs;

    // Lọc theo tên học sinh
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.studentName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Lọc theo lớp
    if (selectedClass) {
      filtered = filtered.filter(log => log.studentClassName === selectedClass);
    }

    // Lọc theo loại sự cố
    if (selectedIncidentType) {
      filtered = filtered.filter(log => log.incidentType === selectedIncidentType);
    }

    setFilteredLogs(filtered);
    setPage(0); // Reset về trang đầu khi lọc
  }, [searchTerm, selectedClass, selectedIncidentType, dispenseLogs]);

  const handleViewDetail = (log) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedClass("");
    setSelectedIncidentType("");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getIncidentTypeColor = (type) => {
    switch (type) {
      case "Chấn thương nhẹ":
        return "warning";
      case "Chấn thương nặng":
        return "error";
      case "Dị ứng":
        return "info";
      default:
        return "default";
    }
  };

  const paginatedLogs = filteredLogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container
      maxWidth="xl"
      sx={{ py: 4, bgcolor: "#f8fafc", minHeight: "100vh" }}
    >
      <Typography
              variant="h4"
              sx={{ mb: 2, fontWeight: "bold", color: "#1e3a8a" }}
            >
          Nhật Ký Cấp Phát Vật Tư Y Tế
            </Typography>
      
            <Alert severity="info" icon={<Warning />} sx={{ mb: 3 }}>
          Quản lý và theo dõi việc cấp phát vật tư y tế cho học sinh
            </Alert>

      {/* Filters */}
      <Card sx={{ mb: 3, boxShadow: 1 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Tìm kiếm theo tên học sinh"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={20} />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={3} sx={{ minWidth: 200 }}>
              <FormControl fullWidth >
                <InputLabel>Lớp học</InputLabel>
                <Select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  label="Lớp học"
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  {uniqueClasses.map((className) => (
                    <MenuItem key={className} value={className}>
                      {className}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3} sx={{ minWidth: 200 }}>
              <FormControl fullWidth >
                <InputLabel>Loại sự cố</InputLabel>
                <Select
                  value={selectedIncidentType}
                  onChange={(e) => setSelectedIncidentType(e.target.value)}
                  label="Loại sự cố"
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  {uniqueIncidentTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                onClick={handleClearFilters}
                fullWidth
                sx={{ height: "40px" }}
              >
                Xóa bộ lọc
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Main Content */}
      {loading ? (
        <Card sx={{ textAlign: "center", py: 8 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Đang tải dữ liệu...
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </Box>
          </CardContent>
        </Card>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Lỗi</AlertTitle>
          {error}
        </Alert>
      ) : filteredLogs.length === 0 ? (
        <Card sx={{ textAlign: "center", py: 8 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: "#64748b" }}>
              Không có nhật ký cấp phát nào
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {dispenseLogs.length === 0 
                ? "Hiện tại chưa có dữ liệu nào trong hệ thống."
                : "Không tìm thấy kết quả phù hợp với bộ lọc hiện tại."
              }
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ boxShadow: 2 }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: "#f8fafc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                    Học sinh
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                    Loại sự cố
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                    Thời gian ghi nhận
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                    Vật tư cấp phát
                  </TableCell>
                  {/* <TableCell sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                    Trạng thái
                  </TableCell> */}
                  <TableCell sx={{ fontWeight: "bold", fontSize: "0.875rem", textAlign: "center" }}>
                    Thao tác
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedLogs.map((log) => (
                  <TableRow 
                    key={log.incidentId}
                    sx={{ 
                      '&:hover': { backgroundColor: "#f8fafc" },
                      transition: "background-color 0.2s"
                    }}
                  >
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                          {log.studentName}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {log.studentClassName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={log.incidentType} 
                        color={getIncidentTypeColor(log.incidentType)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {dayjs.utc(log.incidentTime).format('HH:mm DD-MM-YYYY')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ maxWidth: "200px" }}>
                        {log.dispensedItems.slice(0, 2).map((item, index) => (
                          <Typography key={index} variant="caption" sx={{ display: "block" }}>
                            • {item.itemName} ({item.quantity} {item.unit})
                          </Typography>
                        ))}
                        {log.dispensedItems.length > 2 && (
                          <Typography variant="caption" color="primary">
                            +{log.dispensedItems.length - 2} mục khác
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    {/* <TableCell>
                      <Chip 
                        label={log.dispensedAt ? "Đã cấp phát" : "Chưa cấp phát"}
                        color={log.dispensedAt ? "success" : "warning"}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell> */}
                    <TableCell sx={{ textAlign: "center" }}>
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          onClick={() => handleViewDetail(log)}
                          size="small"
                          sx={{ color: "#3b82f6" }}
                        >
                          <Visibility size={18} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredLogs.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Số dòng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) => 
              `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
            }
          />
        </Card>
      )}

      {/* Detail Modal */}
      <Dialog
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        maxWidth="md"
        fullWidth
        TransitionComponent={Fade}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "12px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e5e7eb",
            pb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1f2937" }}>
            Chi tiết nhật ký cấp phát
          </Typography>
          <IconButton onClick={() => setShowDetailModal(false)}>
            <Close size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {selectedLog && (
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} sx={{ minWidth: "48.5%" }}>
                  <Card variant="outlined" sx={{ p: 2, bgcolor: "#f8fafc" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
                      Thông tin học sinh
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" color="textSecondary">Tên:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                          {selectedLog.studentName}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" color="textSecondary">Lớp:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                          {selectedLog.studentClassName}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6} sx={{ minWidth: "48.5%" }}>
                  <Card variant="outlined" sx={{ p: 2, bgcolor: "#f8fafc" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
                      Thông tin sự cố
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" color="textSecondary">Loại:</Typography>
                        <Chip 
                          label={selectedLog.incidentType} 
                          color={getIncidentTypeColor(selectedLog.incidentType)}
                          size="small"
                        />
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" color="textSecondary">Thời gian:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                         {dayjs.utc(selectedLog.incidentTime).format('HH:mm DD-MM-YYYY')}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
                {/* <Grid item xs={12} md={6} sx={{ minWidth: "30%" }}>
                  <Card variant="outlined" sx={{ p: 2 ,height: "100%",bgcolor: "#f8fafc"}}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
                      Trạng thái cấp phát
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Chip 
                        label={selectedLog.dispensedAt ? "Đã cấp phát" : "Chưa cấp phát"}
                        color={selectedLog.dispensedAt ? "success" : "warning"}
                        size="small"
                      />
                      {selectedLog.dispensedAt && (
                        <Typography variant="body2" color="textSecondary">
                          Thời gian: {new Date(selectedLog.dispensedAt).toLocaleString("vi-VN", {
                            timeZone: "Asia/Ho_Chi_Minh",
                          })}
                        </Typography>
                      )}
                    </Box>
                  </Card>
                </Grid> */}
                <Grid item xs={12} md={12} sx={{ minWidth: "100%" }}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
                      Mô tả sự cố
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      p: 2, 
                      bgcolor: "#f8fafc", 
                      borderRadius: 1,
                      fontStyle: selectedLog.incidentDescription ? "normal" : "italic"
                    }}>
                      {selectedLog.incidentDescription || "Không có mô tả"}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={12} sx={{ minWidth: "100%" }}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
                      Vật tư đã cấp phát
                    </Typography>
                    <List dense>
                      {selectedLog.dispensedItems.map((item, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Box sx={{ 
                              width: 8, 
                              height: 8, 
                              borderRadius: "50%", 
                              bgcolor: "#3b82f6" 
                            }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={item.itemName}
                            secondary={`Số lượng: ${item.quantity} ${item.unit}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Card>
                </Grid>
                
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: "1px solid #e5e7eb" }}>
          <Button
            onClick={() => setShowDetailModal(false)}
            variant="outlined"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: "medium",
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
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
          sx={{
            paddingBottom: "0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ mb: 2 }}>
            <FileText size={60} className="text-blue-500" />
          </Box>
          <Typography
            variant="h5"
            component="h3"
            sx={{ fontWeight: "bold", color: "#1a202c" }}
          >
            Ghi nhận Nhật Ký Thành công!
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ paddingTop: "8px !important" }}>
          <Typography variant="body1" sx={{ color: "#4a5568" }}>
            Nhật ký cấp phát cho{" "}
            <Typography variant="body1" sx={{ fontWeight: "700" }}>
              {lastSavedRecord?.supplyName}
            </Typography>{" "}
            đã được cập nhật.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{ justifyContent: "center", gap: "16px", paddingTop: "24px" }}
        >
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
    </Container>
  );
}

export default InventoryMedicalSupplies;
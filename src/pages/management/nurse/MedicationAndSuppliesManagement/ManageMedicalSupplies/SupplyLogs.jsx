import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  Divider,
  Pagination,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Container,
  Alert,
} from "@mui/material";
import {
  Search,
  AlertTriangle,
  ChevronRight,
  User,
  Calendar,
  Clock,
  Package,
} from "lucide-react";
import { AccessTime, EventNote, Warning } from "@mui/icons-material";
import dispenseLogs from "~/mock/mock";

const SupplyLogs = () => {
  const logs = dispenseLogs || [];

  // States
  const [logSearchTerm, setLogSearchTerm] = useState("");
  const [logDateFilter, setLogDateFilter] = useState("");
  const [logClassFilter, setLogClassFilter] = useState("");
  const [logPage, setLogPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);
  const itemsPerPage = 9;

  // Get unique classes from events within logs
  const classes = [...new Set(logs.map((log) => log.event?.class))].sort();

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log?.studentName
          .toLowerCase()
          .includes(logSearchTerm.toLowerCase()) ||
        log?.eventType
          .toLowerCase()
          .includes(logSearchTerm.toLowerCase()) ||
        log?.studentId
          .toLowerCase()
          .includes(logSearchTerm.toLowerCase()) ||
        log.some((supply) =>
          supply.supplyName.toLowerCase().includes(logSearchTerm.toLowerCase())
        );
      const matchesDate =
        logDateFilter === "" || log.dispenseDate === logDateFilter;
      const matchesClass =
        logClassFilter === "" || log.event?.class === logClassFilter;
      return matchesSearch && matchesDate && matchesClass;
    });
  }, [logs, logSearchTerm, logDateFilter, logClassFilter]);

  // Pagination
  const logTotalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = useMemo(() => {
    const startIndex = (logPage - 1) * itemsPerPage;
    return filteredLogs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLogs, logPage]);

  const handleLogPageChange = (event, value) => {
    setLogPage(value);
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

  const handleLogClick = (log) => {
    setSelectedLog(log);
  };

  const handleCloseDialog = () => {
    setSelectedLog(null);
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
        Nhật ký ghi nhận lịch sử sự kiện và vật tư được cấp phát
      </Alert>

      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          label="Tìm kiếm theo tên vật tư, học sinh, sự kiện..."
          value={logSearchTerm}
          onChange={(e) => setLogSearchTerm(e.target.value)}
          sx={{ width: { xs: "100%", sm: 300 } }}
          InputProps={{
            startAdornment: (
              <Search size={18} sx={{ mr: 1, color: "#6b7280" }} />
            ),
          }}
        />
        <TextField
          label="Lọc theo ngày"
          type="date"
          value={logDateFilter}
          onChange={(e) => setLogDateFilter(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ width: { xs: "100%", sm: 200 } }}
        />
        <FormControl sx={{ width: { xs: "100%", sm: 200 } }}>
          <InputLabel>Lọc theo lớp</InputLabel>
          <Select
            value={logClassFilter}
            onChange={(e) => setLogClassFilter(e.target.value)}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200,
                  width: 250,
                },
              },
            }}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {classes.map((cls) => (
              <MenuItem key={cls} value={cls}>
                {cls}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={2} sx={{ maxHeight: "60vh", overflowY: "auto" }}>
        {paginatedLogs.length > 0 ? (
          paginatedLogs.map((log) => (
            <Grid item xs={4} key={log.id}>
              <Card
                sx={{
                  boxShadow: 2,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "grey.200",
                  cursor: "pointer",
                  "&:hover": { boxShadow: 4 },
                  height: 300,
                  width: "250px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                onClick={() => handleLogClick(log)}
              >
                <CardContent sx={{ flexGrow: 1, overflow: "hidden" }}>
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
                        bgcolor: getSeverityColor(log.event?.severity),
                        mr: 1.5,
                      }}
                    />
                    <Typography
                      variant="h6"
                      color="#1e40af"
                      fontWeight="bold"
                      noWrap
                    >
                      {log.event?.eventType || log.eventName}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1, overflow: "hidden" }}>
                    <Typography
                      variant="body1"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 0.5,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <User size={16} sx={{ mr: 1, color: "#4b5563" }} />{" "}
                      {log.event?.studentName || log.studentName} ({log.event?.studentId || ""})
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 0.5,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <Calendar size={16} sx={{ mr: 1, color: "#4b5563" }} />{" "}
                      {log.event?.class || ""}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "flex", alignItems: "center", mt: 1 }}
                    >
                      <Clock size={14} sx={{ mr: 1 }} /> {log.dispenseDate}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Typography
                    variant="subtitle1"
                    fontWeight="medium"
                    sx={{ mb: 1 }}
                  >
                    Vật tư cấp phát:
                  </Typography>
                  <Box
                    component="ul"
                    sx={{ pl: 2, mb: 0, flexGrow: 1, overflow: "hidden" }}
                  >
                    {log.supplies.map((supply) => (
                      <li key={supply.id || supply.supplyName}>
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 1,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          <strong>{supply.supplyName}</strong>: {supply.quantity} {supply.type}
                          {supply.notes && ` (${supply.notes})`}
                        </Typography>
                      </li>
                    ))}
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}
                  >
                    <ChevronRight size={20} color="#6b7280" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography color="text.secondary" align="center">
              Chưa có bản ghi nào.
            </Typography>
          </Grid>
        )}
      </Grid>

      {logTotalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={logTotalPages}
            page={logPage}
            onChange={handleLogPageChange}
            color="primary"
          />
        </Box>
      )}

      {/* Dialog for Log Details */}
      <Dialog
        open={!!selectedLog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            color: "white",
            p: 3,
            position: "relative",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                borderRadius: "50%",
                p: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Package sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="600" sx={{ mb: 0.5 }}>
                Chi tiết nhật ký
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  px: 2,
                  py: 0.5,
                  borderRadius: 3,
                  display: "inline-block",
                  fontWeight: 500,
                }}
              >
                {selectedLog?.event?.eventType || selectedLog?.eventName}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 3 }}>
            {/* Event Information Card */}
            <Box
              sx={{
                border: "1px solid #e5e7eb",
                borderRadius: 2,
                p: 3,
                mb: 3,
                bgcolor: "#fafafa",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#1e40af",
                  fontWeight: 600,
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <EventNote sx={{ fontSize: 22 }} />
                Thông tin sự kiện
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 3,
                  mb: 3,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      bgcolor: "#dbeafe",
                      borderRadius: "50%",
                      p: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <User sx={{ color: "#3b82f6", fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight="500"
                    >
                      Học sinh
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {selectedLog?.event?.studentName || selectedLog?.studentName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {selectedLog?.event?.studentId || ""}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      bgcolor: "#dcfce7",
                      borderRadius: "50%",
                      p: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Calendar sx={{ color: "#16a34a", fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight="500"
                    >
                      Lớp học
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {selectedLog?.event?.class || ""}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    gridColumn: { sm: "span 2" },
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: "#fef3c7",
                      borderRadius: "50%",
                      p: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AccessTime sx={{ color: "#d97706", fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight="500"
                    >
                      Thời gian
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {selectedLog?.dispenseDate}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  bgcolor: "#f1f5f9",
                  p: 2.5,
                  borderRadius: 2,
                  border: "1px solid #e2e8f0",
                  borderLeft: "4px solid #3b82f6",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1, fontWeight: 600 }}
                >
                  Mô tả chi tiết:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.6, color: "#374151" }}
                >
                  {selectedLog?.event?.description || ""}
                </Typography>
              </Box>
            </Box>

            {/* Supplies Card */}
            <Box
              sx={{
                border: "1px solid #e5e7eb",
                borderRadius: 2,
                p: 3,
                bgcolor: "#fafafa",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#1e40af",
                  fontWeight: 600,
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Package sx={{ fontSize: 22 }} />
                Vật tư đã cấp phát ({selectedLog?.supplies.length} loại)
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {selectedLog?.supplies.map((supply, index) => (
                  <Box
                    key={supply.id || index}
                    sx={{
                      bgcolor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: 2,
                      p: 2.5,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                      <Box
                        sx={{
                          bgcolor: "#ecfdf5",
                          borderRadius: "50%",
                          p: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minWidth: 40,
                          height: 40,
                        }}
                      >
                        <Package sx={{ color: "#059669", fontSize: 20 }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          fontWeight="600"
                          sx={{ color: "#1f2937", mb: 1 }}
                        >
                          {supply.supplyName}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              bgcolor: "#dbeafe",
                              color: "#1e40af",
                              px: 2,
                              py: 0.5,
                              borderRadius: 3,
                              fontSize: "0.875rem",
                              fontWeight: 500,
                            }}
                          >
                            {supply.quantity} {supply.type}
                          </Box>
                          {supply.notes && (
                            <Box
                              sx={{
                                bgcolor: "#fef3c7",
                                color: "#92400e",
                                px: 2,
                                py: 0.5,
                                borderRadius: 3,
                                fontSize: "0.875rem",
                                fontWeight: 500,
                              }}
                            >
                              {supply.notes}
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            bgcolor: "#f9fafb",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <Button
            onClick={handleCloseDialog}
            variant="contained"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontWeight: 500,
              bgcolor: "#374151",
              "&:hover": { bgcolor: "#1f2937" },
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SupplyLogs;
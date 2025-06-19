import React, { useState } from "react";
import {
  AlertTriangle,
  History,
  Edit2,
  Package,
  Pill,
  Heart,
  Clock,
} from "lucide-react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Container,
  Pagination,
} from "@mui/material";
import { Build, Description, Warning } from "@mui/icons-material";
import { eventRecords } from "~/mock/mock";

function ViewMedicalRecords() {
  const [historicalRecords, setHistoricalRecords] = useState(
    eventRecords || []
  );
  const [searchEventType, setSearchEventType] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [editRecord, setEditRecord] = useState(null);
  const [page, setPage] = useState();
  // Get unique classes
  const classes = [
    ...new Set(historicalRecords.map((record) => record.student.class)),
  ];

  // Filtered records
  const filteredRecords = historicalRecords.filter(
    (record) =>
      record.event.eventType
        .toLowerCase()
        .includes(searchEventType.toLowerCase()) &&
      (selectedClass === "" || record.student.class === selectedClass)
  );

  // Handle save edit
  const handleSaveEdit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const updatedRecords = historicalRecords.map((record) =>
      record.id === editRecord.id
        ? {
            ...record,
            event: {
              ...record.event,
              eventType: formData.get("eventType"),
              date: formData.get("date"),
              time: formData.get("time"),
              description: formData.get("description"),
              actionsTaken: formData.get("actionsTaken"),
            },
            timestamp: new Date().toLocaleString("vi-VN"),
          }
        : record
    );
    setHistoricalRecords(updatedRecords);
    setEditRecord(null);
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
        Xem Hồ sơ Y tế
      </Typography>
      <Alert
        severity="info"
        icon={<Warning />}
        sx={{ mb: 3, fontWeight: "medium" }}
      >
        Xem và quản lý tất cả các hồ sơ y tế đã được ghi nhận của học sinh trong
        hệ thống.
      </Alert>

      {/* Thanh tìm kiếm */}
      <Box display="flex" gap={2} mb={6} flexWrap="wrap">
        <TextField
          type="text"
          label="Tìm kiếm theo loại sự kiện"
          value={searchEventType}
          onChange={(e) => setSearchEventType(e.target.value)}
          sx={{ width: { xs: "100%", sm: 300 } }}
          variant="outlined"
        />
        <FormControl sx={{ width: { xs: "100%", sm: 200 } }}>
          <InputLabel>Lớp</InputLabel>
          <Select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            label="Lớp"
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

      {/* Records Display */}
      <Box sx={{ spaceY: 3 }}>
        {filteredRecords.length > 0 ? (
          <Box>
            {filteredRecords.map((record) => (
              <Box
                key={record.id}
                sx={{
                  bgcolor: "white",
                  borderRadius: 2,
                  boxShadow: 2,
                  "&:hover": { boxShadow: 4 },
                  transition: "all 0.3s",
                  borderLeft: 4,
                  borderColor: "#3b82f6",
                  mb: 4, // Spacing between cards
                }}
              >
                <Box sx={{ p: 4 }}>
                  {/* Header */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      mb: 3, // Increased spacing below header
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: "#3b82f6",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        {record.student.name.charAt(0)}
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color="gray.800"
                        >
                          {record.student.name}
                        </Typography>
                        <Typography color="gray.600">
                          Lớp: {record.student.class}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      onClick={() => setEditRecord(record)}
                      sx={{
                        display: "flex",
                        gap: 1,
                        color: "#3b82f6",
                        "&:hover": { bgcolor: "#dbeafe" },
                        borderRadius: 1,
                        px: 2,
                        py: 1,
                      }}
                      aria-label="Chỉnh sửa hồ sơ"
                    >
                      <Edit2 size={18} />
                      <Typography>Chỉnh sửa</Typography>
                    </Button>
                  </Box>

                  {/* Event Info */}
                  <Box
                    sx={{
                      display: { md: "grid" },
                      gridTemplateColumns: { md: "1fr 1fr" },
                      gap: 4, // Increased from 3
                      mb: 4, // Increased from 3
                      maxWidth: 1200,
                      mx: "auto",
                      p: { xs: 2, md: 3 }, // Added responsive padding
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3, // Using consistent gap instead of spaceY
                      }}
                    >
                      {/* Event Type Header - Enhanced with better styling */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 3, // Increased gap
                          p: 3, // Added padding
                          bgcolor:
                            "linear-gradient(135deg, #fef2f2 0%, #fde68a 100%)",
                          borderRadius: 3, // Increased border radius
                          border: "2px solid #fecaca",
                          position: "relative",
                          overflow: "hidden",
                          transition: "all 0.3s ease-in-out",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                          },
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background:
                              "linear-gradient(45deg, rgba(220, 38, 38, 0.05), rgba(245, 158, 11, 0.05))",
                            zIndex: -1,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 56, // Increased from 32
                            height: 56,
                            bgcolor: "rgba(220, 38, 38, 0.1)",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 12px rgba(220, 38, 38, 0.2)",
                          }}
                        >
                          <AlertTriangle
                            sx={{
                              color: "#dc2626",
                              fontSize: 28, // Increased from 18
                            }}
                          />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            color="text.secondary"
                            variant="body2"
                            sx={{ mb: 1, fontWeight: 500 }}
                          >
                            Loại sự kiện
                          </Typography>
                          <Box
                            sx={{
                              display: "inline-block",
                              bgcolor: "#dc2626",
                              color: "white",
                              px: 3,
                              py: 1,
                              borderRadius: 6,
                              fontWeight: 600,
                              fontSize: "0.875rem",
                              boxShadow: "0 4px 12px rgba(220, 38, 38, 0.3)",
                            }}
                          >
                            {record.event.eventType}
                          </Box>
                        </Box>
                      </Box>

                      {/* Time Section - Enhanced card design */}
                      <Box
                        sx={{
                          bgcolor: "white",
                          p: 3,
                          borderRadius: 3,
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          border: "1px solid rgba(0, 0, 0, 0.05)",
                          transition: "all 0.3s ease-in-out",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 12px 20px -5px rgba(0, 0, 0, 0.15)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              bgcolor: "rgba(59, 130, 246, 0.1)",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Clock sx={{ color: "#3b82f6", fontSize: 24 }} />
                          </Box>
                          <Typography
                            variant="h6"
                            fontWeight={600}
                            color="text.primary"
                          >
                            Thời gian
                          </Typography>
                        </Box>
                        <Typography
                          variant="h5"
                          fontWeight={500}
                          color="#3b82f6"
                          sx={{ mt: 1 }}
                        >
                          {record.event.date} lúc {record.event.time}
                        </Typography>
                      </Box>

                      {/* Description Section - Enhanced */}
                      <Box
                        sx={{
                          bgcolor: "white",
                          p: 3,
                          borderRadius: 3,
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          border: "1px solid rgba(0, 0, 0, 0.05)",
                          transition: "all 0.3s ease-in-out",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 12px 20px -5px rgba(0, 0, 0, 0.15)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              bgcolor: "rgba(14, 165, 233, 0.1)",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Description
                              sx={{ color: "#0ea5e9", fontSize: 24 }}
                            />
                          </Box>
                          <Typography
                            variant="h6"
                            fontWeight={600}
                            color="text.primary"
                          >
                            Mô tả chi tiết
                          </Typography>
                        </Box>
                        <Typography
                          color="text.primary"
                          sx={{ lineHeight: 1.7, fontSize: "1rem" }}
                        >
                          {record.event.description}
                        </Typography>
                      </Box>

                      {/* Actions Section - Enhanced */}
                      <Box
                        sx={{
                          bgcolor: "white",
                          p: 3,
                          borderRadius: 3,
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          border: "1px solid rgba(0, 0, 0, 0.05)",
                          transition: "all 0.3s ease-in-out",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 12px 20px -5px rgba(0, 0, 0, 0.15)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              bgcolor: "rgba(245, 158, 11, 0.1)",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Build sx={{ color: "#f59e0b", fontSize: 24 }} />
                          </Box>
                          <Typography
                            variant="h6"
                            fontWeight={600}
                            color="text.primary"
                          >
                            Hành động xử lý
                          </Typography>
                        </Box>
                        <Typography
                          color="text.primary"
                          sx={{ lineHeight: 1.7, fontSize: "1rem" }}
                        >
                          {record.event.actionsTaken}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Medicines Used - Enhanced right column */}
                    <Box
                      sx={{
                        bgcolor:
                          "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
                        p: 3,
                        borderRadius: 3,
                        border: "2px solid rgba(34, 197, 94, 0.2)",
                        boxShadow: "0 8px 16px -4px rgba(34, 197, 94, 0.1)",
                        height: "fit-content",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 3, // Increased gap
                          mb: 3,
                        }}
                      >
                        <Box
                          sx={{
                            width: 56, // Increased size
                            height: 56,
                            bgcolor: "#22c55e",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
                          }}
                        >
                          <Package sx={{ color: "white", fontSize: 28 }} />
                        </Box>
                        <Box>
                          <Typography
                            variant="h6"
                            fontWeight={600}
                            color="#166534"
                            sx={{ mb: 0.5 }}
                          >
                            Thuốc & Vật tư đã sử dụng
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Đã sử dụng trong xử lý
                          </Typography>
                        </Box>
                      </Box>

                      {/* Divider */}
                      <Box
                        sx={{
                          height: 1,
                          bgcolor: "rgba(34, 197, 94, 0.2)",
                          mb: 3,
                        }}
                      />

                      {record.event.medicinesUsed &&
                      record.event.medicinesUsed.length > 0 ? (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2.5, // Increased spacing
                          }}
                        >
                          {record.event.medicinesUsed.map((medicine, index) => (
                            <Box
                              key={index}
                              sx={{
                                bgcolor: "white",
                                p: 2.5, // Increased padding
                                borderRadius: 2.5, // Increased border radius
                                border: "1px solid rgba(34, 197, 94, 0.2)",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                                transition: "all 0.3s ease-in-out",
                                cursor: "pointer",
                                "&:hover": {
                                  transform: "translateY(-3px)",
                                  boxShadow:
                                    "0 12px 20px rgba(34, 197, 94, 0.15)",
                                  borderColor: "rgba(34, 197, 94, 0.4)",
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: 2.5, // Increased gap
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 44, // Slightly larger
                                    height: 44,
                                    bgcolor: "rgba(34, 197, 94, 0.1)",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                  }}
                                >
                                  {medicine.name
                                    .toLowerCase()
                                    .includes("băng") ||
                                  medicine.name
                                    .toLowerCase()
                                    .includes("bông") ||
                                  medicine.name
                                    .toLowerCase()
                                    .includes("gạc") ? (
                                    <Heart
                                      sx={{ color: "#22c55e", fontSize: 20 }}
                                    />
                                  ) : (
                                    <Pill
                                      sx={{ color: "#22c55e", fontSize: 20 }}
                                    />
                                  )}
                                </Box>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                    color="text.primary"
                                    sx={{ mb: 1 }}
                                  >
                                    {medicine.name}
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      gap: 1,
                                      flexWrap: "wrap",
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        bgcolor: "rgba(34, 197, 94, 0.1)",
                                        color: "#22c55e",
                                        px: 2,
                                        py: 0.5,
                                        borderRadius: 4,
                                        fontSize: "0.75rem",
                                        fontWeight: 500,
                                        border:
                                          "1px solid rgba(34, 197, 94, 0.3)",
                                      }}
                                    >
                                      SL: {medicine.quantity}
                                    </Box>
                                    <Box
                                      sx={{
                                        bgcolor: "rgba(107, 114, 128, 0.1)",
                                        color: "#6b7280",
                                        px: 2,
                                        py: 0.5,
                                        borderRadius: 4,
                                        fontSize: "0.75rem",
                                        fontWeight: 500,
                                        border:
                                          "1px solid rgba(107, 114, 128, 0.3)",
                                      }}
                                    >
                                      {medicine.time}
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <Box sx={{ textAlign: "center", py: 4 }}>
                          <Package
                            sx={{
                              fontSize: 48,
                              color: "rgba(107, 114, 128, 0.4)",
                              mb: 2,
                            }}
                          />
                          <Typography color="text.secondary" variant="body1">
                            Không sử dụng thuốc hoặc vật tư y tế
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {/* Timestamp */}
                  <Box
                    sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: "gray.200" }}
                  >
                    <Typography variant="body2" color="gray.500" >
                      Ghi nhận lúc: {record.timestamp}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
            {/* Pagination */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={Math.ceil(filteredRecords.length / 5)} // 5 items per page
                page={page}
                onChange={(event, value) => setPage(value)}
                color="primary"
                siblingCount={1}
                boundaryCount={1}
              />
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: 2,
              boxShadow: 2,
              p: 6,
              textAlign: "center",
            }}
          >
            <History
              sx={{ mx: "auto", mb: 2, color: "gray.400", fontSize: 64 }}
            />
            <Typography
              variant="h6"
              fontWeight="semibold"
              color="gray.600"
              mb={1}
            >
              Không tìm thấy hồ sơ
            </Typography>
            <Typography color="gray.500">
              Chưa có hồ sơ y tế nào phù hợp với tiêu chí tìm kiếm.
            </Typography>
          </Box>
        )}
      </Box>

      {/* Edit Dialog */}
      <Dialog
        open={!!editRecord}
        onClose={() => setEditRecord(null)}
        sx={{
          "& .MuiDialog-paper": {
            maxHeight: "90vh",
            overflowY: "auto",
            gap: "20px",
          },
        }}
      >
        <DialogTitle sx={{ p: 3, borderBottom: 1, borderColor: "gray.200" }}>
          <Typography variant="h6" fontWeight="bold" color="gray.800">
            Chỉnh sửa Hồ sơ Y tế
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3, spaceY: 2 }}>
          {editRecord && (
            <Box
              component="form"
              onSubmit={handleSaveEdit}
              sx={{ spaceY: 2, marginTop: "10px" }}
            >
              <TextField
                name="eventType"
                label="Loại sự kiện"
                defaultValue={editRecord.event.eventType}
                fullWidth
                required
                variant="outlined"
              />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { sm: "1fr 1fr" },
                  gap: 2,
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              >
                <TextField
                  name="date"
                  label="Ngày"
                  type="date"
                  defaultValue={editRecord.event.date}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  name="time"
                  label="Giờ"
                  type="time"
                  defaultValue={editRecord.event.time}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <TextField
                name="description"
                label="Mô tả chi tiết"
                defaultValue={editRecord.event.description}
                fullWidth
                required
                multiline
                rows={3}
                variant="outlined"
                sx={{ marginBottom: "10px" }}
              />
              <TextField
                name="actionsTaken"
                label="Hành động xử lý"
                defaultValue={editRecord.event.actionsTaken}
                fullWidth
                required
                multiline
                rows={3}
                variant="outlined"
              />
              <DialogActions
                sx={{
                  p: 2,
                  borderTop: 1,
                  borderColor: "gray.200",
                  justifyContent: "flex-end",
                  gap: 2,
                }}
              >
                <Button onClick={() => setEditRecord(null)} color="inherit">
                  Hủy
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Lưu thay đổi
                </Button>
              </DialogActions>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default ViewMedicalRecords;

import React, { useState } from "react";
import {
  AlertTriangle,
  History,
  Edit2,
  Package,
  Pill,
  Heart,
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
import { Warning } from "@mui/icons-material";

const eventRecords = [
  {
    id: "REC001",
    student: { name: "Nguyễn Văn An", class: "10A1", id: "S001" },
    event: {
      eventType: "Sốt",
      date: "2024-05-10",
      time: "14:00",
      description: "Sốt nhẹ 38.2°C, mệt mỏi, đau đầu",
      actionsTaken: "Cho nghỉ ngơi, theo dõi nhiệt độ, báo phụ huynh",
      medicinesUsed: [
        { name: "Paracetamol 500mg", quantity: "1 viên", time: "14:00" },
        { name: "Nước muối sinh lý", quantity: "1 chai nhỏ", time: "14:05" },
      ],
    },
    timestamp: "10/05/2024, 14:15:30",
  },
  {
    id: "REC002",
    student: { name: "Trần Thị Bình", class: "10A2", id: "S002" },
    event: {
      eventType: "Té ngã",
      date: "2024-05-15",
      time: "09:30",
      description: "Té ngã sân trường, trầy xước tay phải, vết thương 3cm",
      actionsTaken: "Sát trùng vết thương, băng bó, theo dõi",
      medicinesUsed: [
        { name: "Betadine", quantity: "5ml", time: "09:35" },
        { name: "Băng y tế", quantity: "1 cuộn", time: "09:40" },
        { name: "Bông y tế", quantity: "5 miếng", time: "09:35" },
      ],
    },
    timestamp: "15/05/2024, 09:45:00",
  },
  {
    id: "REC003",
    student: { name: "Lê Văn Cường", class: "11B1", id: "S003" },
    event: {
      eventType: "Dị ứng",
      date: "2024-05-20",
      time: "11:00",
      description: "Nổi mẩn đỏ sau khi ăn hải sản, ngứa nhiều vùng tay và mặt",
      actionsTaken:
        "Cho uống thuốc chống dị ứng, rửa mặt nước lạnh, gọi phụ huynh",
      medicinesUsed: [
        { name: "Loratadine 10mg", quantity: "1 viên", time: "11:05" },
        { name: "Kem bôi chống ngứa", quantity: "Bôi mỏng", time: "11:10" },
      ],
    },
    timestamp: "20/05/2024, 11:30:10",
  },
  {
    id: "REC004",
    student: { name: "Phạm Thị Duyên", class: "12A3", id: "S004" },
    event: {
      eventType: "Đau bụng",
      date: "2024-05-22",
      time: "13:15",
      description: "Đau bụng nhẹ sau khi ăn trưa, không sốt",
      actionsTaken: "Cho nằm nghỉ, quan sát triệu chứng",
      medicinesUsed: [], // Không sử dụng thuốc
    },
    timestamp: "22/05/2024, 13:30:45",
  },
];

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
                      gap: 3, // Increased gap between grid columns
                      mb: 3, // Spacing below event info
                    }}
                  >
                    <Box sx={{ spaceY: 3 }}>
                      {" "}
                      {/* Increased vertical spacing within left column */}
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: "#fee2e2",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <AlertTriangle
                            sx={{ color: "#dc2626", fontSize: 18 }}
                          />
                        </Box>
                        <Box>
                          <Typography color="gray.600" variant="body2">
                            Loại sự kiện
                          </Typography>
                          <Typography
                            variant="body1"
                            fontWeight="semibold"
                            color="#dc2626"
                          >
                            {record.event.eventType}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ bgcolor: "#f9fafb", p: 2, borderRadius: 1 }}>
                        <Typography color="gray.600" variant="body2" mb={1}>
                          Thời gian
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight="medium"
                          color="gray.800"
                        >
                          {record.event.date} lúc {record.event.time}
                        </Typography>
                      </Box>
                      <Box sx={{ bgcolor: "#f9fafb", p: 2, borderRadius: 1 }}>
                        <Typography color="gray.600" variant="body2" mb={1}>
                          Mô tả chi tiết
                        </Typography>
                        <Typography color="gray.800">
                          {record.event.description}
                        </Typography>
                      </Box>
                      <Box sx={{ bgcolor: "#f9fafb", p: 2, borderRadius: 1 }}>
                        <Typography color="gray.600" variant="body2" mb={1}>
                          Hành động xử lý
                        </Typography>
                        <Typography color="gray.800">
                          {record.event.actionsTaken}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Medicines Used */}
                    <Box sx={{ bgcolor: "#ecfdf5", p: 2, borderRadius: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 2,
                        }}
                      >
                        <Package sx={{ color: "#16a34a", fontSize: 20 }} />
                        <Typography
                          variant="h6"
                          fontWeight="semibold"
                          color="#16a34a"
                        >
                          Thuốc & Vật tư đã sử dụng
                        </Typography>
                      </Box>

                      {record.event.medicinesUsed &&
                      record.event.medicinesUsed.length > 0 ? (
                        <Box sx={{ spaceY: 2 }}>
                          {" "}
                          {/* Increased spacing between medicine items */}
                          {record.event.medicinesUsed.map((medicine, index) => (
                            <Box
                              key={index}
                              sx={{
                                bgcolor: "white",
                                p: 2,
                                borderRadius: 1,
                                border: 1,
                                borderColor: "#d1fae5",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "start",
                                  gap: 2,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    bgcolor: "#d1fae5",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  {medicine.name
                                    .toLowerCase()
                                    .includes("băng") ||
                                  medicine.name
                                    .toLowerCase()
                                    .includes("bông") ? (
                                    <Heart
                                      sx={{ color: "#16a34a", fontSize: 16 }}
                                    />
                                  ) : (
                                    <Pill
                                      sx={{ color: "#16a34a", fontSize: 16 }}
                                    />
                                  )}
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                  <Typography
                                    variant="body1"
                                    fontWeight="medium"
                                    color="gray.800"
                                  >
                                    {medicine.name}
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      mt: 1,
                                      color: "gray.600",
                                      fontSize: "0.875rem",
                                    }}
                                  >
                                    <span>Số lượng: {medicine.quantity}</span>
                                    <span>Thời gian: {medicine.time}</span>
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <Box sx={{ textAlign: "center", py: 2 }}>
                          <Package
                            sx={{ mx: "auto", color: "gray.400", fontSize: 32 }}
                          />
                          <Typography color="gray.500">
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
                    <Typography variant="body2" color="gray.500" italic>
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
        sx={{ "& .MuiDialog-paper": { maxHeight: "90vh", overflowY: "auto" } }}
      >
        <DialogTitle sx={{ p: 3, borderBottom: 1, borderColor: "gray.200" }}>
          <Typography variant="h6" fontWeight="bold" color="gray.800">
            Chỉnh sửa Hồ sơ Y tế
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3, spaceY: 2 }}>
          {editRecord && (
            <Box component="form" onSubmit={handleSaveEdit} sx={{ spaceY: 2 }}>
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

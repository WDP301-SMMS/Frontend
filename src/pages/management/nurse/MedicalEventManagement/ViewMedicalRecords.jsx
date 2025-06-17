import React, { useState } from "react";
import { AlertTriangle, History, Edit2 } from "lucide-react";
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel, Box } from "@mui/material";
import { eventRecords } from "~/mock/mock";

function ViewMedicalRecords() {
  // Dữ liệu hồ sơ y tế giả định
  const [historicalRecords, setHistoricalRecords] = useState(eventRecords||[]);

  // State cho tìm kiếm
  const [searchEventType, setSearchEventType] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  // State cho dialog chỉnh sửa
  const [editRecord, setEditRecord] = useState(null);

  // Lấy danh sách lớp duy nhất
  const classes = [...new Set(historicalRecords.map(record => record.student.class))];

  // Hàm xử lý tìm kiếm
  const filteredRecords = historicalRecords.filter(
    (record) =>
      record.event.eventType.toLowerCase().includes(searchEventType.toLowerCase()) &&
      (selectedClass === "" || record.student.class === selectedClass)
  );

  // Hàm xử lý lưu chỉnh sửa
  const handleSaveEdit = (e) => {
    e.preventDefault();
    const updatedRecords = historicalRecords.map((record) =>
      record.id === editRecord.id
        ? {
            ...record,
            event: {
              ...record.event,
              eventType: e.target.eventType.value,
              date: e.target.date.value,
              time: e.target.time.value,
              description: e.target.description.value,
              actionsTaken: e.target.actionsTaken.value,
            },
            timestamp: new Date().toLocaleString("vi-VN"),
          }
        : record
    );
    setHistoricalRecords(updatedRecords);
    setEditRecord(null); // Đóng dialog
  };

  return (
    <div className="p-8 bg-white rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-300">
      <h1 className="text-3xl font-extrabold mb-6 text-purple-800">
        Xem Hồ sơ Y tế
      </h1>
      <div className="bg-blue-100 w-fit text-left p-4 rounded-lg border border-blue-200 shadow-md mb-6">
        <AlertTriangle size={18} className="text-yellow-500 inline-block mr-2" />
        <p className="text-sm text-blue-600 inline-block">
          Xem và quản lý tất cả các hồ sơ y tế đã được ghi nhận của học sinh trong
          hệ thống.
        </p>
      </div>

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
              <MenuItem key={cls} value={cls}>{cls}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {filteredRecords.length > 0 ? (
        <div className="space-y-4">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex justify-between items-start hover:shadow-md transition-shadow duration-200"
            >
              <div>
                <p className="font-semibold text-gray-900 text-lg">
                  Học sinh: {record.student.name} (Lớp: {record.student.class})
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  Loại sự kiện:{" "}
                  <span className="font-medium text-blue-700">
                    {record.event.eventType}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Thời gian: {record.event.date} lúc {record.event.time}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Mô tả: {record.event.description}
                </p>
                <p className="text-sm text-gray-600">
                  Xử lý: {record.event.actionsTaken}
                </p>
                <p className="text-xs text-gray-500 italic mt-2">
                  Ghi nhận lúc: {record.timestamp}
                </p>
              </div>
              <Button
                onClick={() => setEditRecord(record)}
                sx={{ padding: "8px", minWidth: "auto" }}
                aria-label="Chỉnh sửa hồ sơ"
              >
                <Edit2 size={20} />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
          <History size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-lg">Chưa có hồ sơ y tế nào được ghi nhận.</p>
        </div>
      )}

      {/* Dialog chỉnh sửa */}
      <Dialog open={!!editRecord} onClose={() => setEditRecord(null)}>
        <DialogTitle>Chỉnh sửa Hồ sơ Y tế</DialogTitle>
        <DialogContent>
          {editRecord && (
            <form onSubmit={handleSaveEdit}>
              <TextField
                name="eventType"
                label="Loại sự kiện"
                defaultValue={editRecord.event.eventType}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                name="date"
                label="Ngày"
                type="date"
                defaultValue={editRecord.event.date}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                name="time"
                label="Giờ"
                type="time"
                defaultValue={editRecord.event.time}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                name="description"
                label="Mô tả"
                defaultValue={editRecord.event.description}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                name="actionsTaken"
                label="Hành động xử lý"
                defaultValue={editRecord.event.actionsTaken}
                fullWidth
                margin="normal"
                required
              />
              <DialogActions>
                <Button onClick={() => setEditRecord(null)} color="inherit">
                  Hủy
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Lưu
                </Button>
              </DialogActions>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ViewMedicalRecords;
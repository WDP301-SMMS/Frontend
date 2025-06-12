import React, { useState } from 'react';
import { Search, User, Clipboard, Save, XCircle, Trash2 } from 'lucide-react';

// Dữ liệu học sinh giả định (trong ứng dụng thực tế sẽ lấy từ API/database)
const mockStudents = [
  { id: 'S001', name: 'Nguyễn Văn An', class: '10A1', dob: '15/03/2008' },
  { id: 'S002', name: 'Trần Thị Bình', class: '10A2', dob: '20/07/2008' },
  { id: 'S003', name: 'Lê Văn Cường', class: '11B1', dob: '01/11/2007' },
  { id: 'S004', name: 'Phạm Thị Duyên', class: '10A1', dob: '10/01/2008' },
  { id: 'S005', name: 'Hoàng Văn Hải', class: '12C3', dob: '25/09/2006' },
  { id: 'S006', name: 'Nguyễn Thị Hương', class: '10A1', dob: '05/04/2008' },
  { id: 'S007', name: 'Đỗ Minh Khang', class: '9A1', dob: '11/02/2009' },
  { id: 'S008', name: 'Vũ Thị Lan Anh', class: '11B2', dob: '07/06/2007' },
  { id: 'S009', name: 'Trịnh Quang Minh', class: '10A3', dob: '03/09/2008' },
  { id: 'S010', name: 'Bùi Thanh Mai', class: '9A2', dob: '19/05/2009' },
];

function RecordIncidents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [eventForm, setEventForm] = useState({
    eventType: '',
    date: '',
    time: '',
    description: '',
    actionsTaken: '',
    notes: ''
  });
  const [medicalRecords, setMedicalRecords] = useState([]); // Lưu trữ các hồ sơ y tế đã ghi nhận trong phiên này

  // Xử lý thay đổi trong ô tìm kiếm học sinh
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length > 0) {
      const filteredStudents = mockStudents.filter(student =>
        student.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        student.class.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setSearchResults(filteredStudents);
    } else {
      setSearchResults([]);
    }
  };

  // Xử lý khi chọn một học sinh từ kết quả tìm kiếm
  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setSearchResults([]);
    setSearchTerm('');
    setEventForm({
      eventType: '',
      date: new Date().toISOString().substring(0, 10), // Ngày hiện tại
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }), // Giờ hiện tại (24h format)
      description: '',
      actionsTaken: '',
      notes: ''
    });
  };

  // Xử lý thay đổi trong các trường của biểu mẫu sự kiện
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEventForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  // Xử lý gửi biểu mẫu sự kiện y tế
  const handleSubmitEvent = (e) => {
    e.preventDefault();
    if (selectedStudent) {
      const newMedicalRecord = {
        id: Date.now().toString(),
        student: selectedStudent,
        event: { ...eventForm },
        timestamp: new Date().toLocaleString('vi-VN')
      };
      setMedicalRecords(prevRecords => [...prevRecords, newMedicalRecord]);
      console.log('Đã lưu Hồ sơ Sự kiện Y tế:', newMedicalRecord);
      alert(`Sự kiện y tế cho học sinh ${selectedStudent.name} đã được ghi nhận thành công!`);
      // Reset trạng thái sau khi lưu
      setSelectedStudent(null);
      setEventForm({
        eventType: '',
        date: '',
        time: '',
        description: '',
        actionsTaken: '',
        notes: ''
      });
    } else {
      alert('Vui lòng chọn học sinh trước khi ghi nhận sự kiện.');
    }
  };

  // Xử lý xóa học sinh đã chọn (để điền form cho học sinh khác)
  const handleClearSelectedStudent = () => {
    setSelectedStudent(null);
    setEventForm({
        eventType: '',
        date: '',
        time: '',
        description: '',
        actionsTaken: '',
        notes: ''
      });
  };

  // Xử lý xóa một hồ sơ y tế khỏi danh sách hiển thị (demo)
  const handleDeleteRecord = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hồ sơ này không?")) {
      setMedicalRecords(prevRecords => prevRecords.filter(record => record.id !== id));
      alert("Hồ sơ đã được xóa.");
    }
  };

  return (
    // Thay đổi từ "min-h-screen h" thành "h-full"
    <div className="h-full p-8 bg-white rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-300">
      <h1 className="text-3xl font-extrabold mb-6 text-blue-800">Ghi nhận Sự kiện Y tế</h1>
      <p className="text-lg text-gray-700 mb-8">
        Tìm kiếm học sinh và ghi lại các sự kiện y tế như tai nạn, sốt, té ngã, hoặc dịch bệnh.
      </p>

      {/* Phần Tìm kiếm Học sinh */}
      <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200 shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-blue-700 flex items-center">
          <Search size={24} className="mr-3 text-blue-600" />
          Tìm kiếm Học sinh
        </h2>
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Nhập tên hoặc lớp của học sinh..."
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm text-gray-800"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Kết quả tìm kiếm */}
        {searchResults.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10 relative mt-2">
            {searchResults.map(student => (
              <button
                key={student.id}
                onClick={() => handleSelectStudent(student)}
                className="w-full text-left p-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150 flex items-center space-x-3"
              >
                <User size={18} className="text-blue-500" />
                <div>
                  <p className="font-semibold text-gray-800">{student.name}</p>
                  <p className="text-sm text-gray-500">Lớp: {student.class} | Mã HS: {student.id}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Thông tin học sinh đã chọn */}
        {selectedStudent && (
          <div className="mt-6 p-4 bg-blue-100 rounded-lg flex items-center justify-between shadow-md animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center space-x-3">
              <User size={24} className="text-blue-700" />
              <div>
                <p className="font-bold text-blue-800 text-lg">{selectedStudent.name}</p>
                <p className="text-sm text-blue-600">Lớp: {selectedStudent.class} | Mã HS: {selectedStudent.id} | Ngày sinh: {selectedStudent.dob}</p>
              </div>
            </div>
            <button
                onClick={handleClearSelectedStudent}
                className="text-gray-500 hover:text-red-600 transition-colors duration-200 p-1 rounded-full hover:bg-red-100"
                aria-label="Xóa học sinh đã chọn"
            >
                <XCircle size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Phần Ghi nhận Sự kiện Y tế (chỉ hiển thị khi đã chọn học sinh) */}
      {selectedStudent && (
        <form onSubmit={handleSubmitEvent} className="mt-8 p-6 bg-green-50 rounded-xl border border-green-200 shadow-md animate-in fade-in duration-300">
          <h2 className="text-2xl font-bold mb-4 text-green-700 flex items-center">
            <Clipboard size={24} className="mr-3 text-green-600" />
            Ghi nhận Sự kiện Y tế cho <span className="text-green-800 ml-1">{selectedStudent.name}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-2">
                Loại sự kiện <span className="text-red-500">*</span>
              </label>
              <select
                id="eventType"
                name="eventType"
                value={eventForm.eventType}
                onChange={handleFormChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              >
                <option value="">-- Chọn loại sự kiện --</option>
                <option value="Tai nạn">Tai nạn</option>
                <option value="Sốt">Sốt</option>
                <option value="Té ngã">Té ngã</option>
                <option value="Dị ứng">Dị ứng</option>
                <option value="Dịch bệnh">Dịch bệnh</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Ngày xảy ra <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={eventForm.date}
                onChange={handleFormChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                Thời gian xảy ra <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={eventForm.time}
                onChange={handleFormChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả chi tiết sự kiện <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={eventForm.description}
              onChange={handleFormChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              placeholder="Mô tả cụ thể sự việc, tình trạng ban đầu của học sinh, triệu chứng..."
            ></textarea>
          </div>

          <div className="mb-6">
            <label htmlFor="actionsTaken" className="block text-sm font-medium text-gray-700 mb-2">
              Hành động đã xử lý <span className="text-red-500">*</span>
            </label>
            <textarea
              id="actionsTaken"
              name="actionsTaken"
              rows="3"
              value={eventForm.actionsTaken}
              onChange={handleFormChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              placeholder="Các bước xử lý đã thực hiện, ví dụ: sơ cứu, gọi phụ huynh, chuyển lên phòng y tế, dùng thuốc gì..."
            ></textarea>
          </div>

          <div className="mb-8">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú thêm (Nếu có)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows="2"
              value={eventForm.notes}
              onChange={handleFormChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              placeholder="Các thông tin bổ sung, quan sát sau khi xử lý, kế hoạch theo dõi..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-[1.02]"
          >
            <Save size={20} />
            <span>Lưu sự kiện</span>
          </button>
        </form>
      )}

      {/* Danh sách các hồ sơ y tế đã ghi nhận (cho mục đích demo) */}
      {medicalRecords.length > 0 && (
        <div className="mt-10 p-6 bg-purple-50 rounded-xl border border-purple-200 shadow-md animate-in fade-in duration-300">
          <h2 className="text-2xl font-bold mb-4 text-purple-700 flex items-center">
            <Clipboard size={24} className="mr-3 text-purple-600" />
            Các Hồ sơ Y tế đã ghi nhận trong phiên này
          </h2>
          <div className="space-y-4">
            {medicalRecords.map((record) => (
              <div key={record.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900">Học sinh: {record.student.name} ({record.student.class})</p>
                  <p className="text-sm text-gray-700">Loại sự kiện: <span className="font-medium text-blue-700">{record.event.eventType}</span></p>
                  <p className="text-sm text-gray-600">Thời gian: {record.event.date} {record.event.time}</p>
                  <p className="text-sm text-gray-600 mt-1">Mô tả: {record.event.description}</p>
                  <p className="text-sm text-gray-600">Xử lý: {record.event.actionsTaken}</p>
                  <p className="text-xs text-gray-500 italic mt-2">Ghi nhận lúc: {record.timestamp}</p>
                </div>
                <button
                  onClick={() => handleDeleteRecord(record.id)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors duration-200"
                  aria-label="Xóa hồ sơ"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default RecordIncidents;

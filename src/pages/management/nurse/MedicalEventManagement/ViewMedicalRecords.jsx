import React from 'react';
import { Eye, History } from 'lucide-react'; // Import icons

// Trong ứng dụng thực tế, bạn sẽ nhận medicalRecords từ props
// Ví dụ: function ViewMedicalRecords({ allMedicalRecords }) { ... }
// Hoặc fetch dữ liệu từ API tại đây

function ViewMedicalRecords() {
  // Dữ liệu hồ sơ y tế giả định cho phần này (thay vì medicalRecords từ RecordIncidents)
  // Trong thực tế, bạn sẽ fetch dữ liệu này từ database
  const historicalRecords = [
    { id: 'REC001', student: { name: 'Nguyễn Văn An', class: '10A1', id: 'S001' }, event: { eventType: 'Sốt', date: '2024-05-10', time: '14:00', description: 'Sốt nhẹ, mệt mỏi', actionsTaken: 'Cho uống thuốc hạ sốt, báo phụ huynh' }, timestamp: '10/05/2024, 14:15:30' },
    { id: 'REC002', student: { name: 'Trần Thị Bình', class: '10A2', id: 'S002' }, event: { eventType: 'Té ngã', date: '2024-05-15', time: '09:30', description: 'Té ngã sân trường, trầy xước tay', actionsTaken: 'Sát trùng, băng bó, theo dõi' }, timestamp: '15/05/2024, 09:45:00' },
    { id: 'REC003', student: { name: 'Lê Văn Cường', class: '11B1', id: 'S003' }, event: { eventType: 'Dị ứng', date: '2024-05-20', time: '11:00', description: 'Nổi mẩn đỏ sau khi ăn hải sản', actionsTaken: 'Cho uống thuốc chống dị ứng, gọi phụ huynh' }, timestamp: '20/05/2024, 11:30:10' },
  ];

  return (
    <div className="p-8 bg-white rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-300">
      <h1 className="text-3xl font-extrabold mb-6 text-purple-800">Xem Hồ sơ Y tế</h1>
      <p className="text-lg text-gray-700 mb-8">
        Xem và quản lý tất cả các hồ sơ y tế đã được ghi nhận của học sinh trong hệ thống.
      </p>

      {historicalRecords.length > 0 ? (
        <div className="space-y-4">
          {historicalRecords.map((record) => (
            <div key={record.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex justify-between items-start hover:shadow-md transition-shadow duration-200">
              <div>
                <p className="font-semibold text-gray-900 text-lg">Học sinh: {record.student.name} (Lớp: {record.student.class})</p>
                <p className="text-sm text-gray-700 mt-1">Loại sự kiện: <span className="font-medium text-blue-700">{record.event.eventType}</span></p>
                <p className="text-sm text-gray-600">Thời gian: {record.event.date} lúc {record.event.time}</p>
                <p className="text-sm text-gray-600 mt-2">Mô tả: {record.event.description}</p>
                <p className="text-sm text-gray-600">Xử lý: {record.event.actionsTaken}</p>
                <p className="text-xs text-gray-500 italic mt-2">Ghi nhận lúc: {record.timestamp}</p>
              </div>
              <button
                // Logic để xem chi tiết hoặc chỉnh sửa hồ sơ
                className="p-2 text-gray-500 hover:text-blue-700 hover:bg-blue-100 rounded-full transition-colors duration-200"
                aria-label="Xem chi tiết"
              >
                <Eye size={20} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
          <History size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-lg">Chưa có hồ sơ y tế nào được ghi nhận.</p>
        </div>
      )}
    </div>
  );
}

export default ViewMedicalRecords;

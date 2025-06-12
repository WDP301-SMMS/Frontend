// NurseDashboard.jsx
import React, { useState, useEffect } from 'react'; // Import useEffect
import { Sidebar } from '~/pages/layout/Sidebar';
import RecordIncidents from './MedicalEventManagement/RecordIncidents';
import ViewMedicalRecords from './MedicalEventManagement/ViewMedicalRecords';

// Giả định bạn có một component LoadingSpinner
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

const NurseDashboard = () => {
  // Khai báo các state cần thiết trong component NurseDashboard
  const [sidebarOpen, setSidebarOpen] = useState(true); // Mở sidebar mặc định
  const [activeMenuItem, setActiveMenuItem] = useState('home'); // Đặt 'home' làm mục mặc định được chọn
  const [activeTab, setActiveTab] = useState('dashboard'); // Đặt 'dashboard' làm tab mặc định cho Home

  // Dùng useEffect để cập nhật activeTab khi activeMenuItem thay đổi,
  // đặc biệt cho các menu item không có sub-items
  useEffect(() => {
    // Nếu activeMenuItem là 'home' hoặc 'settings' (không có sub-items),
    // thì activeTab sẽ trùng với activeMenuItem
    if (activeMenuItem === 'home') {
      setActiveTab('dashboard'); // Hoặc bất kỳ tab mặc định nào cho Trang chủ
    } else if (activeMenuItem === 'settings') {
      setActiveTab('settings-main'); // Một tab mặc định cho Cài đặt
    }
    // Các trường hợp khác (menu có sub-items) sẽ được xử lý bởi handleSubItemClick
  }, [activeMenuItem]);


  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-800"> {/* Sử dụng font-sans mặc định của Tailwind hoặc tùy chỉnh */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeMenuItem={activeMenuItem}
        setActiveMenuItem={setActiveMenuItem}
        setActiveTab={setActiveTab}
      />
      <main className="flex-1 p-6 overflow-y-auto custom-scrollbar"> {/* Thêm custom-scrollbar nếu muốn */}
        {/* Đây là nơi bạn sẽ render nội dung chính của các tab */}
        {activeTab === 'dashboard' && (
          <div className="bg-white p-8 rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-300">
            <h1 className="text-3xl font-extrabold mb-6 text-blue-800">Chào mừng, Y tá!</h1>
            <p className="text-lg text-gray-700 mb-8">Thông tin tổng quan về hoạt động y tế tại trường.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200">
                <h3 className="font-semibold text-xl mb-2">Tổng số lớp</h3>
                <p className="text-4xl font-bold">15</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200">
                <h3 className="font-semibold text-xl mb-2">Tổng số học sinh</h3>
                <p className="text-4xl font-bold">420</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200">
                <h3 className="font-semibold text-xl mb-2">Sự kiện chờ xử lý</h3>
                <p className="text-4xl font-bold">5</p>
              </div>
            </div>
            {/* Các biểu đồ hoặc thông tin tóm tắt khác có thể thêm ở đây */}
          </div>
        )}

        {/* --- Phần Sự kiện Y tế --- */}
        {activeTab === 'record-incidents' && (
          <div>
           
            <RecordIncidents/>
          </div>
        )}
        {activeTab === 'view-medical-records' && (
        //   <div className="bg-white p-8 rounded-2xl shadow-xl animate-in fade-in duration-300">
        <div>
            {/* <h1 className="text-3xl font-extrabold mb-4 text-blue-800">Lịch sử sự kiện y tế</h1> */}
            <ViewMedicalRecords/>
          </div>
        )}
        {activeTab === 'emergency-response' && (
          <div className="bg-white p-8 rounded-2xl shadow-xl animate-in fade-in duration-300">
            <h1 className="text-3xl font-extrabold mb-4 text-blue-800">Quy trình xử lý khẩn cấp</h1>
            <p className="text-gray-700">Hướng dẫn và công cụ hỗ trợ xử lý các tình huống y tế khẩn cấp.</p>
            {/* Hướng dẫn xử lý khẩn cấp */}
          </div>
        )}

        {/* --- Phần Thuốc & Vật tư --- */}
        {activeTab === 'medicine-inventory' && (
          <div className="bg-white p-8 rounded-2xl shadow-xl animate-in fade-in duration-300">
            <h1 className="text-3xl font-extrabold mb-4 text-blue-800">Quản lý kho thuốc</h1>
            <p className="text-gray-700">Kiểm tra số lượng, loại thuốc và thông tin nhà cung cấp.</p>
            {/* Danh sách thuốc */}
          </div>
        )}
        {activeTab === 'supplies-inventory' && (
          <div className="bg-white p-8 rounded-2xl shadow-xl animate-in fade-in duration-300">
            <h1 className="text-3xl font-extrabold mb-4 text-blue-800">Quản lý kho vật tư</h1>
            <p className="text-gray-700">Danh sách các vật tư y tế, số lượng tồn kho.</p>
            {/* Danh sách vật tư */}
          </div>
        )}
        {activeTab === 'expiry-tracking' && (
          <div className="bg-white p-8 rounded-2xl shadow-xl animate-in fade-in duration-300">
            <h1 className="text-3xl font-extrabold mb-4 text-blue-800">Theo dõi hạn sử dụng</h1>
            <p className="text-gray-700">Cảnh báo và quản lý thuốc/vật tư sắp hết hạn.</p>
            {/* Bảng theo dõi hạn sử dụng */}
          </div>
        )}
        {activeTab === 'usage-reports' && (
          <div className="bg-white p-8 rounded-2xl shadow-xl animate-in fade-in duration-300">
            <h1 className="text-3xl font-extrabold mb-4 text-blue-800">Báo cáo sử dụng thuốc & vật tư</h1>
            <p className="text-gray-700">Xem báo cáo thống kê mức độ sử dụng theo thời gian.</p>
            {/* Biểu đồ báo cáo */}
          </div>
        )}

        {/* --- Phần Quản lý Tiêm chủng --- */}
        {activeTab === 'send-vaccination-notice' && (
          <div className="bg-white p-8 rounded-2xl shadow-xl animate-in fade-in duration-300">
            <h1 className="text-3xl font-extrabold mb-4 text-blue-800">Gửi phiếu thông báo tiêm chủng</h1>
            <p className="text-gray-700">Tạo và gửi phiếu thông báo đồng ý tiêm chủng cho phụ huynh.</p>
          </div>
        )}
        {activeTab === 'prepare-vaccination-list' && (
          <div className="bg-white p-8 rounded-2xl shadow-xl animate-in fade-in duration-300">
            <h1 className="text-3xl font-extrabold mb-4 text-blue-800">Chuẩn bị danh sách tiêm chủng</h1>
            <p className="text-gray-700">Xem và quản lý danh sách học sinh cần tiêm chủng.</p>
          </div>
        )}
        {activeTab === 'vaccination-record' && (
          <div className="bg-white p-8 rounded-2xl shadow-xl animate-in fade-in duration-300">
            <h1 className="text-3xl font-extrabold mb-4 text-blue-800">Tiêm chủng & Ghi nhận kết quả</h1>
            <p className="text-gray-700">Ghi nhận thông tin tiêm chủng và kết quả của từng học sinh.</p>
          </div>
        )}
        {activeTab === 'post-vaccination-monitor' && (
          <div className="bg-white p-8 rounded-2xl shadow-xl animate-in fade-in duration-300">
            <h1 className="text-3xl font-extrabold mb-4 text-blue-800">Theo dõi sau tiêm</h1>
            <p className="text-gray-700">Theo dõi các phản ứng phụ và tình trạng sức khỏe sau tiêm.</p>
          </div>
        )}

        {/* --- Phần Kiểm tra Y tế --- */}
        {activeTab === 'send-checkup-notice' && (
          <div className="bg-white p-8 rounded-2xl shadow-xl animate-in fade-in duration-300">
            <h1 className="text-3xl font-extrabold mb-4 text-blue-800">Gửi phiếu thông báo kiểm tra y tế</h1>
            <p className="text-gray-700">Tạo và gửi phiếu thông báo kiểm tra y tế định kỳ cho phụ huynh.</p>
          </div>
        )}
        {activeTab === 'prepare-checkup-list' && (
          <div className="bg-white p-8 rounded-2xl shadow-xl animate-in fade-in duration-300">
            <h1 className="text-3xl font-extrabold mb-4 text-blue-800">Chuẩn bị danh sách kiểm tra y tế</h1>
            <p className="text-gray-700">Tạo và quản lý danh sách học sinh tham gia kiểm tra.</p>
          </div>
        )}
        {activeTab === 'perform-checkup' && (
          <div className="bg-white p-8 rounded-2xl shadow-xl animate-in fade-in duration-300">
            <h1 className="text-3xl font-extrabold mb-4 text-blue-800">Thực hiện kiểm tra & Ghi nhận kết quả</h1>
            <p className="text-gray-700">Tiến hành kiểm tra và ghi nhận các chỉ số, kết quả sức khỏe.</p>
          </div>
        )}
        {activeTab === 'send-results' && (
          <div className="bg-white p-8 rounded-2xl shadow-xl animate-in fade-in duration-300">
            <h1 className="text-3xl font-extrabold mb-4 text-blue-800">Gửi kết quả kiểm tra</h1>
            <p className="text-gray-700">Gửi báo cáo kết quả kiểm tra sức khỏe cho phụ huynh.</p>
          </div>
        )}
        {activeTab === 'schedule-consultation' && (
          <div className="bg-white p-8 rounded-2xl shadow-xl animate-in fade-in duration-300">
            <h1 className="text-3xl font-extrabold mb-4 text-blue-800">Lịch hẹn tư vấn riêng</h1>
            <p className="text-gray-700">Đặt lịch hẹn tư vấn với phụ huynh nếu có dấu hiệu bất thường.</p>
          </div>
        )}

        {/* --- Phần Báo cáo & Thống kê --- */}
        {activeTab === 'health-statistics' && (
          <div className="bg-white p-8 rounded-2xl shadow-xl animate-in fade-in duration-300">
            <h1 className="text-3xl font-extrabold mb-4 text-blue-800">Thống kê sức khỏe chung</h1>
            <p className="text-gray-700">Biểu đồ và số liệu thống kê tổng quan về sức khỏe học sinh.</p>
          </div>
        )}
        {activeTab === 'vaccination-reports' && (
          <div className="bg-white p-8 rounded-2xl shadow-xl animate-in fade-in duration-300">
            <h1 className="text-3xl font-extrabold mb-4 text-blue-800">Báo cáo tiêm chủng</h1>
            <p className="text-gray-700">Báo cáo chi tiết về tỷ lệ tiêm chủng và các chiến dịch.</p>
          </div>
        )}
        {activeTab === 'incident-reports' && (
          <div className="bg-white p-8 rounded-2xl shadow-xl animate-in fade-in duration-300">
            <h1 className="text-3xl font-extrabold mb-4 text-blue-800">Báo cáo sự kiện y tế</h1>
            <p className="text-gray-700">Thống kê và phân tích các sự kiện y tế xảy ra tại trường.</p>
          </div>
        )}

        {/* --- Phần Cài đặt --- */}
        {activeTab === 'settings-main' && ( // Dùng 'settings-main' vì 'settings' là ID của menu item
          <div className="bg-white p-8 rounded-2xl shadow-xl animate-in fade-in duration-300">
            <h1 className="text-3xl font-extrabold mb-4 text-blue-800">Cài đặt hệ thống</h1>
            <p className="text-gray-700">Quản lý tài khoản, thông báo và các cấu hình khác.</p>
          </div>
        )}

      </main>
    </div>
  );
};

export default NurseDashboard;
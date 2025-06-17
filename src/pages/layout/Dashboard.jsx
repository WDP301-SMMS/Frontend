import React from 'react';
import { Sidebar } from '~/pages/layout/Sidebar';
import { Outlet, useLocation } from 'react-router-dom';

const NurseDashboard = () => {
  const location = useLocation();

  // Hiển thị nội dung mặc định khi ở route /management
  const showDefaultContent = location.pathname === '/management';

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-800">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        {showDefaultContent ? (
          <div className="relative flex items-center justify-center h-full bg-white rounded-2xl shadow-xl animate-in fade-in duration-300">
            <div className="text-center p-12 z-10">
               <img
                src="/src/assets/images/logo.png" // Thay bằng đường dẫn thực tế của hình ảnh bạn cung cấp
                alt="Nurse and Doctor Icon"
                className="mx-auto mb-6 w-32 h-32 opacity-80"
              />
              
              <h1 className="text-4xl font-extrabold text-blue-800 mb-4">Chào mừng đến với EduCare - Quản lý sức khỏe toàn diện</h1>
              <p className="text-lg text-gray-700 mb-8">Hệ thống hỗ trợ quản lý y tế toàn diện cho trường học của bạn.</p>
            </div>
            {/* Hình nền trang trí với các biểu tượng y tế */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <pattern id="pattern-medical" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="5" fill="#b3e5fc" />
                  <path d="M10 30 L30 10" stroke="#b3e5fc" strokeWidth="2" />
                  <rect x="40" y="40" width="10" height="10" fill="#b3e5fc" />
                  <path d="M50 20 L70 40" stroke="#b3e5fc" strokeWidth="2" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#pattern-medical)" />
              </svg>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default NurseDashboard;
// src/components/AlertDialog.jsx
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react'; // Sử dụng XCircle cho nút đóng (tùy chọn)

const DialogNurse = ({
  isOpen,         // Boolean: kiểm soát việc hiển thị dialog
  onClose,        // Function: hàm gọi khi dialog cần đóng (ví dụ: click nút đóng, overlay)
  title,          // String: Tiêu đề của dialog
  message,        // String/JSX: Nội dung thông báo
  icon,           // JSX: Biểu tượng tùy chỉnh (ví dụ: <CheckCircle />)
  primaryButtonText, // String: Text cho nút chính
  onPrimaryButtonClick, // Function: Hàm gọi khi click nút chính
  secondaryButtonText, // String: Text cho nút phụ
  onSecondaryButtonClick, // Function: Hàm gọi khi click nút phụ
  showCloseButton = true // Boolean: Có hiển thị nút X ở góc không
}) => {
  if (!isOpen) return null; // Nếu isOpen là false thì không render gì cả

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-10 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm text-center transform scale-95 animate-in zoom-in-95 duration-300 relative">
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
            aria-label="Đóng"
            title="Đóng"
          >
            <XCircle size={20} />
          </button>
        )}

        {icon && <div className="mx-auto mb-6">{icon}</div>}

        <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {onPrimaryButtonClick && primaryButtonText && (
            <button
              onClick={onPrimaryButtonClick}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {primaryButtonText}
            </button>
          )}
          {onSecondaryButtonClick && secondaryButtonText && (
            <button
              onClick={onSecondaryButtonClick}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              {secondaryButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DialogNurse;
import React from "react";
import { useNavigate } from "react-router";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Minh họa 404 động */}
        <div className="relative mb-8">
          <div className="inline-flex items-center justify-center">
            <div className="relative rounded-2xl p-[10px] shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              {/* Minh họa nhân vật bối rối */}
              <div className="inline-flex items-center justify-center">
                {/* Ảnh GIF động */}
                <div className="relative">
                  <img
                    src="/src/assets/images/original-6b5f1f5fa9f4013ef00331bf60e96b9b.gif"
                    alt="Hình ảnh động 404 không tìm thấy"
                    className="w-64 h-48 object-contain drop-shadow-lg rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Văn bản 404 */}
        <div className="mb-6">
          <h1 className="text-8xl font-bold text-gray-800 mb-2 animate-pulse">
            404
          </h1>
          <div className="w-20 h-1 bg-orange-400 mx-auto mb-4 rounded"></div>
        </div>

        {/* Thông báo lỗi */}
        <div className="mb-8 space-y-2">
          <p className="text-gray-600 text-lg font-medium">
            Xin lỗi, trang đó không trở về
          </p>
          <p className="text-gray-500">từ chuyến đi dạo quanh khu vực.</p>
        </div>

        {/* Nút hành động */}
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center px-8 py-3 bg-white text-orange-500 font-semibold rounded-full border-2 border-orange-400 hover:bg-orange-400 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <svg
            className="w-5 h-5 mr-2 transform rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
          ĐƯA TÔI VỀ TRANG CHỦ
        </button>

        {/* Alternative Navigation */}
        {/* Phần tử trang trí */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-orange-100 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-blue-100 rounded-full opacity-50 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-5 w-12 h-12 bg-green-100 rounded-full opacity-50 animate-pulse delay-500"></div>
      </div>
    </div>
  );
};

export default NotFound;

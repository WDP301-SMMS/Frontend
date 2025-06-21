import React from "react";
import { useNavigate } from "react-router";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-sm w-full text-center sm:max-w-md">
        <div className="relative mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center">
            <div className="relative rounded-2xl p-2 sm:p-[10px] shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="inline-flex items-center justify-center">
                <div className="relative">
                  <img
                    src="/src/assets/images/original-6b5f1f5fa9f4013ef00331bf60e96b9b.gif"
                    alt="Hình ảnh động 404 không tìm thấy"
                    className="w-48 h-auto object-contain drop-shadow-lg rounded-2xl sm:w-64 sm:h-48"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 sm:mb-6">
          <h1 className="text-7xl font-bold text-gray-800 mb-1 sm:text-8xl animate-pulse">
            404
          </h1>
          <div className="w-16 h-1 bg-orange-400 mx-auto mb-3 rounded sm:w-20"></div>
        </div>

        <div className="mb-6 space-y-2 sm:mb-8">
          <p className="text-gray-700 text-xl font-semibold sm:text-2xl">
            Ôi không! Trang này có vẻ đã "nghỉ bệnh" rồi!
          </p>
          <p className="text-gray-500 text-sm sm:text-base px-2">
            Đừng lo, chúng tôi sẽ không gửi bạn đến phòng y tế đâu.
          </p>
          <p className="text-gray-500 text-sm sm:text-base font-medium">
            Để chúng tôi đưa bạn về "phòng chờ" an toàn!
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center px-6 py-2 bg-white text-orange-500 font-semibold rounded-full border-2 border-orange-400 hover:bg-orange-400 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:px-8 sm:py-3 sm:text-base"
        >
          <svg
            className="w-4 h-4 mr-2 transform rotate-180 sm:w-5 sm:h-5"
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
          VỀ LẠI TRANG CHÍNH
        </button>

        <div className="absolute top-8 left-8 w-16 h-16 bg-orange-100 rounded-full opacity-50 animate-pulse sm:w-20 sm:h-20 sm:top-10 sm:left-10"></div>
        <div className="absolute bottom-8 right-8 w-12 h-12 bg-blue-100 rounded-full opacity-50 animate-pulse delay-1000 sm:w-16 sm:h-16 sm:bottom-10 sm:right-10"></div>
        <div className="absolute top-1/2 left-4 w-10 h-10 bg-green-100 rounded-full opacity-50 animate-pulse delay-500 sm:w-12 sm:h-12 sm:left-5"></div>
      </div>
    </div>
  );
};

export default NotFound;
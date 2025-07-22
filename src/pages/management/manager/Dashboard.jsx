import React from "react";

const ManagerDashboard = () => {
  const currentHour = new Date().getHours();
  let greeting = "";
  let emoji = "";

  if (currentHour < 12) {
    greeting = "Chào buổi sáng";
    emoji = "🌅";
  } else if (currentHour < 17) {
    greeting = "Chào buổi chiều";
    emoji = "☀️";
  } else {
    greeting = "Chào buổi tối";
    emoji = "🌙";
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-6 py-12 flex items-center justify-center">
        <div className="max-w-4xl w-full relative flex items-center justify-center">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-30 blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-200 to-pink-200 rounded-full opacity-30 blur-3xl"></div>
          </div>

          {/* Main greeting card */}
          <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-12 text-center w-full">
            {/* Avatar with emoji */}
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl mb-8 mx-auto shadow-lg">
              {emoji}
            </div>

            {/* Main greeting */}
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {greeting}! 👋
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 mb-6">
              Chào mừng Quản lý đến với hệ thống quản lý thuốc học sinh
            </p>

            {/* Description */}
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
              Hôm nay là ngày mới tuyệt vời để giám sát và quản lý sức khỏe các
              em học sinh. Hãy bắt đầu công việc quản lý của bạn nhé! 🏥💊
            </p>

            {/* Current time display */}
            <div className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-3 text-gray-700 font-medium">
              📅{" "}
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;

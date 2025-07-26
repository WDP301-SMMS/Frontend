import React from "react";

const DashboardHome = () => {
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 rounded-3xl p-8 text-white text-center relative overflow-hidden shadow-2xl">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full transform -translate-x-8 translate-y-8"></div>
          
          <div className="relative z-10">
            {/* Avatar with emoji */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-full mb-6 text-4xl">
              {emoji}
            </div>
            
            {/* Main greeting */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-shadow">
              {greeting}! 👋
            </h1>
            
            {/* Subtitle */}
            <h2 className="text-xl md:text-2xl font-light mb-6 opacity-90">
              Chào mừng bạn đến với hệ thống quản lý thuốc học sinh
            </h2>
            
            {/* Description */}
            <p className="text-lg opacity-80 max-w-2xl mx-auto leading-relaxed">
              Hôm nay là ngày mới tuyệt vời để chăm sóc sức khỏe các em học sinh. 
              Hãy bắt đầu công việc của bạn nhé! 🏥💊
            </p>
            
            {/* Current time display */}
            <div className="mt-8 inline-block bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-6 py-2">
              <p className="text-sm font-medium text-black">
                📅 {new Date().toLocaleDateString('vi-VN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
        
        {/* Optional quick stats or shortcuts */}
        
      </div>
    </div>
  );
};

export default DashboardHome;
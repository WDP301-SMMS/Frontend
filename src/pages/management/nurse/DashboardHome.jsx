import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Calendar, AlertCircle, Heart, Activity, UserCheck } from 'lucide-react';

const DashboardHome = () => {
  // Sample data for charts
  const monthlyHealthData = [
    { month: 'T1', checkups: 45, incidents: 8 },
    { month: 'T2', checkups: 52, incidents: 5 },
    { month: 'T3', checkups: 48, incidents: 12 },
    { month: 'T4', checkups: 61, incidents: 7 },
    { month: 'T5', checkups: 55, incidents: 9 },
    { month: 'T6', checkups: 68, incidents: 6 }
  ];

  const classHealthData = [
    { class: 'Lớp 1A', students: 28, healthyRate: 95 },
    { class: 'Lớp 2B', students: 30, healthyRate: 88 },
    { class: 'Lớp 3A', students: 32, healthyRate: 92 },
    { class: 'Lớp 4C', students: 29, healthyRate: 90 },
    { class: 'Lớp 5A', students: 31, healthyRate: 94 }
  ];

  const incidentTypes = [
    { name: 'Cảm cúm', value: 35, color: '#FF6B6B' },
    { name: 'Đau bụng', value: 20, color: '#4ECDC4' },
    { name: 'Chấn thương', value: 15, color: '#45B7D1' },
    { name: 'Dị ứng', value: 12, color: '#96CEB4' },
    { name: 'Khác', value: 18, color: '#FECA57' }
  ];

  const StatCard = ({ title, value, icon: Icon, gradient, trend, trendValue }) => (
    <div className={`${gradient} text-white p-6 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl`}>
      <div className="flex items-center justify-between mb-4">
        <Icon size={32} className="opacity-80" />
        {trend && (
          <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-200' : 'text-red-200'}`}>
            <TrendingUp size={16} className={trend === 'down' ? 'rotate-180' : ''} />
            <span className="ml-1">{trendValue}</span>
          </div>
        )}
      </div>
      <h3 className="font-semibold text-lg mb-2 opacity-90">{title}</h3>
      <p className="text-4xl font-bold">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white p-8 rounded-3xl shadow-xl mb-8 animate-in fade-in slide-in-from-top duration-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Chào mừng, Y tá!
              </h1>
              <p className="text-xl text-gray-600">Bảng điều khiển y tế trường học</p>
            </div>
            <div className="hidden md:block">
              <div className="p-4 rounded-2xl">
                <img
                  src="/src/assets/images/logo.png"
                  alt="Logo"
                  className="h-12 w-auto"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Tổng số lớp"
            value="15"
            icon={Users}
            gradient="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700"
            trend="up"
            trendValue="+2"
          />
          <StatCard
            title="Tổng số học sinh"
            value="420"
            icon={UserCheck}
            gradient="bg-gradient-to-br from-green-500 via-green-600 to-green-700"
            trend="up"
            trendValue="+15"
          />
          <StatCard
            title="Khám sức khỏe tháng này"
            value="68"
            icon={Activity}
            gradient="bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700"
            trend="up"
            trendValue="+13"
          />
          <StatCard
            title="Sự kiện cần xử lý"
            value="5"
            icon={AlertCircle}
            gradient="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500"
            trend="down"
            trendValue="-3"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Health Trends */}
          <div className="bg-white p-6 rounded-3xl shadow-xl">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <TrendingUp className="mr-3 text-blue-500" />
              Xu hướng y tế theo tháng
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyHealthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: 'none', 
                    borderRadius: '12px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="checkups" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                  name="Khám sức khỏe"
                />
                <Line 
                  type="monotone" 
                  dataKey="incidents" 
                  stroke="#EF4444" 
                  strokeWidth={3}
                  dot={{ fill: '#EF4444', strokeWidth: 2, r: 6 }}
                  name="Sự cố y tế"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Class Health Rates */}
          <div className="bg-white p-6 rounded-3xl shadow-xl">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <Users className="mr-3 text-green-500" />
              Tỷ lệ sức khỏe theo lớp
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={classHealthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="class" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: 'none', 
                    borderRadius: '12px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                  }} 
                />
                <Bar 
                  dataKey="healthyRate" 
                  fill="url(#healthGradient)"
                  radius={[8, 8, 0, 0]}
                  name="Tỷ lệ khỏe mạnh (%)"
                />
                <defs>
                  <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#34D399" stopOpacity={0.7}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Incident Types Pie Chart */}
          <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-xl">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <AlertCircle className="mr-3 text-orange-500" />
              Loại sự cố y tế
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={incidentTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {incidentTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: 'none', 
                    borderRadius: '12px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {incidentTypes.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions & Notifications */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-3xl shadow-xl">
              <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <Calendar className="mr-3 text-purple-500" />
                Hành động nhanh
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Khám định kỳ', color: 'from-blue-400 to-blue-600', icon: Activity },
                  { name: 'Báo cáo sự cố', color: 'from-red-400 to-red-600', icon: AlertCircle },
                  { name: 'Lịch tiêm chủng', color: 'from-green-400 to-green-600', icon: Calendar },
                  { name: 'Thống kê', color: 'from-purple-400 to-purple-600', icon: TrendingUp }
                ].map((action, index) => (
                  <button
                    key={index}
                    className={`bg-gradient-to-br ${action.color} text-white p-4 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200 hover:shadow-xl`}
                  >
                    <action.icon size={24} className="mx-auto mb-2" />
                    <div className="text-sm font-semibold">{action.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Notifications */}
            <div className="bg-white p-6 rounded-3xl shadow-xl">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Thông báo gần đây</h3>
              <div className="space-y-4">
                {[
                  { type: 'success', message: 'Khám sức khỏe lớp 3A hoàn thành', time: '2 giờ trước' },
                  { type: 'warning', message: 'Cần bổ sung thuốc cảm cúm', time: '4 giờ trước' },
                  { type: 'info', message: 'Lịch tiêm chủng tuần tới đã cập nhật', time: '1 ngày trước' }
                ].map((notification, index) => (
                  <div key={index} className="flex items-start p-4 bg-gray-50 rounded-xl">
                    <div className={`w-3 h-3 rounded-full mt-2 mr-4 ${
                      notification.type === 'success' ? 'bg-green-500' :
                      notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium">{notification.message}</p>
                      <p className="text-gray-500 text-sm mt-1">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
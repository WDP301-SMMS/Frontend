import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  Users,
  AlertTriangle,
  Pill,
  Package,
  TrendingUp,
  Activity,
  Shield,
  Calendar,
} from "lucide-react";
import { getDashboardData } from "../../../libs/api/adminService";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await getDashboardData();
      console.log("Dashboard data fetched:", response.data);

      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-center">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
          <div className="text-red-500 text-center mb-4">
            <AlertTriangle size={48} className="mx-auto mb-4" />
            <p className="text-lg font-semibold">{error}</p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const data = dashboardData;

  // Chart data preparation
  const healthClassificationData =
    data.healthAnalytics.healthClassification.map((item) => ({
      name: item.classification,
      value: item.count,
      percentage: ((item.count / data.quickStats.totalStudents) * 100).toFixed(
        1
      ),
    }));

  const campaignData = [
    {
      name: "Đã duyệt",
      value:
        data.operationalMonitoring.latestCampaignsSummary.healthCheckSummary
          .approved,
      color: "#10B981",
    },
    {
      name: "Từ chối",
      value:
        data.operationalMonitoring.latestCampaignsSummary.healthCheckSummary
          .declined,
      color: "#EF4444",
    },
    {
      name: "Chờ xử lý",
      value:
        data.operationalMonitoring.latestCampaignsSummary.healthCheckSummary
          .pending,
      color: "#F59E0B",
    },
  ];

  const commonIssuesData = data.healthAnalytics.commonIssues;

  const StatCard = ({ icon: Icon, title, value, color, trend }) => (
    <div
      className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border-l-4"
      style={{ borderLeftColor: color }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold mt-2" style={{ color }}>
            {value}
          </p>
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp size={16} className="text-green-500 mr-1" />
              <span className="text-sm text-green-500">{trend}</span>
            </div>
          )}
        </div>
        <div
          className="p-3 rounded-full"
          style={{ backgroundColor: color + "20" }}
        >
          <Icon size={24} style={{ color }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Dashboard Quản Trị
          </h1>
          <p className="text-gray-600">
            Tổng quan hệ thống quản lý sức khỏe học sinh
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Tổng số học sinh"
            value={data.quickStats.totalStudents}
            color="#3B82F6"
          />
          <StatCard
            icon={AlertTriangle}
            title="Sự cố trong tuần"
            value={data.quickStats.incidentsThisWeek}
            color="#10B981"
          />
          <StatCard
            icon={Pill}
            title="Yêu cầu thuốc chờ xử lý"
            value={data.quickStats.pendingMedicationRequests}
            color="#F59E0B"
          />
          <StatCard
            icon={Package}
            title="Cảnh báo kho"
            value={data.quickStats.inventoryAlerts}
            color="#EF4444"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Health Classification Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center mb-6">
              <Activity className="text-blue-600 mr-3" size={24} />
              <h3 className="text-xl font-semibold text-gray-800">
                Phân loại sức khỏe
              </h3>
            </div>
            {healthClassificationData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={healthClassificationData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                  >
                    {healthClassificationData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={["#10B981", "#F59E0B", "#EF4444"][index]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <p>Không có dữ liệu phân loại sức khỏe</p>
              </div>
            )}
          </div>
          {/* Campaign Status */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center mb-6">
              <Calendar className="text-purple-600 mr-3" size={24} />
              <h3 className="text-xl font-semibold text-gray-800">
                Trạng thái chiến dịch
              </h3>
            </div>
            <div className="mb-4">
              <h4 className="text-lg font-medium text-gray-700 mb-2">
                {data.operationalMonitoring?.latestCampaignsSummary
                  ?.healthCheckSummary?.name || "Không có chiến dịch"}
              </h4>
            </div>

            {data.operationalMonitoring?.latestCampaignsSummary
              ?.healthCheckSummary?.total > 0 ? (
              <>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 font-medium">Tổng</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {
                        data.operationalMonitoring.latestCampaignsSummary
                          .healthCheckSummary.total
                      }
                    </p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-500 font-medium">
                      Đã duyệt
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {
                        data.operationalMonitoring.latestCampaignsSummary
                          .healthCheckSummary.approved
                      }
                    </p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-gray-500 font-medium">Từ chối</p>
                    <p className="text-2xl font-bold text-red-600">
                      {
                        data.operationalMonitoring.latestCampaignsSummary
                          .healthCheckSummary.declined
                      }
                    </p>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={campaignData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      fill={(entry) => entry.color}
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-500">
                <p>Chưa có chiến dịch nào</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Incidents */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center mb-6">
            <AlertTriangle className="text-orange-600 mr-3" size={24} />
            <h3 className="text-xl font-semibold text-gray-800">
              Sự cố gần đây
            </h3>
          </div>
          {data.operationalMonitoring.recentIncidents.length > 0 ? (
            <div className="space-y-4">
              {data.operationalMonitoring.recentIncidents.map((incident) => (
                <div
                  key={incident._id}
                  className="border-l-4 border-orange-400 bg-orange-50 p-4 rounded-r-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {incident.studentId.fullName}
                      </p>
                      <p className="text-sm text-orange-600 font-medium">
                        {incident.incidentType}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
                      {new Date(incident.incidentTime).toLocaleDateString(
                        "vi-VN"
                      )}
                    </p>
                  </div>
                  <p className="text-gray-700 mb-2">{incident.description}</p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Xử lý:</span>{" "}
                    {incident.actionsTaken}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-gray-500 bg-gray-50 rounded-lg">
              <p>Không có sự cố nào gần đây</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

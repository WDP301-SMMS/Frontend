import React, { useState, useEffect } from "react";
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
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg">
        <p>{error}</p>
        <button
          onClick={fetchDashboardData}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }
  // Fallback data for development purposes
  const data = dashboardData || {
    quickStats: {
      totalStudents: 1250,
      incidentsThisWeek: 8,
      pendingMedicationRequests: 5,
      inventoryAlerts: 12,
    },
    healthAnalytics: {
      healthClassification: [
        { category: "Healthy", count: 850 },
        { category: "Minor Issues", count: 280 },
        { category: "Requires Attention", count: 120 },
      ],
      commonIssues: [
        { issue: "Common Cold", count: 48 },
        { issue: "Allergies", count: 32 },
        { issue: "Stomach Ache", count: 27 },
        { issue: "Headache", count: 21 },
        { issue: "Minor Injuries", count: 18 },
      ],
      bmiTrend: [
        { month: "Jan", normal: 720, overweight: 150, underweight: 200 },
        { month: "Feb", normal: 740, overweight: 145, underweight: 190 },
        { month: "Mar", normal: 760, overweight: 140, underweight: 180 },
      ],
    },
    operationalMonitoring: {
      latestCampaignStatus: {
        name: "Spring Health Check 2025",
        total: 1250,
        approved: 980,
        declined: 30,
      },
      recentIncidents: [
        {
          id: 1,
          studentName: "John Doe",
          issue: "Minor injury during PE",
          date: "2025-06-20T10:30:00",
        },
        {
          id: 2,
          studentName: "Jane Smith",
          issue: "Fever",
          date: "2025-06-19T14:15:00",
        },
        {
          id: 3,
          studentName: "Mike Johnson",
          issue: "Allergic reaction",
          date: "2025-06-18T09:45:00",
        },
      ],
    },
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Quick Stats Cards */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">
            Tổng số học sinh
          </h3>
          <p className="text-2xl font-bold">{data.quickStats.totalStudents}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">
            Sự cố trong tuần
          </h3>
          <p className="text-2xl font-bold">
            {data.quickStats.incidentsThisWeek}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">
            Yêu cầu thuốc chờ xử lý
          </h3>
          <p className="text-2xl font-bold">
            {data.quickStats.pendingMedicationRequests}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">Cảnh báo kho</h3>
          <p className="text-2xl font-bold">
            {data.quickStats.inventoryAlerts}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Health Classification */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-medium mb-4">Phân loại sức khỏe</h3>
          <div className="space-y-4">
            {data.healthAnalytics.healthClassification.length > 0 ? (
              data.healthAnalytics.healthClassification.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span>{item.category}</span>
                    <span>{item.count} học sinh</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        index === 0
                          ? "bg-green-600"
                          : index === 1
                          ? "bg-yellow-600"
                          : "bg-red-600"
                      }`}
                      style={{
                        width: `${
                          (item.count / data.quickStats.totalStudents || 1) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                Không có dữ liệu phân loại sức khỏe
              </p>
            )}
          </div>
        </div>

        {/* Common Health Issues */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-medium mb-4">Vấn đề sức khỏe phổ biến</h3>
          {data.healthAnalytics.commonIssues.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vấn đề
                    </th>
                    <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số lượng
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.healthAnalytics.commonIssues.map((issue, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4">{issue.issue}</td>
                      <td className="py-2 px-4">{issue.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">Không có dữ liệu vấn đề sức khỏe</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Latest Campaign Status */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-medium mb-4">Trạng thái chiến dịch mới nhất</h3>
          <div className="mb-2">
            <h4 className="font-medium">
              {data.operationalMonitoring.latestCampaignStatus.name}
            </h4>
          </div>
          {data.operationalMonitoring.latestCampaignStatus.total > 0 ? (
            <>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Tổng</p>
                  <p className="font-bold">
                    {data.operationalMonitoring.latestCampaignStatus.total}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Đã duyệt</p>
                  <p className="font-bold text-green-600">
                    {data.operationalMonitoring.latestCampaignStatus.approved}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Từ chối</p>
                  <p className="font-bold text-red-600">
                    {data.operationalMonitoring.latestCampaignStatus.declined}
                  </p>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                {/* Approved bar */}
                <div
                  className="bg-green-600 h-3 float-left"
                  style={{
                    width: `${
                      (data.operationalMonitoring.latestCampaignStatus
                        .approved /
                        data.operationalMonitoring.latestCampaignStatus.total) *
                      100
                    }%`,
                  }}
                ></div>
                {/* Declined bar */}
                <div
                  className="bg-red-600 h-3 float-left"
                  style={{
                    width: `${
                      (data.operationalMonitoring.latestCampaignStatus
                        .declined /
                        data.operationalMonitoring.latestCampaignStatus.total) *
                      100
                    }%`,
                  }}
                ></div>
                {/* Pending bar (remaining) is gray by default */}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {data.operationalMonitoring.latestCampaignStatus.total -
                  data.operationalMonitoring.latestCampaignStatus.approved -
                  data.operationalMonitoring.latestCampaignStatus.declined}{" "}
                đang chờ phản hồi
              </p>
            </>
          ) : (
            <p className="text-gray-500">Chưa có chiến dịch nào</p>
          )}
        </div>

        {/* Recent Incidents */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-medium mb-4">Sự cố gần đây</h3>
          {data.operationalMonitoring.recentIncidents.length > 0 ? (
            <div className="space-y-4">
              {data.operationalMonitoring.recentIncidents.map((incident) => (
                <div key={incident.id} className="border-b pb-3">
                  <div className="flex justify-between">
                    <p className="font-medium">{incident.studentName}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(incident.date).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm">{incident.issue}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Không có sự cố nào gần đây</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

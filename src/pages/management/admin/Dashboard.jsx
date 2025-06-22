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
      const data = await getDashboardData();
      setDashboardData(data);
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
    totalUsers: 245,
    totalStudents: 1250,
    totalClasses: 42,
    totalPartners: 8,
    inventoryItems: 126,
    lowStockItems: 12,
    recentActivities: [
      {
        id: 1,
        type: "user_created",
        user: "John Doe",
        timestamp: "2025-06-21T15:30:00",
      },
      {
        id: 2,
        type: "class_created",
        class: "Class 5A",
        timestamp: "2025-06-20T09:15:00",
      },
      {
        id: 3,
        type: "partner_updated",
        partner: "Health Corp",
        timestamp: "2025-06-19T14:45:00",
      },
    ],
    userDistribution: {
      admins: 5,
      managers: 15,
      nurses: 30,
      parents: 195,
    },
    studentsPerClass: [
      { class: "Class 1A", students: 32 },
      { class: "Class 2B", students: 28 },
      { class: "Class 3C", students: 30 },
      { class: "Class 4D", students: 26 },
      { class: "Class 5A", students: 29 },
    ],
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Summary Cards */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
          <p className="text-2xl font-bold">{data.totalUsers}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">Total Students</h3>
          <p className="text-2xl font-bold">{data.totalStudents}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">Classes</h3>
          <p className="text-2xl font-bold">{data.totalClasses}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">Partners</h3>
          <p className="text-2xl font-bold">{data.totalPartners}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* User Distribution */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-medium mb-4">User Distribution</h3>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between mb-1">
                <span>Admins</span>
                <span>{data.userDistribution.admins}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${
                      (data.userDistribution.admins / data.totalUsers) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Managers</span>
                <span>{data.userDistribution.managers}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{
                    width: `${
                      (data.userDistribution.managers / data.totalUsers) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Nurses</span>
                <span>{data.userDistribution.nurses}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-600 h-2 rounded-full"
                  style={{
                    width: `${
                      (data.userDistribution.nurses / data.totalUsers) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Parents</span>
                <span>{data.userDistribution.parents}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{
                    width: `${
                      (data.userDistribution.parents / data.totalUsers) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Students Per Class Top 5 */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-medium mb-4">Students per Class (Top 5)</h3>
          <div className="space-y-4">
            {data.studentsPerClass.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span>{item.class}</span>
                  <span>{item.students} students</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(item.students / 40) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Summary */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-medium mb-4">Inventory Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 p-3 rounded-lg text-center">
              <p className="text-gray-500 text-sm">Total Items</p>
              <p className="text-xl font-bold">{data.inventoryItems}</p>
            </div>

            <div className="bg-yellow-100 p-3 rounded-lg text-center">
              <p className="text-yellow-800 text-sm">Low Stock Items</p>
              <p className="text-xl font-bold text-yellow-800">
                {data.lowStockItems}
              </p>
            </div>
          </div>

          {data.lowStockItems > 0 && (
            <div className="mt-4">
              <p className="text-sm text-yellow-800 bg-yellow-50 p-2 rounded">
                {data.lowStockItems} items need attention. Check inventory.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="font-medium mb-4">Recent Activities</h3>
        {data.recentActivities.length === 0 ? (
          <p>No recent activities</p>
        ) : (
          <div className="space-y-4">
            {data.recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start border-b pb-3">
                <div
                  className={`p-2 rounded-full mr-3 ${
                    activity.type.includes("user")
                      ? "bg-blue-100"
                      : activity.type.includes("class")
                      ? "bg-green-100"
                      : "bg-purple-100"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>

                <div className="flex-1">
                  <p className="font-medium">
                    {activity.type === "user_created" &&
                      `New user registered: ${activity.user}`}
                    {activity.type === "class_created" &&
                      `New class created: ${activity.class}`}
                    {activity.type === "partner_updated" &&
                      `Partner updated: ${activity.partner}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

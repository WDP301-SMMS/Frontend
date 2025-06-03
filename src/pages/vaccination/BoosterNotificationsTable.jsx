import React from 'react';
import { Search, Filter, CheckCircle, Send } from 'lucide-react';
import { utils } from '../../libs/utils/helpers';

export const BoosterNotificationsTable = ({ notifications, sendNotification }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-medium text-gray-900">
            Booster Injection Notifications
          </h2>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search students..."
                className="pl-9 pr-4 py-2 border border-gray-300 text-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
              />
            </div>
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              <Filter size={16} />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                Student
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                Last Vaccine
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                Booster Due
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                Status
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification) => (
              <tr
                key={notification.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {notification.studentName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {notification.studentId}
                    </p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <p className="text-gray-900 text-sm">
                      {notification.lastVaccine}
                    </p>
                    <p className="text-xs text-gray-500">
                      {notification.lastDate}
                    </p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <p className="text-gray-900 text-sm">
                      {notification.boosterDue}
                    </p>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${utils.getDaysUntilDueColor(
                        notification.daysUntilDue
                      )}`}
                    >
                      {notification.daysUntilDue < 0
                        ? `${Math.abs(notification.daysUntilDue)} days overdue`
                        : `${notification.daysUntilDue} days`}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${utils.getStatusColor(
                      notification.status
                    )}`}
                  >
                    {notification.status === "overdue"
                      ? "Overdue"
                      : notification.status === "due-soon"
                        ? "Due Soon"
                        : notification.status === "upcoming"
                          ? "Upcoming"
                          : notification.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    {notification.notificationSent ? (
                      <span className="flex items-center space-x-1 text-green-600 text-sm">
                        <CheckCircle size={14} />
                        <span>Sent</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => sendNotification(notification.id)}
                        className="flex items-center space-x-1 px-3 py-1 bg-primary text-white rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        <Send size={14} />
                        <span>Send</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
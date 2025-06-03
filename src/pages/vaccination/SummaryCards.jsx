import React from 'react';
import { AlertTriangle, Clock, Calendar, Send } from 'lucide-react';

export const SummaryCards = ({ boosterNotifications }) => {
  const overdueCount = boosterNotifications.filter(n => n.status === "overdue").length;
  const dueSoonCount = boosterNotifications.filter(n => n.status === "due-soon").length;
  const upcomingCount = boosterNotifications.filter(n => n.status === "upcoming").length;
  const notificationsSentCount = boosterNotifications.filter(n => n.notificationSent).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Overdue</p>
            <p className="text-2xl font-semibold text-red-600">{overdueCount}</p>
          </div>
          <AlertTriangle className="text-red-500 w-6 h-6" />
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Due Soon</p>
            <p className="text-2xl font-semibold text-yellow-600">{dueSoonCount}</p>
          </div>
          <Clock className="text-yellow-500 w-6 h-6" />
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Upcoming</p>
            <p className="text-2xl font-semibold text-primary">{upcomingCount}</p>
          </div>
          <Calendar className="text-blue-500 w-6 h-6" />
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Notifications Sent</p>
            <p className="text-2xl font-semibold text-green-600">{notificationsSentCount}</p>
          </div>
          <Send className="text-green-500 w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
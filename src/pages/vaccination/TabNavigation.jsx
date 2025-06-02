import React from 'react';
import { Bell, Eye } from 'lucide-react';

export const TabNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6">
      <div className="flex space-x-4 sm:space-x-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab("auto-check")}
          className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
            activeTab === "auto-check"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <div className="flex items-center space-x-2">
            <Bell size={16} />
            <span>Auto Check Booster</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("view-records")}
          className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
            activeTab === "view-records"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <div className="flex items-center space-x-2">
            <Eye size={16} />
            <span>View Records</span>
          </div>
        </button>
      </div>
    </div>
  );
};
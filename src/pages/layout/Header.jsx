import React from 'react';
import { Download, Settings } from 'lucide-react';

export const Header = ({ exportReport }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Vaccination History Management
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Quản lý lịch sử tiêm chủng học sinh
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={exportReport}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Download size={16} />
            <span>Export Report</span>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};
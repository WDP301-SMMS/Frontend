import React from 'react';
import { Search } from 'lucide-react';

export const SearchAndFilter = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="flex-1 relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by student name or ID..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Classes</option>
          <option value="10A1">10A1</option>
          <option value="11B2">11B2</option>
          <option value="12C1">12C1</option>
        </select>
        <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Search size={16} />
          <span>Search</span>
        </button>
      </div>
    </div>
  );
};
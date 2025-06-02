import React, { useState } from 'react';
import { Shield, User, Menu, X, ChevronDown, ChevronRight, Home, Syringe, Bell, Eye, Calendar, Users2, Activity, BarChart3, FileBarChart, UserCheck, Building2, Settings } from 'lucide-react';
import { mockData } from '../../libs/utils/common';

const iconMap = {
  Home, Syringe, Bell, Eye, Calendar, Users2, Activity, BarChart3, 
  FileBarChart, Shield, UserCheck, Building2, Settings
};

export const Sidebar = ({ sidebarOpen, setSidebarOpen, activeMenuItem, setActiveMenuItem, setActiveTab }) => {
  const [expandedMenus, setExpandedMenus] = useState(['vaccination-management']); // Default expanded menu

  const toggleMenuExpansion = (menuId) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleMenuItemClick = (item) => {
    setActiveMenuItem(item.id);
    
    // If item has subItems, toggle expansion
    if (item.subItems) {
      toggleMenuExpansion(item.id);
    }
  };

  const handleSubItemClick = (subItem) => {
    // Handle different sub-items appropriately
    switch(subItem.id) {
      case 'auto-check':
        setActiveTab('auto-check');
        break;
      case 'view-records':
        setActiveTab('view-records');
        break;
      case 'schedule-vaccination':
        setActiveTab('schedule-vaccination');
        break;
      default:
        // For other sub-items, you can add more logic here
        console.log(`Clicked on ${subItem.label}`);
        break;
    }
  };

  return (
    <div
      className={`bg-white border-r border-gray-200 transition-all duration-300 flex-shrink-0 ${
        sidebarOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Health System</h2>
                <p className="text-xs text-gray-500">School Management</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Sidebar Menu */}
      <div className="p-2 space-y-1 flex-1 overflow-y-auto">
        {mockData.menuItems.map((item) => {
          const IconComponent = iconMap[item.icon];
          const isActive = activeMenuItem === item.id;
          const isExpanded = expandedMenus.includes(item.id);
          
          return (
            <div key={item.id}>
              <button
                onClick={() => handleMenuItemClick(item)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-500"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <IconComponent size={20} />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 font-medium text-sm">{item.label}</span>
                    {item.subItems && (
                      <div className="transition-transform duration-200">
                        {isExpanded ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </div>
                    )}
                  </>
                )}
              </button>

              {/* Sub Menu Items */}
              {sidebarOpen && item.subItems && isExpanded && (
                <div className="ml-6 mt-1 space-y-1 overflow-hidden">
                  <div className="animate-in slide-in-from-top-2 duration-200">
                    {item.subItems.map((subItem) => {
                      const SubIconComponent = iconMap[subItem.icon];
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => handleSubItemClick(subItem)}
                          className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left text-sm transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900 group"
                        >
                          <SubIconComponent size={16} className="transition-colors group-hover:text-blue-600" />
                          <span className="transition-colors group-hover:text-blue-600">{subItem.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* User Profile */}
      {sidebarOpen && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Dr. Nguyen Van A
              </p>
              <p className="text-xs text-gray-500 truncate">School Nurse</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
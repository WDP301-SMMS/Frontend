import React, { useState } from "react";
import {
  Shield,
  User,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Home,
  Syringe,
  Bell,
  Eye,
  Calendar,
  Users2,
  Activity,
  BarChart3,
  FileBarChart,
  UserCheck,
  Building2,
  Settings,
  Pill,
  ClipboardList,
  FileText,
  AlertTriangle,
  LogOut,
  Stethoscope,
  Package,
  HeartHandshake,
  TrendingUp,
} from "lucide-react";
import { mockData } from "~/libs/utils/common";

const iconMap = {
  Home,
  Syringe,
  Bell,
  Eye,
  Calendar,
  Users2,
  Activity,
  BarChart3,
  FileBarChart,
  Shield,
  UserCheck,
  Building2,
  Settings,
  Pill,
  ClipboardList,
  FileText,
  AlertTriangle,
  LogOut,
  Stethoscope,
  Package,
  HeartHandshake,
  TrendingUp,
};

export const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  activeMenuItem,
  setActiveMenuItem,
  setActiveTab,
}) => {
  const [expandedMenus, setExpandedMenus] = useState([
    "vaccination-management",
  ]); // Default expanded menu

  const toggleMenuExpansion = (menuId) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
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
    switch (subItem.id) {
      case "auto-check":
        setActiveTab("auto-check");
        break;
      case "view-records":
        setActiveTab("view-records");
        break;
      case "schedule-vaccination":
        setActiveTab("schedule-vaccination");
        break;
      default:
        // For other sub-items, you can add more logic here
        console.log(`Clicked on ${subItem.label}`);
        setActiveTab(subItem.id);
        break;
    }
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log("Logout clicked");
    // You can add your logout logic here
  };

  return (
    <div
      className={`bg-gradient-to-b from-blue-50 to-white border-r border-blue-100 shadow-lg transition-all duration-300 flex-shrink-0 flex flex-col ${
        sidebarOpen ? "w-72" : "w-19"
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-blue-100 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                {/* <Shield size={22} className="text-white" /> */}
                <img
                  src="/src/assets/images/logo_w.png"
                  alt="Logo"
                  className="h-8 w-auto"
                />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">
                  F HealthMate
                </h2>
                <p className="text-sm text-blue-600 font-medium">
                  Nurse Managerment
                </p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-blue-100 rounded-xl transition-all duration-200 hover:shadow-md"
          >
            {sidebarOpen ? (
              <X size={20} className="text-gray-600" />
            ) : (
              <Menu size={20} className="text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Sidebar Menu */}
      <div className="p-3 space-y-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
        {mockData.menuItemsNurse.map((item) => {
          const IconComponent = iconMap[item.icon];
          const isActive = activeMenuItem === item.id;
          const isExpanded = expandedMenus.includes(item.id);

          return (
            <div key={item.id} className="group">
              <button
                onClick={() => handleMenuItemClick(item)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-[1.02]"
                    : "text-gray-700 hover:bg-white hover:shadow-md hover:transform hover:scale-[1.01]"
                }`}
              >
                <div
                  className={`transition-all duration-200 ${
                    isActive
                      ? "text-white"
                      : "text-blue-600 group-hover:text-blue-700"
                  }`}
                >
                  <IconComponent size={20} />
                </div>
                {sidebarOpen && (
                  <>
                    <span className="flex-1 font-semibold text-sm">
                      {item.label}
                    </span>
                    {item.subItems && (
                      <div
                        className={`transition-all duration-200 ${
                          isActive ? "text-white" : "text-gray-400"
                        }`}
                      >
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
                <div className="ml-6 mt-2 space-y-1 overflow-hidden">
                  <div className="animate-in slide-in-from-top-2 duration-200 space-y-1">
                    {item.subItems.map((subItem) => {
                      const SubIconComponent = iconMap[subItem.icon];
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => handleSubItemClick(subItem)}
                          className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-left text-sm transition-all duration-200 text-gray-600 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm group/sub border-l-2 border-transparent hover:border-blue-300"
                        >
                          <div className="transition-colors group-hover/sub:text-blue-600">
                            <SubIconComponent size={16} />
                          </div>
                          <span className="transition-colors group-hover/sub:text-blue-700 font-medium">
                            {subItem.label}
                          </span>
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

      {/* User Profile & Logout */}
      {sidebarOpen && (
        <div className="p-4 border-t border-blue-100 bg-white/80 backdrop-blur-sm space-y-3">
          {/* User Profile */}
          <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 cursor-pointer border border-blue-100">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
              <User size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">
                BS. Nguyễn Văn A
              </p>
              <p className="text-xs text-blue-600 truncate font-medium">
                Y tá trường
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 text-red-600 hover:bg-red-50 hover:shadow-md hover:transform hover:scale-[1.01] group border border-red-100 hover:border-red-200"
          >
            <LogOut
              size={20}
              className="transition-colors group-hover:text-red-700"
            />
            <span className="font-semibold text-sm transition-colors group-hover:text-red-700">
              Đăng xuất
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  Book,
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
  Package2,
  HeartHandshake,
  TrendingUp,
  PillBottle,
  Target,
  Heart,
  History,
  Clock,
  FileCheck,
  List,
  BookOpen,
} from "lucide-react";
import { mockData } from "~/libs/utils/common";

const iconMap = {
  Home,
  Syringe,
  Bell,
  Eye,
  Book,
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
  Package2,
  HeartHandshake,
  TrendingUp,
  PillBottle,
  Target,
  Heart,
  History,
  Clock,
  FileCheck,
  List,
  BookOpen,
};

import { useAuth } from "~/libs/contexts/AuthContext";
import { userService } from "~/libs/api";

export const SidebarManager = ({ role }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user profile when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoadingProfile(true);
        const response = await userService.getProfile();
        if (response.success) {
          setUserProfile(response.data.data);
        } else {
          console.error("Failed to fetch user profile:", response.error);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, []);

  const menuItems =
    role === "admin" ? mockData.menuItemsAdmin : mockData.menuItemsManager;

  const toggleMenuExpansion = (menuId) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleMenuItemClick = (item) => {
    if (item.route) {
      navigate(item.route);
    }
    if (item.subItems) {
      toggleMenuExpansion(item.id);
    }
  };

  const handleSubItemClick = (subItem) => {
    if (subItem.route) {
      navigate(subItem.route);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleDisplayName = (role) => {
    const roleMap = {
      'Parent': 'Phụ huynh',
      'Teacher': 'Giáo viên',
      'Nurse': 'Y tá',
      'Admin': 'Quản trị viên',
      'Student': 'Học sinh',
      'Manager': 'Quản lý'
    };
    return roleMap[role] || role;
  };

  return (
    <div
      className={`bg-gradient-to-b from-blue-50 to-white border-r border-blue-100 shadow-lg transition-all duration-300 flex-shrink-0 flex flex-col ${sidebarOpen ? "w-72" : "w-19"
        }`}
    >
      <div className="p-4 border-b border-blue-100 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center space-x-3" onClick={() => navigate("/management")}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <img
                  src="/src/assets/images/logo_w.png"
                  alt="Logo"
                  className="h-8 w-auto"
                />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">
                  EduCare
                </h2>
                <p className="text-sm text-blue-600 font-medium">
                  Quản lý Y tế học đường
                </p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-blue-100 rounded-xl transition-all duration-200 hover:shadow-md"
            aria-label={sidebarOpen ? "Đóng menu" : "Mở menu"}
          >
            {sidebarOpen ? (
              <X size={20} className="text-gray-600" />
            ) : (
              <Menu size={20} className="text-gray-600" />
            )}
          </button>
        </div>
      </div>

      <div className="p-3 space-y-2 flex-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const IconComponent = iconMap[item.icon];
          const isActive =
            item.route === location.pathname ||
            (item.subItems &&
              item.subItems.some((subItem) => subItem.route === location.pathname));
          const isExpanded = expandedMenus.includes(item.id);

          return (
            <div key={item.id} className="group">
              <button
                onClick={() => handleMenuItemClick(item)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${isActive
                    ? "bg-blue-600 text-white shadow-lg transform scale-[1.02]"
                    : "text-gray-700 hover:bg-blue-100 hover:shadow-md hover:transform hover:scale-[1.01]"
                  }`}
                style={{ cursor: "pointer" }}
              >
                <div
                  className={`transition-all duration-200 ${isActive ? "text-white" : "text-blue-600 group-hover:text-blue-700"
                    }`}
                >
                  {IconComponent && <IconComponent size={20} />}
                </div>
                {sidebarOpen && (
                  <>
                    <span className="flex-1 font-semibold text-sm">
                      {item.label}
                    </span>
                    {item.subItems && (
                      <div
                        className={`transition-all duration-200 ${isActive ? "text-white" : "text-gray-400"
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

              {sidebarOpen && item.subItems && isExpanded && (
                <div className="ml-6 mt-2 space-y-1 overflow-hidden">
                  <div className="animate-in slide-in-from-top-2 duration-200 space-y-1">
                    {item.subItems.map((subItem) => {
                      const SubIconComponent = iconMap[subItem.icon];
                      const isSubActive = location.pathname === subItem.route;
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => handleSubItemClick(subItem)}
                          className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-left text-sm transition-all duration-200 ${isSubActive
                              ? "bg-blue-600 text-white"
                              : "text-gray-600 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm"
                            } border-l-2 border-transparent hover:border-blue-300`}
                          style={{ cursor: "pointer" }}
                        >
                          <div
                            className={`transition-colors ${isSubActive
                                ? "text-white"
                                : "group-hover/sub:text-blue-600"
                              }`}
                          >
                            {SubIconComponent && <SubIconComponent size={16} />}
                          </div>
                          <span
                            className={`transition-colors ${isSubActive
                                ? "text-white"
                                : "group-hover/sub:text-blue-700 font-medium"
                              }`}
                          >
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

      {sidebarOpen && (
        <div className="p-4 border-t border-blue-100 bg-white/80 backdrop-blur-sm space-y-3">
          {/* User Profile Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100">
            {loadingProfile ? (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded animate-pulse mb-1"></div>
                  <div className="h-2 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </div>
              </div>
            ) : userProfile ? (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {getInitials(userProfile.username)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">
                    {userProfile.username}
                  </h3>
                  <p className="text-xs text-blue-600 truncate">
                    {getRoleDisplayName(userProfile.role)}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {userProfile.email}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <User size={20} className="text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Không thể tải thông tin</p>
                </div>
              </div>
            )}
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
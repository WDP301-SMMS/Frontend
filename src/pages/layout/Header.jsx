import React, { useState, useEffect, useRef } from "react";
import {
  Home,
  Info,
  Phone,
  FileText,
  Menu,
  X,
  User,
  BookOpen,
  LogOut,
  LogIn,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "~/libs/contexts/AuthContext";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [dropdownAnimation, setDropdownAnimation] = useState("dropdown-enter");

  const { isLoggedIn, logout, user, role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (e) => {
      setTimeout(() => {
        if (
          profileMenuRef.current &&
          !profileMenuRef.current.contains(e.target)
        ) {
          setIsProfileMenuOpen(false);
        }
      }, 0);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsProfileMenuOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    if (isProfileMenuOpen) setDropdownAnimation("dropdown-enter");
  }, [isProfileMenuOpen]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const getManagementPath = () => {
    switch (role) {
      case "Nurse":
        return "/management/nurse";
      case "Manager":
        return "/management/manager";
      case "Admin":
        return "/management/admin";
      default:
        return "/";
    }
  };

  const getRoleBasedMenuItems = () => {
    if (!isLoggedIn) return [];

    switch (role) {
      case "Nurse":
      case "Manager":
      case "Admin":
        return [
          {
            label: "Quản lý",
            to: getManagementPath(),
            icon: <FileText className="w-4 h-4 inline mr-2" />,
          },
        ];
      default:
        return [
          {
            label: "Danh sách hồ sơ của con",
            to: "/health-profiles",
            icon: <FileText className="w-4 h-4 inline mr-2" />,
          },
        ];
    }
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/src/assets/images/logo.png"
              alt="EduCare Logo"
              className="h-12 w-auto transition-transform hover:scale-105"
            />
            <span className="text-2xl font-semibold text-blue-600">
              EduCare
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-10">
            <NavLink
              to="/"
              icon={<Home />}
              label="Trang chủ"
              active={isActive("/")}
            />
            <NavLink
              to="/about"
              icon={<Info />}
              label="Giới thiệu"
              active={isActive("/about")}
            />
            <NavLink
              to="/contact"
              icon={<Phone />}
              label="Liên hệ"
              active={isActive("/contact")}
            />
            <NavLink
              to="/blogs"
              icon={<BookOpen />}
              label="Blogs"
              active={isActive("/blogs")}
            />
          </nav>

          <div
            ref={profileMenuRef}
            className="hidden md:flex items-center relative z-30"
          >
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-md transition-colors"
                >
                  <User className="w-5 h-5 mr-2" />
                  {user?.username}
                  <svg
                    className={`w-4 h-4 ml-2 transition-transform ${isProfileMenuOpen ? "rotate-180" : ""
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isProfileMenuOpen && (
                  <div
                    className={`absolute right-0 top-full mt-1 w-56 bg-white shadow-xl rounded-lg ring-1 ring-gray-200 z-20 transition-all origin-top-right ${dropdownAnimation}`}
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.username}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                    </div>

                    {getRoleBasedMenuItems().length > 0 && (
                      <div className="py-1 border-b border-gray-100">
                        <span className="block px-4 py-2 text-xs font-medium text-gray-500">
                          {["Nurse", "Manager", "Admin"].includes(role)
                            ? "Trang quản lý"
                            : "Hồ sơ sức khỏe"}
                        </span>
                        {getRoleBasedMenuItems().map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          >
                            {item.icon}
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}

                    <div className="py-1">
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      >
                        Cài đặt tài khoản
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <LogOut className="w-4 h-4 inline mr-2" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="ml-2 text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden px-4 pt-4 pb-6 space-y-3 bg-white shadow-lg">
          <MobileNavLink
            to="/"
            label="Trang chủ"
            icon={<Home />}
            active={isActive("/")}
          />
          <MobileNavLink
            to="/about"
            label="Giới thiệu"
            icon={<Info />}
            active={isActive("/about")}
          />
          <MobileNavLink
            to="/contact"
            label="Liên hệ"
            icon={<Phone />}
            active={isActive("/contact")}
          />
          <MobileNavLink
            to="/blogs"
            label="Blogs"
            icon={<BookOpen />}
            active={isActive("/blogs")}
          />

          <div className="pt-3 border-t border-gray-200">
            {isLoggedIn ? (
              <>
                <p className="px-4 py-2 font-medium text-gray-900">
                  {user?.username}
                </p>

                {getRoleBasedMenuItems().length > 0 && (
                  <>
                    <span className="text-gray-800 font-semibold flex items-center px-4 mt-2">
                      <FileText className="w-5 h-5 mr-2" />
                      {["Nurse", "Manager", "Admin"].includes(role)
                        ? "Trang quản lý"
                        : "Hồ sơ sức khỏe"}
                    </span>
                    {getRoleBasedMenuItems().map((item) => (
                      <MobileNavLink
                        key={item.to}
                        to={item.to}
                        label={item.label}
                        indent
                        active={isActive(item.to)}
                      />
                    ))}
                  </>
                )}

                <MobileNavLink
                  to="/settings"
                  label="Cài đặt tài khoản"
                  icon={<User />}
                  active={isActive("/settings")}
                />
                <button
                  onClick={handleLogout}
                  className="cursor-pointer block w-full text-left px-4 py-2 rounded-lg text-base text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  <LogOut className="w-4 h-4 inline mr-2" />
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <MobileNavLink to="/login" label="Đăng nhập" icon={<LogIn />} />
                <MobileNavLink to="/register" label="Đăng ký" />
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

const NavLink = ({ to, label, icon, active }) => (
  <Link
    to={to}
    className={`inline-flex items-center px-2 py-1 text-sm font-medium rounded-md transition-colors ${active
        ? "text-blue-600 border-b-2 border-blue-600"
        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
      }`}
  >
    {icon && <span className="mr-2">{icon}</span>}
    {label}
  </Link>
);

const MobileNavLink = ({ to, label, icon, indent = false, active }) => (
  <Link
    to={to}
    className={`block px-4 py-2 rounded-lg text-base font-medium transition-colors ${active
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
      } ${indent ? "pl-8" : ""}`}
  >
    {icon && <span className="inline-block mr-2">{icon}</span>}
    {label}
  </Link>
);

// Add dropdown animation globally
const style = document.createElement("style");
style.textContent = `
  .dropdown-enter {
    animation: dropdownEnter 0.2s ease-out forwards;
  }

  @keyframes dropdownEnter {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

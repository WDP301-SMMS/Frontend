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
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isHealthProfileOpen, setIsHealthProfileOpen] = useState(false);
  const [dropdownAnimation, setDropdownAnimation] = useState("dropdown-enter");

  const location = useLocation();
  const profileMenuRef = useRef(null);
  const healthMenuRef = useRef(null);

  // Debug state changes
  useEffect(() => {
    console.log("HealthProfileOpen:", isHealthProfileOpen);
    console.log("ProfileMenuOpen:", isProfileMenuOpen);
  }, [isHealthProfileOpen, isProfileMenuOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      setTimeout(() => {
        if (
          profileMenuRef.current &&
          !profileMenuRef.current.contains(event.target)
        ) {
          setIsProfileMenuOpen(false);
        }
        if (
          healthMenuRef.current &&
          !healthMenuRef.current.contains(event.target)
        ) {
          setIsHealthProfileOpen(false);
        }
      }, 0);
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Handle ESC key to close dropdowns
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setIsProfileMenuOpen(false);
        setIsHealthProfileOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  // Handle dropdown animations
  useEffect(() => {
    if (isProfileMenuOpen || isHealthProfileOpen) {
      setDropdownAnimation("dropdown-enter");
    }
  }, [isProfileMenuOpen, isHealthProfileOpen]);

  const isActive = (path) => location.pathname === path;
  const isHealthProfilesPath = () =>
    location.pathname.includes("/health-profile");

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
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
          {/* Desktop Navigation */}{" "}
          <nav className="hidden md:flex items-center space-x-10">
            <NavLink
              to="/"
              icon={<Home className="w-5 h-5" />}
              label="Trang chủ"
              active={isActive("/")}
            />
            <NavLink
              to="/about"
              icon={<Info className="w-5 h-5" />}
              label="Giới thiệu"
              active={isActive("/about")}
            />
            <NavLink
              to="/contact"
              icon={<Phone className="w-5 h-5" />}
              label="Liên hệ"
              active={isActive("/contact")}
            />
            <NavLink
              to="/blogs"
              icon={<BookOpen className="w-5 h-5" />}
              label="Blogs"
              active={isActive("/blogs")}
            />
          </nav>{" "}
          {/* Tài khoản */}
          <div
            ref={profileMenuRef}
            className="hidden md:flex items-center relative z-30"
          >
            <button
              onClick={() => {
                console.log("Profile Menu clicked");
                setIsProfileMenuOpen(!isProfileMenuOpen);
              }}
              className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-md transition-colors"
              aria-expanded={isProfileMenuOpen}
              aria-haspopup="true"
            >
              <User className="w-5 h-5 mr-2" />
              Nguyễn Văn Bình
              <svg
                className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                  isProfileMenuOpen ? "rotate-180" : ""
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
              </svg>{" "}
            </button>{" "}
            {isProfileMenuOpen && (
              <div
                className={`absolute right-0 top-full mt-1 w-56 bg-white shadow-xl rounded-lg ring-1 ring-gray-200 z-20 transition-all origin-top-right ${dropdownAnimation}`}
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    Nguyễn Văn Bình
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    binh.nguyen@example.com
                  </p>
                </div>

                <div className="py-1 border-b border-gray-100">
                  <span className="block px-4 py-2 text-xs font-medium text-gray-500">
                    Hồ sơ sức khỏe
                  </span>
                  <Link
                    to="/health-profiles"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <FileText className="w-4 h-4 inline mr-2" />
                    Danh sách hồ sơ của con
                  </Link>
                  <Link
                    to="/health-profile/new"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <FileText className="w-4 h-4 inline mr-2" />
                    Khai báo hồ sơ mới
                  </Link>
                </div>

                <div className="py-1">
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    Cài đặt tài khoản
                  </Link>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    Đăng xuất
                  </Link>
                </div>
              </div>
            )}
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>{" "}
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pt-4 pb-6 space-y-3 bg-white shadow-lg">
          <MobileNavLink
            to="/"
            label="Trang chủ"
            icon={<Home className="w-5 h-5" />}
            active={isActive("/")}
          />
          <MobileNavLink
            to="/about"
            label="Giới thiệu"
            icon={<Info className="w-5 h-5" />}
            active={isActive("/about")}
          />{" "}
          <MobileNavLink
            to="/contact"
            label="Liên hệ"
            icon={<Phone className="w-5 h-5" />}
            active={isActive("/contact")}
          />
          <MobileNavLink
            to="/blogs"
            label="Blogs"
            icon={<BookOpen className="w-5 h-5" />}
            active={isActive("/blogs")}
          />
          <div className="pt-3 border-t border-gray-200">
            <div className="px-4 py-2">
              <p className="font-medium text-gray-900">Nguyễn Văn Bình</p>
              <p className="text-xs text-gray-500">binh.nguyen@example.com</p>
            </div>
            <span className="text-gray-800 font-semibold flex items-center px-3 mt-2">
              <FileText className="w-5 h-5 mr-2" />
              Hồ sơ sức khỏe
            </span>
            <MobileNavLink
              to="/health-profiles"
              label="Danh sách hồ sơ của con"
              indent
              active={isActive("/health-profiles")}
            />
            <MobileNavLink
              to="/health-profile/new"
              label="Khai báo hồ sơ mới"
              indent
              active={isActive("/health-profile/new")}
            />

            <MobileNavLink
              to="/settings"
              label="Cài đặt tài khoản"
              icon={<User className="w-5 h-5" />}
              active={isActive("/settings")}
            />
            <MobileNavLink to="/login" label="Đăng xuất" />
          </div>
        </div>
      )}
    </header>
  );
};

// Subcomponent for link
const NavLink = ({ to, label, icon, active }) => (
  <Link
    to={to}
    className={`inline-flex items-center px-2 py-1 text-sm font-medium rounded-md transition-colors ${
      active
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
    className={`block px-4 py-2 rounded-lg text-base font-medium transition-colors ${
      active
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
    } ${indent ? "pl-8" : ""}`}
  >
    {icon && <span className="inline-block mr-2">{icon}</span>}
    {label}
  </Link>
);

export default Header;

/* Animation styles for dropdown menus */
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

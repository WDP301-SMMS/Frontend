import { useState } from "react";
import { useNavigate } from "react-router";

const Header = () => {
  const [isLoggedIn] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-primary text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 text-white px-4 py-2 font-bold text-lg"
          >
            <img
              src="/src/assets/images/logo_w.png"
              alt="Logo"
              className="h-8 w-auto"
            />
            <span>F HealthCare</span>
          </button>
          <nav className="hidden lg:block ml-8">
            <ul className="flex space-x-6">
              {[
                { name: "Trang Chủ", path: "/" },
                { name: "Chăm Sóc Sức Khỏe", path: "/healthCare" },
                { name: "Giới Thiệu", path: "/about" },
                { name: "Bài Viết", path: "/blogs" },
                { name: "Liên Hệ", path: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.path)}
                    href={item.path}
                    className="text-white hover:text-blue-200 transition-colors duration-200 font-medium"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {isLoggedIn && (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center hover:bg-gray-400 transition-colors duration-200"
              >
                <span className="text-gray-600 font-semibold">U</span>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <a
                    href="/settings"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    Hồ Sơ
                  </a>
                  <hr className="my-1" />
                  <button
                    onClick={() => navigate("/login")}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    Đăng Xuất
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            className="lg:hidden p-2 rounded-md hover:bg-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center">
              <span
                className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                  isMobileMenuOpen
                    ? "rotate-45 translate-y-1"
                    : "-translate-y-0.5"
                }`}
              ></span>
              <span
                className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
                  isMobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              ></span>
              <span
                className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                  isMobileMenuOpen
                    ? "-rotate-45 -translate-y-1"
                    : "translate-y-0.5"
                }`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <nav className="px-4 py-2">
            <ul className="space-y-2">
              {[
                { name: "Home", path: "/" },
                { name: "Health Care", path: "#" },
                { name: "About", path: "/about" },
                { name: "Blogs", path: "/blog" },
                { name: "Contact Us", path: "#" },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.path}
                    className="block py-2 text-gray-700 hover:text-primary transition-colors duration-200"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

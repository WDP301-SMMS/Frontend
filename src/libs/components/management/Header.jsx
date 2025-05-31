import React from "react";

const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="#4157ff"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const Header = ({ onMenuClick }) => {
  return (
    <header className="flex items-center justify-between p-4 border-b shadow-sm bg-white">
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden text-[#4157ff]"
          onClick={onMenuClick}
          aria-label="Open sidebar menu"
        >
          <MenuIcon />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Trang quản lý</h1>
      </div>
      <div>
        <span className="text-[#4157ff] font-medium">Xin chào, Kevin 👋</span>
      </div>
    </header>
  );
};

export default Header;

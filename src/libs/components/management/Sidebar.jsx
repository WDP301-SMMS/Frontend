import React from "react";

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed z-30 inset-y-0 left-0 w-64 transform bg-[#4157ff] text-white transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 text-2xl font-bold border-b border-white/30">
          Quản lý
          <button className="lg:hidden" onClick={onClose} aria-label="Close sidebar menu">
            <CloseIcon />
          </button>
        </div>
        <nav className="mt-6 space-y-2 px-4">
          <a
            href="/management/nurse"
            className="block py-2 px-3 rounded hover:bg-white hover:text-[#4157ff]"
          >
            Nhân viên y tế
          </a>
          <a
            href="/management/manager"
            className="block py-2 px-3 rounded hover:bg-white hover:text-[#4157ff]"
          >
            Quản lý
          </a>
          <a
            href="/management/admin"
            className="block py-2 px-3 rounded hover:bg-white hover:text-[#4157ff]"
          >
            Quản trị viên
          </a>
        </nav>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;

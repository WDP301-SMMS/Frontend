import React from "react";
import Sidebar from "../../../libs/components/management/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => (
  <div className="flex h-screen bg-gray-100 font-sans text-gray-800">
    <Sidebar isOpen={true} />
    <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
      <Outlet />
    </main>
  </div>
);

export default AdminLayout;

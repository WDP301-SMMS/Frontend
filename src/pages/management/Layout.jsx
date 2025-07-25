import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../../libs/components/management/Header";
import Sidebar from "../../libs/components/management/Sidebar";

const ManagementLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-white text-gray-900">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col lg:ml-64">
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 p-6 overflow-y-auto bg-white">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ManagementLayout;

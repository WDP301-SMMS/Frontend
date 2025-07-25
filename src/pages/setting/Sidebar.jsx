import React from 'react';
import {
  PersonOutline,
  ChatBubbleOutline,
} from "@mui/icons-material";
import { useAuth } from "~/libs/contexts/AuthContext";

export default function Sidebar({ activeTab, setActiveTab }) {
  const { role } = useAuth();

  const navItems = [
    { id: "userInfo", icon: <PersonOutline fontSize="medium" />, label: "Thông tin người dùng" },
    ...(role === "Parent" || role === "Nurse"
      ? [{ id: "chat", icon: <ChatBubbleOutline fontSize="medium" />, label: "Chat" }]
      : []),
  ];

  return (
    <aside className="w-20 h-screen bg-white flex flex-col items-center py-8 shadow-sm border-r border-gray-200">
      <nav className="flex flex-col items-center space-y-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            aria-label={item.label}
            className={`w-16 h-14 flex items-center justify-center rounded-xl transition-all duration-300 ${activeTab === item.id
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              }`}
          >
            {item.icon}
          </button>
        ))}
      </nav>
    </aside>
  );
}

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faXmark,
    faUserNurse,
    faUserGear,
    faUserShield,
    faAngleLeft,
    faBars,
    faMessage,
    faBell,
    faKitMedical,
    faSyringe,
    faHeart,
    faSchool,
    faChartLine
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const Sidebar = ({ isOpen, onClose }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => {
        setIsCollapsed((prev) => !prev);
    };

    const path = window.location.pathname;

    // Hàm trả về menu dựa trên đường dẫn
    const renderNavItems = () => {
        if (path.startsWith("/management/nurse")) {
            return (
                <>
                    <SidebarItem
                        to="/management/nurse"
                        icon={faChartLine}
                        label="Báo cáo"
                        collapsed={isCollapsed}
                        active={path === "/management/nurse"}
                    />
                    <SidebarItem
                        to="/management/vaccination"
                        icon={faSyringe}
                        label="Quản lý tiêm chủng"
                        collapsed={isCollapsed}
                        active={path === "/management/vaccination"}
                    />
                    <SidebarItem
                        to="/management/health-check"
                        icon={faHeart}
                        label="Quản lý sức khỏe định kỳ"
                        collapsed={isCollapsed}
                        active={path === "/management/health-check"}
                    />
                    <SidebarItem
                        to="/management/nurse/message"
                        icon={faMessage}
                        label="Tin nhắn"
                        collapsed={isCollapsed}
                        active={path === "/management/nurse/message"}
                    />
                    <SidebarItem
                        to="/management/notification"
                        icon={faBell}
                        label="Thông báo"
                        collapsed={isCollapsed}
                        active={path === "/management/notification"}
                    />
                </>
            );
        }

        if (path.startsWith("/management/manager")) {
            return (
                <>
                    <SidebarItem
                        to="/management/manager"
                        icon={faChartLine}
                        label="Báo cáo"
                        collapsed={isCollapsed}
                        active={path === "/management/manager"}
                    />
                    <SidebarItem
                        to="/management/manager/medicine"
                        icon={faKitMedical}
                        label="Quản lý kho thuốc"
                        collapsed={isCollapsed}
                        active={path === "/management/manager/medicine"}
                    />
                    <SidebarItem
                        to="/management/vaccination"
                        icon={faSyringe}
                        label="Quản lý tiêm chủng"
                        collapsed={isCollapsed}
                        active={path === "/management/vaccination"}
                    />
                    <SidebarItem
                        to="/management/health-check"
                        icon={faHeart}
                        label="Quản lý sức khỏe định kỳ"
                        collapsed={isCollapsed}
                        active={path === "/management/health-check"}
                    />
                    <SidebarItem
                        to="/management/manager/nurse"
                        icon={faUserNurse}
                        label="Quản lý y tá"
                        collapsed={isCollapsed}
                        active={path === "/management/manager/nurse"}
                    />
                    <SidebarItem
                        to="/management/manager/student"
                        icon={faUserGear}
                        label="Quản lý học sinh"
                        collapsed={isCollapsed}
                        active={path === "/management/manager/student"}
                    />
                    <SidebarItem
                        to="/management/notification"
                        icon={faSchool}
                        label="Thông báo"
                        collapsed={isCollapsed}
                        active={path === "/management/notification"}
                    />
                </>
            );
        }

        if (path.startsWith("/management/admin")) {
            return (
                <>
                    <SidebarItem
                        to="/management/admin"
                        icon={faChartLine}
                        label="Báo cáo"
                        collapsed={isCollapsed}
                        active={path === "/management/admin"}
                    />
                    <SidebarItem
                        to="/management/admin/users"
                        icon={faUserShield}
                        label="Quản lý nhân viên"
                        collapsed={isCollapsed}
                        active={path === "/management/admin/users"}
                    />
                    <SidebarItem
                        to="/management/admin/blogs"
                        icon={faBell}
                        label="Quản lý nội dung"
                        collapsed={isCollapsed}
                        active={path === "/management/admin/blogs"}
                    />
                    <SidebarItem
                        to="/management/notification"
                        icon={faSchool}
                        label="Thông báo"
                        collapsed={isCollapsed}
                        active={path === "/management/notification"}
                    />
                </>
            );
        }

        return null;
    };

    return (
        <aside
            className={`
                fixed z-30 inset-y-0 left-0
                transform bg-primary text-white
                transition-all duration-300 ease-in-out
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                w-64
                lg:relative lg:translate-x-0
                ${isCollapsed ? "lg:w-20" : "lg:w-64"}
            `}
        >
            {/* Header */}
            <div className="flex items-center justify-between py-4 px-6 text-xl font-bold border-b border-white/30">
                {!isCollapsed && <span className="lg:block hidden">Hệ thống quản lý</span>}
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleCollapse}
                        className="hidden lg:flex items-center justify-center w-8 h-8 rounded hover:bg-white/20 transition"
                        aria-label="Toggle collapse"
                    >
                        <FontAwesomeIcon
                            icon={isCollapsed ? faBars : faAngleLeft}
                            className="w-5 h-5"
                        />
                    </button>
                    <button
                        className="lg:hidden"
                        onClick={onClose}
                        aria-label="Close sidebar"
                    >
                        <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Nav Items */}
            <nav className="mt-6 space-y-2 px-2">{renderNavItems()}</nav>
        </aside>
    );
};

const SidebarItem = ({ to, icon, label, collapsed, active }) => (
    <a
        href={to}
        className={`
            flex items-center py-2 rounded hover:bg-white hover:text-primary transition-all
            ${collapsed ? "justify-center px-0" : "gap-2 px-3"}
            ${active ? "bg-white text-primary font-semibold" : "hover:bg-white hover:text-primary text-white"}
        `}
        title={label}
    >
        <FontAwesomeIcon icon={icon} />
        <span className={`${collapsed ? "lg:hidden" : "inline"}`}>{label}</span>
    </a>
);

export default Sidebar;

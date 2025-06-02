import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBell, faUser, faSignOutAlt, faSearch } from "@fortawesome/free-solid-svg-icons";
import {
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
    Transition
} from "@headlessui/react";
import { Fragment, useState } from "react";

const Header = ({ onMenuClick }) => {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        console.log("Searching for:", e.target.value);
    };

    return (
        <header className="flex items-center justify-between p-4 border-b shadow-sm bg-white">
            <div className="flex items-center gap-3 flex-1 mr-3">
                <button
                    className="lg:hidden text-secondary"
                    onClick={onMenuClick}
                    aria-label="Open sidebar menu"
                >
                    <FontAwesomeIcon icon={faBars} className="w-6 h-6" />
                </button>
                <div className="relative flex-1 max-w-xs sm:max-w-sm lg:max-w-md">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Tìm kiếm"
                        className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary/50 text-sm text-gray-700 placeholder-gray-400 transition-all duration-200"
                        aria-label="Search menu items"
                    />
                    <FontAwesomeIcon
                        icon={faSearch}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <a
                    href="/management/notification"
                    className="text-secondary hover:text-secondary/50 transition focus:outline-none focus:ring-2 focus:ring-secondary/50 rounded-md p-2"
                    title="Thông báo"
                    aria-label="Xem thông báo"
                >
                    <FontAwesomeIcon icon={faBell} className="w-5 h-5" />
                </a>

                <Menu as="div" className="relative inline-block text-left">
                    <div>
                        <MenuButton className="flex items-center gap-2 text-secondary hover:text-secondary/50 transition focus:outline-none">
                            <img
                                src="https://i.pravatar.cc/40"
                                alt="avatar"
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            <span className="font-medium hidden sm:block">John Smith</span>
                        </MenuButton>
                    </div>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <MenuItems className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none divide-y divide-gray-100">
                            <div className="px-1 py-1">
                                <MenuItem>
                                    {({ focus }) => (
                                        <a
                                            href="/profile"
                                            className={`group flex w-full items-center gap-2 rounded-md px-4 py-2 text-sm duration-200 ${focus ? "bg-gray-100 text-gray-900" : "text-gray-700"
                                                }`}
                                        >
                                            <FontAwesomeIcon icon={faUser} />
                                            Thông tin cá nhân
                                        </a>
                                    )}
                                </MenuItem>
                                <MenuItem>
                                    {({ focus }) => (
                                        <button
                                            onClick={() => console.log("Đăng xuất")}
                                            className={`group flex w-full items-center gap-2 rounded-md px-4 py-2 text-sm duration-200 ${focus ? "bg-gray-100 text-gray-900" : "text-gray-700"
                                                }`}
                                        >
                                            <FontAwesomeIcon icon={faSignOutAlt} />
                                            Đăng xuất
                                        </button>
                                    )}
                                </MenuItem>
                            </div>
                        </MenuItems>
                    </Transition>
                </Menu>
            </div>
        </header>
    );
};

export default Header;
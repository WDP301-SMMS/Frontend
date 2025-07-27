import React, { useState, useEffect } from "react";
import { getAllUsers, updateUserStatus, updateUserRole } from "../../../libs/api/adminService";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [currentPage, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
        role: roleFilter || undefined,
        status: statusFilter || undefined,
      };

      const response = await getAllUsers(params);
      setUsers(response.data.users);
      setTotalPages(response.data.pages);
      setCurrentPage(response.data.currentPage);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };

  const openConfirmModal = (user) => {
    setSelectedUser(user);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setSelectedUser(null);
    setActionLoading(false);
  };

  const handleStatusChange = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      const newStatus = !selectedUser.isActive;
      await updateUserStatus(selectedUser._id, { isActive: newStatus });

      setUsers(
        users.map((user) =>
          user._id === selectedUser._id ? { ...user, isActive: newStatus } : user
        )
      );

      closeConfirmModal();
    } catch (err) {
      console.error("Error updating user status:", err);
      setError("Failed to update user status. Please try again.");
      setActionLoading(false);
    }
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.role || "");
    setShowRoleModal(true);
  };

  const closeModals = () => {
    setShowConfirmModal(false);
    setShowRoleModal(false);
    setSelectedUser(null);
    setSelectedRole("");
    setActionLoading(false);
  };

  const handleRoleChangeSubmit = async () => {
    if (!selectedUser || !selectedRole) return;

    try {
      setActionLoading(true);
      await updateUserRole(selectedUser._id, { role: selectedRole });

      setUsers(
        users.map((user) =>
          user._id === selectedUser._id ? { ...user, role: selectedRole } : user
        )
      );

      closeModals();
    } catch (err) {
      console.error("Error updating user role:", err);
      setError("Failed to update user role. Please try again.");
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-red-800";
      case "Manager":
        return "bg-blue-100 text-blue-800";
      case "Nurse":
        return "bg-green-100 text-green-800";
      case "Parent":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const ConfirmModal = () => {
    if (!showConfirmModal || !selectedUser) return null;

    const action = selectedUser.isActive ? "vô hiệu hóa" : "kích hoạt";
    const actionColor = selectedUser.isActive ? "text-red-600" : "text-green-600";

    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold mb-4">Xác nhận thay đổi</h3>
          <p className="text-gray-700 mb-6">
            Bạn có chắc chắn muốn{" "}
            <span className={`font-semibold ${actionColor}`}>{action}</span> tài khoản của{" "}
            <span className="font-semibold">{selectedUser.username}</span>?
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={closeConfirmModal}
              disabled={actionLoading}
              className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              onClick={handleStatusChange}
              disabled={actionLoading}
              className={`px-4 py-2 text-white rounded-md ${selectedUser.isActive
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
                } disabled:opacity-50`}
            >
              {actionLoading ? "Đang xử lý..." : "Xác nhận"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const RoleChangeModal = () => {
    if (!showRoleModal || !selectedUser) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold mb-4">Cấp quyền cho người dùng</h3>
          <p className="mb-4">
            Chọn vai trò mới cho{" "}
            <span className="font-semibold">{selectedUser.username}</span>:
          </p>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full mb-4 px-3 py-2 border rounded-md"
          >
            <option value="">-- Chọn vai trò --</option>
            <option value="Nurse">Y tá</option>
            <option value="Manager">Quản lý</option>
          </select>
          <div className="flex justify-end space-x-3">
            <button
              onClick={closeModals}
              disabled={actionLoading}
              className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              onClick={handleRoleChangeSubmit}
              disabled={!selectedRole || actionLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {actionLoading ? "Đang xử lý..." : "Xác nhận"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Quản lý người dùng</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <form
          onSubmit={handleSearchSubmit}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div>
            <label className="block text-gray-700 mb-2">Tìm kiếm</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tên, email, số điện thoại..."
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Vai trò</label>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Tất cả vai trò</option>
              <option value="Manager">Quản lý</option>
              <option value="Nurse">Y tá</option>
              <option value="Parent">Phụ huynh</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Trạng thái</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Tìm kiếm
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Danh sách người dùng</h2>

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-4">Không tìm thấy người dùng nào.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left">Tên</th>
                    <th className="py-2 px-4 text-left">Email</th>
                    <th className="py-2 px-4 text-left">Vai trò</th>
                    <th className="py-2 px-4 text-left">Ngày sinh</th>
                    <th className="py-2 px-4 text-left">Điện thoại</th>
                    <th className="py-2 px-4 text-left">Trạng thái</th>
                    <th className="py-2 px-4 text-left">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter((user) => user.role !== "Admin")
                    .map((user) => (
                      <tr key={user._id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{user.username}</td>
                        <td className="py-2 px-4">{user.email}</td>
                        <td className="py-2 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs ${getRoleBadgeClass(user.role)}`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-2 px-4">{formatDate(user.dob)}</td>
                        <td className="py-2 px-4">{user.phone}</td>
                        <td className="py-2 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs ${user.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                              }`}
                          >
                            {user.isActive ? "Đang hoạt động" : "Không hoạt động"}
                          </span>
                        </td>
                        <td className="py-2 px-4 space-x-2">
                          <button
                            onClick={() => openConfirmModal(user)}
                            className={`text-sm px-3 py-1 rounded ${user.isActive
                              ? "bg-red-600 text-white hover:bg-red-700"
                              : "bg-green-600 text-white hover:bg-green-700"
                              }`}
                          >
                            {user.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                          </button>
                          <button
                            onClick={() => openRoleModal(user)}
                            className="text-sm px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                          >
                            Cấp quyền
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <div>Trang {currentPage} / {totalPages}</div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded ${currentPage === 1
                      ? "bg-gray-100 text-gray-400"
                      : "bg-gray-200 hover:bg-gray-300"}`}
                  >
                    Trước
                  </button>
                  {[...Array(totalPages).keys()].map((page) => {
                    const pageNumber = page + 1;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-3 py-1 rounded ${currentPage === pageNumber
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 hover:bg-gray-300"}`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded ${currentPage === totalPages
                      ? "bg-gray-100 text-gray-400"
                      : "bg-gray-200 hover:bg-gray-300"}`}
                  >
                    Tiếp
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <ConfirmModal />
      <RoleChangeModal />
    </div>
  );
};

export default UserManagement;

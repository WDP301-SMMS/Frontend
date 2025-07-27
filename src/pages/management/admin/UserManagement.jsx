import React, { useState, useEffect } from "react";
import { getAllUsers, updateUserStatus, updateUserRole } from "../../../libs/api/adminService";
import {
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper,
  TablePagination, IconButton, Tooltip, Stack, Chip, Button as MuiButton
} from "@mui/material";
import EditIcon from "@mui/icons-material/SupervisorAccount";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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

  const getRoleLabel = (role) => {
    switch (role) {
      case "Parent": return "Phụ huynh";
      case "Nurse": return "Y tá";
      case "Manager": return "Quản lý";
      default: return role;
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
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, mt: 2 }}>
        <h2 className="text-xl font-semibold mb-4">Danh sách người dùng</h2>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold", width: 60 }}>STT</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Tên</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Vai trò</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Ngày sinh</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Điện thoại</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Trạng thái</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", width: 180 }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">Loading...</TableCell>
                </TableRow>
              ) : users.filter((user) => user.role !== "Admin").length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">Không tìm thấy người dùng nào.</TableCell>
                </TableRow>
              ) : (
                users.filter((user) => user.role !== "Admin").map((user, idx) => (
                  <TableRow key={user._id} hover>
                    <TableCell align="center">{(currentPage - 1) * 10 + idx + 1}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip label={getRoleLabel(user.role)}
                        color={user.role === "Admin" ? "error" : user.role === "Manager" ? "primary" : user.role === "Nurse" ? "success" : user.role === "Parent" ? "secondary" : "default"}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>{formatDate(user.dob)}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.isActive ? "Đang hoạt động" : "Không hoạt động"}
                        color={user.isActive ? "success" : "error"}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title={user.isActive ? "Vô hiệu hóa" : "Kích hoạt"}>
                          <IconButton color={user.isActive ? "error" : "success"} onClick={() => openConfirmModal(user)}>
                            {user.isActive ? <BlockIcon /> : <CheckCircleIcon />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Cấp quyền">
                          <IconButton color="primary" onClick={() => openRoleModal(user)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {totalPages > 1 && (
          <TablePagination
            rowsPerPageOptions={[10]}
            component="div"
            count={totalPages * 10}
            rowsPerPage={10}
            page={currentPage - 1}
            onPageChange={(_, newPage) => setCurrentPage(newPage + 1)}
            labelRowsPerPage="Số hàng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) =>
              `Hiển thị ${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
            }
            sx={{ borderTop: "1px solid", borderColor: "divider", pt: 1 }}
          />
        )}
      </Paper>

      {/* Modals */}
      <ConfirmModal />
      <RoleChangeModal />
    </div>
  );
};

export default UserManagement;

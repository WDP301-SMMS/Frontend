import React, { useState, useEffect, Fragment } from "react";
import {
  getAllStudents,
  createStudent,
  updateStudent,
  getAllClasses,
} from "../../../libs/api/adminService";
import { useDebounce } from "../../../libs/hooks/useDebounce";
import { Dialog, Transition } from "@headlessui/react";
import { PlusCircle, CheckCircle, AlertCircle, X, Search } from "lucide-react";
import {
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper,
  TablePagination, Chip, Tooltip, IconButton
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClassFilter, setSelectedClassFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    status: "ACTIVE",
    classId: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalStudents: 0,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, [pagination.currentPage, selectedClassFilter, debouncedSearchTerm]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const queryParams = {
        page: pagination.currentPage,
        limit: 10,
      };

      // Add classId to query params if class filter is selected
      if (selectedClassFilter) {
        queryParams.classId = selectedClassFilter;
      }

      // Add search term to query params if search is active
      if (debouncedSearchTerm.trim()) {
        queryParams.search = debouncedSearchTerm.trim();
      }

      const response = await getAllStudents(queryParams);

      setStudents(response.students || []);
      setPagination({
        currentPage: response.currentPage || 1,
        totalPages: response.totalPages || 1,
        totalStudents: response.totalStudents || 0,
      });
      setError(null);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Failed to load students data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  const fetchClasses = async () => {
    try {
      const response = await getAllClasses();
      setClasses(response.classes || []);
    } catch (err) {
      console.error("Error fetching classes:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender.toUpperCase(),
        status: "ACTIVE",
        classId: formData.classId || undefined,
      };


      if (isEditing) {
        await updateStudent(selectedStudentId, payload);
        setDialogMessage("Cập nhật học sinh thành công!");
      } else {
        await createStudent(payload);

        setDialogMessage("Thêm học sinh mới thành công!");
      }
      setIsSuccessDialogOpen(true);
      resetForm();
      setIsDialogOpen(false);
      fetchStudents();
    } catch (err) {
      console.error("Error saving student:", err);
      setDialogMessage("Không thể lưu thông tin học sinh. Vui lòng thử lại.");
      setIsErrorDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (student) => {
    setIsEditing(true);
    setSelectedStudentId(student._id);
    const formattedDate = student.dateOfBirth
      ? new Date(student.dateOfBirth).toISOString().split("T")[0]
      : "";

    // Fetch latest classes when editing
    try {
      const response = await getAllClasses();
      setClasses(response.classes || []);
    } catch (err) {
      console.error("Error fetching classes for edit:", err);
    }

    setFormData({
      fullName: student.fullName || "",
      dateOfBirth: formattedDate,
      gender: student.gender?.toUpperCase() || "",
      status: student.status || "ACTIVE",
      classId: student.classId || student.class?._id || "",
    });
    setIsDialogOpen(true);
  };

  const openAddStudentDialog = async () => {
    setIsEditing(false);
    resetForm();
    // Fetch latest classes when opening dialog
    try {
      const response = await getAllClasses();
      setClasses(response.classes || []);
    } catch (err) {
      console.error("Error fetching classes for dialog:", err);
    }
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setIsEditing(false);
    setSelectedStudentId(null);
    setFormData({
      fullName: "",
      dateOfBirth: "",
      gender: "",
      status: "ACTIVE",
      classId: "",
    });
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, currentPage: newPage });
    }
  };

  const handleClassFilterChange = (e) => {
    setSelectedClassFilter(e.target.value);
    // Reset to page 1 when filter changes
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Reset to page 1 when search changes
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const clearSearch = () => {
    setSearchTerm("");
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedClassFilter("");
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  if (loading && students.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Quản lý học sinh</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Danh sách học sinh</h2>
          <button
            onClick={openAddStudentDialog}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircle size={20} />
            Thêm học sinh
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6 space-y-4">
          {/* Search Bar and Class Filter in one row */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
            {/* Search Bar */}
            <div className="flex-1">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tìm kiếm học sinh:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="search"
                  name="search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Nhập tên học sinh..."
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            {/* Class Filter */}
            <div className="w-full md:w-64">
              <label
                htmlFor="classFilter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Lọc theo lớp:
              </label>
              <select
                id="classFilter"
                name="classFilter"
                value={selectedClassFilter}
                onChange={handleClassFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả lớp</option>
                {classes.map((classItem) => (
                  <option key={classItem._id} value={classItem._id}>
                    {classItem.name || classItem.className}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear All Filters Button */}
            {(searchTerm || selectedClassFilter) && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors whitespace-nowrap"
              >
                Xóa tất cả bộ lọc
              </button>
            )}
          </div>

          {/* Active Filters Display */}
          {(searchTerm || selectedClassFilter) && (
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="text-gray-600">Đang áp dụng:</span>
              {searchTerm && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                  Tìm kiếm: "{searchTerm}"
                </span>
              )}
              {selectedClassFilter && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md">
                  Lớp:{" "}
                  {classes.find((c) => c._id === selectedClassFilter)?.name ||
                    classes.find((c) => c._id === selectedClassFilter)
                      ?.className ||
                    selectedClassFilter}
                </span>
              )}
            </div>
          )}
        </div>

        {students.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm || selectedClassFilter
                ? "Không tìm thấy học sinh nào phù hợp với điều kiện tìm kiếm."
                : "Không tìm thấy học sinh nào."}
            </p>
            {(searchTerm || selectedClassFilter) && (
              <button
                onClick={clearAllFilters}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                Xóa bộ lọc để xem tất cả học sinh
              </button>
            )}
          </div>
        ) : (
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, mt: 2 }}>
            <h2 className="text-xl font-semibold mb-4">Danh sách học sinh</h2>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>STT</TableCell>
                    <TableCell>Họ và tên</TableCell>
                    <TableCell>Ngày sinh</TableCell>
                    <TableCell>Giới tính</TableCell>
                    <TableCell>Lớp</TableCell>
                    <TableCell>Mã mời</TableCell>
                    <TableCell align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        Không tìm thấy học sinh nào.
                      </TableCell>
                    </TableRow>
                  ) : (
                    students.map((student, idx) => (
                      <TableRow key={student._id} hover>
                        <TableCell>{(pagination.currentPage - 1) * 10 + idx + 1}</TableCell>
                        <TableCell>{student.fullName}</TableCell>
                        <TableCell>
                          {student.dateOfBirth
                            ? new Date(student.dateOfBirth).toLocaleDateString("vi-VN")
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={
                              student.gender === "MALE"
                                ? "Nam"
                                : student.gender === "FEMALE"
                                  ? "Nữ"
                                  : student.gender === "OTHER"
                                    ? "Khác"
                                    : "-"
                            }
                            color={
                              student.gender === "MALE"
                                ? "primary"
                                : student.gender === "FEMALE"
                                  ? "secondary"
                                  : "default"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {student.class?.name || student.class?.className || "-"}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={student.invitedCode?.code || "-"}
                            color={student.invitedCode?.isActive ? "success" : "default"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Sửa">
                            <IconButton color="primary" onClick={() => handleEdit(student)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10]}
              component="div"
              count={pagination.totalStudents}
              rowsPerPage={10}
              page={pagination.currentPage - 1}
              onPageChange={(_, newPage) => handlePageChange(newPage + 1)}
              labelRowsPerPage="Số hàng mỗi trang:"
              labelDisplayedRows={({ from, to, count }) =>
                `Hiển thị ${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
              }
              sx={{ borderTop: "1px solid", borderColor: "divider", pt: 1 }}
            />
          </Paper>
        )}
      </div>

      {/* Custom Student Form Dialog */}
      <Transition appear show={isDialogOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleDialogClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      {isEditing ? "Chỉnh sửa học sinh" : "Thêm học sinh mới"}
                    </Dialog.Title>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500"
                      onClick={handleDialogClose}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-1 text-sm font-medium">
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-1 text-sm font-medium">
                        Ngày sinh
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-1 text-sm font-medium">
                        Giới tính
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="MALE">Nam</option>
                        <option value="FEMALE">Nữ</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-1 text-sm font-medium">
                        Lớp
                      </label>
                      <select
                        name="classId"
                        value={formData.classId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Chọn lớp</option>
                        {classes.map((classItem) => (
                          <option key={classItem._id} value={classItem._id}>
                            {classItem.name || classItem.className}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={handleDialogClose}
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Đang xử lý...
                          </div>
                        ) : isEditing ? (
                          "Cập nhật"
                        ) : (
                          "Thêm mới"
                        )}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Success Dialog */}
      <Transition appear show={isSuccessDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsSuccessDialogOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-center align-middle shadow-xl transition-all">
                  <div className="mb-4">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  </div>
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                  >
                    Thành công
                  </Dialog.Title>
                  <p className="text-gray-600 mb-6">{dialogMessage}</p>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setIsSuccessDialogOpen(false)}
                    >
                      Đóng
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Error Dialog */}
      <Transition appear show={isErrorDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsErrorDialogOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-center align-middle shadow-xl transition-all">
                  <div className="mb-4">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                  </div>
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                  >
                    Lỗi
                  </Dialog.Title>
                  <p className="text-gray-600 mb-6">{dialogMessage}</p>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setIsErrorDialogOpen(false)}
                    >
                      Đóng
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default StudentManagement;

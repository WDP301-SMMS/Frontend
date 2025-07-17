import React, { useState, useEffect, Fragment } from "react";
import {
  getAllClasses,
  createClass,
  addStudentsToClass,
  removeStudentsFromClass,
} from "../../../libs/api/adminService";
import { Dialog, Transition } from "@headlessui/react";
import {
  PlusCircle,
  CheckCircle,
  AlertCircle,
  X,
  Users,
  UserPlus,
  UserMinus,
} from "lucide-react";

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    className: "",
    gradeLevel: "",
    schoolYear: "",
    description: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalClasses: 0,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [studentModal, setStudentModal] = useState({
    isOpen: false,
    classId: null,
    className: "",
    operation: "add", // 'add', 'remove', or 'view'
    studentIds: "",
    students: [],
    loading: false,
  });
  useEffect(() => {
    fetchClasses();
  }, [pagination.currentPage]);
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await getAllClasses({
        page: pagination.currentPage,
        limit: 10,
      });

      console.log("Classes fetched:", response);
      setClasses(response.classes || []);
      setPagination({
        currentPage: response.currentPage || 1,
        totalPages: response.totalPages || 1,
        totalClasses: response.totalClasses || 0,
      });
      setError(null);
    } catch (err) {
      console.error("Error fetching classes:", err);
      setError("Không thể tải dữ liệu lớp học. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Convert gradeLevel to a number if it's not empty
    if (name === "gradeLevel" && value !== "") {
      setFormData({
        ...formData,
        [name]: parseInt(value, 10), // Convert to integer
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleStudentModalInputChange = (e) => {
    const { name, value } = e.target;
    setStudentModal({
      ...studentModal,
      [name]: value,
    });
  };  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Create a properly formatted class object
      const classData = {
        className: formData.className,
        gradeLevel: parseInt(formData.gradeLevel, 10), // Ensure gradeLevel is a number
        schoolYear: formData.schoolYear,
        description: formData.description || "",
      };
      
      console.log("Creating class with data:", classData);
      await createClass(classData);
      
      setDialogMessage("Tạo lớp học mới thành công!");
      setIsSuccessDialogOpen(true);
      resetForm();
      setIsDialogOpen(false);
      fetchClasses();
    } catch (err) {
      console.error("Error creating class:", err);
      setDialogMessage("Không thể tạo lớp học. Vui lòng thử lại.");
      setIsErrorDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };
  const handleStudentOperation = async (e) => {
    e.preventDefault();
    try {
      setStudentModal((prev) => ({ ...prev, loading: true }));
      const studentIdsArray = studentModal.studentIds
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id);

      if (studentIdsArray.length === 0) {
        setError("Vui lòng nhập ít nhất một ID học sinh");
        setStudentModal((prev) => ({ ...prev, loading: false }));
        return;
      }

      if (studentModal.operation === "add") {
        await addStudentsToClass(studentModal.classId, studentIdsArray);
        setDialogMessage("Thêm học sinh vào lớp thành công!");
      } else {
        await removeStudentsFromClass(studentModal.classId, studentIdsArray);
        setDialogMessage("Xóa học sinh khỏi lớp thành công!");
      }

      setIsSuccessDialogOpen(true);
      closeStudentModal();
      fetchClasses();
    } catch (err) {
      console.error("Error updating class students:", err);
      setDialogMessage(
        `Không thể ${
          studentModal.operation === "add" ? "thêm" : "xóa"
        } học sinh. Vui lòng thử lại.`
      );
      setIsErrorDialogOpen(true);
      setStudentModal((prev) => ({ ...prev, loading: false }));
    }
  };
  const openAddStudentsModal = (classObj) => {
    setStudentModal({
      isOpen: true,
      classId: classObj._id,
      className: classObj.className,
      operation: "add",
      studentIds: "",
      students: classObj.students || [],
      loading: false,
    });
  };
  const openRemoveStudentsModal = (classObj) => {
    setStudentModal({
      isOpen: true,
      classId: classObj._id,
      className: classObj.className,
      operation: "remove",
      studentIds: "",
      students: classObj.students || [],
      loading: false,
    });
  };
  const closeStudentModal = () => {
    setStudentModal({
      isOpen: false,
      classId: null,
      className: "",
      operation: "add",
      studentIds: "",
      students: [],
      loading: false,
    });
  };

  const openAddClassDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };
  const resetForm = () => {
    setFormData({
      className: "",
      gradeLevel: "",  // Will be converted to a number when selected
      schoolYear: "",
      description: "",
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, currentPage: newPage });
    }
  };
  if (loading && classes.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Quản lý lớp học</h1>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Danh sách lớp học</h2>
          <button
            onClick={openAddClassDialog}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircle size={20} />
            Thêm lớp học
          </button>
        </div>

        {classes.length === 0 ? (
          <p>Không tìm thấy lớp học nào.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left">Tên lớp</th>
                    <th className="py-2 px-4 text-left">Khối</th>
                    <th className="py-2 px-4 text-left">Năm học</th>
                    <th className="py-2 px-4 text-left">Số học sinh</th>
                    <th className="py-2 px-4 text-left">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((classObj) => (
                    <tr key={classObj._id} className="border-b">
                      <td className="py-2 px-4">{classObj.className}</td>
                      <td className="py-2 px-4">{classObj.gradeLevel}</td>
                      <td className="py-2 px-4">{classObj.schoolYear}</td>
                      <td className="py-2 px-4">
                        {classObj.totalStudents ||
                          (classObj.students ? classObj.students.length : 0)}
                      </td>
                      <td className="py-2 px-4 flex space-x-2">
                        <button
                          onClick={() => openAddStudentsModal(classObj)}
                          className="text-green-600 hover:text-green-800 flex items-center"
                          title="Thêm học sinh"
                        >
                          <UserPlus size={18} />
                        </button>
                        <button
                          onClick={() => openRemoveStudentsModal(classObj)}
                          className="text-red-600 hover:text-red-800 flex items-center"
                          title="Xóa học sinh"
                        >
                          <UserMinus size={18} />
                        </button>{" "}
                        <button
                          onClick={() => {
                            setStudentModal({
                              isOpen: true,
                              classId: classObj._id,
                              className: classObj.className,
                              operation: "view",
                              studentIds: "",
                              students: classObj.students || [],
                              loading: false,
                            });
                          }}
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                          title="Xem danh sách học sinh"
                        >
                          <Users size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>{" "}
            <div className="flex justify-between items-center mt-6">
              <div>
                Hiển thị {classes.length} / {pagination.totalClasses} lớp học
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    pagination.currentPage === 1
                      ? "bg-gray-100 text-gray-400"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Trước
                </button>
                <span className="px-3 py-1">
                  Trang {pagination.currentPage} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className={`px-3 py-1 rounded ${
                    pagination.currentPage === pagination.totalPages
                      ? "bg-gray-100 text-gray-400"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Sau
                </button>
              </div>
            </div>
          </>
        )}
      </div>{" "}
      {/* Add Class Dialog */}
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
                      Thêm lớp học mới
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
                        Tên lớp
                      </label>
                      <input
                        type="text"
                        name="className"
                        value={formData.className}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-1 text-sm font-medium">
                        Khối
                      </label>                      <select
                        name="gradeLevel"
                        value={formData.gradeLevel}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Chọn khối</option>
                        <option value="1">Khối 1</option>
                        <option value="2">Khối 2</option>
                        <option value="3">Khối 3</option>
                        <option value="4">Khối 4</option>
                        <option value="5">Khối 5</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-1 text-sm font-medium">
                        Năm học
                      </label>
                      <input
                        type="text"
                        name="schoolYear"
                        value={formData.schoolYear}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="VD: 2024-2025"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-1 text-sm font-medium">
                        Mô tả
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                      ></textarea>
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
                        ) : (
                          "Tạo lớp học"
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
      {/* Student Modal */}
      <Transition appear show={studentModal.isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeStudentModal}>
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
                      {studentModal.operation === "add"
                        ? "Thêm học sinh vào lớp"
                        : studentModal.operation === "remove"
                        ? "Xóa học sinh khỏi lớp"
                        : "Danh sách học sinh"}{" "}
                      {studentModal.className}
                    </Dialog.Title>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500"
                      onClick={closeStudentModal}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {studentModal.operation === "view" ? (
                    <div>
                      {" "}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">
                          Danh sách học sinh ({studentModal.students.length})
                        </h4>
                        {studentModal.students.length === 0 ? (
                          <p className="text-gray-500 italic">
                            Không có học sinh nào trong lớp
                          </p>
                        ) : (
                          <ul className="border rounded-md divide-y max-h-60 overflow-y-auto">
                            {studentModal.students.map((student) => (
                              <li
                                key={student._id}
                                className="px-3 py-2 flex justify-between items-center"
                              >
                                <span>{student.fullName}</span>
                                <span className="text-sm text-gray-500">
                                  {student._id}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className="mt-6 flex justify-end">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={closeStudentModal}
                        >
                          Đóng
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleStudentOperation}>
                      <div className="mb-4">
                        <label className="block text-gray-700 mb-2 text-sm font-medium">
                          ID học sinh (phân cách bằng dấu phẩy)
                        </label>
                        <textarea
                          name="studentIds"
                          value={studentModal.studentIds}
                          onChange={handleStudentModalInputChange}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows="3"
                          placeholder="VD: 6857dc30369551d37ca86e13, 6857dc30369551d37ca86e14"
                          required
                        ></textarea>
                        <p className="text-sm text-gray-500 mt-1">
                          Nhập danh sách ID học sinh, phân cách bằng dấu phẩy
                        </p>
                      </div>{" "}
                      {studentModal.operation === "remove" &&
                        studentModal.students.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-700 mb-2">
                              Học sinh hiện tại
                            </h4>
                            <ul className="border rounded-md divide-y text-sm max-h-40 overflow-y-auto">
                              {studentModal.students.map((student) => (
                                <li
                                  key={student._id}
                                  className="px-3 py-1.5 flex justify-between items-center"
                                >
                                  <span>{student.fullName}</span>
                                  <span className="text-xs text-gray-500">
                                    {student._id}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={closeStudentModal}
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                            studentModal.operation === "add"
                              ? "bg-green-600 hover:bg-green-700 focus-visible:ring-green-500"
                              : "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500"
                          }`}
                          disabled={studentModal.loading}
                        >
                          {studentModal.loading ? (
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
                          ) : studentModal.operation === "add" ? (
                            "Thêm học sinh"
                          ) : (
                            "Xóa học sinh"
                          )}
                        </button>
                      </div>
                    </form>
                  )}
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

export default ClassManagement;

import React, { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Calendar,
  FileText,
  Eye,
  Edit,
  Plus,
  AlertCircle,
  X,
  Check,
} from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { useHealthProfiles } from "../../libs/contexts/HealthProfileContext";
import {
  getMyChildren,
  claimStudentByCode,
} from "../../libs/api/parentService";

const ParentHealthProfiles = () => {
  const {
    loading: contextLoading,
    currentParent,
    getCurrentParentProfiles,
  } = useHealthProfiles();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("myChildren");
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [invitedCode, setInvitedCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogError, setDialogError] = useState("");
  const [claimedStudent, setClaimedStudent] = useState(null);

  // Fetch student data from API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await getMyChildren();
        console.log("Fetched students:", response);

        if (response.success && response.students) {
          setStudents(response.students);
        } else {
          setStudents([]);
        }
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Không thể tải danh sách học sinh. Vui lòng thử lại sau.");
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Handle opening the code input dialog
  const handleOpenDialog = () => {
    setInvitedCode("");
    setDialogError("");
    setIsDialogOpen(true);
  };

  // Handle claiming a student with the code
  const handleClaimStudent = async () => {
    if (!invitedCode.trim()) {
      setDialogError("Vui lòng nhập mã liên kết");
      return;
    }

    try {
      setIsSubmitting(true);
      setDialogError("");

      const response = await claimStudentByCode(invitedCode);

      if (response.success && response.data) {
        setClaimedStudent(response.data);
        setIsDialogOpen(false);
        window.location.reload()

        // Navigate to the profile form with the claimed student data
        // navigate("/health-profile/new", {
        //   state: {
        //     claimedStudent: response.data,
        //   },
        // });
      } else {
        setDialogError(
          response.message ||
          "Không thể liên kết học sinh. Vui lòng kiểm tra lại mã."
        );
      }
    } catch (err) {
      console.error("Error claiming student:", err);
      setDialogError(
        err.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại sau."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Use the transformed profiles from context or the direct API data
  const myChildrenProfiles =
    students.length > 0
      ? students.map((student) => ({
        id: student._id,
        studentInfo: {
          studentId: student._id,
          studentName: student.fullName,
          class: student.classId ? student.classId.className : "N/A",
          dateOfBirth: new Date(student.dateOfBirth).toLocaleDateString(
            "vi-VN"
          ),
          gender:
            student.gender === "MALE"
              ? "Nam"
              : student.gender === "FEMALE"
                ? "Nữ"
                : "Khác",
        },
        status: student.status,
      }))
      : getCurrentParentProfiles();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <FileText className="mr-2 text-primary" size={24} />
              Hồ Sơ Sức Khỏe Học Sinh
            </h1>
            <p className="text-gray-600 mt-1">
              {currentParent
                ? `Xin chào, ${currentParent.name}. Quản lý hồ sơ sức khỏe của ${myChildrenProfiles.length} học sinh.`
                : "Xem và quản lý hồ sơ sức khỏe của con bạn"}
            </p>{" "}
          </div>
          <button
            onClick={handleOpenDialog}
            className="cursor-pointer px-4 py-2 bg-primary text-white rounded-md flex items-center hover:bg-primary-dark"
          >
            <Plus className="w-4 h-4 mr-2" /> Thêm Hồ sơ bé
          </button>
        </div>
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("myChildren")}
              className={`py-3 px-1 ${activeTab === "myChildren"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } font-medium text-sm`}
            >
              Tất cả hồ sơ ({myChildrenProfiles.length})
            </button>
          </nav>
        </div>
        {/* Danh sách hồ sơ */}
        {loading || contextLoading ? (
          <div className="py-8 text-center text-gray-500">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
            <div className="mt-2">Đang tải dữ liệu...</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            <AlertCircle className="inline-block h-5 w-5 mr-2" />
            {error}
          </div>
        ) : myChildrenProfiles.length === 0 ? (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-md">
            <AlertCircle className="inline-block h-5 w-5 mr-2" />
            Bạn chưa có hồ sơ sức khỏe nào cho con. Vui lòng tạo hồ sơ mới.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myChildrenProfiles.map((profile) => (
              <div
                key={profile.id}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h3 className="font-semibold text-lg">
                    {profile.studentInfo.studentName}
                  </h3>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">
                        Ngày sinh: {profile.studentInfo.dateOfBirth}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <FileText className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">
                        Lớp: {profile.studentInfo.class}
                      </span>
                    </div>
                    {profile.studentInfo.gender && (
                      <div className="flex items-center text-sm">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">
                          Giới tính: {profile.studentInfo.gender}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mt-3">
                      {profile.hasAllergies && (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                          Dị ứng
                        </span>
                      )}
                      {profile.hasChronicConditions && (
                        <span className="px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full">
                          Bệnh mãn tính
                        </span>
                      )}
                      {profile.status === "ACTIVE" && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          Đang học
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end mt-4 pt-3 border-t">
                    <button
                      onClick={() =>
                        navigate(`/health-profile/${profile.id}`, {
                          state: { studentInfo: profile.studentInfo },
                        })
                      }
                      className="cursor-pointer text-blue-600 hover:text-blue-800 mr-4 flex items-center text-sm"
                    >
                      <Eye className="w-4 h-4 mr-1" /> Xem chi tiết
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/health-profile/${profile.id}/edit`, {
                          state: { studentInfo: profile.studentInfo },
                        })
                      }
                      className="cursor-pointer text-indigo-600 hover:text-indigo-800 flex items-center text-sm"
                    >
                      <Edit className="w-4 h-4 mr-1" /> Cập nhật Hồ sơ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Thông tin tài khoản phụ huynh */}
        {currentParent && (
          <div className="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
              <User className="w-4 h-4 mr-1" />
              Thông tin tài khoản
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Họ tên phụ huynh:</p>
                <p className="font-medium">{currentParent.name}</p>
              </div>
              <div>
                <p className="text-gray-500">Số điện thoại:</p>
                <p className="font-medium">{currentParent.contactNumber}</p>
              </div>
              <div>
                <p className="text-gray-500">Email:</p>
                <p className="font-medium">{currentParent.email}</p>
              </div>
              <div>
                <p className="text-gray-500">Số lượng hồ sơ quản lý:</p>
                <p className="font-medium">
                  {currentParent.children.length} học sinh
                </p>
              </div>
            </div>
          </div>
        )}
        {/* Hướng dẫn */}
        <div className="mt-8 p-4 border border-blue-200 rounded-md bg-blue-50">
          <h3 className="font-semibold text-blue-800 mb-2">Hướng dẫn</h3>
          <p className="text-sm text-blue-700 mb-2">
            Hồ sơ sức khỏe học sinh giúp nhà trường nắm được tình trạng sức khỏe
            của con bạn để có thể hỗ trợ kịp thời khi cần thiết.
          </p>
          <p className="text-sm text-blue-700">
            Vui lòng cung cấp thông tin chính xác và cập nhật khi có thay đổi.
          </p>
        </div>
      </div>

      {/* Dialog for entering invitation code */}
      <Transition appear show={isDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsDialogOpen(false)}
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
            <div className="fixed inset-0 bg-gray-200 bg-opacity-50" />
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
                      Nhập mã liên kết học sinh
                    </Dialog.Title>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-4">
                      Vui lòng nhập mã liên kết được cung cấp bởi nhà trường để
                      kết nối với hồ sơ học sinh của con bạn.
                    </p>

                    <div className="mb-4">
                      <label
                        htmlFor="invitedCode"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Mã liên kết
                      </label>
                      <input
                        type="text"
                        id="invitedCode"
                        value={invitedCode}
                        onChange={(e) => setInvitedCode(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Nhập mã 6 chữ số"
                      />
                    </div>

                    {dialogError && (
                      <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                        <AlertCircle className="inline-block h-4 w-4 mr-1" />
                        {dialogError}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      className="cursor-pointer px-3 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      className={`cursor-pointer px-3 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                        }`}
                      onClick={handleClaimStudent}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Xác nhận
                        </>
                      )}
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

export default ParentHealthProfiles;

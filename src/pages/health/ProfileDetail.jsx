import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Printer,
  Download,
  Calendar,
  User,
  Phone,
  Clock,
  Heart,
  AlertCircle,
  Eye,
  Ear,
  Syringe,
  Edit,
  FileText,
  School,
} from "lucide-react";
import { getStudentHealthProfile } from "../../libs/api/parentService";
import { useAuth } from "../../libs/contexts/AuthContext";

const ParentHealthProfileDetail = () => {
  const { profileId } = useParams();
  console.log("Profile ID from URL:", profileId); // For debugging

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("allergies");
  const [error, setError] = useState("");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const { user } = useAuth();
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!profileId) return;

      setLoading(true);
      try {
        const response = await getStudentHealthProfile(profileId);
        console.log("API Response:", response); // For debugging
        if (response.success) {
          // Format the API response into our local profile structure
          const formattedProfile = formatProfileData(response.data);
          setProfile(formattedProfile);
        } else {
          setError(response.message || "Không thể tải hồ sơ sức khỏe");
        }
      } catch (error) {
        console.error("Error fetching health profile:", error);
        setError(
          error.response?.data?.message ||
            "Đã xảy ra lỗi khi tải hồ sơ. Vui lòng thử lại sau."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [profileId]);
  // Format API response to match our UI structure
  const formatProfileData = (apiData) => {
    // Basic structure for the profile
    return {
      id: apiData._id,
      studentInfo: {
        studentId:
          apiData.studentId?._id || apiData.studentId || "Chưa có thông tin",
        studentName:
          apiData.studentName ||
          apiData.studentId?.fullName ||
          "Chưa có thông tin",
        class:
          apiData.className ||
          apiData.studentId?.class?.name ||
          "Chưa có thông tin",
        dateOfBirth:
          apiData.dateOfBirth ||
          (apiData.studentId?.dateOfBirth
            ? new Date(apiData.studentId.dateOfBirth).toLocaleDateString(
                "vi-VN"
              )
            : "Chưa có thông tin"),
        parentName: user?.username || "Chưa có thông tin",
        contactNumber: user?.phone || "Chưa có thông tin",
        relationship: user?.relationship || "parent",
      },
      healthInfo: {
        allergies: apiData.allergies || [],
        chronicConditions: apiData.chronicConditions || [],
        medicalHistory: apiData.medicalHistory || [],
        visionHistory: apiData.visionHistory || [],
        hearingHistory: apiData.hearingHistory || [],
        vaccines: apiData.vaccines || [],
      },
      status: apiData.status || "complete",
      lastUpdated: apiData.updatedAt
        ? new Date(apiData.updatedAt).toLocaleDateString("vi-VN")
        : "Chưa có thông tin",
      createdBy:
        apiData.createdBy?.username || user?.username || "Chưa có thông tin",
    };
  };

  // Xử lý in hồ sơ
  const handlePrint = () => {
    window.print();
  };

  // Xử lý xuất PDF (mô phỏng)
  const handleExportPDF = () => {
    setIsGeneratingPdf(true);
    // Giả lập thời gian tạo PDF
    setTimeout(() => {
      setIsGeneratingPdf(false);
      alert("Tệp PDF đã được tạo và tải xuống!");
    }, 2000);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8 max-w-6xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <span className="ml-3 text-gray-700">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 max-w-6xl">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <AlertCircle className="inline-block mr-2" />
          {error}
        </div>
        <div className="mt-4">
          <button
            onClick={() => navigate("/health-profiles")}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Quay lại danh sách hồ sơ
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }
  const getTabContent = () => {
    if (!profile) return null;

    switch (activeTab) {
      case "allergies":
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">
              Thông tin dị ứng
            </h2>
            {!profile.healthInfo.allergies ||
            profile.healthInfo.allergies.length === 0 ? (
              <div className="p-4 bg-gray-50 rounded-md text-gray-500">
                Không có thông tin dị ứng
              </div>
            ) : (
              profile.healthInfo.allergies.map((allergy, index) => (
                <div key={index} className="p-4 border rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Loại dị ứng</p>
                      <p>{allergy.type || "Không có thông tin"}</p>
                    </div>
                    <div>
                      <p className="font-medium">Phản ứng</p>
                      <p>{allergy.reaction || "Không có thông tin"}</p>
                    </div>
                    <div>
                      <p className="font-medium">Mức độ nghiêm trọng</p>
                      <p>
                        {allergy.severity === "mild" ||
                        allergy.severity === "Mild"
                          ? "Nhẹ"
                          : allergy.severity === "medium" ||
                            allergy.severity === "Medium"
                          ? "Trung bình"
                          : allergy.severity === "severe" ||
                            allergy.severity === "Severe"
                          ? "Nghiêm trọng"
                          : allergy.severity || "Không có thông tin"}
                      </p>
                    </div>
                    {allergy.notes && (
                      <div className="md:col-span-2">
                        <p className="font-medium">Ghi chú</p>
                        <p>{allergy.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        );
      case "chronic":
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">
              Thông tin bệnh mãn tính
            </h2>
            {!profile.healthInfo.chronicConditions ||
            profile.healthInfo.chronicConditions.length === 0 ? (
              <div className="p-4 bg-gray-50 rounded-md text-gray-500">
                Không có thông tin bệnh mãn tính
              </div>
            ) : (
              profile.healthInfo.chronicConditions.map((condition, index) => (
                <div key={index} className="p-4 border rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Tên bệnh</p>
                      <p>{condition.conditionName || "Không có thông tin"}</p>
                    </div>
                    <div>
                      <p className="font-medium">Thời gian chẩn đoán</p>
                      <p>
                        {condition.diagnosedDate
                          ? new Date(
                              condition.diagnosedDate
                            ).toLocaleDateString("vi-VN")
                          : "Không có thông tin"}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Thuốc điều trị</p>
                      <p>{condition.medication || "Không có thông tin"}</p>
                    </div>
                    {condition.notes && (
                      <div className="md:col-span-2">
                        <p className="font-medium">Ghi chú</p>
                        <p>{condition.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        );
      case "medical":
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">
              Tiền sử điều trị
            </h2>
            {!profile.healthInfo.medicalHistory ||
            profile.healthInfo.medicalHistory.length === 0 ? (
              <div className="p-4 bg-gray-50 rounded-md text-gray-500">
                Không có thông tin tiền sử điều trị
              </div>
            ) : (
              profile.healthInfo.medicalHistory.map((history, index) => (
                <div key={index} className="p-4 border rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Tình trạng / Bệnh</p>
                      <p>{history.condition || "Không có thông tin"}</p>
                    </div>
                    <div>
                      <p className="font-medium">Bệnh viện / Cơ sở y tế</p>
                      <p>{history.facility || "Không có thông tin"}</p>
                    </div>
                    <div>
                      <p className="font-medium">Ngày điều trị</p>
                      <p>
                        {history.treatmentDate
                          ? new Date(history.treatmentDate).toLocaleDateString(
                              "vi-VN"
                            )
                          : "Không có thông tin"}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Phương pháp điều trị</p>
                      <p>{history.method || "Không có thông tin"}</p>
                    </div>
                    {history.notes && (
                      <div className="md:col-span-2">
                        <p className="font-medium">Ghi chú</p>
                        <p>{history.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        );
      case "vision":
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">
              Thông tin thị lực
            </h2>
            {!profile.healthInfo.visionHistory ||
            profile.healthInfo.visionHistory.length === 0 ? (
              <div className="p-4 bg-gray-50 rounded-md text-gray-500">
                Không có thông tin thị lực
              </div>
            ) : (
              profile.healthInfo.visionHistory.map((vision, index) => (
                <div key={index} className="p-4 border rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Ngày kiểm tra</p>
                      <p>
                        {vision.checkupDate
                          ? new Date(vision.checkupDate).toLocaleDateString(
                              "vi-VN"
                            )
                          : "Không có thông tin"}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Thị lực mắt phải</p>
                      <p>{vision.rightEyeVision || "Không có thông tin"}</p>
                    </div>
                    <div>
                      <p className="font-medium">Thị lực mắt trái</p>
                      <p>{vision.leftEyeVision || "Không có thông tin"}</p>
                    </div>
                    <div>
                      <p className="font-medium">Đeo kính</p>
                      <p>{vision.wearsGlasses ? "Có" : "Không"}</p>
                    </div>
                    <div>
                      <p className="font-medium">Mù màu</p>
                      <p>{vision.isColorblind ? "Có" : "Không"}</p>
                    </div>
                    {vision.notes && (
                      <div className="md:col-span-2">
                        <p className="font-medium">Ghi chú</p>
                        <p>{vision.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        );
      case "hearing":
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">
              Thông tin thính lực
            </h2>
            {!profile.healthInfo.hearingHistory ||
            profile.healthInfo.hearingHistory.length === 0 ? (
              <div className="p-4 bg-gray-50 rounded-md text-gray-500">
                Không có thông tin thính lực
              </div>
            ) : (
              profile.healthInfo.hearingHistory.map((hearing, index) => (
                <div key={index} className="p-4 border rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Ngày kiểm tra</p>
                      <p>
                        {hearing.checkupDate
                          ? new Date(hearing.checkupDate).toLocaleDateString(
                              "vi-VN"
                            )
                          : "Không có thông tin"}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Tình trạng tai phải</p>
                      <p>{hearing.rightEarStatus || "Không có thông tin"}</p>
                    </div>
                    <div>
                      <p className="font-medium">Tình trạng tai trái</p>
                      <p>{hearing.leftEarStatus || "Không có thông tin"}</p>
                    </div>
                    <div>
                      <p className="font-medium">Sử dụng thiết bị trợ thính</p>
                      <p>{hearing.usesHearingAid ? "Có" : "Không"}</p>
                    </div>
                    {hearing.notes && (
                      <div className="md:col-span-2">
                        <p className="font-medium">Ghi chú</p>
                        <p>{hearing.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        );
      case "vaccination":
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">
              Lịch sử tiêm chủng
            </h2>
            {!profile.healthInfo.vaccines ||
            profile.healthInfo.vaccines.length === 0 ? (
              <div className="p-4 bg-gray-50 rounded-md text-gray-500">
                Không có thông tin tiêm chủng
              </div>
            ) : (
              profile.healthInfo.vaccines.map((vaccine, index) => (
                <div key={index} className="p-4 border rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Tên vắc-xin</p>
                      <p>{vaccine.vaccineName || "Không có thông tin"}</p>
                    </div>
                    <div>
                      <p className="font-medium">Mũi số</p>
                      <p>{vaccine.doseNumber || "1"}</p>
                    </div>
                    <div>
                      <p className="font-medium">Ngày tiêm</p>
                      <p>
                        {vaccine.dateInjected
                          ? new Date(vaccine.dateInjected).toLocaleDateString(
                              "vi-VN"
                            )
                          : "Không có thông tin"}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Địa điểm tiêm</p>
                      <p>{vaccine.locationInjected || "Không có thông tin"}</p>
                    </div>
                    {vaccine.note && (
                      <div className="md:col-span-2">
                        <p className="font-medium">Ghi chú</p>
                        <p>{vaccine.note}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl" id="print-area">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Tiêu đề và nút điều hướng */}
        <div className="flex justify-between items-center border-b pb-4 mb-6 print:border-none">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/health-profiles")}
              className="mr-4 text-gray-600 hover:text-primary print:hidden"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <FileText className="mr-2 text-primary" size={24} />
                Hồ sơ sức khỏe: {profile.studentInfo.studentName}
              </h1>
              <p className="text-gray-600 mt-1">
                Mã số: {profile.id} | Lớp: {profile.studentInfo.class}
              </p>
            </div>
          </div>
          <div className="flex space-x-2 print:hidden">
            <button
              onClick={handlePrint}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
              disabled={isGeneratingPdf}
            >
              <Printer className="w-4 h-4 mr-2" /> In hồ sơ
            </button>
            <button
              onClick={handleExportPDF}
              className="px-3 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center"
              disabled={isGeneratingPdf}
            >
              {isGeneratingPdf ? (
                <>
                  <div className="w-4 h-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  Đang tạo PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" /> Xuất PDF
                </>
              )}
            </button>
            <button
              onClick={() => navigate(`/health-profile/${profile.id}/edit`)}
              className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
            >
              <Edit className="w-4 h-4 mr-2" /> Chỉnh sửa
            </button>
          </div>
        </div>
        {/* Thông tin học sinh */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">
              Thông tin học sinh
            </h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <User className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Học sinh</p>
                  <p>{profile.studentInfo.studentName}</p>
                </div>
              </div>
              <div className="flex items-start">
                <FileText className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Mã số học sinh</p>
                  <p>{profile.studentInfo.studentId}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Ngày sinh</p>
                  <p>{profile.studentInfo.dateOfBirth}</p>
                </div>
              </div>
              <div className="flex items-start">
                <School className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Lớp</p>
                  <p>{profile.studentInfo.class}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">
              Thông tin phụ huynh
            </h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <User className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Phụ huynh</p>
                  <p>{profile.studentInfo.parentName}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Số điện thoại</p>
                  <p>{profile.studentInfo.contactNumber}</p>
                </div>
              </div>
              <div className="flex items-start">
                <User className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Mối quan hệ</p>
                  <p>
                    {profile.studentInfo.relationship === "father"
                      ? "Bố"
                      : profile.studentInfo.relationship === "mother"
                      ? "Mẹ"
                      : profile.studentInfo.relationship === "guardian"
                      ? "Người giám hộ"
                      : profile.studentInfo.relationship}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Cập nhật lần cuối</p>
                  <p>{profile.lastUpdated}</p>
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
        {/* Tabs điều hướng */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-4 overflow-x-auto print:hidden">
            <button
              onClick={() => setActiveTab("allergies")}
              className={`py-2 px-3 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "allergies"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <AlertCircle className="w-4 h-4 inline mr-1" /> Dị ứng
            </button>
            <button
              onClick={() => setActiveTab("chronic")}
              className={`py-2 px-3 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "chronic"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Heart className="w-4 h-4 inline mr-1" /> Bệnh mãn tính
            </button>
            <button
              onClick={() => setActiveTab("medical")}
              className={`py-2 px-3 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "medical"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <FileText className="w-4 h-4 inline mr-1" /> Tiền sử điều trị
            </button>
            <button
              onClick={() => setActiveTab("vision")}
              className={`py-2 px-3 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "vision"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Eye className="w-4 h-4 inline mr-1" /> Thị lực
            </button>
            <button
              onClick={() => setActiveTab("hearing")}
              className={`py-2 px-3 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "hearing"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Ear className="w-4 h-4 inline mr-1" /> Thính lực
            </button>
            <button
              onClick={() => setActiveTab("vaccination")}
              className={`py-2 px-3 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "vaccination"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Syringe className="w-4 h-4 inline mr-1" /> Tiêm chủng
            </button>
          </nav>
        </div>
        {/* Nội dung tab */}
        <div className="mb-6">{getTabContent()}</div>
        {/* Chú thích và thông tin bổ sung */}
        <div className="mt-8 p-4 border border-blue-200 rounded-md bg-blue-50">
          <h3 className="font-semibold text-blue-800 mb-2">Lưu ý</h3>
          <p className="text-sm text-blue-700 mb-2">
            Thông tin này được sử dụng để hỗ trợ chăm sóc sức khỏe cho học sinh
            trong trường hợp cần thiết.
          </p>
          <p className="text-sm text-blue-700">
            Vui lòng cập nhật thông tin khi có bất kỳ thay đổi nào về tình trạng
            sức khỏe của học sinh.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ParentHealthProfileDetail;

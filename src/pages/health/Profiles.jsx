import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Calendar,
  FileText,
  Eye,
  Edit,
  Plus,
  AlertCircle,
} from "lucide-react";
import { useHealthProfiles } from "../../libs/contexts/HealthProfileContext";

const ParentHealthProfiles = () => {
  const { loading, currentParent, getCurrentParentProfiles } =
    useHealthProfiles();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("myChildren");

  // Lấy danh sách hồ sơ của con của phụ huynh đang đăng nhập
  const myChildrenProfiles = getCurrentParentProfiles();

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
            </p>
          </div>
          <button
            onClick={() => navigate("/health-profile/new")}
            className="px-4 py-2 bg-primary text-white rounded-md flex items-center hover:bg-primary-dark"
          >
            <Plus className="w-4 h-4 mr-2" /> Tạo hồ sơ mới
          </button>
        </div>{" "}
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("myChildren")}
              className={`py-3 px-1 ${
                activeTab === "myChildren"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } font-medium text-sm`}
            >
              Tất cả hồ sơ ({myChildrenProfiles.length})
            </button>
          </nav>
        </div>
        {/* Danh sách hồ sơ */}
        {loading ? (
          <div className="py-8 text-center text-gray-500">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
            <div className="mt-2">Đang tải dữ liệu...</div>
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
                  <p className="text-sm text-gray-600">Mã số: {profile.id}</p>
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
                    </div>
                  </div>

                  <div className="flex justify-end mt-4 pt-3 border-t">
                    <button
                      onClick={() => navigate(`/health-profile/${profile.id}`)}
                      className="text-blue-600 hover:text-blue-800 mr-4 flex items-center text-sm"
                    >
                      <Eye className="w-4 h-4 mr-1" /> Xem chi tiết
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/health-profile/${profile.id}/edit`)
                      }
                      className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm"
                    >
                      <Edit className="w-4 h-4 mr-1" /> Chỉnh sửa
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
    </div>
  );
};

export default ParentHealthProfiles;

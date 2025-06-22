import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  FileText,
  Heart,
  Eye,
  Ear,
  Syringe,
  Calendar,
  Save,
  Plus,
  ArrowLeft,
  User,
  School,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useHealthProfiles } from "../../libs/contexts/HealthProfileContext";

const ParentHealthProfileForm = () => {
  const [activeTab, setActiveTab] = useState("basic");
  const [studentInfo, setStudentInfo] = useState({
    studentId: "",
    studentName: "",
    class: "",
    dateOfBirth: "",
    parentName: "",
    contactNumber: "",
    relationship: "father",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [healthInfo, setHealthInfo] = useState({
    allergies: [{ type: "", reaction: "", severity: "medium", notes: "" }],
    chronicConditions: [
      { condition: "", diagnosis: "", medication: "", notes: "" },
    ],
    medicalHistory: [
      { condition: "", hospital: "", date: "", treatment: "", notes: "" },
    ],
    vision: {
      rightEye: "",
      leftEye: "",
      wearGlasses: false,
      colorBlindness: false,
      notes: "",
    },
    hearing: { rightEar: "", leftEar: "", hearingAid: false, notes: "" },
    vaccinations: [{ name: "", date: "", location: "", notes: "" }],
  });

  const { profileId } = useParams();
  const navigate = useNavigate();
  const { getProfileById, addHealthProfile, updateHealthProfile } =
    useHealthProfiles();

  // Giả lập dữ liệu người dùng hiện tại
  const currentUser = {
    id: "PH001",
    name: "Nguyễn Văn Bình",
    phone: "0912345678",
  };

  // Tải thông tin hồ sơ nếu đang ở chế độ chỉnh sửa
  useEffect(() => {
    if (profileId && profileId !== "new") {
      setIsEditing(true);
      const profile = getProfileById(profileId);

      if (profile) {
        setStudentInfo(profile.studentInfo);
        setHealthInfo(profile.healthInfo);
      } else {
        setErrorMessage("Không tìm thấy hồ sơ với ID đã cung cấp");
      }
    } else {
      // Điền sẵn thông tin phụ huynh nếu đang tạo mới
      setStudentInfo((prev) => ({
        ...prev,
        parentName: currentUser.name,
        contactNumber: currentUser.phone,
      }));
    }
  }, [profileId, getProfileById]);

  const handleStudentInfoChange = (e) => {
    const { name, value } = e.target;
    setStudentInfo({
      ...studentInfo,
      [name]: value,
    });
  };

  const handleHealthInfoChange = (category, index, field, value) => {
    if (category === "vision" || category === "hearing") {
      setHealthInfo({
        ...healthInfo,
        [category]: {
          ...healthInfo[category],
          [field]: value,
        },
      });
    } else {
      const updatedItems = [...healthInfo[category]];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      };

      setHealthInfo({
        ...healthInfo,
        [category]: updatedItems,
      });
    }
  };

  const addItemToCategory = (category) => {
    const newItems = [...healthInfo[category]];

    if (category === "allergies") {
      newItems.push({ type: "", reaction: "", severity: "medium", notes: "" });
    } else if (category === "chronicConditions") {
      newItems.push({
        condition: "",
        diagnosis: "",
        medication: "",
        notes: "",
      });
    } else if (category === "medicalHistory") {
      newItems.push({
        condition: "",
        hospital: "",
        date: "",
        treatment: "",
        notes: "",
      });
    } else if (category === "vaccinations") {
      newItems.push({ name: "", date: "", location: "", notes: "" });
    }

    setHealthInfo({
      ...healthInfo,
      [category]: newItems,
    });
  };

  const handleCheckboxChange = (category, field) => {
    setHealthInfo({
      ...healthInfo,
      [category]: {
        ...healthInfo[category],
        [field]: !healthInfo[category][field],
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      // Kiểm tra các trường bắt buộc
      if (
        !studentInfo.studentId ||
        !studentInfo.studentName ||
        !studentInfo.class ||
        !studentInfo.dateOfBirth ||
        !studentInfo.parentName
      ) {
        setErrorMessage("Vui lòng điền đầy đủ thông tin học sinh");
        setActiveTab("basic");
        return;
      }

      // Tạo đối tượng dữ liệu
      const hasAllergies =
        healthInfo.allergies.length > 0 && healthInfo.allergies[0].type !== "";
      const hasChronicConditions =
        healthInfo.chronicConditions.length > 0 &&
        healthInfo.chronicConditions[0].condition !== "";

      const profileData = {
        id: isEditing ? profileId : `HS${Date.now().toString().slice(-6)}`,
        studentInfo,
        healthInfo,
        status: "complete",
        lastUpdated: new Date().toISOString().split("T")[0],
        createdBy: studentInfo.parentName,
        hasAllergies,
        hasChronicConditions,
      };

      // Lưu dữ liệu
      if (isEditing) {
        updateHealthProfile(profileId, profileData);
        setSuccessMessage("Hồ sơ sức khỏe đã được cập nhật thành công!");
      } else {
        addHealthProfile(profileData);
        setSuccessMessage("Hồ sơ sức khỏe đã được tạo mới thành công!");
      }

      // Hiển thị thông báo thành công
      setTimeout(() => {
        navigate("/health-profiles");
      }, 2000);
    } catch (error) {
      console.error("Lỗi khi lưu hồ sơ:", error);
      setErrorMessage("Đã xảy ra lỗi khi lưu hồ sơ. Vui lòng thử lại sau.");
    }
  };

  const TabButton = ({ id, label, icon }) => (
    <button
      type="button"
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium ${
        activeTab === id
          ? "bg-primary text-white"
          : "bg-white text-gray-700 hover:bg-gray-100"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/health-profiles")}
              className="flex items-center text-gray-600 hover:text-primary mr-5"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
            </button>
            <div className="flex-grow">
              <h1 className="text-2xl font-bold text-gray-800">
                {isEditing ? "Chỉnh Sửa" : "Khai Báo"} Hồ Sơ Sức Khỏe Học Sinh
              </h1>
              <p className="text-gray-600 mt-1">
                Vui lòng cung cấp thông tin chi tiết và chính xác về sức khỏe của
                con bạn để nhà trường có thể hỗ trợ tốt nhất.
              </p>
            </div>
          </div>
        </div>

        {/* Thông báo thành công/lỗi */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Tabs điều hướng */}
          <div className="flex flex-wrap gap-2 mb-6">
            <TabButton
              id="basic"
              label="Thông tin cơ bản"
              icon={<User size={18} />}
            />
            <TabButton
              id="allergies"
              label="Dị ứng"
              icon={<AlertCircle size={18} />}
            />
            <TabButton
              id="chronic"
              label="Bệnh mãn tính"
              icon={<Heart size={18} />}
            />
            <TabButton
              id="medical"
              label="Tiền sử điều trị"
              icon={<FileText size={18} />}
            />
            <TabButton id="vision" label="Thị lực" icon={<Eye size={18} />} />
            <TabButton
              id="vaccination"
              label="Tiêm chủng"
              icon={<Syringe size={18} />}
            />
          </div>

          {/* Thông tin học sinh - Tab cơ bản */}
          {activeTab === "basic" && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <User className="mr-2 text-primary" size={20} />
                  Thông tin học sinh
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mã số học sinh <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="studentId"
                      value={studentInfo.studentId}
                      onChange={handleStudentInfoChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên học sinh <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="studentName"
                      value={studentInfo.studentName}
                      onChange={handleStudentInfoChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lớp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="class"
                      value={studentInfo.class}
                      onChange={handleStudentInfoChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày sinh <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={studentInfo.dateOfBirth}
                      onChange={handleStudentInfoChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <User className="mr-2 text-primary" size={20} />
                  Thông tin phụ huynh
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên phụ huynh <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="parentName"
                      value={studentInfo.parentName}
                      onChange={handleStudentInfoChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại liên hệ{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={studentInfo.contactNumber}
                      onChange={handleStudentInfoChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mối quan hệ với học sinh{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="relationship"
                      value={studentInfo.relationship}
                      onChange={handleStudentInfoChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    >
                      <option value="father">Bố</option>
                      <option value="mother">Mẹ</option>
                      <option value="guardian">Người giám hộ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab dị ứng */}
          {activeTab === "allergies" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <AlertCircle className="mr-2 text-primary" size={20} />
                  Thông tin dị ứng
                </h2>
                <button
                  type="button"
                  onClick={() => addItemToCategory("allergies")}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" /> Thêm dị ứng
                </button>
              </div>

              {healthInfo.allergies.map((allergy, index) => (
                <div key={index} className="mb-6 p-4 border rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Loại dị ứng
                      </label>
                      <input
                        type="text"
                        value={allergy.type}
                        onChange={(e) =>
                          handleHealthInfoChange(
                            "allergies",
                            index,
                            "type",
                            e.target.value
                          )
                        }
                        placeholder="Ví dụ: Thực phẩm, Thuốc, Phấn hoa, ..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phản ứng
                      </label>
                      <input
                        type="text"
                        value={allergy.reaction}
                        onChange={(e) =>
                          handleHealthInfoChange(
                            "allergies",
                            index,
                            "reaction",
                            e.target.value
                          )
                        }
                        placeholder="Ví dụ: Phát ban, Ngứa, Khó thở, ..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mức độ nghiêm trọng
                    </label>
                    <select
                      value={allergy.severity}
                      onChange={(e) =>
                        handleHealthInfoChange(
                          "allergies",
                          index,
                          "severity",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="mild">Nhẹ</option>
                      <option value="medium">Trung bình</option>
                      <option value="severe">Nghiêm trọng</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ghi chú
                    </label>
                    <textarea
                      value={allergy.notes}
                      onChange={(e) =>
                        handleHealthInfoChange(
                          "allergies",
                          index,
                          "notes",
                          e.target.value
                        )
                      }
                      placeholder="Thông tin bổ sung về dị ứng"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      rows="2"
                    ></textarea>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab bệnh mãn tính */}
          {activeTab === "chronic" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Heart className="mr-2 text-primary" size={20} />
                  Bệnh mãn tính
                </h2>
                <button
                  type="button"
                  onClick={() => addItemToCategory("chronicConditions")}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" /> Thêm bệnh mãn tính
                </button>
              </div>

              {healthInfo.chronicConditions.map((condition, index) => (
                <div key={index} className="mb-6 p-4 border rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên bệnh
                      </label>
                      <input
                        type="text"
                        value={condition.condition}
                        onChange={(e) =>
                          handleHealthInfoChange(
                            "chronicConditions",
                            index,
                            "condition",
                            e.target.value
                          )
                        }
                        placeholder="Ví dụ: Hen suyễn, Tiểu đường, ..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thời gian chẩn đoán
                      </label>
                      <input
                        type="text"
                        value={condition.diagnosis}
                        onChange={(e) =>
                          handleHealthInfoChange(
                            "chronicConditions",
                            index,
                            "diagnosis",
                            e.target.value
                          )
                        }
                        placeholder="Ví dụ: Tháng 3/2022"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thuốc điều trị
                    </label>
                    <input
                      type="text"
                      value={condition.medication}
                      onChange={(e) =>
                        handleHealthInfoChange(
                          "chronicConditions",
                          index,
                          "medication",
                          e.target.value
                        )
                      }
                      placeholder="Ví dụ: Ventolin, Insulin, ..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ghi chú
                    </label>
                    <textarea
                      value={condition.notes}
                      onChange={(e) =>
                        handleHealthInfoChange(
                          "chronicConditions",
                          index,
                          "notes",
                          e.target.value
                        )
                      }
                      placeholder="Thông tin bổ sung về bệnh mãn tính"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      rows="2"
                    ></textarea>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab tiền sử điều trị */}
          {activeTab === "medical" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <FileText className="mr-2 text-primary" size={20} />
                  Tiền sử điều trị
                </h2>
                <button
                  type="button"
                  onClick={() => addItemToCategory("medicalHistory")}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" /> Thêm tiền sử
                </button>
              </div>

              {healthInfo.medicalHistory.map((history, index) => (
                <div key={index} className="mb-6 p-4 border rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tình trạng / Bệnh
                      </label>
                      <input
                        type="text"
                        value={history.condition}
                        onChange={(e) =>
                          handleHealthInfoChange(
                            "medicalHistory",
                            index,
                            "condition",
                            e.target.value
                          )
                        }
                        placeholder="Ví dụ: Phẫu thuật ruột thừa, Gãy tay, ..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bệnh viện / Cơ sở y tế
                      </label>
                      <input
                        type="text"
                        value={history.hospital}
                        onChange={(e) =>
                          handleHealthInfoChange(
                            "medicalHistory",
                            index,
                            "hospital",
                            e.target.value
                          )
                        }
                        placeholder="Tên bệnh viện điều trị"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày điều trị
                      </label>
                      <input
                        type="date"
                        value={history.date}
                        onChange={(e) =>
                          handleHealthInfoChange(
                            "medicalHistory",
                            index,
                            "date",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phương pháp điều trị
                      </label>
                      <input
                        type="text"
                        value={history.treatment}
                        onChange={(e) =>
                          handleHealthInfoChange(
                            "medicalHistory",
                            index,
                            "treatment",
                            e.target.value
                          )
                        }
                        placeholder="Ví dụ: Phẫu thuật, Điều trị nội khoa, ..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ghi chú
                    </label>
                    <textarea
                      value={history.notes}
                      onChange={(e) =>
                        handleHealthInfoChange(
                          "medicalHistory",
                          index,
                          "notes",
                          e.target.value
                        )
                      }
                      placeholder="Thông tin bổ sung về tiền sử điều trị"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      rows="2"
                    ></textarea>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab thị lực */}
          {activeTab === "vision" && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Eye className="mr-2 text-primary" size={20} />
                Thị lực
              </h2>

              <div className="mb-6 p-4 border rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thị lực mắt phải
                    </label>
                    <input
                      type="text"
                      value={healthInfo.vision.rightEye}
                      onChange={(e) =>
                        handleHealthInfoChange(
                          "vision",
                          null,
                          "rightEye",
                          e.target.value
                        )
                      }
                      placeholder="Ví dụ: 6/10, 20/20, ..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thị lực mắt trái
                    </label>
                    <input
                      type="text"
                      value={healthInfo.vision.leftEye}
                      onChange={(e) =>
                        handleHealthInfoChange(
                          "vision",
                          null,
                          "leftEye",
                          e.target.value
                        )
                      }
                      placeholder="Ví dụ: 6/9, 20/20, ..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="wearGlasses"
                        checked={healthInfo.vision.wearGlasses}
                        onChange={() =>
                          handleCheckboxChange("vision", "wearGlasses")
                        }
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label
                        htmlFor="wearGlasses"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Đeo kính
                      </label>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="colorBlindness"
                        checked={healthInfo.vision.colorBlindness}
                        onChange={() =>
                          handleCheckboxChange("vision", "colorBlindness")
                        }
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label
                        htmlFor="colorBlindness"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Mù màu
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú
                  </label>
                  <textarea
                    value={healthInfo.vision.notes}
                    onChange={(e) =>
                      handleHealthInfoChange(
                        "vision",
                        null,
                        "notes",
                        e.target.value
                      )
                    }
                    placeholder="Thông tin bổ sung về thị lực"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    rows="2"
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* Tab tiêm chủng */}
          {activeTab === "vaccination" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Syringe className="mr-2 text-primary" size={20} />
                  Tiêm chủng
                </h2>
                <button
                  type="button"
                  onClick={() => addItemToCategory("vaccinations")}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" /> Thêm tiêm chủng
                </button>
              </div>

              {healthInfo.vaccinations.map((vaccination, index) => (
                <div key={index} className="mb-6 p-4 border rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên vắc-xin
                      </label>
                      <input
                        type="text"
                        value={vaccination.name}
                        onChange={(e) =>
                          handleHealthInfoChange(
                            "vaccinations",
                            index,
                            "name",
                            e.target.value
                          )
                        }
                        placeholder="Ví dụ: MMR, COVID-19, ..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày tiêm
                      </label>
                      <input
                        type="date"
                        value={vaccination.date}
                        onChange={(e) =>
                          handleHealthInfoChange(
                            "vaccinations",
                            index,
                            "date",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa điểm tiêm
                    </label>
                    <input
                      type="text"
                      value={vaccination.location}
                      onChange={(e) =>
                        handleHealthInfoChange(
                          "vaccinations",
                          index,
                          "location",
                          e.target.value
                        )
                      }
                      placeholder="Ví dụ: Trung tâm y tế, Bệnh viện, ..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ghi chú
                    </label>
                    <textarea
                      value={vaccination.notes}
                      onChange={(e) =>
                        handleHealthInfoChange(
                          "vaccinations",
                          index,
                          "notes",
                          e.target.value
                        )
                      }
                      placeholder="Ví dụ: Mũi 1, Mũi nhắc lại, ..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      rows="2"
                    ></textarea>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end mt-8 border-t pt-4">
            <button
              type="button"
              onClick={() => navigate("/health-profiles")}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 mr-2"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? "Cập nhật" : "Lưu"} hồ sơ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParentHealthProfileForm;

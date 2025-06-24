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
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { useAuth } from "../../libs/contexts/AuthContext";
import {
  createStudentHealthProfile,
  updateStudentHealthProfile,
  getStudentHealthProfile,
} from "../../libs/api/parentService";

const ParentHealthProfileForm = () => {
  const location = useLocation();
  const { claimedStudent } = location.state || {};

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
      { conditionName: "", diagnosedDate: "", medication: "", notes: "" },
    ],
    medicalHistory: [
      { condition: "", facility: "", treatmentDate: "", method: "", notes: "" },
    ],
    visionHistory: [
      {
        checkupDate: "",
        rightEyeVision: "",
        leftEyeVision: "",
        wearsGlasses: false,
        isColorblind: false,
        notes: "",
      },
    ],
    hearingHistory: [
      {
        checkupDate: "",
        rightEarStatus: "",
        leftEarStatus: "",
        usesHearingAid: false,
        notes: "",
      },
    ],
    vaccines: [
      {
        vaccineName: "",
        doseNumber: 1,
        dateInjected: "",
        locationInjected: "",
        note: "",
      },
    ],
  });
  const { profileId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  console.log("Current User:", user);

  // Tải thông tin hồ sơ nếu đang ở chế độ chỉnh sửa
  useEffect(() => {
    // Check for claimed student data passed from the Profiles page
    const claimedStudent = location.state?.claimedStudent;
    console.log("Claimed Student Data:", claimedStudent);

    if (claimedStudent) {
      // Format the date from ISO format to YYYY-MM-DD for the input field
      const formattedDate = claimedStudent.dateOfBirth
        ? new Date(claimedStudent.dateOfBirth).toISOString().split("T")[0]
        : ""; // Pre-fill the form with claimed student data
      setStudentInfo({
        studentId: claimedStudent._id || "",
        studentName: claimedStudent.fullName || "",
        class: claimedStudent.classId?.className || "",
        dateOfBirth: formattedDate,
        parentName: user?.username || "",
        contactNumber: user?.phone || "",
        relationship: "father",
      });
    } else if (profileId && profileId !== "new") {
      setIsEditing(true);
      const fetchProfileData = async () => {
        try {
          const response = await getStudentHealthProfile(profileId);
          console.log("Fetched profile data:", response);

          if (response.success) {
            const apiData = response.data;

            // Format the date for input field
            const formattedDate = apiData.dateOfBirth
              ? new Date(apiData.dateOfBirth).toISOString().split("T")[0]
              : "";

            // Format student info
            setStudentInfo({
              studentId: apiData.studentId?._id || apiData.studentId,
              studentName:
                apiData.studentName || apiData.studentId?.fullName || "",
              class: apiData.className || apiData.studentId?.class?.name || "",
              dateOfBirth: formattedDate,
              parentName: user?.username || "",
              contactNumber: user?.phone || "",
              relationship: user?.relationship || "father",
            });

            // Format health info
            setHealthInfo({
              allergies:
                apiData.allergies?.length > 0
                  ? apiData.allergies
                  : [{ type: "", reaction: "", severity: "medium", notes: "" }],

              chronicConditions:
                apiData.chronicConditions?.length > 0
                  ? apiData.chronicConditions
                  : [
                      {
                        conditionName: "",
                        diagnosedDate: "",
                        medication: "",
                        notes: "",
                      },
                    ],

              medicalHistory:
                apiData.medicalHistory?.length > 0
                  ? apiData.medicalHistory
                  : [
                      {
                        condition: "",
                        facility: "",
                        treatmentDate: "",
                        method: "",
                        notes: "",
                      },
                    ],

              visionHistory:
                apiData.visionHistory?.length > 0
                  ? apiData.visionHistory
                  : [
                      {
                        checkupDate: "",
                        rightEyeVision: "",
                        leftEyeVision: "",
                        wearsGlasses: false,
                        isColorblind: false,
                        notes: "",
                      },
                    ],

              hearingHistory:
                apiData.hearingHistory?.length > 0
                  ? apiData.hearingHistory
                  : [
                      {
                        checkupDate: "",
                        rightEarStatus: "",
                        leftEarStatus: "",
                        usesHearingAid: false,
                        notes: "",
                      },
                    ],

              vaccines:
                apiData.vaccines?.length > 0
                  ? apiData.vaccines
                  : [
                      {
                        vaccineName: "",
                        doseNumber: 1,
                        dateInjected: "",
                        locationInjected: "",
                        note: "",
                      },
                    ],
            });
          } else {
            setErrorMessage(
              response.message || "Không tìm thấy hồ sơ với ID đã cung cấp"
            );
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          setErrorMessage(
            error.response?.data?.message ||
              "Đã xảy ra lỗi khi tải hồ sơ. Vui lòng thử lại sau."
          );
        }
      };

      fetchProfileData();
    } else {
      // Điền sẵn thông tin phụ huynh nếu đang tạo mới
      setStudentInfo((prev) => ({
        ...prev,
        parentName: user?.username || "",
        contactNumber: user?.phone || "",
      }));
    }
  }, [profileId, location.state, user]);

  const handleStudentInfoChange = (e) => {
    const { name, value } = e.target;
    setStudentInfo({
      ...studentInfo,
      [name]: value,
    });
  };
  const handleHealthInfoChange = (category, index, field, value) => {
    // Convert string 'true'/'false' to boolean for checkbox fields
    if (
      field === "wearsGlasses" ||
      field === "isColorblind" ||
      field === "usesHearingAid"
    ) {
      value = value === "true" || value === true;
    }

    // Convert doseNumber to number
    if (field === "doseNumber") {
      value = Number(value) || 1;
    }

    const updatedItems = [...healthInfo[category]];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    setHealthInfo({
      ...healthInfo,
      [category]: updatedItems,
    });
  };
  const addItemToCategory = (category) => {
    const newItems = [...healthInfo[category]];

    if (category === "allergies") {
      newItems.push({ type: "", reaction: "", severity: "medium", notes: "" });
    } else if (category === "chronicConditions") {
      newItems.push({
        conditionName: "",
        diagnosedDate: "",
        medication: "",
        notes: "",
      });
    } else if (category === "medicalHistory") {
      newItems.push({
        condition: "",
        facility: "",
        treatmentDate: "",
        method: "",
        notes: "",
      });
    } else if (category === "visionHistory") {
      newItems.push({
        checkupDate: "",
        rightEyeVision: "",
        leftEyeVision: "",
        wearsGlasses: false,
        isColorblind: false,
        notes: "",
      });
    } else if (category === "hearingHistory") {
      newItems.push({
        checkupDate: "",
        rightEarStatus: "",
        leftEarStatus: "",
        usesHearingAid: false,
        notes: "",
      });
    } else if (category === "vaccines") {
      newItems.push({
        vaccineName: "",
        doseNumber: 1,
        dateInjected: "",
        locationInjected: "",
        note: "",
      });
    }

    setHealthInfo({
      ...healthInfo,
      [category]: newItems,
    });
  };
  const handleCheckboxChange = (category, index, field) => {
    const updatedItems = [...healthInfo[category]];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: !updatedItems[index][field],
    };

    setHealthInfo({
      ...healthInfo,
      [category]: updatedItems,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

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

      // Format data for API
      const hasAllergies =
        healthInfo.allergies.length > 0 && healthInfo.allergies[0].type !== "";
      const hasChronicConditions =
        healthInfo.chronicConditions.length > 0 &&
        healthInfo.chronicConditions[0].conditionName !== "";

      // Create API request body
      const apiData = {
        studentId: studentInfo.studentId,
        allergies: hasAllergies ? healthInfo.allergies : [],
        chronicConditions: hasChronicConditions
          ? healthInfo.chronicConditions
          : [],
        medicalHistory: healthInfo.medicalHistory.filter(
          (item) => item.condition !== ""
        ),
        visionHistory: healthInfo.visionHistory.filter(
          (item) => item.rightEyeVision !== "" || item.leftEyeVision !== ""
        ),
        hearingHistory: healthInfo.hearingHistory.filter(
          (item) => item.rightEarStatus !== "" || item.leftEarStatus !== ""
        ),
        vaccines: healthInfo.vaccines.filter((item) => item.vaccineName !== ""),
      };

      console.log("Submitting health profile data:", apiData);
      let response;
      // Call the API
      if (isEditing) {
        response = await updateStudentHealthProfile(profileId, apiData);
        console.log("Profile updated successfully:", response);
        setSuccessMessage("Hồ sơ sức khỏe đã được cập nhật thành công!");
      } else {
        response = await createStudentHealthProfile(apiData);
        console.log("Profile created successfully:", response);
        setSuccessMessage("Hồ sơ sức khỏe đã được tạo mới thành công!");
      }

      // Hiển thị thông báo thành công
      setTimeout(() => {
        navigate("/health-profiles");
      }, 2000);
    } catch (error) {
      console.error("Lỗi khi lưu hồ sơ:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Đã xảy ra lỗi khi lưu hồ sơ. Vui lòng thử lại sau."
      );
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
                Vui lòng cung cấp thông tin chi tiết và chính xác về sức khỏe
                của con bạn để nhà trường có thể hỗ trợ tốt nhất.
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
          {" "}
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
              id="hearing"
              label="Thính lực"
              icon={<Ear size={18} />}
            />
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
                      <option value="Mild">Nhẹ</option>
                      <option value="Medium">Trung bình</option>
                      <option value="Severe">Nghiêm trọng</option>
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
          )}{" "}
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
                  onClick={() => addItemToCategory("vaccines")}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" /> Thêm tiêm chủng
                </button>
              </div>

              {healthInfo.vaccines.map((vaccine, index) => (
                <div key={index} className="mb-6 p-4 border rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên vắc-xin
                      </label>
                      <input
                        type="text"
                        value={vaccine.vaccineName}
                        onChange={(e) =>
                          handleHealthInfoChange(
                            "vaccines",
                            index,
                            "vaccineName",
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
                        value={
                          vaccine.dateInjected
                            ? new Date(vaccine.dateInjected)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          handleHealthInfoChange(
                            "vaccines",
                            index,
                            "dateInjected",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Địa điểm tiêm
                      </label>
                      <input
                        type="text"
                        value={vaccine.locationInjected}
                        onChange={(e) =>
                          handleHealthInfoChange(
                            "vaccines",
                            index,
                            "locationInjected",
                            e.target.value
                          )
                        }
                        placeholder="Ví dụ: Trung tâm y tế, Bệnh viện, ..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số mũi
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={vaccine.doseNumber}
                        onChange={(e) =>
                          handleHealthInfoChange(
                            "vaccines",
                            index,
                            "doseNumber",
                            e.target.value
                          )
                        }
                        placeholder="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ghi chú
                    </label>
                    <textarea
                      value={vaccine.note}
                      onChange={(e) =>
                        handleHealthInfoChange(
                          "vaccines",
                          index,
                          "note",
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
          {/* Vision Tab */}
          {activeTab === "vision" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Eye className="mr-2 text-primary" size={20} />
                  Thông tin thị lực
                </h2>
                <button
                  type="button"
                  onClick={() => addItemToCategory("visionHistory")}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" /> Thêm thông tin thị lực
                </button>
              </div>

              {healthInfo.visionHistory.map((vision, index) => (
                <div key={index} className="mb-6 p-4 border rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày kiểm tra
                      </label>
                      <input
                        type="date"
                        value={
                          vision.checkupDate
                            ? new Date(vision.checkupDate)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          handleHealthInfoChange(
                            "visionHistory",
                            index,
                            "checkupDate",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thị lực mắt phải
                      </label>
                      <input
                        type="text"
                        value={vision.rightEyeVision}
                        onChange={(e) =>
                          handleHealthInfoChange(
                            "visionHistory",
                            index,
                            "rightEyeVision",
                            e.target.value
                          )
                        }
                        placeholder="Ví dụ: 10/10, 20/20, ..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thị lực mắt trái
                      </label>
                      <input
                        type="text"
                        value={vision.leftEyeVision}
                        onChange={(e) =>
                          handleHealthInfoChange(
                            "visionHistory",
                            index,
                            "leftEyeVision",
                            e.target.value
                          )
                        }
                        placeholder="Ví dụ: 10/10, 20/20, ..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`wears-glasses-${index}`}
                        checked={vision.wearsGlasses}
                        onChange={() =>
                          handleCheckboxChange(
                            "visionHistory",
                            index,
                            "wearsGlasses"
                          )
                        }
                        className="mr-2 h-4 w-4"
                      />
                      <label
                        htmlFor={`wears-glasses-${index}`}
                        className="text-sm"
                      >
                        Đeo kính
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`color-blind-${index}`}
                        checked={vision.isColorblind}
                        onChange={() =>
                          handleCheckboxChange(
                            "visionHistory",
                            index,
                            "isColorblind"
                          )
                        }
                        className="mr-2 h-4 w-4"
                      />
                      <label
                        htmlFor={`color-blind-${index}`}
                        className="text-sm"
                      >
                        Mù màu
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ghi chú
                    </label>
                    <textarea
                      value={vision.notes}
                      onChange={(e) =>
                        handleHealthInfoChange(
                          "visionHistory",
                          index,
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
              ))}
            </div>
          )}
          {/* Hearing Tab */}
          {activeTab === "hearing" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Ear className="mr-2 text-primary" size={20} />
                  Thông tin thính lực
                </h2>
                <button
                  type="button"
                  onClick={() => addItemToCategory("hearingHistory")}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" /> Thêm thông tin thính lực
                </button>
              </div>

              {healthInfo.hearingHistory.map((hearing, index) => (
                <div key={index} className="mb-6 p-4 border rounded-md">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày kiểm tra
                    </label>
                    <input
                      type="date"
                      value={
                        hearing.checkupDate
                          ? new Date(hearing.checkupDate)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        handleHealthInfoChange(
                          "hearingHistory",
                          index,
                          "checkupDate",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tình trạng tai phải
                      </label>
                      <input
                        type="text"
                        value={hearing.rightEarStatus}
                        onChange={(e) =>
                          handleHealthInfoChange(
                            "hearingHistory",
                            index,
                            "rightEarStatus",
                            e.target.value
                          )
                        }
                        placeholder="Ví dụ: Bình thường, Giảm thính lực nhẹ, ..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tình trạng tai trái
                      </label>
                      <input
                        type="text"
                        value={hearing.leftEarStatus}
                        onChange={(e) =>
                          handleHealthInfoChange(
                            "hearingHistory",
                            index,
                            "leftEarStatus",
                            e.target.value
                          )
                        }
                        placeholder="Ví dụ: Bình thường, Giảm thính lực nhẹ, ..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`uses-hearing-aid-${index}`}
                        checked={hearing.usesHearingAid}
                        onChange={() =>
                          handleCheckboxChange(
                            "hearingHistory",
                            index,
                            "usesHearingAid"
                          )
                        }
                        className="mr-2 h-4 w-4"
                      />
                      <label
                        htmlFor={`uses-hearing-aid-${index}`}
                        className="text-sm"
                      >
                        Sử dụng thiết bị trợ thính
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ghi chú
                    </label>
                    <textarea
                      value={hearing.notes}
                      onChange={(e) =>
                        handleHealthInfoChange(
                          "hearingHistory",
                          index,
                          "notes",
                          e.target.value
                        )
                      }
                      placeholder="Thông tin bổ sung về thính lực"
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

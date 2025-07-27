import {
  AlertCircle,
  FileText,
  Heart,
  Syringe,
  Save,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../libs/contexts/AuthContext";
import {
  createStudentHealthProfile,
  updateStudentHealthProfile,
  getStudentHealthProfile,
} from "../../libs/api/parentService";

const ParentHealthProfileForm = () => {
  const [id, setId] = useState("");
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("allergies");
  const [studentInfo, setStudentInfo] = useState({
    studentId: "",
    studentName: "",
    class: "",
    dateOfBirth: "",
    parentName: "",
    contactNumber: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [healthInfo, setHealthInfo] = useState({
    allergies: [{ type: "", reaction: "", severity: "Mild", notes: "" }],
    chronicConditions: [
      { conditionName: "", diagnosedDate: "", medication: "", notes: "" },
    ],
    medicalHistory: [
      { condition: "", facility: "", treatmentDate: "", method: "", notes: "" },
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

  // Tải thông tin hồ sơ
  useEffect(() => {
    console.log("Current Profile ID:", profileId);
    console.log("Location state:", location.state);
    console.log("claimedStudent:", location.state?.claimedStudent);
    console.log("studentInfoFromState:", location.state?.studentInfo);

    const claimedStudent = location.state?.claimedStudent;
    const studentInfoFromState = location.state?.studentInfo;

    // Hàm để điền thông tin học sinh/phụ huynh
    const setStudentInfoData = (data) => {
      let formattedDate = "";
      if (data.dateOfBirth) {
        const regex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
        if (regex.test(data.dateOfBirth)) {
          const parts = data.dateOfBirth.split("/");
          let day = parts[0].padStart(2, "0");
          let month = parts[1].padStart(2, "0");
          let year = parts[2];
          if (parseInt(day) > 12 || parseInt(month) > 12) {
            formattedDate = `${year}-${month}-${day}`;
          } else {
            formattedDate = "";
          }
        } else if (new Date(data.dateOfBirth).toString() !== "Invalid Date") {
          formattedDate = new Date(data.dateOfBirth)
            .toISOString()
            .split("T")[0];
        }
      }
      setStudentInfo({
        studentId: data.studentId || data._id || "",
        studentName: data.studentName || data.fullName || "",
        class: data.class || data.classId?.className || "",
        dateOfBirth: formattedDate,
        parentName: user?.username || "",
        contactNumber: user?.phone || "",
        relationship: data.relationship || user?.relationship || "father",
      });
    };

    // Điền thông tin học sinh/phụ huynh từ claimedStudent hoặc studentInfoFromState
    if (claimedStudent) {
      console.log("Processing claimedStudent:", claimedStudent);
      setStudentInfoData(claimedStudent);
    } else if (studentInfoFromState) {
      console.log("Processing studentInfoFromState:", studentInfoFromState);
      setStudentInfoData(studentInfoFromState);
    } else {
      console.log("No student data provided, setting default parent info");
      setStudentInfo((prev) => ({
        ...prev,
        parentName: user?.username || "",
        contactNumber: user?.phone || "",
      }));
    }

    // Tải thông tin sức khỏe nếu có profileId hợp lệ
    if (profileId && profileId !== "new") {
      console.log("Editing existing profile with ID:", profileId);
      setIsEditing(true);
      const fetchProfileData = async () => {
        console.log("Starting fetchProfileData with profileId:", profileId);
        try {
          const response = await getStudentHealthProfile(profileId);
          console.log("Raw API response:", response);
          if (response.success) {
            console.log("Fetched profile data:", response.data);
            const apiData = response.data;
            setId(apiData._id);
            setHealthInfo({
              allergies:
                apiData.allergies?.length > 0
                  ? apiData.allergies
                  : [{ type: "", reaction: "", severity: "Mild", notes: "" }],
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
            console.log("API response failed:", response.message);
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
    }
  }, [profileId, location.state, user]);

  const handleHealthInfoChange = (category, index, field, value) => {
    if (field === "wearsGlasses" || field === "isColorblind") {
      value = value === "true" || value === true;
    }
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
      newItems.push({ type: "", reaction: "", severity: "Mild", notes: "" });
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
  const handleSubmit = async (e) => {
    console.log(id);

    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const hasAllergies =
        healthInfo.allergies.length > 0 && healthInfo.allergies[0].type !== "";
      const hasChronicConditions =
        healthInfo.chronicConditions.length > 0 &&
        healthInfo.chronicConditions[0].conditionName !== "";
      const apiData = {
        studentId: studentInfo.studentId,
        allergies: hasAllergies ? healthInfo.allergies : [],
        chronicConditions: hasChronicConditions
          ? healthInfo.chronicConditions
          : [],
        medicalHistory: healthInfo.medicalHistory.filter(
          (item) => item.condition !== ""
        ),
        vaccines: healthInfo.vaccines.filter((item) => item.vaccineName !== ""),
      };
      console.log("Submitting health profile data:", apiData);
      let response;
      if (isEditing) {
        response = await updateStudentHealthProfile(id, apiData);
        console.log("Profile updated successfully:", response);
        setSuccessMessage("Hồ sơ sức khỏe đã được cập nhật thành công!");
      } else {
        response = await createStudentHealthProfile(apiData);
        console.log("Profile created successfully:", response);
        setSuccessMessage("Hồ sơ sức khỏe đã được tạo mới thành công!");
      }
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
      className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium ${activeTab === id
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
              className="cursor-pointer flex items-center text-gray-600 hover:text-primary mr-5"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
            </button>
            <div className="flex-grow">
              <h1 className="text-2xl font-bold text-gray-800">
                {isEditing ? "Cập nhật" : "Khai Báo"} Hồ Sơ Sức Khỏe Học Sinh
              </h1>
              <p className="text-gray-600 mt-1">
                Vui lòng cung cấp thông tin chi tiết và chính xác về sức khỏe
                của con bạn để nhà trường có thể hỗ trợ tốt nhất.
              </p>
            </div>
          </div>
        </div>
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
          <div className="flex flex-wrap gap-2 mb-6">
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
          </div>
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
                  className="cursor-pointer px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center text-sm"
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
                  className="cursor-pointer px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center text-sm"
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
                        value={condition.conditionName}
                        onChange={(e) =>
                          handleHealthInfoChange(
                            "chronicConditions",
                            index,
                            "conditionName",
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
                        type="date"
                        value={condition.diagnosedDate || ""}
                        onChange={(e) =>
                          handleHealthInfoChange(
                            "chronicConditions",
                            index,
                            "diagnosedDate",
                            e.target.value
                          )
                        }
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
                  className="cursor-pointer px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center text-sm"
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
                        value={history.facility}
                        onChange={(e) =>
                          handleHealthInfoChange(
                            "medicalHistory",
                            index,
                            "facility",
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
                        value={history.treatmentDate || ""}
                        onChange={(e) =>
                          handleHealthInfoChange(
                            "medicalHistory",
                            index,
                            "treatmentDate",
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
                        value={history.method}
                        onChange={(e) =>
                          handleHealthInfoChange(
                            "medicalHistory",
                            index,
                            "method",
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
          <div className="flex justify-end mt-8 border-t pt-4">
            <button
              type="button"
              onClick={() => navigate("/health-profiles")}
              className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 mr-2"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="cursor-pointer px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center"
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

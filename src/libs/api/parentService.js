import api from "../hooks/axiosInstance";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

//parent get my children
export const getMyChildren = async (params) => {
  try {
    const response = await api.get(
      `${API_URL}/health-profiles/students/my-students`,
      { params }
    );
    // Return the data array from the response
    return {
      students: response.data.data || [],
      message: response.data.message,
      success: response.data.success,
    };
  } catch (error) {
    throw error;
  }
};

//parent claim student by code
export const claimStudentByCode = async (invitedCode) => {
  try {
    const response = await api.post(
      `${API_URL}/health-profiles/students/claim`,
      { invitedCode }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

//parent create student health profile
/**
 * Creates a student health profile
 * @param {Object} studentData - Student health profile data
 * @returns {Promise<Object>} - Response from the API
 *
 * @example
 * // Example request body:
 * {
 *    "studentId": "68592aba485d6df6e84e252e",
 *    "allergies": [
 *        {
 *            "type": "Thực phẩm",
 *            "reaction": "Nổi mẩn đỏ, ngứa, sưng môi",
 *            "severity": "Medium",
 *            "notes": "Dị ứng với tôm, cua. Tuyệt đối không ăn. Các loại hải sản khác ăn được."
 *        },
 *        {
 *            "type": "Thuốc",
 *            "reaction": "Buồn nôn",
 *            "severity": "Mild",
 *            "notes": "Dị ứng nhẹ với Penicillin."
 *        }
 *    ],
 *    "chronicConditions": [
 *        {
 *            "conditionName": "Hen suyễn",
 *            "diagnosedDate": "2022-09-15T00:00:00.000Z",
 *            "medication": "Ventolin Inhaler",
 *            "notes": "Cần mang theo thuốc xịt khi tham gia các hoạt động thể chất mạnh. Thường lên cơn khi thời tiết lạnh, khô."
 *        }
 *    ],
 *    "medicalHistory": [
 *        {
 *            "condition": "Gãy xương tay phải",
 *            "facility": "Bệnh viện Chấn thương Chỉnh hình",
 *            "treatmentDate": "2023-05-10T00:00:00.000Z",
 *            "method": "Bó bột",
 *            "notes": "Đã hồi phục hoàn toàn, không ảnh hưởng đến vận động."
 *        },
 *        {
 *            "condition": "Viêm tai giữa",
 *            "facility": "Bệnh viện Nhi Đồng 2",
 *            "treatmentDate": "2023-01-20T00:00:00.000Z",
 *            "method": "Uống kháng sinh",
 *            "notes": "Đã điều trị khỏi hoàn toàn."
 *        }
 *    ],
 *    "visionHistory": [
 *        {
 *            "checkupDate": "2024-05-10T00:00:00.000Z",
 *            "rightEyeVision": "9/10",
 *            "leftEyeVision": "8/10",
 *            "wearsGlasses": true,
 *            "isColorblind": false,
 *            "notes": "Đeo kính khi học bài và xem TV. Cần kiểm tra lại sau 6 tháng."
 *        }
 *    ],
 *    "hearingHistory": [
 *        {
 *            "checkupDate": "2024-05-10T00:00:00.000Z",
 *            "rightEarStatus": "Bình thường",
 *            "leftEarStatus": "Bình thường",
 *            "usesHearingAid": false,
 *            "notes": "Thính lực tốt."
 *        }
 *    ],
 *    "vaccines": [
 *        {
 *            "vaccineName": "Sởi - Quai bị - Rubella (MMR)",
 *            "doseNumber": 2,
 *            "note": "Mũi nhắc lại lần 2.",
 *            "dateInjected": "2021-06-01T00:00:00.000Z",
 *            "locationInjected": "Trung tâm Y tế Dự phòng Quận 1"
 *        },
 *        {
 *            "vaccineName": "Viêm não Nhật Bản",
 *            "doseNumber": 3,
 *            "note": "Hoàn thành 3 mũi cơ bản.",
 *            "dateInjected": "2022-07-15T00:00:00.000Z",
 *            "locationInjected": "Bệnh viện Nhi Đồng 1"
 *        }
 *    ]
 * }
 */
export const createStudentHealthProfile = async (studentData) => {
  try {
    const response = await api.post(`${API_URL}/health-profiles`, studentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//parent update student health profile
export const updateStudentHealthProfile = async (profileId, studentData) => {
  try {
    const response = await api.put(
      `${API_URL}/health-profiles/${profileId}`,
      studentData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

//parent get student health profile
export const getStudentHealthProfile = async (studentId) => {
  try {
    const response = await api.get(
      `${API_URL}/health-profiles/student/${studentId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

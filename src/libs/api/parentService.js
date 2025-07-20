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
    const response = await api.patch(
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

//get history of student health profile
export const getStudentHealthProfileHistory = async (studentId, schoolYear) => {
  try {
    const response = await api.get(
      `${API_URL}/health-history/students/${studentId}?schoolYear=${schoolYear}`
    );
  //   {
  //     "data": {
  //         "studentId": "686b97d15723b5b353c68f58",
  //         "studentName": "Nguyễn Văn A",
  //         "currentClassName": "Lớp 1A",
  //         "schoolYear": "2024-2025",
  //         "healthChecks": [
  //             {
  //                 "campaignName": "Chiến dịch khám sức khỏe HK1 2024-2025",
  //                 "className": "Lớp 1A",
  //                 "checkupDate": "2024-10-05T00:00:00.000Z",
  //                 "overallConclusion": "Phát triển bình thường, trong ngưỡng an toàn.",
  //                 "recommendations": "Tiếp tục theo dõi chế độ dinh dưỡng và vận động.",
  //                 "nurseName": "Nguyễn Ngọc C",
  //                 "details": [
  //                     {
  //                         "itemName": "Chiều cao",
  //                         "value": 125,
  //                         "unit": "CM",
  //                         "isAbnormal": false
  //                     },
  //                     {
  //                         "itemName": "Cân nặng",
  //                         "value": 25,
  //                         "unit": "KG",
  //                         "isAbnormal": false
  //                     }
  //                 ]
  //             }
  //         ],
  //         "vaccinations": [
  //             {
  //                 "campaignName": "Chiến dịch tiêm MMR năm 2024",
  //                 "vaccineName": "MMR",
  //                 "doseNumber": 1,
  //                 "administeredAt": "2024-11-01T10:00:00.000Z",
  //                 "administeredBy": "Nurse Carol Green",
  //                 "organizationName": "City Health Clinic",
  //                 "observations": [
  //                     {
  //                         "observedAt": "2024-11-01T10:30:00.000Z",
  //                         "notes": "Bình thường, không có phản ứng phụ.",
  //                         "isAbnormal": false
  //                     }
  //                 ]
  //             }
  //         ]
  //     },
  //     "message": "Health history retrieved successfully"
  // }
    return response.data;
  } catch (error) {
    throw error;
  }
};

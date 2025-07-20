import api from "~/libs/hooks/axiosInstance";
import { endpoints } from "../endpoints";

class ClassService {
  // Lấy danh sách lớp học, có thể lọc theo năm học, khối, tìm kiếm
  async getAll(params = {}) {
    try {
      const response = await api.get(endpoints.classes.getAll, { params });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách lớp:", error);
      throw error;
    }
  }

  // Tạo lớp học mới
  async create({ className, gradeLevel, schoolYear }) {
    try {
      const response = await api.post(endpoints.classes.create, {
        className,
        gradeLevel,
        schoolYear,
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo lớp học:", error);
      throw error;
    }
  }

  // Lấy thông tin lớp học theo ID
  async getById(classId) {
    try {
      const url = endpoints.classes.getById.replace("{classId}", classId);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết lớp học:", error);
      throw error;
    }
  }
}

export default new ClassService();

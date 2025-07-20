import api from "~/libs/hooks/axiosInstance";
import { endpoints } from "../endpoints";

class UserStudentService {
  // ---------- USER ----------
  // 1. Lấy danh sách người dùng
  async getAllUsers({ page = 1, limit = 10, role, status, search }) {
    try {
      const res = await api.get(endpoints.user.getAll, {
        params: {
          page,
          limit,
          role,
          status,
          search,
        },
      });
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // 2. Cập nhật trạng thái người dùng (active/inactive)
  async updateUserStatus(userId, isActive) {
    try {
      const res = await api.patch(
        endpoints.admin.users.updateStatus.replace("{userId}", userId),
        { isActive }
      );
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // ---------- STUDENT ----------
  // 3. Lấy danh sách học sinh
  async getAllStudents({ page = 1, limit = 10, classId, search }) {
    try {
      const res = await api.get(endpoints.students.getAll, {
        params: {
          page,
          limit,
          classId,
          search,
        },
      });
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // 4. Tạo học sinh mới
  async createStudent(studentData) {
    try {
      const res = await api.post(endpoints.admin.students.create, studentData);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }
}

const userStudentServiceInstance = new UserStudentService();
export default userStudentServiceInstance;

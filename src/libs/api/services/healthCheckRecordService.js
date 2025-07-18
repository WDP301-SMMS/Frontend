import api from "~/libs/hooks/axiosInstance";
import { endpoints } from "../endpoints";

class HealthCheckRecordService {
  // 1. Lấy tất cả health check record của học sinh
  async getStudentHealthRecord(studentId) {
    try {
      const url = endpoints.healthCheck.getHealthCheckRecordByStudent.replace("{id}", studentId);
      const res = await api.get(url);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // 2. Lấy record gần nhất của học sinh
  async getLatestStudentHealthRecord(studentId) {
    try {
      const url = endpoints.healthCheck.getLatestHealthCheckRecordByStudent.replace("{id}", studentId);
      const res = await api.get(url);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // 3. Tạo kết quả kiểm tra sức khỏe từ template
  async createHealthCheckResult(resultData) {
    try {
      const res = await api.post(endpoints.healthCheck.createHealthCheckResult, resultData);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }
}

const healthCheckRecordService = new HealthCheckRecordService();
export default healthCheckRecordService;

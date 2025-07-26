import api from "~/libs/hooks/axiosInstance";
import { endpoints } from "../endpoints";

class MedicationSchedulesService {
  // 1. Tạo nhiều lịch uống thuốc
  async createManySchedules(scheduleData) {
    try {
      const res = await api.post(endpoints.medicationSchedule.createMany, scheduleData);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // 2. Cập nhật trạng thái lịch uống thuốc
  async updateScheduleStatus(scheduleId, statusData) {
    try {
      const url = endpoints.medicationSchedule.updateStatus.replace("{scheduleId}", scheduleId);
      const res = await api.patch(url, statusData);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // 3. Lấy lịch theo Request ID
  async getSchedulesByRequestId(requestId) {
    try {
      const url = endpoints.medicationSchedule.getByRequestId.replace("{requestId}", requestId);
      const res = await api.get(url);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // 4. Lấy lịch theo Student ID
  async getSchedulesByStudentId(studentId) {
    try {
      const url = endpoints.medicationSchedule.getByStudentId.replace("{studentId}", studentId);
      const res = await api.get(url);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }
}

const medicationSchedulesService = new MedicationSchedulesService();
export default medicationSchedulesService;

import api from "~/libs/hooks/axiosInstance";
import { endpoints } from "../endpoints";

class AppointmentsService {
  // 1. Lấy học sinh có kết quả bất thường
  async getStudentsWithAbnormalResults() {
    try {
      const res = await api.get(endpoints.appointments.getStudentsWithAbnormalResults);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // 2. Lấy danh sách cuộc hẹn (theo phân trang, status, studentId)
  async getAppointments({ page = 1, limit = 10, status, studentId } = {}) {
    try {
      const params = { page, limit };
      if (status) params.status = status;
      if (studentId) params.studentId = studentId;
      const res = await api.get(endpoints.appointments.getAppointments, { params });
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // 3. Tạo cuộc hẹn mới
  async createAppointment(data) {
    try {
      const res = await api.post(endpoints.appointments.createAppointment, data);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // 4. Cập nhật trạng thái cuộc hẹn
  async updateAppointmentStatus(appointmentId, statusData) {
    try {
      const url = endpoints.appointments.updateAppointmentStatus.replace(
        "{appointmentId}",
        appointmentId
      );
      const res = await api.patch(url, statusData);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // 5. Thêm ghi chú sau buổi hẹn
  async addAfterMeetingNotes(appointmentId, notesData) {
    try {
      const url = endpoints.appointments.addAfterMeetingNotes.replace(
        "{appointmentId}",
        appointmentId
      );
      const res = await api.patch(url, notesData);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }
}

const appointmentsService = new AppointmentsService();
export default appointmentsService;

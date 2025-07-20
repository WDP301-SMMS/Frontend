import api from "~/libs/hooks/axiosInstance";
import { endpoints } from "../endpoints";

class MedicationRequestsService {
  // 1. Tạo yêu cầu uống thuốc
  async createRequest(formData) {
    try {
      const res = await api.post(endpoints.medication.create, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // 2. Lấy tất cả yêu cầu (nurse)
  async getAllRequests() {
    try {
      const res = await api.get(endpoints.medication.getAll);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // 3. Lấy yêu cầu theo ID
  async getRequestById(requestId) {
    try {
      const url = endpoints.medication.getById.replace("{requestId}", requestId);
      const res = await api.get(url);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // 4. Lấy yêu cầu theo phụ huynh
  async getRequestsByParent() {
    try {
      const res = await api.get(endpoints.medication.getByParent);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // 5. Cập nhật prescription file và thời gian dùng thuốc
  async updateRequestInfo(requestId, formData) {
    try {
      const url = endpoints.medication.updateInfo.replace("{requestId}", requestId);
      const res = await api.patch(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // 6. Cập nhật hoặc thêm thuốc trong yêu cầu
  async updateItems(requestId, items) {
    try {
      const url = endpoints.medication.updateItems.replace("{requestId}", requestId);
      const res = await api.patch(url, { items });
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }
}

const medicationRequestsService = new MedicationRequestsService();
export default medicationRequestsService;

import api from "~/libs/hooks/axiosInstance";
import { endpoints } from "../endpoints";

class IncidentsService {
  // 1. Lấy tất cả sự cố y tế
  async getAllIncidents() {
    try {
      const res = await api.get(endpoints.incident.getAllIncidents);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // 2. Lấy sự cố của tôi (nurse)
  async getMyIncidents() {
    try {
      const res = await api.get(endpoints.incident.getMyIncidents);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // 3. Lấy sự cố theo ID
  async getIncidentById(incidentId) {
    try {
      const res = await api.get(
        endpoints.incident.getIncidentById.replace("{incidentId}", incidentId)
      );
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // 4. Tạo sự cố y tế mới
  async createIncident(data) {
    try {
      const res = await api.post(endpoints.incident.createIncident, data);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // 5. Cập nhật sự cố y tế
  async updateIncident(incidentId, data) {
    try {
      const res = await api.patch(
        endpoints.incident.updateIncident.replace("{incidentId}", incidentId),
        data
      );
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // 6. Lấy danh sách sự cố cần cấp phát thuốc
  async getAllIncidentsToDispense() {
    try {
      const res = await api.get(endpoints.incident.getAllIncidentsToDispense);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // 7. Cấp phát thuốc cho sự cố
  async dispenseMedicationForIncident(incidentId, dispensedItems) {
    try {
      const res = await api.post(
        endpoints.incident.dispenseIncident.replace("{incidentId}", incidentId),
        { dispensedItems }
      );
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // 8. Lịch sử cấp phát thuốc
  async getDispenseHistory() {
    try {
      const res = await api.get(endpoints.incident.dispenseHistory);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }
}

const incidentsService = new IncidentsService();
export default incidentsService;

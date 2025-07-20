import api from "~/libs/hooks/axiosInstance";
import { endpoints } from "../endpoints";

class HealthCheckConsentService {
  // 1. Lấy tất cả consent
  async getAllConsents() {
    try {
      const res = await api.get(endpoints.healthCheck.getAllConsents);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // 2. Lấy consent theo campaignId
  async getConsentsByCampaignId(campaignId) {
    try {
      const url = endpoints.healthCheck.getConsentsByCampaignId.replace("{campaignId}", campaignId);
      const res = await api.get(url);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // 3. Thêm tất cả học sinh vào consent theo campaignId
  async addStudentsToConsent(campaignId) {
    try {
      const res = await api.post(endpoints.healthCheck.addStudentsToConsent, {
        campaignId,
      });
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // 4. Cập nhật trạng thái consent (APPROVED / DECLINED)
  async updateConsentStatus(consentId, statusData) {
    try {
      const url = endpoints.healthCheck.updateConsentStatus.replace("{consentId}", consentId);
      const res = await api.patch(url, statusData);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }
}

const healthCheckConsentService = new HealthCheckConsentService();
export default healthCheckConsentService;

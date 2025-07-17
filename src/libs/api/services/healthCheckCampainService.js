
import api from "~/libs/hooks/axiosInstance";
import { endpoints } from "../endpoints";

class HealthCheckCampaignService {
  // 1. Lấy danh sách tất cả các chiến dịch kiểm tra sức khỏe
  async getListHealthCheckCampaigns({ page = 1, limit = 20, search = '', status = '', schoolYear = '' } = {}) {
  try {
    const url = `${endpoints.healthCheck.getHealthCheckCampaigns}?page=${page}&limit=${limit}${
      search ? `&q=${encodeURIComponent(search)}` : ''
    }${status ? `&status=${encodeURIComponent(status)}` : ''}${
      schoolYear ? `&schoolYear=${encodeURIComponent(schoolYear)}` : ''
    }`;
    const res = await api.get(url);
    return res.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
}

  // 2. Tạo một chiến dịch kiểm tra sức khỏe mới
  async createHealthCheckCampaign(campaignData) {
    try {
      const res = await api.post(endpoints.healthCheck.createHealthCheckCampaign, campaignData);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // 3. Tìm kiếm các chiến dịch kiểm tra sức khỏe
  async searchHealthCheckCampaigns({ q, sortBy, sortOrder = 'desc', limit = 20 } = {}) {
    try {
      const url = `${endpoints.healthCheck.searchHealthCheckCampaigns}?q=${encodeURIComponent(q)}${
        sortBy ? `&sortBy=${sortBy}` : ''
      }${sortOrder ? `&sortOrder=${sortOrder}` : ''}${limit ? `&limit=${limit}` : ''}`;
      const res = await api.get(url);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // 4. Lấy thống kê của các chiến dịch kiểm tra sức khỏe
  async getCampaignStatistics() {
    try {
      const res = await api.get(endpoints.healthCheck.getCampaignStatistics);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // 5. Lấy danh sách chiến dịch theo trạng thái
  async getCampaignsByStatus(status) {
    try {
      const url = endpoints.healthCheck.getCampaignsByStatus.replace('{status}', status);
      const res = await api.get(url);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // 6. Lấy thông tin chi tiết của một chiến dịch kiểm tra sức khỏe theo ID
  async getCampaignDetails(campaignId) {
    try {
      const url = endpoints.healthCheck.getCampaignDetails.replace('{id}', campaignId);
      const res = await api.get(url);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // 7. Cập nhật thông tin một chiến dịch kiểm tra sức khỏe
  async updateHealthCheckCampaign(campaignId, updatedCampaignData) {
    try {
      const url = endpoints.healthCheck.updateHealthCheckCampaign.replace('{id}', campaignId);
      const res = await api.put(url, updatedCampaignData);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // 8. Cập nhật trạng thái của một chiến dịch
  async updateCampaignStatus(campaignId, statusData) {
    try {
      const url = endpoints.healthCheck.updateCampaignStatus.replace('{id}', campaignId);
      const res = await api.patch(url, statusData);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  // 9. Phân công nhân viên cho chiến dịch
  async assignStaffToCampaign(campaignId, assignmentData) {
    try {
      const url = endpoints.healthCheck.assignStaffToCampaign.replace('{id}', campaignId);
      const res = await api.put(url, assignmentData);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }
}

const healthCheckCampaignService = new HealthCheckCampaignService();
export default healthCheckCampaignService;

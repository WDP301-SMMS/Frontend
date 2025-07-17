import api from "~/libs/hooks/axiosInstance";
import { endpoints } from "../endpoints";

class PartnerService {

  async createPartner(data) {
    try {
      const response = await api.post(endpoints.partner.createPartner, data);
      return response.data;
    } catch (error) {
      console.error('Create partner failed:', error);
      throw error;
    }
  }

  async getPartnerById(partnerId) {
    try {
      const url = endpoints.partner.getPartnerById.replace('{partnerId}', partnerId);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Get partner by ID failed:', error);
      throw error;
    }
  }

  async updatePartnerInfo(partnerId, data) {
    try {
      const url = endpoints.partner.updatePartnerInfo.replace('{partnerId}', partnerId);
      const response = await api.patch(url, data);
      return response.data;
    } catch (error) {
      console.error('Update partner info failed:', error);
      throw error;
    }
  }

  async updatePartnerManager(partnerId, data) {
    try {
      const url = endpoints.partner.updatePartnerManager.replace('{partnerId}', partnerId);
      const response = await api.put(url, data);
      return response.data;
    } catch (error) {
      console.error('Update partner manager failed:', error);
      throw error;
    }
  }

  async updatePartnerStatus(partnerId, data) {
    try {
      const url = endpoints.partner.updatePartnerStatus.replace('{partnerId}', partnerId);
      const response = await api.patch(url, data);
      return response.data;
    } catch (error) {
      console.error('Update partner status failed:', error);
      throw error;
    }
  }

  async addPartnerStaff(partnerId, data) {
    try {
      const url = endpoints.partner.addPartnerStaff.replace('{partnerId}', partnerId);
      const response = await api.post(url, data);
      return response.data;
    } catch (error) {
      console.error('Add partner staff failed:', error);
      throw error;
    }
  }

  async deletePartnerStaff(partnerId, staffId) {
    try {
      const url = endpoints.partner.deletePartnerStaff.replace('{partnerId}', partnerId).replace('{staffId}', staffId);
      const response = await api.delete(url);
      return response.data;
    } catch (error) {
      console.error('Delete partner staff failed:', error);
      throw error;
    }
  }

  async getListPartner({ page = 1, limit = 10, status, search } = {}) {
    try {
      const url = `${endpoints.campaign.getListPartner}?page=${page}&limit=${limit}${
        status ? `&status=${status}` : ''
      }${search ? `&search=${encodeURIComponent(search)}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Get Partner list failed:', error);
      throw error;
    }
  }


}

export const partnerService = new PartnerService();
export default partnerService
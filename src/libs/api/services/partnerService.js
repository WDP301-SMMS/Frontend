import api from "~/libs/hooks/axiosInstance";
import { endpoints } from "../endpoints";

class PartnerService{

    
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
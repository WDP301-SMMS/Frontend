import api from "~/libs/hooks/axiosInstance";
import { endpoints } from "../endpoints";
// CampaignService class (unchanged)
class CampaignService {
  async getListCampaign(params = {}) {
    try {
      const queryParams = {
        page: params.page || 1,
        limit: params.limit || 10,
        status: params.status || 'ANNOUNCED',
        schoolYear: params.schoolYear || '2024-2025',
        ...params
      };
      const response = await api.get(endpoints.campaign.getListCampaign, { params: queryParams });
      return response.data;
    } catch (error) {
      console.error('Get campaigns failed:', error);
      throw error;
    }
  }

  async getAllCampaign(params = {}) {
    try {
      const queryParams = {
        page: params.page || 1,
        limit: params.limit || 10,
        schoolYear: params.schoolYear || '2024-2025',
        ...params
      };
      const response = await api.get(endpoints.campaign.getListCampaign, { params: queryParams });
      return response.data;
    } catch (error) {
      console.error('Get campaigns failed:', error);
      throw error;
    }
  }

  async getCampaign(campaignId) {
    if (!campaignId) {
      throw new Error('Campaign ID is required');
    }
    try {
      const url = endpoints.campaign.getCampaign.replace('{campaignId}', campaignId);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Get campaign failed:', error);
      throw error;
    }
  }

  async activeCampaign(campaignId, data = {}) {
    if (!campaignId) {
      throw new Error('Campaign ID is required');
    }
    try {
      const url = endpoints.campaign.activeCampaign.replace('{campaignId}', campaignId);
      const response = await api.post(url, data);
      return response.data;
    } catch (error) {
      console.error('Activate campaign failed:', error);
      throw error;
    }
  }

  async updateCampaignStatus(campaignId,createdBy, status, cancellationReason = null) {
    if (!campaignId || !status) {
      throw new Error('Campaign ID and status are required');
    }
    try {
      const url = endpoints.campaign.cancelCampaign.replace('{campaignId}', campaignId);
      const data = { status };
      if (cancellationReason) {
        data.cancellationReason = cancellationReason;
      }
      if (createdBy) {
        data.createdBy = createdBy;
      }
      const response = await api.patch(url, data);
      return response.data;
    } catch (error) {
      console.error('Update campaign status failed:', error);
      throw error;
    }
  }

  async updateCampaign(campaignId, data) {
    if (!campaignId || !data) {
      throw new Error('Campaign ID and status are required');
    }
    try {
      const url = endpoints.campaign.cancelCampaign.replace('{campaignId}', campaignId);
      
      console.log(url)
      console.log(data)

      const response = await api.patch(url, data);
      return response.data;
    } catch (error) {
      console.error('Update campaign failed:', error);
      throw error;
    }
  }



  async getCampaignsByStatus(status, page = 1, limit = 10) {
    return this.getListCampaign({ status, page, limit });
  }

  async getCampaignsBySchoolYear(schoolYear, page = 1, limit = 10) {
    return this.getListCampaign({ schoolYear, page, limit });
  }

  async searchCampaigns(searchTerm, filters = {}) {
    return this.getListCampaign({
      search: searchTerm,
      ...filters
    });
  }

  async getActiveCampaigns(page = 1, limit = 10) {
    return this.getCampaignsByStatus('ACTIVE', page, limit);
  }

  async getDraftCampaigns(page = 1, limit = 10) {
    return this.getCampaignsByStatus('DRAFT', page, limit);
  }

  async getAnnouncedCampaigns(page = 1, limit = 10) {
    return this.getCampaignsByStatus('ANNOUNCED', page, limit);
  }

  async getCompletedCampaigns(page = 1, limit = 10) {
    return this.getCampaignsByStatus('COMPLETED', page, limit);
  }


   async getListRegistrants(campaignId) {
    if (!campaignId ) {
      throw new Error('Campaign ID are required');
    }
    try {
      const url = endpoints.campaign.listRegistrants.replace('{campaignId}', campaignId);

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Get List Registrants failed:', error);
      throw error;
    }
  }


   async getListVaccination(campaignId) {
    if (!campaignId ) {
      throw new Error('Campaign ID are required');
    }
    try {
      const url = endpoints.campaign.listVaccination.replace('{campaignId}', campaignId);

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Get List Vaccination failed:', error);
      throw error;
    }
  }


  async getPartnerByID(partnerId) {
    if (!partnerId ) {
      throw new Error('Partner ID are required');
    }
    try {
      const url = endpoints.campaign.getPartnerById.replace('{partnerId}', partnerId);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Get Partner failed:', error);
      throw error;
    }
  }

   async injectionRecord(consentIdToRecord, staffId) {
    try {
      const url = endpoints.campaign.injectionRecord;
      const response = await api.post(url, {
        consentId: consentIdToRecord,
        administeredAt: new Date().toISOString(),
        administeredByStaffId: staffId,
      });
      return response.data;
    } catch (error) {
      console.error('Injection record failed:', error);
      throw error;
    }
  };



   async getStudentImmunizationHistory(studentId_ToRecord) {
    if (!studentId_ToRecord ) {
      throw new Error('studentIdTo Record ID are required');
    }
    try {
      const url = endpoints.campaign.StudentImmunizationHistory.replace('{studentId_ToRecord}', studentId_ToRecord);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Get Partner failed:', error);
      throw error;
    }
  }


}

export const campaignService = new CampaignService();
export default campaignService;

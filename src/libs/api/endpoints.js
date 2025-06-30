export const endpoints = {
  user: {
    getProfile: "/user/me",           // GET /user/me
    updateProfile: "/user/me",        // PUT /user/me
  },
  auth: {
    login: "/auth/login",             // POST /auth/login
    register: "/auth/register",       // POST /auth/register
  },
  campaign: {
    activeCampaign: "/vaccinationCampaigns/{campaignId}/dispatch",  // POST
    getListCampaign: "/vaccinationCampaigns",                       // GET
    getCampaign: "/vaccinationCampaigns/{campaignId}",              // GET
    cancelCampaign:"/vaccinationCampaigns/{campaignId}",             //PATCH
    listRegistrants:"/vaccinationCampaigns/campaigns/{campaignId}/registrants", //GET
    listVaccination:"/vaccinationCampaigns/campaigns/{campaignId}/checklist", //GET
    getPartnerById:"/admin/partners/{partnerId}", //GET
    injectionRecord:"/vaccinationCampaigns/records", //POSt


    StudentImmunizationHistory:"/reports/students/{studentId_ToRecord}/vaccination-history"
  }
};
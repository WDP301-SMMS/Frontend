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
  }
};
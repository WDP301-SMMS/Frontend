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
    cancelCampaign: "/vaccinationCampaigns/{campaignId}",             //PATCH
    listRegistrants: "/vaccinationCampaigns/campaigns/{campaignId}/registrants", //GET
    listVaccination: "/vaccinationCampaigns/campaigns/{campaignId}/checklist", //GET
    getPartnerById: "/admin/partners/{partnerId}", //GET
    injectionRecord: "/vaccinationCampaigns/records", //POSt
    getListPartner: "/admin/partners",  //GET
    addCampaign: "/vaccinationCampaigns",//POST


    StudentImmunizationHistory: "/reports/students/{studentId_ToRecord}/vaccination-history"
  },
  healthCheck: {
    getTemplate: "/admin/health-check-templates",
    addTemplate: "/admin/health-check-templates",
    getDetailTemplate: "/admin/health-check-templates/{templateId}",
    updateTemplate: "/admin/health-check-templates/{templateId}",
    deleteTemplate: "admin/health-check-templates/{templateId}"
  },
  inventory: {
    getAllItems: "/inventory/items",                // GET ?type=
    getItemById: "/inventory/items",                // GET /:itemId
    updateItemInfor: "/inventory/items",      
    updateStockBatch:"/inventory/adjustment",           // PATCH /:itemId
    stockIn: "/inventory/stock-in",
    addBatch: "/inventory/items/{itemId}/batches",

  },

};
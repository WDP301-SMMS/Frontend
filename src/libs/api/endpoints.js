import { update } from "lodash";
import { classes } from "~/mock/mock"

export const endpoints = {
  user: {
    getProfile: "/user/me",           // GET /user/me
    updateProfile: "/user/me",        // PUT /user/me
    getAll: "/admin/users",                               // GET
    updateStatus: "/admin/users/{userId}/status",
    getProfile: "/user/me", // GET /user/me
    updateProfile: "/user/me", // PUT /user/me
    getAll: "/admin/users", // GET
    updateStatus: "/admin/users/{userId}/status",
  },
  students: {
    getAll: "/admin/students",                            // GET
    create: "/admin/students",                            // POST
  },
  classes: {
    getAll: "/admin/classes",                             // GET
    create: "/admin/classes",                             // POST
    getById: "/admin/classes/{classId}",                  // GET  
  },
  auth: {
    login: "/auth/login", // POST /auth/login
    register: "/auth/register", // POST /auth/register
    forgotPass: "/auth/forgot-password", // POST /auth/forgot-password
    verifyOTP: "/auth/verify-otp", // POST /auth/verify-otp
    resetPassword: "/auth/reset-password", // POST /auth/reset-password
  },
  campaign: {
    activeCampaign: "/vaccinationCampaigns/{campaignId}/dispatch", // POST
    getListCampaign: "/vaccinationCampaigns", // GET
    getCampaign: "/vaccinationCampaigns/{campaignId}", // GET
    cancelCampaign: "/vaccinationCampaigns/{campaignId}", //PATCH
    listRegistrants: "/vaccinationCampaigns/campaigns/{campaignId}/registrants", //GET
    listVaccination: "/vaccinationCampaigns/campaigns/{campaignId}/checklist", //GET
    getPartnerById: "/admin/partners/{partnerId}", //GET
    injectionRecord: "/vaccinationCampaigns/records", //POSt
    getListPartner: "/admin/partners", //GET
    addCampaign: "/vaccinationCampaigns", //POST
    observations: "/vaccinationCampaigns/records/{consentId}/observations",

    StudentImmunizationHistory:
      "/reports/students/{studentId_ToRecord}/vaccination-history",
  },
  healthCheck: {
    getTemplate: "/health-check/templates",
    addTemplate: "/health-check/templates",
    getDetailTemplate: "/health-check/templates/{id}",
    updateTemplate: "/health-check/templates/{id}",
    deleteTemplate: "/health-check/templates/{id}",
    setDefault: "/health-check/templates/set-default",



    getHealthCheckCampaigns: "/health-check/campaigns", // GET
    getHealthCheckCampaigns: "/health-check/campaigns", // GET
    createHealthCheckCampaign: "/health-check/campaigns", // POST
    searchHealthCheckCampaigns: "/health-check/campaigns/search", // GET
    getCampaignStatistics: "/health-check/campaigns/stats", // GET
    getCampaignsByStatus: "/health-check/campaigns/status/{status}", // GET
    getCampaignDetails: "/health-check/campaigns/{id}", // GET
    updateHealthCheckCampaign: "/health-check/campaigns/{id}", // PUT
    updateCampaignStatus: "/health-check/campaigns/{id}/status", // PATCH
    assignStaffToCampaign: "/health-check/campaigns/{id}/assignments", // PUT


    getAllConsents: "/health-check/consents", // GET
    getConsentsByCampaignId: "/health-check/consents/campaign/{campaignId}", // GET
    addStudentsToConsent: "/health-check/consents/campaign/add-students", // POST
    updateConsentStatus: "/health-check/consents/{consentId}/status", // PATCH

    // ✅ NEW: Health Check Records
    getHealthCheckRecordByStudent: "/health-check/record/{id}", // GET
    getLatestHealthCheckRecordByStudent: "/health-check/record/{id}/latest", // GET
    createHealthCheckResult: "/health-check/record/create-result", // POST
    updateHealthCheckRecord: "/health-check/record/result/{id}", // PUT
  },
  inventory: {
    getAllItems: "/inventory/items", // GET ?type=
    getItemById: "/inventory/items", // GET /:itemId
    updateItemInfor: "/inventory/items",
    updateStockBatch: "/inventory/adjustment", // PATCH /:itemId
    stockIn: "/inventory/stock-in",
    addBatch: "/inventory/items/{itemId}/batches",
  },
  incident: {
    getAllIncidents: "/incident",                             // GET: Lấy tất cả sự cố
    getMyIncidents: "/incident/nurse",                        // GET: Lấy sự cố của tôi (nurse)
    getIncidentById: "/incident/{incidentId}",                // GET: Lấy sự cố theo ID
    createIncident: "/incident",                              // POST: Tạo sự cố y tế
    updateIncident: "/incident/{incidentId}",                 // PATCH: Cập nhật sự cố

    getAllIncidentsToDispense: "/inventory/incidents-to-dispense", // GET: sự cố cần cấp phát
    dispenseIncident: "/inventory/incidents/{incidentId}/dispense", // POST: cấp phát thuốc
    dispenseHistory: "/inventory/dispense-history",                // GET: lịch sử cấp phát
  },
  partner: {
    createPartner: "/admin/partners", // POST
    getPartnerById: "/admin/partners/{partnerId}", // GET
    updatePartnerInfo: "/admin/partners/{partnerId}", // PATCH
    updatePartnerManager: "/admin/partners/{partnerId}/manager", // PUT
    updatePartnerStatus: "/admin/partners/{partnerId}/status", // PATCH
    addPartnerStaff: "/admin/partners/{partnerId}/staff", // POST
    deletePartnerStaff: "/admin/partners/{partnerId}/staff/{staffId}", // DELETE
  },
  medication: {
    create: "/medication/requests", // POST: Tạo yêu cầu uống thuốc
    getAll: "/medication/allRequests", // GET: Lấy tất cả yêu cầu (nurse)
    getById: "/medication/requests/{requestId}", // GET: Chi tiết yêu cầu
    getByParent: "/medication/requests/parent", // GET: Lấy yêu cầu theo phụ huynh
    updateInfo: "/medication/requests/{requestId}", // PATCH: cập nhật thời gian, file
    updateItems: "/medication/requests/{requestId}/items", // PATCH: cập nhật hoặc thêm thuốc
  }

};

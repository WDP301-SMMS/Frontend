export const endpoints = {
  user: {
    getProfile: "/user/me",
    updateProfile: "/user/me",
    getAll: "/admin/users",
    updateStatus: "/admin/users/{userId}/status",
    getAllUsers: "/admin/users",
    changePassword: '/user/me/change-password'
  },
  students: {
    getAll: "/admin/students",
    create: "/admin/students",
  },
  classes: {
    getAll: "/admin/classes",
    create: "/admin/classes",
    getById: "/admin/classes/{classId}",
  },
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    forgotPass: "/auth/forgot-password",
    verifyOTP: "/auth/verify-otp",
    resetPassword: "/auth/reset-password",
  },
  campaign: {
    activeCampaign: "/vaccinationCampaigns/{campaignId}/dispatch",
    getListCampaign: "/vaccinationCampaigns",
    getCampaign: "/vaccinationCampaigns/{campaignId}",
    cancelCampaign: "/vaccinationCampaigns/{campaignId}",
    listRegistrants: "/vaccinationCampaigns/campaigns/{campaignId}/registrants",
    listVaccination: "/vaccinationCampaigns/campaigns/{campaignId}/checklist",
    getPartnerById: "/admin/partners/{partnerId}",
    injectionRecord: "/vaccinationCampaigns/records",
    getListPartner: "/admin/partners",
    addCampaign: "/vaccinationCampaigns",
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

    getHealthCheckCampaigns: "/health-check/campaigns",
    createHealthCheckCampaign: "/health-check/campaigns",
    searchHealthCheckCampaigns: "/health-check/campaigns/search",
    getCampaignStatistics: "/health-check/campaigns/stats",
    getCampaignsByStatus: "/health-check/campaigns/status/{status}",
    getCampaignDetails: "/health-check/campaigns/{id}",
    updateHealthCheckCampaign: "/health-check/campaigns/{id}",
    updateCampaignStatus: "/health-check/campaigns/{id}/status",
    assignStaffToCampaign: "/health-check/campaigns/{id}/assignments",

    getAllConsents: "/health-check/consents",
    getConsentsByCampaignId: "/health-check/consents/campaign/{campaignId}",
    addStudentsToConsent: "/health-check/consents/campaign/add-students",
    updateConsentStatus: "/health-check/consents/{consentId}/status",

    getHealthCheckRecordByStudent: "/health-check/record/{id}",
    getLatestHealthCheckRecordByStudent: "/health-check/record/{id}/latest",
    createHealthCheckResult: "/health-check/record/create-result",
    updateHealthCheckRecord: "/health-check/record/result/{id}",
  },
  inventory: {
    getAllItems: "/inventory/items",
    getItemById: "/inventory/items",
    updateItemInfor: "/inventory/items",
    updateStockBatch: "/inventory/adjustment",
    stockIn: "/inventory/stock-in",
    addBatch: "/inventory/items/{itemId}/batches",
  },
  incident: {
    getAllIncidents: "/incident",
    getMyIncidents: "/incident/nurse",
    getIncidentById: "/incident/{incidentId}",
    createIncident: "/incident",
    updateIncident: "/incident/{incidentId}",

    getAllIncidentsToDispense: "/inventory/incidents-to-dispense",
    dispenseIncident: "/inventory/incidents/{incidentId}/dispense",
    dispenseHistory: "/inventory/dispense-history",
  },
  partner: {
    createPartner: "/admin/partners",
    getPartnerById: "/admin/partners/{partnerId}",
    updatePartnerInfo: "/admin/partners/{partnerId}",
    updatePartnerManager: "/admin/partners/{partnerId}/manager",
    updatePartnerStatus: "/admin/partners/{partnerId}/status",
    addPartnerStaff: "/admin/partners/{partnerId}/staff",
    deletePartnerStaff: "/admin/partners/{partnerId}/staff/{staffId}",
  },
  chat: {
    getAllMessagesByRoomId: "/messages/{roomId}",
    getAllRoomsByUserId: "/messages/user/{userId}",
    getAvailableUsers: "/messages/available-users",
    createOrFindRoom: "/messages/room/create",
  },
  medication: {
    create: "/medication/requests", // POST: Tạo yêu cầu uống thuốc
    getAll: "/medication/allRequests", // GET: Lấy tất cả yêu cầu (nurse)
    getById: "/medication/requests/{requestId}", // GET: Chi tiết yêu cầu
    getByParent: "/medication/requests/parent", // GET: Lấy yêu cầu theo phụ huynh
    updateInfo: "/medication/requests/{requestId}", // PATCH: cập nhật thời gian, file
    updateItems: "/medication/requests/{requestId}/items", // PATCH: cập nhật hoặc thêm thuốc
  },
  medicationSchedule: {
    createMany: "/medication/schedules", // POST: Tạo nhiều lịch uống thuốc
    updateStatus: "/medication/schedules/update/{scheduleId}", // PATCH: Cập nhật trạng thái lịch uống thuốc
    getByRequestId: "/medication/schedules/request/{requestId}", // GET: Lấy lịch theo Request ID
    getByStudentId: "/medication/schedules/student/{studentId}", // GET: Lấy lịch theo Student ID
  },
  appointments: {
    getStudentsWithAbnormalResults: "/appointments/students/abnormal-results/{campaignId}", // GET
    getAppointments: "/appointments", // GET
    createAppointment: "/appointments", // POST
    updateAppointmentStatus: "/appointments/{appointmentId}/status", // PATCH
    addAfterMeetingNotes: "/appointments/{appointmentId}/notes", // PATCH
  },


};

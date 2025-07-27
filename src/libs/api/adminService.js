import api from "../hooks/axiosInstance";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Admin - Dashboard
export const getDashboardData = async () => {
  try {
    const response = await api.get(`${API_URL}/admin/dashboard`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Admin - User Management
export const getAllUsers = async (params) => {
  try {
    const response = await api.get(`${API_URL}/admin/users`, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserStatus = async (userId, statusData) => {
  try {
    const response = await api.patch(
      `${API_URL}/admin/users/${userId}/status`,
      statusData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Admin - Student Management
export const getAllStudents = async (params) => {
  try {
    const response = await api.get(`${API_URL}/admin/students`, { params });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const createStudent = async (studentData) => {
  try {
    const response = await api.post(`${API_URL}/admin/students`, studentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateStudent = async (studentId, studentData) => {
  try {
    const response = await api.put(
      `${API_URL}/admin/students/${studentId}`,
      studentData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Admin - Class Management
export const getAllClasses = async (params) => {
  try {
    const response = await api.get(`${API_URL}/admin/classes`, { params });
    
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const createClass = async (classData) => {
  try {
    const response = await api.post(`${API_URL}/admin/classes`, classData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addStudentsToClass = async (classId, studentIds) => {
  try {
    const response = await api.patch(
      `${API_URL}/admin/classes/${classId}/add-students`,
      { studentIds }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeStudentsFromClass = async (classId, studentIds) => {
  try {
    const response = await api.patch(
      `${API_URL}/admin/classes/${classId}/remove-students`,
      { studentIds }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Admin - Partner Management
export const getAllPartners = async (params) => {
  try {
    const response = await api.get(`${API_URL}/admin/partners`, { params });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const createPartner = async (partnerData) => {
  try {
    const response = await api.post(`${API_URL}/admin/partners`, partnerData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPartnerById = async (partnerId) => {
  try {
    const response = await api.get(`${API_URL}/admin/partners/${partnerId}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const updatePartner = async (partnerId, partnerData) => {
  try {
    const response = await api.patch(
      `${API_URL}/admin/partners/${partnerId}`,
      partnerData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePartnerStatus = async (partnerId, statusData) => {
  try {
    const response = await api.patch(
      `${API_URL}/admin/partners/${partnerId}/status`,
      statusData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addPartnerStaff = async (partnerId, staffData) => {
  try {
    const response = await api.post(
      `${API_URL}/admin/partners/${partnerId}/staff`,
      staffData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePartnerStaff = async (partnerId, staffId) => {
  try {
    const response = await api.delete(
      `${API_URL}/admin/partners/${partnerId}/staff/${staffId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const replacePartnerManager = async (partnerId, managerData) => {
  try {
    const response = await api.put(
      `${API_URL}/admin/partners/${partnerId}/manager`,
      managerData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Admin - Inventory Management
export const getInventoryItems = async (params) => {
  try {
    const response = await api.get(`${API_URL}/admin/inventory`, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

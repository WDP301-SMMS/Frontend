import api from "~/libs/hooks/axiosInstance";
import { endpoints } from "../endpoints";

class HealthCheckTemplateService {
  /**
   * Lấy danh sách tất cả các mẫu khám sức khỏe.
   * GET /admin/health-check-templates
   * @param {object} params - Tham số truy vấn.
   * @param {number} [params.page=1] - Số trang (mặc định là 1).
   * @param {number} [params.limit=10] - Số lượng mục trên mỗi trang (mặc định là 10).
   * @param {string} [params.search=''] - Chuỗi tìm kiếm.
   * @returns {Promise<object>} Dữ liệu phản hồi từ API.
   */
  async getListHealthCheckTemplates({ page = 1, limit = 10, search = '' } = {}) {
    try {
      // Sử dụng endpoint cho việc lấy danh sách
      const baseUrl = endpoints.healthCheck.getTemplate;
      const url = `${baseUrl}?page=${page}&limit=${limit}${
        search ? `&search=${encodeURIComponent(search)}` : ''
      }`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Get health check template list failed:', error);
      throw error;
    }
  }

  /**
   * Lấy thông tin chi tiết của một mẫu khám sức khỏe theo ID.
   * GET /admin/health-check-templates/{templateId}
   * @param {string} templateId - ID của mẫu khám sức khỏe.
   * @returns {Promise<object>} Dữ liệu chi tiết của mẫu khám sức khỏe.
   */
  async getHealthCheckTemplateById(templateId) {
    try {
      // Thay thế {templateId} trong chuỗi endpoint bằng giá trị templateId thực tế
      const url = endpoints.healthCheck.getDetailTemplate.replace('{templateId}', templateId);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error(`Get health check template with ID ${templateId} failed:`, error);
      throw error;
    }
  }

  /**
   * Tạo một mẫu khám mới.
   * POST /admin/health-check-templates
   * @param {object} templateData - Dữ liệu của mẫu khám sức khỏe mới.
   * @param {string} templateData.name - Tên của mẫu khám.
   * @param {string} templateData.description - Mô tả của mẫu khám.
   * @param {Array<object>} templateData.checkupItems - Danh sách các mục kiểm tra.
   * @param {string} templateData.checkupItems[].itemId - ID của mục kiểm tra.
   * @param {string} templateData.checkupItems[].itemName - Tên của mục kiểm tra.
   * @param {string} templateData.checkupItems[].unit - Đơn vị.
   * @param {string} templateData.checkupItems[].dataType - Kiểu dữ liệu (ví dụ: "NUMBER", "STRING").
   * @param {string} templateData.checkupItems[].guideline - Hướng dẫn.
   * @param {boolean} templateData.isDefault - Cờ mặc định.
   * @returns {Promise<object>} Dữ liệu của mẫu khám sức khỏe vừa được tạo.
   */
  async createHealthCheckTemplate(templateData) {
    try {
      // Sử dụng endpoint cho việc thêm mới
      const url = endpoints.healthCheck.addTemplate;
      const response = await api.post(url, templateData);
      return response.data;
    } catch (error) {
      console.error('Create health check template failed:', error);
      throw error;
    }
  }

  /**
   * Cập nhật thông tin một mẫu khám đã có.
   * PUT /admin/health-check-templates/{templateId}
   * @param {string} templateId - ID của mẫu khám sức khỏe cần cập nhật.
   * @param {object} updatedTemplateData - Dữ liệu cập nhật cho mẫu khám sức khỏe.
   * @param {string} updatedTemplateData.name - Tên của mẫu khám.
   * @param {string} updatedTemplateData.description - Mô tả của mẫu khám.
   * @param {Array<object>} updatedTemplateData.checkupItems - Danh sách các mục kiểm tra.
   * @param {string} updatedTemplateData.checkupItems[].itemId - ID của mục kiểm tra.
   * @param {string} updatedTemplateData.checkupItems[].itemName - Tên của mục kiểm tra.
   * @param {string} updatedTemplateData.checkupItems[].unit - Đơn vị.
   * @param {string} updatedTemplateData.checkupItems[].dataType - Kiểu dữ liệu (ví dụ: "NUMBER", "STRING").
   * @param {string} updatedTemplateData.checkupItems[].guideline - Hướng dẫn.
   * @param {boolean} updatedTemplateData.isDefault - Cờ mặc định.
   * @returns {Promise<object>} Dữ liệu của mẫu khám sức khỏe đã được cập nhật.
   */
  async updateHealthCheckTemplate(templateId, updatedTemplateData) {
    try {
      // Thay thế {templateId} trong chuỗi endpoint bằng giá trị templateId thực tế
      const url = endpoints.healthCheck.updateTemplate.replace('{templateId}', templateId);
      const response = await api.put(url, updatedTemplateData);
      return response.data;
    } catch (error) {
      console.error(`Update health check template with ID ${templateId} failed:`, error);
      throw error;
    }
  }

  /**
   * Xóa một mẫu khám.
   * DELETE /admin/health-check-templates/{templateId}
   * @param {string} templateId - ID của mẫu khám sức khỏe cần xóa.
   * @returns {Promise<object>} Dữ liệu phản hồi từ API (thường là rỗng hoặc thông báo thành công).
   */
  async deleteHealthCheckTemplate(templateId) {
    try {
      // Thay thế {templateId} trong chuỗi endpoint bằng giá trị templateId thực tế
      const url = endpoints.healthCheck.deleteTemplate.replace('{templateId}', templateId);
      const response = await api.delete(url);
      return response.data;
    } catch (error) {
      console.error(`Delete health check template with ID ${templateId} failed:`, error);
      throw error;
    }
  }
}

export const healthCheckTemplateService = new HealthCheckTemplateService();
export default healthCheckTemplateService;
import api from "~/libs/hooks/axiosInstance";
import { endpoints } from "../endpoints";

class InventoryService {
  // 1. Lấy danh sách item theo type, status, search
  async getInventoryItems({ type = "MEDICINE", status, search } = {}) {
    try {
      const url = `${endpoints.inventory.getAllItems}?type=${type}${
        status ? `&status=${status}` : ""
      }${search ? `&search=${encodeURIComponent(search)}` : ""}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("Get Inventory Items failed:", error);
      throw error;
    }
  }

  // 2. Lấy thông tin chi tiết 1 item theo ID
  async getItemById(itemId) {
    try {
      const url = `${endpoints.inventory.getItemById}/${itemId}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("Get Item by ID failed:", error);
      throw error;
    }
  }

  // 3. Cập nhật thông tin item
  async updateItem(itemId, payload) {
    try {
      const url = `${endpoints.inventory.updateItemInfor}/${itemId}`;
      const response = await api.patch(url, payload);
      return response.data;
    } catch (error) {
      console.error("Update Item failed:", error);
      throw error;
    }
  }

  // 4. Nhập kho (thêm mới 1 item)
  async stockIn(payload) {
    try {
      const url = endpoints.inventory.stockIn;
      const response = await api.post(url, payload);
      return response.data;
    } catch (error) {
      console.error("Stock In failed:", error);
      throw error;
    }
  }

  // 5. Thêm batch mới cho 1 item
  async addBatch(itemId, payload) {
    try {
      const url = endpoints.inventory.addBatch.replace("{itemId}", itemId);
      const response = await api.post(url, payload);
      return response.data;
    } catch (error) {
      console.error("Add Batch failed:", error);
      throw error;
    }
  }

  // 6. Điều chỉnh số lượng trong batch (ví dụ: hết hạn, lỗi, hủy)
  async updateStockBatch(payload) {
    try {
      const url = endpoints.inventory.updateStockBatch;
      const response = await api.patch(url, payload);
      return response.data;
    } catch (error) {
      console.error("Update Stock Batch failed:", error);
      throw error;
    }
  }
}

export const inventoryService = new InventoryService();
export default inventoryService;

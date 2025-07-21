import api from "~/libs/hooks/axiosInstance";
import { endpoints } from "../endpoints";

class chatService {
  async getAllMessagesByRoomId(roomId) {
    try {
      const url = endpoints.chat.getAllMessagesByRoomId.replace(
        "{roomId}",
        roomId
      );
      const response = await api.get(url);

      return response.data;
    } catch (error) {
      console.error("Get messages error:", error.status);
      return {
        success: false,
        error: error.response?.data?.message || "Không thể lấy tin nhắn",
        statusCode: error.response?.status,
      };
    }
  }

  async getAllRoomsByUserId(userId) {
    try {
      const url = endpoints.chat.getAllRoomsByUserId.replace(
        "{userId}",
        userId
      );
      const response = await api.get(url);
      if (response.status !== 200) {
        return {
          success: false,
          error: "Không thể lấy danh sách phòng chat",
          statusCode: response.status,
        };
      }

      return response.data;
    } catch (error) {
      console.error("Get rooms error:", error);
      return {
        success: false,
        error: "Không thể lấy phòng chat",
        statusCode: error?.status,
      };
    }
  }

  async getAvailableUsers() {
    try {
      const response = await api.get(endpoints.chat.getAvailableUsers);
      
      if (response.status !== 200) {
        return {
          success: false,
          error: "Không thể lấy danh sách người dùng khả dụng",
          statusCode: response.status,
        };
      }

      return response.data;
    } catch (error) {
      console.error("Get available users error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Không thể lấy danh sách người dùng",
        statusCode: error.response?.status,
      };
    }
  }

  async createOrFindRoom(participantId) {
    try {
      const response = await api.post(endpoints.chat.createOrFindRoom, {
        participantId
      });

      if (response.status !== 200 && response.status !== 201) {
        return {
          success: false,
          error: "Không thể tạo hoặc tìm phòng chat",
          statusCode: response.status,
        };
      }

      return response.data;
    } catch (error) {
      console.error("Create/find room error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Không thể tạo hoặc tìm phòng chat",
        statusCode: error.response?.status,
      };
    }
  }
}

export default new chatService();

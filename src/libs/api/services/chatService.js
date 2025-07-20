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
      console.error("Get messages error:", error);
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

      return response.data;
    } catch (error) {
      console.error("Get rooms error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Không thể lấy phòng chat",
        statusCode: error.response?.status,
      };
    }
  }
}

export default new chatService();

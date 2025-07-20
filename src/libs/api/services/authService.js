import api from "~/libs/hooks/axiosInstance";
import { endpoints } from "../endpoints";

class AuthService {
  /**
   * POST /auth/login - Đăng nhập
   */
  async login(data) {
    try {
      const res = await api.post(endpoints.auth.login, data);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  async register(data) {
    try {
      const res = await api.post(endpoints.auth.register, data);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  openGoogleLoginPopup() {
    return new Promise((resolve, reject) => {
      const hasLoggedInBefore =
        localStorage.getItem("hasGoogleLoggedIn") === "true";
      const width = 500;
      const height = 600;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;
      const origin =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

      const url = hasLoggedInBefore
        ? `${origin}/auth/google?silent=true`
        : `${origin}/auth/google`;

      const popup = window.open(
        url,
        "_blank",
        `width=${width},height=${height},left=${left},top=${top},resizable=no`
      );

      if (!popup) {
        reject(new Error("Không thể mở popup Google"));
        return;
      }

      const handleMessage = (event) => {
        if (event.origin !== "http://localhost:3000") return;
        window.removeEventListener("message", handleMessage);
        resolve(event.data);
      };

      window.addEventListener("message", handleMessage);
    });
  }

  async forgotPassword(data) {
    try {
      const res = await api.post(endpoints.auth.forgotPass, data);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  async verifyOTP(data) {
    try {
      const res = await api.post(endpoints.auth.verifyOTP, data);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }

  async resetPassword(data) {
    try {
      const res = await api.post(endpoints.auth.resetPassword, data);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }
}

export const authService = new AuthService();
export default authService;

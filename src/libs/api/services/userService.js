import api from "~/libs/hooks/axiosInstance";
import { endpoints } from "../endpoints";

export const userService = {
  /**
   * GET /user/me - Lấy thông tin profile
   */
  getProfile: async () => {
    try {
      const response = await api.get(endpoints.user.getProfile);

      return {
        success: true,
        data: response.data,
        message: "Lấy thông tin profile thành công",
      };
    } catch (error) {
      console.error("Get profile error:", error);

      return {
        success: false,
        error:
          error.response?.data?.message || "Không thể lấy thông tin profile",
        statusCode: error.response?.status,
      };
    }
  },

  /**
   * PUT /user/me - Cập nhật thông tin profile
   * Body: { username, dob, phone }
   */
  updateProfile: async (profileData) => {
    try {
      // Validate dữ liệu đầu vào
      if (!profileData || typeof profileData !== "object") {
        return {
          success: false,
          error: "Dữ liệu profile không hợp lệ",
        };
      }

      // Validate các trường theo API schema
      const errors = [];

      if (profileData.username && typeof profileData.username !== "string") {
        errors.push("Username phải là chuỗi ký tự");
      }

      if (profileData.dob) {
        // Validate format dd/MM/yyyy
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dateRegex.test(profileData.dob)) {
          errors.push("Ngày sinh phải có định dạng dd/MM/yyyy");
        } else {
          // Validate ngày có hợp lệ không
          const parts = profileData.dob.split("/");
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10);
          const year = parseInt(parts[2], 10);
          const date = new Date(year, month - 1, day);

          if (
            date.getDate() !== day ||
            date.getMonth() !== month - 1 ||
            date.getFullYear() !== year
          ) {
            errors.push("Ngày sinh không hợp lệ");
          }
        }
      }

      if (profileData.phone) {
        // Validate số điện thoại
        const phoneRegex = /^[+]?[\d\s\-()]{10,15}$/;
        if (!phoneRegex.test(profileData.phone.replace(/\s/g, ""))) {
          errors.push("Số điện thoại không hợp lệ");
        }
      }

      if (profileData.gender) {
        // Validate gender
        const validGenders = ["Male", "Female", "Other"];
        if (
          typeof profileData.gender !== "string" ||
          !validGenders.includes(profileData.gender)
        ) {
          errors.push(
            "Giới tính phải là một trong các giá trị: Male, Female, Other"
          );
        }
      }

      if (errors.length > 0) {
        return {
          success: false,
          error: "Dữ liệu không hợp lệ",
          validationErrors: errors,
        };
      }

      const response = await api.put(endpoints.user.updateProfile, profileData);

      return {
        success: true,
        data: response.data,
        message: "Cập nhật profile thành công",
      };
    } catch (error) {
      console.error("Update profile error:", error);

      return {
        success: false,
        error: error.response?.data?.message || "Không thể cập nhật profile",
        statusCode: error.response?.status,
        validationErrors: error.response?.data?.errors,
      };
    }
  },

  /**
   * Upload avatar
   */
  uploadAvatar: async (file) => {
    try {
      if (!file) {
        return {
          success: false,
          error: "Vui lòng chọn file ảnh",
        };
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        return {
          success: false,
          error: "Chỉ chấp nhận file ảnh (JPG, PNG, GIF)",
        };
      }

      // Validate file size (5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        return {
          success: false,
          error: "File ảnh không được vượt quá 5MB",
        };
      }

      const formData = new FormData();
      formData.append("avatar", file);

      const response = await api.post("/user/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        success: true,
        data: response.data,
        message: "Upload avatar thành công",
      };
    } catch (error) {
      console.error("Upload avatar error:", error);

      return {
        success: false,
        error: error.response?.data?.message || "Không thể upload avatar",
        statusCode: error.response?.status,
      };
    }
  },

  getAllUsers: async (role, searchTerm) => {
    try {
      const response = await api.get(endpoints.user.getAllUsers, {
        params: { role, status: "active", search: searchTerm },
      });

      return response.data;
    } catch (error) {
      console.error("Get all users error:", error);

      return {
        success: false,
        error:
          error.response?.data?.message || "Không thể lấy danh sách người dùng",
        statusCode: error.response?.status,
      };
    }
  },
};

import api from "~/libs/hooks/axiosInstance";

class UploadService {
  async uploadFile(file) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to upload file");
      }

      return response.data;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }
}

export default new UploadService();

import api from "~/libs/hooks/axiosInstance";

class UploadService {
  async uploadFile(file) {
    try {
      if (!file) {
        throw new Error("No file provided for upload");
      }
      
      if (!(file instanceof File)) {
        throw new Error("Invalid file object provided");
      }

      
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status !== 200) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      return response.data;
    } catch (error) {
      console.error("Error uploading file:", error);
      if (error.response) {
        console.error("Upload error response:", error.response.data);
        console.error("Upload error status:", error.response.status);
      }
      throw error;
    }
  }
}

export default new UploadService();

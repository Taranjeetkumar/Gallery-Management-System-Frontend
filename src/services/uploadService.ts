import { apiService } from "./api";
import type { UploadedFile } from "@/store/slices/uploadSlice";

class UploadService {
  async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<{ url: string; id: string }> {
    const formData = new FormData();
    formData.append("file", file);

    return await apiService.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent:any) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  }

  async getUploadedFiles(params: any): Promise<{ files: UploadedFile[] }> {
    return await apiService.get("/upload/files", { params });
  }

  async deleteFile(fileId: string): Promise<void> {
    return await apiService.delete(`/upload/files/${fileId}`);
  }
}

export const uploadService = new UploadService();
export default uploadService;

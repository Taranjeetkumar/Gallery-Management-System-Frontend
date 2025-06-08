import { apiService } from "./api";
import type { Gallery, GalleryFormData } from "@/store/slices/gallerySlice";

class GalleryService {
  async getGalleries(params: any) {
    return await apiService.get("/galleries", { params });
  }

  async getGalleryById(id: number): Promise<Gallery> {
    return await apiService.get(`/galleries/${id}`);
  }

  async createGallery(data: GalleryFormData): Promise<Gallery> {
    return await apiService.post("/galleries", data);
  }

  async updateGallery(id: number, data: Partial<GalleryFormData>): Promise<Gallery> {
    return await apiService.put(`/galleries/${id}`, data);
  }

  async deleteGallery(id: number): Promise<void> {
    return await apiService.delete(`/galleries/${id}`);
  }

  async uploadLogo(id: number, logoFile: File): Promise<Gallery> {
    const formData = new FormData();
    formData.append("logo", logoFile);

    return await apiService.post(`/galleries/${id}/logo`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }
}

export const galleryService = new GalleryService();
export default galleryService;

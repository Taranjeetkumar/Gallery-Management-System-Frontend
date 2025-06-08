import { apiService } from "./api";
import type { Artwork, ArtworkFormData } from "@/store/slices/artworksSlice";

class ArtworkService {
  async getArtworks(params: any) {
    const response = await apiService.get("/artworks", { params });
    return response?.data;
  }

  async getArtworkById(id: number): Promise<Artwork> {
    const response = await apiService.get(`/artworks/${id}`);
    return response?.data;
  }

  async getFeaturedArtworks(limit: number): Promise<Artwork[]> {
    const response = await apiService.get(`/artworks/featured?limit=${limit}`);
    return response?.data;
  }

  async createArtwork(
    data: ArtworkFormData & { imageFile: File }
  ): Promise<Artwork> {
    const formData = new FormData();
    formData.append("imageFile", data.imageFile);

    // Add other fields
    Object.keys(data).forEach((key) => {
      if (key !== "imageFile") {
        formData.append(key, (data as any)[key]);
      }
    });

    const response = await apiService.post("/artworks", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response?.data;
  }

  async updateArtwork(
    id: number,
    data: Partial<ArtworkFormData>
  ): Promise<Artwork> {
    const response = await apiService.put(`/artworks/${id}`, data);
    return response?.data;
  }

  async deleteArtwork(id: number): Promise<void> {
    const response = await apiService.delete(`/artworks/${id}`);
    return response?.data;
  }

  async incrementViewCount(
    id: number
  ): Promise<{ id: number; viewCount: number }> {
    const response = await apiService.post(`/artworks/${id}/view`);
    return response?.data;
  }
}

export const artworkService = new ArtworkService();
export default artworkService;

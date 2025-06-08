import { apiService } from "./api";
import type { Artist, ArtistFormData } from "@/store/slices/artistsSlice";

class ArtistService {
  async getArtists(params: any) {
    const response = await apiService.get("/artists", { params });
    return response?.data;
  }

  async getArtistById(id: number): Promise<Artist> {
    const response = await apiService.get(`/artists/${id}`);
    return response?.data;
  }

  async createArtist(data: ArtistFormData): Promise<Artist> {
    const response = await apiService.post("/artists", data);
    return response?.data;
  }

  async updateArtist(
    id: number,
    data: Partial<ArtistFormData>
  ): Promise<Artist> {
    const response = await apiService.put(`/artists/${id}`, data);
    return response?.data;
  }

  async deleteArtist(id: number): Promise<void> {
    const response = await apiService.delete(`/artists/${id}`);
    return response?.data;
  }
}

export const artistService = new ArtistService();
export default artistService;

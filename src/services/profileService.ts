import { apiService } from "./api";
import type {
  User
} from "@/types/user";

class ProfileService {
 
  // Update user profile
  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await apiService.put<User>("/users/profile", userData);
    return response?.data;
  }

   // Get user profile
    async getCurrentUserProfile(): Promise<User> {
      const response = await apiService.get<User>("/users/profile");
      return response?.data;
    }
}

export const profileService = new ProfileService();
export default profileService;

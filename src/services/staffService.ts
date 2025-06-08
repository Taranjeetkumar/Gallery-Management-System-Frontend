import { apiService } from "./api";
import type { Staff, StaffFormData } from "@/store/slices/staffSlice";

class StaffService {
  async getStaff(params: any) {
    return await apiService.get("/staff", { params });
  }

  async getStaffById(id: number): Promise<Staff> {
    return await apiService.get(`/staff/${id}`);
  }

  async createStaff(data: StaffFormData): Promise<Staff> {
    return await apiService.post("/staff", data);
  }

  async updateStaff(id: number, data: Partial<StaffFormData>): Promise<Staff> {
    return await apiService.put(`/staff/${id}`, data);
  }

  async deleteStaff(id: number): Promise<void> {
    return await apiService.delete(`/staff/${id}`);
  }
}

export const staffService = new StaffService();
export default staffService;

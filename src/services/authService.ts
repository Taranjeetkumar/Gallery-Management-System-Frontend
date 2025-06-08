import { apiService } from "./api";
import type {
  AuthResponse,
  LoginCredentials,
  SignupData,
  User,
  ResetPasswordRequest,
  ResetPasswordConfirm,
} from "@/types/auth";

class AuthService {
  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>("/auth/login", credentials);
    return response?.data;
  }

  // Register new user
  async signup(signupData: SignupData): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>("/auth/signup", signupData);
    return response?.data;
  }

  // Logout user
  async logout(): Promise<void> {
    await apiService.post("/auth/logout");
  }

  // Get current user
  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<User>("/auth/me");
    return response?.data;
  }

  // Refresh token
  async refreshToken(): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>("/auth/refresh");
    return response?.data;
  }

  // Request password reset
  async requestPasswordReset(data: ResetPasswordRequest): Promise<{ message: string }> {
    const response = await apiService.post("/auth/forgot-password", data);
    return response?.data;
  }

  // Confirm password reset
  async confirmPasswordReset(data: ResetPasswordConfirm): Promise<{ message: string }> {
    const response = await apiService.post("/auth/reset-password", data);
    return response?.data;
  }

  // Update user profile
  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await apiService.put<User>("/auth/profile", userData);
    return response?.data;
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const response = await apiService.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return response?.data;
  }
}

export const authService = new AuthService();
export default authService;

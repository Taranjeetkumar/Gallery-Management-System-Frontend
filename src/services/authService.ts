import type {
  AuthResponse,
  LoginCredentials,
  SignupData,
  User,
  UserRole,
} from "@/types/auth";
import { apiService } from "./api";

// Mock users database for development
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "admin@artcloud.com",
    firstName: "Admin",
    lastName: "User",
    role: "ADMIN" as UserRole,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    email: "gallery@artcloud.com",
    firstName: "Gallery",
    lastName: "Manager",
    role: "GALLERY_MANAGER" as UserRole,
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    email: "artist@artcloud.com",
    firstName: "John",
    lastName: "Artist",
    role: "ARTIST" as UserRole,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    email: "customer@artcloud.com",
    firstName: "Jane",
    lastName: "Customer",
    role: "CUSTOMER" as UserRole,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock delay to simulate network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class AuthService {
  private useMockData = false; // Set to true for testing without backend

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (this.useMockData) {
      return this.mockLogin(credentials);
    }
    return apiService.post<AuthResponse>("/auth/login", credentials);
  }

  async signup(data: SignupData): Promise<AuthResponse> {
    if (this.useMockData) {
      return this.mockSignup(data);
    }
    return apiService.post<AuthResponse>("/auth/signup", data);
  }

  async logout(): Promise<void> {
    if (this.useMockData) {
      await delay(500);
      return;
    }
    return apiService.post<void>("/auth/logout");
  }

  async refreshToken(): Promise<AuthResponse> {
    if (this.useMockData) {
      return this.mockRefreshToken();
    }
    return apiService.post<AuthResponse>("/auth/refresh");
  }

  async getCurrentUser(): Promise<User> {
    if (this.useMockData) {
      return this.mockGetCurrentUser();
    }
    return apiService.get<User>("/auth/me");
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    if (this.useMockData) {
      return this.mockUpdateProfile(data);
    }
    return apiService.put<User>("/auth/profile", data);
  }

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    if (this.useMockData) {
      await delay(800);
      if (data.newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      return;
    }
    return apiService.post<void>("/auth/change-password", data);
  }

  async forgotPassword(email: string): Promise<void> {
    if (this.useMockData) {
      await delay(1000);
      const user = MOCK_USERS.find((u) => u.email === email);
      if (!user) {
        throw new Error("User not found");
      }
      return;
    }
    return apiService.post<void>("/auth/forgot-password", { email });
  }

  async resetPassword(data: {
    token: string;
    newPassword: string;
  }): Promise<void> {
    if (this.useMockData) {
      await delay(800);
      if (data.newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      return;
    }
    return apiService.post<void>("/auth/reset-password", data);
  }

  // Mock implementations
  private async mockLogin(
    credentials: LoginCredentials,
  ): Promise<AuthResponse> {
    await delay(1000);

    const user = MOCK_USERS.find((u) => u.email === credentials.email);
    if (!user) {
      throw new Error("User not found");
    }

    if (credentials.password.length < 3) {
      throw new Error("Invalid password");
    }

    const token = `mock-token-${user.id}-${Date.now()}`;

    return {
      user,
      token,
      refreshToken: `refresh-${token}`,
    };
  }

  private async mockSignup(data: SignupData): Promise<AuthResponse> {
    await delay(1200);

    const existingUser = MOCK_USERS.find((u) => u.email === data.email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const newUser: User = {
      id: String(MOCK_USERS.length + 1),
      email: data.email,
      firstName: data.fullname.split(" ")[0] || "User",
      lastName: data.fullname.split(" ").slice(1).join(" ") || "",
      role: "CUSTOMER" as UserRole,
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    MOCK_USERS.push(newUser);

    const token = `mock-token-${newUser.id}-${Date.now()}`;

    return {
      user: newUser,
      token,
      refreshToken: `refresh-${token}`,
    };
  }

  private async mockGetCurrentUser(): Promise<User> {
    await delay(800);

    // For demo, return the first user
    const user = MOCK_USERS[0];
    if (!user) {
      throw new Error("Not authenticated");
    }

    return user;
  }

  private async mockRefreshToken(): Promise<AuthResponse> {
    await delay(600);

    const user = MOCK_USERS[0];
    if (!user) {
      throw new Error("Not authenticated");
    }

    const token = `mock-token-${user.id}-${Date.now()}`;

    return {
      user,
      token,
      refreshToken: `refresh-${token}`,
    };
  }

  private async mockUpdateProfile(data: Partial<User>): Promise<User> {
    await delay(800);

    const user = MOCK_USERS[0];
    if (!user) {
      throw new Error("Not authenticated");
    }

    const updatedUser = { ...user, ...data };

    const userIndex = MOCK_USERS.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
      MOCK_USERS[userIndex] = updatedUser;
    }

    return updatedUser;
  }
}

export const authService = new AuthService();

export enum UserRole {
  ADMIN = "admin",
  GALLERY_OWNER = "gallery_owner",
  ARTIST = "ROLE_ARTIST",
  CUSTOMER = "customer",
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isEmailVerified: boolean;
  avatar?: string;
  phone?: string;
  bio?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RolePermissions {
  canManageGallery: boolean;
  canManageArtworks: boolean;
  canManageUsers: boolean;
  canViewAnalytics: boolean;
  canCreateExhibitions: boolean;
  canManageOrders: boolean;
  canAccessAdminPanel: boolean;
}

export const rolePermissions: Record<UserRole, RolePermissions> = {
  [UserRole.ADMIN]: {
    canManageGallery: true,
    canManageArtworks: true,
    canManageUsers: true,
    canViewAnalytics: true,
    canCreateExhibitions: true,
    canManageOrders: true,
    canAccessAdminPanel: true,
  },
  [UserRole.GALLERY_OWNER]: {
    canManageGallery: true,
    canManageArtworks: true,
    canManageUsers: false,
    canViewAnalytics: true,
    canCreateExhibitions: true,
    canManageOrders: true,
    canAccessAdminPanel: false,
  },
  [UserRole.ARTIST]: {
    canManageGallery: false,
    canManageArtworks: true, // Only their own artworks
    canManageUsers: false,
    canViewAnalytics: true, // Only their own analytics
    canCreateExhibitions: false,
    canManageOrders: false,
    canAccessAdminPanel: false,
  },
  [UserRole.CUSTOMER]: {
    canManageGallery: false,
    canManageArtworks: false,
    canManageUsers: false,
    canViewAnalytics: false,
    canCreateExhibitions: false,
    canManageOrders: false,
    canAccessAdminPanel: false,
  },
};

export const roleLabels: Record<UserRole, string> = {
  [UserRole.ADMIN]: "System Administrator",
  [UserRole.GALLERY_OWNER]: "Gallery Owner",
  [UserRole.ARTIST]: "Artist",
  [UserRole.CUSTOMER]: "Customer",
};

export const roleDescriptions: Record<UserRole, string> = {
  [UserRole.ADMIN]: "Full system access and user management",
  [UserRole.GALLERY_OWNER]: "Manage gallery operations and exhibitions",
  [UserRole.ARTIST]: "Showcase and manage your artwork",
  [UserRole.CUSTOMER]: "Browse and purchase artwork",
};

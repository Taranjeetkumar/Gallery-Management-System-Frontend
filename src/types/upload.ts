export interface FileUpload {
  id: string;
  file: File;
  progress: number;
  status: UploadStatus;
  url?: string;
  error?: string;
  createdAt: string;
}

export enum UploadStatus {
  PENDING = "PENDING",
  UPLOADING = "UPLOADING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface FileUploadResponse {
  success: boolean;
  fileId: string;
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  message?: string;
}

export interface AllowedFileTypes {
  images: string[];
  documents: string[];
  maxSize: number; // in bytes
}

export const ALLOWED_FILE_TYPES: AllowedFileTypes = {
  images: ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"],
  documents: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  maxSize: 10 * 1024 * 1024, // 10MB
};

export interface ImageResizeOptions {
  maxWidth: number;
  maxHeight: number;
  quality: number;
  format: "jpeg" | "png" | "webp";
}

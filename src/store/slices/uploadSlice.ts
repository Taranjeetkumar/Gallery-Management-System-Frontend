import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { uploadService } from "@/services/uploadService";

export interface UploadProgress {
  id: string;
  fileName: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
  url?: string;
}

export interface UploadedFile {
  id: string;
  fileName: string;
  originalName: string;
  size: number;
  mimeType: string;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: string;
  uploadedBy: {
    id: number;
    name: string;
  };
}

interface UploadState {
  uploads: UploadProgress[];
  uploadedFiles: UploadedFile[];
  isUploading: boolean;
  error: string | null;
  totalFiles: number;
  completedFiles: number;
  failedFiles: number;
}

const initialState: UploadState = {
  uploads: [],
  uploadedFiles: [],
  isUploading: false,
  error: null,
  totalFiles: 0,
  completedFiles: 0,
  failedFiles: 0,
};

// Async thunks
export const uploadFile = createAsyncThunk(
  "upload/uploadFile",
  async (
    { file, onProgress }: { file: File; onProgress?: (progress: number) => void },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const uploadId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Start upload
      dispatch(startUpload({
        id: uploadId,
        fileName: file.name
      }));

      const response = await uploadService.uploadFile(file, (progress) => {
        dispatch(updateUploadProgress({ id: uploadId, progress }));
        onProgress?.(progress);
      });

      dispatch(completeUpload({ id: uploadId, url: response.url }));
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Upload failed");
    }
  }
);

export const uploadMultipleFiles = createAsyncThunk(
  "upload/uploadMultipleFiles",
  async (
    { files, onProgress }: { files: File[]; onProgress?: (progress: number) => void },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const uploadPromises = files.map((file, index) => {
        const uploadId = `upload_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`;

        dispatch(startUpload({
          id: uploadId,
          fileName: file.name
        }));

        return uploadService.uploadFile(file, (progress) => {
          dispatch(updateUploadProgress({ id: uploadId, progress }));
        }).then(response => {
          dispatch(completeUpload({ id: uploadId, url: response.url }));
          return response;
        }).catch(error => {
          dispatch(failUpload({ id: uploadId, error: error.message }));
          throw error;
        });
      });

      const results = await Promise.allSettled(uploadPromises);
      const successful = results.filter(result => result.status === 'fulfilled');
      const failed = results.filter(result => result.status === 'rejected');
      onProgress?.(100);

      return {
        successful: successful.map(result => (result as PromiseFulfilledResult<any>).value),
        failed: failed.length,
        total: files.length
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Multiple upload failed");
    }
  }
);

export const fetchUploadedFiles = createAsyncThunk(
  "upload/fetchUploadedFiles",
  async (params: {
    page?: number;
    limit?: number;
    search?: string;
    mimeType?: string;
  }, { rejectWithValue }) => {
    try {
      return await uploadService.getUploadedFiles(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch uploaded files");
    }
  }
);

export const deleteUploadedFile = createAsyncThunk(
  "upload/deleteUploadedFile",
  async (fileId: string, { rejectWithValue }) => {
    try {
      await uploadService.deleteFile(fileId);
      return fileId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete file");
    }
  }
);

const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    startUpload: (state, action: PayloadAction<{ id: string; fileName: string }>) => {
      const upload: UploadProgress = {
        id: action.payload.id,
        fileName: action.payload.fileName,
        progress: 0,
        status: "pending",
      };
      state.uploads.push(upload);
      state.totalFiles += 1;
      state.isUploading = true;
    },
    updateUploadProgress: (state, action: PayloadAction<{ id: string; progress: number }>) => {
      const upload = state.uploads.find(u => u.id === action.payload.id);
      if (upload) {
        upload.progress = action.payload.progress;
        upload.status = "uploading";
      }
    },
    completeUpload: (state, action: PayloadAction<{ id: string; url: string }>) => {
      const upload = state.uploads.find(u => u.id === action.payload.id);
      if (upload) {
        upload.progress = 100;
        upload.status = "completed";
        upload.url = action.payload.url;
        state.completedFiles += 1;
      }

      // Check if all uploads are complete
      const activeUploads = state.uploads.filter(u => u.status === "uploading" || u.status === "pending");
      if (activeUploads.length === 0) {
        state.isUploading = false;
      }
    },
    failUpload: (state, action: PayloadAction<{ id: string; error: string }>) => {
      const upload = state.uploads.find(u => u.id === action.payload.id);
      if (upload) {
        upload.status = "error";
        upload.error = action.payload.error;
        state.failedFiles += 1;
      }

      // Check if all uploads are complete
      const activeUploads = state.uploads.filter(u => u.status === "uploading" || u.status === "pending");
      if (activeUploads.length === 0) {
        state.isUploading = false;
      }
    },
    removeUpload: (state, action: PayloadAction<string>) => {
      state.uploads = state.uploads.filter(upload => upload.id !== action.payload);
    },
    clearUploads: (state) => {
      state.uploads = [];
      state.isUploading = false;
      state.totalFiles = 0;
      state.completedFiles = 0;
      state.failedFiles = 0;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Upload file
    builder
      .addCase(uploadFile.pending, (state) => {
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state) => {
        // Success handled by completeUpload action
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isUploading = false;
      });

    // Upload multiple files
    builder
      .addCase(uploadMultipleFiles.pending, (state) => {
        state.error = null;
      })
      .addCase(uploadMultipleFiles.fulfilled, (state, action) => {
        state.isUploading = false;
        // Results handled by individual upload actions
      })
      .addCase(uploadMultipleFiles.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isUploading = false;
      });

    // Fetch uploaded files
    builder
      .addCase(fetchUploadedFiles.fulfilled, (state, action) => {
        state.uploadedFiles = action.payload.files;
      });

    // Delete uploaded file
    builder
      .addCase(deleteUploadedFile.fulfilled, (state, action) => {
        state.uploadedFiles = state.uploadedFiles.filter(file => file.id !== action.payload);
      });
  },
});

export const {
  startUpload,
  updateUploadProgress,
  completeUpload,
  failUpload,
  removeUpload,
  clearUploads,
  clearError,
} = uploadSlice.actions;

export default uploadSlice.reducer;

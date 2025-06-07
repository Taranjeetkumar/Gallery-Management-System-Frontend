import { apiService } from "@/services/api";
import type {
  FileUpload,
  FileUploadResponse,
  UploadProgress,
  UploadStatus,
} from "@/types/upload";
import {
  type PayloadAction,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

interface UploadState {
  uploads: FileUpload[];
  isUploading: boolean;
  uploadProgress: Record<string, UploadProgress>;
  error: string | null;
}

const initialState: UploadState = {
  uploads: [],
  isUploading: false,
  uploadProgress: {},
  error: null,
};

// Async thunk for file upload with progress tracking
export const uploadFile = createAsyncThunk(
  "upload/uploadFile",
  async (
    {
      file,
      additionalData,
      onProgress,
    }: {
      file: File;
      additionalData?: Record<string, any>;
      onProgress?: (progress: UploadProgress) => void;
    },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const fileId = `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Create upload entry
      dispatch(
        addUpload({
          id: fileId,
          file,
          progress: 0,
          status: UploadStatus.PENDING,
          createdAt: new Date().toISOString(),
        }),
      );

      // Update status to uploading
      dispatch(
        updateUploadStatus({ id: fileId, status: UploadStatus.UPLOADING }),
      );

      // API INTEGRATION POINT:
      // POST /api/upload/file
      // Content-Type: multipart/form-data
      // Body: FormData with file and additional data
      // Expected response: FileUploadResponse
      const response = await apiService.uploadFile<FileUploadResponse>(
        "/upload/file",
        file,
        additionalData,
      );

      // Update upload as completed
      dispatch(
        updateUploadStatus({ id: fileId, status: UploadStatus.COMPLETED }),
      );
      dispatch(updateUploadUrl({ id: fileId, url: response.url }));

      return { fileId, response };
    } catch (error: unknown) {
      const errorMessage =
        (error as any)?.response?.data?.message || "Upload failed";
      return rejectWithValue(errorMessage);
    }
  },
);

export const uploadMultipleFiles = createAsyncThunk(
  "upload/uploadMultipleFiles",
  async (files: File[], { dispatch, rejectWithValue }) => {
    try {
      const uploadPromises = files.map((file) =>
        dispatch(uploadFile({ file })),
      );

      const results = await Promise.allSettled(uploadPromises);
      return results;
    } catch (error: unknown) {
      return rejectWithValue("Failed to upload multiple files");
    }
  },
);

export const uploadArtworkImage = createAsyncThunk(
  "upload/uploadArtworkImage",
  async (
    { file, artworkData }: { file: File; artworkData: Record<string, any> },
    { rejectWithValue },
  ) => {
    try {
      // API INTEGRATION POINT:
      // POST /api/upload/artwork
      // Content-Type: multipart/form-data
      // Body: FormData with image file and artwork metadata
      // Expected response: FileUploadResponse with artwork-specific fields
      const response = await apiService.uploadFile<FileUploadResponse>(
        "/upload/artwork",
        file,
        artworkData,
      );

      return response;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as any)?.response?.data?.message || "Artwork upload failed",
      );
    }
  },
);

export const deleteUploadedFile = createAsyncThunk(
  "upload/deleteUploadedFile",
  async (fileId: string, { rejectWithValue }) => {
    try {
      // API INTEGRATION POINT:
      // DELETE /api/upload/file/{fileId}
      // Expected response: { success: boolean, message: string }
      await apiService.delete(`/upload/file/${fileId}`);
      return fileId;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as any)?.response?.data?.message || "Failed to delete file",
      );
    }
  },
);

const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    addUpload: (state, action: PayloadAction<FileUpload>) => {
      state.uploads.push(action.payload);
    },
    removeUpload: (state, action: PayloadAction<string>) => {
      state.uploads = state.uploads.filter(
        (upload) => upload.id !== action.payload,
      );
      delete state.uploadProgress[action.payload];
    },
    updateUploadProgress: (
      state,
      action: PayloadAction<{ id: string; progress: number }>,
    ) => {
      const { id, progress } = action.payload;
      const upload = state.uploads.find((u) => u.id === id);
      if (upload) {
        upload.progress = progress;
      }

      // Update progress tracking
      if (!state.uploadProgress[id]) {
        state.uploadProgress[id] = { loaded: 0, total: 0, percentage: 0 };
      }
      state.uploadProgress[id].percentage = progress;
    },
    updateUploadStatus: (
      state,
      action: PayloadAction<{ id: string; status: UploadStatus }>,
    ) => {
      const { id, status } = action.payload;
      const upload = state.uploads.find((u) => u.id === id);
      if (upload) {
        upload.status = status;
      }
    },
    updateUploadUrl: (
      state,
      action: PayloadAction<{ id: string; url: string }>,
    ) => {
      const { id, url } = action.payload;
      const upload = state.uploads.find((u) => u.id === id);
      if (upload) {
        upload.url = url;
      }
    },
    updateUploadError: (
      state,
      action: PayloadAction<{ id: string; error: string }>,
    ) => {
      const { id, error } = action.payload;
      const upload = state.uploads.find((u) => u.id === id);
      if (upload) {
        upload.error = error;
        upload.status = UploadStatus.FAILED;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    clearUploads: (state) => {
      state.uploads = [];
      state.uploadProgress = {};
    },
    clearCompletedUploads: (state) => {
      state.uploads = state.uploads.filter(
        (upload) =>
          upload.status !== UploadStatus.COMPLETED &&
          upload.status !== UploadStatus.FAILED,
      );
    },
    cancelUpload: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const upload = state.uploads.find((u) => u.id === id);
      if (upload && upload.status === UploadStatus.UPLOADING) {
        upload.status = UploadStatus.CANCELLED;
      }
    },
    retryUpload: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const upload = state.uploads.find((u) => u.id === id);
      if (upload && upload.status === UploadStatus.FAILED) {
        upload.status = UploadStatus.PENDING;
        upload.progress = 0;
        upload.error = undefined;
      }
    },
  },
  extraReducers: (builder) => {
    // Upload file
    builder
      .addCase(uploadFile.pending, (state) => {
        state.isUploading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.isUploading = false;
        const { fileId } = action.payload;
        const upload = state.uploads.find((u) => u.id === fileId);
        if (upload) {
          upload.progress = 100;
        }
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.isUploading = false;
        state.error = action.payload as string;
      });

    // Upload multiple files
    builder
      .addCase(uploadMultipleFiles.pending, (state) => {
        state.isUploading = true;
      })
      .addCase(uploadMultipleFiles.fulfilled, (state) => {
        state.isUploading = false;
      })
      .addCase(uploadMultipleFiles.rejected, (state, action) => {
        state.isUploading = false;
        state.error = action.payload as string;
      });

    // Upload artwork image
    builder
      .addCase(uploadArtworkImage.pending, (state) => {
        state.isUploading = true;
        state.error = null;
      })
      .addCase(uploadArtworkImage.fulfilled, (state) => {
        state.isUploading = false;
      })
      .addCase(uploadArtworkImage.rejected, (state, action) => {
        state.isUploading = false;
        state.error = action.payload as string;
      });

    // Delete uploaded file
    builder.addCase(deleteUploadedFile.fulfilled, (state, action) => {
      const fileId = action.payload;
      state.uploads = state.uploads.filter((upload) => upload.id !== fileId);
      delete state.uploadProgress[fileId];
    });
  },
});

export const {
  addUpload,
  removeUpload,
  updateUploadProgress,
  updateUploadStatus,
  updateUploadUrl,
  updateUploadError,
  clearError,
  clearUploads,
  clearCompletedUploads,
  cancelUpload,
  retryUpload,
} = uploadSlice.actions;

export default uploadSlice.reducer;

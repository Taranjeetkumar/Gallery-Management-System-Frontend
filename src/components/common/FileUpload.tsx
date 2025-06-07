"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  cancelUpload,
  clearError,
  removeUpload,
  retryUpload,
  uploadFile,
} from "@/store/slices/uploadSlice";
import { ALLOWED_FILE_TYPES, UploadStatus } from "@/types/upload";
import {
  Cancel,
  CheckCircle,
  CloudUpload,
  Delete,
  Error as ErrorIcon,
  Refresh,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Chip,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import type React from "react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploadProps {
  accept?: string[];
  multiple?: boolean;
  maxSize?: number;
  onUploadComplete?: (urls: string[]) => void;
  onUploadError?: (error: string) => void;
  disabled?: boolean;
  uploadType?: "artwork" | "gallery" | "general";
}

export const FileUpload: React.FC<FileUploadProps> = ({
  accept = ALLOWED_FILE_TYPES.images,
  multiple = true,
  maxSize = ALLOWED_FILE_TYPES.maxSize,
  onUploadComplete,
  onUploadError,
  disabled = false,
  uploadType = "general",
}) => {
  const dispatch = useAppDispatch();
  const { uploads, isUploading, error } = useAppSelector(
    (state) => state.upload,
  );
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      dispatch(clearError());

      for (const file of acceptedFiles) {
        try {
          const result = await dispatch(uploadFile({ file }));

          if (uploadFile.fulfilled.match(result)) {
            // Handle successful upload
            const { response } = result.payload;
            if (onUploadComplete) {
              onUploadComplete([response.url]);
            }
          }
        } catch (error) {
          console.error("Upload error:", error);
          if (onUploadError) {
            onUploadError("Upload failed");
          }
        }
      }
    },
    [dispatch, onUploadComplete, onUploadError],
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    onDrop,
    accept: accept.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize,
    multiple,
    disabled: disabled || isUploading,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  const handleRemoveUpload = (id: string) => {
    dispatch(removeUpload(id));
  };

  const handleCancelUpload = (id: string) => {
    dispatch(cancelUpload(id));
  };

  const handleRetryUpload = (id: string) => {
    const upload = uploads.find((u) => u.id === id);
    if (upload) {
      dispatch(retryUpload(id));
      dispatch(uploadFile({ file: upload.file }));
    }
  };

  const getStatusColor = (status: UploadStatus) => {
    switch (status) {
      case UploadStatus.COMPLETED:
        return "success";
      case UploadStatus.FAILED:
        return "error";
      case UploadStatus.UPLOADING:
        return "primary";
      case UploadStatus.CANCELLED:
        return "default";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: UploadStatus) => {
    switch (status) {
      case UploadStatus.COMPLETED:
        return <CheckCircle color="success" />;
      case UploadStatus.FAILED:
        return <ErrorIcon color="error" />;
      case UploadStatus.UPLOADING:
        return <CloudUpload color="primary" />;
      case UploadStatus.CANCELLED:
        return <Cancel color="disabled" />;
      default:
        return <CloudUpload />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <Box>
      {/* Drop Zone */}
      <Paper
        {...getRootProps()}
        sx={{
          border: "2px dashed",
          borderColor: isDragActive
            ? "primary.main"
            : isDragReject
              ? "error.main"
              : "grey.300",
          borderRadius: 2,
          p: 4,
          textAlign: "center",
          cursor: disabled ? "not-allowed" : "pointer",
          backgroundColor: dragActive
            ? "primary.lighter"
            : isDragReject
              ? "error.lighter"
              : "background.paper",
          transition: "all 0.3s ease",
          "&:hover": {
            borderColor: disabled ? "grey.300" : "primary.main",
            backgroundColor: disabled ? "background.paper" : "primary.lighter",
          },
        }}
      >
        <input {...getInputProps()} />
        <CloudUpload
          sx={{
            fontSize: 48,
            color: isDragActive ? "primary.main" : "grey.400",
            mb: 2,
          }}
        />
        <Typography variant="h6" gutterBottom>
          {isDragActive
            ? "Drop files here..."
            : "Drag & drop files here, or click to select"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Accepted formats:{" "}
          {accept.map((type) => type.split("/")[1]).join(", ")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Maximum file size: {formatFileSize(maxSize)}
        </Typography>
      </Paper>

      {/* File Rejections */}
      {fileRejections.length > 0 && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <Typography variant="subtitle2">Some files were rejected:</Typography>
          {fileRejections.map(({ file, errors }) => (
            <Typography key={file.name} variant="body2">
              {file.name}: {errors.map((e) => e.message).join(", ")}
            </Typography>
          ))}
        </Alert>
      )}

      {/* Global Upload Error */}
      {error && (
        <Alert
          severity="error"
          sx={{ mt: 2 }}
          onClose={() => dispatch(clearError())}
        >
          {error}
        </Alert>
      )}

      {/* Upload List */}
      {uploads.length > 0 && (
        <Paper sx={{ mt: 2, maxHeight: 400, overflow: "auto" }}>
          <List>
            {uploads.map((upload) => (
              <ListItem key={upload.id} divider>
                <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
                  {getStatusIcon(upload.status)}
                </Box>
                <ListItemText
                  primary={upload.file.name}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {formatFileSize(upload.file.size)}
                      </Typography>
                      {upload.status === UploadStatus.UPLOADING && (
                        <LinearProgress
                          variant="determinate"
                          value={upload.progress}
                          sx={{ mt: 1 }}
                        />
                      )}
                      {upload.error && (
                        <Typography variant="body2" color="error">
                          {upload.error}
                        </Typography>
                      )}
                    </Box>
                  }
                />
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip
                    label={upload.status}
                    size="small"
                    color={getStatusColor(upload.status) as any}
                  />
                  <ListItemSecondaryAction>
                    {upload.status === UploadStatus.UPLOADING && (
                      <IconButton
                        edge="end"
                        onClick={() => handleCancelUpload(upload.id)}
                        size="small"
                      >
                        <Cancel />
                      </IconButton>
                    )}
                    {upload.status === UploadStatus.FAILED && (
                      <IconButton
                        edge="end"
                        onClick={() => handleRetryUpload(upload.id)}
                        size="small"
                      >
                        <Refresh />
                      </IconButton>
                    )}
                    <IconButton
                      edge="end"
                      onClick={() => handleRemoveUpload(upload.id)}
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </Box>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

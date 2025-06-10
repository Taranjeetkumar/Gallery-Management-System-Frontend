"use client";

import React, { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { createArtwork } from "@/store/slices/artworksSlice";
import { fetchGalleries } from "@/store/slices/gallerySlice";
import { uploadFile } from "@/store/slices/uploadSlice";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  Alert,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Container,
  Divider,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { UserRole } from "@/types/auth";

export default function NewArtworkPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, role } = useAppSelector((state) => state.auth);
  const { isLoading, error } = useAppSelector((state) => state.artworks);
  const { galleries } = useAppSelector((state) => state.gallery);

  const [form, setForm] = useState({
    title: "",
    description: "",
    galleryId: "",
    medium: "",
    dimensions: "",
    yearCreated: "",
    price: "",
    isForSale: false,
    isFeatured: false,
    status: "ACTIVE",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchGalleries({ artistId: parseInt(user.id) }));
    }
  }, [dispatch, user?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      alert("User not authenticated");
      return;
    }
    if (!imageFile) {
      alert("Please select an image file");
      return;
    }

    try {
      setUploading(true);
      const uploadResult: any = await dispatch(uploadFile({ file: imageFile }));

      if (uploadResult.payload?.data?.fileUrl) {
        const artworkData = {
          ...form,
          galleryId: Number(form.galleryId),
          yearCreated: form.yearCreated ? Number(form.yearCreated) : undefined,
          price: form.price ? Number(form.price) : undefined,
          imageUrl: uploadResult.payload.data.fileUrl,
          thumbnailUrl: uploadResult.payload.data.fileUrl,
        };

        const result = await dispatch(createArtwork(artworkData));
        if (result.type.endsWith("/fulfilled")) {
          router.push("/account/artworks/list");
        }
      } else {
        alert("Failed to upload image");
      }
    } catch (err) {
      console.error("Error creating artwork:", err);
    } finally {
      setUploading(false);
    }
  };

  const isSubmitting = isLoading || uploading;

  return (
    <ProtectedRoute>
      <Container maxWidth="md">
        <Typography variant="h4" mt={4} mb={2} align="center">
          Create New Artwork
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* Artwork Details */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Artwork Details
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={form.status}
                      label="Status"
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                    >
                      <MenuItem value="ACTIVE">Active</MenuItem>
                      <MenuItem value="INACTIVE">Inactive</MenuItem>
                      <MenuItem value="SOLD">Sold</MenuItem>
                      <MenuItem value="RESERVED">Reserved</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    multiline
                    // rows={2}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Gallery & Specs */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Gallery & Specifications
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                {role !== UserRole.ARTIST && (
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Gallery</InputLabel>
                      <Select
                        name="galleryId"
                        value={form.galleryId}
                        label="Gallery"
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            galleryId: e.target.value as string,
                          }))
                        }
                      >
                        {galleries.map((g: any) => (
                          <MenuItem key={g.id} value={g.id}>
                            {g.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Medium"
                    name="medium"
                    value={form.medium}
                    onChange={handleChange}
                    placeholder="Oil on canvas, Digital, etc."
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Dimensions"
                    name="dimensions"
                    value={form.dimensions}
                    onChange={handleChange}
                    placeholder="e.g., 24x36 inches"
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField
                    fullWidth
                    label="Year"
                    name="yearCreated"
                    type="number"
                    value={form.yearCreated}
                    onChange={handleChange}
                    inputProps={{ min: 1800, max: new Date().getFullYear() }}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField
                    fullWidth
                    label="Price (USD)"
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Image & Options */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Image & Options
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUpload />}
                  >
                    Upload Image
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                    />
                  </Button>
                  {imageFile && (
                    <Typography variant="body2" color="text.secondary">
                      {imageFile.name}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} sm={3}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="isForSale"
                        checked={form.isForSale}
                        onChange={handleChange}
                      />
                    }
                    label="For Sale"
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="isFeatured"
                        checked={form.isFeatured}
                        onChange={handleChange}
                      />
                    }
                    label="Featured"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Box
            sx={{
              position: "sticky",
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor: "background.paper",
              py: 2,
              borderTop: 1,
              borderColor: "divider",
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => router.push("/account/artworks/list")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : undefined}
            >
              {isSubmitting ? "Creating..." : "Create Artwork"}
            </Button>
          </Box>
        </form>
      </Container>
    </ProtectedRoute>
  );
}
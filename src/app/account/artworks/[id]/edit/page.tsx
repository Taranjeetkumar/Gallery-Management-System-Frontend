"use client";

import React, { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchArtworkById, updateArtwork } from "@/store/slices/artworksSlice";
import { fetchGalleries } from "@/store/slices/gallerySlice";
import { uploadFile } from "@/store/slices/uploadSlice";
import { useRouter, useParams } from "next/navigation";
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
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

export default function EditArtworkPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { id } = useParams();
    const { currentArtwork, isLoading, error } = useAppSelector(
        (state) => state.artworks
    );
    const { galleries } = useAppSelector((state) => state.gallery);
    const { user } = useAppSelector((state) => state.auth);

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
        if (id) {
            dispatch(fetchArtworkById(Number(id)));
        }
        dispatch(fetchGalleries({ artistId: parseInt(user.id) }));
    }, [dispatch, id]);

    console.log("gdfjhbj : : ", currentArtwork);

    useEffect(() => {
        if (currentArtwork) {
            setForm({
                title: currentArtwork.title || "",
                description: currentArtwork.description || "",
                galleryId: currentArtwork.gallery?.id?.toString() || "",
                medium: currentArtwork.medium || "",
                dimensions: currentArtwork.dimensions || "",
                yearCreated: currentArtwork.yearCreated?.toString() || "",
                price: currentArtwork.price?.toString() || "",
                isForSale: currentArtwork.isForSale || false,
                isFeatured: currentArtwork.isFeatured || false,
                status: currentArtwork.status || "ACTIVE",
            });
        }
    }, [currentArtwork]);

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
        if (!id) return;

        try {
            setUploading(true);

            let imageUrl = currentArtwork?.imageUrl;

            // Upload new image if selected
            if (imageFile) {
                const uploadResult: any = await dispatch(
                    uploadFile({ file: imageFile })
                );
                if (uploadResult.payload?.data?.fileUrl) {
                    imageUrl = uploadResult.payload.data.fileUrl;
                }
            }

            const artworkData = {
                ...form,
                galleryId: Number(form.galleryId),
                yearCreated: form.yearCreated ? Number(form.yearCreated) : undefined,
                price: form.price ? Number(form.price) : undefined,
                imageUrl: imageUrl || "",
                thumbnailUrl: imageUrl || "",
            };

            const result = await dispatch(
                updateArtwork({
                    id: Number(id),
                    data: artworkData,
                })
            );

            if (result.type.endsWith("/fulfilled")) {
                router.push("/artworks");
            }
        } catch (error) {
            console.error("Error updating artwork:", error);
        } finally {
            setUploading(false);
        }
    };

    const isSubmitting = isLoading || uploading;

    if (isLoading && !currentArtwork) {
        return (
            <ProtectedRoute>
                <Box display="flex" justifyContent="center" p={4}>
                    <CircularProgress />
                </Box>
            </ProtectedRoute>
        );
    }

    if (!currentArtwork) {
        return (
            <ProtectedRoute>
                <Box p={3}>
                    <Alert severity="error">Artwork not found</Alert>
                </Box>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <Box p={3}>
                <Typography variant="h4" fontWeight="bold" mb={3}>
                    Edit Artwork
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Card>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                {/* Current Image Preview */}
                                {currentArtwork?.imageUrl && (
                                    <Grid item xs={12}>
                                        <Box>
                                            <Typography variant="h6" gutterBottom>
                                                Current Image
                                            </Typography>
                                            <img
                                                src={currentArtwork.imageUrl}
                                                alt={currentArtwork.title}
                                                style={{
                                                    maxWidth: "300px",
                                                    maxHeight: "200px",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                )}

                                {/* Title */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Artwork Title"
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>

                                {/* Description */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        multiline
                                        rows={4}
                                    />
                                </Grid>

                                {/* Gallery Selection */}
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Gallery</InputLabel>
                                        <Select
                                            name="galleryId"
                                            value={form.galleryId}
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    galleryId: e.target.value as string,
                                                }))
                                            }
                                        >
                                            {galleries?.map((gallery: any) => (
                                                <MenuItem key={gallery.id} value={gallery.id}>
                                                    {gallery.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Medium */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Medium"
                                        name="medium"
                                        value={form.medium}
                                        onChange={handleChange}
                                        placeholder="e.g., Oil on canvas, Digital art, Sculpture"
                                    />
                                </Grid>

                                {/* Dimensions */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Dimensions"
                                        name="dimensions"
                                        value={form.dimensions}
                                        onChange={handleChange}
                                        placeholder="e.g., 24x36 inches, 60x90 cm"
                                    />
                                </Grid>

                                {/* Year Created */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Year Created"
                                        name="yearCreated"
                                        type="number"
                                        value={form.yearCreated}
                                        onChange={handleChange}
                                        inputProps={{ min: 1800, max: new Date().getFullYear() }}
                                    />
                                </Grid>

                                {/* Price */}
                                <Grid item xs={12} md={6}>
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

                                {/* Status */}
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            name="status"
                                            value={form.status}
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    status: e.target.value as string,
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

                                {/* Image Upload */}
                                <Grid item xs={12}>
                                    <Box>
                                        <Typography variant="h6" gutterBottom>
                                            Update Image (Optional)
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            component="label"
                                            startIcon={<CloudUpload />}
                                            sx={{ mb: 1 }}
                                        >
                                            Choose New Image
                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                        </Button>
                                        {imageFile && (
                                            <Typography variant="body2" color="text.secondary">
                                                New image selected: {imageFile.name}
                                            </Typography>
                                        )}
                                    </Box>
                                </Grid>

                                {/* Checkboxes */}
                                <Grid item xs={12} md={6}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="isForSale"
                                                checked={form.isForSale}
                                                onChange={handleChange}
                                            />
                                        }
                                        label="Available for Sale"
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="isFeatured"
                                                checked={form.isFeatured}
                                                onChange={handleChange}
                                            />
                                        }
                                        label="Featured Artwork"
                                    />
                                </Grid>

                                {/* Submit Buttons */}
                                <Grid item xs={12}>
                                    <Box display="flex" gap={2} justifyContent="flex-end">
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
                                            startIcon={
                                                isSubmitting ? <CircularProgress size={20} /> : null
                                            }
                                        >
                                            {isSubmitting ? "Updating..." : "Update Artwork"}
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        </ProtectedRoute>
    );
}

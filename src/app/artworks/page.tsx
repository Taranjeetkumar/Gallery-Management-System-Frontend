"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  fetchArtworks,
  createArtwork,
  updateArtwork,
  deleteArtwork,
  setSearchQuery,
  setFilters,
  clearFilters,
  clearError,
} from "@/store/slices/artworksSlice";
import { fetchArtists } from "@/store/slices/artistsSlice";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Filter,
  Edit,
  Trash2,
  Eye,
  Upload,
  Image as ImageIcon,
  Calendar,
  DollarSign,
  Tag,
  Palette,
  User,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
} from "lucide-react";
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
  Container,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { uploadFile } from "@/store/slices/uploadSlice";

const artMediums = [
  "Oil Painting",
  "Acrylic Painting",
  "Watercolor",
  "Digital Art",
  "Sculpture",
  "Photography",
  "Mixed Media",
  "Charcoal",
  "Pencil Drawing",
  "Pastel",
  "Ink",
  "Collage",
  "Printmaking",
  "Ceramics",
  "Installation",
];

const artStyles = [
  "Abstract",
  "Realism",
  "Impressionism",
  "Contemporary",
  "Modern",
  "Classical",
  "Surrealism",
  "Expressionism",
  "Minimalism",
  "Pop Art",
  "Street Art",
  "Cubism",
  "Baroque",
  "Renaissance",
];

const artTags = [
  "Nature",
  "Portrait",
  "Landscape",
  "Abstract",
  "Urban",
  "Still Life",
  "Figure",
  "Conceptual",
  "Experimental",
  "Traditional",
  "Contemporary",
  "Colorful",
  "Monochrome",
  "Large Scale",
  "Miniature",
];

export default function ArtworksPage() {
  const dispatch = useAppDispatch();
  const { artworks, isLoading, error, searchQuery, filters, pagination } =
    useAppSelector((state) => state.artworks);
  const { artists } = useAppSelector((state) => state.artists);
  const { user } = useAppSelector((state) => state.auth);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<any>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const isSubmitting = isLoading || uploading;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    artistId: "",
    galleryId: "",
    medium: "",
    dimensions: "",
    yearCreated: new Date().getFullYear(),
    price: "",
    isForSale: false,
    tags: [] as string[],
    // image: null as File | null,
  });

  useEffect(() => {
    dispatch(
      fetchArtworks({ artistId: parseInt(user.id), page: 1, limit: 12 })
    );
    dispatch(fetchArtists({ page: 1, limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      console.error("Artworks error:", error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSearch = (value: string) => {
    dispatch(setSearchQuery(value));
    dispatch(
      fetchArtworks({ search: value, page: 1, limit: pagination.limit })
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }

    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFilterChange = (newFilters: any) => {
    dispatch(setFilters(newFilters));
    dispatch(
      fetchArtworks({ filters: newFilters, page: 1, limit: pagination.limit })
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateArtwork = async () => {
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
          ...formData,
          galleryId: Number(formData.galleryId),
          yearCreated: formData.yearCreated
            ? Number(formData.yearCreated)
            : undefined,
          price: formData.price ? Number.parseFloat(formData.price) : undefined,
          imageUrl: uploadResult.payload.data.fileUrl,
          thumbnailUrl: uploadResult.payload.data.fileUrl,
        };

        await dispatch(createArtwork(artworkData)).unwrap();
        setIsCreateDialogOpen(false);
        resetForm();
        alert("Artwork created successfully!");
        dispatch(fetchArtworks({ page: 1, limit: pagination.limit }));
      } else {
        alert("Failed to upload image");
      }
    } catch (error: any) {
      alert(error.message || "Failed to create artwork");
    }
  };

  const handleUpdateArtwork = async () => {
    if (!selectedArtwork) return;

    try {
      setUploading(true);

      let imageUrl = selectedArtwork?.imageUrl;

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
        ...formData,
        galleryId: Number(formData.galleryId),
        yearCreated: formData.yearCreated
          ? Number(formData.yearCreated)
          : undefined,
        price: formData.price ? Number(formData.price) : undefined,
        imageUrl: imageUrl || "",
        thumbnailUrl: imageUrl || "",
      };

      await dispatch(
        updateArtwork({ id: selectedArtwork.id, data: artworkData })
      ).unwrap();
      setIsEditDialogOpen(false);
      resetForm();
      alert("Artwork updated successfully!");
      dispatch(
        fetchArtworks({ page: pagination.page, limit: pagination.limit })
      );
    } catch (error: any) {
      alert(error.message || "Failed to update artwork");
    }
  };

  const handleDeleteArtwork = async (
    artworkId: string,
    artworkTitle: string
  ) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${artworkTitle}"? This action cannot be undone.`
      )
    ) {
      try {
        await dispatch(deleteArtwork(artworkId)).unwrap();
        alert("Artwork deleted successfully!");
        dispatch(
          fetchArtworks({ page: pagination.page, limit: pagination.limit })
        );
      } catch (error: any) {
        alert(error.message || "Failed to delete artwork");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      artistId: "",
      galleryId: "",
      medium: "",
      dimensions: "",
      yearCreated: new Date().getFullYear(),
      price: "",
      isForSale: false,
      tags: [],
      image: null,
    });
    setSelectedArtwork(null);
    setImagePreview(null);
  };

  const openEditDialog = (artwork: any) => {
    setSelectedArtwork(artwork);
    setFormData({
      title: artwork.title || "",
      description: artwork.description || "",
      artistId: artwork.artistId || "",
      galleryId: artwork.galleryId || "",
      medium: artwork.medium || "",
      dimensions: artwork.dimensions || "",
      yearCreated: artwork.yearCreated || new Date().getFullYear(),
      price: artwork.price ? artwork.price.toString() : "",
      isForSale: artwork.isForSale || false,
      tags: artwork.tags || [],
      image: null,
    });
    setImagePreview(artwork.imageUrl || null);
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (artwork: any) => {
    setSelectedArtwork(artwork);
    setIsViewDialogOpen(true);
  };

  const toggleTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.includes(tag)
        ? formData.tags.filter((t) => t !== tag)
        : [...formData.tags, tag],
    });
  };

  const handlePageChange = (page: number) => {
    dispatch(
      fetchArtworks({
        page,
        limit: pagination.limit,
        search: searchQuery,
        filters,
      })
    );
  };

  const clearAllFilters = () => {
    dispatch(clearFilters());
    dispatch(fetchArtworks({ page: 1, limit: pagination.limit }));
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    Artworks Management
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Manage artwork collections, pricing, and exhibitions -{" "}
                    {pagination.total} total artworks
                  </p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Artwork
                  </Button>
                </motion.div>
              </div>

              {/* Search, Filters and View Toggle */}
              {/* <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search artworks by title, artist, medium, or tags..."
                    className="pl-10 py-3 text-lg border-2 border-blue-200 focus:border-blue-400 rounded-xl"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="px-6 py-3 border-2 border-blue-200 hover:border-blue-400 rounded-xl"
                  >
                    <Filter className="w-5 h-5 mr-2" />
                    Filters
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearAllFilters}
                    className="px-6 py-3 border-2 border-gray-200 hover:border-gray-400 rounded-xl"
                  >
                    Clear
                  </Button>
                  <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      onClick={() => setViewMode('grid')}
                      className="rounded-none"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      onClick={() => setViewMode('list')}
                      className="rounded-none"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div> */}

              {/* Filter Panel */}
              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white rounded-xl border-2 border-blue-200 p-6 mb-6 shadow-lg"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2">
                          Medium
                        </Label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          value={filters.medium || ""}
                          onChange={(e) =>
                            handleFilterChange({
                              ...filters,
                              medium: e.target.value,
                            })
                          }
                        >
                          <option value="">All Mediums</option>
                          {artMediums.map((medium) => (
                            <option key={medium} value={medium}>
                              {medium}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2">
                          Artist
                        </Label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          value={filters.artistId || ""}
                          onChange={(e) =>
                            handleFilterChange({
                              ...filters,
                              artistId: e.target.value,
                            })
                          }
                        >
                          <option value="">All Artists</option>
                          {artists.map((artist) => (
                            <option key={artist.id} value={artist.id}>
                              {artist.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2">
                          Availability
                        </Label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          value={
                            filters.isForSale === null
                              ? ""
                              : filters.isForSale
                              ? "sale"
                              : "not-sale"
                          }
                          onChange={(e) =>
                            handleFilterChange({
                              ...filters,
                              isForSale:
                                e.target.value === ""
                                  ? null
                                  : e.target.value === "sale",
                            })
                          }
                        >
                          <option value="">All Artworks</option>
                          <option value="sale">For Sale</option>
                          <option value="not-sale">Not For Sale</option>
                        </select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2">
                          Price Range
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder="Min"
                            value={filters.minPrice || ""}
                            onChange={(e) =>
                              handleFilterChange({
                                ...filters,
                                minPrice: e.target.value
                                  ? Number.parseFloat(e.target.value)
                                  : null,
                              })
                            }
                            className="w-full"
                          />
                          <Input
                            type="number"
                            placeholder="Max"
                            value={filters.maxPrice || ""}
                            onChange={(e) =>
                              handleFilterChange({
                                ...filters,
                                maxPrice: e.target.value
                                  ? Number.parseFloat(e.target.value)
                                  : null,
                              })
                            }
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Artworks Grid/List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {isLoading ? (
                <div
                  className={`grid gap-6 ${
                    viewMode === "grid"
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-1"
                  }`}
                >
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow-lg animate-pulse overflow-hidden"
                    >
                      <div className="h-48 bg-gray-300"></div>
                      <div className="p-4">
                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <div className="w-32 h-32 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-16 h-16 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">
                    Error Loading Artworks
                  </h3>
                  <p className="text-gray-500 mb-6">{error}</p>
                  <Button
                    onClick={() =>
                      dispatch(
                        fetchArtworks({ page: 1, limit: pagination.limit })
                      )
                    }
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    Try Again
                  </Button>
                </div>
              ) : artworks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">
                    No Artworks Found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery || filters.medium || filters.artistId
                      ? "Try adjusting your search criteria or filters."
                      : "Start building your artwork collection by adding your first piece."}
                  </p>
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add First Artwork
                  </Button>
                </motion.div>
              ) : (
                <div
                  className={`grid gap-6 ${
                    viewMode === "grid"
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-1"
                  }`}
                >
                  {artworks.map((artwork, index) => (
                    <motion.div
                      key={artwork.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 ${
                        viewMode === "list" ? "flex items-center gap-4" : ""
                      }`}
                    >
                      {viewMode === "grid" ? (
                        <div>
                          {/* Image */}
                          <div className="relative h-48 bg-gray-100">
                            <img
                              src={artwork.imageUrl || artwork.thumbnailUrl}
                              alt={artwork.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = `https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop`;
                              }}
                            />
                            <div className="absolute top-2 right-2 flex space-x-1">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => openViewDialog(artwork)}
                                className="p-2 bg-white/90 text-blue-600 rounded-lg hover:bg-white transition-colors shadow-sm"
                              >
                                <Eye className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => openEditDialog(artwork)}
                                className="p-2 bg-white/90 text-green-600 rounded-lg hover:bg-white transition-colors shadow-sm"
                              >
                                <Edit className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() =>
                                  handleDeleteArtwork(artwork.id, artwork.title)
                                }
                                className="p-2 bg-white/90 text-red-600 rounded-lg hover:bg-white transition-colors shadow-sm"
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            </div>
                            {artwork.isForSale && (
                              <div className="absolute bottom-2 left-2">
                                <Badge className="bg-green-500 text-white">
                                  For Sale
                                </Badge>
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-4">
                            <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">
                              {artwork.title}
                            </h3>

                            <div className="space-y-2 mb-4">
                              <div className="flex items-center text-sm text-gray-600">
                                <User className="w-4 h-4 mr-2 text-blue-500" />
                                {artwork.artistName}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Palette className="w-4 h-4 mr-2 text-purple-500" />
                                {artwork.medium}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="w-4 h-4 mr-2 text-green-500" />
                                {artwork.yearCreated}
                              </div>
                              {artwork.price && (
                                <div className="flex items-center text-sm font-semibold text-green-600">
                                  <DollarSign className="w-4 h-4 mr-1" />$
                                  {artwork.price.toLocaleString()}
                                </div>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-1 mb-4">
                              {artwork.tags?.slice(0, 2).map((tag: string) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {artwork.tags?.length > 2 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs text-gray-500"
                                >
                                  +{artwork.tags.length - 2} more
                                </Badge>
                              )}
                            </div>

                            <div className="text-xs text-gray-500">
                              {artwork.dimensions}
                            </div>
                          </div>
                        </div>
                      ) : (
                        // List view
                        <>
                          <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 ml-4">
                            <img
                              src={artwork.imageUrl || artwork.thumbnailUrl}
                              alt={artwork.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = `https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop`;
                              }}
                            />
                          </div>
                          <div className="flex-1 p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-bold text-lg text-gray-800">
                                {artwork.title}
                              </h3>
                              {artwork.isForSale && (
                                <Badge className="bg-green-500 text-white ml-2">
                                  For Sale
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-6 text-sm text-gray-600 mb-2">
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-1 text-blue-500" />
                                {artwork.artistName}
                              </div>
                              <div className="flex items-center">
                                <Palette className="w-4 h-4 mr-1 text-purple-500" />
                                {artwork.medium}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1 text-green-500" />
                                {artwork.yearCreated}
                              </div>
                              {artwork.price && (
                                <div className="flex items-center font-semibold text-green-600">
                                  <DollarSign className="w-4 h-4 mr-1" />$
                                  {artwork.price.toLocaleString()}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {artwork.tags?.slice(0, 4).map((tag: string) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="text-xs text-gray-500">
                              {artwork.dimensions}
                            </div>
                          </div>
                          <div className="flex space-x-1 p-4">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => openViewDialog(artwork)}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => openEditDialog(artwork)}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                handleDeleteArtwork(artwork.id, artwork.title)
                              }
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    disabled={pagination.page === 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                    className="border-blue-200 hover:border-blue-400"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  {Array.from(
                    { length: Math.min(pagination.totalPages, 5) },
                    (_, i) => {
                      let page;
                      if (pagination.totalPages <= 5) {
                        page = i + 1;
                      } else if (pagination.page <= 3) {
                        page = i + 1;
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        page = pagination.totalPages - 4 + i;
                      } else {
                        page = pagination.page - 2 + i;
                      }

                      return (
                        <Button
                          key={page}
                          variant={
                            pagination.page === page ? "default" : "outline"
                          }
                          onClick={() => handlePageChange(page)}
                          className={
                            pagination.page === page
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                              : "border-blue-200 hover:border-blue-400"
                          }
                        >
                          {page}
                        </Button>
                      );
                    }
                  )}

                  <Button
                    variant="outline"
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                    className="border-blue-200 hover:border-blue-400"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Create/Edit Dialog */}
        <Dialog
          open={isCreateDialogOpen || isEditDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsCreateDialogOpen(false);
              setIsEditDialogOpen(false);
              resetForm();
            }
          }}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {isCreateDialogOpen ? "Add New Artwork" : "Edit Artwork"}
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Artwork title"
                    className="mt-1"
                  />
                </div>

                {/* <div>

                                    <Label className="text-sm font-medium">Artist *</Label>
                                    <select
                                        value={formData.artistId}
                                        onChange={(e) =>
                                            setFormData({ ...formData, artistId: e.target.value })
                                        }
                                        className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select an artist</option>
                                        {artists?.map((artist) => (
                                            <option key={artist.id} value={artist.id}>
                                                {artist.name}
                                            </option>
                                        ))}
                                    </select>
                                </div> */}

                <div>
                  <Label className="text-sm font-medium">Medium *</Label>
                  <select
                    value={formData.medium}
                    onChange={(e) =>
                      setFormData({ ...formData, medium: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a medium</option>
                    {artMediums.map((medium) => (
                      <option key={medium} value={medium}>
                        {medium}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Dimensions</Label>
                  <Input
                    value={formData.dimensions}
                    onChange={(e) =>
                      setFormData({ ...formData, dimensions: e.target.value })
                    }
                    placeholder="e.g., 24 x 36 inches"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Year</Label>
                  <Input
                    type="number"
                    value={formData.yearCreated}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        yearCreated: Number.parseInt(e.target.value),
                      })
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Price</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="0.00"
                    className="mt-1"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isForSale"
                    checked={formData.isForSale}
                    onChange={(e) =>
                      setFormData({ ...formData, isForSale: e.target.checked })
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="isForSale" className="text-sm font-medium">
                    Available for Sale
                  </Label>
                </div>

                <div>
                  <Label className="text-sm font-medium">Image *</Label>
                  <div className="mt-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors"
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">
                            Click to upload image
                          </span>
                        </div>
                      )}
                    </label>

                    {imageFile && (
                      <Typography variant="body2" color="text.secondary">
                        {imageFile.name}
                      </Typography>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the artwork, its inspiration, techniques used..."
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Tags</Label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-2">
                  {artTags.map((tag) => (
                    <motion.div
                      key={tag}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`w-full p-2 text-sm rounded-lg border-2 transition-all ${
                          formData.tags.includes(tag)
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-500"
                            : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        {tag}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                disabled={isSubmitting}
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  setIsEditDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={
                  isCreateDialogOpen ? handleCreateArtwork : handleUpdateArtwork
                }
                disabled={
                  !formData.title ||
                  !formData.description ||
                  !formData.medium ||
                  isLoading
                }
                startIcon={
                  isSubmitting ? <CircularProgress size={20} /> : undefined
                }
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                {isLoading
                  ? "Saving..."
                  : isCreateDialogOpen
                  ? "Create Artwork"
                  : "Update Artwork"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl">
            {selectedArtwork && (
              <div>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Artwork Details
                  </DialogTitle>
                </DialogHeader>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Image */}
                  <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                    <img
                      src={selectedArtwork.imageUrl}
                      alt={selectedArtwork.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop`;
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        {selectedArtwork.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-gray-600">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1 text-blue-500" />
                          {selectedArtwork.artistName}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1 text-green-500" />
                          {selectedArtwork.yearCreated}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          Medium
                        </Label>
                        <p className="text-gray-900">
                          {selectedArtwork.medium}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          Dimensions
                        </Label>
                        <p className="text-gray-900">
                          {selectedArtwork.dimensions || "Not specified"}
                        </p>
                      </div>
                    </div>

                    {selectedArtwork.price && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          Price
                        </Label>
                        <p className="text-2xl font-bold text-green-600">
                          ${selectedArtwork.price.toLocaleString()}
                        </p>
                      </div>
                    )}

                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Availability
                      </Label>
                      <Badge
                        className={
                          selectedArtwork.isForSale
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-gray-100 text-gray-700 border border-gray-200"
                        }
                      >
                        {selectedArtwork.isForSale
                          ? "For Sale"
                          : "Not For Sale"}
                      </Badge>
                    </div>

                    {selectedArtwork.tags &&
                      selectedArtwork.tags.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2">
                            Tags
                          </Label>
                          <div className="flex flex-wrap gap-2">
                            {selectedArtwork.tags.map((tag: string) => (
                              <Badge
                                key={tag}
                                className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                    {selectedArtwork.description && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2">
                          Description
                        </Label>
                        <p className="text-gray-700 leading-relaxed">
                          {selectedArtwork.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsViewDialogOpen(false)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      openEditDialog(selectedArtwork);
                    }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    Edit Artwork
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  fetchArtists,
  createArtist,
  updateArtist,
  deleteArtist,
  setSearchQuery,
  setFilters,
  clearFilters,
  clearError,
  type ArtistFormData,
} from "@/store/slices/artistsSlice";
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
  MapPin,
  Phone,
  Mail,
  Palette,
  Star,
  Users,
  Calendar,
  Globe,
  Instagram,
  Twitter,
  X,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";

const artisticStyles = [
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
  "Renaissance"
];

const specializations = [
  "Painting",
  "Sculpture",
  "Photography",
  "Digital Art",
  "Mixed Media",
  "Installation",
  "Performance",
  "Video Art",
  "Printmaking",
  "Ceramics",
  "Textile Art",
  "Conceptual Art",
  "Land Art",
  "Graffiti"
];

export default function ArtistsPage() {
  const dispatch = useAppDispatch();
  const { artists, isLoading, error, searchQuery, filters, pagination } =
    useAppSelector((state) => state.artists);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<any>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [formData, setFormData] = useState<ArtistFormData>({
    name: "",
    email: "",
    phone: "",
    birthplace: "",
    age: undefined,
    artisticStyle: "",
    biography: "",
    specializations: [],
    socialLinks: {
      website: "",
      instagram: "",
      twitter: "",
    },
  });

  useEffect(() => {
    dispatch(fetchArtists({ page: 1, limit: 12 }));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      console.error("Artists error:", error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSearch = (value: string) => {
    dispatch(setSearchQuery(value));
    dispatch(fetchArtists({ search: value, page: 1, limit: pagination.limit }));
  };

  const handleFilterChange = (newFilters: any) => {
    dispatch(setFilters(newFilters));
    dispatch(fetchArtists({ filters: newFilters, page: 1, limit: pagination.limit }));
  };

  const handleCreateArtist = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.artisticStyle) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      await dispatch(createArtist(formData)).unwrap();
      setIsCreateDialogOpen(false);
      resetForm();
      alert("Artist created successfully!");
      dispatch(fetchArtists({ page: 1, limit: pagination.limit }));
    } catch (error: any) {
      alert(error.message || "Failed to create artist");
    }
  };

  const handleUpdateArtist = async () => {
    if (!selectedArtist) return;

    if (!formData.name.trim() || !formData.email.trim() || !formData.artisticStyle) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      await dispatch(
        updateArtist({ id: selectedArtist.id, data: formData })
      ).unwrap();
      setIsEditDialogOpen(false);
      resetForm();
      alert("Artist updated successfully!");
      dispatch(fetchArtists({ page: pagination.page, limit: pagination.limit }));
    } catch (error: any) {
      alert(error.message || "Failed to update artist");
    }
  };

  const handleDeleteArtist = async (artistId: number, artistName: string) => {
    if (window.confirm(`Are you sure you want to delete "${artistName}"? This action cannot be undone.`)) {
      try {
        await dispatch(deleteArtist(artistId)).unwrap();
        alert("Artist deleted successfully!");
        dispatch(fetchArtists({ page: pagination.page, limit: pagination.limit }));
      } catch (error: any) {
        alert(error.message || "Failed to delete artist");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      birthplace: "",
      age: undefined,
      artisticStyle: "",
      biography: "",
      specializations: [],
      socialLinks: {
        website: "",
        instagram: "",
        twitter: "",
      },
    });
    setSelectedArtist(null);
  };

  const openEditDialog = (artist: any) => {
    setSelectedArtist(artist);
    setFormData({
      name: artist.name || "",
      email: artist.email || "",
      phone: artist.phone || "",
      birthplace: artist.birthplace || "",
      age: artist.age,
      artisticStyle: artist.artisticStyle || "",
      biography: artist.biography || "",
      specializations: artist.specializations || [],
      socialLinks: artist.socialLinks || {
        website: "",
        instagram: "",
        twitter: "",
      },
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (artist: any) => {
    setSelectedArtist(artist);
    setIsViewDialogOpen(true);
  };

  const toggleSpecialization = (spec: string) => {
    setFormData({
      ...formData,
      specializations: formData.specializations.includes(spec)
        ? formData.specializations.filter((s) => s !== spec)
        : [...formData.specializations, spec],
    });
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchArtists({
      page,
      limit: pagination.limit,
      search: searchQuery,
      filters
    }));
  };

  const clearAllFilters = () => {
    dispatch(clearFilters());
    dispatch(fetchArtists({ page: 1, limit: pagination.limit }));
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    Artists Management
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Manage artist profiles, specializations, and portfolios - {pagination.total} total artists
                  </p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Artist
                  </Button>
                </motion.div>
              </div>

              {/* Search, Filters and View Toggle */}
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search artists by name, style, or specialization..."
                    className="pl-10 py-3 text-lg border-2 border-purple-200 focus:border-purple-400 rounded-xl"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="px-6 py-3 border-2 border-purple-200 hover:border-purple-400 rounded-xl"
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
                      Grid
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      onClick={() => setViewMode('list')}
                      className="rounded-none"
                    >
                      List
                    </Button>
                  </div>
                </div>
              </div>

              {/* Filter Panel */}
              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white rounded-xl border-2 border-purple-200 p-6 mb-6 shadow-lg"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2">
                          Artistic Style
                        </Label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          value={filters.artisticStyle}
                          onChange={(e) =>
                            handleFilterChange({
                              ...filters,
                              artisticStyle: e.target.value,
                            })
                          }
                        >
                          <option value="">All Styles</option>
                          {artisticStyles.map((style) => (
                            <option key={style} value={style}>
                              {style}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2">
                          Specialization
                        </Label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          value={filters.specialization}
                          onChange={(e) =>
                            handleFilterChange({
                              ...filters,
                              specialization: e.target.value,
                            })
                          }
                        >
                          <option value="">All Specializations</option>
                          {specializations.map((spec) => (
                            <option key={spec} value={spec}>
                              {spec}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2">
                          Status
                        </Label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          value={
                            filters.isActive === null
                              ? ""
                              : filters.isActive
                              ? "active"
                              : "inactive"
                          }
                          onChange={(e) =>
                            handleFilterChange({
                              ...filters,
                              isActive:
                                e.target.value === ""
                                  ? null
                                  : e.target.value === "active",
                            })
                          }
                        >
                          <option value="">All Status</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Artists Grid/List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {isLoading ? (
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-6 shadow-lg animate-pulse"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-300 rounded mb-2"></div>
                          <div className="h-3 bg-gray-300 rounded mb-2"></div>
                          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                        </div>
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
                    Error Loading Artists
                  </h3>
                  <p className="text-gray-500 mb-6">{error}</p>
                  <Button
                    onClick={() => dispatch(fetchArtists({ page: 1, limit: pagination.limit }))}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    Try Again
                  </Button>
                </div>
              ) : artists.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                    <Users className="w-16 h-16 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">
                    No Artists Found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery || filters.artisticStyle || filters.specialization
                      ? "Try adjusting your search criteria or filters."
                      : "Start building your artist network by adding your first artist."}
                  </p>
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add First Artist
                  </Button>
                </motion.div>
              ) : (
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                  {artists.map((artist, index) => (
                    <motion.div
                      key={artist.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 ${
                        viewMode === 'list' ? 'flex items-center p-4 gap-4' : 'p-6'
                      }`}
                    >
                      {viewMode === 'grid' ? (
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <Avatar className="w-16 h-16 border-4 border-gradient-to-r from-purple-400 to-pink-400">
                              <AvatarImage src={artist.profileImage} />
                              <AvatarFallback className="bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xl font-bold">
                                {artist.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex space-x-1">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => openViewDialog(artist)}
                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => openEditDialog(artist)}
                                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteArtist(artist.id, artist.name)}
                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>

                          <h3 className="font-bold text-lg text-gray-800 mb-2">
                            {artist.name}
                          </h3>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <Palette className="w-4 h-4 mr-2 text-purple-500" />
                              {artist.artisticStyle}
                            </div>
                            {artist.birthplace && (
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="w-4 h-4 mr-2 text-pink-500" />
                                {artist.birthplace}
                              </div>
                            )}
                            <div className="flex items-center text-sm text-gray-600">
                              <Star className="w-4 h-4 mr-2 text-yellow-500" />
                              {artist.totalArtworks || 0} artworks
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-4">
                            {artist.specializations
                              ?.slice(0, 2)
                              .map((spec: string) => (
                                <Badge
                                  key={spec}
                                  variant="secondary"
                                  className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200"
                                >
                                  {spec}
                                </Badge>
                              ))}
                            {artist.specializations?.length > 2 && (
                              <Badge
                                variant="outline"
                                className="text-xs text-gray-500"
                              >
                                +{artist.specializations.length - 2} more
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <Badge
                              variant={artist.isActive ? "default" : "destructive"}
                              className={
                                artist.isActive
                                  ? "bg-green-100 text-green-700 border border-green-200"
                                  : "bg-red-100 text-red-700 border border-red-200"
                              }
                            >
                              {artist.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <div className="flex space-x-2">
                              {artist.socialLinks?.website && (
                                <Globe className="w-4 h-4 text-blue-500" />
                              )}
                              {artist.socialLinks?.instagram && (
                                <Instagram className="w-4 h-4 text-pink-500" />
                              )}
                              {artist.socialLinks?.twitter && (
                                <Twitter className="w-4 h-4 text-blue-400" />
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        // List view
                        <>
                          <Avatar className="w-16 h-16 border-4 border-gradient-to-r from-purple-400 to-pink-400">
                            <AvatarImage src={artist.profileImage} />
                            <AvatarFallback className="bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xl font-bold">
                              {artist.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-bold text-lg text-gray-800">
                                {artist.name}
                              </h3>
                              <Badge
                                variant={artist.isActive ? "default" : "destructive"}
                                className={
                                  artist.isActive
                                    ? "bg-green-100 text-green-700 border border-green-200"
                                    : "bg-red-100 text-red-700 border border-red-200"
                                }
                              >
                                {artist.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center">
                                <Palette className="w-4 h-4 mr-1 text-purple-500" />
                                {artist.artisticStyle}
                              </div>
                              {artist.birthplace && (
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1 text-pink-500" />
                                  {artist.birthplace}
                                </div>
                              )}
                              <div className="flex items-center">
                                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                                {artist.totalArtworks || 0} artworks
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {artist.specializations?.slice(0, 3).map((spec: string) => (
                                <Badge
                                  key={spec}
                                  variant="secondary"
                                  className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200"
                                >
                                  {spec}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => openViewDialog(artist)}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => openEditDialog(artist)}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteArtist(artist.id, artist.name)}
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
                    className="border-purple-200 hover:border-purple-400"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
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
                        variant={pagination.page === page ? "default" : "outline"}
                        onClick={() => handlePageChange(page)}
                        className={
                          pagination.page === page
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                            : "border-purple-200 hover:border-purple-400"
                        }
                      >
                        {page}
                      </Button>
                    );
                  })}

                  <Button
                    variant="outline"
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                    className="border-purple-200 hover:border-purple-400"
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
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {isCreateDialogOpen ? "Add New Artist" : "Edit Artist"}
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Artist full name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Email *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="artist@example.com"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+1 (555) 123-4567"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Birthplace</Label>
                  <Input
                    value={formData.birthplace}
                    onChange={(e) =>
                      setFormData({ ...formData, birthplace: e.target.value })
                    }
                    placeholder="City, Country"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Age</Label>
                  <Input
                    type="number"
                    value={formData.age || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        age: e.target.value ? Number.parseInt(e.target.value) : undefined,
                      })
                    }
                    placeholder="35"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Artistic Style *</Label>
                  <select
                    value={formData.artisticStyle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        artisticStyle: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select a style</option>
                    {artisticStyles.map((style) => (
                      <option key={style} value={style}>
                        {style}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Website</Label>
                  <Input
                    value={formData.socialLinks?.website || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: {
                          ...formData.socialLinks,
                          website: e.target.value,
                        },
                      })
                    }
                    placeholder="https://artistwebsite.com"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Instagram</Label>
                  <Input
                    value={formData.socialLinks?.instagram || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: {
                          ...formData.socialLinks,
                          instagram: e.target.value,
                        },
                      })
                    }
                    placeholder="@username"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Twitter</Label>
                  <Input
                    value={formData.socialLinks?.twitter || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: {
                          ...formData.socialLinks,
                          twitter: e.target.value,
                        },
                      })
                    }
                    placeholder="@username"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <div>
                <Label className="text-sm font-medium">Biography</Label>
                <Textarea
                  value={formData.biography}
                  onChange={(e) =>
                    setFormData({ ...formData, biography: e.target.value })
                  }
                  placeholder="Tell us about the artist's background, education, and artistic journey..."
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Specializations</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {specializations.map((spec) => (
                    <motion.div
                      key={spec}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        type="button"
                        onClick={() => toggleSpecialization(spec)}
                        className={`w-full p-2 text-sm rounded-lg border-2 transition-all ${
                          formData.specializations.includes(spec)
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500"
                            : "bg-white text-gray-700 border-gray-200 hover:border-purple-300"
                        }`}
                      >
                        {spec}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
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
                  isCreateDialogOpen ? handleCreateArtist : handleUpdateArtist
                }
                disabled={!formData.name || !formData.email || !formData.artisticStyle || isLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                {isLoading ? "Saving..." : (isCreateDialogOpen ? "Create Artist" : "Update Artist")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-3xl">
            {selectedArtist && (
              <div>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Artist Profile
                  </DialogTitle>
                </DialogHeader>

                <div className="mt-6">
                  <div className="flex items-center space-x-6 mb-6">
                    <Avatar className="w-24 h-24 border-4 border-gradient-to-r from-purple-400 to-pink-400">
                      <AvatarImage src={selectedArtist.profileImage} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-400 to-pink-400 text-white text-2xl font-bold">
                        {selectedArtist.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {selectedArtist.name}
                      </h3>
                      <p className="text-lg text-purple-600">
                        {selectedArtist.artisticStyle}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        {selectedArtist.email && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-4 h-4 mr-1" />
                            {selectedArtist.email}
                          </div>
                        )}
                        {selectedArtist.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-4 h-4 mr-1" />
                            {selectedArtist.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">
                        Personal Information
                      </h4>
                      <div className="space-y-2">
                        {selectedArtist.birthplace && (
                          <div className="flex items-center text-sm">
                            <MapPin className="w-4 h-4 mr-2 text-purple-500" />
                            <span className="text-gray-600">Born in:</span>
                            <span className="ml-2 font-medium">
                              {selectedArtist.birthplace}
                            </span>
                          </div>
                        )}
                        {selectedArtist.age && (
                          <div className="flex items-center text-sm">
                            <Calendar className="w-4 h-4 mr-2 text-pink-500" />
                            <span className="text-gray-600">Age:</span>
                            <span className="ml-2 font-medium">
                              {selectedArtist.age} years old
                            </span>
                          </div>
                        )}
                        <div className="flex items-center text-sm">
                          <Star className="w-4 h-4 mr-2 text-yellow-500" />
                          <span className="text-gray-600">Artworks:</span>
                          <span className="ml-2 font-medium">
                            {selectedArtist.totalArtworks || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">
                        Social Links
                      </h4>
                      <div className="space-y-2">
                        {selectedArtist.socialLinks?.website && (
                          <a
                            href={selectedArtist.socialLinks.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                          >
                            <Globe className="w-4 h-4 mr-2" />
                            Website
                          </a>
                        )}
                        {selectedArtist.socialLinks?.instagram && (
                          <a
                            href={`https://instagram.com/${selectedArtist.socialLinks.instagram.replace(
                              "@",
                              ""
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-pink-600 hover:text-pink-800"
                          >
                            <Instagram className="w-4 h-4 mr-2" />
                            {selectedArtist.socialLinks.instagram}
                          </a>
                        )}
                        {selectedArtist.socialLinks?.twitter && (
                          <a
                            href={`https://twitter.com/${selectedArtist.socialLinks.twitter.replace(
                              "@",
                              ""
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-blue-400 hover:text-blue-600"
                          >
                            <Twitter className="w-4 h-4 mr-2" />
                            {selectedArtist.socialLinks.twitter}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedArtist.specializations &&
                    selectedArtist.specializations.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-800 mb-3">
                          Specializations
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedArtist.specializations.map((spec: string) => (
                            <Badge
                              key={spec}
                              className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200"
                            >
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                  {selectedArtist.biography && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        Biography
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedArtist.biography}
                      </p>
                    </div>
                  )}

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
                        openEditDialog(selectedArtist);
                      }}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      Edit Artist
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

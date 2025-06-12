"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  fetchGalleries,
  createGallery,
  updateGallery,
  deleteGallery,
  setSearchQuery,
  setFilters,
  setSorting,
  clearFilters,
  clearError,
  type GalleryFormData,
} from "@/store/slices/gallerySlice";
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
  Globe,
  Users,
  ImageIcon,
  Calendar,
  Building,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  SortAsc,
  SortDesc,
  BarChart3,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const countries = [
  "United States", "Canada", "United Kingdom", "France", "Germany",
  "Italy", "Spain", "Australia", "Japan", "China", "India", "Brazil"
];

const daysOfWeek = [
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
];

export default function GalleriesPage() {
  const dispatch = useAppDispatch();
  const { galleries, isLoading, error, searchQuery, filters, sortBy, sortOrder, pagination } =
    useAppSelector((state) => state.gallery);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<any>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { user } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<GalleryFormData>({
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
    email: "",
    website: "",
    openingHours: {},
    socialMedia: {},
  });

  useEffect(() => {
    dispatch(fetchGalleries({artistId: parseInt(user.id)}));
  }, [dispatch]);

  const handleSearch = (value: string) => {
    dispatch(setSearchQuery(value));
    dispatch(fetchGalleries({artistId: parseInt(user.id), search: value, page: 1, limit: pagination.limit }));
  };

  const handleFilterChange = (newFilters: any) => {
    dispatch(setFilters(newFilters));
    dispatch(fetchGalleries({ artistId: parseInt(user.id),filters: newFilters, page: 1, limit: pagination.limit }));
  };

  const handleSortChange = (newSortBy: string) => {
    const newSortOrder = sortBy === newSortBy && sortOrder === "asc" ? "desc" : "asc";
    dispatch(setSorting({ sortBy: newSortBy as any, sortOrder: newSortOrder }));
    dispatch(fetchGalleries({
      sortBy: newSortBy,
      sortOrder: newSortOrder,
      page: 1,
      limit: pagination.limit
    }));
  };

  const handleCreateGallery = async () => {
    if (!formData.name.trim() || !formData.address.trim() || !formData.city.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      await dispatch(createGallery(formData)).unwrap();
      setIsCreateDialogOpen(false);
      resetForm();
      alert("Gallery created successfully!");
      dispatch(fetchGalleries({artistId: parseInt(user.id)}));
    } catch (error: any) {
      alert(error.message || "Failed to create gallery");
    }
  };

  const handleUpdateGallery = async () => {
    if (!selectedGallery) return;

    if (!formData.name.trim() || !formData.address.trim() || !formData.city.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      await dispatch(
        updateGallery({ id: selectedGallery.id, data: formData })
      ).unwrap();
      setIsEditDialogOpen(false);
      resetForm();
      alert("Gallery updated successfully!");
      dispatch(fetchGalleries({ page: pagination.page, limit: pagination.limit }));
    } catch (error: any) {
      alert(error.message || "Failed to update gallery");
    }
  };

  const handleDeleteGallery = async (galleryId: number, galleryName: string) => {
    if (window.confirm(`Are you sure you want to delete "${galleryName}"? This action cannot be undone.`)) {
      try {
        await dispatch(deleteGallery(galleryId)).unwrap();
        alert("Gallery deleted successfully!");
        dispatch(fetchGalleries({ page: pagination.page, limit: pagination.limit }));
      } catch (error: any) {
        alert(error.message || "Failed to delete gallery");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      phone: "",
      email: "",
      website: "",
      openingHours: {},
      socialMedia: {},
    });
    setSelectedGallery(null);
  };

  const openEditDialog = (gallery: any) => {
    setSelectedGallery(gallery);
    setFormData({
      name: gallery.name || "",
      description: gallery.description || "",
      address: gallery.address || "",
      city: gallery.city || "",
      state: gallery.state || "",
      zipCode: gallery.zipCode || "",
      country: gallery.country || "",
      phone: gallery.phone || "",
      email: gallery.email || "",
      website: gallery.website || "",
      openingHours: gallery.openingHours || {},
      socialMedia: gallery.socialMedia || {},
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (gallery: any) => {
    setSelectedGallery(gallery);
    setIsViewDialogOpen(true);
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchGalleries({
      page,
      limit: pagination.limit,
      search: searchQuery,
      filters,
      sortBy,
      sortOrder
    }));
  };

  const clearAllFilters = () => {
    dispatch(clearFilters());
    dispatch(fetchGalleries({ page: 1, limit: pagination.limit }));
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
                    Gallery Management
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Manage your galleries, artists, and artworks - {galleries.length} total galleries
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
                    Add Gallery
                  </Button>
                </motion.div>
              </div>

              {/* Search, Filters and View Toggle */}
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                {/* <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search galleries by name, city, or country..."
                    className="pl-10 py-3 text-lg border-2 border-blue-200 focus:border-blue-400 rounded-xl"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div> */}
                <div className="flex gap-2">
                  {/* <Button
                    variant="outline"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="px-6 py-3 border-2 border-blue-200 hover:border-blue-400 rounded-xl"
                  >
                    <Filter className="w-5 h-5 mr-2" />
                    Filters
                  </Button> */}
                  {/* <Button
                    variant="outline"
                    onClick={clearAllFilters}
                    className="px-6 py-3 border-2 border-gray-200 hover:border-gray-400 rounded-xl"
                  >
                    Clear
                  </Button> */}
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

              {/* Sorting Options */}
              {/* <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-sm font-medium text-gray-600 py-2">Sort by:</span>
                {[
                  { key: 'name', label: 'Name' },
                  { key: 'city', label: 'City' },
                  { key: 'totalArtworks', label: 'Artworks' },
                  { key: 'totalArtists', label: 'Artists' },
                  { key: 'createdAt', label: 'Created' },
                ].map((option) => (
                  <Button
                    key={option.key}
                    variant={sortBy === option.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSortChange(option.key)}
                    className="gap-1"
                  >
                    {option.label}
                    {sortBy === option.key && (
                      sortOrder === "asc" ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                    )}
                  </Button>
                ))}
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
                          City
                        </Label>
                        <Input
                          placeholder="Filter by city"
                          value={filters.city}
                          onChange={(e) =>
                            handleFilterChange({
                              ...filters,
                              city: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2">
                          State/Province
                        </Label>
                        <Input
                          placeholder="Filter by state"
                          value={filters.state}
                          onChange={(e) =>
                            handleFilterChange({
                              ...filters,
                              state: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2">
                          Country
                        </Label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          value={filters.country}
                          onChange={(e) =>
                            handleFilterChange({
                              ...filters,
                              country: e.target.value,
                            })
                          }
                        >
                          <option value="">All Countries</option>
                          {countries.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2">
                          Status
                        </Label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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

            {/* Galleries Grid/List */}
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
                    Error Loading Galleries
                  </h3>
                  <p className="text-gray-500 mb-6">{error}</p>
                  <Button
                    onClick={() => dispatch(fetchGalleries({ page: 1, limit: pagination.limit }))}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    Try Again
                  </Button>
                </div>
              ) : galleries?.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <Building className="w-16 h-16 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">
                    No Galleries Found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery || filters.city || filters.state || filters.country
                      ? "Try adjusting your search criteria or filters."
                      : "Start building your gallery network by adding your first gallery."}
                  </p>
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add First Gallery
                  </Button>
                </motion.div>
              ) : (
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                  {galleries?.map((gallery, index) => (
                    <motion.div
                      key={gallery.id}
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
                            <Avatar className="w-16 h-16 border-4 border-gradient-to-r from-blue-400 to-purple-400">
                              <AvatarImage src={gallery.logoUrl} />
                              <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-400 text-white text-xl font-bold">
                                {gallery?.name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex space-x-1">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => openViewDialog(gallery)}
                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </motion.button>
                              {/* <Link href={`/galleries/${gallery.id}`}>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                                >
                                  <BarChart3 className="w-4 h-4" />
                                </motion.button>
                              </Link> */}
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => openEditDialog(gallery)}
                                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteGallery(gallery.id, gallery.name)}
                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>

                          <h3 className="font-bold text-lg text-gray-800 mb-2">
                            {gallery.name}
                          </h3>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                              {gallery.city}, {gallery.state}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Users className="w-4 h-4 mr-2 text-purple-500" />
                              {gallery.totalArtists} artists
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <ImageIcon className="w-4 h-4 mr-2 text-green-500" />
                              {gallery.totalArtworks} artworks
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <Badge
                              variant={gallery.isActive ? "default" : "destructive"}
                              className={
                                gallery.isActive
                                  ? "bg-green-100 text-green-700 border border-green-200"
                                  : "bg-red-100 text-red-700 border border-red-200"
                              }
                            >
                              {"Active" }
                            </Badge>
                            <div className="flex items-center text-xs text-gray-500">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(gallery.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ) : (
                        // List view
                        <>
                          <Avatar className="w-16 h-16 border-4 border-gradient-to-r from-blue-400 to-purple-400">
                            <AvatarImage src={gallery.logoUrl} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-400 text-white text-xl font-bold">
                              {gallery.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-bold text-lg text-gray-800">
                                {gallery.name}
                              </h3>
                              <Badge
                                variant={gallery.isActive ? "default" : "destructive"}
                                className={
                                  gallery.isActive
                                    ? "bg-green-100 text-green-700 border border-green-200"
                                    : "bg-red-100 text-red-700 border border-red-200"
                                }
                              >
                                {gallery.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                                {gallery.city}, {gallery.state}
                              </div>
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1 text-purple-500" />
                                {gallery.totalArtists} artists
                              </div>
                              <div className="flex items-center">
                                <ImageIcon className="w-4 h-4 mr-1 text-green-500" />
                                {gallery.totalArtworks} artworks
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {gallery.description || "No description available"}
                            </p>
                          </div>
                          <div className="flex space-x-1">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => openViewDialog(gallery)}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>
                            <Link href={`/galleries/${gallery.id}`}>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                              >
                                <BarChart3 className="w-4 h-4" />
                              </motion.button>
                            </Link>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => openEditDialog(gallery)}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteGallery(gallery.id, gallery.name)}
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
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                            : "border-blue-200 hover:border-blue-400"
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
                {isCreateDialogOpen ? "Add New Gallery" : "Edit Gallery"}
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Gallery Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Gallery name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Address *</Label>
                  <Input
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Street address"
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm font-medium">City *</Label>
                    <Input
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      placeholder="City"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">State/Province</Label>
                    <Input
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                      placeholder="State or Province"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm font-medium">ZIP/Postal Code</Label>
                    <Input
                      value={formData.zipCode}
                      onChange={(e) =>
                        setFormData({ ...formData, zipCode: e.target.value })
                      }
                      placeholder="ZIP Code"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Country</Label>
                    <select
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          country: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a country</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
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
                  <Label className="text-sm font-medium">Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="gallery@example.com"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Website</Label>
                  <Input
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    placeholder="https://gallery.com"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Instagram</Label>
                  <Input
                    value={formData.socialMedia?.instagram || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialMedia: {
                          ...formData.socialMedia,
                          instagram: e.target.value,
                        },
                      })
                    }
                    placeholder="@galleryname"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Facebook</Label>
                  <Input
                    value={formData.socialMedia?.facebook || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialMedia: {
                          ...formData.socialMedia,
                          facebook: e.target.value,
                        },
                      })
                    }
                    placeholder="facebook.com/gallery"
                    className="mt-1"
                  />
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
                  placeholder="Describe your gallery, its mission, and featured collections..."
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Opening Hours</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                  {daysOfWeek.map((day) => (
                    <div key={day}>
                      <Label className="text-xs text-gray-600 capitalize">
                        {day}
                      </Label>
                      <Input
                        value={formData.openingHours?.[day] || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            openingHours: {
                              ...formData.openingHours,
                              [day]: e.target.value,
                            },
                          })
                        }
                        placeholder="9:00-17:00"
                        className="mt-1 text-sm"
                      />
                    </div>
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
                  isCreateDialogOpen ? handleCreateGallery : handleUpdateGallery
                }
                disabled={!formData.name || !formData.address || !formData.city || isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                {isLoading ? "Saving..." : (isCreateDialogOpen ? "Create Gallery" : "Update Gallery")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl">
            {selectedGallery && (
              <div>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Gallery Details
                  </DialogTitle>
                </DialogHeader>

                <div className="mt-6">
                  <div className="flex items-center space-x-6 mb-6">
                    <Avatar className="w-24 h-24 border-4 border-gradient-to-r from-blue-400 to-purple-400">
                      <AvatarImage src={selectedGallery.logoUrl} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-400 text-white text-2xl font-bold">
                        {selectedGallery.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {selectedGallery.name}
                      </h3>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          {selectedGallery.address}, {selectedGallery.city}, {selectedGallery.state}
                        </div>
                        {selectedGallery.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-4 h-4 mr-1" />
                            {selectedGallery.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">
                        Gallery Information
                      </h4>
                      <div className="space-y-2">
                        {selectedGallery.email && (
                          <div className="flex items-center text-sm">
                            <Mail className="w-4 h-4 mr-2 text-blue-500" />
                            <span className="text-gray-600">Email:</span>
                            <span className="ml-2 font-medium">
                              {selectedGallery.email}
                            </span>
                          </div>
                        )}
                        {selectedGallery.website && (
                          <div className="flex items-center text-sm">
                            <Globe className="w-4 h-4 mr-2 text-green-500" />
                            <span className="text-gray-600">Website:</span>
                            <a
                              href={selectedGallery.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 font-medium text-blue-600 hover:text-blue-800"
                            >
                              {selectedGallery.website}
                            </a>
                          </div>
                        )}
                        <div className="flex items-center text-sm">
                          <Users className="w-4 h-4 mr-2 text-purple-500" />
                          <span className="text-gray-600">Artists:</span>
                          <span className="ml-2 font-medium">
                            {selectedGallery.totalArtists}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <ImageIcon className="w-4 h-4 mr-2 text-green-500" />
                          <span className="text-gray-600">Artworks:</span>
                          <span className="ml-2 font-medium">
                            {selectedGallery.totalArtworks}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">
                        Opening Hours
                      </h4>
                      <div className="space-y-1 text-sm">
                        {daysOfWeek.map((day) => (
                          <div key={day} className="flex justify-between">
                            <span className="capitalize text-gray-600">{day}:</span>
                            <span className="font-medium">
                              {selectedGallery.openingHours?.[day] || "Closed"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {selectedGallery.description && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        About
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedGallery.description}
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
                    <Link href={`/galleries/${selectedGallery.id}`}>
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Manage Gallery
                      </Button>
                    </Link>
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

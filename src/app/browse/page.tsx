"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  fetchArtworks,
  setSearchQuery,
  setFilters,
  clearFilters,
  clearError,
} from "@/store/slices/artworksSlice";
import { fetchArtists } from "@/store/slices/artistsSlice";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UserRole } from "@/types/auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Eye,
  Heart,
  ShoppingBag,
  Star,
  MapPin,
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
  Check,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Mock Razorpay integration (for demo purposes)
declare global {
  interface Window {
    Razorpay: any;
  }
}

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

export default function BrowseArtworksPage() {
  const dispatch = useAppDispatch();
  const { artworks, isLoading, error, searchQuery, filters, pagination } =
    useAppSelector((state) => state.artworks);
  const { artists } = useAppSelector((state) => state.artists);
  const { user,role } = useAppSelector((state) => state.auth);

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<any>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  useEffect(() => {
    dispatch(fetchArtworks({ page: 1, limit: 12 }));
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

  const handleFilterChange = (newFilters: any) => {
    dispatch(setFilters(newFilters));
    dispatch(
      fetchArtworks({ filters: newFilters, page: 1, limit: pagination.limit })
    );
  };

  const openViewDialog = (artwork: any) => {
    setSelectedArtwork(artwork);
    setIsViewDialogOpen(true);
  };

  const toggleFavorite = (artworkId: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(artworkId)) {
      newFavorites.delete(artworkId);
    } else {
      newFavorites.add(artworkId);
    }
    setFavorites(newFavorites);
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
    dispatch(fetchArtworks({ page: 1, limit: pagination.limit, filters: { isForSale: true } }));
  };

  const initiatePayment = async (artwork: any) => {
    setIsPaymentProcessing(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock Razorpay integration
      const options = {
        key: "rzp_test_1234567890", // Demo key
        amount: artwork.price * 100, // Amount in paise
        currency: "INR",
        name: "Art Gallery",
        description: `Purchase of "${artwork.title}"`,
        image: artwork.imageUrl,
        order_id: `order_${Date.now()}`, // Mock order ID
        handler: function (response: any) {
          // Payment success
          alert(`Payment successful! Transaction ID: ${response.razorpay_payment_id}`);
          setIsPaymentProcessing(false);
        },
        prefill: {
          name: user?.name || "Art Lover",
          email: user?.email || "user@example.com",
          contact: "9999999999"
        },
        notes: {
          artwork_id: artwork.id,
          artwork_title: artwork.title
        },
        theme: {
          color: "#7c3aed"
        },
        modal: {
          ondismiss: function() {
            setIsPaymentProcessing(false);
          }
        }
      };

      // For demo purposes, we'll simulate the payment
      const mockPayment = confirm(
        `Mock Payment for "${artwork.title}"\nAmount: $${artwork.price}\n\nClick OK to simulate successful payment, Cancel to simulate failure.`
      );

      if (mockPayment) {
        alert(`Payment successful! You have purchased "${artwork.title}" for $${artwork.price}`);
      } else {
        alert("Payment cancelled");
      }

    } catch (error) {
      alert("Payment failed. Please try again.");
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  return (
    <ProtectedRoute >
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-blue-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
                  Discover Beautiful Artworks
                </h1>
                <p className="text-gray-600 text-xl max-w-2xl mx-auto">
                  Explore our curated collection of stunning artworks from talented artists around the world
                </p>
              </div>

              {/* Search, Filters and View Toggle */}
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search artworks by title, artist, medium, or tags..."
                    className="pl-10 py-3 text-lg border-2 border-purple-200 focus:border-purple-400 rounded-xl bg-white/80 backdrop-blur-sm"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="px-6 py-3 border-2 border-purple-200 hover:border-purple-400 rounded-xl bg-white/80 backdrop-blur-sm"
                  >
                    <Filter className="w-5 h-5 mr-2" />
                    Filters
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearAllFilters}
                    className="px-6 py-3 border-2 border-gray-200 hover:border-gray-400 rounded-xl bg-white/80 backdrop-blur-sm"
                  >
                    Clear
                  </Button>
                  <div className="flex border border-purple-200 rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm">
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
              </div>

              {/* Filter Panel */}
              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white/90 backdrop-blur-md rounded-xl border-2 border-purple-200 p-6 mb-6 shadow-lg"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2">
                          Medium
                        </Label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
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
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
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
                          Year Range
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder="From"
                            value={filters.yearFrom || ""}
                            onChange={(e) =>
                              handleFilterChange({
                                ...filters,
                                yearFrom: e.target.value ? parseInt(e.target.value) : null,
                              })
                            }
                            className="w-full"
                          />
                          <Input
                            type="number"
                            placeholder="To"
                            value={filters.yearTo || ""}
                            onChange={(e) =>
                              handleFilterChange({
                                ...filters,
                                yearTo: e.target.value ? parseInt(e.target.value) : null,
                              })
                            }
                            className="w-full"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2">
                          Price Range
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder="Min"
                            value={filters.priceFrom || ""}
                            onChange={(e) =>
                              handleFilterChange({
                                ...filters,
                                priceFrom: e.target.value ? parseFloat(e.target.value) : null,
                              })
                            }
                            className="w-full"
                          />
                          <Input
                            type="number"
                            placeholder="Max"
                            value={filters.priceTo || ""}
                            onChange={(e) =>
                              handleFilterChange({
                                ...filters,
                                priceTo: e.target.value ? parseFloat(e.target.value) : null,
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
                      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg animate-pulse overflow-hidden"
                    >
                      <div className="h-48 bg-gradient-to-br from-purple-200 to-pink-200"></div>
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
                        fetchArtworks({ page: 1, limit: pagination.limit, filters: { isForSale: true } })
                      )
                    }
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
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
                  <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                    <Palette className="w-16 h-16 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">
                    No Artworks Found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery || filters.medium || filters.artistId
                      ? "Try adjusting your search criteria or filters."
                      : "No artworks are currently available for sale."}
                  </p>
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
                      className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-purple-100 ${
                        viewMode === "list" ? "flex items-center gap-4" : ""
                      }`}
                    >
                      {viewMode === "grid" ? (
                        <div>
                          {/* Image */}
                          <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100">
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
                                onClick={() => toggleFavorite(artwork.id)}
                                className={`p-2 rounded-lg transition-colors shadow-sm ${
                                  favorites.has(artwork.id)
                                    ? "bg-red-500 text-white"
                                    : "bg-white/90 text-red-500 hover:bg-white"
                                }`}
                              >
                                <Heart className={`w-4 h-4 ${favorites.has(artwork.id) ? "fill-current" : ""}`} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => openViewDialog(artwork)}
                                className="p-2 bg-white/90 text-purple-600 rounded-lg hover:bg-white transition-colors shadow-sm"
                              >
                                <Eye className="w-4 h-4" />
                              </motion.button>
                            </div>
                            <div className="absolute bottom-2 left-2">
                              <Badge className="bg-green-500 text-white">
                                For Sale
                              </Badge>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-4">
                            <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">
                              {artwork.title}
                            </h3>

                            <div className="space-y-2 mb-4">
                              <div className="flex items-center text-sm text-gray-600">
                                <User className="w-4 h-4 mr-2 text-purple-500" />
                                {artwork.artist?.name || "Unknown Artist"}
                              </div>
                              {artwork.gallery && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                                  {artwork.gallery.name}
                                </div>
                              )}
                              <div className="flex items-center text-sm text-gray-600">
                                <Palette className="w-4 h-4 mr-2 text-pink-500" />
                                {artwork.medium}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="w-4 h-4 mr-2 text-green-500" />
                                {artwork.yearCreated}
                              </div>
                              {artwork.price && (
                                <div className="flex items-center text-lg font-bold text-green-600">
                                  <DollarSign className="w-5 h-5 mr-1" />
                                  {artwork.price.toLocaleString()}
                                </div>
                              )}
                            </div>

                            {artwork.dimensions && (
                              <div className="text-xs text-gray-500 mb-4">
                                {artwork.dimensions}
                              </div>
                            )}

                            {/* Buy Button */}
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => initiatePayment(artwork)}
                              disabled={isPaymentProcessing}
                              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isPaymentProcessing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <ShoppingBag className="w-4 h-4" />
                              )}
                              {isPaymentProcessing ? "Processing..." : "Buy Now"}
                            </motion.button>
                          </div>
                        </div>
                      ) : (
                        // List view
                        <>
                          <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg overflow-hidden flex-shrink-0 ml-4">
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
                              <Badge className="bg-green-500 text-white ml-2">
                                For Sale
                              </Badge>
                            </div>
                            <div className="flex items-center gap-6 text-sm text-gray-600 mb-2">
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-1 text-purple-500" />
                                {artwork.artist?.name || "Unknown Artist"}
                              </div>
                              {artwork.gallery && (
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                                  {artwork.gallery.name}
                                </div>
                              )}
                              <div className="flex items-center">
                                <Palette className="w-4 h-4 mr-1 text-pink-500" />
                                {artwork.medium}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1 text-green-500" />
                                {artwork.yearCreated}
                              </div>
                              {artwork.price && (
                                <div className="flex items-center font-bold text-green-600">
                                  <DollarSign className="w-4 h-4 mr-1" />
                                  {artwork.price.toLocaleString()}
                                </div>
                              )}
                            </div>
                            {artwork.dimensions && (
                              <div className="text-xs text-gray-500 mb-2">
                                {artwork.dimensions}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col space-y-2 p-4">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => toggleFavorite(artwork.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                favorites.has(artwork.id)
                                  ? "bg-red-500 text-white"
                                  : "bg-red-100 text-red-600 hover:bg-red-200"
                              }`}
                            >
                              <Heart className={`w-4 h-4 ${favorites.has(artwork.id) ? "fill-current" : ""}`} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => openViewDialog(artwork)}
                              className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => initiatePayment(artwork)}
                              disabled={isPaymentProcessing}
                              className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50"
                            >
                              {isPaymentProcessing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <ShoppingBag className="w-4 h-4" />
                              )}
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
                    className="border-purple-200 hover:border-purple-400 bg-white/80 backdrop-blur-sm"
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
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                              : "border-purple-200 hover:border-purple-400 bg-white/80 backdrop-blur-sm"
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
                    className="border-purple-200 hover:border-purple-400 bg-white/80 backdrop-blur-sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            {selectedArtwork && (
              <div>
                <DialogHeader>
                  <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {selectedArtwork.title}
                  </DialogTitle>
                </DialogHeader>

                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Image */}
                  <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl overflow-hidden">
                    <img
                      src={selectedArtwork.imageUrl}
                      alt={selectedArtwork.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop`;
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          Artist
                        </Label>
                        <p className="text-lg font-semibold text-gray-900">
                          {selectedArtwork.artist?.name || "Unknown Artist"}
                        </p>
                      </div>
                      {selectedArtwork.gallery && (
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Gallery
                          </Label>
                          <p className="text-lg font-semibold text-gray-900">
                            {selectedArtwork.gallery.name}
                          </p>
                        </div>
                      )}
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
                          Year
                        </Label>
                        <p className="text-gray-900">
                          {selectedArtwork.yearCreated}
                        </p>
                      </div>
                      {selectedArtwork.dimensions && (
                        <div className="col-span-2">
                          <Label className="text-sm font-medium text-gray-700">
                            Dimensions
                          </Label>
                          <p className="text-gray-900">
                            {selectedArtwork.dimensions}
                          </p>
                        </div>
                      )}
                    </div>

                    {selectedArtwork.price && (
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border border-green-200">
                        <Label className="text-sm font-medium text-gray-700">
                          Price
                        </Label>
                        <p className="text-3xl font-bold text-green-600">
                          ${selectedArtwork.price.toLocaleString()}
                        </p>
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

                    <div className="flex gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleFavorite(selectedArtwork.id)}
                        className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                          favorites.has(selectedArtwork.id)
                            ? "bg-red-500 text-white"
                            : "bg-red-100 text-red-600 hover:bg-red-200"
                        }`}
                      >
                        <Heart className={`w-5 h-5 inline mr-2 ${favorites.has(selectedArtwork.id) ? "fill-current" : ""}`} />
                        {favorites.has(selectedArtwork.id) ? "Remove from Favorites" : "Add to Favorites"}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => initiatePayment(selectedArtwork)}
                        disabled={isPaymentProcessing}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isPaymentProcessing ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <ShoppingBag className="w-5 h-5" />
                        )}
                        {isPaymentProcessing ? "Processing..." : "Buy Now"}
                      </motion.button>
                    </div>
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

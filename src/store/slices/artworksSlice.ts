import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { artworkService } from "@/services/artworkService";

export interface Artwork {
  id: number;
  title: string;
  description?: string;
  artist: {
    id: number;
    name: string;
    email: string;
  };
  gallery: {
    id: number;
    name: string;
  };
  imageUrl: string;
  thumbnailUrl?: string;
  medium?: string;
  dimensions?: string;
  yearCreated?: number;
  price?: number;
  isForSale: boolean;
  status: "ACTIVE" | "INACTIVE" | "SOLD" | "RESERVED";
  viewCount: number;
  isFeatured: boolean;
  fileName?: string;
  fileSize?: number;
  contentType?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArtworkFormData {
  title: string;
  description?: string;
  galleryId: number;
  imageUrl: string;
  thumbnailUrl?: string;
  medium?: string;
  dimensions?: string;
  yearCreated?: number;
  price?: number;
  isForSale: boolean;
  status?: string;
  isFeatured?: boolean;
}

interface ArtworksState {
  artworks: Artwork[];
  currentArtwork: Artwork | null;
  featuredArtworks: Artwork[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  filters: {
    artistId: number | null;
    galleryId: number | null;
    medium: string;
    yearFrom: number | null;
    yearTo: number | null;
    priceFrom: number | null;
    priceTo: number | null;
    isForSale: boolean | null;
    isFeatured: boolean | null;
    status: string;
  };
  sortBy: "title" | "yearCreated" | "price" | "viewCount" | "createdAt";
  sortOrder: "asc" | "desc";
  viewMode: "grid" | "list";
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: ArtworksState = {
  artworks: [],
  currentArtwork: null,
  featuredArtworks: [],
  isLoading: false,
  error: null,
  searchQuery: "",
  filters: {
    artistId: null,
    galleryId: null,
    medium: "",
    yearFrom: null,
    yearTo: null,
    priceFrom: null,
    priceTo: null,
    isForSale: null,
    isFeatured: null,
    status: "",
  },
  sortBy: "createdAt",
  sortOrder: "desc",
  viewMode: "grid",
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks
export const fetchArtworks = createAsyncThunk(
  "artworks/fetchArtworks",
  async (params: {
    page?: number;
    limit?: number;
    search?: string;
    artistId?:string;
    filters?: Partial<ArtworksState["filters"]>;
    sortBy?: string;
    sortOrder?: string;
  }, { rejectWithValue }) => {
    try {
      return await artworkService.getArtworks(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch artworks");
    }
  }
);

export const fetchArtworkById = createAsyncThunk(
  "artworks/fetchArtworkById",
  async (id: number, { rejectWithValue }) => {
    try {
      return await artworkService.getArtworkById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch artwork");
    }
  }
);

export const fetchFeaturedArtworks = createAsyncThunk(
  "artworks/fetchFeaturedArtworks",
  async (limit = 6, { rejectWithValue }) => {
    try {
      return await artworkService.getFeaturedArtworks(limit);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch featured artworks");
    }
  }
);

export const createArtwork = createAsyncThunk(
  "artworks/createArtwork",
  async (artworkData: ArtworkFormData , { rejectWithValue }) => {
    try {
      return await artworkService.createArtwork(artworkData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create artwork");
    }
  }
);

export const updateArtwork = createAsyncThunk(
  "artworks/updateArtwork",
  async ({ id, data }: { id: number; data: Partial<ArtworkFormData> }, { rejectWithValue }) => {
    try {
      return await artworkService.updateArtwork(id, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update artwork");
    }
  }
);

export const deleteArtwork = createAsyncThunk(
  "artworks/deleteArtwork",
  async (id: number, { rejectWithValue }) => {
    try {
      await artworkService.deleteArtwork(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete artwork");
    }
  }
);

export const incrementViewCount = createAsyncThunk(
  "artworks/incrementViewCount",
  async (id: number, { rejectWithValue }) => {
    try {
      return await artworkService.incrementViewCount(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to increment view count");
    }
  }
);

const artworksSlice = createSlice({
  name: "artworks",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ArtworksState["filters"]>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSorting: (state, action: PayloadAction<{ sortBy: ArtworksState["sortBy"]; sortOrder: ArtworksState["sortOrder"] }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    setViewMode: (state, action: PayloadAction<ArtworksState["viewMode"]>) => {
      state.viewMode = action.payload;
    },
    setPagination: (state, action: PayloadAction<Partial<ArtworksState["pagination"]>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearCurrentArtwork: (state) => {
      state.currentArtwork = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.searchQuery = "";
    },
  },
  extraReducers: (builder) => {
    // Fetch artworks
    builder
      .addCase(fetchArtworks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchArtworks.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("gsfjhdgjh ::  ", action.payload);

        state.artworks = action.payload;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchArtworks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch artwork by ID
    builder
      .addCase(fetchArtworkById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchArtworkById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentArtwork = action.payload;
      })
      .addCase(fetchArtworkById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch featured artworks
    builder
      .addCase(fetchFeaturedArtworks.fulfilled, (state, action) => {
        state.featuredArtworks = action.payload;
      });

    // Create artwork
    builder
      .addCase(createArtwork.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createArtwork.fulfilled, (state, action) => {
        state.isLoading = false;
        state.artworks.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createArtwork.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update artwork
    builder
      .addCase(updateArtwork.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateArtwork.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.artworks.findIndex(artwork => artwork.id === action.payload.id);
        if (index !== -1) {
          state.artworks[index] = action.payload;
        }
        if (state.currentArtwork?.id === action.payload.id) {
          state.currentArtwork = action.payload;
        }
      })
      .addCase(updateArtwork.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete artwork
    builder
      .addCase(deleteArtwork.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteArtwork.fulfilled, (state, action) => {
        state.isLoading = false;
        state.artworks = state.artworks.filter(artwork => artwork.id !== action.payload);
        state.pagination.total -= 1;
        if (state.currentArtwork?.id === action.payload) {
          state.currentArtwork = null;
        }
      })
      .addCase(deleteArtwork.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Increment view count
    builder
      .addCase(incrementViewCount.fulfilled, (state, action) => {
        const artwork = state.artworks.find(a => a.id === action.payload.id);
        if (artwork) {
          artwork.viewCount = action.payload.viewCount;
        }
        if (state.currentArtwork?.id === action.payload.id) {
          state.currentArtwork.viewCount = action.payload.viewCount;
        }
      });
  },
});

export const {
  setSearchQuery,
  setFilters,
  setSorting,
  setViewMode,
  setPagination,
  clearCurrentArtwork,
  clearError,
  clearFilters,
} = artworksSlice.actions;

export default artworksSlice.reducer;

import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { galleryService } from "@/services/galleryService";

export interface Gallery {
  id: number;
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  email?: string;
  website?: string;
  openingHours: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  socialMedia: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  logoUrl?: string;
  images: string[];
  isActive: boolean;
  totalArtworks: number;
  totalArtists: number;
  totalEvents: number;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryFormData {
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  email?: string;
  website?: string;
  openingHours: Gallery["openingHours"];
  socialMedia: Gallery["socialMedia"];
}

interface GalleryState {
  galleries: Gallery[];
  currentGallery: Gallery | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  filters: {
    city: string;
    state: string;
    country: string;
    isActive: boolean | null;
  };
  sortBy: "name" | "city" | "totalArtworks" | "totalArtists" | "createdAt";
  sortOrder: "asc" | "desc";
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: GalleryState = {
  galleries: [],
  currentGallery: null,
  isLoading: false,
  error: null,
  searchQuery: "",
  filters: {
    city: "",
    state: "",
    country: "",
    isActive: null,
  },
  sortBy: "name",
  sortOrder: "asc",
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks
export const fetchGalleries = createAsyncThunk(
  "gallery/fetchGalleries",
  async (params: {
    page?: number;
    limit?: number;
    search?: string;
    artistId?: string;
    filters?: Partial<GalleryState["filters"]>;
    sortBy?: string;
    sortOrder?: string;
  }, { rejectWithValue }) => {
    try {
      return await galleryService.getGalleries(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch galleries");
    }
  }
);

export const fetchGalleryById = createAsyncThunk(
  "gallery/fetchGalleryById",
  async (id: number, { rejectWithValue }) => {
    try {
      return await galleryService.getGalleryById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch gallery");
    }
  }
);

export const createGallery = createAsyncThunk(
  "gallery/createGallery",
  async (galleryData: GalleryFormData, { rejectWithValue }) => {
    try {
      return await galleryService.createGallery(galleryData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create gallery");
    }
  }
);

export const updateGallery = createAsyncThunk(
  "gallery/updateGallery",
  async ({ id, data }: { id: number; data: Partial<GalleryFormData> }, { rejectWithValue }) => {
    try {
      return await galleryService.updateGallery(id, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update gallery");
    }
  }
);

export const deleteGallery = createAsyncThunk(
  "gallery/deleteGallery",
  async (id: number, { rejectWithValue }) => {
    try {
      await galleryService.deleteGallery(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete gallery");
    }
  }
);

export const uploadGalleryLogo = createAsyncThunk(
  "gallery/uploadGalleryLogo",
  async ({ id, logoFile }: { id: number; logoFile: File }, { rejectWithValue }) => {
    try {
      return await galleryService.uploadLogo(id, logoFile);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to upload logo");
    }
  }
);

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<GalleryState["filters"]>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSorting: (state, action: PayloadAction<{ sortBy: GalleryState["sortBy"]; sortOrder: GalleryState["sortOrder"] }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    setPagination: (state, action: PayloadAction<Partial<GalleryState["pagination"]>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearCurrentGallery: (state) => {
      state.currentGallery = null;
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
    // Fetch galleries
    builder
      .addCase(fetchGalleries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGalleries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.galleries = action.payload.galleries;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchGalleries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch gallery by ID
    builder
      .addCase(fetchGalleryById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGalleryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentGallery = action.payload;
      })
      .addCase(fetchGalleryById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create gallery
    builder
      .addCase(createGallery.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createGallery.fulfilled, (state, action) => {
        state.isLoading = false;
        state.galleries.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createGallery.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update gallery
    builder
      .addCase(updateGallery.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateGallery.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.galleries.findIndex(gallery => gallery.id === action.payload.id);
        if (index !== -1) {
          state.galleries[index] = action.payload;
        }
        if (state.currentGallery?.id === action.payload.id) {
          state.currentGallery = action.payload;
        }
      })
      .addCase(updateGallery.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete gallery
    builder
      .addCase(deleteGallery.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteGallery.fulfilled, (state, action) => {
        state.isLoading = false;
        state.galleries = state.galleries.filter(gallery => gallery.id !== action.payload);
        state.pagination.total -= 1;
        if (state.currentGallery?.id === action.payload) {
          state.currentGallery = null;
        }
      })
      .addCase(deleteGallery.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Upload gallery logo
    builder
      .addCase(uploadGalleryLogo.fulfilled, (state, action) => {
        const index = state.galleries.findIndex(gallery => gallery.id === action.payload.id);
        if (index !== -1) {
          state.galleries[index] = action.payload;
        }
        if (state.currentGallery?.id === action.payload.id) {
          state.currentGallery = action.payload;
        }
      });
  },
});

export const {
  setSearchQuery,
  setFilters,
  setSorting,
  setPagination,
  clearCurrentGallery,
  clearError,
  clearFilters,
} = gallerySlice.actions;

export default gallerySlice.reducer;

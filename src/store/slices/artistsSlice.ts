import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { artistService } from "@/services/artistService";

export interface Artist {
  id: number;
  name: string;
  email: string;
  phone?: string;
  birthplace?: string;
  age?: number;
  artisticStyle: string;
  biography?: string;
  profileImage?: string;
  socialLinks?: {
    website?: string;
    instagram?: string;
    twitter?: string;
  };
  specializations: string[];
  isActive: boolean;
  totalArtworks: number;
  createdAt: string;
  updatedAt: string;
}

export interface ArtistFormData {
  fullname: string;
  email: string;
  phone?: string;
  username?: string;
  password?: string;
  birthplace?: string;
  age?: number;
  artisticStyle: string;
  biography?: string;
  specializations: string[];
  socialMedia: {};
}

interface ArtistsState {
  artists: Artist[];
  currentArtist: Artist | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  filters: {
    artisticStyle: string;
    specialization: string;
    isActive: boolean | null;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: ArtistsState = {
  artists: [],
  currentArtist: null,
  isLoading: false,
  error: null,
  searchQuery: "",
  filters: {
    artisticStyle: "",
    specialization: "",
    isActive: null,
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks
export const fetchArtists = createAsyncThunk(
  "artists/fetchArtists",
  async (
    params: {
      page?: number;
      limit?: number;
      search?: string;
      filters?: Partial<ArtistsState["filters"]>;
    },
    { rejectWithValue }
  ) => {
    try {
      return await artistService.getArtists(params);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch artists"
      );
    }
  }
);

export const fetchArtistsByCreator = createAsyncThunk(
  "artists/fetchArtistsByCreator",
  async (
    params: {
      page?: number;
      limit?: number;
      search?: string;
      filters?: Partial<ArtistsState["filters"]>;
    },
    { rejectWithValue }
  ) => {
    try {
      return await artistService.getArtistsByCreator(params);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch artists"
      );
    }
  }
);

export const fetchArtistById = createAsyncThunk(
  "artists/fetchArtistById",
  async (id: number, { rejectWithValue }) => {
    try {
      return await artistService.getArtistById(id);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch artist"
      );
    }
  }
);

export const createArtist = createAsyncThunk(
  "artists/createArtist",
  async (artistData: ArtistFormData, { rejectWithValue }) => {
    try {
      return await artistService.createArtist(artistData);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create artist"
      );
    }
  }
);

export const updateArtist = createAsyncThunk(
  "artists/updateArtist",
  async (
    { id, data }: { id: number; data: Partial<ArtistFormData> },
    { rejectWithValue }
  ) => {
    try {
      return await artistService.updateArtist(id, data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update artist"
      );
    }
  }
);

export const deleteArtist = createAsyncThunk(
  "artists/deleteArtist",
  async (id: number, { rejectWithValue }) => {
    try {
      await artistService.deleteArtist(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete artist"
      );
    }
  }
);

const artistsSlice = createSlice({
  name: "artists",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<ArtistsState["filters"]>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (
      state,
      action: PayloadAction<Partial<ArtistsState["pagination"]>>
    ) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearCurrentArtist: (state) => {
      state.currentArtist = null;
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
    // Fetch artists
    builder
      .addCase(fetchArtists.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchArtists.fulfilled, (state, action) => {
        state.isLoading = false;
        state.artists = action.payload;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchArtists.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    //Fetch artist by Creator
    builder
      .addCase(fetchArtistsByCreator.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchArtistsByCreator.fulfilled, (state, action) => {
        state.isLoading = false;
        state.artists = action.payload;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchArtistsByCreator.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch artist by ID
    builder
      .addCase(fetchArtistById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchArtistById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentArtist = action.payload;
      })
      .addCase(fetchArtistById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create artist
    builder
      .addCase(createArtist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createArtist.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("dgvhvg : ", action.payload);

        if (Array.isArray(state.artists)) {
          state.artists.push(action.payload);
        } else {
          state.artists = [action.payload];
        }

        state.pagination.total += 1;
      })
      .addCase(createArtist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update artist
    builder
      .addCase(updateArtist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateArtist.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.artists.findIndex(
          (artist) => artist.id === action.payload.id
        );
        if (index !== -1) {
          state.artists[index] = action.payload;
        }
        if (state.currentArtist?.id === action.payload.id) {
          state.currentArtist = action.payload;
        }
      })
      .addCase(updateArtist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete artist
    builder
      .addCase(deleteArtist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteArtist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.artists = state.artists.filter(
          (artist) => artist.id !== action.payload
        );
        state.pagination.total -= 1;
        if (state.currentArtist?.id === action.payload) {
          state.currentArtist = null;
        }
      })
      .addCase(deleteArtist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSearchQuery,
  setFilters,
  setPagination,
  clearCurrentArtist,
  clearError,
  clearFilters,
} = artistsSlice.actions;

export default artistsSlice.reducer;

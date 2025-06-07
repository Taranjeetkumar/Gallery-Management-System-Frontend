import type {
  Artwork,
  ArtworkFilters,
  CreateArtworkData,
  CreateGalleryData,
  Gallery,
  GalleryFilters,
} from "@/types/gallery";
import {
  type PayloadAction,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

// Mock data for galleries
const mockGalleries: Gallery[] = [
  {
    id: "1",
    name: "Modern Contemporary",
    description:
      "A curated collection of contemporary artworks from emerging and established artists.",
    coverImage:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop",
    ownerId: "1",
    ownerName: "John Doe",
    isPublic: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    artworkCount: 12,
  },
  {
    id: "2",
    name: "Abstract Expressions",
    description:
      "Bold and vibrant abstract paintings that capture emotion and movement.",
    coverImage:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    ownerId: "2",
    ownerName: "Jane Smith",
    isPublic: true,
    createdAt: "2024-01-20T14:30:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
    artworkCount: 8,
  },
  {
    id: "3",
    name: "Digital Renaissance",
    description:
      "Exploring the intersection of technology and traditional art forms.",
    coverImage:
      "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop",
    ownerId: "1",
    ownerName: "John Doe",
    isPublic: false,
    createdAt: "2024-02-01T09:15:00Z",
    updatedAt: "2024-02-01T09:15:00Z",
    artworkCount: 15,
  },
  {
    id: "4",
    name: "Nature Studies",
    description:
      "Beautiful landscapes and natural scenes captured in various mediums.",
    coverImage:
      "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800&h=600&fit=crop",
    ownerId: "3",
    ownerName: "Alice Johnson",
    isPublic: true,
    createdAt: "2024-02-10T16:45:00Z",
    updatedAt: "2024-02-10T16:45:00Z",
    artworkCount: 6,
  },
  {
    id: "5",
    name: "Urban Perspectives",
    description:
      "Street art and urban photography showcasing city life and culture.",
    coverImage:
      "https://images.unsplash.com/photo-1536924430914-91f9c2041209?w=800&h=600&fit=crop",
    ownerId: "2",
    ownerName: "Jane Smith",
    isPublic: true,
    createdAt: "2024-02-15T11:20:00Z",
    updatedAt: "2024-02-15T11:20:00Z",
    artworkCount: 10,
  },
  {
    id: "6",
    name: "Classical Portraits",
    description:
      "Timeless portrait paintings in traditional and contemporary styles.",
    coverImage:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    ownerId: "1",
    ownerName: "John Doe",
    isPublic: true,
    createdAt: "2024-02-20T13:00:00Z",
    updatedAt: "2024-02-20T13:00:00Z",
    artworkCount: 9,
  },
];

// Mock data for artworks
const mockArtworks: Artwork[] = [
  {
    id: "1",
    title: "Sunset Dreams",
    description:
      "A vibrant abstract painting capturing the essence of a summer sunset.",
    artistId: "1",
    artistName: "John Doe",
    galleryId: "1",
    galleryName: "Modern Contemporary",
    imageUrl:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&h=800&fit=crop",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
    medium: "Oil on Canvas",
    dimensions: '36" x 48"',
    year: 2023,
    price: 1200,
    isForSale: true,
    tags: ["abstract", "colorful", "contemporary"],
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    title: "Urban Rhythm",
    description: "Dynamic street art piece reflecting the energy of city life.",
    artistId: "2",
    artistName: "Jane Smith",
    galleryId: "5",
    galleryName: "Urban Perspectives",
    imageUrl:
      "https://images.unsplash.com/photo-1536924430914-91f9c2041209?w=1200&h=800&fit=crop",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1536924430914-91f9c2041209?w=400&h=300&fit=crop",
    medium: "Acrylic and Spray Paint",
    dimensions: '48" x 72"',
    year: 2024,
    price: 800,
    isForSale: true,
    tags: ["street art", "urban", "modern"],
    createdAt: "2024-02-15T11:30:00Z",
    updatedAt: "2024-02-15T11:30:00Z",
  },
  {
    id: "3",
    title: "Digital Bloom",
    description:
      "A fusion of traditional florals with digital enhancement techniques.",
    artistId: "1",
    artistName: "John Doe",
    galleryId: "3",
    galleryName: "Digital Renaissance",
    imageUrl:
      "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1200&h=800&fit=crop",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop",
    medium: "Digital Print on Canvas",
    dimensions: '24" x 36"',
    year: 2024,
    price: 600,
    isForSale: false,
    tags: ["digital", "floral", "technology"],
    createdAt: "2024-02-01T09:30:00Z",
    updatedAt: "2024-02-01T09:30:00Z",
  },
  {
    id: "4",
    title: "Mountain Serenity",
    description:
      "Peaceful landscape capturing the quiet beauty of mountain ranges.",
    artistId: "3",
    artistName: "Alice Johnson",
    galleryId: "4",
    galleryName: "Nature Studies",
    imageUrl:
      "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=1200&h=800&fit=crop",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400&h=300&fit=crop",
    medium: "Watercolor",
    dimensions: '18" x 24"',
    year: 2023,
    price: 450,
    isForSale: true,
    tags: ["landscape", "nature", "watercolor"],
    createdAt: "2024-02-10T17:00:00Z",
    updatedAt: "2024-02-10T17:00:00Z",
  },
  {
    id: "5",
    title: "Abstract Energy",
    description:
      "Bold brushstrokes and vivid colors create a sense of movement and energy.",
    artistId: "2",
    artistName: "Jane Smith",
    galleryId: "2",
    galleryName: "Abstract Expressions",
    imageUrl:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=800&fit=crop",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    medium: "Acrylic on Canvas",
    dimensions: '30" x 40"',
    year: 2024,
    price: 950,
    isForSale: true,
    tags: ["abstract", "energy", "vibrant"],
    createdAt: "2024-01-20T15:00:00Z",
    updatedAt: "2024-01-20T15:00:00Z",
  },
  {
    id: "6",
    title: "Portrait Study",
    description: "Classic portrait showcasing traditional painting techniques.",
    artistId: "1",
    artistName: "John Doe",
    galleryId: "6",
    galleryName: "Classical Portraits",
    imageUrl:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=800&fit=crop",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    medium: "Oil on Canvas",
    dimensions: '16" x 20"',
    year: 2023,
    price: 750,
    isForSale: true,
    tags: ["portrait", "classical", "traditional"],
    createdAt: "2024-02-20T13:30:00Z",
    updatedAt: "2024-02-20T13:30:00Z",
  },
];

// Utility function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface GalleryState {
  galleries: Gallery[];
  artworks: Artwork[];
  currentGallery: Gallery | null;
  currentArtwork: Artwork | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    gallery: GalleryFilters;
    artwork: ArtworkFilters;
  };
}

const initialState: GalleryState = {
  galleries: [],
  artworks: [],
  currentGallery: null,
  currentArtwork: null,
  isLoading: false,
  error: null,
  filters: {
    gallery: {},
    artwork: {},
  },
};

// Gallery async thunks with mock implementations
export const fetchGalleries = createAsyncThunk(
  "gallery/fetchGalleries",
  async (filters?: GalleryFilters, { rejectWithValue }) => {
    try {
      await delay(500);

      let filteredGalleries = [...mockGalleries];

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredGalleries = filteredGalleries.filter(
          (gallery) =>
            gallery.name.toLowerCase().includes(searchLower) ||
            gallery.description.toLowerCase().includes(searchLower) ||
            gallery.ownerName.toLowerCase().includes(searchLower),
        );
      }

      if (filters?.ownerId) {
        filteredGalleries = filteredGalleries.filter(
          (gallery) => gallery.ownerId === filters.ownerId,
        );
      }

      if (filters?.isPublic !== undefined) {
        filteredGalleries = filteredGalleries.filter(
          (gallery) => gallery.isPublic === filters.isPublic,
        );
      }

      // Sort galleries
      if (filters?.sortBy) {
        filteredGalleries.sort((a, b) => {
          const aVal = a[filters.sortBy!];
          const bVal = b[filters.sortBy!];
          const order = filters.sortOrder === "desc" ? -1 : 1;

          if (typeof aVal === "string" && typeof bVal === "string") {
            return aVal.localeCompare(bVal) * order;
          }
          return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * order;
        });
      }

      return filteredGalleries;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch galleries");
    }
  },
);

export const fetchGalleryById = createAsyncThunk(
  "gallery/fetchGalleryById",
  async (id: string, { rejectWithValue }) => {
    try {
      await delay(300);

      const gallery = mockGalleries.find((g) => g.id === id);
      if (!gallery) {
        throw new Error("Gallery not found");
      }

      return gallery;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch gallery");
    }
  },
);

export const createGallery = createAsyncThunk(
  "gallery/createGallery",
  async (data: CreateGalleryData, { rejectWithValue }) => {
    try {
      await delay(1000);

      const newGallery: Gallery = {
        id: (mockGalleries.length + 1).toString(),
        name: data.name,
        description: data.description,
        coverImage: data.coverImage
          ? `https://images.unsplash.com/photo-${Date.now()}?w=800&h=600&fit=crop`
          : undefined,
        ownerId: "1", // Current user ID
        ownerName: "Current User",
        isPublic: data.isPublic,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        artworkCount: 0,
      };

      mockGalleries.push(newGallery);
      return newGallery;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create gallery");
    }
  },
);

export const updateGallery = createAsyncThunk(
  "gallery/updateGallery",
  async (
    { id, data }: { id: string; data: Partial<CreateGalleryData> },
    { rejectWithValue },
  ) => {
    try {
      await delay(800);

      const index = mockGalleries.findIndex((g) => g.id === id);
      if (index === -1) {
        throw new Error("Gallery not found");
      }

      const updatedGallery = {
        ...mockGalleries[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };

      mockGalleries[index] = updatedGallery;
      return updatedGallery;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update gallery");
    }
  },
);

export const deleteGallery = createAsyncThunk(
  "gallery/deleteGallery",
  async (id: string, { rejectWithValue }) => {
    try {
      await delay(500);

      const index = mockGalleries.findIndex((g) => g.id === id);
      if (index === -1) {
        throw new Error("Gallery not found");
      }

      mockGalleries.splice(index, 1);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete gallery");
    }
  },
);

// Artwork async thunks with mock implementations
export const fetchArtworks = createAsyncThunk(
  "gallery/fetchArtworks",
  async (filters?: ArtworkFilters, { rejectWithValue }) => {
    try {
      await delay(500);

      let filteredArtworks = [...mockArtworks];

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredArtworks = filteredArtworks.filter(
          (artwork) =>
            artwork.title.toLowerCase().includes(searchLower) ||
            artwork.description.toLowerCase().includes(searchLower) ||
            artwork.artistName.toLowerCase().includes(searchLower) ||
            artwork.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
        );
      }

      if (filters?.galleryId) {
        filteredArtworks = filteredArtworks.filter(
          (artwork) => artwork.galleryId === filters.galleryId,
        );
      }

      if (filters?.artistId) {
        filteredArtworks = filteredArtworks.filter(
          (artwork) => artwork.artistId === filters.artistId,
        );
      }

      if (filters?.medium) {
        filteredArtworks = filteredArtworks.filter((artwork) =>
          artwork.medium.toLowerCase().includes(filters.medium!.toLowerCase()),
        );
      }

      if (filters?.minPrice !== undefined) {
        filteredArtworks = filteredArtworks.filter(
          (artwork) =>
            artwork.price !== undefined && artwork.price >= filters.minPrice!,
        );
      }

      if (filters?.maxPrice !== undefined) {
        filteredArtworks = filteredArtworks.filter(
          (artwork) =>
            artwork.price !== undefined && artwork.price <= filters.maxPrice!,
        );
      }

      if (filters?.isForSale !== undefined) {
        filteredArtworks = filteredArtworks.filter(
          (artwork) => artwork.isForSale === filters.isForSale,
        );
      }

      if (filters?.tags && filters.tags.length > 0) {
        filteredArtworks = filteredArtworks.filter((artwork) =>
          filters.tags!.some((tag) => artwork.tags.includes(tag)),
        );
      }

      // Sort artworks
      if (filters?.sortBy) {
        filteredArtworks.sort((a, b) => {
          const aVal = a[filters.sortBy!];
          const bVal = b[filters.sortBy!];
          const order = filters.sortOrder === "desc" ? -1 : 1;

          if (typeof aVal === "string" && typeof bVal === "string") {
            return aVal.localeCompare(bVal) * order;
          }
          return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * order;
        });
      }

      return filteredArtworks;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch artworks");
    }
  },
);

export const fetchArtworkById = createAsyncThunk(
  "gallery/fetchArtworkById",
  async (id: string, { rejectWithValue }) => {
    try {
      await delay(300);

      const artwork = mockArtworks.find((a) => a.id === id);
      if (!artwork) {
        throw new Error("Artwork not found");
      }

      return artwork;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch artwork");
    }
  },
);

export const createArtwork = createAsyncThunk(
  "gallery/createArtwork",
  async (data: CreateArtworkData, { rejectWithValue }) => {
    try {
      await delay(1500); // Longer delay for file upload simulation

      const newArtwork: Artwork = {
        id: (mockArtworks.length + 1).toString(),
        title: data.title,
        description: data.description,
        artistId: "1", // Current user ID
        artistName: "Current User",
        galleryId: data.galleryId,
        galleryName:
          mockGalleries.find((g) => g.id === data.galleryId)?.name ||
          "Unknown Gallery",
        imageUrl: `https://images.unsplash.com/photo-${Date.now()}?w=1200&h=800&fit=crop`,
        thumbnailUrl: `https://images.unsplash.com/photo-${Date.now()}?w=400&h=300&fit=crop`,
        medium: data.medium,
        dimensions: data.dimensions,
        year: data.year,
        price: data.price,
        isForSale: data.isForSale,
        tags: data.tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockArtworks.push(newArtwork);

      // Update gallery artwork count
      const gallery = mockGalleries.find((g) => g.id === data.galleryId);
      if (gallery) {
        gallery.artworkCount += 1;
      }

      return newArtwork;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create artwork");
    }
  },
);

export const updateArtwork = createAsyncThunk(
  "gallery/updateArtwork",
  async (
    { id, data }: { id: string; data: Partial<CreateArtworkData> },
    { rejectWithValue },
  ) => {
    try {
      await delay(800);

      const index = mockArtworks.findIndex((a) => a.id === id);
      if (index === -1) {
        throw new Error("Artwork not found");
      }

      const updatedArtwork = {
        ...mockArtworks[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };

      mockArtworks[index] = updatedArtwork;
      return updatedArtwork;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update artwork");
    }
  },
);

export const deleteArtwork = createAsyncThunk(
  "gallery/deleteArtwork",
  async (id: string, { rejectWithValue }) => {
    try {
      await delay(500);

      const index = mockArtworks.findIndex((a) => a.id === id);
      if (index === -1) {
        throw new Error("Artwork not found");
      }

      const artwork = mockArtworks[index];
      mockArtworks.splice(index, 1);

      // Update gallery artwork count
      const gallery = mockGalleries.find((g) => g.id === artwork.galleryId);
      if (gallery) {
        gallery.artworkCount = Math.max(0, gallery.artworkCount - 1);
      }

      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete artwork");
    }
  },
);

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setGalleryFilters: (state, action: PayloadAction<GalleryFilters>) => {
      state.filters.gallery = action.payload;
    },
    setArtworkFilters: (state, action: PayloadAction<ArtworkFilters>) => {
      state.filters.artwork = action.payload;
    },
    clearCurrentGallery: (state) => {
      state.currentGallery = null;
    },
    clearCurrentArtwork: (state) => {
      state.currentArtwork = null;
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
        state.galleries = action.payload;
      })
      .addCase(fetchGalleries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch gallery by ID
    builder.addCase(fetchGalleryById.fulfilled, (state, action) => {
      state.currentGallery = action.payload;
    });

    // Create gallery
    builder.addCase(createGallery.fulfilled, (state, action) => {
      state.galleries.push(action.payload);
    });

    // Update gallery
    builder.addCase(updateGallery.fulfilled, (state, action) => {
      const index = state.galleries.findIndex(
        (g) => g.id === action.payload.id,
      );
      if (index !== -1) {
        state.galleries[index] = action.payload;
      }
      if (state.currentGallery?.id === action.payload.id) {
        state.currentGallery = action.payload;
      }
    });

    // Delete gallery
    builder.addCase(deleteGallery.fulfilled, (state, action) => {
      state.galleries = state.galleries.filter((g) => g.id !== action.payload);
      if (state.currentGallery?.id === action.payload) {
        state.currentGallery = null;
      }
    });

    // Fetch artworks
    builder
      .addCase(fetchArtworks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchArtworks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.artworks = action.payload;
      })
      .addCase(fetchArtworks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch artwork by ID
    builder.addCase(fetchArtworkById.fulfilled, (state, action) => {
      state.currentArtwork = action.payload;
    });

    // Create artwork
    builder.addCase(createArtwork.fulfilled, (state, action) => {
      state.artworks.push(action.payload);
    });

    // Update artwork
    builder.addCase(updateArtwork.fulfilled, (state, action) => {
      const index = state.artworks.findIndex((a) => a.id === action.payload.id);
      if (index !== -1) {
        state.artworks[index] = action.payload;
      }
      if (state.currentArtwork?.id === action.payload.id) {
        state.currentArtwork = action.payload;
      }
    });

    // Delete artwork
    builder.addCase(deleteArtwork.fulfilled, (state, action) => {
      state.artworks = state.artworks.filter((a) => a.id !== action.payload);
      if (state.currentArtwork?.id === action.payload) {
        state.currentArtwork = null;
      }
    });
  },
});

export const {
  clearError,
  setGalleryFilters,
  setArtworkFilters,
  clearCurrentGallery,
  clearCurrentArtwork,
} = gallerySlice.actions;

export default gallerySlice.reducer;

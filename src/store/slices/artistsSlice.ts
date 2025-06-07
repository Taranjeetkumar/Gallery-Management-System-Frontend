import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface Artist {
  id: string;
  name: string;
  birthplace: string;
  age: number;
  style: string;
  bio?: string;
  avatar?: string;
  artworks?: any[]; // Optional, filled when viewing artist details
}

interface ArtistsState {
  artists: Artist[];
  selectedArtist: Artist | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ArtistsState = {
  artists: [],
  selectedArtist: null,
  isLoading: false,
  error: null,
};

// FETCH ALL
export const fetchArtists = createAsyncThunk(
  "artists/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      // TODO: INTEGRATE API HERE (fetch all artists)
      // const response = await apiService.get("/artists");
      // return response.data;
      return [];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// ADD
export const addArtist = createAsyncThunk(
  "artists/addArtist",
  async (artist: Omit<Artist, "id">, { rejectWithValue }) => {
    try {
      // TODO: INTEGRATE API HERE (add artist)
      // const response = await apiService.post("/artists", artist);
      // return response.data;
      return { ...artist, id: Date.now().toString() };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// UPDATE
export const updateArtist = createAsyncThunk(
  "artists/updateArtist",
  async (artist: Artist, { rejectWithValue }) => {
    try {
      // TODO: INTEGRATE API HERE (update artist)
      // const response = await apiService.put(`/artists/${artist.id}`, artist);
      // return response.data;
      return artist;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// DELETE
export const deleteArtist = createAsyncThunk(
  "artists/deleteArtist",
  async (id: string, { rejectWithValue }) => {
    try {
      // TODO: INTEGRATE API HERE (delete artist)
      // await apiService.delete(`/artists/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const artistsSlice = createSlice({
  name: "artists",
  initialState,
  reducers: {
    selectArtist(state, action: PayloadAction<Artist | null>) {
      state.selectedArtist = action.payload;
    },
    clearArtistsError(state) {
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchArtists.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchArtists.fulfilled, (state, action: PayloadAction<Artist[]>) => {
        state.isLoading = false;
        state.artists = action.payload;
      })
      .addCase(fetchArtists.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addArtist.fulfilled, (state, action: PayloadAction<Artist>) => {
        state.artists.push(action.payload);
        state.isLoading = false;
      })
      .addCase(updateArtist.fulfilled, (state, action: PayloadAction<Artist>) => {
        state.artists = state.artists.map(a => a.id === action.payload.id ? action.payload : a);
        state.isLoading = false;
      })
      .addCase(deleteArtist.fulfilled, (state, action: PayloadAction<string>) => {
        state.artists = state.artists.filter(a => a.id !== action.payload);
        state.isLoading = false;
      });
  }
});

export const { selectArtist, clearArtistsError } = artistsSlice.actions;
export default artistsSlice.reducer;

import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/user";
import { getCurrentUser } from "@/store/slices/authSlice";
// import { apiService } from "./api";

interface ProfileState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  user: null,
  isLoading: false,
  error: null,
};

// Async thunk for fetching the user profile
export const fetchUserProfile = createAsyncThunk(
  "profile/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
    
      const response = await getCurrentUser();
      return response;
        //   return apiService.get<User>("/auth/me");
      
    //   return null; // remove when integrated
    } catch (err: any) {
      return rejectWithValue(err.message || "Could not fetch profile");
    }
  }
);

// Async thunk for updating the user profile
export const updateUserProfile = createAsyncThunk(
  "profile/updateUserProfile",
  async (profileData: Partial<User>, { rejectWithValue }) => {
    try {
      // TODO: INTEGRATE API HERE for updating profile data
      // const response = await profileService.updateProfile(profileData);
      // return response.data;
      return profileData; // remove when integrated
    } catch (err: any) {
      return rejectWithValue(err.message || "Could not update profile");
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileError(state) {
      state.error = null;
    },
    setProfile(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserProfile.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || "Could not fetch profile";
      })
      .addCase(updateUserProfile.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = { ...state.user, ...action.payload } as User;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || "Could not update profile";
      });
  },
});

export const { clearProfileError, setProfile } = profileSlice.actions;
export default profileSlice.reducer;

import { authService } from "@/services/authService";
import type {
  AuthResponse,
  AuthState,
  LoginCredentials,
  SignupData,
  User,
} from "@/types/auth";
import {
  type PayloadAction,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { profileService } from "@/services/profileService";

interface AuthSliceState extends AuthState {
  error: string | null;
  loginError: string | null;
  signupError: string | null;
}

const initialState: AuthSliceState = {
  user: null,
  role:null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  loginError: null,
  signupError: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response:any = await authService.login(credentials);

      console.log('hfdgv ;;  ',response);
      // Set token in cookies
      Cookies.set("authToken", response?.data.token, {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });
      return response?.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

export const signupUser = createAsyncThunk(
  "auth/signup",
  async (signupData: SignupData, { rejectWithValue }) => {
    try {
      const response:any = await authService.signup(signupData);
      // Set token in cookies
      Cookies.set("authToken", response.token, {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });
      return response?.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      Cookies.remove("authToken");
    } catch (error: any) {
      // Even if API call fails, we should clear local auth
      Cookies.remove("authToken");
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  },
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser();
      return user;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get user",
      );
    }
  },
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response:any = await authService.refreshToken();
      Cookies.set("authToken", response.token, {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });
      return response?.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Token refresh failed",
      );
    }
  },
);

// Async thunk for updating the user profile
export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (profileData: Partial<User>, { rejectWithValue }) => {
    try {
      // TODO: INTEGRATE API HERE for updating profile data
      const response: any = await profileService.updateProfile(profileData);
      return response?.data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Could not update profile");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      Cookies.remove("authToken");
    },
    clearError: (state) => {
      state.error = null;
    },
    clearLoginError: (state) => {
      state.loginError = null;
    },
    clearSignupError: (state) => {
      state.signupError = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.loginError = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.isLoading = false;
          console.log('fsfdhh ; ',action.payload);
          state.user = action.payload.user;
          // state.role = action.payload.user.roles;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.loginError = null;
          state.signupError = null;
          state.error = null;
        },
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.loginError = action.payload as string;
        state.isAuthenticated = false;
      });

    // Signup
    builder
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.signupError = null;
      })
      .addCase(
        signupUser.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.isLoading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.loginError = null;
          state.signupError = null;
          state.error = null;
        },
      )
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.signupError = action.payload as string;
        state.isAuthenticated = false;
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        // Even if logout fails, clear the auth state
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      });

    // Get current user
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getCurrentUser.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.isLoading = false;
          state.user = action.payload;
          state.isAuthenticated = true;
          state.error = null;
        },
      )
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        // Clear auth on failed user fetch
        state.user = null;
        state.token = null;
        Cookies.remove("authToken");
      });

      builder
       .addCase(updateUserProfile.pending, (state) => {
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
              state.error = (action.payload as string) || "Could not update profile";
            });

    // Refresh token
    builder
      .addCase(
        refreshToken.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.error = null;
        },
      )
      .addCase(refreshToken.rejected, (state) => {
        // Clear auth on failed token refresh
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        Cookies.remove("authToken");
      });
  },
});

export const {
  clearAuth,
  clearError,
  clearLoginError,
  clearSignupError,
  setLoading,
  updateUser,
} = authSlice.actions;
export default authSlice.reducer;

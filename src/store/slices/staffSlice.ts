import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { staffService } from "@/services/staffService";

export interface Staff {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: "MANAGER" | "CURATOR" | "SALES" | "ASSISTANT" | "ADMIN";
  department: string;
  specializations: string[];
  isActive: boolean;
  hireDate: string;
  salary?: number;
  permissions: string[];
  avatar?: string;
  bio?: string;
  totalSales?: number;
  totalArtistsManaged?: number;
  createdAt: string;
  updatedAt: string;
}

export interface StaffFormData {
  name: string;
  email: string;
  phone?: string;
  role: Staff["role"];
  department: string;
  specializations: string[];
  permissions: string[];
  salary?: number;
  bio?: string;
}

interface StaffState {
  staff: Staff[];
  currentStaff: Staff | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  filters: {
    role: string;
    department: string;
    specializations: string[];
    isActive: boolean | null;
  };
  sortBy: "name" | "role" | "department" | "hireDate" | "totalSales";
  sortOrder: "asc" | "desc";
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: StaffState = {
  staff: [],
  currentStaff: null,
  isLoading: false,
  error: null,
  searchQuery: "",
  filters: {
    role: "",
    department: "",
    specializations: [],
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
export const fetchStaff = createAsyncThunk(
  "staff/fetchStaff",
  async (params: {
    page?: number;
    limit?: number;
    search?: string;
    filters?: Partial<StaffState["filters"]>;
    sortBy?: string;
    sortOrder?: string;
  }, { rejectWithValue }) => {
    try {
      return await staffService.getStaff(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch staff");
    }
  }
);

export const fetchStaffById = createAsyncThunk(
  "staff/fetchStaffById",
  async (id: number, { rejectWithValue }) => {
    try {
      return await staffService.getStaffById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch staff member");
    }
  }
);

export const createStaff = createAsyncThunk(
  "staff/createStaff",
  async (staffData: StaffFormData, { rejectWithValue }) => {
    try {
      return await staffService.createStaff(staffData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create staff member");
    }
  }
);

export const updateStaff = createAsyncThunk(
  "staff/updateStaff",
  async ({ id, data }: { id: number; data: Partial<StaffFormData> }, { rejectWithValue }) => {
    try {
      return await staffService.updateStaff(id, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update staff member");
    }
  }
);

export const deleteStaff = createAsyncThunk(
  "staff/deleteStaff",
  async (id: number, { rejectWithValue }) => {
    try {
      await staffService.deleteStaff(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete staff member");
    }
  }
);

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<StaffState["filters"]>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSorting: (state, action: PayloadAction<{ sortBy: StaffState["sortBy"]; sortOrder: StaffState["sortOrder"] }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    setPagination: (state, action: PayloadAction<Partial<StaffState["pagination"]>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearCurrentStaff: (state) => {
      state.currentStaff = null;
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
    // Fetch staff
    builder
      .addCase(fetchStaff.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.isLoading = false;
        state.staff = action.payload.staff;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch staff by ID
    builder
      .addCase(fetchStaffById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStaffById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentStaff = action.payload;
      })
      .addCase(fetchStaffById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create staff
    builder
      .addCase(createStaff.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createStaff.fulfilled, (state, action) => {
        state.isLoading = false;
        state.staff.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createStaff.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update staff
    builder
      .addCase(updateStaff.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateStaff.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.staff.findIndex(member => member.id === action.payload.id);
        if (index !== -1) {
          state.staff[index] = action.payload;
        }
        if (state.currentStaff?.id === action.payload.id) {
          state.currentStaff = action.payload;
        }
      })
      .addCase(updateStaff.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete staff
    builder
      .addCase(deleteStaff.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteStaff.fulfilled, (state, action) => {
        state.isLoading = false;
        state.staff = state.staff.filter(member => member.id !== action.payload);
        state.pagination.total -= 1;
        if (state.currentStaff?.id === action.payload) {
          state.currentStaff = null;
        }
      })
      .addCase(deleteStaff.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSearchQuery,
  setFilters,
  setSorting,
  setPagination,
  clearCurrentStaff,
  clearError,
  clearFilters,
} = staffSlice.actions;

export default staffSlice.reducer;

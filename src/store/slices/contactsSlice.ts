import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { contactService } from "@/services/contactService";

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  contactType: "CUSTOMER" | "VENDOR" | "ARTIST" | "PRESS" | "OTHER";
  notes?: string;
  tags: string[];
  isActive: boolean;
  lastContactDate?: string;
  totalPurchases?: number;
  totalSpent?: number;
  preferredMedium?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  contactType: Contact["contactType"];
  notes?: string;
  tags: string[];
  preferredMedium?: string;
}

interface ContactsState {
  contacts: Contact[];
  currentContact: Contact | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  filters: {
    contactType: string;
    city: string;
    state: string;
    country: string;
    isActive: boolean | null;
    tags: string[];
  };
  sortBy: "name" | "email" | "lastContactDate" | "totalSpent" | "createdAt";
  sortOrder: "asc" | "desc";
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: ContactsState = {
  contacts: [],
  currentContact: null,
  isLoading: false,
  error: null,
  searchQuery: "",
  filters: {
    contactType: "",
    city: "",
    state: "",
    country: "",
    isActive: null,
    tags: [],
  },
  sortBy: "createdAt",
  sortOrder: "desc",
  pagination: {
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks
export const fetchContacts = createAsyncThunk(
  "contacts/fetchContacts",
  async (params: {
    page?: number;
    limit?: number;
    search?: string;
    filters?: Partial<ContactsState["filters"]>;
    sortBy?: string;
    sortOrder?: string;
  }, { rejectWithValue }) => {
    try {
      return await contactService.getContacts(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch contacts");
    }
  }
);

export const fetchContactById = createAsyncThunk(
  "contacts/fetchContactById",
  async (id: number, { rejectWithValue }) => {
    try {
      return await contactService.getContactById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch contact");
    }
  }
);

export const createContact = createAsyncThunk(
  "contacts/createContact",
  async (contactData: ContactFormData, { rejectWithValue }) => {
    try {
      return await contactService.createContact(contactData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create contact");
    }
  }
);

export const updateContact = createAsyncThunk(
  "contacts/updateContact",
  async ({ id, data }: { id: number; data: Partial<ContactFormData> }, { rejectWithValue }) => {
    try {
      return await contactService.updateContact(id, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update contact");
    }
  }
);

export const deleteContact = createAsyncThunk(
  "contacts/deleteContact",
  async (id: number, { rejectWithValue }) => {
    try {
      await contactService.deleteContact(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete contact");
    }
  }
);

const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ContactsState["filters"]>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSorting: (state, action: PayloadAction<{ sortBy: ContactsState["sortBy"]; sortOrder: ContactsState["sortOrder"] }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    setPagination: (state, action: PayloadAction<Partial<ContactsState["pagination"]>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearCurrentContact: (state) => {
      state.currentContact = null;
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
    // Fetch contacts
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contacts = action.payload.contacts;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch contact by ID
    builder
      .addCase(fetchContactById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContactById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentContact = action.payload;
      })
      .addCase(fetchContactById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create contact
    builder
      .addCase(createContact.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contacts.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createContact.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update contact
    builder
      .addCase(updateContact.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.contacts.findIndex(contact => contact.id === action.payload.id);
        if (index !== -1) {
          state.contacts[index] = action.payload;
        }
        if (state.currentContact?.id === action.payload.id) {
          state.currentContact = action.payload;
        }
      })
      .addCase(updateContact.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete contact
    builder
      .addCase(deleteContact.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contacts = state.contacts.filter(contact => contact.id !== action.payload);
        state.pagination.total -= 1;
        if (state.currentContact?.id === action.payload) {
          state.currentContact = null;
        }
      })
      .addCase(deleteContact.rejected, (state, action) => {
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
  clearCurrentContact,
  clearError,
  clearFilters,
} = contactsSlice.actions;

export default contactsSlice.reducer;

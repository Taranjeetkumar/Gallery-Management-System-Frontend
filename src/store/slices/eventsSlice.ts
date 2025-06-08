import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { eventService } from "@/services/eventService";

export interface Event {
  id: number;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  venue: string;
  address?: string;
  eventType: "EXHIBITION" | "WORKSHOP" | "SALE" | "PRIVATE_VIEWING" | "AUCTION" | "OTHER";
  status: "PLANNED" | "ONGOING" | "COMPLETED" | "CANCELLED";
  maxAttendees?: number;
  currentAttendees: number;
  ticketPrice?: number;
  isPublic: boolean;
  featuredArtists: number[];
  featuredArtworks: number[];
  organizer: {
    id: number;
    name: string;
  };
  budget?: number;
  actualCost?: number;
  expectedRevenue?: number;
  actualRevenue?: number;
  roi?: number;
  marketingCost?: number;
  images: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EventFormData {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  venue: string;
  address?: string;
  eventType: Event["eventType"];
  maxAttendees?: number;
  ticketPrice?: number;
  isPublic: boolean;
  featuredArtists: number[];
  featuredArtworks: number[];
  budget?: number;
  expectedRevenue?: number;
  marketingCost?: number;
  tags: string[];
}

interface EventsState {
  events: Event[];
  currentEvent: Event | null;
  upcomingEvents: Event[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  filters: {
    eventType: string;
    status: string;
    venue: string;
    dateFrom: string;
    dateTo: string;
    isPublic: boolean | null;
  };
  sortBy: "title" | "startDate" | "currentAttendees" | "ticketPrice" | "roi";
  sortOrder: "asc" | "desc";
  viewMode: "list" | "calendar";
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: EventsState = {
  events: [],
  currentEvent: null,
  upcomingEvents: [],
  isLoading: false,
  error: null,
  searchQuery: "",
  filters: {
    eventType: "",
    status: "",
    venue: "",
    dateFrom: "",
    dateTo: "",
    isPublic: null,
  },
  sortBy: "startDate",
  sortOrder: "asc",
  viewMode: "list",
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks
export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (params: {
    page?: number;
    limit?: number;
    search?: string;
    filters?: Partial<EventsState["filters"]>;
    sortBy?: string;
    sortOrder?: string;
  }, { rejectWithValue }) => {
    try {
      return await eventService.getEvents(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch events");
    }
  }
);

export const fetchUpcomingEvents = createAsyncThunk(
  "events/fetchUpcomingEvents",
  async (limit = 5, { rejectWithValue }) => {
    try {
      return await eventService.getUpcomingEvents(limit);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch upcoming events");
    }
  }
);

export const fetchEventById = createAsyncThunk(
  "events/fetchEventById",
  async (id: number, { rejectWithValue }) => {
    try {
      return await eventService.getEventById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch event");
    }
  }
);

export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (eventData: EventFormData, { rejectWithValue }) => {
    try {
      return await eventService.createEvent(eventData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create event");
    }
  }
);

export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async ({ id, data }: { id: number; data: Partial<EventFormData> }, { rejectWithValue }) => {
    try {
      return await eventService.updateEvent(id, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update event");
    }
  }
);

export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (id: number, { rejectWithValue }) => {
    try {
      await eventService.deleteEvent(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete event");
    }
  }
);

export const updateEventCosts = createAsyncThunk(
  "events/updateEventCosts",
  async ({ id, actualCost, actualRevenue }: { id: number; actualCost?: number; actualRevenue?: number }, { rejectWithValue }) => {
    try {
      return await eventService.updateEventCosts(id, actualCost, actualRevenue);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update event costs");
    }
  }
);

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<EventsState["filters"]>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSorting: (state, action: PayloadAction<{ sortBy: EventsState["sortBy"]; sortOrder: EventsState["sortOrder"] }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    setViewMode: (state, action: PayloadAction<EventsState["viewMode"]>) => {
      state.viewMode = action.payload;
    },
    setPagination: (state, action: PayloadAction<Partial<EventsState["pagination"]>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
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
    // Fetch events
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload.events;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch upcoming events
    builder
      .addCase(fetchUpcomingEvents.fulfilled, (state, action) => {
        state.upcomingEvents = action.payload;
      });

    // Fetch event by ID
    builder
      .addCase(fetchEventById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create event
    builder
      .addCase(createEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update event
    builder
      .addCase(updateEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.events.findIndex(event => event.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
        if (state.currentEvent?.id === action.payload.id) {
          state.currentEvent = action.payload;
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete event
    builder
      .addCase(deleteEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = state.events.filter(event => event.id !== action.payload);
        state.pagination.total -= 1;
        if (state.currentEvent?.id === action.payload) {
          state.currentEvent = null;
        }
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update event costs
    builder
      .addCase(updateEventCosts.fulfilled, (state, action) => {
        const index = state.events.findIndex(event => event.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
        if (state.currentEvent?.id === action.payload.id) {
          state.currentEvent = action.payload;
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
  clearCurrentEvent,
  clearError,
  clearFilters,
} = eventsSlice.actions;

export default eventsSlice.reducer;

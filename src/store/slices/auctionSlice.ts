import { apiService } from "@/services/api";
import type {
  Auction,
  AuctionBidResponse,
  AuctionFilters,
  Bid,
  CreateAuctionData,
  LiveAuctionEvent,
  PlaceBidData,
} from "@/types/auction";
import {
  type PayloadAction,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

interface AuctionState {
  auctions: Auction[];
  liveAuctions: Auction[];
  currentAuction: Auction | null;
  bids: Bid[];
  userBids: Bid[];
  isLoading: boolean;
  error: string | null;
  filters: AuctionFilters;
  liveUpdates: LiveAuctionEvent[];
}

const initialState: AuctionState = {
  auctions: [],
  liveAuctions: [],
  currentAuction: null,
  bids: [],
  userBids: [],
  isLoading: false,
  error: null,
  filters: {},
  liveUpdates: [],
};

// Async thunks for auction operations
export const fetchAuctions = createAsyncThunk(
  "auction/fetchAuctions",
  async (filters: AuctionFilters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      }

      // API INTEGRATION POINT:
      // GET /api/auctions?{queryParams}
      // Expected response: { auctions: Auction[], total: number, page: number, limit: number }
      const response = await apiService.get<{
        auctions: Auction[];
        total: number;
      }>(`/auctions?${queryParams.toString()}`);
      return response.auctions;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as any)?.response?.data?.message || "Failed to fetch auctions",
      );
    }
  },
);

export const fetchLiveAuctions = createAsyncThunk(
  "auction/fetchLiveAuctions",
  async (_, { rejectWithValue }) => {
    try {
      // API INTEGRATION POINT:
      // GET /api/auctions/live
      // Expected response: Auction[]
      const auctions = await apiService.get<Auction[]>("/auctions/live");
      return auctions;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as any)?.response?.data?.message ||
          "Failed to fetch live auctions",
      );
    }
  },
);

export const fetchAuctionById = createAsyncThunk(
  "auction/fetchAuctionById",
  async (id: string, { rejectWithValue }) => {
    try {
      // API INTEGRATION POINT:
      // GET /api/auctions/{id}
      // Expected response: Auction
      const auction = await apiService.get<Auction>(`/auctions/${id}`);
      return auction;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as any)?.response?.data?.message || "Failed to fetch auction",
      );
    }
  },
);

export const createAuction = createAsyncThunk(
  "auction/createAuction",
  async (data: CreateAuctionData, { rejectWithValue }) => {
    try {
      // API INTEGRATION POINT:
      // POST /api/auctions
      // Body: CreateAuctionData
      // Expected response: Auction
      const auction = await apiService.post<Auction>("/auctions", data);
      return auction;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as any)?.response?.data?.message || "Failed to create auction",
      );
    }
  },
);

export const placeBid = createAsyncThunk(
  "auction/placeBid",
  async (data: PlaceBidData, { rejectWithValue }) => {
    try {
      // API INTEGRATION POINT:
      // POST /api/auctions/{auctionId}/bids
      // Body: { amount: number }
      // Expected response: AuctionBidResponse
      const response = await apiService.post<AuctionBidResponse>(
        `/auctions/${data.auctionId}/bids`,
        {
          amount: data.amount,
        },
      );
      return response;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as any)?.response?.data?.message || "Failed to place bid",
      );
    }
  },
);

export const fetchAuctionBids = createAsyncThunk(
  "auction/fetchAuctionBids",
  async (auctionId: string, { rejectWithValue }) => {
    try {
      // API INTEGRATION POINT:
      // GET /api/auctions/{auctionId}/bids
      // Expected response: Bid[]
      const bids = await apiService.get<Bid[]>(`/auctions/${auctionId}/bids`);
      return bids;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as any)?.response?.data?.message || "Failed to fetch bids",
      );
    }
  },
);

export const fetchUserBids = createAsyncThunk(
  "auction/fetchUserBids",
  async (_, { rejectWithValue }) => {
    try {
      // API INTEGRATION POINT:
      // GET /api/users/me/bids
      // Expected response: Bid[]
      const bids = await apiService.get<Bid[]>("/users/me/bids");
      return bids;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as any)?.response?.data?.message || "Failed to fetch user bids",
      );
    }
  },
);

export const startAuction = createAsyncThunk(
  "auction/startAuction",
  async (auctionId: string, { rejectWithValue }) => {
    try {
      // API INTEGRATION POINT:
      // POST /api/auctions/{auctionId}/start
      // Expected response: Auction
      const auction = await apiService.post<Auction>(
        `/auctions/${auctionId}/start`,
      );
      return auction;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as any)?.response?.data?.message || "Failed to start auction",
      );
    }
  },
);

export const endAuction = createAsyncThunk(
  "auction/endAuction",
  async (auctionId: string, { rejectWithValue }) => {
    try {
      // API INTEGRATION POINT:
      // POST /api/auctions/{auctionId}/end
      // Expected response: Auction
      const auction = await apiService.post<Auction>(
        `/auctions/${auctionId}/end`,
      );
      return auction;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as any)?.response?.data?.message || "Failed to end auction",
      );
    }
  },
);

const auctionSlice = createSlice({
  name: "auction",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<AuctionFilters>) => {
      state.filters = action.payload;
    },
    clearCurrentAuction: (state) => {
      state.currentAuction = null;
    },
    addLiveUpdate: (state, action: PayloadAction<LiveAuctionEvent>) => {
      state.liveUpdates.push(action.payload);
      // Keep only last 100 updates to prevent memory issues
      if (state.liveUpdates.length > 100) {
        state.liveUpdates.shift();
      }
    },
    updateAuctionFromLive: (
      state,
      action: PayloadAction<{ auctionId: string; updates: Partial<Auction> }>,
    ) => {
      const { auctionId, updates } = action.payload;

      // Update in auctions list
      const auctionIndex = state.auctions.findIndex((a) => a.id === auctionId);
      if (auctionIndex !== -1) {
        state.auctions[auctionIndex] = {
          ...state.auctions[auctionIndex],
          ...updates,
        };
      }

      // Update in live auctions
      const liveIndex = state.liveAuctions.findIndex((a) => a.id === auctionId);
      if (liveIndex !== -1) {
        state.liveAuctions[liveIndex] = {
          ...state.liveAuctions[liveIndex],
          ...updates,
        };
      }

      // Update current auction if it matches
      if (state.currentAuction?.id === auctionId) {
        state.currentAuction = { ...state.currentAuction, ...updates };
      }
    },
    addNewBid: (state, action: PayloadAction<Bid>) => {
      const newBid = action.payload;
      state.bids.unshift(newBid);

      // Update auction's current bid
      const updateAuction = (auction: Auction) => {
        if (auction.id === newBid.auctionId) {
          auction.currentBid = newBid.amount;
          auction.bidCount += 1;
          auction.highestBidderId = newBid.bidderId;
          auction.highestBidderName = newBid.bidderName;
        }
      };

      state.auctions.forEach(updateAuction);
      state.liveAuctions.forEach(updateAuction);
      if (state.currentAuction) {
        updateAuction(state.currentAuction);
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch auctions
    builder
      .addCase(fetchAuctions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAuctions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.auctions = action.payload;
      })
      .addCase(fetchAuctions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch live auctions
    builder.addCase(fetchLiveAuctions.fulfilled, (state, action) => {
      state.liveAuctions = action.payload;
    });

    // Fetch auction by ID
    builder.addCase(fetchAuctionById.fulfilled, (state, action) => {
      state.currentAuction = action.payload;
    });

    // Create auction
    builder.addCase(createAuction.fulfilled, (state, action) => {
      state.auctions.unshift(action.payload);
    });

    // Place bid
    builder
      .addCase(placeBid.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(placeBid.fulfilled, (state, action) => {
        state.isLoading = false;
        const { bid, auction } = action.payload;

        // Add to bids
        state.bids.unshift(bid);

        // Update auction
        const updateAuction = (a: Auction) => {
          if (a.id === auction.id) {
            Object.assign(a, auction);
          }
        };

        state.auctions.forEach(updateAuction);
        state.liveAuctions.forEach(updateAuction);
        if (state.currentAuction?.id === auction.id) {
          state.currentAuction = auction;
        }
      })
      .addCase(placeBid.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch auction bids
    builder.addCase(fetchAuctionBids.fulfilled, (state, action) => {
      state.bids = action.payload;
    });

    // Fetch user bids
    builder.addCase(fetchUserBids.fulfilled, (state, action) => {
      state.userBids = action.payload;
    });

    // Start auction
    builder.addCase(startAuction.fulfilled, (state, action) => {
      const updatedAuction = action.payload;

      // Move to live auctions
      const auctionIndex = state.auctions.findIndex(
        (a) => a.id === updatedAuction.id,
      );
      if (auctionIndex !== -1) {
        state.auctions[auctionIndex] = updatedAuction;
        state.liveAuctions.push(updatedAuction);
      }

      if (state.currentAuction?.id === updatedAuction.id) {
        state.currentAuction = updatedAuction;
      }
    });

    // End auction
    builder.addCase(endAuction.fulfilled, (state, action) => {
      const endedAuction = action.payload;

      // Remove from live auctions
      state.liveAuctions = state.liveAuctions.filter(
        (a) => a.id !== endedAuction.id,
      );

      // Update in all auctions
      const auctionIndex = state.auctions.findIndex(
        (a) => a.id === endedAuction.id,
      );
      if (auctionIndex !== -1) {
        state.auctions[auctionIndex] = endedAuction;
      }

      if (state.currentAuction?.id === endedAuction.id) {
        state.currentAuction = endedAuction;
      }
    });
  },
});

export const {
  clearError,
  setFilters,
  clearCurrentAuction,
  addLiveUpdate,
  updateAuctionFromLive,
  addNewBid,
} = auctionSlice.actions;

export default auctionSlice.reducer;

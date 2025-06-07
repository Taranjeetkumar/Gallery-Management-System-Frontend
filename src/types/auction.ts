export interface Auction {
  id: string;
  title: string;
  description: string;
  artworkId: string;
  artworkTitle: string;
  artworkImageUrl: string;
  artistId: string;
  artistName: string;
  startingBid: number;
  currentBid: number;
  reservePrice?: number;
  startTime: string;
  endTime: string;
  status: AuctionStatus;
  bidCount: number;
  highestBidderId?: string;
  highestBidderName?: string;
  isLive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum AuctionStatus {
  SCHEDULED = "SCHEDULED",
  LIVE = "LIVE",
  ENDED = "ENDED",
  CANCELLED = "CANCELLED",
}

export interface Bid {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  timestamp: string;
  isWinning: boolean;
}

export interface CreateAuctionData {
  title: string;
  description: string;
  artworkId: string;
  startingBid: number;
  reservePrice?: number;
  startTime: string;
  endTime: string;
}

export interface PlaceBidData {
  auctionId: string;
  amount: number;
}

export interface AuctionFilters {
  status?: AuctionStatus;
  artistId?: string;
  minBid?: number;
  maxBid?: number;
  isLive?: boolean;
  startDate?: string;
  endDate?: string;
  sortBy?: "startTime" | "endTime" | "currentBid" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface LiveAuctionEvent {
  type: "bid_placed" | "auction_started" | "auction_ended" | "time_update";
  auctionId: string;
  data: {
    bid?: Bid;
    auction?: Partial<Auction>;
    timeRemaining?: number;
  };
}

// API Response types for auction endpoints
export interface AuctionBidResponse {
  success: boolean;
  bid: Bid;
  auction: Auction;
  message: string;
}

export interface AuctionListResponse {
  auctions: Auction[];
  total: number;
  page: number;
  limit: number;
}

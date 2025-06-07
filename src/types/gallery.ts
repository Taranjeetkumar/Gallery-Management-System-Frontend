export interface Gallery {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  ownerId: string;
  ownerName: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  artworkCount: number;
}

export interface Artwork {
  id: string;
  title: string;
  description: string;
  artistId: string;
  artistName: string;
  galleryId: string;
  galleryName: string;
  imageUrl: string;
  thumbnailUrl?: string;
  medium: string;
  dimensions: string;
  year: number;
  price?: number;
  isForSale: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateGalleryData {
  name: string;
  description: string;
  isPublic: boolean;
  coverImage?: File;
}

export interface CreateArtworkData {
  title: string;
  description: string;
  galleryId: string;
  medium: string;
  dimensions: string;
  year: number;
  price?: number;
  isForSale: boolean;
  tags: string[];
  image: File;
}

export interface GalleryFilters {
  search?: string;
  ownerId?: string;
  isPublic?: boolean;
  sortBy?: "name" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

export interface ArtworkFilters {
  search?: string;
  galleryId?: string;
  artistId?: string;
  medium?: string;
  minPrice?: number;
  maxPrice?: number;
  isForSale?: boolean;
  tags?: string[];
  sortBy?: "title" | "year" | "price" | "createdAt";
  sortOrder?: "asc" | "desc";
}

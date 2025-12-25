// src/server/models/Brand.ts
export interface Brand {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
  // Omitting related entities to avoid circular dependencies
  // products?: Product[];
}

export interface CreateBrandInput {
  name: string;
  description?: string;
  logo?: string;
  website?: string;
}

export interface UpdateBrandInput {
  name?: string;
  description?: string;
  logo?: string;
  website?: string;
}
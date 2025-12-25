// src/server/models/Category.ts
export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
  // Omitting related entities to avoid circular dependencies
  // parent?: Category;
  // children?: Category[];
  // products?: Product[];
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  parentId?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
  parentId?: string;
}
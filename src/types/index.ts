export interface ApiResponse<T> {
  success: boolean;
  data: T;
  requestId?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    fields?: { path: string; message: string }[];
  };
  requestId?: string;
}

export interface Category {
  id: string;         
  name: string;
  slug: string;
  parentId?: string | null;
  children?: Category[];
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: string; 
  stock: number;
  rating: string; 
  soldCount: number;
  
  discountPercent: number;
  
  bulkMinQty: number | null;
  
  bulkDiscountPercent: number | null;
  
  condition?: string;
  isActive: boolean;
  createdAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  seller: {
    id: string;
    storeName: string;
    rating: string;
    status: string;
  };
  images: Array<{
    url: string;
    isPrimary: boolean;
    sortOrder: number;
  }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductAttribute {
  id: string;
  attrKey: string;
  attrValue: string;
}

export interface ProductDetailSeller {
  id: string;
  storeName: string;
  rating: string;
  status: string;
  logoUrl: string | null;
  description: string | null;
  address: string | null;
  vacationMode: boolean;
  createdAt: string;
  following: boolean;
  _count?: { products: number; followers: number };
}

export interface ProductDetail extends Omit<Product, 'seller'> {
  description: string | null;
  attributes: ProductAttribute[];
  reviewCount: number;
  seller: ProductDetailSeller;
  _count?: { reviews: number };
}

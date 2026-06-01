export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface Category {
  id: string;
  slug: string;
  name_es: string;
  name_en: string;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  product_count?: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  is_video: boolean;
}

export interface Product {
  id: string;
  name_es: string;
  name_en: string;
  description_es: string | null;
  description_en: string | null;
  category_id: string | null;
  category: {
    id: string;
    slug: string;
    name_es: string;
    name_en: string;
  } | null;
  retail_price: number;
  wholesale_price?: number;
  pot_size: string | null;
  stock_status: StockStatus;
  promotion_text: string | null;
  is_featured: boolean;
  is_active: boolean;
  images: ProductImage[];
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ListResponse<T> {
  data: T[];
  pagination?: Pagination;
}

export interface CartItem {
  product_id: string;
  name_es: string;
  name_en: string;
  pot_size: string | null;
  retail_price: number;
  wholesale_price?: number;
  image_url?: string | null;
  qty: number;
}

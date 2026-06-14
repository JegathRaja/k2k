export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  image: string | null;
  image_url?: string | null;
  products_count?: number;
  children?: Category[];
}

export enum ProductStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  PUBLISHED = 'PUBLISHED',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  ARCHIVED = 'ARCHIVED',
  DISABLED = 'DISABLED',
}

export enum StockStatus {
  IN_STOCK = 'IN_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  PREORDER = 'PREORDER',
}

export interface Product {
  id: string;
  seller_id: string;
  category_id: string;
  name: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  price: number;
  sale_price: number | null;
  weight_unit: string;
  minimum_order_quantity: number;
  maximum_order_quantity: number | null;
  available_quantity: number;
  reserved_quantity: number;
  stock_status: StockStatus;
  product_status: ProductStatus;
  is_featured: boolean;
  is_popular: boolean;
  origin_location: string | null;
  freshness_hours: number | null;
  view_count: number;
  meta_title?: string;
  meta_description?: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  seller?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  images: Array<{
    id: string;
    image_url: string;
    image_order: number;
    is_primary: boolean;
  }>;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

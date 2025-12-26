export interface DashboardSummary {
  products: {
    total: number;
    active: number;
    inactive: number;
    new_this_month: number;
  };
  brands: {
    total: number;
    active: number;
    inactive: number;
  };
  categories: {
    total: number;
    active: number;
    inactive: number;
  };
  orders: {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    returned: number;
    this_month: number;
  };
  users: {
    total: number;
    new_this_month: number;
    verified: number;
  };
  revenue: {
    total: number;
    this_month: number;
    average_order_value: number;
  };
  campaigns: {
    total: number;
    active: number;
  };
  coupons: {
    total: number;
    active: number;
  };
  stores: {
    total: number;
    active: number;
  };
  banners: {
    total: number;
    active: number;
  };
}

export interface SalesAnalytics {
  period: string;
  total_sales: number;
  total_orders: number;
  average_order_value: number;
  data: Array<{
    date: string;
    sales: number;
    orders: number;
  }>;
}

export interface OrderAnalytics {
  period: string;
  total_orders: number;
  by_status: {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    returned: number;
  };
  data: Array<{
    date: string;
    orders: number;
    status_breakdown: {
      pending: number;
      processing: number;
      shipped: number;
      delivered: number;
      cancelled: number;
      returned: number;
    };
  }>;
}

export interface ProductAnalytics {
  top_selling: Array<{
    product_id: string;
    name: string;
    total_sold: number;
    revenue: number;
  }>;
  low_stock: Array<{
    product_id: string;
    name: string;
    sku: string;
    quantity: number;
  }>;
  by_category: Array<{
    category_id: string;
    category_name: string;
    count: number;
    total_sales: number;
  }>;
}

export interface AnalyticsQuery {
  start_date?: Date;
  end_date?: Date;
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

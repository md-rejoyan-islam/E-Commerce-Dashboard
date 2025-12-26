import { Document } from 'mongoose';

export type DiscountType = 'percentage' | 'fixed_amount';

export interface IOffer extends Document {
  _id: string;
  name: string;
  description: string;
  image: string;
  start_date: Date;
  end_date: Date;
  discount_type: DiscountType;
  discount_value: number;
  applicable_products: string[];
  free_shipping: boolean;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

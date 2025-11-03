import { Document } from 'mongoose';

export type DiscountType = 'percentage' | 'fixed_amount';

export interface ICoupon extends Document {
  _id: string;
  name: string;
  description: string;
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  usage_limit_per_user: number;
  total_usage_limit: number;
  expiration_date: Date;
  minimum_purchase_amount: number;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

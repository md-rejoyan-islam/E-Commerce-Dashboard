import { Document } from 'mongoose';

export type DiscountType = 'percentage' | 'fixed_amount';

export interface IAppliesTo {
  all_products: boolean;
  productsIds?: string[];
  categoryIds?: string[];
  brandIds?: string[];
}

export interface ICampaign extends Document {
  _id: string;
  name: string;
  description: string;
  image: string;
  start_date: Date;
  end_date: Date;
  discount_type: DiscountType;
  discount_value: number;
  applies_to: IAppliesTo;
  minimum_purchase_amount: number;
  free_shipping: boolean;
  usage_limit: number;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

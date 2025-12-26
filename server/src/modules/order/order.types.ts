import { Document } from 'mongoose';

export type PaymentMethod =
  | 'bkash'
  | 'rocket'
  | 'nagad'
  | 'credit_card'
  | 'debit_card'
  | 'cash_on_delivery';

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type RefundStatus = 'pending' | 'processed' | 'failed';

export interface IOrderItem {
  product_id: string;
  quantity: number;
  price: number;
}

export interface IShippingAddress {
  street: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

export interface IOrder extends Document {
  _id: string;
  id: number;
  user_id: string;
  coupon?: string;
  order_items: IOrderItem[];
  total_amount: number;
  payment_method: PaymentMethod;
  order_status: OrderStatus;
  transaction_id: string;
  shipped_date?: Date;
  delivered_date?: Date;
  cancellation_date?: Date;
  cancellation_reason?: string;
  return_reason?: string;
  is_returned: boolean;
  return_date?: Date;
  refund_amount?: number;
  refund_status?: RefundStatus;
  tracking_number?: string;
  is_active: boolean;
  shipping_address: IShippingAddress;
  createdAt: Date;
  updatedAt: Date;
}

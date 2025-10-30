import mongoose from 'mongoose';
import { ICart, ICartItem } from './cart.types';

const CartItemSchema = new mongoose.Schema<ICartItem>(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

const CartSchema = new mongoose.Schema<ICart>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
      unique: true,
    },
    items: [CartItemSchema],
  },
  {
    timestamps: true,
  },
);

// Indexes
CartSchema.index({ user: 1 });
CartSchema.index({ 'items.product': 1 });

const CartModel = mongoose.model<ICart>('Cart', CartSchema);

export default CartModel;

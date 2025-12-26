import mongoose from 'mongoose';

export interface IWishlistItem {
  _id?: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  timestamp?: Date;
}

export interface IWishlist {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: IWishlistItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

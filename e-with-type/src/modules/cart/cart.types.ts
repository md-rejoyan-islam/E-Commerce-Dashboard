import mongoose from 'mongoose';

export interface ICartItem {
  _id?: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICart {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

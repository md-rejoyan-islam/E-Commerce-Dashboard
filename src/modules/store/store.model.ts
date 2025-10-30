import { Schema, model } from 'mongoose';
import { IStore } from './store.types';

const StoreSchema = new Schema<IStore>(
  {
    image: {
      type: String,
      required: [true, 'Store image is required'],
    },
    name: {
      type: String,
      required: [true, 'Store name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Store description is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    division: {
      type: String,
      required: [true, 'Division is required'],
      trim: true,
    },
    zip_code: {
      type: String,
      required: [true, 'Zip code is required'],
      trim: true,
    },
    map_location: {
      type: String,
      required: [true, 'Map location is required'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    working_hours: {
      type: String,
      required: [true, 'Working hours is required'],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for better query performance
StoreSchema.index({ name: 1 });
StoreSchema.index({ is_active: 1 });
StoreSchema.index({ city: 1, country: 1 });

const StoreModel = model<IStore>('Store', StoreSchema);

export default StoreModel;

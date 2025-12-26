import { Schema, model } from 'mongoose';
import { IBanner } from './banner.types';

const BannerSchema = new Schema<IBanner>(
  {
    title: {
      type: String,
      required: [true, 'Banner title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Banner description is required'],
    },
    image: {
      type: String,
      required: [true, 'Banner image is required'],
    },
    link: {
      type: String,
      required: [true, 'Banner link is required'],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      enum: {
        values: ['popup', 'slider', 'static'],
        message: '{VALUE} is not a valid banner type',
      },
      required: [true, 'Banner type is required'],
    },
    start_date: {
      type: Date,
    },
    end_date: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for better query performance
BannerSchema.index({ type: 1 });
BannerSchema.index({ is_active: 1 });
BannerSchema.index({ type: 1, is_active: 1 });

const BannerModel = model<IBanner>('Banner', BannerSchema);

export default BannerModel;

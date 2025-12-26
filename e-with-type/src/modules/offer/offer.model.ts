import { Schema, model } from 'mongoose';
import { IOffer } from './offer.types';

const OfferSchema = new Schema<IOffer>(
  {
    name: {
      type: String,
      required: [true, 'Offer name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Offer description is required'],
    },
    image: {
      type: String,
      required: [true, 'Offer image is required'],
    },
    start_date: {
      type: Date,
      required: [true, 'Offer start date is required'],
    },
    end_date: {
      type: Date,
      required: [true, 'Offer end date is required'],
    },
    discount_type: {
      type: String,
      enum: {
        values: ['percentage', 'fixed_amount'],
        message: '{VALUE} is not a valid discount type',
      },
      required: [true, 'Discount type is required'],
    },
    discount_value: {
      type: Number,
      required: [true, 'Discount value is required'],
      min: [0, 'Discount value must be greater than or equal to 0'],
    },
    applicable_products: {
      type: [String],
      default: [],
    },
    free_shipping: {
      type: Boolean,
      default: false,
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
OfferSchema.index({ is_active: 1 });
OfferSchema.index({ start_date: 1, end_date: 1 });
OfferSchema.index({ discount_type: 1 });

const OfferModel = model<IOffer>('Offer', OfferSchema);

export default OfferModel;
